using Microsoft.AspNetCore.Authorization;
﻿using AutoMapper;
using LamHyStore.Contracts;
using LamHyStore.Entities.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Repositorys;
using LamHyStore.Shared.DataTransferObjects.Menu;

namespace LamHyStore.Presentation.Controllers
{
    [Route("api/page")]
    public class PageController : ControllerBase
    {
        private readonly ILoggerManager _logger;
        private readonly IMapper _mapper;
        private readonly RepositoryContext _context;

        public PageController(
            ILoggerManager logger,
            IMapper mapper,
            RepositoryContext context)
        {
            _logger = logger;
            _mapper = mapper;
            _context = context;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddMenuHome([FromBody] PageCreationAndUpdateDto request)
        {
            if (request == null || !ModelState.IsValid)
            {
                return BadRequest("Invalid data.");
            }

            var pageType = await _context.PageTypes
                .Where(m => m.Name == request.PageType)
                .FirstOrDefaultAsync();

            if (pageType == null)
            {
                return NotFound("PageType not found.");
            }
            int countPageType = await _context.Pages.Where(m => m.PageTypeId == pageType.Id).CountAsync();

            var menu = _mapper.Map<Page>(request);
            menu.PageTypeId = pageType.Id;
            menu.Position = countPageType; 

            await _context.Pages.AddAsync(menu);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Menu added successfully!", menu.Id });
        }


        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeletePage(Guid id, [FromBody] PageTypePayload request)
        {
            var pageType = await _context.PageTypes
               .Where(m => m.Name == request.PageType)
               .FirstOrDefaultAsync();

            if (pageType == null)
            {
                return NotFound("PageType not found.");
            }

            var pageVictim = await _context.Pages.Where(p => p.Id == id && p.PageTypeId == pageType.Id).FirstOrDefaultAsync();

            if (pageVictim == null)
            {
                return NotFound(new { Message = "Page not found." });
            }

            _context.Pages.Remove(pageVictim);
            await _context.SaveChangesAsync();

            var remainingPages = await _context.Pages
            .Where(m => m.PageTypeId == pageType.Id)
            .OrderBy(p => p.Position)
            .ToListAsync();

            for (int i = 0; i < remainingPages.Count; i++)
            {
                remainingPages[i].Position = i;
            }

            await _context.SaveChangesAsync();

            return Ok(new { Message = "Page deleted and positions reordered successfully!" });
        }

        [AllowAnonymous]
        [HttpGet("menu-all")]
        public async Task<IActionResult> GetAllMenus()
        {
            var pages = await _context.Pages
                .Include(p => p.Sections) // Include Sections
                .Include(p => p.PageType) // Include PageType
                .Where(m => m.PageType.Name == "MENU_HOME")
                .OrderBy(p => p.Position)
                .ToListAsync();

            // Ensure Sections are ordered by Position
            foreach (var page in pages)
            {
                page.Sections = page.Sections.OrderBy(s => s.Position).ToList();
            }

            // Map to DTO to prevent circular references
            var pageDtos = _mapper.Map<List<MenuDto>>(pages);

            return Ok(pageDtos);
        }


        [AllowAnonymous]
        [HttpGet("bestseller-all")]
        public async Task<IActionResult> GetAllBestSeller()
        {

            var pages = await _context.Pages
                .Include(p => p.Sections) // Include Sections
                .Include(p => p.PageType) // Include PageType
                .Where(m => m.PageType.Name == "BESTSELLER_HOME")
                .OrderBy(p => p.Position)
                .ToListAsync();

            foreach (var page in pages)
            {
                page.Sections = page.Sections.OrderBy(s => s.Position).ToList();
            }


            // Map to DTO to prevent circular references
            var pageDtos = _mapper.Map<List<BestSellerDto>>(pages);

            return Ok(pageDtos);
        }

        [AllowAnonymous]
        [HttpGet("branding-all")]
        public async Task<IActionResult> GetAllBranding()
        {

            var pages = await _context.Pages
                .Include(p => p.Sections) // Include Sections
                .Include(p => p.PageType) // Include PageType
                .Where(m => m.PageType.Name == "BRANDING")
                .OrderBy(p => p.Position)
                .ToListAsync();

            foreach (var page in pages)
            {
                page.Sections = page.Sections.OrderBy(s => s.Position).ToList();
            }


            // Map to DTO to prevent circular references
            var pageDtos = _mapper.Map<List<BestSellerDto>>(pages);

            return Ok(pageDtos);
        }

        [AllowAnonymous]
        [HttpGet("sections-all")]
        public async Task<IActionResult> GetAllSections()
        {

            var pages = await _context.Pages
                .Include(p => p.Sections) // Include Sections
                .Include(p => p.PageType) // Include PageType
                .Where(m => m.PageType.Name == "SECTION_HOME")
                .OrderBy(p => p.Position)
                .ToListAsync();

            // Map to DTO to prevent circular references
            var pageDtos = _mapper.Map<List<SectionListDtoV2>>(pages);

            return Ok(pageDtos);
        }

        [AllowAnonymous]
        [HttpGet("banner-all")]
        public async Task<IActionResult> GetBannerSections()
        {

            var pages = await _context.Pages
                .Include(p => p.Sections) // Include Sections
                .Include(p => p.PageType) // Include PageType
                .Where(m => m.PageType.Name == "BANNER_HOME")
                .OrderBy(p => p.Position)
                .ToListAsync();

            // Ensure Sections are ordered by Position
            foreach (var page in pages)
            {
                page.Sections = page.Sections.OrderBy(s => s.Position).ToList();
            }


            // Map to DTO to prevent circular references
            var pageDtos = _mapper.Map<List<HeroBannerDtoV2>> (pages);

            return Ok(pageDtos);
        }

        [AllowAnonymous]
        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllPages([FromBody] PageTypePayload request)
        {
            var pageType = await _context.PageTypes
               .Where(m => m.Name == request.PageType)
               .FirstOrDefaultAsync();

            if (pageType == null)
            {
                return NotFound("PageType not found.");
            }
            var pages = await _context.Pages
                .Where(m => m.PageTypeId == pageType.Id)
                .OrderBy(p => p.Position) // Sorting by Position in ascending order
                .ToListAsync();

            return Ok(pages);
        }

        [HttpPut("update-positions")]
        public async Task<IActionResult> UpdatePagePositions([FromBody] List<MenuPositionDto> pages)
        {
            if (pages == null || pages.Count == 0)
            {
                return BadRequest("Invalid page data.");
            }

            var pageIds = pages.Select(p => p.Id).ToList();
            var existingPages = await _context.Pages
                .Where(p => pageIds.Contains(p.Id))
                .ToListAsync();

            if (existingPages.Count != pages.Count)
            {
                return BadRequest("Some pages were not found.");
            }

            // Update positions based on the new order
            foreach (var page in existingPages)
            {
                var newPageData = pages.First(p => p.Id == page.Id);
                page.Position = newPageData.Position;
            }

            await _context.SaveChangesAsync();
            return Ok(new { Message = "Page positions updated successfully!" });
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdatePage(Guid id, [FromBody] PageCreationAndUpdateDto request)
        {
            
            if (request == null)
            {
                return BadRequest("Invalid request data.");
            }

            var pageType = await _context.PageTypes
                .Where(m => m.Name == request.PageType)
                .FirstOrDefaultAsync();

            if (pageType == null)
            {
                return NotFound("PageType not found.");
            }

            var page = await _context.Pages.Where(p => p.Id == id && p.PageTypeId == pageType.Id).FirstOrDefaultAsync();

            if (page == null)
            {
                return NotFound(new { Message = "Page not found." });
            }

            // Update the fields
            page.IconUrl = request.IconUrl;
            page.Title = request.Title;

            await _context.SaveChangesAsync();

            return Ok(new { Message = "Page updated successfully!" });
        }



    }
}
