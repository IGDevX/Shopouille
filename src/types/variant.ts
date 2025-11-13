export type Variant = {
  id: number | string;
  sku: string;
  attributesJson: string;
  priceAmount: number;
  weightGrams: number;
  barcode: string;
  quantity: number;
  isActive: boolean;
};

export default Variant;
