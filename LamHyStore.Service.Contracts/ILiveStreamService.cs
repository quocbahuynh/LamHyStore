using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LamHyStore.Entities.Models;
using LamHyStore.Shared.DataTransferObjects;

namespace LamHyStore.Service.Contracts
{
    public interface ILiveStreamService
    {
        Task<(LiveStreamForUpdateDto livestreamToPatch, LiveStream livestreamEntity)> GetLiveStreamForPatch(string id, bool TrackChanges);

        void SaveChangesForPatch(LiveStreamForUpdateDto livestreamToPatch, LiveStream livestreamEntity);
    }
}
