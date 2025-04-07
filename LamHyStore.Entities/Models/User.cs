using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace LamHyStore.Entities.Models
{
    public class User : IdentityUser
    {
        public string FullName { get; set; }
        // CustomerID of KiotViet
        public string? CustomerExternalID { get; set; }

        public ICollection<Order>? Orders { get; set; }
    }
}
