using Microsoft.AspNetCore.Authorization;
using System.Text;
using AutoMapper;
using LamHyStore.Contracts;
using LamHyStore.Entities.Models;
using LamHyStore.Contracts;
using LamHyStore.Shared.RequestModel;
using LamHyStore.Presentation.Util;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Repositorys;
using LamHyStore.Service.Contracts;
using LamHyStore.Shared.DataTransferObjects;
using LamHyStore.Shared.lib;

namespace LamHyStore.Presentation.Controllers
{
    [Route("api/order")]
    [Authorize]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IRepositoryManager _repo;
        private readonly RepositoryContext _repositoryContext;
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;
        private readonly ILoggerManager _logger;
        private readonly IMapper _mapper;
        private readonly IKioVietAPI _kioVietApi;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IOrderService _orderService;
        private readonly IVNpayService _vnPayService;
        private User _user;

        public OrderController(
         IRepositoryManager repo,
         UserManager<User> userManager,
         IConfiguration configuration,
         ILoggerManager logger,
         IMapper mapper,
         IKioVietAPI kioVietApi,
         IHttpContextAccessor httpContextAccessor,
         RepositoryContext repositoryContext,
         IOrderService orderService,
         IVNpayService vnPayService
         )
        {
            _repo = repo;
            _userManager = userManager;
            _configuration = configuration;
            _logger = logger;
            _mapper = mapper;
            _kioVietApi = kioVietApi;
            _httpContextAccessor = httpContextAccessor;
            _repositoryContext = repositoryContext;
            _orderService = orderService;
            _vnPayService = vnPayService;

        }

        [ServiceFilter(typeof(BasicFilterAttribute))]
        [AllowAnonymous]
        [HttpGet("test-order")]
        public async Task<IActionResult> Test()
        {
            var remoteIp = HttpContext.Connection.RemoteIpAddress;
            _logger.LogInfo("Remote IpAddress: " + remoteIp);
            return Ok("Oke test");
        }

        [ServiceFilter(typeof(BasicFilterAttribute))]
        [AllowAnonymous]
        [HttpGet("vnpay/ipn-url")]
        public async Task<ActionResult<string>> GetIpnUrl() {
            string returnContent = string.Empty;
            if (HttpContext.Request.Query.Count > 0) {
                var vnpayData = HttpContext.Request.Query;
                var stringBuilder = new StringBuilder();

                foreach (var item in vnpayData)
                {
                    // Append each key-value pair to the StringBuilder
                    stringBuilder.AppendLine($"Key: {item.Key}, Value: {string.Join(", ", item.Value)}");
                }

                // Log the accumulated query string
                _logger.LogInfo("Received Query String: " +  stringBuilder.ToString());

                // Convert IQueryCollection to IEnumerable<KeyValuePair<string, string>>
                var queryDict = vnpayData.Select(x => new KeyValuePair<string, string>(x.Key, x.Value.ToString()));

                bool checkSignature = _vnPayService.ValidateSignature(queryDict, out string orderId, out string vnp_ResponseCode, out string vnp_TransactionStatus);
                
                double vnp_Amount = 0;
                if (vnpayData.ContainsKey("vnp_Amount") && double.TryParse(vnpayData["vnp_Amount"], out double amount))
                {
                    vnp_Amount = amount;
                }

                if (checkSignature)
                {
                    //Cap nhat ket qua GD
                    //Yeu cau: Truy van vao CSDL cua  Merchant => lay ra duoc OrderInfo
                    //Giả sử OrderInfo lấy ra được như giả lập bên dưới

                    try
                    {

                        var order = await _repositoryContext.Orders.FirstOrDefaultAsync(order => order.Id.ToString() == orderId);



                        if (order == null)
                        {
                            _logger.LogInfo("Order not found for OrderID: {orderId}" + orderId);
                        }
                        else
                        {
                            _logger.LogInfo("Received order information");


                        }



                        if (order != null)
                        {

                            _logger.LogInfo("Passed 1 - {orderId}" + orderId);

                            if ((order.TotalPayment + (order.Feeship * 100)) == vnp_Amount)
                            {

                                _logger.LogInfo("Passed 2 - {orderId}" + orderId);
                                if (order.OrderStatus == "Pending")
                                {
                                    _logger.LogInfo("Passed 3  - {orderId}" + orderId);
                                    if (vnp_ResponseCode == "00" && vnp_TransactionStatus == "00")
                                    {
                                        _logger.LogInfo("Passed 4 - {orderId}" + orderId);
                                        //Thanh toan thanh cong
                                        try
                                        {
                                            // Update in database
                                            order.OrderStatus = "Success";
                                            
                                            // Update in kiotviet;

                                            UpdateOrderPayload payload = new UpdateOrderPayload
                                            {
                                                Description = "VNAY\n" + order.Note
                                            };

                                            await _kioVietApi.UpdateOrderAsync(payload, order.OrderExternalID);
                                           


                                        }
                                        catch (Exception ex)
                                        {

                                            _logger.LogError("Recived change model: {ex}" + ex);
                                        }
                                        // thêm payment vào db

                                    }
                                    else
                                    {
                                        try
                                        {
                                            // Update in database
                                            order.OrderStatus = "Failed";

                                            // Update in kiotviet;

                                            UpdateOrderPayload payload = new UpdateOrderPayload
                                            {
                                                Description = "VNAY\n" + "Thanh toán thất bại"
                                            };

                                            await _kioVietApi.UpdateOrderAsync(payload, order.OrderExternalID);



                                        }
                                        catch (Exception ex)
                                        {

                                            _logger.LogError("Recived change model: {ex}" + ex);
                                        }
                                        //Thanh toan khong thanh cong. Ma loi: vnp_ResponseCode
                                        //  displayMsg.InnerText = "Có lỗi xảy ra trong quá trình xử lý.
                                    }

                                    //Thêm code Thực hiện cập nhật vào Database 
                                    //Update Database

                                    await _repositoryContext.SaveChangesAsync();

                                    returnContent = "{\"RspCode\":\"00\",\"Message\":\"Confirm Success\"}";
                                }
                                else
                                {
                                    returnContent = "{\"RspCode\":\"02\",\"Message\":\"Order already confirmed\"}";
                                }
                            }
                            else
                            {
                                returnContent = "{\"RspCode\":\"04\",\"Message\":\"invalid amount\"}";
                            }
                        }
                        else
                        {
                            returnContent = "{\"RspCode\":\"01\",\"Message\":\"Order not found\"}";
                        }
                    }
                    catch (Exception e)
                    {
                        _logger.LogInfo("Recived error: {e}" + e);
                    }

                }
                else
                {
                    returnContent = "{\"RspCode\":\"97\",\"Message\":\"Invalid signature\"}";
                }
            }
            else
            {
                returnContent = "{\"RspCode\":\"99\",\"Message\":\"Input data required\"}";
            }

            return returnContent;
        }
        


