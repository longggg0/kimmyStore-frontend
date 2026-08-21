export interface ProductVariant {
  id: number;
  productId: number;
  color: string;
  colorHex: string | null;
  size: string;
  sku: string;
  price: string;
  qty: number;
  imageUrl: string | null;
  updatedAt?: string;
}

export interface ProductVariantResponse {
  message: string;
  data: ProductVariant[];
}
  
export interface SingleProductVariantResponse {
  message: string;
  data: ProductVariant;
}

export interface ProductVariantBody {
  productId: number;
  color: string;
  colorHex?: string | null;
  size: string;
  sku: string;
  price: string;
  qty: number;
}