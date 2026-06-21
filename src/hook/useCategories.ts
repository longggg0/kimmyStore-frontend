import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../services/category.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Category } from "@/types/Category";


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
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoryService.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};