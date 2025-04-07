using AutoMapper;
using LamHyStore.Contracts;
using LamHyStore.Contracts;
using LamHyStore.Shared.ResponseModel;
using Microsoft.AspNetCore.Mvc;
using Repositorys;
using LamHyStore.Shared.DataTransferObjects;

namespace LamHyStore.Presentation.Controllers
{
    [Route("api/extension")]
    public class ExtensionController : ControllerBase
    {
        private readonly ILoggerManager _logger;
        private readonly IMapper _mapper;
        private readonly RepositoryContext _context;
        private readonly IKioVietAPI _kioVietApi;

        public ExtensionController(
            ILoggerManager logger,
            IMapper mapper,
             IKioVietAPI kioVietApi,
            RepositoryContext context)
        {
            _logger = logger;
            _mapper = mapper;
            _kioVietApi = kioVietApi;
            _context = context;
        }

        [HttpPut("add-to-section/{id}")]
        public async Task<IActionResult> AddProductCodeToSection(Guid id, [FromBody] AddProductCodePayload request)
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
            if (section.ProductExternalIds == null)
            {
                section.ProductExternalIds = new List<string>();
            }
            ProductDetailResponse product = await _kioVietApi.GetProductDetailCodeAsync(request.ProductCode);

            // Add new product code to the list
            section.ProductExternalIds.Insert(0, product.Id.ToString());

            await _context.SaveChangesAsync();

            return Ok(new { Message = "Section updated successfully!" });
        }
    }
}
