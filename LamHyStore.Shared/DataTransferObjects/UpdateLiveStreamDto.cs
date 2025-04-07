using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LamHyStore.Shared.DataTransferObjects
{
    public class UpdateLiveStreamDto
    {
        public string Name { get; set; }
        public List<string> AddProductExternalIds { get; set; }
        public List<string> RemoveProductExternalIds { get; set; }
    }
}
