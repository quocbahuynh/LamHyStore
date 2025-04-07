using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LamHyStore.Entities.Exceptions
{
    public class UserNotFoundException : NotFoundException
    {
        public UserNotFoundException() : base(" User doesn't exist in the database.")
        {   
        }
    }
}
