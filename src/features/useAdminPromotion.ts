// import { useState, useMemo } from "react";
// import { useProducts } from "@/hook/useProduct";
// import type { Product } from "@/types/Product";
// import type { Promotion } from "@/types/Promotion";

// const today = () => new Date().toISOString().split("T")[0];

// export const useAdminPromotion = () => {
//   const { data, isLoading, isError } = useProducts();
//   const products: Product[] = data?.data ?? [];

//   const [search, setSearch] = useState("");
//   const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
//   const [pickerOpen, setPickerOpen] = useState(false);

//   const [discountPercent, setDiscountPercent] = useState("");
//   const [startDate, setStartDate] = useState(today());
//   const [endDate, setEndDate] = useState("");

//   const [promotions, setPromotions] = useState<Promotion[]>([]);
//   const [showSuccess, setShowSuccess] = useState(false);

//   const [selectedPromoIds, setSelectedPromoIds] = useState<Set<number>>(new Set());
//   const [deleteMode, setDeleteMode] = useState<"single" | "bulk" | "all" | null>(null);
//   const [deleteSingleId, setDeleteSingleId] = useState<number | null>(null);

//   const filteredProducts = useMemo(
//     () => products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())),
//     [search, products]
//   );

//   const isSelected = (product: Product) =>
//     selectedProducts.some((p) => p.id === product.id);

//   const toggleProduct = (product: Product) => {
//     setSelectedProducts((prev) =>
//       prev.some((p) => p.id === product.id)
//         ? prev.filter((p) => p.id !== product.id)
//         : [...prev, product]
//     );
//   };

//   const canSubmit =
//     selectedProducts.length > 0 &&
//     Number(discountPercent) > 0 &&
//     Number(discountPercent) <= 100 &&
//     !!startDate &&
//     !!endDate &&
//     endDate >= startDate;

//   const handleSubmit = () => {
//     if (!canSubmit) return;
//     const newPromos: Promotion[] = selectedProducts.map((product) => ({
//       id: Date.now() + Math.random(),
//       productId: product.id,
//       productName: product.name,
//       discountPercent: Number(discountPercent),
//       startDate,
//       endDate,
//     }));
//     setPromotions((prev) => [...newPromos, ...prev]);
//     setShowSuccess(true);
//     setSelectedProducts([]);
//     setDiscountPercent("");
//     setStartDate(today());
//     setEndDate("");
//     setTimeout(() => setShowSuccess(false), 3000);
//   };

//   // --- Single / bulk / all delete ---
//   const openDeleteSingle = (id: number) => {
//     setDeleteSingleId(id);
//     setDeleteMode("single");
//   };
//   const openDeleteBulk = () => setDeleteMode("bulk");
//   const openDeleteAll = () => setDeleteMode("all");

//   const handleDeleteConfirm = () => {
//     if (deleteMode === "single" && deleteSingleId !== null) {
//       setPromotions((prev) => prev.filter((p) => p.id !== deleteSingleId));
//       setSelectedPromoIds((prev) => {
//         const next = new Set(prev);
//         next.delete(deleteSingleId);
//         return next;
//       });
//     } else if (deleteMode === "bulk") {
//       setPromotions((prev) => prev.filter((p) => !selectedPromoIds.has(p.id)));
//       setSelectedPromoIds(new Set());
//     } else if (deleteMode === "all") {
//       setPromotions([]);
//       setSelectedPromoIds(new Set());
//     }
//     setDeleteMode(null);
//     setDeleteSingleId(null);
//   };

//   const handleDeleteCancel = () => {
//     setDeleteMode(null);
//     setDeleteSingleId(null);
//   };

//   // --- Row selection ---
//   const allSelected =
//     promotions.length > 0 && promotions.every((p) => selectedPromoIds.has(p.id));
//   const someSelected = promotions.some((p) => selectedPromoIds.has(p.id));

//   const toggleSelectAll = () => {
//     if (allSelected) {
//       setSelectedPromoIds(new Set());
//     } else {
//       setSelectedPromoIds(new Set(promotions.map((p) => p.id)));
//     }
//   };

//   const toggleSelectPromo = (id: number) => {
//     setSelectedPromoIds((prev) => {
//       const next = new Set(prev);
//       next.has(id) ? next.delete(id) : next.add(id);
//       return next;
//     });
//   };

//   const deleteDialogMessage = () => {
//     if (deleteMode === "single") return "Are you sure you want to remove this promotion? This action cannot be undone.";
//     if (deleteMode === "bulk") return `Are you sure you want to remove ${selectedPromoIds.size} promotion(s)? This action cannot be undone.`;
//     return `Are you sure you want to remove all ${promotions.length} promotions? This action cannot be undone.`;
//   };

//   const deleteDialogTitle = () => {
//     if (deleteMode === "all") return "Delete All Promotions";
//     if (deleteMode === "bulk") return "Delete Selected Promotions";
//     return "Remove Promotion";
//   };

//   return {
//     // products
//     products, isLoading, isError,
//     filteredProducts, search, setSearch,
//     selectedProducts, pickerOpen, setPickerOpen,
//     isSelected, toggleProduct,
//     // form
//     discountPercent, setDiscountPercent,
//     startDate, setStartDate,
//     endDate, setEndDate,
//     canSubmit, handleSubmit,
//     showSuccess,
//     // promotions table
//     promotions,
//     selectedPromoIds,
//     allSelected, someSelected,
//     toggleSelectAll, toggleSelectPromo,
//     // delete
//     deleteMode,
//     openDeleteSingle, openDeleteBulk, openDeleteAll,
//     handleDeleteConfirm, handleDeleteCancel,
//     deleteDialogTitle, deleteDialogMessage,
//   };
// };