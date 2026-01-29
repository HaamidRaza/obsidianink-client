// CoverImageUpload.jsx
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { FormField, UploadIcon } from "./reusableCompo";

const CoverImageUpload = ({ 
  setProgress, 
  coverImage, 
  setCoverImage
}) => {
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setCoverImage(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      toast.success("Cover image added. Will upload when you publish.");
    }
  };

  const removeImage = () => {
    setCoverImage(null);
    setImagePreview(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <FormField label="Featured Image">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {!imagePreview ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="btn-vintage flex items-center gap-2 cursor-pointer"
        >
          <UploadIcon />
          Add Thumbnail Image
        </button>
      ) : (
        <div className="space-y-4">
          {/* Image Preview */}
          <div className="relative bg-paper border border-soft p-4 inline-block max-w-full">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-w-full h-auto max-h-96 object-contain border border-soft"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-2 bg-paper border border-soft hover:border-accent rounded-full transition-colors group cursor-pointer"
              title="Remove image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 group-hover:accent transition-colors"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* File Info */}
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted">
              <span className="font-semibold text-ink">{coverImage?.name}</span>
              <span className="ml-2">
                ({(coverImage?.size / 1024).toFixed(2)} KB)
              </span>
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-sm accent hover:underline cursor-pointer"
            >
              Change Image
            </button>
          </div>
        </div>
      )}
    </FormField>
  );
};

export default CoverImageUpload;