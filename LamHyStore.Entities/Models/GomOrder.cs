

namespace LamHyStore.Entities.Models
{
    public class GomOrder
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public string Slug { get; set; }

        public string StartDate { get; set; } 

        public string EndDate { get; set; }

        public IList<string>? productExternalIds { get; set; } = new List<string>();
    }
}
