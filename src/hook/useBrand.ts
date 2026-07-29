import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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
      toast.success("Brand created successfully.");
    },
    onError: (err) => {
      toast.error("Failed to create brand", {
        description: err instanceof Error ? err.message : undefined,
      });
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
      toast.success("Brand updated successfully.");
    },
    onError: (err) => {
      toast.error("Failed to update brand", {
        description: err instanceof Error ? err.message : undefined,
      });
    },
  });
};

export const useDeleteBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => brandService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRAND_QUERY_KEY });
      toast.success("Brand deleted successfully.");
    },
    onError: (err) => {
      toast.error("Failed to delete brand", {
        description: err instanceof Error ? err.message : undefined,
      });
    },
  });
};