        [HttpPost("create-order")]
        public async Task<IActionResult> CreateVNPAYOrder([FromBody] CODOrderPayloadDto order)
        {
            if (order.OrderDetails == null || order.OrderDetails.Count == 0)
            {
                return BadRequest("Order details are missing.");
            }


            var existingUserKiotViet = await _kioVietApi.FindCustomerByPhoneNumberAsync(order.ContactNumber);

            string statusDecription = order.PaymentMethod +  " - Đang trong quá trình thanh toán...";

            string temporaryAddress = order.Address + " - " + order.Commune + " - " + order.District + " - " + order.Province;

            CODOrderKioVietPayload payload = new CODOrderKioVietPayload
            {
                Method = "Card",
                Description = statusDecription,
                OrderDelivery = new Shared.DataTransferObjects.OrderDelivery
                {
                    Price = (decimal)order.CostDelivery,
                    Address = temporaryAddress,
                    Receiver = order.FullName,
                    ContactNumber = order.ContactNumber
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

            if (existingUserKiotViet != null)
            {
                payload.Customer = new Customer
                {
                    Id = existingUserKiotViet.Id,
                    ContactNumber = existingUserKiotViet.ContactNumber,
                    Code = existingUserKiotViet.Code
                };
            }

            if (order.PaymentMethod == "COD") { 
                payload.Method = "Cash";
                payload.Description = "COD - Thanh toán khi nhận hàng";
            }

            // Save order to database
            var rs = await _kioVietApi.CreateCODOrderAsync(payload);


            Order createdOrder = new Order
            {
                Id = Guid.NewGuid(),
                CreatedDate = DateTime.Now,
                OrderExternalID = rs.Id,
                PaymentMethodName = order.PaymentMethod,
                Note = statusDecription,
                OrderStatus = "Pending",
                TotalPayment = order.TotalPayment * 100,
                Feeship = order.CostDelivery,
                PhoneNumber = order.ContactNumber,
            };

            if (order.PaymentMethod == "COD")
            {
                createdOrder.OrderStatus = "Success";
                createdOrder.Note = "COD - Thanh toán khi nhận hàng";
            }

            await _repositoryContext.Orders.AddAsync(createdOrder);
            await _repositoryContext.SaveChangesAsync();

            if (order.PaymentMethod != "COD")
            {
                var url_payment = _vnPayService.VNPAY_CreatePaymentURL(createdOrder);
                return Ok(url_payment);
            }
            return Ok(createdOrder);

        }

    }
}
