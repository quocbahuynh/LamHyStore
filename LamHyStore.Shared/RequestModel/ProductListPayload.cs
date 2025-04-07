using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace LamHyStore.Shared.RequestModel
{
    public class ProductListPayload
    {
        public Boolean includeInventory { get; set; }

        public Boolean isActive { get; set; }

        public string categoryId { get; set; }

        public string name { get; set; }

        public int pageSize { get; set; }

        public int currentItem { get; set; }

    }
}
