export interface PromotionProduct {
  id: number;
  name: string;
  categoryId: number;
  price: string;
  qty: number;
  isActive: boolean;
  size: string;
  description: string;
  skinType: string;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: number;
    name: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface Promotion {
  id: number;
  name: string;
  discountPercent: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  products: PromotionProduct[];
  msRemaining: number;
  countdown: string;
}

export interface PromotionPagination {
  currentPages: number;
  limit: number;
  total: number;
  nextPages: number | null;
  previousPage: number | null;
}

export interface PromotionResponse {
  message: string;
  data: Promotion[];
  pagination: PromotionPagination;
}

export interface SinglePromotionResponse {
  message: string;
  data: Promotion;
}

export interface PromotionBody {
  name: string;
  discountPercent: number;
  startDate?: string;
  endDate: string;
  isActive?: boolean;
  productIds?: number[];
}

export type PromotionStatus = "active" | "upcoming" | "expired";

export interface GetPromotionsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: PromotionStatus;
}