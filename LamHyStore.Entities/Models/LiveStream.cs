using System.Text.Json.Serialization;
namespace LamHyStore.Entities.Models
{
    public class LiveStream
    {
        public Guid Id { get; set; }

        public string Title { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        public string Slug { get; set; }

        public string ProductPinExternalID { get; set; }

        [JsonIgnore]
        public ICollection<LiveStreamCart>? liveStreamCarts { get; set; }
    }
}
