using Microsoft.AspNetCore.Authorization;
﻿using AutoMapper;
using LamHyStore.Contracts;
using LamHyStore.Entities.Models;
using LamHyStore.Contracts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
namespace LamHyStore.Presentation.Controllers
{
    [Route("api/product")]
    [Authorize]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IRepositoryManager _repo;
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;
        private readonly ILoggerManager _logger;
        private readonly IMapper _mapper;
        private readonly IKioVietAPI _kioVietApi;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private User _user;

        public ProductController(
         IRepositoryManager repo,
         UserManager<User> userManager,
         IConfiguration configuration,
         ILoggerManager logger,
         IMapper mapper,
         IKioVietAPI kioVietApi,
         IHttpContextAccessor httpContextAccessor
         )
        {
            _repo = repo;
            _userManager = userManager;
            _configuration = configuration;
            _logger = logger;
            _mapper = mapper;
            _kioVietApi = kioVietApi;
            _httpContextAccessor = httpContextAccessor;
        }

        [AllowAnonymous]
        [HttpGet("category/{categoryId}")]
        public async Task<IActionResult> GetListOfProductByCategory(string categoryId, int pageSize = 10, int currentItem = 1)
        {
            var productsKiotViet = await _kioVietApi.GetProductListByGroupIdAsync(categoryId, pageSize, currentItem);
            return Ok(productsKiotViet);

        }

        [AllowAnonymous]
        [HttpGet("search/{name}")]
        public async Task<IActionResult> GetListOfProductByName(string name, int pageSize = 10, int currentItem = 1)
        {
            var productsKiotViet = await _kioVietApi.GetProductListAsync(name, pageSize, currentItem);
            return Ok(productsKiotViet);

        }

        [AllowAnonymous]
        [HttpGet("id/{productId}")]
        public async Task<IActionResult> GetProductDetailByCategory(string productId) { 
            var productKiotViet = await _kioVietApi.GetProductDetailAsync(productId);
            return Ok(productKiotViet);

        }

        [AllowAnonymous]
        [HttpGet("list-ids")]
        public async Task GetProductListByIds([FromQuery] List<string> ids)
        {
            if (ids == null || !ids.Any())
            {
                // If no product IDs are provided, send an error or empty response
                HttpContext.Response.StatusCode = 400; // Bad Request
                await HttpContext.Response.WriteAsync("No product IDs provided.");
                return;
            }

            // Set SSE headers
            HttpContext.Response.Headers.Add("Cache-Control", "no-cache");
            HttpContext.Response.Headers.Add("Content-Type", "text/event-stream");

            // Iterate over product IDs
            foreach (var id in ids)
            {
                try
                {
                    // Fetch product detail (using your _kioVietApi or any other service)
                    var productDetail = await _kioVietApi.GetProductDetailAsync(id);

                    if (productDetail == null)
                    {
                        // If no product is found for a given ID, skip that ID
                        continue;
                    }

                    // Serialize the product detail to JSON
                    var productJson = System.Text.Json.JsonSerializer.Serialize(productDetail);

                    // Write the product detail as an SSE event
                    await HttpContext.Response.WriteAsync($"data: {productJson}\n\n");
                    await HttpContext.Response.Body.FlushAsync(); // Send the data immediately
                    await Task.Delay(200); // Delay between sending products, can be adjusted
                }
                catch (Exception ex)
                {
                    // Handle any errors during the product fetch process
                    Console.Error.WriteLine($"Error fetching product {id}: {ex.Message}");
                }
            }
        }


        [AllowAnonymous]
        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            var categoriesKiotViet = await _kioVietApi.GetAllCategoriesAsync();
            return Ok(categoriesKiotViet);

        }
    }
}
