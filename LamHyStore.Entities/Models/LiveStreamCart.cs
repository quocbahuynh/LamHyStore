using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LamHyStore.Entities.Models
{
    public class LiveStreamCart
    {
        public Guid Id { get; set; }
        public string ProductExternalID { get; set; }

        [ForeignKey(nameof(LiveStream))]
        public Guid LiveStreamId { get; set; }
        public LiveStream? LiveStream { get; set; }
    }
}
