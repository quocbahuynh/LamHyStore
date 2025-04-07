using LamHyStore.Contracts;
using LamHyStore.Entities.Models;
using Repositorys;

namespace LamHyStore.Repository
{
    public class OrderRepository : RepositoryBase<Order>, IOrderRepository 
    {
        public OrderRepository(RepositoryContext repositoryContext) : base(repositoryContext)
        {
        }
    }
}
