import React, { useState } from "react";
import { AdminLayout } from "../components/AdminLayout";
import { Trash2 } from "lucide-react";
import { AddCategoryDialog } from "../components/AddCategoryDialog";
import { UpdateCategoryDialog } from "../components/UpdateCategoryDialog";

type Category = {
  id: number;
  name: string;
  createdAt: string;
};

const CATEGORIES: Category[] = [
  { id: 1, name: "Laptops",     createdAt: "2025-01-10T00:00:00Z" },
  { id: 2, name: "Phones",      createdAt: "2025-01-15T00:00:00Z" },
  { id: 3, name: "Audio",       createdAt: "2025-02-03T00:00:00Z" },
  { id: 4, name: "Accessories", createdAt: "2025-02-20T00:00:00Z" },
  { id: 5, name: "Monitors",    createdAt: "2025-03-05T00:00:00Z" },
];

export const AdminCategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);

  // ✅ ADD
  const handleAddCategory = (name: string) => {
    const newCategory: Category = {
      id: Math.max(...categories.map(c => c.id), 0) + 1,
      name,
      createdAt: new Date().toISOString(),
    };

    setCategories((prev) => [...prev, newCategory]);
  };

  // ✅ UPDATE
  const handleUpdateCategory = (id: number, name: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === id ? { ...cat, name } : cat
      )
    );
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

          <AddCategoryDialog onAdd={handleAddCategory} />
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
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-sm font-normal text-gray-400">
                      No categories found
                    </td>
                  </tr>
                ) : (
                  categories.map((category, index) => (
                    <tr
                      key={category.id}
                      className={`hover:bg-gray-50 transition-colors duration-150 ${
                        index !== categories.length - 1 ? "border-b border-gray-100" : ""
                      }`}
                    >
                      {/* ID */}
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {category.id}
                      </td>

                      {/* Name */}
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                          {category.name}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(category.createdAt).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">

                          <UpdateCategoryDialog
                            category={category}
                            onUpdate={handleUpdateCategory}
                          />

                          <button
                            disabled
                            className="p-2 rounded-lg border border-gray-200 text-gray-400
                              cursor-not-allowed hover:border-red-200 hover:text-red-400
                              transition-colors duration-150"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};