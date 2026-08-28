import React, { useState, useEffect, useMemo } from "react";
import { AdminLayout } from "../components/AdminLayout";
import { Search, Trash, ChevronLeft, ChevronRight } from "lucide-react";
import { AddProductDialog } from "../components/AddProductDialog";
import { useDeleteProduct, useProductsPaginated } from "@/hook/useProduct";
import { EditProductDialog } from "@/components/EditProductDialog";
import { useCategory } from "@/hook/useCategories";
import { useGetBrands } from "@/hook/useBrand";
import type { Product } from "@/types/Product";

// Client-only field added for optimistic UI: shows the locally picked image
// instantly, before the real uploaded image URL is available from the server.
type ProductWithPreview = Product & { imagePreview?: string };

const PRODUCTS_PER_PAGE = 20;
const SEARCH_DEBOUNCE_MS = 400;

export const AdminProductsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [imageBusters, setImageBusters] = useState<Record<number, number>>({});
  const [currentPage, setCurrentPage] = useState(1);

  const BASE_URL = import.meta.env.VITE_API_URL;
  const { data: categories = [] } = useCategory();
  const { data: brandData } = useGetBrands();
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  // Debounce search so we don't fire a server request on every keystroke.
  useEffect(() => {
    const handle = setTimeout(() => setDebouncedSearch(search), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [search]);

  // Brand options for the filter dropdown. Sourced from the brands API
  // (not just brands present in the current product list) so the filter
  // stays complete even if a brand currently has zero products.
  const brands = useMemo(() => brandData?.data ?? [], [brandData]);

  const selectedBrandId = selectedBrand === "all"
    ? undefined
    : brands.find((b) => b.name === selectedBrand)?.id;

  const selectedCategoryId = selectedCategory === "all"
    ? undefined
    : categories.find((c) => c.name === selectedCategory)?.id;

  // Server-side pagination, search, and filtering — the route already
  // supports page/limit/search/categoryId/brandId, so we send those
  // directly instead of fetching everything and slicing on the client.
  const { data, isLoading, isError, isFetching } = useProductsPaginated({
    page: currentPage,
    limit: PRODUCTS_PER_PAGE,
    search: debouncedSearch || undefined,
    categoryId: selectedCategoryId,
    brandId: selectedBrandId,
  });

  // Separate, lightweight fetch used only to figure out which categories the
  // selected brand actually has products in — high limit, no other filters,
  // so it isn't affected by search/category/pagination above.
  // NOTE: if useProductsPaginated supports an `enabled` option, pass
  // `enabled: selectedBrand !== "all"` here too, so this doesn't fire at all
  // when "All Brands" is selected.
  const { data: brandProductsData } = useProductsPaginated({
    page: 1,
    limit: 1000,
    brandId: selectedBrandId,
  });

  const products = (data?.data ?? []) as ProductWithPreview[];
  const pagination = data?.pagination;
  const total = pagination?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PRODUCTS_PER_PAGE));

  // Categories that the selected brand actually has products in.
  // Falls back to the full category list when "All Brands" is selected.
  const availableCategories = useMemo(() => {
    if (selectedBrand === "all") return categories;

    const brandProducts = brandProductsData?.data ?? [];
    const categoryNamesForBrand = new Set(
      brandProducts
        .map((p) => p.category?.name)
        .filter((name): name is string => Boolean(name))
    );

    return categories.filter((c) => categoryNamesForBrand.has(c.name));
  }, [selectedBrand, brandProductsData, categories]);

  // If the currently selected category isn't valid for the newly selected
  // brand, reset it back to "all" instead of showing zero results.
  useEffect(() => {
    if (
      selectedCategory !== "all" &&
      !availableCategories.some((c) => c.name === selectedCategory)
    ) {
      setSelectedCategory("all");
    }
  }, [availableCategories, selectedCategory]);

  // Reset to page 1 whenever the search query or filters change, so the
  // user doesn't get stranded on a now out-of-range page.
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedBrand, selectedCategory]);

  // Clamp current page if the result set shrinks below the current page
  // (e.g. a filter change reduces total pages while we're deep in the list).
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const startIndex = total === 0 ? 0 : (currentPage - 1) * PRODUCTS_PER_PAGE + 1;
  const endIndex = Math.min(currentPage * PRODUCTS_PER_PAGE, total);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Build a compact page number list with ellipses for large page counts.
  const getPageNumbers = (): (number | "ellipsis")[] => {
    const pages: (number | "ellipsis")[] = [];
    const delta = 1;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    if (currentPage - delta > 2) {
      pages.push("ellipsis");
    }

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      pages.push(i);
    }

    if (currentPage + delta < totalPages - 1) {
      pages.push("ellipsis");
    }

    pages.push(totalPages);

    return pages;
  };

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

        {/* Search + Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative max-w-sm w-full">
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

          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full sm:w-56 px-4 py-2.5 text-sm bg-white border border-gray-100
              rounded-xl outline-none focus:border-gray-300 transition-colors text-gray-700"
          >
            <option value="all">All Brands</option>
            {brands.map((b) => (
              <option key={b.id} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-56 px-4 py-2.5 text-sm bg-white border border-gray-100
              rounded-xl outline-none focus:border-gray-300 transition-colors text-gray-700"
          >
            <option value="all">All Categories</option>
            {availableCategories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["ID", "Image", "Name", "Category", "Brand", "Price", "Stock", "Size", "SkinType", "Description", "Actions"].map((h) => (
                    <th key={h} className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={isFetching ? "opacity-60 transition-opacity" : "transition-opacity"}>
                {isLoading ? (
                  <tr>
                    <td colSpan={11} className="text-center py-12 text-sm text-gray-400">Loading...</td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={11} className="text-center py-12 text-sm text-red-400">Failed to load products.</td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="text-center py-12 text-sm text-gray-400">No products found.</td>
                  </tr>
                ) : (
                  products.map((product, index) => {
                    const t = imageBusters[product.id] ?? new Date(product.updatedAt).getTime();
                    return (
                      <tr
                        key={product.id}
                        className={`hover:bg-gray-50 transition-colors ${
                          index !== products.length - 1 ? "border-b border-gray-100" : ""
                        }`}
                      >
                        <td className="px-6 py-4 text-sm text-gray-400">{product.id}</td>

                        <td className="px-6 py-4">
                          <img
                            key={t}
                            src={
                              product.imagePreview
                                ? product.imagePreview
                                : `${BASE_URL}/api/v3/product/images/${product.id}/download?t=${t}`
                            }
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover border border-gray-100"
                            onError={(e) => { e.currentTarget.style.display = "none"; }}
                          />
                        </td>

                        <td className="px-6 py-4 text-sm font-semibold text-gray-800">{product.name}</td>

                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg whitespace-nowrap">
                            {product.category?.name || "N/A"}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                          {product.brand?.name || "N/A"}
                        </td>

                        <td className="px-6 py-4 text-sm font-semibold text-gray-800 whitespace-nowrap">
                          ${Number(product.price).toLocaleString()}
                        </td>

                        <td className="px-6 py-4">
                          <span className={`inline-block px-2.5 py-1 text-xs rounded-lg whitespace-nowrap ${
                            product.qty > 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
                          }`}>
                            {product.qty > 0 ? `${product.qty} units` : "Out of stock"}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{product.size || "N/A"}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{product.skinType || "N/A"}</td>
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

          {/* Pagination Controls */}
          {!isLoading && !isError && total > 0 && (
            <div className="flex flex-col gap-3 border-t border-gray-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs font-normal text-gray-400">
                Showing{" "}
                <span className="font-medium text-gray-600">{startIndex}</span>{" "}
                -{" "}
                <span className="font-medium text-gray-600">{endIndex}</span>{" "}
                of{" "}
                <span className="font-medium text-gray-600">{total}</span>{" "}
                products
              </p>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center justify-center h-8 w-8 rounded-lg border border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-700 hover:bg-gray-50 transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-400 disabled:hover:bg-transparent"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {getPageNumbers().map((page, idx) =>
                  page === "ellipsis" ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className="flex items-center justify-center h-8 w-8 text-xs text-gray-400"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={page}
                      type="button"
                      onClick={() => goToPage(page)}
                      className={`flex items-center justify-center h-8 w-8 rounded-lg text-xs font-medium transition-colors duration-150 ${
                        page === currentPage
                          ? "bg-gray-800 text-white"
                          : "border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  type="button"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center justify-center h-8 w-8 rounded-lg border border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-700 hover:bg-gray-50 transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-400 disabled:hover:bg-transparent"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
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
                disabled={isDeleting}
                className="px-5 py-2.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-5 py-2.5 text-sm text-white bg-red-500 rounded-xl hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};