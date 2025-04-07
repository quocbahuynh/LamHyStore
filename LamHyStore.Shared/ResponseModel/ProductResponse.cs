using Newtonsoft.Json;

namespace LamHyStore.Shared.ResponseModel
{
    public class ProductResponse
    {
        [JsonProperty("removeId")]
        public List<int> RemoveId { get; set; }

        [JsonProperty("total")]
        public int Total { get; set; }

        [JsonProperty("pageSize")]
        public int PageSize { get; set; }

        [JsonProperty("data")]
        public List<Product> Data { get; set; }
    }

    public class Product
    {
        [JsonProperty("id")]
        public long Id { get; set; }

        [JsonProperty("code")]
        public string Code { get; set; }

        [JsonProperty("barCode")]
        public string BarCode { get; set; }

        [JsonProperty("retailerId")]
        public int RetailerId { get; set; }

        [JsonProperty("allowsSale")]
        public bool AllowsSale { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("categoryId")]
        public int CategoryId { get; set; }

        [JsonProperty("categoryName")]
        public string CategoryName { get; set; }

        [JsonProperty("tradeMarkId")]
        public int TradeMarkId { get; set; }

        [JsonProperty("tradeMarkName")]
        public string TradeMarkName { get; set; }

        [JsonProperty("fullName")]
        public string FullName { get; set; }

        [JsonProperty("description")]
        public string Description { get; set; }

        [JsonProperty("hasVariants")]
        public bool? HasVariants { get; set; }

        [JsonProperty("attributes")]
        public List<ProductAttribute> Attributes { get; set; }

        [JsonProperty("unit")]
        public string Unit { get; set; }

        [JsonProperty("masterUnitId")]
        public long MasterUnitId { get; set; }

        [JsonProperty("masterProductId")]
        public long? MasterProductId { get; set; }

        [JsonProperty("conversionValue")]
        public double? ConversionValue { get; set; }

        [JsonProperty("units")]
        public List<ProductUnit> Units { get; set; }

        [JsonProperty("images")]
        public List<string> Images { get; set; }

        [JsonProperty("inventories")]
        public List<Inventory> Inventories { get; set; }

        [JsonProperty("priceBooks")]
        public List<PriceBook> PriceBooks { get; set; }

        [JsonProperty("productFormulas")]
        public List<ProductFormula> ProductFormulas { get; set; }

        [JsonProperty("productSerials")]
        public List<ProductSerial> ProductSerials { get; set; }

        [JsonProperty("productBatchExpires")]
        public List<ProductBatchExpire> ProductBatchExpires { get; set; }

        [JsonProperty("productWarranties")]
        public List<ProductWarranty> ProductWarranties { get; set; }

        [JsonProperty("basePrice")]
        public decimal? BasePrice { get; set; }

        [JsonProperty("weight")]
        public double? Weight { get; set; }

        [JsonProperty("modifiedDate")]
        public DateTime ModifiedDate { get; set; }

        [JsonProperty("createdDate")]
        public DateTime CreatedDate { get; set; }

        [JsonProperty("orderTemplate")]
        public string OrderTemplate { get; set; }

        [JsonProperty("minQuantity")]
        public int MinQuantity { get; set; }

        [JsonProperty("maxQuantity")]
        public int MaxQuantity { get; set; }
    }

    // Define other necessary classes based on the JSON structure
    public class ProductAttribute
    {
        [JsonProperty("productId")]
        public long ProductId { get; set; }

        [JsonProperty("attributeName")]
        public string AttributeName { get; set; }

        [JsonProperty("attributeValue")]
        public string AttributeValue { get; set; }
    }

    public class ProductUnit
    {
        [JsonProperty("id")]
        public long Id { get; set; }

        [JsonProperty("code")]
        public string Code { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("fullName")]
        public string FullName { get; set; }

        [JsonProperty("unit")]
        public string Unit { get; set; }

        [JsonProperty("conversionValue")]
        public double ConversionValue { get; set; }

        [JsonProperty("basePrice")]
        public decimal BasePrice { get; set; }
    }

    public class ProductImage
    {
        [JsonProperty("Image")]
        public string Image { get; set; }
    }

    public class Inventory
    {
        [JsonProperty("productId")]
        public long ProductId { get; set; }

        [JsonProperty("productCode")]
        public string ProductCode { get; set; }

        [JsonProperty("productName")]
        public string ProductName { get; set; }

        [JsonProperty("branchId")]
        public int BranchId { get; set; }

        [JsonProperty("branchName")]
        public string BranchName { get; set; }

        [JsonProperty("onHand")]
        public double? OnHand { get; set; }

        [JsonProperty("cost")]
        public decimal? Cost { get; set; }

