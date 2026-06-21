import React, { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { useCreateBrand } from "@/hook/useBrand";

export const AddBrand: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate: createBrand, isPending } = useCreateBrand();

  const handleCancel = () => {
    setName("");
    setImageFile(null);
    setImagePreview(null);
    setOpen(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    if (!name.trim() || !imageFile) return;
    createBrand(
      { name: name.trim(), file: imageFile },
      { onSuccess: handleCancel }
    );
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-5 py-2.5 bg-gray-900 text-white text-sm font-normal rounded-xl
          hover:bg-gray-700 transition-colors duration-150"
      >
        + Add Brand
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
          <div className="bg-white rounded-2xl border border-gray-100 w-full max-w-sm mx-4">

            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Add Brand</h2>
              <button onClick={handleCancel}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">

              {/* Image Upload */}
              <div className="space-y-1.5">
                <label className="text-sm font-normal text-gray-600">Brand Logo</label>
                <div
                  onClick={() => inputRef.current?.click()}
                  className="border-2 border-dashed border-gray-100 rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:border-gray-300 transition-colors"
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview" className="w-16 h-16 rounded-lg object-cover border border-gray-100 shrink-0" />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                      <ImagePlus className="h-6 w-6 text-gray-300" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">{imageFile ? imageFile.name : "Click to upload logo"}</p>
                    <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, WEBP, AVIF</p>
                  </div>
                </div>
                <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </div>

              {/* Brand Name */}
              <div className="space-y-1.5">
                <label className="text-sm font-normal text-gray-600">Brand Name</label>
                <input
                  type="text"
                  placeholder="Enter brand name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full px-4 py-2.5 text-sm font-normal bg-white border border-gray-100 rounded-xl
                    outline-none focus:border-gray-300 transition-colors text-gray-900 placeholder:text-gray-400"
                />
              </div>

            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-gray-100">
              <button onClick={handleCancel}
                className="px-5 py-2.5 text-sm font-normal text-gray-600 bg-white border border-gray-200
                  rounded-xl hover:bg-gray-50 transition-colors duration-150">
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={!name.trim() || !imageFile || isPending}
                className="px-5 py-2.5 text-sm font-normal text-white bg-gray-900 rounded-xl
                  hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150">
                {isPending ? "Saving..." : "Save Brand"}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};