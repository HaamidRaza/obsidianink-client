import { upload } from "@imagekit/react";
import { useRef } from "react";
import { toast } from "react-toastify";

const Upload = ({ children, type, onFileSelected, deferUpload = false }) => {
  const fileInputRef = useRef(null);

  const authenticator = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/blogs/upload-auth`
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }
      const data = await response.json();
      const { signature, expire, token, publicKey } = data;
      return { signature, expire, token, publicKey };
    } catch (error) {
      throw new Error(`Authentication request failed: ${error.message}`);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (type === "image" && !file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (type === "video" && !file.type.startsWith("video/")) {
      toast.error("Please select a video file");
      return;
    }

    // Validate file size (10MB for videos, 5MB for images)
    const maxSize = type === "video" ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(`File size should be less than ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    if (deferUpload) {
      // Store the file object and create a function that will upload it later
      // This function will only be called when the form is submitted
      const uploadFunction = async () => {
        const { signature, expire, token, publicKey } = await authenticator();
        
        return upload({
          file,
          fileName: file.name,
          expire,
          token,
          signature,
          publicKey,
        });
      };

      // Pass the file and the upload function (not a promise!)
      onFileSelected(file, uploadFunction);
      toast.success(`${type === "image" ? "Image" : "Video"} added. Will upload when you publish.`);
    } else {
      // Original immediate upload behavior (for backward compatibility)
      try {
        const { signature, expire, token, publicKey } = await authenticator();
        
        const uploadResponse = await upload({
          file,
          fileName: file.name,
          expire,
          token,
          signature,
          publicKey,
        });

        console.log("Upload response:", uploadResponse);
        onFileSelected?.(uploadResponse);
        toast.success(`${type === "image" ? "Image" : "Video"} uploaded successfully!`);
      } catch (error) {
        console.error("Upload error:", error);
        toast.error(`${type === "image" ? "Image" : "Video"} upload failed!`);
      }
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={`${type}/*`}
        className="hidden"
      />
      <div className="cursor-pointer" onClick={() => fileInputRef.current?.click()}>
        {children}
      </div>
    </>
  );
};

export default Upload;