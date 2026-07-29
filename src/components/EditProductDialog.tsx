import React, { useRef, useState, useEffect } from "react";
import { ImagePlus, Pencil, X } from "lucide-react";
import type { Product } from "@/types/Product";
import { useUpdateProduct, useUploadProductImage, useUpdateProductImage } from "@/hook/useProduct";

interface EditProductDialogProps {
  product: Product;
  categories: { id: number; name: string }[];
  onImageUpdated: (productId: number) => void;
}

export const EditProductDialog: React.FC<EditProductDialogProps> = ({
  product,
  categories,
  onImageUpdated,
}) => {
  const [open, setOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [hasExistingImage, setHasExistingImage] = useState(false);
  const [form, setForm] = useState({
    name: product.name,
    categoryId: String(product.categoryId),
    price: product.price,
    qty: String(product.qty),
    size: product.size || "",
    skinType: product.skinType || "",
    description: product.description || "",
  });
  
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate: update, isPending } = useUpdateProduct();
  const { mutate: uploadImage } = useUploadProductImage();
  const { mutate: updateImage } = useUpdateProductImage();

  useEffect(() => {
    if (open) {
      setForm({
        name: product.name,
        categoryId: String(product.categoryId),
        price: product.price,
        qty: String(product.qty),
        size: product.size || "",
        skinType: product.skinType || "",
        description: product.description || "",
      });
      setImageFile(null);
      setImagePreview(null);
      setHasExistingImage(false);
    }
  }, [open, product]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleClose = () => {
    setImageFile(null);
    setImagePreview(null);
    setHasExistingImage(false);
    setOpen(false);
  };

  const handleSubmit = () => {
    if (!form.name || !form.categoryId || !form.price || !form.qty) return;

    update(
      {
        id: product.id,
        body: {
          name: form.name,
          categoryId: Number(form.categoryId),
          price: form.price,
          qty: Number(form.qty),
          size: form.size,
          skinType: form.skinType,
          description: form.description,
          isActive: product.isActive,
        },
      },
      {
        onSuccess: () => {
          // Close immediately — text fields are already patched into the
          // table optimistically. Image upload (if any) runs in the
          // background so we're not stuck waiting on Cloudinary.
          handleClose();

          if (imageFile) {
            const mutateImage = hasExistingImage ? updateImage : uploadImage;
            mutateImage(
              { id: product.id, file: imageFile },
              {
                onSuccess: () => onImageUpdated(product.id), // bust image cache once the real upload lands
              }
            );
          }
        },
      }
    );
  };

  const inputClass = `w-full px-4 py-2.5 text-sm bg-white border border-gray-100 rounded-xl
    outline-none focus:border-gray-300 transition-colors text-gray-900 placeholder:text-gray-400`;

  const currentImageUrl = `https://kimmystore-backend.onrender.com/api/v3/product/images/${product.id}/download?t=${new Date(product.updatedAt).getTime()}`;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-lg border border-gray-200 hover:border-blue-200 hover:text-blue-400 transition-colors"
      >
        <Pencil className="h-4 w-4" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
          <div className="bg-white rounded-2xl border border-gray-100 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Edit Product</h2>
              <button onClick={handleClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-50">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">

              {/* Image Upload */}
              <div className="space-y-1.5">
                <label className="text-sm text-gray-600">Product Image</label>
                <div
                  onClick={() => inputRef.current?.click()}
                  className="border-2 border-dashed border-gray-100 rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:border-gray-300 transition-colors"
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview" className="w-16 h-16 rounded-lg object-cover border border-gray-100 shrink-0" />
                  ) : (
                    <>
                      <img
                        src={currentImageUrl}
                        alt={product.name}
                        className="w-16 h-16 rounded-lg object-cover border border-gray-100 shrink-0"
                        onLoad={() => setHasExistingImage(true)}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                          if (fallback) fallback.classList.remove("hidden");
                          setHasExistingImage(false);
                        }}
                      />
                      <div className="w-16 h-16 rounded-lg bg-gray-50 items-center justify-center shrink-0 hidden">
                        <ImagePlus className="h-6 w-6 text-gray-300" />
                      </div>
                    </>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">
                      {imageFile ? imageFile.name : "Click to replace image"}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, WEBP</p>
                  </div>
                </div>
                <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm text-gray-600">Product Name</label>
                <input name="name" type="text" value={form.name} onChange={handleChange} className={inputClass} />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm text-gray-600">Category</label>
                <select name="categoryId" value={form.categoryId} onChange={handleChange} className={`${inputClass} cursor-pointer`}>
                  <option value="" disabled>Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm text-gray-600">Price ($)</label>
                  <input name="price" type="number" value={form.price} onChange={handleChange} className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-gray-600">Stock</label>
                  <input name="qty" type="number" value={form.qty} onChange={handleChange} className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm text-gray-600">Size</label>
                  <input name="size" type="text" placeholder="e.g. 100ml" value={form.size} onChange={handleChange} className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-gray-600">Skin Type</label>
                  <input name="skinType" type="text" placeholder="e.g. Oily, Dry" value={form.skinType} onChange={handleChange} className={inputClass} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm text-gray-600">Description</label>
                <textarea name="description" placeholder="Enter product description" value={form.description}
                  onChange={handleChange} rows={3} className={`${inputClass} resize-none`} />
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-5 border-t border-gray-100">
              <button onClick={handleClose}
                className="px-5 py-2.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={isPending}
                className="px-5 py-2.5 text-sm text-white bg-gray-900 rounded-xl hover:bg-gray-700 disabled:opacity-50">
                {isPending ? "Saving..." : "Update Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};