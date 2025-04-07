using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace LamHyStore.Shared.RequestModel
{
    public class CreateCustomerPayload
    {
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("contactNumber")]
        public string ContactNumber { get; set; }

        [JsonProperty("email")]
        public string Email { get; set; }

        [JsonProperty("comments")]
        public string Comments { get; set; }

        [JsonProperty("branchId")]
        public int BranchId { get; set; }

        [JsonProperty("groupIds")]
        public List<int> GroupIds { get; set; }
    }
}
