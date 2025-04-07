interface Inventory {
  ProductId: number;
  ProductCode: string | null;
  ProductName: string | null;
  BranchId: number;
  BranchName: string;
  OnHand: number;
  Cost: number;
  Reserved: number;
}

interface PriceBook {
  PriceBookId: number;
  PriceBookName: string;
  ProductId: number;
  IsActive: boolean;
  StartDate: string;
  EndDate: string;
  Price: number;
}

export interface Product {
  Id: string;
  Code: string;
  BarCode: string;
  RetailerId: number;
  AllowsSale: boolean;
  Name: string;
  CategoryId: number;
  TradeMarkId: number;
  Type: number;
  CategoryName: string;
  FullName: string;
  Description: string;
  HasVariants: boolean;
  Attributes: any | null;
  Unit: any | null;
  MasterProductId: number | null;
  MasterUnitId: number;
  ConversionValue: number;
  Units: any | null;
  Images: string[];
  Inventories: Inventory[];
  PriceBooks: PriceBook[];
  ProductFormulas: any | null;
  BasePrice: number;
  Weight: number;
  ModifiedDate: string;
  CreatedDate: string;
  IsLotSerialControl: boolean;
  IsBatchExpireControl: boolean;
  ProductSerials: any | null;
  ProductBatchExpires: any | null;
}
