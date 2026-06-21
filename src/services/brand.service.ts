import type { BrandResponse } from "@/types/Brand";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export const brandService = {
  getAll: async (): Promise<BrandResponse> => {
    const response = await fetch(`${BASE_URL}/api/v3/brand`);
    if (!response.ok) throw new Error(`Failed to fetch brands: ${response.statusText}`);
    return response.json();
  },

  create: async (name: string, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("file", file); // backend expects "file"
    const response = await fetch(`${BASE_URL}/api/v3/brand`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error(`Failed to create brand: ${response.statusText}`);
  },

  update: async (id: number, name: string, file?: File): Promise<void> => {
    const formData = new FormData();
    formData.append("name", name);
    if (file) formData.append("file", file); // backend expects "file"
    const response = await fetch(`${BASE_URL}/api/v3/brand/${id}`, {
      method: "PUT",
      body: formData,
    });
    if (!response.ok) throw new Error(`Failed to update brand: ${response.statusText}`);
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${BASE_URL}/api/v3/brand/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error(`Failed to delete brand: ${response.statusText}`);
  },
};