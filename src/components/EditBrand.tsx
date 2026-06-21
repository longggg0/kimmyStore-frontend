import React, { useRef, useState, useEffect } from "react";
import { ImagePlus, Pencil, X } from "lucide-react";
import type { Brand } from "@/types/Brand";
import { useUpdateBrand } from "@/hook/useBrand";

interface EditBrandProps {
  brand: Brand;
}

export const EditBrand: React.FC<EditBrandProps> = ({ brand }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(brand.name);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate: update, isPending } = useUpdateBrand();

  useEffect(() => {
    if (open) {
      setName(brand.name);
      setImageFile(null);
      setImagePreview(null);
    }
  }, [open, brand]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleClose = () => {
    setImageFile(null);
    setImagePreview(null);
    setOpen(false);
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    update(
      { id: brand.id, name: name.trim(), file: imageFile ?? undefined },
      { onSuccess: handleClose }
    );
  };

  const inputClass = `w-full px-4 py-2.5 text-sm bg-white border border-gray-100 rounded-xl
    outline-none focus:border-gray-300 transition-colors text-gray-900 placeholder:text-gray-400`;

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
          <div className="bg-white rounded-2xl border border-gray-100 w-full max-w-lg mx-4">

            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Edit Brand</h2>
              <button onClick={handleClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-50">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">

              {/* Image Upload */}
              <div className="space-y-1.5">
                <label className="text-sm text-gray-600">Brand Logo</label>
                <div
                  onClick={() => inputRef.current?.click()}
                  className="border-2 border-dashed border-gray-100 rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:border-gray-300 transition-colors"
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview" className="w-16 h-16 rounded-lg object-cover border border-gray-100 shrink-0" />
                  ) : brand.image ? (
                    <img src={brand.image} alt={brand.name} className="w-16 h-16 rounded-lg object-cover border border-gray-100 shrink-0" />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                      <ImagePlus className="h-6 w-6 text-gray-300" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">{imageFile ? imageFile.name : "Click to replace logo"}</p>
                    <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, WEBP, AVIF</p>
                  </div>
                </div>
                <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </div>

              {/* Brand Name */}
              <div className="space-y-1.5">
                <label className="text-sm text-gray-600">Brand Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>

            </div>

            <div className="flex justify-end gap-3 px-6 py-5 border-t border-gray-100">
              <button onClick={handleClose}
                className="px-5 py-2.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={isPending}
                className="px-5 py-2.5 text-sm text-white bg-gray-900 rounded-xl hover:bg-gray-700 disabled:opacity-50">
                {isPending ? "Saving..." : "Update Brand"}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};