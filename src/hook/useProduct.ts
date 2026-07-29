import {
  createProduct,
  deleteProduct,
  downloadProductImage,
  getProductById,
  getProducts,
  updateProduct,
  updateProductImage,
  uploadProductImage,
} from "@/services/product.service";
import type { CreateProductResponse, ProductBody, ProductImage } from "@/types/Product";
import { useQuery, useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { getProductsPaginated, type GetProductsParams } from "@/services/product.service";

// Shared invalidation so every mutation refreshes both the plain list
// and the paginated list, without duplicating this predicate everywhere.
const invalidateProductQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({
    predicate: (query) =>
      query.queryKey[0] === "products" || query.queryKey[0] === "products-paginated",
  });
};

// Shared cache patcher so optimistic updates hit both list caches consistently.
const patchProductQueries = (
  queryClient: QueryClient,
  updater: (products: any[]) => any[]
) => {
  queryClient.setQueriesData(
    { predicate: (query) => query.queryKey[0] === "products" || query.queryKey[0] === "products-paginated" },
    (old: any) => {
      if (!old?.data) return old;
      return { ...old, data: updater(old.data) };
    }
  );
};

export const useProductsPaginated = (params?: GetProductsParams) =>
  useQuery({
    queryKey: ["products-paginated", params],
    queryFn: () => getProductsPaginated(params),
    placeholderData: (previousData) => previousData,
  });

export const useProducts = () =>
  useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

export const useProductById = (id: number) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: ProductBody }) =>
      updateProduct(id, body),
    onSuccess: (_data, variables) => {
      patchProductQueries(queryClient, (products) =>
        products.map((p) => (p.id === variables.id ? { ...p, ...variables.body } : p))
      );
      invalidateProductQueries(queryClient);
      toast.success("Product updated successfully.");
    },
    onError: (err) => {
      toast.error("Failed to update product", {
        description: err instanceof Error ? err.message : undefined,
      });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: (_data, id) => {
      patchProductQueries(queryClient, (products) => products.filter((p) => p.id !== id));
      invalidateProductQueries(queryClient);
      toast.success("Product deleted successfully.");
    },
    onError: (err) => {
      toast.error("Failed to delete product", {
        description: err instanceof Error ? err.message : undefined,
      });
    },
  });
};

export const useCreateProduct = () => {

  // Still no cache invalidation here on purpose — if an image is attached,
  // useUploadProductImage's onSuccess invalidates once that finishes. If there's
  // no image, the calling component invalidates directly (see AddProductDialog).
  return useMutation<CreateProductResponse, Error, ProductBody>({
    mutationFn: (body: ProductBody) => createProduct(body),
    onSuccess: () => {
      toast.success("Product created successfully.");
    },
    onError: (err) => {
      toast.error("Failed to create product", {
        description: err instanceof Error ? err.message : undefined,
      });
    },
  });
};

export const useProductImageDownload = () => {
  const [image, setImage] = useState<ProductImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchImage = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await downloadProductImage(id);
      setImage(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch image");
    } finally {
      setLoading(false);
    }
  }, []);

  return { image, loading, error, fetchImage };
};

export const useUploadProductImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) =>
      uploadProductImage(id, file),
    onSuccess: () => invalidateProductQueries(queryClient),
  });
};

export const useUpdateProductImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) =>
      updateProductImage(id, file),
    onSuccess: () => invalidateProductQueries(queryClient),
  });
};

export const useProductImage = (productId: number) => {
  return useQuery({
    queryKey: ["product-image", productId],
    queryFn: () => downloadProductImage(productId),
    enabled: !!productId,
  });
};