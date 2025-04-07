using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace LamHyStore.Shared.ResponseModel
{
    public class CreatedCustomer
    {
        [JsonProperty("message")]
        public string Message { get; set; }

        [JsonProperty("data")]
        public CreatedCustomerData Data { get; set; }
    }
}
