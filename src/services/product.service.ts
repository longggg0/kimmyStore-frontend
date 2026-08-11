import type {
  CreateProductResponse,
  PaginatedProductResponse,
  ProductBody,
  ProductImageResponse,
  ProductResponse,
  SingleProductResponse,
} from "@/types/Product";

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/v3/product`;
// const BASE_URL = "http://localhost:3000/api/v3/product";

const checkResponse = async (response: Response, label: string): Promise<void> => {
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`[${label}] ${response.status} ${response.statusText}${body ? `: ${body}` : ""}`);
  }
};

export const getProducts = async (): Promise<ProductResponse> => {
  const response = await fetch(`${BASE_URL}?limit=100`);
  await checkResponse(response, "getProducts");
  return response.json();
};

export const getProductById = async (id: number): Promise<SingleProductResponse> => {
  const response = await fetch(`${BASE_URL}/${id}`);
  await checkResponse(response, "getProductById");
  return response.json();
};

export const updateProduct = async (id: number, body: ProductBody): Promise<void> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  await checkResponse(response, "updateProduct");
};

export const deleteProduct = async (id: number): Promise<void> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  await checkResponse(response, "deleteProduct");
};

export const createProduct = async (body: ProductBody): Promise<CreateProductResponse> => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  await checkResponse(response, "createProduct");
  return response.json();
};

export const downloadProductImage = async (id: number): Promise<ProductImageResponse> => {
  const response = await fetch(`${BASE_URL}/images/${id}/download`);
  await checkResponse(response, "downloadProductImage");
  return response.json();
};

export const uploadProductImage = async (id: number, file: File): Promise<void> => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${BASE_URL}/${id}/upload`, {
    method: "POST",
    body: formData,
  });
  await checkResponse(response, "uploadProductImage");
};

export const updateProductImage = async (id: number, file: File): Promise<void> => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${BASE_URL}/${id}/upload`, {
    method: "PUT",
    body: formData,
  });
  await checkResponse(response, "updateProductImage");
};

export const getTopSellingProducts = async (limit = 10): Promise<ProductResponse> => {
  const response = await fetch(`${BASE_URL}/top-selling?limit=${limit}`);
  await checkResponse(response, "getTopSellingProducts");
  return response.json();
};

export const getNewArrivalProducts = async (limit = 10): Promise<ProductResponse> => {
  const response = await fetch(`${BASE_URL}/new-arrivals?limit=${limit}`);
  await checkResponse(response, "getNewArrivalProducts");
  return response.json();
};

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  brandId?: number;
  categoryId?: number;
  skinType?: string;
}
export const getProductsPaginated = async (
  params?: GetProductsParams
): Promise<PaginatedProductResponse> => {
  const query = new URLSearchParams();
  query.set("limit", String(params?.limit ?? 10));
  query.set("page", String(params?.page ?? 1));
  if (params?.search) query.set("search", params.search);
  if (params?.categoryId) query.set("categoryId", String(params.categoryId));
  if (params?.brandId) query.set("brandId", String(params.brandId));
  if (params?.skinType && params.skinType !== "all") query.set("skinType", params.skinType);

  const response = await fetch(`${BASE_URL}?${query.toString()}`);
  await checkResponse(response, "getProductsPaginated");
  return response.json();
};