using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LamHyStore.Entities.Models
{
    public class Token
    {
        public Guid Id { get; set; }

        public string AccessToken { get; set; }
    }
}
