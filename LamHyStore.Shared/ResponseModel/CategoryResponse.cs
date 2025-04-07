using Newtonsoft.Json;

namespace LamHyStore.Shared.ResponseModel
{
    public class CategoryResponse
    {
        [JsonProperty("total")]
        public int Total { get; set; }

        [JsonProperty("pageSize")]
        public int PageSize { get; set; }

        [JsonProperty("data")]
        public List<CategoryData> Data { get; set; }

        [JsonProperty("removedIds")]
        public int[] RemovedIds { get; set; } // Danh sách ID nhóm hàng bị xóa dựa trên Modified Date

        [JsonProperty("timestamp")]
        public DateTime Timestamp { get; set; }
    }

    public class CategoryData
    {
        [JsonProperty("categoryId")]
        public int CategoryId { get; set; } // ID nhóm hàng hóa

        [JsonProperty("parentId")]
        public int? ParentId { get; set; } // Nếu có danh mục cha thì có id cụ thể, nếu không có thì ParentId=null

        [JsonProperty("categoryName")]
        public string CategoryName { get; set; } // Tên nhóm hàng hóa

        [JsonProperty("retailerId")]
        public int RetailerId { get; set; } // Id cửa hàng

        [JsonProperty("hasChild")]
        public bool? HasChild { get; set; } // Nhóm hàng có con hay không

        [JsonProperty("modifiedDate")]
        public DateTime? ModifiedDate { get; set; } // Thời gian cập nhật

        [JsonProperty("createdDate")]
        public DateTime CreatedDate { get; set; }
    }
}
