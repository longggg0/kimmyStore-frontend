
import type {
  CustomerManagementResponse,
  CustomerOrdersResponse,
  UpdateCustomerPayload,
} from "@/types/CustomerManagement";

const BASE_URL = import.meta.env.VITE_API_URL;

export const customerManagementService = {
  getCustomers: async (
    search?: string
  ): Promise<CustomerManagementResponse> => {
    const query = search?.trim()
      ? `?search=${encodeURIComponent(search.trim())}`
      : "";

    const response = await fetch(
      `${BASE_URL}/api/v3/admin/customers${query}`
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));

      throw new Error(
        error.message ??
          `Failed to fetch customers: ${response.statusText}`
      );
    }

    return response.json();
  },

  getCustomerOrders: async (
    customerId: number
  ): Promise<CustomerOrdersResponse> => {
    const response = await fetch(
      `${BASE_URL}/api/v3/admin/customers/${customerId}/orders`
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));

      throw new Error(
        error.message ??
          `Failed to fetch customer orders: ${response.statusText}`
      );
    }

    return response.json();
  },

  updateCustomer: async (
    customerId: number,
    payload: UpdateCustomerPayload
  ) => {
    const response = await fetch(
      `${BASE_URL}/api/v3/admin/customers/${customerId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));

      throw new Error(
        error.message ??
          `Failed to update customer: ${response.statusText}`
      );
    }

    return response.json();
  },

  deleteCustomer: async (customerId: number) => {
    const response = await fetch(
      `${BASE_URL}/api/v3/admin/customers/${customerId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));

      throw new Error(
        error.message ??
          `Failed to delete customer: ${response.statusText}`
      );
    }

    return response.json();
  },
};

