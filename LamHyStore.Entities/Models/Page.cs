using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace LamHyStore.Entities.Models
{
    public class Page
    {
        public Guid Id { get; set; }

        public string? IconUrl { get; set; }

        public string? Title { get; set; }

        public int? Position { get; set; }

        // Foreign Key to PageType
        public Guid PageTypeId { get; set; }
        [ForeignKey(nameof(PageTypeId))]
        public PageType PageType { get; set; }


        [JsonIgnore] // Prevents circular serialization
        public ICollection<Section>? Sections { get; set; }

    }
}
