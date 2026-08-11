import {
  createVariant,
  createVariantsBulk,
  deleteVariant,
  getVariantById,
  getVariantsByProductId,
  updateVariant,
  uploadVariantImage,
} from "@/services/ProductVariant.service";
import type { ProductVariantBody } from "@/types/ProductVariant";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useProductVariants = (productId: number) =>
  useQuery({
    queryKey: ["product-variants", productId],
    queryFn: () => getVariantsByProductId(productId),
    enabled: !!productId,
  });

export const useProductVariantById = (id: number) =>
  useQuery({
    queryKey: ["product-variant", id],
    queryFn: () => getVariantById(id),
    enabled: !!id,
  });

export const useCreateVariant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: ProductVariantBody) => createVariant(body),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product-variants", variables.productId] });
      toast.success("Variant created successfully.");
    },
    onError: (err) => {
      toast.error("Failed to create variant", {
        description: err instanceof Error ? err.message : undefined,
      });
    },
  });
};

export const useCreateVariantsBulk = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, variants }: { productId: number; variants: Omit<ProductVariantBody, "productId">[] }) =>
      createVariantsBulk(productId, variants),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product-variants", variables.productId] });
      toast.success("Variants created successfully.");
    },
    onError: (err) => {
      toast.error("Failed to create variants", {
        description: err instanceof Error ? err.message : undefined,
      });
    },
  });
};

export const useUpdateVariant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id,  body }: { id: number; productId: number; body: Omit<ProductVariantBody, "productId"> }) =>
      updateVariant(id, body),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product-variants", variables.productId] });
      toast.success("Variant updated successfully.");
    },
    onError: (err) => {
      toast.error("Failed to update variant", {
        description: err instanceof Error ? err.message : undefined,
      });
    },
  });
};

export const useDeleteVariant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number; productId: number }) => deleteVariant(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product-variants", variables.productId] });
      toast.success("Variant deleted successfully.");
    },
    onError: (err) => {
      toast.error("Failed to delete variant", {
        description: err instanceof Error ? err.message : undefined,
      });
    },
  });
};

export const useUploadVariantImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File; productId: number }) => uploadVariantImage(id, file),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product-variants", variables.productId] });
      toast.success("Variant image uploaded successfully.");
    },
    onError: (err) => {
      toast.error("Failed to upload variant image", {
        description: err instanceof Error ? err.message : undefined,
      });
    },
  });
};