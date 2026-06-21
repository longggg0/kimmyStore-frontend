import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { brandService } from "@/services/brand.service";

export const BRAND_QUERY_KEY = ["brands"];

export const useGetBrands = () => {
  return useQuery({
    queryKey: BRAND_QUERY_KEY,
    queryFn: brandService.getAll,
  });
};

export const useCreateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, file }: { name: string; file: File }) =>
      brandService.create(name, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRAND_QUERY_KEY });
    },
  });
};

export const useUpdateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name, file }: { id: number; name: string; file?: File }) =>
      brandService.update(id, name, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRAND_QUERY_KEY });
    },
  });
};

export const useDeleteBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => brandService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRAND_QUERY_KEY });
    },
  });
};