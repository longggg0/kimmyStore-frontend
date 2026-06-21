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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";

import { getProductsPaginated, type GetProductsParams } from "@/services/product.service";

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
    queryKey: ["products"],
    queryFn: getProducts,
    select: (data) => ({
      data: data.data.find((p) => p.id === id),
    }),
    enabled: !!id,
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: ProductBody }) =>
      updateProduct(id, body),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateProductResponse, Error, ProductBody>({
    mutationFn: (body: ProductBody) => createProduct(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
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
    onSuccess: () => {
      // Invalidates AFTER the image upload, so the list refreshes with the new image
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useUpdateProductImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) =>
      updateProductImage(id, file),
    onSuccess: () => {
      // Invalidates AFTER the image update, so the list refreshes with the new image
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useProductImage = (productId: number) => {
  return useQuery({
    queryKey: ['product-image', productId],
    queryFn: () => downloadProductImage(productId),
    enabled: !!productId,
  });
};
