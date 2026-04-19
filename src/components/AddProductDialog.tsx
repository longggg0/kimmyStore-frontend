import React, { useState } from "react";
import { X } from "lucide-react";

const CATEGORIES = ["iPhone", "Laptop", "Audio", "Accessories", "Monitors"];

interface AddProductDialogProps {
  onAdd?: (product: any) => void;
}

export const AddProductDialog: React.FC<AddProductDialogProps> = ({ onAdd }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "", categoryId: "", price: "", stock: "", description: "", image: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCancel = () => {
    setForm({ name: "", categoryId: "", price: "", stock: "", description: "", image: null });
    setOpen(false);
  };

  const handleSubmit = () => {
    if (!form.name || !form.categoryId || !form.price || !form.stock) return;
    onAdd?.(form);
    handleCancel();
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-5 py-2.5 bg-gray-900 text-white text-sm font-normal rounded-xl
          hover:bg-gray-700 transition-colors duration-150"
      >
        + Add New Product
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
          <div className="bg-white rounded-2xl border border-gray-100 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Add Product</h2>
              <button onClick={handleCancel} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">

              <div className="space-y-1.5">
                <label className="text-sm font-normal text-gray-600">Product Name</label>
                <input name="name" type="text" placeholder="Enter product name" value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm font-normal bg-white border border-gray-100 rounded-xl
                    outline-none focus:border-gray-300 transition-colors text-gray-900 placeholder:text-gray-400" />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-normal text-gray-600">Category</label>
                <select name="categoryId" value={form.categoryId} onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm font-normal bg-white border border-gray-100 rounded-xl
                    outline-none focus:border-gray-300 transition-colors text-gray-900 appearance-none cursor-pointer">
                  <option value="" disabled>Select category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-normal text-gray-600">Price ($)</label>
                  <input name="price" type="number" placeholder="0" value={form.price} onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm font-normal bg-white border border-gray-100 rounded-xl
                      outline-none focus:border-gray-300 transition-colors text-gray-900 placeholder:text-gray-400" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-normal text-gray-600">Stock</label>
                  <input name="stock" type="number" placeholder="0" value={form.stock} onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm font-normal bg-white border border-gray-100 rounded-xl
                      outline-none focus:border-gray-300 transition-colors text-gray-900 placeholder:text-gray-400" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-normal text-gray-600">Image</label>
                <input type="file" accept="image/*"
                  onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.files?.[0] || null }))}
                  className="w-full px-4 py-2 text-sm font-normal text-gray-500 bg-white border border-gray-100
                    rounded-xl outline-none cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-lg
                    file:border-0 file:text-xs file:font-normal file:bg-gray-100 file:text-gray-600" />
                {form.image && (
                  <img src={URL.createObjectURL(form.image)} alt="Preview"
                    className="w-16 h-16 object-cover rounded-lg border border-gray-100 mt-2" />
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-normal text-gray-600">Description</label>
                <textarea name="description" placeholder="Enter product description" rows={4}
                  value={form.description} onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm font-normal bg-white border border-gray-100 rounded-xl
                    outline-none focus:border-gray-300 transition-colors text-gray-900 placeholder:text-gray-400 resize-none" />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-gray-100">
              <button onClick={handleCancel}
                className="px-5 py-2.5 text-sm font-normal text-gray-600 bg-white border border-gray-200
                  rounded-xl hover:bg-gray-50 transition-colors duration-150">
                Cancel
              </button>
              <button onClick={handleSubmit}
                className="px-5 py-2.5 text-sm font-normal text-white bg-gray-900 rounded-xl
                  hover:bg-gray-700 transition-colors duration-150">
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};