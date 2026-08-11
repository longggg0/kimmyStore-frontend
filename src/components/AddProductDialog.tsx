import React, { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { useCreateProduct, useUploadProductImage } from "@/hook/useProduct";
import { useGetBrands } from "@/hook/useBrand";
import { useQueryClient } from "@tanstack/react-query";

interface AddProductDialogProps {
  categories: { id: number; name: string }[];
}

export const AddProductDialog: React.FC<AddProductDialogProps> = ({ categories }) => {
  const [open, setOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    brandId: "",
    price: "",
    qty: "",
    size: "",
    skinType: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { mutate: createProduct, isPending } = useCreateProduct();
  const { mutate: uploadImage } = useUploadProductImage();
  const { data: brandsData } = useGetBrands();
  const brands = brandsData?.data ?? [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => {
      if (!prev[e.target.name]) return prev;
      const next = { ...prev };
      delete next[e.target.name];
      return next;
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((prev) => {
      if (!prev.image) return prev;
      const next = { ...prev };
      delete next.image;
      return next;
    });
  };

  const handleCancel = () => {
    setForm({ name: "", categoryId: "", brandId: "", price: "", qty: "", size: "", skinType: "", description: "" });
    setImageFile(null);
    setImagePreview(null);
    setErrors({});
    setOpen(false);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Product name is required";
    if (!form.categoryId) newErrors.categoryId = "Please select a category";
    if (!form.price.trim()) newErrors.price = "Price is required";
    if (!form.qty.trim()) newErrors.qty = "Stock quantity is required";
    if (!form.size.trim()) newErrors.size = "Size is required";
    if (!form.skinType.trim()) newErrors.skinType = "Skin type is required";
    if (!imageFile) newErrors.image = "Product image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    createProduct(
      {
        name: form.name,
        categoryId: Number(form.categoryId),
        brandId: form.brandId ? Number(form.brandId) : null,
        price: form.price,
        qty: Number(form.qty),
        size: form.size,
        skinType: form.skinType,
        description: form.description,
        isActive: true,
      },
      {
        onSuccess: (response) => {
  const newProduct = response?.data;
  const newProductId = newProduct?.id;

  const matchedCategory = categories.find((c) => c.id === Number(form.categoryId));
  const matchedBrand = brands.find((b) => b.id === Number(form.brandId));

  queryClient.setQueriesData(
    { predicate: (query) => query.queryKey[0] === "products" || query.queryKey[0] === "products-paginated" },
    (old: any) => {
      if (!old?.data) return old;
      return {
        ...old,
        data: [
          ...old.data,
          {
            ...newProduct,
            category: matchedCategory ? { id: matchedCategory.id, name: matchedCategory.name } : null,
            brand: matchedBrand ? { id: matchedBrand.id, name: matchedBrand.name, image: matchedBrand.image } : null,
            imagePreview, // local blob URL for instant display
          },
        ],
      };
    }
  );

  handleCancel();

  if (imageFile && newProductId) {
    uploadImage({ id: newProductId, file: imageFile });
  } else {
    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey[0] === "products" || query.queryKey[0] === "products-paginated",
    });
  }
},
      }
    );
  };

  const inputClass = `w-full px-4 py-2.5 text-sm bg-white border border-gray-100 rounded-xl
    outline-none focus:border-gray-300 transition-colors text-gray-900 placeholder:text-gray-400`;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-5 py-2.5 bg-gray-900 text-white text-sm rounded-xl hover:bg-gray-700 transition-colors"
      >
        + Add New Product
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
          <div className="bg-white rounded-2xl border border-gray-100 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Add Product</h2>
              <button type="button" onClick={handleCancel} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-50">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">

              <div className="space-y-1.5">
                <label className="text-sm text-gray-600">Product Image</label>
                <div
                  onClick={() => inputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-colors ${
                    errors.image ? "border-red-300" : "border-gray-100 hover:border-gray-300"
                  }`}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview" className="w-16 h-16 rounded-lg object-cover border border-gray-100 shrink-0" />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                      <ImagePlus className="h-6 w-6 text-gray-300" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">
                      {imageFile ? imageFile.name : "Click to upload image"}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, WEBP</p>
                  </div>
                </div>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                {errors.image && <p className="text-xs text-red-500">{errors.image}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm text-gray-600">Product Name</label>
                <input name="name" type="text" placeholder="Enter product name" value={form.name}
                  onChange={handleChange}
                  className={`${inputClass} ${errors.name ? "border-red-300 focus:border-red-400" : ""}`} />
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm text-gray-600">Category</label>
                <select name="categoryId" value={form.categoryId} onChange={handleChange}
                  className={`${inputClass} cursor-pointer ${errors.categoryId ? "border-red-300 focus:border-red-400" : ""}`}>
                  <option value="" disabled>Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                {errors.categoryId && <p className="text-xs text-red-500">{errors.categoryId}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm text-gray-600">Brand</label>
                <select name="brandId" value={form.brandId} onChange={handleChange}
                  className={`${inputClass} cursor-pointer`}>
                  <option value="">No brand</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm text-gray-600">Price ($)</label>
                  <input name="price" type="number" placeholder="0" value={form.price}
                    onChange={handleChange}
                    className={`${inputClass} ${errors.price ? "border-red-300 focus:border-red-400" : ""}`} />
                  {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-gray-600">Stock</label>
                  <input name="qty" type="number" placeholder="0" value={form.qty}
                    onChange={handleChange}
                    className={`${inputClass} ${errors.qty ? "border-red-300 focus:border-red-400" : ""}`} />
                  {errors.qty && <p className="text-xs text-red-500">{errors.qty}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm text-gray-600">Size</label>
                  <input name="size" type="text" placeholder="e.g. 100ml" value={form.size}
                    onChange={handleChange}
                    className={`${inputClass} ${errors.size ? "border-red-300 focus:border-red-400" : ""}`} />
                  {errors.size && <p className="text-xs text-red-500">{errors.size}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-gray-600">Skin Type</label>
                  <input name="skinType" type="text" placeholder="e.g. Oily, Dry" value={form.skinType}
                    onChange={handleChange}
                    className={`${inputClass} ${errors.skinType ? "border-red-300 focus:border-red-400" : ""}`} />
                  {errors.skinType && <p className="text-xs text-red-500">{errors.skinType}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm text-gray-600">Description</label>
                <textarea
                  name="description"
                  placeholder="Enter product description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-5 border-t border-gray-100">
              <button type="button" onClick={handleCancel}
                className="px-5 py-2.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">
                Cancel
              </button>
              <button type="button" onClick={handleSubmit} disabled={isPending}
                className="px-5 py-2.5 text-sm text-white bg-gray-900 rounded-xl hover:bg-gray-700 disabled:opacity-50">
                {isPending ? "Saving..." : "Save Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};