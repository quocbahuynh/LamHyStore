namespace LamHyStore.Shared.DataTransferObjects
{
    public class BulkOrderSheet
    {

    }

    public class BulkOrderSheetOrder
    {
        public string Name { get; set; }
        public string PhoneNumber { get; set; }
        public string DeliveryAddress { get; set; }
        public string PaymentMethod { get; set; }
        public string DeliveryMethod { get; set; }
        public string Products { get; set; }

        public double TotalPayment { get; set; }
        public List<OrderDetailsKiotViet> OrderDetails { get; set; }
    }
}
