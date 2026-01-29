import { useUser, useAuth } from "@clerk/clerk-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BlogMenuActions = ({ blog }) => {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    isPending,
    error,
    data: savedBlogs,
  } = useQuery({
    queryKey: ["savedBlogs", user?.id],
    queryFn: async () => {
      const token = await getToken();
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/saved`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    },
    enabled: !!user && isLoaded, // Only fetch when user is loaded and exists
    retry: 1,
    staleTime: 0, // Don't use stale data when switching accounts
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return axios.delete(`${import.meta.env.VITE_API_URL}/blogs/${blog._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      toast.success("Blog deleted successfully!");
      navigate("/");
    },
    onError: (err) => {
      console.error("Delete error:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data ||
        "Failed to delete blog";
      toast.error(errorMsg);
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return axios.patch(
        `${import.meta.env.VITE_API_URL}/users/save`,
        {
          blogId: blog._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["savedBlogs", user?.id] });
      toast.success(response.data);
    },
    onError: (err) => {
      console.error("Save error:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data ||
        "Failed to save blog";
      toast.error(errorMsg);
    },
  });
  const featureMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return axios.patch(
        `${import.meta.env.VITE_API_URL}/blogs/feature`,
        {
          blogId: blog._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog", blog.slug] });
      toast.success("Featured Blog!");
    },
    onError: (err) => {
      console.error("Feature error:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data ||
        "Failed to feature blog";
      toast.error(errorMsg);
    },
  });

  const handleDelete = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this article? This action cannot be undone.",
      )
    ) {
      deleteMutation.mutate();
    }
  };
  const handlefeature = () => {
    {
      featureMutation.mutate();
    }
  };

  const handleSave = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (saveMutation.isPending) {
      return;
    }

    saveMutation.mutate();
  };

  const isAdmin = user?.publicMetadata?.role === "admin" || false;

  const isSaved =
    savedBlogs?.some((p) => p?._id.toString() === blog._id.toString()) || false;

  const isFeatured = blog.isFeatured === true;

  const isAuthor =
    (user &&
      blog?.user &&
      (blog.user.username === user.fullName || blog.user._id === user.id)) ||
    isAdmin;

  if (!isLoaded) {
    return (
      <div className="flex flex-col">
        <h3 className="text-xl mb-4 pb-3 border-b border-soft">Actions</h3>
        <div className="text-sm text-muted italic">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col">
        <h3 className="text-xl mb-4 pb-3 border-b border-soft">Actions</h3>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/login")}
            className="btn-vintage text-left flex items-center gap-3 group transition-all duration-200 cursor-pointer"
          >
            {/* Save icon */}
            <span className="text-sm">Sign in to save this article</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <h3 className="text-xl mb-4 pb-3 border-b border-soft">Actions</h3>
      <div className="flex flex-col gap-3">
        {/* Save Button */}
        {isPending ? (
          <div className="text-sm text-muted italic">
            Loading save status...
          </div>
        ) : error ? (
          <div className="text-sm text-red-500 italic">
            Could not load save status
            <div className="text-xs mt-1">
              {error.message || "Unknown error"}
            </div>
          </div>
        ) : (
          <button
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className="btn-vintage text-left flex items-center gap-3 group transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6 shrink-0 group-hover:accent transition-colors"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M12.89 5.87988H5.10999C3.39999 5.87988 2 7.27987 2 8.98987V20.3499C2 21.7999 3.04 22.4199 4.31 21.7099L8.23999 19.5199C8.65999 19.2899 9.34 19.2899 9.75 19.5199L13.68 21.7099C14.95 22.4199 15.99 21.7999 15.99 20.3499V8.98987C16 7.27987 14.6 5.87988 12.89 5.87988Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>{" "}
                <path
                  d="M16 8.98987V20.3499C16 21.7999 14.96 22.4099 13.69 21.7099L9.76001 19.5199C9.34001 19.2899 8.65999 19.2899 8.23999 19.5199L4.31 21.7099C3.04 22.4099 2 21.7999 2 20.3499V8.98987C2 7.27987 3.39999 5.87988 5.10999 5.87988H12.89C14.6 5.87988 16 7.27987 16 8.98987Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  ></path>{" "}
                <path
                  opacity="0.4"
                  d="M22 5.10999V16.47C22 17.92 20.96 18.53 19.69 17.83L16 15.77V8.98999C16 7.27999 14.6 5.88 12.89 5.88H8V5.10999C8 3.39999 9.39999 2 11.11 2H18.89C20.6 2 22 3.39999 22 5.10999Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>{" "}
              </g>
            </svg>
            <span className="text-xs md:text-sm">
              {saveMutation.isPending
                ? isSaved
                  ? "Removing..."
                  : "Saving..."
                : isSaved
                  ? "Saved"
                  : "Save"}
            </span>
          </button>
        )}
        {isAdmin && (
          <button
            onClick={handlefeature}
            className="btn-vintage text-left flex items-center gap-3 group transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 md:w-6 md:h-6 shrink-0 group-hover:accent transition-colors"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  stroke="currentColor"
                  fill={
                    featureMutation.isPending
                      ? blog.isFeatured
                        ? "none"
                        : "currentColor"
                      : blog.isFeatured
                        ? "currentColor"
                        : "none"
                  }
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>{" "}
              </g>
            </svg>
            <span className="text-xs md:text-sm">
              {featureMutation.isPending
                ? isFeatured
                  ? "Removing..."
                  : "Featuring..."
                : isFeatured
                  ? "Featured"
                  : "Feature"}
            </span>
          </button>
        )}
        {/* Delete Button - Only show to author */}
        {isAuthor && (
          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="btn-vintage text-left flex items-center gap-3 group transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 md:w-6 md:h-6 shrink-0 group-hover:accent transition-colors"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M14 10V17M10 10V17"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>{" "}
              </g>
            </svg>
            <span className="text-xs md:text-sm">
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default BlogMenuActions;
