using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LamHyStore.Entities.Models;

namespace LamHyStore.Contracts
{
    public interface ILiveStreamCartRepository : IRepositoryBase<LiveStreamCart>
    {
        Task<IEnumerable<LiveStreamCart>> GetByLiveStreamIdAsync(string id, bool trackChanges);
    }
}
