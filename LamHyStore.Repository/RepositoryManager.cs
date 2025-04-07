using LamHyStore.Contracts;
using Repositorys;

namespace LamHyStore.Repository
{
    public sealed class RepositoryManager : IRepositoryManager
    {
        private readonly RepositoryContext _repositoryContext;
        private readonly Lazy<ILiveStreamRepository> _livestreamRepository;
        private readonly Lazy<ILiveStreamCartRepository> _livestreamCartRepository;
        public RepositoryManager(RepositoryContext repositoryContext)
        {
            _repositoryContext = repositoryContext;
            _livestreamRepository = new Lazy<ILiveStreamRepository>(() => new LiveStreamRepository(repositoryContext));
            _livestreamCartRepository = new Lazy<ILiveStreamCartRepository>(() => new LiveStreamCartRepository(repositoryContext));
        }
        public ILiveStreamRepository LiveStream => _livestreamRepository.Value;
        public ILiveStreamCartRepository LiveStreamCart => _livestreamCartRepository.Value;

        public void Save() => _repositoryContext.SaveChanges();
    }

}
