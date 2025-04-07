using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LamHyStore.Shared.ResponseModel
{
    public class CodOrderResponse
    {
        public string Id { get; set; }
        public string Code { get; set; }
        public DateTime PurchaseDate { get; set; }
        public int BranchId { get; set; }
        public string BranchName { get; set; }
        public long? SoldById { get; set; }
        public string SoldByName { get; set; }
        public long? CustomerId { get; set; }
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
        public List<OrderDetail> OrderDetails { get; set; }
        public OrderDelivery OrderDelivery { get; set; }
        public List<Payment> Payments { get; set; }
        public List<InvoiceOrderSurcharge> InvoiceOrderSurcharges { get; set; }
    }

    public class OrderDetail
    {
        public long ProductId { get; set; }
        public string ProductName { get; set; }
        public bool IsMaster { get; set; }
        public double Quantity { get; set; }
        public decimal Price { get; set; }
        public double? DiscountRatio { get; set; }
        public decimal? Discount { get; set; }
        public string Note { get; set; }
    }

    public class OrderDelivery
    {
        public string DeliveryCode { get; set; }
        public byte? Type { get; set; }
        public decimal? Price { get; set; }
        public string Receiver { get; set; }
        public string ContactNumber { get; set; }
        public string Address { get; set; }
        public int? LocationId { get; set; }
        public string LocationName { get; set; }
        public string WardName { get; set; }
        public double? Weight { get; set; }
        public double? Length { get; set; }
        public double? Width { get; set; }
        public double? Height { get; set; }
        public long? PartnerDeliveryId { get; set; }
        public PartnerDelivery PartnerDelivery { get; set; }
    }

    public class PartnerDelivery
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string ContactNumber { get; set; }
        public string Email { get; set; }
    }

    public class Payment
    {
        public long Id { get; set; }
        public string Code { get; set; }
        public decimal Amount { get; set; }
        public string Method { get; set; }
        public byte? Status { get; set; }
        public string StatusValue { get; set; }
        public DateTime TransDate { get; set; }
        public string BankAccount { get; set; }
        public int? AccountId { get; set; }
    }

    public class InvoiceOrderSurcharge
    {
        public long Id { get; set; }
        public long? InvoiceId { get; set; }
        public long? SurchargeId { get; set; }
        public string SurchargeName { get; set; }
        public decimal? SurValue { get; set; }
        public decimal? Price { get; set; }
        public DateTime CreatedDate { get; set; }
    }

}
