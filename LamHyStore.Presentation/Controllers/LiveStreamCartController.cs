using Microsoft.AspNetCore.Authorization;
﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using LamHyStore.Contracts;
using LamHyStore.Entities.Models;
using LamHyStore.Contracts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using LamHyStore.Service;
using LamHyStore.Service.Contracts;
using LamHyStore.Shared.DataTransferObjects;

namespace LamHyStore.Presentation.Controllers
{
    [Route("api/livestreamcart")]
    [Authorize]
    [ApiController]
    public class LiveStreamCartController : ControllerBase
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

        public LiveStreamCartController(
         IRepositoryManager repository,
         UserManager<User> userManager,
         IConfiguration configuration,
         ILoggerManager logger,
         IMapper mapper,
         ILiveStreamService liveStreamService,
         IKioVietAPI kioVietApi,
         IHttpContextAccessor httpContextAccessor
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

        }

        [HttpDelete("delete/livestream/{livestreamId}/product/{productId}")]
        public async Task<IActionResult> DeleteProductInCart(string livestreamId, string productId)
        {
            var livestreamCartItems = await _repository.LiveStreamCart.FindByCondition(ls => ls.LiveStreamId.ToString().Equals(livestreamId), trackChanges: true).Where(item => item.ProductExternalID == productId).ToListAsync();

            livestreamCartItems.ForEach(item => _repository.LiveStreamCart.Delete(item));

            _repository.Save();

            return Ok();
        }


        [HttpPost("add/livestream/product")]
        public async Task<IActionResult> AddProductInCart([FromBody] LiveStreamCartItemForCreationDto newCartItemDto)
        {

            var newCartItem = _mapper.Map<LiveStreamCart>(newCartItemDto);

            _repository.LiveStreamCart.Create(newCartItem);

            // Save changess
            _repository.Save(); // Assuming you have an asynchronous save method

            return Ok();
        }


        [AllowAnonymous]
        [HttpGet("get/livestream/{livestreamId}")]
        public async Task<IActionResult> GetProductsInCart(string livestreamId)
        {
            var livestream = await _repository.LiveStreamCart.FindByCondition(ls => ls.LiveStreamId.ToString().Equals(livestreamId), trackChanges: true).ToListAsync(); 

            return Ok(livestream);
        }


    }
}
