using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LamHyStore.Shared.DataTransferObjects
{
    public class LiveStreamDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public DateTime CreatedDate { get; set; }
        public string ProductPinExternalID { get; set; }

        public string Slug {  get; set; }

        // Include LiveStreamCart information in the DTO
        public IEnumerable<LiveStreamCartItemDto> LiveStreamCarts { get; set; }
    }
}
