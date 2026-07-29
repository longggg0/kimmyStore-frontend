import type {
  GetPromotionsParams,
  PromotionBody,
  PromotionResponse,
  SinglePromotionResponse,
} from "@/types/Promotion";

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/v3/promotion`;

const checkResponse = async (response: Response, label: string): Promise<void> => {
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `[${label}] ${response.status} ${response.statusText}${body ? `: ${body}` : ""}`
    );
  }
};

export const getPromotions = async (
  params: GetPromotionsParams = {}
): Promise<PromotionResponse> => {
  const query = new URLSearchParams();
  if (params.page)   query.set("page",   String(params.page));
  if (params.limit)  query.set("limit",  String(params.limit));
  if (params.search) query.set("search", params.search);
  if (params.status) query.set("status", params.status);

  const response = await fetch(`${BASE_URL}?${query.toString()}`);
  await checkResponse(response, "getPromotions");
  return response.json();
};

export const getActivePromotions = async (): Promise<PromotionResponse> => {
  const response = await fetch(`${BASE_URL}/active`);
  await checkResponse(response, "getActivePromotions");
  return response.json();
};

export const getPromotionById = async (id: number): Promise<SinglePromotionResponse> => {
  const response = await fetch(`${BASE_URL}/${id}`);
  await checkResponse(response, "getPromotionById");
  return response.json();
};

export const createPromotion = async (
  body: PromotionBody
): Promise<SinglePromotionResponse> => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  await checkResponse(response, "createPromotion");
  return response.json();
};

export const updatePromotion = async (
  id: number,
  body: Partial<PromotionBody>
): Promise<SinglePromotionResponse> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  await checkResponse(response, "updatePromotion");
  return response.json();
};

export const deletePromotion = async (id: number): Promise<void> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  await checkResponse(response, "deletePromotion");
};