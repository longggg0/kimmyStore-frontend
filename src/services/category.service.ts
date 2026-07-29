// import { CategoryResponse, UpdateCategoryPayload } from "../types/category.type";

import type { CategoryResponse, UpdateCategoryPayload } from "@/types/Category";

const BASE_URL = import.meta.env.VITE_API_URL ;

export const categoryService = {
  getAll: async (): Promise<CategoryResponse> => {
    const response = await fetch(`${BASE_URL}/api/v2/category`);
    if (!response.ok) throw new Error(`Failed to fetch categories: ${response.statusText}`);
    return response.json();
  },

  create: async (payload: UpdateCategoryPayload): Promise<void> => {
    const response = await fetch(`${BASE_URL}/api/v2/category`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`Failed to create category: ${response.statusText}`);
  },

  update: async (id: number, payload: UpdateCategoryPayload): Promise<void> => {
    const response = await fetch(`${BASE_URL}/api/v2/category/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`Failed to update category: ${response.statusText}`);
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${BASE_URL}/api/v2/category/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error(`Failed to delete category: ${response.statusText}`);
  },
};