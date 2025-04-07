using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LamHyStore.Contracts;
using LamHyStore.Entities.Models;

using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using LamHyStore.Service.Contracts;
using LamHyStore.Shared.DataTransferObjects;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace LamHyStore.Service
{
    public class LiveStreamService : ILiveStreamService
    {
        private readonly IRepositoryManager _repo;
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;
        private readonly ILoggerManager _logger;
        private readonly IKioVietAPI _kioVietApi;
        private readonly IMapper _mapper;

        public LiveStreamService(
         IRepositoryManager repo,
         UserManager<User> userManager,
         IConfiguration configuration,
         ILoggerManager logger,
         IKioVietAPI kioVietApi,
         IMapper mapper
         )
        {
            _repo = repo;
            _userManager = userManager;
            _configuration = configuration;
            _logger = logger;
            _kioVietApi = kioVietApi;
            _mapper = mapper;

        }

        public async Task<(LiveStreamForUpdateDto livestreamToPatch, LiveStream livestreamEntity)> GetLiveStreamForPatch(string id, bool TrackChanges) {
            var livestream = await _repo.LiveStream.FindByCondition(ls => ls.Id.ToString().Equals(id), TrackChanges).FirstOrDefaultAsync();

            var livestreamDto = _mapper.Map<LiveStreamForUpdateDto>(livestream);

            return (livestreamDto, livestream);
        }

        public void SaveChangesForPatch(LiveStreamForUpdateDto livestreamToPatch, LiveStream livestreamEntity) { 
            _mapper.Map(livestreamToPatch, livestreamEntity);
            _repo.Save();
        }
    }
}
