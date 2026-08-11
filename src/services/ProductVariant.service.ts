import type {
  ProductVariantBody,
  ProductVariantResponse,
  SingleProductVariantResponse,
} from "@/types/ProductVariant";

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/v3/product-variant`;
// const BASE_URL = "http://localhost:3000/api/v3/product-variant";

const checkResponse = async (response: Response, label: string): Promise<void> => {
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`[${label}] ${response.status} ${response.statusText}${body ? `: ${body}` : ""}`);
  }
};

export const getVariantsByProductId = async (productId: number): Promise<ProductVariantResponse> => {
  const response = await fetch(`${BASE_URL}/product/${productId}`);
  await checkResponse(response, "getVariantsByProductId");
  return response.json();
};

export const getVariantById = async (id: number): Promise<SingleProductVariantResponse> => {
  const response = await fetch(`${BASE_URL}/${id}`);
  await checkResponse(response, "getVariantById");
  return response.json();
};

export const createVariant = async (body: ProductVariantBody): Promise<SingleProductVariantResponse> => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  await checkResponse(response, "createVariant");
  return response.json();
};

export const createVariantsBulk = async (
  productId: number,
  variants: Omit<ProductVariantBody, "productId">[]
): Promise<ProductVariantResponse> => {
  const response = await fetch(`${BASE_URL}/bulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, variants }),
  });
  await checkResponse(response, "createVariantsBulk");
  return response.json();
};

export const updateVariant = async (
  id: number,
  body: Omit<ProductVariantBody, "productId">
): Promise<SingleProductVariantResponse> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  await checkResponse(response, "updateVariant");
  return response.json();
};

export const deleteVariant = async (id: number): Promise<void> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  await checkResponse(response, "deleteVariant");
};

export const uploadVariantImage = async (id: number, file: File): Promise<SingleProductVariantResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${BASE_URL}/${id}/upload`, {
    method: "POST",
    body: formData,
  });
  await checkResponse(response, "uploadVariantImage");
  return response.json();
};