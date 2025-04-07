using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LamHyStore.Shared.DataTransferObjects
{
    public record LiveStreamForCreationDto
    {
        public string? Title { get; init; }
        public string? ProductPinExternalID { get; init; }

        public ICollection<string>? ProductExternalID { get; init; }
    }
}
