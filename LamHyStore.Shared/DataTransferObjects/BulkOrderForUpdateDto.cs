using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LamHyStore.Shared.DataTransferObjects
{
    public class BulkOrderForUpdateDto
    {
        public string? Name { get; set; }

        public string StartDate { get; set; }

        public string EndDate { get; set; }
        public IList<string>? AddProductExternalIds { get; set; }
        public IList<string>? RemoveProductExternalIds { get; set; }
    }
}
