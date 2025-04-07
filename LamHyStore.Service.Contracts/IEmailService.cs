using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LamHyStore.Service.Contracts
{
    public interface IEmailService
    {
        Task SendOtpEmail(string email, string otp);
    }
}
