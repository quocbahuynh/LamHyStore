using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LamHyStore.Shared.ResponseModel
{
    public class UpdateOrderResponse
    {
        public long Id { get; set; }
        public string Code { get; set; }
        public DateTime PurchaseDate { get; set; }
        public int BranchId { get; set; }
        public string BranchName { get; set; }
        public long? SoldById { get; set; }
        public string SoldByName { get; set; }
        public long CustomerId { get; set; }
        public string CustomerName { get; set; }
        public decimal Total { get; set; }
        public decimal TotalPayment { get; set; }
        public double? DiscountRatio { get; set; }
        public decimal? Discount { get; set; }
        public string Method { get; set; }
        public int Status { get; set; }
        public string StatusValue { get; set; }
        public string Description { get; set; }
        public bool UsingCod { get; set; }
        public int? SaleChannelId { get; set; }
        public OrderDetails OrderDetails { get; set; }
        public OrderDelivery OrderDelivery { get; set; }
        public List<Payment> Payments { get; set; }
        public List<InvoiceOrderSurcharge> InvoiceOrderSurcharges { get; set; }
    }

    public class OrderDetails
    {
        public long ProductId { get; set; }
        public string ProductName { get; set; }
        public bool IsMaster { get; set; }
        public double Quantity { get; set; }
        public decimal Price { get; set; }
        public double? DiscountRatio { get; set; }
        public decimal? Discount { get; set; }
    }

}
