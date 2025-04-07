using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace LamHyStore.Shared.RequestModel
{
    public class BranchPayload
    {
        [JsonProperty("lastModifiedFrom")]
        public DateTime? LastModifiedFrom { get; set; } // Thời gian cập nhật

        [JsonProperty("pageSize")]
        public int? PageSize { get; set; } // Số items trong 1 trang (mặc định 20, tối đa 100)

        [JsonProperty("currentItem")]
        public int? CurrentItem { get; set; }

        [JsonProperty("orderBy")]
        public string OrderBy { get; set; } // Trường orderBy (Ví dụ: orderBy=name)

        [JsonProperty("orderDirection")]
        public string OrderDirection { get; set; } // Sắp xếp theo: Asc (mặc định), Desc

        [JsonProperty("includeRemoveIds")]
        public bool IncludeRemoveIds { get; set; }
    }
}
