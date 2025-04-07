using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LamHyStore.Shared.RequestModel
{
    public class CustomerOrderHistoryPayload
    {
        public long customerIds { get; set; }

        public int pageSize { get; set; }

        public int currentItem { get; set; } 
    }
}
