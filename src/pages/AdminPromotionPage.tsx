import React, { useState, useMemo } from "react";
import { AdminLayout } from "../components/AdminLayout";
import {
  Search, Tag, Calendar, Percent, X, CheckCircle2,
  ChevronDown, Check, Trash2, Loader2,
} from "lucide-react";
import { useProducts } from "@/hook/useProduct";
import {
  useGetPromotions,
  useCreatePromotion,
  useDeletePromotion,
} from "@/hook/usePromotion";
import type { Product } from "@/types/Product";
import type { Promotion } from "@/types/Promotion";

const today = () => new Date().toISOString().split("T")[0];


const statusOf = (promo: Promotion) => {
  const now = new Date();
  // endDate from API is a formatted string — use msRemaining as source of truth
  if (promo.msRemaining <= 0) return "expired";
  // startDate: check if still in the future using the formatted date
  const start = new Date(promo.startDate);
  if (!isNaN(start.getTime()) && start > now) return "upcoming";
  if (promo.isActive) return "active";
  return "expired";
};

export const AdminPromotionPage: React.FC = () => {
  //  Products (for the picker) 
  const { data: productData, isLoading: productsLoading, isError: productsError } = useProducts();
  const products: Product[] = productData?.data ?? [];

  //  Promotions from API 
  const {
    data: promotionData,
    isLoading: promotionsLoading,
    isError: promotionsError,
  } = useGetPromotions({ limit: 100 });
  const promotions: Promotion[] = promotionData?.data ?? [];

  const createPromotion = useCreatePromotion();
  const deletePromotion = useDeletePromotion();

  //  Form state 
  const [search, setSearch] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [discountPercent, setDiscountPercent] = useState("");
  const [startDate, setStartDate] = useState(today());
  const [endDate, setEndDate] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  //  Multi-delete state 
  const [selectedPromoIds, setSelectedPromoIds] = useState<Set<number>>(new Set());
  const [deleteMode, setDeleteMode] = useState<"single" | "bulk" | "all" | null>(null);
  const [deleteSingleId, setDeleteSingleId] = useState<number | null>(null);

  //  Product picker helpers 
  const filteredProducts = useMemo(
    () => products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())),
    [search, products]
  );

  const toggleProduct = (product: Product) => {
    setSelectedProducts((prev) =>
      prev.some((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product]
    );
  };

  const isSelected = (product: Product) => selectedProducts.some((p) => p.id === product.id);

  //  Form validation 
  const canSubmit =
    selectedProducts.length > 0 &&
    Number(discountPercent) > 0 &&
    Number(discountPercent) <= 100 &&
    startDate &&
    endDate &&
    endDate >= startDate &&
    !createPromotion.isPending;

  //  Submit: one API call per selected product 
  const handleSubmit = async () => {
    if (!canSubmit) return;
    try {
      await Promise.all(
        selectedProducts.map((product) =>
          createPromotion.mutateAsync({
            name: `${product.name} Promotion`,
            discountPercent: Number(discountPercent),
            startDate: new Date(startDate).toISOString(),
            endDate: new Date(endDate).toISOString(),
            productIds: [product.id],
          })
        )
      );
      setShowSuccess(true);
      setSelectedProducts([]);
      setDiscountPercent("");
      setStartDate(today());
      setEndDate("");
      setTimeout(() => setShowSuccess(false), 3000);
    } catch {
      // errors are available on createPromotion.error if needed
    }
  };

  //  Delete helpers 
  const openDeleteSingle = (id: number) => { setDeleteSingleId(id); setDeleteMode("single"); };
  const openDeleteBulk   = () => setDeleteMode("bulk");
  const openDeleteAll    = () => setDeleteMode("all");

  const handleDeleteConfirm = async () => {
    try {
      if (deleteMode === "single" && deleteSingleId !== null) {
        await deletePromotion.mutateAsync(deleteSingleId);
        setSelectedPromoIds((prev) => { const n = new Set(prev); n.delete(deleteSingleId); return n; });
      } else if (deleteMode === "bulk") {
        await Promise.all([...selectedPromoIds].map((id) => deletePromotion.mutateAsync(id)));
        setSelectedPromoIds(new Set());
      } else if (deleteMode === "all") {
        await Promise.all(promotions.map((p) => deletePromotion.mutateAsync(p.id)));
        setSelectedPromoIds(new Set());
      }
    } catch {
      // handle error if needed
    } finally {
      setDeleteMode(null);
      setDeleteSingleId(null);
    }
  };

  const handleDeleteCancel = () => { setDeleteMode(null); setDeleteSingleId(null); };

  // Row selection helpers
  const allSelected  = promotions.length > 0 && promotions.every((p) => selectedPromoIds.has(p.id));
  const someSelected = promotions.some((p) => selectedPromoIds.has(p.id));

  const toggleSelectAll = () => {
    setSelectedPromoIds(allSelected ? new Set() : new Set(promotions.map((p) => p.id)));
  };

  const toggleSelectPromo = (id: number) => {
    setSelectedPromoIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const deleteDialogMessage = () => {
    if (deleteMode === "single") return "Are you sure you want to remove this promotion? This action cannot be undone.";
    if (deleteMode === "bulk") return `Are you sure you want to remove ${selectedPromoIds.size} promotion(s)? This action cannot be undone.`;
    return `Are you sure you want to remove all ${promotions.length} promotions? This action cannot be undone.`;
  };

  //Render
  return (
    <AdminLayout>
      <div className="space-y-8">

        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-1">Promotions</h1>
          <p className="text-sm text-gray-400">Select products and set a discount period</p>
        </div>

        {showSuccess && (
          <div className="flex items-center gap-3 px-5 py-3.5 bg-green-50 border border-green-100 rounded-2xl text-sm text-green-700">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
            Promotion(s) created successfully.
          </div>
        )}

        {createPromotion.isError && (
          <div className="flex items-center gap-3 px-5 py-3.5 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-600">
            <X className="h-4 w-4 shrink-0" />
            Failed to create promotion. Please try again.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* ── Left: form ─────────────────────────────────────────────────── */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
            <p className="text-sm font-semibold text-gray-700">New Promotion</p>

            {/* Product picker */}
            <div className="space-y-1.5">
              <label className="text-xs text-gray-400 uppercase tracking-wider">
                Products{selectedProducts.length > 0 && ` (${selectedProducts.length} selected)`}
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setPickerOpen((v) => !v)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm bg-white border border-gray-200
                    rounded-xl text-left hover:border-gray-300 transition-colors"
                >
                  <span className={selectedProducts.length > 0 ? "text-gray-900" : "text-gray-400"}>
                    {selectedProducts.length > 0
                      ? `${selectedProducts.length} product${selectedProducts.length > 1 ? "s" : ""} selected`
                      : "Select products…"}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${pickerOpen ? "rotate-180" : ""}`} />
                </button>

                {pickerOpen && (
                  <div className="absolute z-20 mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-3 border-b border-gray-100">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                        <input
                          autoFocus
                          type="text"
                          placeholder="Search…"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-100
                            rounded-xl outline-none focus:border-gray-300 transition-colors placeholder:text-gray-400"
                        />
                      </div>
                    </div>

                    {!productsLoading && !productsError && filteredProducts.length > 0 && (
                      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-gray-50">
                        <span className="text-xs text-gray-400">{filteredProducts.length} results</span>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              const newOnes = filteredProducts.filter((p) => !isSelected(p));
                              setSelectedProducts((prev) => [...prev, ...newOnes]);
                            }}
                            className="text-xs text-gray-500 hover:text-gray-800 transition-colors"
                          >
                            Select all
                          </button>
                          {selectedProducts.length > 0 && (
                            <button
                              type="button"
                              onClick={() => setSelectedProducts([])}
                              className="text-xs text-red-400 hover:text-red-600 transition-colors"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    <ul className="max-h-52 overflow-y-auto">
                      {productsLoading ? (
                        <li className="px-4 py-3 text-sm text-gray-400">Loading products…</li>
                      ) : productsError ? (
                        <li className="px-4 py-3 text-sm text-red-400">Failed to load products.</li>
                      ) : filteredProducts.length === 0 ? (
                        <li className="px-4 py-3 text-sm text-gray-400">No products found.</li>
                      ) : (
                        filteredProducts.map((p) => {
                          const selected = isSelected(p);
                          return (
                            <li key={p.id}>
                              <button
                                type="button"
                                onClick={() => toggleProduct(p)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left
                                  hover:bg-gray-50 transition-colors ${selected ? "bg-gray-50" : ""}`}
                              >
                                <span
                                  className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors
                                    ${selected ? "bg-gray-900 border-gray-900" : "border-gray-300 bg-white"}`}
                                >
                                  {selected && <Check className="h-2.5 w-2.5 text-white" />}
                                </span>
                                <span className={`flex-1 ${selected ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                                  {p.name}
                                </span>
                                <span className="text-xs text-gray-400">${Number(p.price).toFixed(2)}</span>
                              </button>
                            </li>
                          );
                        })
                      )}
                    </ul>

                    <div className="p-3 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => { setPickerOpen(false); setSearch(""); }}
                        className="w-full py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Selected product chips */}
            {selectedProducts.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedProducts.map((p) => (
                  <span
                    key={p.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-xl text-xs font-medium text-gray-700"
                  >
                    {p.name}
                    <button onClick={() => toggleProduct(p)} className="hover:text-red-500 transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Discount */}
            <div className="space-y-1.5">
              <label className="text-xs text-gray-400 uppercase tracking-wider">Discount (%)</label>
              <div className="relative">
                <Percent className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  min={1}
                  max={100}
                  placeholder="e.g. 20"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200
                    rounded-xl outline-none focus:border-gray-300 transition-colors text-gray-900 placeholder:text-gray-400"
                />
              </div>
              {discountPercent && Number(discountPercent) > 0 && selectedProducts.length > 0 && (
                <div className="space-y-1 pl-1">
                  {selectedProducts.map((p) => {
                    const discounted = (Number(p.price) * (1 - Number(discountPercent) / 100)).toFixed(2);
                    return (
                      <p key={p.id} className="text-xs text-gray-400">
                        <span className="text-gray-500 font-medium">{p.name}:</span>{" "}
                        ${Number(p.price).toFixed(2)} →{" "}
                        <span className="font-semibold text-green-600">${discounted}</span>
                      </p>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Date range */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-gray-400 uppercase tracking-wider">Start Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input
                    type="date"
                    value={startDate}
                    min={today()}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-gray-200
                      rounded-xl outline-none focus:border-gray-300 transition-colors text-gray-900"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-400 uppercase tracking-wider">End Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input
                    type="date"
                    value={endDate}
                    min={startDate || today()}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-gray-200
                      rounded-xl outline-none focus:border-gray-300 transition-colors text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="w-full py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-xl
                hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors
                flex items-center justify-center gap-2"
            >
              {createPromotion.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {createPromotion.isPending
                ? "Creating…"
                : selectedProducts.length > 1
                ? `Create ${selectedProducts.length} Promotions`
                : "Create Promotion"}
            </button>
          </div>

          {/* ── Right: promotions table ─────────────────────────────────────── */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 overflow-hidden">

            {/* Table header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <Tag className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-semibold text-gray-700">Active & Upcoming Promotions</span>
              <span className="ml-auto text-xs text-gray-400">{promotions.length} total</span>
              {promotions.length > 0 && (
                <button
                  onClick={openDeleteAll}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-400 border border-red-100 rounded-xl hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete all
                </button>
              )}
            </div>

            {/* Bulk-delete toolbar */}
            {selectedPromoIds.size > 0 && (
              <div className="flex items-center gap-3 px-6 py-2.5 bg-red-50 border-b border-red-100">
                <span className="text-xs font-semibold text-red-600">{selectedPromoIds.size} selected</span>
                <button
                  onClick={openDeleteBulk}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete selected
                </button>
                <button
                  onClick={() => setSelectedPromoIds(new Set())}
                  className="text-xs text-red-400 hover:text-red-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-4 py-3.5 w-10">
                      {promotions.length > 0 && (
                        <input
                          type="checkbox"
                          checked={allSelected}
                          ref={(el) => { if (el) el.indeterminate = someSelected && !allSelected; }}
                          onChange={toggleSelectAll}
                          className="w-3.5 h-3.5 rounded accent-gray-900 cursor-pointer"
                          aria-label="Select all"
                        />
                      )}
                    </th>
                    {["Promotion", "Discount", "Period", "Status", ""].map((h) => (
                      <th key={h} className="px-4 py-3.5 text-left text-xs text-gray-400 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {promotionsLoading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-14">
                        <Loader2 className="h-5 w-5 animate-spin text-gray-300 mx-auto" />
                      </td>
                    </tr>
                  ) : promotionsError ? (
                    <tr>
                      <td colSpan={6} className="text-center py-14 text-sm text-red-400">
                        Failed to load promotions.
                      </td>
                    </tr>
                  ) : promotions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-14 text-sm text-gray-400">
                        No promotions yet. Create one on the left.
                      </td>
                    </tr>
                  ) : (
                    promotions.map((promo, idx) => {
                      const status = statusOf(promo);
                      const isRowSelected = selectedPromoIds.has(promo.id);
                      // The API returns formatted dates; show them directly
                      const productNames = promo.products.length > 0
                        ? promo.products.map((p) => p.name.trim()).join(", ")
                        : promo.name;

                      return (
                        <tr
                          key={promo.id}
                          className={`transition-colors ${
                            isRowSelected ? "bg-red-50" : "hover:bg-gray-50"
                          } ${idx !== promotions.length - 1 ? "border-b border-gray-100" : ""}`}
                        >
                          <td className="px-4 py-4">
                            <input
                              type="checkbox"
                              checked={isRowSelected}
                              onChange={() => toggleSelectPromo(promo.id)}
                              className="w-3.5 h-3.5 rounded accent-gray-900 cursor-pointer"
                              aria-label={`Select ${promo.name}`}
                            />
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-sm font-semibold text-gray-800">{promo.name}</p>
                            {promo.products.length > 0 && (
                              <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[160px]" title={productNames}>
                                {productNames}
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-50 text-orange-600 text-xs rounded-lg font-semibold">
                              <Percent className="h-3 w-3" />
                              {promo.discountPercent}% off
                            </span>
                          </td>
                          <td className="px-4 py-4 text-xs text-gray-500 space-y-0.5">
                            <div>{promo.startDate}</div>
                            <div className="text-gray-300">→ {promo.endDate}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="space-y-1">
                              <span
                                className={`px-2.5 py-1 text-xs rounded-lg font-medium ${
                                  status === "active"
                                    ? "bg-green-50 text-green-600"
                                    : status === "upcoming"
                                    ? "bg-blue-50 text-blue-500"
                                    : "bg-gray-100 text-gray-400"
                                }`}
                              >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </span>
                              {status !== "expired" && (
                                <p className="text-xs text-gray-400">{promo.countdown}</p>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <button
                              onClick={() => openDeleteSingle(promo.id)}
                              disabled={deletePromotion.isPending}
                              className="p-2 rounded-lg border border-gray-200 hover:border-red-200 transition-colors disabled:opacity-40"
                            >
                              <X className="h-3.5 w-3.5 text-red-400" />
                            </button>
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
      </div>

      {/*  Delete Confirm Dialog */}
      {deleteMode !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        >
          <div className="bg-white rounded-2xl border border-gray-100 w-full max-w-sm mx-4 p-6 space-y-4">
            <div className="space-y-1">
              <h2 className="text-base font-semibold text-gray-900">
                {deleteMode === "all"
                  ? "Delete All Promotions"
                  : deleteMode === "bulk"
                  ? "Delete Selected Promotions"
                  : "Remove Promotion"}
              </h2>
              <p className="text-sm text-gray-400">{deleteDialogMessage()}</p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleDeleteCancel}
                disabled={deletePromotion.isPending}
                className="px-5 py-2.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deletePromotion.isPending}
                className="px-5 py-2.5 text-sm text-white bg-red-500 rounded-xl hover:bg-red-600 disabled:opacity-40 flex items-center gap-2"
              >
                {deletePromotion.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {deletePromotion.isPending ? "Removing…" : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};