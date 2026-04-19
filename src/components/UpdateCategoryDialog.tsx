import React, { useState, useEffect } from "react";
import { Pencil, X } from "lucide-react";

interface Category {
  id?: number;
  name: string;
}

interface UpdateCategoryDialogProps {
  category: Category;
  onUpdate?: (id: number, name: string) => void;
}

export const UpdateCategoryDialog: React.FC<UpdateCategoryDialogProps> = ({
  category, onUpdate,
}) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(category.name);

  useEffect(() => {
    if (open) setName(category.name);
  }, [open, category.name]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onUpdate?.(category.id!, name.trim());
    setOpen(false);
  };

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
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
          <div className="bg-white rounded-2xl border border-gray-100 w-full max-w-sm mx-4">

            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Update Category</h2>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-1.5">
              <label className="text-sm font-normal text-gray-600">Category Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="w-full px-4 py-2.5 text-sm font-normal bg-white border border-gray-100 rounded-xl
                  outline-none focus:border-gray-300 transition-colors text-gray-900"
              />
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-gray-100">
              <button onClick={() => setOpen(false)}
                className="px-5 py-2.5 text-sm font-normal text-gray-600 bg-white border border-gray-200
                  rounded-xl hover:bg-gray-50 transition-colors duration-150">
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={!name.trim()}
                className="px-5 py-2.5 text-sm font-normal text-white bg-gray-900 rounded-xl
                  hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150">
                Update Category
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};