export interface Product {
  id: number;
  name: string;
  categoryId: number;
  brandId: number | null;
  price: string;
  originalPrice: string | null;
  qty: number;
  skinType: string;
  size: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category: {
    id: number;
    name: string;
    isActive: boolean | null;
    createdAt: string;
    updatedAt: string;
  } | null;
  brand: {
    id: number;
    name: string;
    image: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  promotion: {
    id: number;
    discountPercent: number;
    [key: string]: unknown;
  } | null;
  discountedPrice: string | null;
  saving: string | null;
  productImages?: ProductImage[];
}

export interface ProductResponse {
  message: string;
  data: Product[];
}

export interface ProductBody {
  name: string;
  categoryId: number;
  brandId?: number | null;
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

export interface CreateProductResponse {
  message: string;
  data: Product;
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