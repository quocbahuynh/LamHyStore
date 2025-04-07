using LamHyStore.Entities.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using LamHyStore.Service.Contracts;
using LamHyStore.Shared.lib;
using System;
using System.Collections.Generic;

namespace LamHyStore.VNpayService
{
    public class VNpayService : IVNpayService
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public VNpayService(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
        }

        public string VNPAY_CreatePaymentURL(Order order)
        {
            // Get configuration values
            string vnp_Returnurl = _configuration["Vnpay:vnp_Returnurl"]; // URL to receive return results
            string vnp_Url = _configuration["Vnpay:vnp_Url"];             // Payment URL of VNPAY
            string vnp_TmnCode = _configuration["Vnpay:vnp_TmnCode"];     // Merchant Terminal ID
            string vnp_HashSecret = _configuration["Vnpay:vnp_HashSecret"]; // Secret Key

            // Initialize VnPayLibrary
            VnPayLibrary vnpay = new VnPayLibrary();

            // Add payment parameters
            vnpay.AddRequestData("vnp_Version", VnPayLibrary.VERSION);
            vnpay.AddRequestData("vnp_Command", "pay");
            vnpay.AddRequestData("vnp_TmnCode", vnp_TmnCode);
            vnpay.AddRequestData("vnp_Amount", order.TotalPayment.ToString());
            vnpay.AddRequestData("vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss")); // Current timestamp
            vnpay.AddRequestData("vnp_CurrCode", "VND"); // Currency code
            vnpay.AddRequestData("vnp_IpAddr", Utils.GetIpAddress(_httpContextAccessor)); // Client IP Address
            vnpay.AddRequestData("vnp_BankCode", order.PaymentMethodName);

            // Locale and order information
            vnpay.AddRequestData("vnp_Locale", "vn"); // Default locale: Vietnamese
            vnpay.AddRequestData("vnp_OrderInfo", $"Thanh toan don hang: {order.OrderExternalID}");
            vnpay.AddRequestData("vnp_OrderType", "other"); // Default value: "other"

            // Add return URL and transaction reference
            vnpay.AddRequestData("vnp_ReturnUrl", vnp_Returnurl);
            vnpay.AddRequestData("vnp_TxnRef", order.Id.ToString()); // Unique order reference ID

            // Generate payment URL
            string paymentUrl = vnpay.CreateRequestUrl(vnp_Url, vnp_HashSecret);

            return paymentUrl;
        }

        public bool ValidateSignature(IEnumerable<KeyValuePair<string, string>> queryData, out string orderId, out string vnp_ResponseCode, out string vnp_TransactionStatus)
        {
            string vnp_HashSecret = _configuration["Vnpay:vnp_HashSecret"];
            VnPayLibrary vnpay = new VnPayLibrary();

            foreach (var s in queryData)
            {
                //get all querystring data
                if (!string.IsNullOrEmpty(s.Key) && s.Key.StartsWith("vnp_"))
                {
                    vnpay.AddResponseData(s.Key, s.Value);
                }
            }

            orderId = vnpay.GetResponseData("vnp_TxnRef");
            vnp_ResponseCode = vnpay.GetResponseData("vnp_ResponseCode");
            vnp_TransactionStatus = vnpay.GetResponseData("vnp_TransactionStatus");
            string vnp_SecureHash = vnpay.GetResponseData("vnp_SecureHash");

            return vnpay.ValidateSignature(vnp_SecureHash, vnp_HashSecret);
        }
    }
}
