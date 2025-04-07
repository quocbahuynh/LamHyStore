using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace LamHyStore.Shared.ResponseModel
{
    public class BranchResponse
    {
        [JsonProperty("removedIds")]
        public int[] RemovedIds { get; set; } // Chi nhánh ngừng hoạt động

        [JsonProperty("total")]
        public int Total { get; set; }

        [JsonProperty("pageSize")]
        public int PageSize { get; set; }

        [JsonProperty("data")]
        public List<BranchData> Data { get; set; }

        [JsonProperty("timestamp")]
        public DateTime Timestamp { get; set; }
    }

    public class BranchData
    {
        [JsonProperty("id")]
        public int Id { get; set; } // Id chi nhánh

        [JsonProperty("branchName")]
        public string BranchName { get; set; }

        [JsonProperty("branchCode")]
        public string BranchCode { get; set; }

        [JsonProperty("contactNumber")]
        public string ContactNumber { get; set; }

        [JsonProperty("retailerId")]
        public int RetailerId { get; set; } // Id cửa hàng

        [JsonProperty("email")]
        public string Email { get; set; }

        [JsonProperty("address")]
        public string Address { get; set; }

        [JsonProperty("modifiedDate")]
        public DateTime? ModifiedDate { get; set; }

        [JsonProperty("createdDate")]
        public DateTime CreatedDate { get; set; }
    }
}
