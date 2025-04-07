using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LamHyStore.Entities.Models;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace LamHyStore.Contracts
{
    public interface ILiveStreamRepository : IRepositoryBase<LiveStream>
    {
        Task<LiveStream> GetLiveStreamByIdAsync(Guid id, bool trackChanges);


    }
}
