using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace LamHyStore.Shared.RequestModel
{
    public class CategoryPayload
    {
        [JsonProperty("lastModifiedFrom")]
        public DateTime? LastModifiedFrom { get; set; } // Thời gian cập nhật

        [JsonProperty("pageSize")]
        public int? PageSize { get; set; } // Số items trong 1 trang, mặc định 20 items, tối đa 100 items

        [JsonProperty("currentItem")]
        public int? CurrentItem { get; set; } // Lấy dữ liệu từ bản ghi hiện tại, mặc định là 0

        [JsonProperty("orderBy")]
        public string? OrderBy { get; set; } // Sắp xếp dữ liệu theo trường orderBy (Ví dụ: orderBy=name)

        [JsonProperty("orderDirection")]
        public string? OrderDirection { get; set; } // Sắp xếp kết quả trả về theo: Tăng dần Asc (mặc định), giảm dần Desc

        [JsonProperty("hierachicalData")]
        public bool HierachicalData { get; set; }
    }
}
