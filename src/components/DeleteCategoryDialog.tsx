import React from "react";
import { Trash2 } from "lucide-react";
import { useDeleteCategory } from "@/hook/useCategories";
// import { useDeleteCategory } from "../hooks/useDeleteCategory";

interface DeleteCategoryDialogProps {
  categoryId: number;
  categoryName: string;
}

export const DeleteCategoryDialog: React.FC<DeleteCategoryDialogProps> = ({
  categoryId,
  categoryName,
}) => {
  const { mutate: deleteCategory, isPending } = useDeleteCategory();

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${categoryName}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    deleteCategory(categoryId);
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 rounded-lg border border-gray-200 text-gray-400
        hover:border-red-200 hover:text-red-400 disabled:opacity-50
        disabled:cursor-not-allowed transition-colors duration-150"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
};