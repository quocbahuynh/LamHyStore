using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace LamHyStore.Shared.ResponseModel
{
    public class OrderResponse
    {
        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("code")]
        public string Code { get; set; }

        [JsonProperty("purchaseDate")]
        public DateTime PurchaseDate { get; set; }

        [JsonProperty("branchId")]
        public int BranchId { get; set; }

        [JsonProperty("branchName")]
        public string BranchName { get; set; }

        [JsonProperty("soldById")]
        public int SoldById { get; set; }

        [JsonProperty("soldByName")]
        public string SoldByName { get; set; }

        [JsonProperty("customerId")]
        public int CustomerId { get; set; }

        [JsonProperty("customerCode")]
        public string CustomerCode { get; set; }

        [JsonProperty("customerName")]
        public string CustomerName { get; set; }

        [JsonProperty("total")]
        public decimal Total { get; set; }

        [JsonProperty("totalPayment")]
        public decimal TotalPayment { get; set; }

        [JsonProperty("discount")]
        public decimal Discount { get; set; }

        [JsonProperty("status")]
        public int Status { get; set; }

        [JsonProperty("statusValue")]
        public string StatusValue { get; set; }

        [JsonProperty("retailerId")]
        public int RetailerId { get; set; }

        [JsonProperty("usingCod")]
        public bool UsingCod { get; set; }

        [JsonProperty("modifiedDate")]
        public DateTime ModifiedDate { get; set; }

        [JsonProperty("createdDate")]
        public DateTime CreatedDate { get; set; }

        [JsonProperty("PriceBookId")]
        public int PriceBookId { get; set; }

        [JsonProperty("Extra")]
        public string Extra { get; set; }

        [JsonProperty("orderDetails")]
        public List<OrderProductItemResponse> OrderDetails { get; set; }
    }
}
