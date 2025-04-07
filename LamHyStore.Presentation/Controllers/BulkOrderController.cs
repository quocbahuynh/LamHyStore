using Microsoft.AspNetCore.Authorization;
using AutoMapper;
using LamHyStore.Contracts;
using LamHyStore.Entities.Models;
using LamHyStore.Contracts;
using LamHyStore.Shared.RequestModel;
using LamHyStore.GoogleSheetService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Repositorys;
using LamHyStore.Shared.DataTransferObjects;

namespace LamHyStore.Presentation.Controllers
{
    [Route("api/bulk-order")]
    [Authorize]
    [ApiController]
    public class BulkOrderController : ControllerBase
    {
        private readonly ILoggerManager _logger;
        private readonly IMapper _mapper;
        private readonly RepositoryContext _repositoryContext;
        private readonly IKioVietAPI _kioVietApi;
        private readonly IGoogleSheetsService _googleSheetsService;

        public BulkOrderController(
            ILoggerManager logger,
            IMapper mapper,
            IKioVietAPI kioVietApi,
            RepositoryContext repositoryContext,
            IGoogleSheetsService googleSheetsService)
        {
            _logger = logger;
            _mapper = mapper;
            _kioVietApi = kioVietApi;
            _repositoryContext = repositoryContext;
            _googleSheetsService = googleSheetsService;
        }

        [AllowAnonymous]
        [HttpGet("test-connection")]
        public IActionResult TestConnection()
        {
            bool isConnected = _googleSheetsService.TestConnection();
            return isConnected ? Ok("Connected to Google Sheets.") : StatusCode(500, "Failed to connect.");
        }


