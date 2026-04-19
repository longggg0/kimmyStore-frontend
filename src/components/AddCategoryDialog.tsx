import React, { useState } from "react";
import { X } from "lucide-react";

interface AddCategoryDialogProps {
  onAdd?: (name: string) => void;
}

export const AddCategoryDialog: React.FC<AddCategoryDialogProps> = ({ onAdd }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const handleCancel = () => {
    setName("");
    setOpen(false);
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAdd?.(name.trim());
    handleCancel();
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-5 py-2.5 bg-gray-900 text-white text-sm font-normal rounded-xl
          hover:bg-gray-700 transition-colors duration-150"
      >
        + Add Category
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
          <div className="bg-white rounded-2xl border border-gray-100 w-full max-w-sm mx-4">

            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Add Category</h2>
              <button onClick={handleCancel} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-1.5">
              <label className="text-sm font-normal text-gray-600">Category Name</label>
              <input
                type="text"
                placeholder="Enter category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="w-full px-4 py-2.5 text-sm font-normal bg-white border border-gray-100 rounded-xl
                  outline-none focus:border-gray-300 transition-colors text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-gray-100">
              <button onClick={handleCancel}
                className="px-5 py-2.5 text-sm font-normal text-gray-600 bg-white border border-gray-200
                  rounded-xl hover:bg-gray-50 transition-colors duration-150">
                Cancel
              </button>
              <button onClick={handleSubmit}
                className="px-5 py-2.5 text-sm font-normal text-white bg-gray-900 rounded-xl
                  hover:bg-gray-700 transition-colors duration-150">
                Save Category
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};