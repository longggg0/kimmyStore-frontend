export interface Product {
  id: number;
  name: string;
  categoryId: number;
  price: string;
  qty: number;
  skinType: string;
  size: string;
  description: string;
  isActive: boolean;
  updatedAt: string;
  category: {
    id: number;
    name: string;
  };
  productImages?: ProductImage[];
}

export interface ProductResponse {
  message: string;
  data: Product[];
}

export interface ProductBody {
  name: string;
  categoryId: number;
  price: string;
  qty: number;
  skinType: string;
  size: string;
  description: string;
  isActive?: boolean;
}
export interface ProductImage {
  id: number;
  productId: number;
  productImage: string;
  fileName: string;
}

export interface ProductImageResponse {
  data: ProductImage;
}
// Product.ts
export interface CreateProductResponse {
  message: string;
  data: Product; // single Product returned after creation
}
export interface SingleProductResponse {
  data: Product;
}
export interface ProductPagination {
  currentPages: number;
  limit: number;
  total: number;
  nextPages: number | null;
  previousPage: number | null;
}

export interface PaginatedProductResponse {
  message: string;
  data: Product[];
  pagination: ProductPagination;
}