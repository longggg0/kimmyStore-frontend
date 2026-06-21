export interface Category {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryResponse {
  data: Category[];
}

export interface UpdateCategoryPayload {
  name: string;
}