        [HttpPost]
        public async Task<IActionResult> AddBulkOrder([FromBody] BulkOrderForCreationDto request)
        {
            if (request == null)
            {
                return BadRequest("Invalid data.");
            }

            var bulkOrder = _mapper.Map<GomOrder>(request);
            bulkOrder.Id = Guid.NewGuid();
            bulkOrder.Slug = GenerateSlug();

            await _repositoryContext.GomOrders.AddAsync(bulkOrder);
            await _repositoryContext.SaveChangesAsync();

            var tabSheetName = bulkOrder.Name + " - " + bulkOrder.Slug;
            _googleSheetsService.CreateSheet(tabSheetName, bulkOrder.Slug);

            return CreatedAtAction(nameof(GetBulkOrderById), new { id = bulkOrder.Id }, bulkOrder);
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetAllBulkOrders()
        {
            var bulkOrders = await _repositoryContext.GomOrders.ToListAsync();

            return Ok(bulkOrders);
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBulkOrderById(Guid id)
        {
            var bulkOrder = await _repositoryContext.GomOrders.FirstOrDefaultAsync(order => order.Id == id);

            if (bulkOrder == null)
            {
                return NotFound("Order not found.");
            }

            return Ok(bulkOrder);
        }

        [AllowAnonymous]
        [HttpGet("slug/{slug}")]
        public async Task<IActionResult> GetBulkOrderBySlug(string slug)
        {
            var bulkOrder = await _repositoryContext.GomOrders.FirstOrDefaultAsync(order => order.Slug == slug);

            if (bulkOrder == null)
            {
                return NotFound("Order not found.");
            }

            return Ok(bulkOrder);
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBulkOrder(Guid id)
        {
            var bulkOrder = await _repositoryContext.GomOrders.FindAsync(id);


            if (bulkOrder == null)
            {
                return NotFound("Order not found.");
            }

            _repositoryContext.GomOrders.Remove(bulkOrder);
            await _repositoryContext.SaveChangesAsync();
            _googleSheetsService.DeleteSheet(bulkOrder.Slug);

            return NoContent();
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateBulkOrder(string id, [FromBody] BulkOrderForUpdateDto request)
        {
            // Retrieve the BulkOrder entity by ID
            if (request == null)
            {
                return BadRequest("The request object cannot be null.");
            }

            // Find the BulkOrder entity by ID
            var bulkOrder = await _repositoryContext.GomOrders.FindAsync(new Guid(id));

            // Check if GomOrder exists
            if (bulkOrder == null)
            {
                return NotFound(); // Return 404 if the BulkOrder is not found
            }

            // Update the name if provided
            if (!string.IsNullOrEmpty(request.Name))
            {
                bulkOrder.Name = request.Name;
            }

            if (!string.IsNullOrEmpty(request.StartDate))
            {
                bulkOrder.StartDate = request.StartDate;
            }

            if (!string.IsNullOrEmpty(request.EndDate))
            {
                bulkOrder.EndDate = request.EndDate;
            }

            // Handle addition of productExternalIds
            if (request.AddProductExternalIds != null && request.AddProductExternalIds.Any())
            {
                bulkOrder.productExternalIds ??= new List<string>();

                foreach (var productId in request.AddProductExternalIds)
                {
                    if (!bulkOrder.productExternalIds.Contains(productId))
                    {
                        bulkOrder.productExternalIds.Add(productId);
                    }
                }
            }

            // Handle removal of productExternalIds
            if (request.RemoveProductExternalIds != null && request.RemoveProductExternalIds.Any())
            {
                bulkOrder.productExternalIds ??= new List<string>();

                bulkOrder.productExternalIds = bulkOrder.productExternalIds
                    .Where(id => !request.RemoveProductExternalIds.Contains(id))
                    .ToList();
            }

            // Update the entity in the database
            _repositoryContext.GomOrders.Update(bulkOrder);
            await _repositoryContext.SaveChangesAsync();

            // Return the updated entity
            return Ok(bulkOrder);
        }

        [HttpPost("add-order-to-sheet")]
        public async Task<IActionResult> AddOrderToSheetByKeyword([FromQuery] Guid id, [FromBody] BulkOrderSheetOrder order)
        {

            var bulkOrder = await _repositoryContext.GomOrders.FindAsync(id);
            var existingUserKiotViet = await _kioVietApi.FindCustomerByPhoneNumberAsync(order.PhoneNumber);

            if (bulkOrder == null)
            {
                return NotFound("Order not found.");
            }

            if (order == null)
            {
                return BadRequest("Invalid order data.");
            }


            try
            {

                bool success = _googleSheetsService.AddOrderByKeyword(bulkOrder.Slug, order);
                if (success)
                {
                    if (existingUserKiotViet == null)
                    {

                        var createdkioVietCustomerPayLoad = new CreateCustomerPayload
                        {
                            Name = order.Name,
                            ContactNumber = order.PhoneNumber,
                            Email = null,
                            Comments = "Từ website",
                            BranchId = 44544,
                            GroupIds = new List<int> { 220195 }
                        };

                        await _kioVietApi.CreatedCustomerByAsync(createdkioVietCustomerPayLoad);

                    }

                    CODOrderKioVietPayload payload = new CODOrderKioVietPayload
                    {
                        Method = "Card",
                        Description = "Gom Order - " + order.Name,
                        OrderDelivery = new Shared.DataTransferObjects.OrderDelivery
                        {
                            Address = order.DeliveryAddress,
                            Receiver = order.Name,
                            ContactNumber = order.PhoneNumber
                        },

                        TotalPayment = order.TotalPayment,
                        BranchId = 44544,
                        orderDetails = order.OrderDetails.Select(item => new OrderDetailsKiotViet
                        {
                            ProductId = item.ProductId,
                            ProductCode = item.ProductCode,
                            Quantity = item.Quantity,
                            Price = item.Price
                        }).ToList()
                    };

                    if (existingUserKiotViet == null)
                    {

                        var createdkioVietCustomerPayLoad = new CreateCustomerPayload
                        {
                            Name = order.Name,
                            ContactNumber = order.PhoneNumber,
                            Email = null,
                            Comments = "Từ website",
                            BranchId = 44544,
                            GroupIds = new List<int> { 220195 }
                        };

                        await _kioVietApi.CreatedCustomerByAsync(createdkioVietCustomerPayLoad);

                    }
                    else {
                        payload.Customer = new Customer
                        {
                            Id = existingUserKiotViet.Id,
                            ContactNumber = existingUserKiotViet.ContactNumber,
                            Code = existingUserKiotViet.Code
                        };
                    }

                    if(order.PaymentMethod == "COD") {
                        payload.Method = "Cash";
                    }

                    // Save order to database
                    var rs = await _kioVietApi.CreateCODOrderAsync(payload);

                    return Ok(new { message = "Order added successfully." });
                }
                else
                {
                    return StatusCode(500, "Failed to add order.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }



        private static string GenerateSlug(int length = 6)
        {
            const string characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var random = new Random();
            return new string(Enumerable.Repeat(characters, length)
                                        .Select(s => s[random.Next(s.Length)]).ToArray());
        }

    }
}
