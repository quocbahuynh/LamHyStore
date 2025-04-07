using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace LamHyStore.Shared.ResponseModel
{
    public class ProductDetailResponse
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
        public bool? AllowsSale { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("categoryId")]
        public int CategoryId { get; set; }

        [JsonProperty("tradeMarkId")]
        public int TradeMarkId { get; set; }

        [JsonProperty("type")]
        public byte? Type { get; set; }

        [JsonProperty("categoryName")]
        public string CategoryName { get; set; }

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

        [JsonProperty("masterProductId")]
        public long? MasterProductId { get; set; }

        [JsonProperty("masterUnitId")]
        public long MasterUnitId { get; set; }

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

        [JsonProperty("basePrice")]
        public decimal BasePrice { get; set; }

        [JsonProperty("weight")]
        public double Weight { get; set; }

        [JsonProperty("modifiedDate")]
        public DateTime ModifiedDate { get; set; }

        [JsonProperty("createdDate")]
        public DateTime CreatedDate { get; set; }

        [JsonProperty("isLotSerialControl")]
        public bool? IsLotSerialControl { get; set; }

        [JsonProperty("isBatchExpireControl")]
        public bool? IsBatchExpireControl { get; set; }

        [JsonProperty("productSerials")]
        public List<ProductSerial> ProductSerials { get; set; }

        [JsonProperty("productBatchExpires")]
        public List<ProductBatchExpire> ProductBatchExpires { get; set; }
    }
}
