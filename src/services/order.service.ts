// import type { OrderResponse, CreateOrderPayload } from "@/types/Order";

import type { OrderResponse, CreateOrderPayload } from "@/types/order";

const BASE_URL = import.meta.env.VITE_API_URL ;

export const orderService = {
  getAll: async (): Promise<OrderResponse> => {
    const response = await fetch(`${BASE_URL}/api/v2/order`);
    if (!response.ok) throw new Error(`Failed to fetch orders: ${response.statusText}`);
    return response.json();
  },

  getById: async (id: number): Promise<OrderResponse> => {
    const response = await fetch(`${BASE_URL}/api/v2/order/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch order: ${response.statusText}`);
    return response.json();
  },

  // create: async (payload: CreateOrderPayload): Promise<void> => {
  //   const response = await fetch(`${BASE_URL}/api/v2/order`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(payload),
  //   });
  //   if (!response.ok) throw new Error(`Failed to create order: ${response.statusText}`);
  // },

  create: async (payload: CreateOrderPayload): Promise<{ data: { id: number } }> => {
    const response = await fetch(`${BASE_URL}/api/v2/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`Failed to create order: ${response.statusText}`);
    return response.json();
  },

  update: async (id: number, payload: Partial<CreateOrderPayload>): Promise<void> => {
    const response = await fetch(`${BASE_URL}/api/v2/order/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`Failed to update order: ${response.statusText}`);
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${BASE_URL}/api/v2/order/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error(`Failed to delete order: ${response.statusText}`);
  },

  generateDocx: async (id: number): Promise<void> => {
    const response = await fetch(`${BASE_URL}/api/v2/order/${id}/generate-docx`);
    if (!response.ok) throw new Error(`Failed to generate invoice: ${response.statusText}`);

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `order-${id}.docx`;
    a.click();
    URL.revokeObjectURL(url);
  },
};