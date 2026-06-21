import React, { useState } from "react";
import { AdminLayout } from "../components/AdminLayout";
import { AddCategoryDialog } from "../components/AddCategoryDialog";
import { UpdateCategoryDialog } from "../components/UpdateCategoryDialog";
import { Trash2 } from "lucide-react";
import { useCategory, useDeleteCategory } from "@/hook/useCategories";
import { Badge } from "@/components/ui/badge";
// import { useDeleteCategory } from "@/hook/useDeleteCategory";

export const AdminCategoryPage: React.FC = () => {
  const { data: categories = [], isLoading, isError } = useCategory();
  const { mutate: deleteCategory, isPending } = useDeleteCategory();

  const [confirmId, setConfirmId] = useState<number | null>(null);

  const handleDeleteConfirm = () => {
    if (confirmId === null) return;
    deleteCategory(confirmId, {
      onSuccess: () => setConfirmId(null),
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-1">
              Categories Management
            </h1>
            <p className="text-sm font-normal text-gray-400">
              Manage your categories
            </p>
          </div>

          <AddCategoryDialog />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["ID", "Name", "Date", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-left text-xs font-normal text-gray-400 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {/* Loading */}
                {isLoading && (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-sm text-gray-400">
                      Loading...
                    </td>
                  </tr>
                )}

                {/* Error */}
                {isError && (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-sm text-red-400">
                      Something went wrong
                    </td>
                  </tr>
                )}

                {/* Empty */}
                {!isLoading && !isError && categories.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-sm text-gray-400">
                      No categories found
                    </td>
                  </tr>
                )}

                {/* Data */}
                {!isLoading && !isError && categories.map((category, index) => (
                  <tr
                    key={category.id}
                    className={`hover:bg-gray-50 transition-colors duration-150 ${index !== categories.length - 1 ? "border-b border-gray-100" : ""
                      }`}
                  >
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {category.id}
                    </td>

                    <td className="px-6 py-4">
                      <Badge className="bg-blue-50 text-blue-500">
                        {category.name}
                      </Badge>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(category.createdAt).toLocaleDateString()}
                      
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <UpdateCategoryDialog category={category} />

                        <button
                          onClick={() => setConfirmId(category.id)}
                          className="p-2 rounded-lg border border-gray-200 text-gray-400
                            hover:border-red-200 hover:text-red-400 transition-colors duration-150"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Delete Confirm Dialog */}
      {confirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
          <div className="bg-white rounded-2xl border border-gray-100 w-full max-w-sm mx-4 p-6 space-y-4">
            <div className="space-y-1">
              <h2 className="text-base font-semibold text-gray-900">Delete Category</h2>
              <p className="text-sm text-gray-400">
                Are you sure you want to delete this category? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmId(null)}
                className="px-5 py-2.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isPending}
                className="px-5 py-2.5 text-sm text-white bg-red-500 rounded-xl
                  hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};