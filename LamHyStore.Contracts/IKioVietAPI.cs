using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LamHyStore.Shared.RequestModel;
using LamHyStore.Shared.ResponseModel;
using LamHyStore.Shared.DataTransferObjects;

namespace LamHyStore.Contracts
{
    public interface IKioVietAPI
    {
        Task<KiotVietTokenResponse> GetAccessTokenAsync();

        Task<CustomerResponse> FindCustomerByPhoneNumberAsync(string phoneNumbesr);

        Task<CreatedCustomerData> CreatedCustomerByAsync(CreateCustomerPayload payload);

        Task<CustomerDetailResponse> GetCustomerProfileByKiotVietIDAsync(string userID);

        Task<OrderListResponse> GetCustomerOrderHistoryByKiotVietIDAsync(string userID, int pageSize, int currentItem);

        Task<ProductResponse> GetProductListAsync(string searchName, int pageSize, int currentItem);

        Task<ProductResponse> GetProductListByGroupIdAsync(string categoryId, int pageSize, int currentItem);

        Task<ProductDetailResponse> GetProductDetailAsync(string id);

        Task<ProductDetailResponse> GetProductDetailCodeAsync(string id);

        Task<BranchResponse> GetBranchListAsync();

        Task<CategoryResponse> GetCategoryListAsync();

        Task<List<CategoryData>> GetAllCategoriesAsync();

        Task<CodOrderResponse> CreateCODOrderAsync(CODOrderKioVietPayload payload);

        Task<object> UpdateOrderAsync(UpdateOrderPayload payload, string Id);

        Task<object> CancelOrderAsync(string Id);

    }

}
