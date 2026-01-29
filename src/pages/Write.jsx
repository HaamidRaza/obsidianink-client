import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import axios from "axios";
import { upload } from "@imagekit/react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FormField, LoadingState } from "../components/reusableCompo";
import CoverImageUpload from "../components/CoverImage";
import Upload from "../components/MediaUpload";
import CustomImage from "../components/Image.jsx";

const Write = () => {
  const { isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [value, setValue] = useState("");
  const [progress, setProgress] = useState(0);
  const [coverImage, setCoverImage] = useState("");

  const [pendingImages, setPendingImages] = useState([]);
  const [pendingVideos, setPendingVideos] = useState([]);

  const mutation = useMutation({
    mutationFn: async (newBlog) => {
      const token = await getToken();
      return axios.post(`${import.meta.env.VITE_API_URL}/blogs`, newBlog, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: (res) => {
      toast.success("Blog has been created!");
      navigate(`/${res.data.slug}`);
    },
    onError: () => {
      toast.error("Failed to create blog. Please try again.");
      setProgress(0);
    },
  });

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {};
  }, []);

  if (!isLoaded) {
    return <LoadingState message="Loading..." />;
  }

  if (!isSignedIn) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="article text-center">
          <h1 className="mb-6">You are not logged in to write an article</h1>
          <a href="/login" className="btn-vintage inline-block no-underline">
            Login to Continue
          </a>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      setProgress(1);
      let contentWithMedia = value;
      let coverImageUrl = "";

      // Upload cover image if selected
      if (coverImage) {
        toast.info("Uploading cover image...");
        try {
          const authResponse = await fetch(
            `${import.meta.env.VITE_API_URL}/blogs/upload-auth`,
          );
          const authData = await authResponse.json();
          const { signature, expire, token, publicKey } = authData;

          const uploadResponse = await upload({
            file: coverImage,
            fileName: coverImage.name,
            expire,
            token,
            signature,
            publicKey,
          });

          coverImageUrl = uploadResponse.filePath
            ? `${import.meta.env.VITE_IK_URL_ENDPOINT}${uploadResponse.filePath}`
            : "";
          setProgress(10);
        } catch (error) {
          console.error("Cover image upload error:", error);
          throw new Error("Failed to upload cover image");
        }
      }

      // Upload all pending images
      if (pendingImages.length > 0) {
        toast.info("Uploading images...");
        for (let i = 0; i < pendingImages.length; i++) {
          const imageData = pendingImages[i];
          const uploadedImage = await imageData.uploadFunction();

          if (!uploadedImage || !uploadedImage.filePath) {
            throw new Error("Image upload failed to return a valid file path");
          }

          // Replace text placeholder with actual image element
          const escapedPlaceholder = imageData.placeholder
            .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
            .replace(/ /g, "&nbsp;");
          const placeholderRegex = new RegExp(
            `\\[IMAGE:&nbsp;${escapedPlaceholder}\\]`,
            "g",
          );
          contentWithMedia = contentWithMedia.replace(
            placeholderRegex,
            `<img src="${import.meta.env.VITE_IK_URL_ENDPOINT}${uploadedImage.filePath}" style="max-width: 100%; height: auto; max-height: 400px; object-fit: contain; display: block; margin: 1rem auto; border: 1px solid var(--border-soft);" />`,
          );

          setProgress(
            10 + ((i + 1) / (pendingImages.length + pendingVideos.length)) * 40,
          );
        }
      }

      // Upload all pending videos
      if (pendingVideos.length > 0) {
        toast.info("Uploading videos...");
        for (let i = 0; i < pendingVideos.length; i++) {
          const videoData = pendingVideos[i];
          const uploadedVideo = await videoData.uploadFunction();

          if (!uploadedVideo || !uploadedVideo.filePath) {
            throw new Error("Video upload failed to return a valid file path");
          }

          // Replace text placeholder with actual video element
          const escapedPlaceholder = videoData.placeholder
            .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
            .replace(/ /g, "&nbsp;");
          const placeholderRegex = new RegExp(
            `\\[VIDEO:&nbsp;${escapedPlaceholder}\\]`,
            "g",
          );
          contentWithMedia = contentWithMedia.replace(
            placeholderRegex,
            `<video src="${import.meta.env.VITE_IK_URL_ENDPOINT}${uploadedVideo.filePath}" controls style="max-width: 100%; height: auto; max-height: 400px; display: block; margin: 1rem auto; border: 1px solid var(--border-soft);"></video>`,
          );

          setProgress(
            50 + ((i + 1) / (pendingImages.length + pendingVideos.length)) * 40,
          );
        }
      }

      setProgress(75);

      const data = {
        img: coverImageUrl,
        title: formData.get("title"),
        desc: formData.get("desc"),
        category: formData.get("category"),
        content: contentWithMedia,
      };

      setProgress(90);
      console.log(data);
      mutation.mutate(data);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload media. Please try again.");
      setProgress(0);
    }
  };

  // Handle when image is selected
  const handleImageSelected = (file, uploadFunction) => {
    const placeholder = `${file.name.replace(/\s+/g, "_")}`;
    const id = Date.now() + Math.random();
    const reader = new FileReader();
    reader.onloadend = () => {
      const previewUrl = reader.result;

      setPendingImages((prev) => [
        ...prev,
        {
          id,
          file,
          uploadFunction,
          placeholder,
          previewUrl,
          fileName: file.name,
        },
      ]);
      setValue((prev) => prev + `<p>[IMAGE: ${placeholder}]<br/></p>`);
    };
    reader.readAsDataURL(file);
  };

  // Handle when video is selected
  const handleVideoSelected = (file, uploadFunction) => {
    const placeholder = `${file.name.replace(/\s+/g, "_")}`;
    const id = Date.now() + Math.random();

    const reader = new FileReader();
    reader.onloadend = () => {
      const previewUrl = reader.result;

      setPendingVideos((prev) => [
        ...prev,
        {
          id,
          file,
          uploadFunction,
          placeholder,
          previewUrl,
          fileName: file.name,
        },
      ]);

      setValue((prev) => prev + `<p>[VIDEO: ${placeholder}]<br/></p>`);
    };
    reader.readAsDataURL(file);
  };

  // Remove image
  const handleRemoveImage = (imageToRemove) => {
    setPendingImages((prev) =>
      prev.filter((img) => img.id !== imageToRemove.id),
    );

    setValue((prev) => {
      const escapedPlaceholder = imageToRemove.placeholder
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        .replace(/ /g, "&nbsp;");
      const placeholderRegex = new RegExp(
        `<p[^>]*>\\[IMAGE:&nbsp;${escapedPlaceholder}\\].*?</p>`,
        "g",
      );
      return prev.replace(placeholderRegex, "");
    });

    toast.info("Image removed");
  };

  // Remove video
  const handleRemoveVideo = (videoToRemove) => {
    setPendingVideos((prev) =>
      prev.filter((vid) => vid.id !== videoToRemove.id),
    );

    setValue((prev) => {
      const escapedPlaceholder = videoToRemove.placeholder
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        .replace(/ /g, "&nbsp;");
      const placeholderRegex = new RegExp(
        `<p[^>]*>\\[VIDEO:&nbsp;${escapedPlaceholder}\\].*?</p>`,
        "g",
      );
      return prev.replace(placeholderRegex, "");
    });

    toast.info("Video removed");
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-0 md:py-2">
      <div className="bg-paper border border-soft mx-auto my-8 md:my-10 px-4 md:px-8 py-4 md:py-12">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex items-center justify-between pb-6 border-b border-soft ">
            <h1>Create a New Article</h1>
          </div>

          <CoverImageUpload
            setProgress={setProgress}
            coverImage={coverImage}
            setCoverImage={setCoverImage}
          />

          <FormField label="Article Title">
            <input
              type="text"
              name="title"
              required
              placeholder="Enter your article title..."
              className="w-full text-3xl sm:text-4xl font-semibold bg-transparent border-b-2 border-soft focus:border-accent outline-none pb-3 transition-colors placeholder:text-muted placeholder:italic"
            />
          </FormField>

          <FormField label="Choose a Category">
            <select
              name="category"
              required
              className="w-full sm:w-auto px-4 py-3 bg-transparent border border-soft focus:border-accent outline-none transition-colors meta cursor-pointer"
            >
              <option value="general">General</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="technology">Technology</option>
              <option value="startup">Startup</option>
              <option value="health">Health</option>
              <option value="gaming">Gaming</option>
            </select>
          </FormField>

          <FormField label="Short Description">
            <textarea
              name="desc"
              required
              placeholder="Write a brief description of your article..."
              className="w-full min-h-[100px] p-4 bg-transparent border border-soft focus:border-accent outline-none transition-colors resize-y placeholder:text-muted placeholder:italic"
            />
          </FormField>

          <FormField label="Article Content">
            <div className="quill-editor-wrapper border border-soft flex overflow-y-auto">
              {/* Upload buttons sidebar */}
              <div className="flex flex-col gap-2 p-2 border-r border-soft bg-paper sticky top-0">
                <Upload
                  type="image"
                  onFileSelected={handleImageSelected}
                  deferUpload={true}
                >
                  <div
                    className="p-2 hover:bg-[var(--bg-main)] transition-colors rounded"
                    title="Add image"
                  >
                    <CustomImage src="/add-image.svg" width={35} height={35} />
                  </div>
                </Upload>
                {/* <Upload 
                  type="video" 
                  onFileSelected={handleVideoSelected}
                  deferUpload={true}
                >
                  <div className="p-2 hover:bg-[var(--bg-main)] transition-colors rounded" title="Add video">
                    📽️
                  </div>
                </Upload> */}
              </div>

              {/* Editor */}
              <ReactQuill
                theme="snow"
                className="flex-1"
                value={value}
                onChange={setValue}
                placeholder="Begin writing your article..."
                readOnly={progress > 0 && progress < 100}
              />
            </div>
          </FormField>

          {/* Pending Media List */}
          {(pendingImages.length > 0 || pendingVideos.length > 0) &&
            progress === 0 && (
              <div className="bg-paper border border-soft p-4 space-y-4">
                <h3 className="font-semibold text-sm mb-3">
                  Media to Upload ({pendingImages.length + pendingVideos.length}
                  )
                </h3>
                {/* Pending Images */}
                {pendingImages.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted uppercase tracking-wide">
                      Images ({pendingImages.length})
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {pendingImages.map((img) => (
                        <div
                          key={img.id}
                          className="relative group border border-soft bg-[var(--bg-main)] overflow-hidden"
                        >
                          <img
                            src={img.previewUrl}
                            alt={img.fileName}
                            className="w-full h-32 object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(img)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            title="Remove image"
                          >
                            ✕
                          </button>
                          <div className="p-2">
                            <p
                              className="text-xs truncate"
                              title={img.fileName}
                            >
                              {img.fileName}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pending Videos */}
                {pendingVideos.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted uppercase tracking-wide">
                      Videos ({pendingVideos.length})
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {pendingVideos.map((vid) => (
                        <div
                          key={vid.id}
                          className="relative group border border-soft bg-[var(--bg-main)] overflow-hidden"
                        >
                          <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
                            <span className="text-4xl">📹</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveVideo(vid)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            title="Remove video"
                          >
                            ✕
                          </button>
                          <div className="p-2">
                            <p
                              className="text-xs truncate"
                              title={vid.fileName}
                            >
                              {vid.fileName}
                            </p>
                            <p className="text-xs text-muted">📹 Video</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          <div className="flex flex-col items-end ">
            <div className="flex flex-col items-center gap-2">
              {/* Upload Progress */}
              {progress > 0 && progress < 100 && (
                <div className="bg-paper space-y-1 w-full ">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">
                      Processing and uploading...
                    </span>
                    <span className="font-semibold">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className="w-full h-4 bg-[var(--bg-main)] border border-soft overflow-hidden">
                    <div
                      className="h-full bg-[var(--accent)] transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
              <button
                type="submit"
                disabled={
                  mutation.isPending || (progress > 0 && progress < 100)
                }
                className="btn-vintage px-8 py-3 text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {mutation.isPending ? "Publishing..." : "Publish Article"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Write;
