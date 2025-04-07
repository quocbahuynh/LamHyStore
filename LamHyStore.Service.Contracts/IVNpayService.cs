using LamHyStore.Entities.Models;
using System.Collections.Generic;

namespace LamHyStore.Service.Contracts
{
    public interface IVNpayService
    {
        string VNPAY_CreatePaymentURL(Order order);
        bool ValidateSignature(IEnumerable<KeyValuePair<string, string>> queryData, out string orderId, out string vnp_ResponseCode, out string vnp_TransactionStatus);
    }
}