        [JsonProperty("reserved")]
        public double Reserved { get; set; }
    }

    public class PriceBook
    {
        [JsonProperty("priceBookId")]
        public long PriceBookId { get; set; }

        [JsonProperty("priceBookName")]
        public string PriceBookName { get; set; }

        [JsonProperty("productId")]
        public long ProductId { get; set; }

        [JsonProperty("isActive")]
        public bool IsActive { get; set; }

        [JsonProperty("startDate")]
        public DateTime? StartDate { get; set; }

        [JsonProperty("endDate")]
        public DateTime? EndDate { get; set; }

        [JsonProperty("price")]
        public decimal Price { get; set; }
    }

    public class ProductFormula
    {
        [JsonProperty("materialId")]
        public long MaterialId { get; set; }

        [JsonProperty("materialCode")]
        public string MaterialCode { get; set; }

        [JsonProperty("materialFullName")]
        public string MaterialFullName { get; set; }

        [JsonProperty("materialName")]
        public string MaterialName { get; set; }

        [JsonProperty("quantity")]
        public int Quantity { get; set; }

        [JsonProperty("basePrice")]
        public decimal BasePrice { get; set; }

        [JsonProperty("productId")]
        public long? ProductId { get; set; }

        [JsonProperty("product")]
        public ProductComponent Product { get; set; }
    }

    public class ProductComponent
    {
        [JsonProperty("createdDate")]
        public DateTime? CreatedDate { get; set; }

        [JsonProperty("id")]
        public long Id { get; set; }

        [JsonProperty("retailerId")]
        public long RetailerId { get; set; }

        [JsonProperty("code")]
        public string Code { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("fullName")]
        public DateTime? FullName { get; set; }

        [JsonProperty("categoryId")]
        public int CategoryId { get; set; }

        [JsonProperty("allowsSale")]
        public bool AllowsSale { get; set; }

        [JsonProperty("hasVariants")]
        public bool? HasVariants { get; set; }

        [JsonProperty("basePrice")]
        public decimal BasePrice { get; set; }

        [JsonProperty("unit")]
        public string Unit { get; set; }

        [JsonProperty("conversionValue")]
        public double? ConversionValue { get; set; }

        [JsonProperty("modifiedDate")]
        public DateTime? ModifiedDate { get; set; }

        [JsonProperty("isActive")]
        public bool IsActive { get; set; }

        [JsonProperty("isRewardPoint")]
        public bool? IsRewardPoint { get; set; }

        [JsonProperty("orderTemplate")]
        public string OrderTemplate { get; set; }

        [JsonProperty("isLotSerialControl")]
        public bool? IsLotSerialControl { get; set; }

        [JsonProperty("isBatchExpireControl")]
        public bool? IsBatchExpireControl { get; set; }
    }

    public class ProductSerial
    {
        [JsonProperty("productId")]
        public long ProductId { get; set; }

        [JsonProperty("serialNumber")]
        public string SerialNumber { get; set; }

        [JsonProperty("status")]
        public int Status { get; set; }

        [JsonProperty("branchId")]
        public int BranchId { get; set; }

        [JsonProperty("quantity")]
        public double? Quantity { get; set; }

        [JsonProperty("createdDate")]
        public DateTime CreatedDate { get; set; }

        [JsonProperty("modifiedDate")]
        public DateTime? ModifiedDate { get; set; }
    }

    public class ProductBatchExpire
    {
        [JsonProperty("productId")]
        public long ProductId { get; set; }

        [JsonProperty("onHand")]
        public double OnHand { get; set; }

        [JsonProperty("batchName")]
        public string BatchName { get; set; }

        [JsonProperty("expireDate")]
        public DateTime ExpireDate { get; set; }

        [JsonProperty("fullNameVirgule")]
        public string FullNameVirgule { get; set; }

        [JsonProperty("branchId")]
        public int BranchId { get; set; }
    }

    public class ProductWarranty
    {
        [JsonProperty("Id")]
        public long Id { get; set; }

        [JsonProperty("description")]
        public string Description { get; set; }

        [JsonProperty("numberTime")]
        public int NumberTime { get; set; }

        [JsonProperty("timeType")]
        public int TimeType { get; set; }

        [JsonProperty("warrantyType")]
        public int WarrantyType { get; set; }

        [JsonProperty("productId")]
        public long ProductId { get; set; }

        [JsonProperty("retailerId")]
        public long RetailerId { get; set; }

        [JsonProperty("createdBy")]
        public long? CreatedBy { get; set; }

        [JsonProperty("createdDate")]
        public DateTime? CreatedDate { get; set; }

        [JsonProperty("modifiedDate")]
        public DateTime? ModifiedDate { get; set; }
    }

}
