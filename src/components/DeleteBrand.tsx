import React from "react";
import { Trash2 } from "lucide-react";
import { useDeleteBrand } from "@/hook/useBrand";

interface DeleteBrandProps {
  brandId: number;
  brandName: string;
}

export const DeleteBrand: React.FC<DeleteBrandProps> = ({ brandId, brandName }) => {
  const { mutate: deleteBrand, isPending } = useDeleteBrand();

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${brandName}"? This action cannot be undone.`
    );
    if (!confirmed) return;
    deleteBrand(brandId);
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