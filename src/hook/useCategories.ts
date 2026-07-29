import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../services/category.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Category } from "@/types/Category";
import { toast } from "sonner";


export const useCategory = () => {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await categoryService.getAll();
      return res.data;
    },
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => categoryService.create({ name }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created successfully.");
    },
    onError: (err) => {
      toast.error("Failed to create category", {
        description: err instanceof Error ? err.message : undefined,
      });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      categoryService.update(id, { name }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category updated successfully.");
    },
    onError: (err) => {
      toast.error("Failed to update category", {
        description: err instanceof Error ? err.message : undefined,
      });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoryService.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted successfully.");
    },
    onError: (err) => {
      toast.error("Failed to delete category", {
        description: err instanceof Error ? err.message : undefined,
      });
    },
  });
};