using LamHyStore.Entities.Models;
using LamHyStore.Shared.RequestModel;
using LamHyStore.Shared.ResponseModel;
using LamHyStore.Contracts;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Repositorys;
using LamHyStore.Shared.DataTransferObjects;

namespace LamHyStore.KioVietService
{
    public class KioVietAPI : IKioVietAPI
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
       private  readonly RepositoryContext _repositoryContext;

        public KioVietAPI(HttpClient httpClient, IConfiguration configuration, RepositoryContext repositoryContext)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _repositoryContext = repositoryContext;
        }

        public async Task<KiotVietTokenResponse> GetAccessTokenAsync()
        {
            // Read settings from appsettings.json
            var clientId = _configuration["KioVietStrings:client_id"];
            var clientSecret = _configuration["KioVietStrings:client_secret"];
            var grantType = _configuration["KioVietStrings:grant_type"];
            var scope = _configuration["KioVietStrings:scopes"];

            // Prepare form data for x-www-form-urlencoded request
            var formData = new Dictionary<string, string>
        {
            { "client_id", clientId },
            { "client_secret", clientSecret },
            { "grant_type", grantType },
            { "scope", scope }
        };

            // Set up the request content (x-www-form-urlencoded)
            var content = new FormUrlEncodedContent(formData);

            // Send the POST request to KiotViet token endpoint
            var response = await _httpClient.PostAsync("https://id.kiotviet.vn/connect/token", content);

            if (response.IsSuccessStatusCode)
            {
                // Parse the response and extract the access token
                var responseString = await response.Content.ReadAsStringAsync();
                var tokenResponse = JsonConvert.DeserializeObject<KiotVietTokenResponse>(responseString);
                var existingToken = await _repositoryContext.Tokens.FirstOrDefaultAsync();

                if (existingToken == null)
                {
                    // Optionally check if token is expired here based on expiration time, if stored in database
                    // Assuming expiration date is stored, otherwise consider using token expiration logic.

                    var token = new Token
                    {
                        Id = Guid.NewGuid(),
                        AccessToken = tokenResponse.AccessToken
                    };
                    await _repositoryContext.Tokens.AddAsync(token);
                    await _repositoryContext.SaveChangesAsync();
                    return tokenResponse; 
                } 

                existingToken.AccessToken = tokenResponse.AccessToken;
                await _repositoryContext.SaveChangesAsync();


                return tokenResponse;
            }
            else
            {
                // Handle error (log or throw exception)
                throw new Exception($"Failed to retrieve access token. Status code: {response.StatusCode}");
            }
        }

        // Helper method to retrieve existing access token or request a new one if needed
        private async Task<string> GetValidAccessTokenAsync()
        {
            var existingToken = await _repositoryContext.Tokens.FirstOrDefaultAsync();

            if (existingToken != null)
            {
                // Optionally check if token is expired here based on expiration time, if stored in database
                // Assuming expiration date is stored, otherwise consider using token expiration logic.

                return existingToken.AccessToken;
            }

            // If no token exists or the existing token is invalid, request a new one
            var tokenResponse = await GetAccessTokenAsync();
            return tokenResponse.AccessToken;
        }

        public async Task<HttpRequestMessage> CreatedRequest<T>(T payload, string URL, HttpMethod method)
        {
            // Get valid access token, either from DB or newly obtained
            var jwtToken = await GetValidAccessTokenAsync();
            var retailer = _configuration["KioVietStrings:Retailer"];

            var request = new HttpRequestMessage(method, URL);

            // Set headers
            request.Headers.Add("Authorization", $"Bearer {jwtToken}");
            request.Headers.Add("Retailer", retailer);

            if (payload != null)
            {
                // Serialize the payload to JSON
                var jsonPayload = JsonConvert.SerializeObject(payload);
                var content = new StringContent(jsonPayload, System.Text.Encoding.UTF8, "application/json");

                // Add the content to the request
                request.Content = content;
            }

            return request;
        }

        public async Task<HttpResponseMessage> sendRequest(HttpRequestMessage request) {
            var response = await _httpClient.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                return response;
            }
            else {
                await GetAccessTokenAsync();
                response = await _httpClient.SendAsync(request);
            }

            return response; 
        }

        public async Task<BranchResponse> GetBranchListAsync() {
            var URL = "https://public.kiotapi.com/branches";
            var request = await CreatedRequest<object>(null, URL, HttpMethod.Get);
            var response = await sendRequest(request);

            if (response.IsSuccessStatusCode)
            {
                // Step 9: Deserialize the response JSON into the customer list
                var responseString = await response.Content.ReadAsStringAsync();
                var branchesResponse = JsonConvert.DeserializeObject<BranchResponse>(responseString);

                return branchesResponse;
            }
            else
            {
                // Step 10: Handle error responses
                var errorDetails = await response.Content.ReadAsStringAsync();
                throw new Exception($"Failed to retrieve branch data. Status code: {response.StatusCode}, Details: {errorDetails}");
            }
        }

        public async Task<List<CategoryData>> GetAllCategoriesAsync()
        {
            int pageSize = 200; // Maximum page size allowed by the API
            int currentItem = 0; // Start fetching from the first item
            bool hasMoreItems = true;
            List<CategoryData> allCategories = new List<CategoryData>();

            while (hasMoreItems)
            {
                // Create the payload for the current request
                CategoryPayload payload = new CategoryPayload
                {
                    HierachicalData = false,
                    PageSize = pageSize,
                    CurrentItem = currentItem
                };

                var URL = "https://public.kiotapi.com/categories";
                var request = await CreatedRequest(payload, URL, HttpMethod.Get);
                var response = await sendRequest(request);

                if (response.IsSuccessStatusCode)
                {
                    // Deserialize the response
                    var responseString = await response.Content.ReadAsStringAsync();
                    var categoryResponse = JsonConvert.DeserializeObject<CategoryResponse>(responseString);

                    if (categoryResponse != null && categoryResponse.Data != null)
                    {
                        // Add the current batch of categories to the list
                        allCategories.AddRange(categoryResponse.Data);

                        // Check if more items need to be fetched
                        if (categoryResponse.Data.Count < pageSize)
                        {
                            hasMoreItems = false; // No more items to fetch
                        }
                        else
                        {
                            currentItem += pageSize; // Increment the offset
                        }
                    }
                    else
                    {
                        hasMoreItems = false; // No data in the response
                    }
                }
                else
                {
                    // Handle error responses
                    var errorDetails = await response.Content.ReadAsStringAsync();
                    throw new Exception($"Failed to retrieve categories data. Status code: {response.StatusCode}, Details: {errorDetails}");
                }
            }

            return allCategories;
        }

        public async Task<CategoryResponse> GetCategoryListAsync()
        {
            CategoryPayload payload = new CategoryPayload
            {
                HierachicalData = false,
                PageSize = 500
            };

            var URL = "https://public.kiotapi.com/categories";
            var request = await CreatedRequest<CategoryPayload>(payload, URL, HttpMethod.Get);
            var response = await sendRequest(request);

            if (response.IsSuccessStatusCode)
            {
                // Step 9: Deserialize the response JSON into the customer list
                var responseString = await response.Content.ReadAsStringAsync();
                var categoiesResponse = JsonConvert.DeserializeObject<CategoryResponse>(responseString);

                return categoiesResponse;
            }
            else
            {
                // Step 10: Handle error responses
                var errorDetails = await response.Content.ReadAsStringAsync();
                throw new Exception($"Failed to retrieve categories data. Status code: {response.StatusCode}, Details: {errorDetails}");
            }
        }


        public async Task<CustomerResponse> FindCustomerByPhoneNumberAsync(string phoneNumber) {

            CustomerPayload payload = new CustomerPayload
            {
                ContactNumber = phoneNumber
            };
            var URL = "https://public.kiotapi.com/customers";

            var request = await CreatedRequest<CustomerPayload>(payload, URL, HttpMethod.Get);

            var response = await sendRequest(request);

            if (response.IsSuccessStatusCode)
            {
                // Step 9: Deserialize the response JSON into the customer list
                var responseString = await response.Content.ReadAsStringAsync();
                var customersResponse = JsonConvert.DeserializeObject<CustomerListResponse>(responseString);

                // Check if there are any customers in the list
                if (customersResponse.Data != null && customersResponse.Data.Any())
                {
                    var firstCustomer = customersResponse.Data[0];  // Get the first customer
                    return firstCustomer;
                }
                else
                {
                    return null;
                }
            }
            else
            {
                // Step 10: Handle error responses
                var errorDetails = await response.Content.ReadAsStringAsync();
                throw new Exception($"Failed to retrieve customer data. Status code: {response.StatusCode}, Details: {errorDetails}");
            }

        }

        public async Task<CreatedCustomerData> CreatedCustomerByAsync(CreateCustomerPayload payload) {

            var URL = "https://public.kiotapi.com/customers";

            var request = await CreatedRequest<CreateCustomerPayload>(payload, URL, HttpMethod.Post);

            var response = await sendRequest(request);

            if (response.IsSuccessStatusCode)
            {
                // Step 9: Deserialize the response JSON into the customer list
                var responseString = await response.Content.ReadAsStringAsync();
                var createdCustomersResponse = JsonConvert.DeserializeObject<CreatedCustomer>(responseString);

                // Check if there are any customers in the list
                if (createdCustomersResponse.Data != null)
                {
                    var customerInfo = createdCustomersResponse.Data;  // Get the first customer
                    return customerInfo;
                }
                else
                {
                    return null;
                }
            }
            else
            {
                // Step 10: Handle error responses
                var errorDetails = await response.Content.ReadAsStringAsync();
                throw new Exception($"Failed to created customer data. Status code: {response.StatusCode}, Details: {errorDetails}");
            }

        }


        public async Task<CustomerDetailResponse> GetCustomerProfileByKiotVietIDAsync(string userID)
        {

            var URL = "https://public.kiotapi.com/customers/" + userID;

            var request = await CreatedRequest<object>(null, URL, HttpMethod.Get);

            var response = await sendRequest(request);

            if (response.IsSuccessStatusCode)
            {
                // Step 9: Deserialize the response JSON into the customer list
                var responseString = await response.Content.ReadAsStringAsync();
                var customersResponse = JsonConvert.DeserializeObject<CustomerDetailResponse>(responseString);

                return customersResponse;
            }
            else
            {
                // Step 10: Handle error responses
                var errorDetails = await response.Content.ReadAsStringAsync();
                throw new Exception($"Failed to retrieve customer data. Status code: {response.StatusCode}, Details: {errorDetails}");
            }

        }

        public async Task<OrderListResponse> GetCustomerOrderHistoryByKiotVietIDAsync(string userID, int pageSize, int currentItem)
        {
            CustomerOrderHistoryPayload payload = new CustomerOrderHistoryPayload
            {
                customerIds = long.Parse(userID),
                currentItem = currentItem,
                pageSize = pageSize
            };

            var URL = "https://public.kiotapi.com/orders";

            var request = await CreatedRequest<object>(payload, URL, HttpMethod.Get);

            var response = await sendRequest(request);

            if (response.IsSuccessStatusCode)
            {
                // Step 9: Deserialize the response JSON into the customer list
                var responseString = await response.Content.ReadAsStringAsync();
                var ordersResponse = JsonConvert.DeserializeObject<OrderListResponse>(responseString);

                return ordersResponse;
            }
            else
            {
                // Step 10: Handle error responses
                var errorDetails = await response.Content.ReadAsStringAsync();
                throw new Exception($"Failed to retrieve orders history data. Status code: {response.StatusCode}, Details: {errorDetails}");
            }

        }


        public async Task<ProductResponse> GetProductListAsync(string searchName, int pageSize, int currentItem)
        {
            ProductListPayload payload = new ProductListPayload
            {
                includeInventory = false,
                isActive = true,
                name = searchName,
                categoryId = null,
                currentItem = currentItem,
                pageSize = pageSize
            };

            var URL = "https://public.kiotapi.com/products";

            var request = await CreatedRequest<object>(payload, URL, HttpMethod.Get);

            var response = await sendRequest(request);

            if (response.IsSuccessStatusCode)
            {
                // Step 9: Deserialize the response JSON into the customer list
                var responseString = await response.Content.ReadAsStringAsync();
                var productsResponse = JsonConvert.DeserializeObject<ProductResponse>(responseString);

                return productsResponse;
            }
            else
            {
                // Step 10: Handle error responses
                var errorDetails = await response.Content.ReadAsStringAsync();
                throw new Exception($"Failed to retrieve list of products data. Status code: {response.StatusCode}, Details: {errorDetails}");
            }

        }

        public async Task<ProductDetailResponse> GetProductDetailAsync(string id) {

            var URL = "https://public.kiotapi.com/products/" + id;

            var request = await CreatedRequest<object>(null, URL, HttpMethod.Get);

            var response = await sendRequest(request);

            if (response.IsSuccessStatusCode)
            {
                // Step 9: Deserialize the response JSON into the customer list
                var responseString = await response.Content.ReadAsStringAsync();
                var productResponse = JsonConvert.DeserializeObject<ProductDetailResponse>(responseString);

                return productResponse;
            }
            else
            {
                // Step 10: Handle error responses
                var errorDetails = await response.Content.ReadAsStringAsync();
                throw new Exception($"Failed to retrieve product detail data. Status code: {response.StatusCode}, Details: {errorDetails}");
            }
        }

        public async Task<ProductDetailResponse> GetProductDetailCodeAsync(string id)
        {

            var URL = "https://public.kiotapi.com/products/code/" + id;

            var request = await CreatedRequest<object>(null, URL, HttpMethod.Get);

            var response = await sendRequest(request);

            if (response.IsSuccessStatusCode)
            {
                // Step 9: Deserialize the response JSON into the customer list
                var responseString = await response.Content.ReadAsStringAsync();
                var productResponse = JsonConvert.DeserializeObject<ProductDetailResponse>(responseString);

                return productResponse;
            }
            else
            {
                // Step 10: Handle error responses
                var errorDetails = await response.Content.ReadAsStringAsync();
                throw new Exception($"Failed to retrieve product detail data. Status code: {response.StatusCode}, Details: {errorDetails}");
            }
        }

        public async Task<CodOrderResponse> CreateCODOrderAsync(CODOrderKioVietPayload payload) {
            var URL = "https://public.kiotapi.com/orders";

            var request = await CreatedRequest<object>(payload, URL, HttpMethod.Post);

            var response = await sendRequest(request);

            if (response.IsSuccessStatusCode)
            {
                // Step 9: Deserialize the response JSON into the customer list
                var responseString = await response.Content.ReadAsStringAsync();
                var orderResponse = JsonConvert.DeserializeObject<CodOrderResponse>(responseString);

                return orderResponse;
            }
            else
            {
                // Step 10: Handle error responses
                var errorDetails = await response.Content.ReadAsStringAsync();
                throw new Exception($"Failed to retrieve list of products data. Status code: {response.StatusCode}, Details: {errorDetails}");
            }
        }

        public async Task<object> UpdateOrderAsync(UpdateOrderPayload payload, string Id)
        {
            var URL = "https://public.kiotapi.com/orders/" + Id ;

            var request = await CreatedRequest<object>(payload, URL, HttpMethod.Put);

            var response = await sendRequest(request);

            if (response.IsSuccessStatusCode)
            {
                // Step 9: Deserialize the response JSON into the customer list
                var responseString = await response.Content.ReadAsStringAsync();
                var orderResponse = JsonConvert.DeserializeObject<object>(responseString);

                return orderResponse;
            }
            else
            {
                // Step 10: Handle error responses
                var errorDetails = await response.Content.ReadAsStringAsync();
                throw new Exception($"Failed to retrieve list of products data. Status code: {response.StatusCode}, Details: {errorDetails}");
            }
        }


        public async Task<object> CancelOrderAsync(string Id)
        {
            var URL = "https://public.kiotapi.com/orders/" + Id + " ?IsVoidPayment=true";

            var request = await CreatedRequest<object>(null, URL, HttpMethod.Delete);

            var response = await sendRequest(request);

            if (response.IsSuccessStatusCode)
            {
                // Step 9: Deserialize the response JSON into the customer list
                var responseString = await response.Content.ReadAsStringAsync();
                var orderResponse = JsonConvert.DeserializeObject<object>(responseString);

                return orderResponse;
            }
            else
            {
                // Step 10: Handle error responses
                var errorDetails = await response.Content.ReadAsStringAsync();
                throw new Exception($"Failed to retrieve list of products data. Status code: {response.StatusCode}, Details: {errorDetails}");
            }
        }

        public async Task<ProductResponse> GetProductListByGroupIdAsync(string categoryId, int pageSize, int currentItem) {
            ProductListPayload payload = new ProductListPayload
            {
                includeInventory = true,
                isActive = true,
                name = null,
                categoryId = categoryId,
                currentItem = currentItem,
                pageSize = pageSize
            };

            var URL = "https://public.kiotapi.com/products";

            var request = await CreatedRequest<object>(payload, URL, HttpMethod.Get);

            var response = await sendRequest(request);

            if (response.IsSuccessStatusCode)
            {
                // Step 9: Deserialize the response JSON into the customer list
                var responseString = await response.Content.ReadAsStringAsync();
                var productsResponse = JsonConvert.DeserializeObject<ProductResponse>(responseString);

                return productsResponse;
            }
            else
            {
                // Step 10: Handle error responses
                var errorDetails = await response.Content.ReadAsStringAsync();
                throw new Exception($"Failed to retrieve list of products data. Status code: {response.StatusCode}, Details: {errorDetails}");
            }
        }

    }



}
