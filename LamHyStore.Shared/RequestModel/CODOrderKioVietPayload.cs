using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LamHyStore.Shared.DataTransferObjects
{
    public class CODOrderKioVietPayload
    {
        public int BranchId { get; set; }
        public string Method { get; set; }
        public string Description { get; set; }
        public double TotalPayment { get; set; }
        public List<OrderDetailsKiotViet> orderDetails { get; set; }
        public OrderDelivery OrderDelivery { get; set; }
        public Customer? Customer { get; set; }
    }

    public class OrderDetailsKiotViet
    {
        public int ProductId { get; set; }
        public string ProductCode { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }

    public class OrderDelivery
    {
        public string Receiver { get; set; }
        public string ContactNumber { get; set; }
        public decimal Price { get; set; }
        public string Address { get; set; }
    }

    public class Customer
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string ContactNumber { get; set; }
        public string Email { get; set; }
    }
}
