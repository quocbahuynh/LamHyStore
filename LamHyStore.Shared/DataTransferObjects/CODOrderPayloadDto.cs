using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LamHyStore.Shared.DataTransferObjects
{
   
    public class CODOrderPayloadDto
    {
        public string FullName { get; set; }
        public string Description { get; set; }
        public string Address { get; set; }

        public string Province { get; set; }

        public string District { get; set; }

        public string Commune { get; set; }
        public string ContactNumber { get; set; }
        public double CostDelivery { get; set; }
        public double TotalPayment { get; set; }

        //COD, VNPAYQR, VNBANK, INTCARD
        public string PaymentMethod { get; set; }

        public List<OrderDetailsKiotViet> OrderDetails { get; set; }
    }


}
