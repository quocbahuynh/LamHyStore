using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LamHyStore.Shared.DataTransferObjects
{
    public class UserForRegistrationDto
    {
        public string? FullName { get; init; }
        public string? Password { get; init; }
        public string? Email { get; init; }
        public string? PhoneNumber { get; init; }

        public ICollection<string>? Roles { get; init; }
    }
}
