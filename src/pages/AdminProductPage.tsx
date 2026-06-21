import React, { useState } from "react";
import { AdminLayout } from "../components/AdminLayout";
import { Search, Trash } from "lucide-react";
import { AddProductDialog } from "../components/AddProductDialog";
import { useDeleteProduct, useProducts } from "@/hook/useProduct";
// import { useCategory } from "@/hook/useCategory";
import { EditProductDialog } from "@/components/EditProductDialog";
import { useCategory } from "@/hook/useCategories";

export const AdminProductsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [imageBusters, setImageBusters] = useState<Record<number, number>>({});

  const { data, isLoading, isError } = useProducts();
  const { data: categories = [] } = useCategory();
  const { mutate: deleteProduct } = useDeleteProduct();

  const products = data?.data ?? [];

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteConfirm = () => {
    if (confirmId === null) return;
    deleteProduct(confirmId, { onSuccess: () => setConfirmId(null) });
  };

  const bustImage = (productId: number) => {
    setImageBusters((prev) => ({ ...prev, [productId]: Date.now() }));
  };

  return (
    <AdminLayout>
      <div className="space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-1">Product Management</h1>
            <p className="text-sm text-gray-400">Manage your product inventory</p>
          </div>
          <AddProductDialog categories={categories} />
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-100
              rounded-xl outline-none focus:border-gray-300 transition-colors text-gray-900 placeholder:text-gray-400"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["ID", "Image", "Name", "Category", "Price", "Stock", "Size", "SkinType", "Description", "Actions"].map((h) => (
                    <th key={h} className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={10} className="text-center py-12 text-sm text-gray-400">Loading...</td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={10} className="text-center py-12 text-sm text-red-400">Failed to load products.</td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-12 text-sm text-gray-400">No products found.</td>
                  </tr>
                ) : (
                  filtered.map((product, index) => {
                    const t = imageBusters[product.id] ?? new Date(product.updatedAt).getTime();
                    return (
                      <tr
                        key={product.id}
                        className={`hover:bg-gray-50 transition-colors ${
                          index !== filtered.length - 1 ? "border-b border-gray-100" : ""
                        }`}
                      >
                        <td className="px-6 py-4 text-sm text-gray-400">{product.id}</td>

                        <td className="px-6 py-4">
                          <img
                            key={t}
                            src={`http://localhost:3000/api/v3/product/images/${product.id}/download?t=${t}`}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover border border-gray-100"
                            onError={(e) => { e.currentTarget.style.display = "none"; }}
                          />
                        </td>

                        <td className="px-6 py-4 text-sm font-semibold text-gray-800">{product.name}</td>

                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                            {product.category?.name || "N/A"}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                          ${Number(product.price).toLocaleString()}
                        </td>

                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-xs rounded-lg ${
                            product.qty > 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
                          }`}>
                            {product.qty > 0 ? `${product.qty} units` : "Out of stock"}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">{product.size || "N/A"}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{product.skinType || "N/A"}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{product.description || "N/A"}</td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <EditProductDialog
                              product={product}
                              categories={categories}
                              onImageUpdated={bustImage}
                            />
                            <button
                              onClick={() => setConfirmId(product.id)}
                              className="p-2 rounded-lg border border-gray-200 hover:border-red-200 transition-colors"
                            >
                              <Trash className="h-4 w-4 text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Delete Confirm Dialog */}
      {confirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
          <div className="bg-white rounded-2xl border border-gray-100 w-full max-w-sm mx-4 p-6 space-y-4">
            <div className="space-y-1">
              <h2 className="text-base font-semibold text-gray-900">Delete Product</h2>
              <p className="text-sm text-gray-400">Are you sure you want to delete this product? This action cannot be undone.</p>
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
                className="px-5 py-2.5 text-sm text-white bg-red-500 rounded-xl hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};