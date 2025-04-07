using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace LamHyStore.Shared.ResponseModel
{
    public class CustomerDetailResponse
    {
        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("code")]
        public string Code { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("contactNumber")]
        public string ContactNumber { get; set; }

        [JsonProperty("address")]
        public string Address { get; set; }

        [JsonProperty("retailerId")]
        public int RetailerId { get; set; }

        [JsonProperty("branchId")]
        public int BranchId { get; set; }

        [JsonProperty("locationName")]
        public string LocationName { get; set; }

        [JsonProperty("wardName")]
        public string WardName { get; set; }

        [JsonProperty("email")]
        public string Email { get; set; }

        [JsonProperty("createdDate")]
        public DateTime CreatedDate { get; set; }

        [JsonProperty("type")]
        public int Type { get; set; }

        [JsonProperty("comments")]
        public string Comments { get; set; }

        [JsonProperty("groups")]
        public string Groups { get; set; }

        [JsonProperty("totalInvoiced")]
        public decimal TotalInvoiced { get; set; }

        [JsonProperty("totalRevenue")]
        public decimal TotalRevenue { get; set; }

        [JsonProperty("totalPoint")]
        public int TotalPoint { get; set; }
    }
}
