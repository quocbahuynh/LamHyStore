using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LamHyStore.Shared.DataTransferObjects
{
    public class ResetPasswordDto
    {
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string Otp { get; set; }
        public string NewPassword { get; set; }
    }
}
