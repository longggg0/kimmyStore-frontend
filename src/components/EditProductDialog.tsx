import React, { useState } from "react";
import { Pencil, X } from "lucide-react";

type Product = {
  id: number;
  name: string;
  price: string;
  qty: number;
  description: string;
  category: { name: string } | null;
  images: { imageUrl: string }[];
};

const CATEGORIES = ["Laptops", "Phones", "Audio", "Accessories", "Monitors"];

interface EditProductDialogProps {
  product: Product;
  onUpdate: (id: number, updated: Omit<Product, "id">) => void;
}

export const EditProductDialog: React.FC<EditProductDialogProps> = ({ product, onUpdate }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: product.name,
    category: product.category?.name || "",
    price: product.price,
    qty: String(product.qty),
    description: product.description,
    imageUrl: product.images[0]?.imageUrl || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    if (!form.name || !form.category || !form.price || !form.qty) return;
    onUpdate(product.id, {
      name: form.name,
      price: form.price,
      qty: Number(form.qty),
      description: form.description,
      category: { name: form.category },
      images: form.imageUrl ? [{ imageUrl: form.imageUrl }] : [],
    });
    setOpen(false);
  };

  const inputClass = `w-full px-4 py-2.5 text-sm font-normal bg-white border border-gray-100
    rounded-xl outline-none focus:border-gray-300 transition-colors duration-150
    text-gray-900 placeholder:text-gray-400`;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-lg border border-gray-200 text-gray-400
          hover:border-blue-200 hover:text-blue-400 transition-colors duration-150"
      >
        <Pencil className="h-4 w-4" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        >
          <div className="bg-white rounded-2xl border border-gray-100 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Edit Product</h2>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">

              <div className="space-y-1.5">
                <label className="text-sm font-normal text-gray-600">Product Name</label>
                <input name="name" type="text" value={form.name} onChange={handleChange} className={inputClass} />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-normal text-gray-600">Category</label>
                <select name="category" value={form.category} onChange={handleChange}
                  className={`${inputClass} appearance-none cursor-pointer`}>
                  <option value="" disabled>Select a category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-normal text-gray-600">Price ($)</label>
                  <input name="price" type="number" value={form.price} onChange={handleChange} className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-normal text-gray-600">Stock</label>
                  <input name="qty" type="number" value={form.qty} onChange={handleChange} className={inputClass} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-normal text-gray-600">Image URL</label>
                <input name="imageUrl" type="url" placeholder="https://example.com/image.jpg"
                  value={form.imageUrl} onChange={handleChange} className={inputClass} />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-normal text-gray-600">Description</label>
                <textarea name="description" rows={4} value={form.description}
                  onChange={handleChange} className={`${inputClass} resize-none`} />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-gray-100">
              <button onClick={() => setOpen(false)}
                className="px-5 py-2.5 text-sm font-normal text-gray-600 bg-white border border-gray-200
                  rounded-xl hover:bg-gray-50 transition-colors duration-150">
                Cancel
              </button>
              <button onClick={handleSubmit}
                className="px-5 py-2.5 text-sm font-normal text-white bg-gray-900 rounded-xl
                  hover:bg-gray-700 transition-colors duration-150">
                Update Product
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};