import React, { useState } from "react";
import { Trash2 } from "lucide-react";

interface DeleteCategoryDialogProps {
  categoryId: number;
  categoryName: string;
  onDelete?: (id: number) => void;
}

export const DeleteCategoryDialog: React.FC<DeleteCategoryDialogProps> = ({
  categoryId, categoryName, onDelete,
}) => {
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    onDelete?.(categoryId);
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-lg border border-gray-200 text-gray-400
          hover:border-red-200 hover:text-red-400 transition-colors duration-150"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
          <div className="bg-white rounded-2xl border border-gray-100 w-full max-w-sm mx-4">

            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Delete Category</h2>
            </div>

            <div className="px-6 py-5">
              <p className="text-sm font-normal text-gray-500">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-800">{categoryName}</span>?
                This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-gray-100">
              <button onClick={() => setOpen(false)}
                className="px-5 py-2.5 text-sm font-normal text-gray-600 bg-white border border-gray-200
                  rounded-xl hover:bg-gray-50 transition-colors duration-150">
                Cancel
              </button>
              <button onClick={handleDelete}
                className="px-5 py-2.5 text-sm font-normal text-white bg-red-500 rounded-xl
                  hover:bg-red-600 transition-colors duration-150">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};