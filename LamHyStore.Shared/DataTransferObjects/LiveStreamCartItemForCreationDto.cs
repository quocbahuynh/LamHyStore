using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LamHyStore.Shared.DataTransferObjects
{
    public class LiveStreamCartItemForCreationDto
    {
        public string ProductExternalID { get; set; }
        public string LiveStreamId { get; set; }
    }
}
