// pages/SavedBlogs.jsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Eye, Calendar, Bookmark } from "lucide-react";
import { format } from "timeago.js";
import CustomImage from "../components/Image";

const fetchSavedBlogs = async (token) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/saved`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const SavedBlogs = () => {
  const { getToken } = useAuth();

  const { data: savedBlogs, isLoading, error } = useQuery({
    queryKey: ["savedBlogs"],
    queryFn: async () => {
      const token = await getToken();
      return fetchSavedBlogs(token);
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-muted">Loading saved blogs...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-red-500">Failed to load saved blogs</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-soft">
        <div className="flex items-center gap-3">
          <Bookmark className="text-(--accent)" size={32} />
          <h1 className="text-3xl sm:text-4xl">Saved Blogs</h1>
        </div>
        <p className="text-muted">
          {savedBlogs?.length || 0} saved article{savedBlogs?.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Empty State */}
      {!savedBlogs || savedBlogs.length === 0 ? (
        <div className="text-center py-16 bg-paper border border-soft rounded-lg">
          <Bookmark size={64} className="mx-auto mb-4 text-muted opacity-50" />
          <h2 className="text-2xl mb-2">No saved blogs yet</h2>
          <p className="text-muted mb-6">
            Start saving blogs to read them later
          </p>
          <Link
            to="/blogs"
            className="inline-block px-6 py-3 bg-[var(--accent)] text-white rounded-lg hover:opacity-90 transition-opacity no-underline"
          >
            Browse Blogs
          </Link>
        </div>
      ) : (
        /* Saved Blogs Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedBlogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-paper border border-soft rounded-lg overflow-hidden hover:border-[var(--accent)] transition-colors group"
            >
              {/* Image */}
              {blog.img && (
                <Link to={`/${blog.slug}`} className="block">
                  <CustomImage
                    src={blog.img}
                    alt={blog.title}
                    className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity"
                    width={400}
                  />
                </Link>
              )}

              {/* Content */}
              <div className="p-6">
                {/* Category & Date */}
                <div className="flex items-center gap-3 text-xs text-muted mb-3">
                  <span className="px-2 py-1 border border-soft rounded uppercase">
                    {blog.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {format(blog.createdAt)}
                  </span>
                </div>

                {/* Title */}
                <Link
                  to={`/${blog.slug}`}
                  className="block mb-3 no-underline"
                >
                  <h3 className="text-lg sm:text-xl font-semibold line-clamp-2 group-hover:text-[var(--accent)] transition-colors">
                    {blog.title}
                  </h3>
                </Link>

                {/* Description */}
                {blog.desc && (
                  <p className="text-sm text-muted line-clamp-2 mb-4">
                    {blog.desc}
                  </p>
                )}

                {/* Meta */}
                <div className="flex items-center justify-between text-sm text-muted pt-4 border-t border-soft">
                  <span className="flex items-center gap-1">
                    <Eye size={16} />
                    {blog.views || 0} views
                  </span>
                  <Link
                    to={`/${blog.slug}`}
                    className="text-[var(--accent)] hover:underline no-underline"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedBlogs;