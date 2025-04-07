using Microsoft.AspNetCore.Authorization;
﻿using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
using AutoMapper;
using LamHyStore.Contracts;
using LamHyStore.Entities.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Repositorys;
using LamHyStore.Shared.DataTransferObjects.Menu;

namespace LamHyStore.Presentation.Controllers
{
    [Route("api/section")]
    public class SectionController : ControllerBase
    {
        private readonly ILoggerManager _logger;
        private readonly IMapper _mapper;
        private readonly RepositoryContext _context;

        public SectionController(
            ILoggerManager logger,
            IMapper mapper,
            RepositoryContext context)
        {
            _logger = logger;
            _mapper = mapper;
            _context = context;
        }

        private static async Task<string> GenerateUniqueSlug(string title, RepositoryContext repocontext)
        {
            // Convert title to slug format
            string slug = Slugify(title);
            string uniqueSlug = slug;
            int counter = 1;

            // Check for existing slugs in the database
            while (await repocontext.Sections.AnyAsync(s => s.Slug == uniqueSlug))
            {
                uniqueSlug = $"{slug}-{counter}";
                counter++;
            }

            return uniqueSlug;
        }

        // Function to convert a string to a slug
        private static string Slugify(string input)
        {
            // Chuyển đổi chuỗi thành dạng không dấu
            string normalizedString = input.Normalize(NormalizationForm.FormD);
            StringBuilder stringBuilder = new StringBuilder();

            foreach (char c in normalizedString)
            {
                UnicodeCategory category = CharUnicodeInfo.GetUnicodeCategory(c);
                if (category != UnicodeCategory.NonSpacingMark)
                {
                    stringBuilder.Append(c);
                }
            }

            string slug = stringBuilder.ToString().Normalize(NormalizationForm.FormC);

            // Chuyển thành chữ thường
            slug = slug.ToLower();

            // Thay thế khoảng trắng bằng dấu "-"
            slug = Regex.Replace(slug, @"\s+", "-");

            // Loại bỏ ký tự không hợp lệ
            slug = Regex.Replace(slug, @"[^\w\-]", "");

            // Loại bỏ dấu "-" thừa
            slug = Regex.Replace(slug, @"-+", "-").Trim('-');

            return slug;
        }

        [HttpPost("add-menu")]
        public async Task<IActionResult> AddHome([FromBody] SectionCreationDto request)
        {

            if (request == null || !ModelState.IsValid)
            {
                return BadRequest("Invalid data.");
            }

            Page? existingPage = null;

            if (request.PageType == "MENU_HOME")
            {

                existingPage = await _context.Pages
                    .Where(m => m.Id == request.PageId)
                    .FirstOrDefaultAsync();
            }
            else {
                existingPage = await _context.Pages
                   .Include(p => p.PageType)
                   .FirstOrDefaultAsync(p => p.PageType.Name == request.PageType);
            }

            if (existingPage == null)
            {
                return NotFound("Page not found.");
            }
            int countSectionByType = await _context.Sections.Where(s => s.PageId == request.PageId && s.PageId == existingPage.Id).CountAsync();

            var section = _mapper.Map<Section>(request);
            section.PageId = existingPage.Id;
            section.Position = countSectionByType;
            section.Slug = await GenerateUniqueSlug(request.Title, _context);

            await _context.Sections.AddAsync(section);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Section added successfully!", section.Id });
        }

        [HttpPost("add-banner")]
        public async Task<IActionResult> AddBanner([FromBody] PhotoBannerCreationDto request)
        {

            if (request == null || !ModelState.IsValid)
            {
                return BadRequest("Invalid data.");
            }

            Page? existingPage = existingPage = await _context.Pages
                   .Include(p => p.PageType)
                   .FirstOrDefaultAsync(p => p.PageType.Name == "BANNER_HOME");


            if (existingPage == null)
            {
                var pageType = await _context.PageTypes
               .Where(m => m.Name == "BANNER_HOME")
               .FirstOrDefaultAsync();
                PageHeroBannerCreation payload = new PageHeroBannerCreation();
                payload.Title = "HERO BANNER";
                payload.PageType = "BANNER_HOME";


                var pageHeroBanner = _mapper.Map<Page>(payload);
                pageHeroBanner.PageTypeId = pageType.Id;
                await _context.Pages.AddAsync(pageHeroBanner);
                await _context.SaveChangesAsync();

                existingPage = existingPage = await _context.Pages
                   .Include(p => p.PageType)
                   .FirstOrDefaultAsync(p => p.PageType.Name == "BANNER_HOME");

            }
            int countSectionByType = await _context.Sections.Where(s => s.PageId == existingPage.Id).CountAsync();

            var section = _mapper.Map<Section>(request);
            section.Title = "HERO BANNER";
            section.PageId = existingPage.Id;
            section.Position = countSectionByType;

            await _context.Sections.AddAsync(section);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Section added successfully!", section.Id });
        }


        [HttpPost("add-section")]
        public async Task<IActionResult> AddSection([FromBody] SectionSaleCreationDto request)
        {

            if (request == null || !ModelState.IsValid)
            {
                return BadRequest("Invalid data.");
            }

            Page? existingPage = existingPage = await _context.Pages
                   .Include(p => p.PageType)
                   .FirstOrDefaultAsync(p => p.PageType.Name == "SECTION_HOME");


            if (existingPage == null)
            {
                var pageType = await _context.PageTypes
               .Where(m => m.Name == "SECTION_HOME")
               .FirstOrDefaultAsync();
                PageHeroBannerCreation payload = new PageHeroBannerCreation();
                payload.Title = "SECTION BANNER";
                payload.PageType = "SECTION_HOME";


                var pageHeroBanner = _mapper.Map<Page>(payload);
                pageHeroBanner.PageTypeId = pageType.Id;

                await _context.Pages.AddAsync(pageHeroBanner);
                await _context.SaveChangesAsync();

                existingPage = existingPage = await _context.Pages
                   .Include(p => p.PageType)
                   .FirstOrDefaultAsync(p => p.PageType.Name == "SECTION_HOME");

            }
            int countSectionByType = await _context.Sections.Where(s => s.PageId == existingPage.Id).CountAsync();

            var section = _mapper.Map<Section>(request);
            section.PageId = existingPage.Id;
            section.Position = countSectionByType;
            section.Slug = await GenerateUniqueSlug(request.Title, _context);

            await _context.Sections.AddAsync(section);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Section added successfully!", section.Id });
        }

        [HttpPost("add-bestseller")]
        public async Task<IActionResult> AddBestSeller([FromBody] BestSellerCreationDto request)
        {

            if (request == null || !ModelState.IsValid)
            {
                return BadRequest("Invalid data.");
            }

            Page? existingPage = existingPage = await _context.Pages
                   .Include(p => p.PageType)
                   .FirstOrDefaultAsync(p => p.PageType.Name == "BESTSELLER_HOME");

            if (existingPage == null)
            {
                var pageType = await _context.PageTypes
                .Where(m => m.Name == "BESTSELLER_HOME")
                .FirstOrDefaultAsync();
                PageHeroBannerCreation payload = new PageHeroBannerCreation();
                payload.Title = "BESTSELLER BANNER";
                payload.PageType = "BESTSELLER_HOME";


                var pageHeroBanner = _mapper.Map<Page>(payload);
                pageHeroBanner.PageTypeId = pageType.Id;

                await _context.Pages.AddAsync(pageHeroBanner);
                await _context.SaveChangesAsync();

                existingPage = existingPage = await _context.Pages
                   .Include(p => p.PageType)
                   .FirstOrDefaultAsync(p => p.PageType.Name == "BESTSELLER_HOME");
            }
            int countSectionByType = await _context.Sections.Where(s => s.PageId == existingPage.Id).CountAsync();

            var section = _mapper.Map<Section>(request);
            section.PageId = existingPage.Id;
            section.Position = countSectionByType;
            section.Slug = await GenerateUniqueSlug(request.Title, _context);

            await _context.Sections.AddAsync(section);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Section added successfully!", section.Id });
        }

        [HttpPost("add-branding")]
        public async Task<IActionResult> AddBranding([FromBody] BestSellerCreationDto request)
        {

            if (request == null || !ModelState.IsValid)
            {
                return BadRequest("Invalid data.");
            }

            Page? existingPage = existingPage = await _context.Pages
                   .Include(p => p.PageType)
                   .FirstOrDefaultAsync(p => p.PageType.Name == "BRANDING");

            if (existingPage == null)
            {
                var pageType = await _context.PageTypes
                .Where(m => m.Name == "BRANDING")
                .FirstOrDefaultAsync();
                PageHeroBannerCreation payload = new PageHeroBannerCreation();
                payload.Title = "Thương hiệu";
                payload.PageType = "BRANDING";


                var pageHeroBanner = _mapper.Map<Page>(payload);
                pageHeroBanner.PageTypeId = pageType.Id;

                await _context.Pages.AddAsync(pageHeroBanner);
                await _context.SaveChangesAsync();

                existingPage = existingPage = await _context.Pages
                   .Include(p => p.PageType)
                   .FirstOrDefaultAsync(p => p.PageType.Name == "BRANDING");
            }
            int countSectionByType = await _context.Sections.Where(s => s.PageId == existingPage.Id).CountAsync();

            var section = _mapper.Map<Section>(request);
            section.PageId = existingPage.Id;
            section.Position = countSectionByType;
            section.Slug = await GenerateUniqueSlug(request.Title, _context);

            await _context.Sections.AddAsync(section);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Section added successfully!", section.Id });
        }


