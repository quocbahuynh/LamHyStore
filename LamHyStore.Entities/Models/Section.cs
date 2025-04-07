using System.ComponentModel.DataAnnotations.Schema;

namespace LamHyStore.Entities.Models
{
    public class Section
    {
        public Guid Id { get; set; }

        public string Title { get; set; }

        public string? Description { get; set; }

        public string? Link { get; set; }

        public string? ThumnailUrl { get; set; }

        public string? PinProductLiveStream { get; set; }

        public string? Slug { get; set; }

        public string? StartDate { get; set; }

        public string? EndDate { get; set; }

        public DateTime? CreatedDate { get; set; } = DateTime.UtcNow;

        public int? Position { get; set; }

        public IList<string>? ProductExternalIds { get; set; } = new List<string>();

        public Guid PageId { get; set; }
        [ForeignKey(nameof(PageId))]
        public Page Page { get; set; }
    }
}
