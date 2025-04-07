namespace LamHyStore.Entities.Models
{
    public class Order {

        public Guid Id { get; set; }

        // Status: Pending, Success, Faild
        public string? OrderStatus { get; set; }

        public double? Feeship { get; set; }


        // TotalPayment
        public double? TotalPayment { get; set; }

        public string? Note {  get; set; }

        // Order ID of KiotViet
        public string? OrderExternalID { get; set; }

        public string? PaymentMethodName { get; set; }

        public string? PhoneNumber {  get; set; }

        // Date when the order was created
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }
}