        [HttpDelete("remove/{id}")]
        public async Task<IActionResult> RemoveSection(Guid id)
        {
            
            // Find the section to remove
            var sectionToRemove = await _context.Sections.FindAsync(id);
            if (sectionToRemove == null)
            {
                return NotFound(new { Message = "Section not found." });
            }

            // Get all sections belonging to the same page and order them by position
            var sections = await _context.Sections
                .Where(s => s.PageId == sectionToRemove.PageId && s.Id != id)
                .OrderBy(s => s.Position)
                .ToListAsync();

            // Remove the section
            _context.Sections.Remove(sectionToRemove);
            await _context.SaveChangesAsync();

            // Reorder positions
            for (int i = 0; i < sections.Count; i++)
            {
                sections[i].Position = i;
            }

            await _context.SaveChangesAsync();

            return Ok(new { Message = "Section removed successfully and positions updated." });
        }


        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateSection(Guid id, [FromBody] MenuItemUpdateDto request)
        {
            if (request == null || !ModelState.IsValid)
            {
                return BadRequest(new { Message = "Invalid request data." });
            }

            // Find the section by ID
            var section = await _context.Sections.FindAsync(id);
            if (section == null)
            {
                return NotFound(new { Message = "Section not found." });
            }
            // Update fields
            section.Description = request.Description;
            section.Title = request.Title;
            section.ProductExternalIds = request.ProductExternalIds ?? new List<string>();

            await _context.SaveChangesAsync();

            return Ok(new { Message = "Section updated successfully!" });
        }

        [HttpPut("update-bestseller/{id}")]
        public async Task<IActionResult> UpdateSectionBestSeller(Guid id, [FromBody] BestSellerUpdateDto request)
        {
            if (request == null || !ModelState.IsValid)
            {
                return BadRequest(new { Message = "Invalid request data." });
            }

            // Find the section by ID
            var section = await _context.Sections.FindAsync(id);
            if (section == null)
            {
                return NotFound(new { Message = "Section not found." });
            }
            // Update fields
            section.ThumnailUrl = request.ThumnailUrl;
            section.Title = request.Title;
            section.ProductExternalIds = request.ProductExternalIds ?? new List<string>();

            await _context.SaveChangesAsync();

            return Ok(new { Message = "Section updated successfully!" });
        }

        [HttpPut("update-branding/{id}")]
        public async Task<IActionResult> UpdateSectionBranding(Guid id, [FromBody] BestSellerUpdateDto request)
        {
            if (request == null || !ModelState.IsValid)
            {
                return BadRequest(new { Message = "Invalid request data." });
            }

            // Find the section by ID
            var section = await _context.Sections.FindAsync(id);
            if (section == null)
            {
                return NotFound(new { Message = "Section not found." });
            }
            // Update fields
            section.ThumnailUrl = request.ThumnailUrl;
            section.Title = request.Title;
            section.ProductExternalIds = request.ProductExternalIds ?? new List<string>();

            await _context.SaveChangesAsync();

            return Ok(new { Message = "Section updated successfully!" });
        }


        [AllowAnonymous]
        [HttpGet("get/{id}")]
        public async Task<IActionResult> GetSectionById(Guid id)
        {
            // Find the section by ID
            var section = await _context.Sections.FindAsync(id);

            if (section == null)
            {
                return NotFound(new { Message = "Section not found." });
            }

            return Ok(section);
        }

        [AllowAnonymous]
        [HttpGet("getSlug/{slug}")]
        public async Task<IActionResult> GetSectionBySlug(string slug)
        {
            // Find the section by ID
            var section = await _context.Sections.Where(s => s.Slug == slug).FirstOrDefaultAsync();

            if (section == null)
            {
                return NotFound(new { Message = "Section not found." });
            }

            return Ok(section);
        }

        [HttpPut("update-positions")]
        public async Task<IActionResult> UpdateSectionPositions([FromBody] List<SectionPositionDto> sections)
        {
            if (sections == null || sections.Count == 0)
            {
                return BadRequest(new { Message = "Invalid section data." });
            }

            var sectionIds = sections.Select(s => s.Id).ToList();
            var existingSections = await _context.Sections
                .Where(s => sectionIds.Contains(s.Id))
                .ToListAsync();

            if (existingSections.Count != sections.Count)
            {
                return BadRequest(new { Message = "Some sections were not found." });
            }

            // Update positions based on the new order
            foreach (var section in existingSections)
            {
                var newSectionData = sections.First(s => s.Id == section.Id);
                section.Position = newSectionData.Position;
            }

            await _context.SaveChangesAsync();
            return Ok(new { Message = "Section positions updated successfully!" });
        }


    }
}
