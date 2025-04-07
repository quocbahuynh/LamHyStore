using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace LamHyStore.Shared.ResponseModel
{
    public class CustomerResponse
    {
        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("code")]
        public string Code { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("gender")]
        public bool Gender { get; set; }

        [JsonProperty("contactNumber")]
        public string ContactNumber { get; set; }

        [JsonProperty("retailerId")]
        public int RetailerId { get; set; }

        [JsonProperty("branchId")]
        public int BranchId { get; set; }

        [JsonProperty("locationName")]
        public string LocationName { get; set; }

        [JsonProperty("wardName")]
        public string WardName { get; set; }

        [JsonProperty("modifiedDate")]
        public DateTime ModifiedDate { get; set; }

        [JsonProperty("createdDate")]
        public DateTime CreatedDate { get; set; }

        [JsonProperty("type")]
        public int Type { get; set; }

        [JsonProperty("organization")]
        public string Organization { get; set; }

        [JsonProperty("debt")]
        public decimal Debt { get; set; }

        [JsonProperty("rewardPoint")]
        public int RewardPoint { get; set; }
    }
}
