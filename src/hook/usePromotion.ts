import { useMemo } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createPromotion,
  deletePromotion,
  getActivePromotions,
  getPromotionById,
  getPromotions,
  updatePromotion,
} from "@/services/promotion.service";
import type {
  GetPromotionsParams,
  PromotionBody,
  PromotionResponse,
  SinglePromotionResponse,
} from "@/types/Promotion";

export const PROMOTION_KEYS = {
  all:    ["promotions"] as const,
  list:   (params: GetPromotionsParams) => ["promotions", "list", params] as const,
  active: ["promotions", "active"] as const,
  detail: (id: number) => ["promotions", "detail", id] as const,
};

// ── GET /promotion ────────────────────────────────────────────────────────────
export const useGetPromotions = (
  params: GetPromotionsParams = {},
  options?: Omit<UseQueryOptions<PromotionResponse>, "queryKey" | "queryFn">
) =>
  useQuery<PromotionResponse>({
    queryKey: PROMOTION_KEYS.list(params),
    queryFn:  () => getPromotions(params),
    ...options,
  });

// ── GET /promotion/active ─────────────────────────────────────────────────────
export const useGetActivePromotions = (
  options?: Omit<UseQueryOptions<PromotionResponse>, "queryKey" | "queryFn">
) =>
  useQuery<PromotionResponse>({
    queryKey: PROMOTION_KEYS.active,
    queryFn:  getActivePromotions,
    ...options,
  });

// ── GET /promotion/:id ────────────────────────────────────────────────────────
export const useGetPromotionById = (
  id: number,
  options?: Omit<UseQueryOptions<SinglePromotionResponse>, "queryKey" | "queryFn">
) =>
  useQuery<SinglePromotionResponse>({
    queryKey: PROMOTION_KEYS.detail(id),
    queryFn:  () => getPromotionById(id),
    enabled:  !!id,
    ...options,
  });

// ── POST /promotion ───────────────────────────────────────────────────────────
export const useCreatePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: PromotionBody) => createPromotion(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROMOTION_KEYS.all });
      toast.success("Promotion created successfully.");
    },
    onError: (err) => {
      toast.error("Failed to create promotion", {
        description: err instanceof Error ? err.message : undefined,
      });
    },
  });
};

// ── PUT /promotion/:id ────────────────────────────────────────────────────────
export const useUpdatePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: Partial<PromotionBody> }) =>
      updatePromotion(id, body),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: PROMOTION_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PROMOTION_KEYS.detail(id) });
      toast.success("Promotion updated successfully.");
    },
    onError: (err) => {
      toast.error("Failed to update promotion", {
        description: err instanceof Error ? err.message : undefined,
      });
    },
  });
};

// ── DELETE /promotion/:id ─────────────────────────────────────────────────────
export const useDeletePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deletePromotion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROMOTION_KEYS.all });
      toast.success("Promotion deleted successfully.");
    },
    onError: (err) => {
      toast.error("Failed to delete promotion", {
        description: err instanceof Error ? err.message : undefined,
      });
    },
  });
};

// ── Discount lookup: productId -> best active discount ───────────────────────
export const useDiscountMap = () => {
  const { data: promotionData } = useGetActivePromotions();

  return useMemo(() => {
    const map = new Map<number, { discountPercent: number; promotionName: string }>();
    const promotions = promotionData?.data ?? [];

    promotions.forEach((promo) => {
      promo.products.forEach((p) => {
        const existing = map.get(p.id);
        if (!existing || promo.discountPercent > existing.discountPercent) {
          map.set(p.id, {
            discountPercent: promo.discountPercent,
            promotionName: promo.name,
          });
        }
      });
    });

    return map;
  }, [promotionData]);
};