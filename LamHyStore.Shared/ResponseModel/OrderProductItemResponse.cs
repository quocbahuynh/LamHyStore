using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace LamHyStore.Shared.ResponseModel
{
    public class OrderProductItemResponse
    {
        [JsonProperty("productId")]
        public int ProductId { get; set; }

        [JsonProperty("productCode")]
        public string ProductCode { get; set; }

        [JsonProperty("productName")]
        public string ProductName { get; set; }

        [JsonProperty("isMaster")]
        public bool IsMaster { get; set; }

        [JsonProperty("quantity")]
        public int Quantity { get; set; }

        [JsonProperty("price")]
        public decimal Price { get; set; }

        [JsonProperty("discount")]
        public decimal Discount { get; set; }

        [JsonProperty("discountRatio")]
        public decimal DiscountRatio { get; set; }

        [JsonProperty("note")]
        public string Note { get; set; }

        [JsonProperty("viewDiscount")]
        public decimal ViewDiscount { get; set; }
    }
}
