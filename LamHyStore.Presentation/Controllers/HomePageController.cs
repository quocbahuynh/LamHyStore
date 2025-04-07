using Microsoft.AspNetCore.Authorization;
﻿using LamHyStore.Contracts;
using Microsoft.AspNetCore.Mvc;

namespace LamHyStore.Presentation.Controllers
{
    [Route("api/homepage")]
    [Authorize]
    [ApiController]
    public class HomePageController : ControllerBase
    {
        private readonly IKioVietAPI _kioVietApi;

        public HomePageController( IKioVietAPI kioVietApi)
        {
           
            _kioVietApi = kioVietApi;

        }


        [AllowAnonymous]
        [HttpGet("branches")]
        public async Task<IActionResult> GetBranches() {

           var listBranches = await _kioVietApi.GetBranchListAsync();

            return Ok(listBranches);
        
        }


    }
}
