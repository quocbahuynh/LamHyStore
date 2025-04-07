using LamHyStore.Contracts;
using LamHyStore.Entities.Models;
using Microsoft.EntityFrameworkCore;
using Repositorys;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace LamHyStore.Repository
{
    public class LiveStreamRepository : RepositoryBase<LiveStream>, ILiveStreamRepository
    {
        public LiveStreamRepository(RepositoryContext repositoryContext) : base(repositoryContext)
        {
        }

        // Add any specific methods for LiveStreamRepository here

        public async Task<LiveStream> GetLiveStreamByIdAsync(Guid id, bool trackChanges)
        {
            var liveStream = await RepositoryContext.LiveStreams
                .Include(ls => ls.liveStreamCarts)
                .AsTracking() // Use AsNoTracking() if you don't need tracking
                .FirstOrDefaultAsync(ls => ls.Id == id);
            return liveStream;
        }
    }
}
