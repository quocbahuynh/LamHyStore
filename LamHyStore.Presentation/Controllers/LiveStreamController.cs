using Microsoft.AspNetCore.Authorization;
﻿using AutoMapper;
using LamHyStore.Contracts;
using LamHyStore.Entities.Models;
using LamHyStore.Contracts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Repositorys;
using LamHyStore.Service.Contracts;
using LamHyStore.Shared.DataTransferObjects;

namespace LamHyStore.Presentation.Controllers
{
    [Route("api/livestream")]
    [Authorize]
    [ApiController]
    public class LiveStreamController : ControllerBase
    {
        private readonly IRepositoryManager _repository;
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;
        private readonly ILoggerManager _logger;
        private readonly IMapper _mapper;
        private readonly IKioVietAPI _kioVietApi;
        ILiveStreamService _liveStreamService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private User _user;
        private readonly RepositoryContext _repositoryContext;

        public LiveStreamController(
         IRepositoryManager repository,
         UserManager<User> userManager,
         IConfiguration configuration,
         ILoggerManager logger,
         IMapper mapper,
         ILiveStreamService liveStreamService,
         IKioVietAPI kioVietApi,
         IHttpContextAccessor httpContextAccessor,
         RepositoryContext repositoryContext
         )
        {
            _repository = repository;
            _userManager = userManager;
            _configuration = configuration;
            _logger = logger;
            _mapper = mapper;
            _kioVietApi = kioVietApi;
            _liveStreamService = liveStreamService;
            _httpContextAccessor = httpContextAccessor;
            _repositoryContext = repositoryContext;

        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetAllLiveStreams()
        {
            try
            {
                // Include LiveStreamCarts in the query
                var liveStreams = await _repositoryContext.LiveStreams
                    .Include(ls => ls.liveStreamCarts)
                    .AsNoTracking()
                    .ToListAsync();
                var liveStreamDtos = _mapper.Map<List<LiveStreamDto>>(liveStreams);
                return Ok(liveStreamDtos);
            }
            catch (Exception ex)
            {
                // Log the error (logging implementation should be added)
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateLiveStream(string id, [FromBody] UpdateLiveStreamDto request)
        {
            try
            {
                var liveStream = await _repositoryContext.LiveStreams
                   .AsTracking() // Prevent unnecessary change tracking
                   .Include(ls => ls.liveStreamCarts)
                   .Where(ls => ls.Id.ToString() == id) // Filter by ID (case-insensitive)
                   .FirstOrDefaultAsync();

                if (liveStream == null)
                {
                    return NotFound($"Live stream with ID {id} not found.");
                }

                if (!string.IsNullOrEmpty(request.Name))
                {
                    liveStream.Title = request.Name;
                }

                // Add products
                foreach (var productId in request.AddProductExternalIds)
                {
                    if (liveStream.liveStreamCarts.Any())
                    {
                        liveStream.liveStreamCarts.Add(new LiveStreamCart { ProductExternalID = productId, LiveStreamId = new Guid(id) });
                    }
                }

                // Remove products
                foreach (var productId in request.RemoveProductExternalIds)
                {
                    var cartItemToRemove = liveStream.liveStreamCarts.FirstOrDefault(lc => lc.ProductExternalID == productId);
                    if (cartItemToRemove != null)
                    {
                        liveStream.liveStreamCarts.Remove(cartItemToRemove);
                    }
                }

                await _repositoryContext.SaveChangesAsync();

                return Ok("Live stream updated successfully.");
            }
            catch (Exception ex)
            {
                // Log the error (logging implementation should be added)
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    

        [AllowAnonymous]
        [HttpGet("products")]
        public async Task<IActionResult> GetProducts([FromQuery] string searchName = null, int pageSize = 10, int currentItem = 1)
        {
            var productsKiotViet = await _kioVietApi.GetProductListAsync(searchName, pageSize, currentItem);
            return Ok(productsKiotViet);
        }


        [HttpPost]
        public async Task<IActionResult> CreateLiveStream([FromBody] LiveStreamForCreationDto liveStreamForCreationDto)
        {
            // Check if the input DTO is valid
            if (liveStreamForCreationDto == null)
            {
                return BadRequest("LiveStream data is required.");
            }

            // Create a new LiveStream entity and populate its properties
            var liveStream = new LiveStream
            {
                Id = Guid.NewGuid(),
                Slug = GenerateSlug(),
                Title = liveStreamForCreationDto.Title ?? "Default Title",
                CreatedDate = DateTime.UtcNow,
                ProductPinExternalID = liveStreamForCreationDto.ProductPinExternalID
            };

            // Initialize the LiveStreamCart collection
            liveStream.liveStreamCarts = liveStreamForCreationDto.ProductExternalID?
                .Select(productExternalId => new LiveStreamCart
                {
                    Id = Guid.NewGuid(),
                    ProductExternalID = productExternalId,
                    LiveStreamId = liveStream.Id
                }).ToList();

            // Add the new LiveStream to the DbContext
            _repository.LiveStream.Create(liveStream);
            _repository.Save();

            // Save changes asynchronously


            // Return a Created response with the new LiveStream's data
            return CreatedAtRoute("LiveStreamById", new { id = liveStream.Id }, liveStream);
        }

        [AllowAnonymous]
        [HttpGet("id/{id}", Name = "LiveStreamById")]
        public async Task<IActionResult> GetLiveStreamById(string id)
        {
            try
            {
                // Validate input (optional, but recommended)
                if (string.IsNullOrEmpty(id))
                {
                    return BadRequest("Invalid live stream ID provided.");
                }

                // Eagerly load LiveStreamCarts with a single query
                var liveStream = await _repositoryContext.LiveStreams
                    .AsNoTracking() // Prevent unnecessary change tracking
                    .Include(ls => ls.liveStreamCarts) // Eagerly load related LiveStreamCarts
                    .Where(ls => ls.Id.ToString() == id) // Filter by ID (case-insensitive)
                    .FirstOrDefaultAsync();

                if (liveStream == null)
                {
                    return NotFound("Live stream with the specified ID not found.");
                }

                // Map LiveStream and its LiveStreamCarts to DTOs for serialization
                var liveStreamDto = _mapper.Map<LiveStreamDto>(liveStream);

                // Optionally, customize DTO mapping to include specific properties
                // liveStreamDto.AdditionalProperty = ...

                return Ok(liveStreamDto);
            }
            catch (Exception ex)
            {
                // Log the error (logging implementation should be added)
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [AllowAnonymous]
        [HttpGet("slug/{slug}", Name = "LiveStreamBySlug")]
        public async Task<IActionResult> GetLiveStreamBySlug(string slug)
        {
            try
            {
                // Validate input (optional, but recommended)
                if (string.IsNullOrEmpty(slug))
                {
                    return BadRequest("Invalid live stream Slug provided.");
                }

                // Eagerly load LiveStreamCarts with a single query
                var liveStream = await _repositoryContext.LiveStreams
                    .AsNoTracking() // Prevent unnecessary change tracking
                    .Include(ls => ls.liveStreamCarts) // Eagerly load related LiveStreamCarts
                    .Where(ls => ls.Slug == slug) // Filter by ID (case-insensitive)
                    .FirstOrDefaultAsync();

                if (liveStream == null)
                {
                    return NotFound("Live stream with the specified ID not found.");
                }

                // Map LiveStream and its LiveStreamCarts to DTOs for serialization
                var liveStreamDto = _mapper.Map<LiveStreamDto>(liveStream);

                // Optionally, customize DTO mapping to include specific properties
                // liveStreamDto.AdditionalProperty = ...

                return Ok(liveStreamDto);
            }
            catch (Exception ex)
            {
                // Log the error (logging implementation should be added)
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpDelete("id/{id}")]
        public async Task<IActionResult> DeleteLiveStreamById(string id)
        {

            var livestream = await _repository.LiveStream.FindByCondition(ls => ls.Id.ToString().Equals(id), true).FirstOrDefaultAsync();
            _repository.LiveStream.Delete(livestream);
            _repository.Save();
            return Ok();
        }


        [HttpPatch("id/{id}")]
        public async Task<IActionResult> PartiallyUpdateLiveStream(string id, [FromBody] JsonPatchDocument<LiveStreamForUpdateDto> patchDoc)
        {
            if (patchDoc is null)
                return BadRequest("patchDoc object sent from client is null.");

            var result = await _liveStreamService.GetLiveStreamForPatch(id, true);
            patchDoc.ApplyTo(result.livestreamToPatch);
            _liveStreamService.SaveChangesForPatch(result.livestreamToPatch, result.livestreamEntity);
            return Ok();
        }


        // [HttpGet("id/{id}/pin-product")]
        // public async Task<IActionResult> GetPinProduct(string id)
        // {
        //     var livestream = await _repository.LiveStream.FindByCondition(ls => ls.Id.ToString().Equals(id), false).FirstOrDefaultAsync();

        //    var productPinId = livestream.ProductPinExternalID;

        //     var result = await _kioVietApi.GetProductDetailAsync(productPinId);

        //     return Ok(result);
        // }

        [AllowAnonymous]
        [HttpGet("id/{id}/pin-product")]
        public async Task GetPinProduct(string id)
        {
            Response.Headers.Add("Cache-Control", "no-cache");
            Response.Headers.Add("Content-Type", "text/event-stream");

            while (!HttpContext.RequestAborted.IsCancellationRequested)
            {
                var livestream = await _repository.LiveStream
                    .FindByCondition(ls => ls.Id.ToString().Equals(id), false)
                    .FirstOrDefaultAsync();

                if (livestream == null)
                {
                    await Response.WriteAsync("event: error\n");
                    await Response.WriteAsync("data: { \"message\": \"Live stream not found.\" }\n\n");
                    await Response.Body.FlushAsync();
                    break;
                }

                var productPinId = livestream.ProductPinExternalID;

                var result = await _kioVietApi.GetProductDetailAsync(productPinId);

                var jsonResult = System.Text.Json.JsonSerializer.Serialize(result);

                // Send the pinned product as SSE data
                await Response.WriteAsync($"data: {jsonResult}\n\n");
                await Response.Body.FlushAsync();

                // Wait before sending the next update
                await Task.Delay(10000); // Adjust the delay as needed
            }
        }


        [AllowAnonymous]
        [HttpGet("stream")]
        public async Task Stream()
        {
         
            Response.ContentType = "text/event-stream";
            Response.Headers.Add("Cache-Control", "no-cache");
            Response.Headers.Add("Connection", "keep-alive");

            while (true)
            {
                // Send a message every 2 seconds
                var message = $"data: {System.DateTime.Now}\n\n";
                await Response.WriteAsync(message);
                await Response.Body.FlushAsync();
                await Task.Delay(2000); // 2 seconds delay
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
