using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LamHyStore.Contracts;
using LamHyStore.Entities.Models;
using Microsoft.EntityFrameworkCore;
using Repositorys;

namespace LamHyStore.Repository
{
    public class LiveStreamCartRepository : RepositoryBase<LiveStreamCart>, ILiveStreamCartRepository
    {
        public LiveStreamCartRepository(RepositoryContext repositoryContext) : base(repositoryContext)
        {
        }

        public async Task<IEnumerable<LiveStreamCart>> GetByLiveStreamIdAsync(string id, bool trackChanges) =>
            await FindByCondition(x => x.LiveStreamId.ToString().Equals(id), trackChanges).ToListAsync();
    }
}
