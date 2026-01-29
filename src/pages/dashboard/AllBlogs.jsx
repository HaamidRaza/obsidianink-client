// pages/dashboard/AllBlogs.jsx
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Link, Navigate } from "react-router-dom";
import { Eye, Trash2, Star } from "lucide-react";
import { toast } from "react-toastify";
import { format } from "timeago.js";

const fetchAllBlogs = async (token, page, sort, category, featured) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: "10",
    sort,
  });

  if (category) params.append("category", category);
  if (featured !== "") params.append("featured", featured);

  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/dashboard/all-blogs?${params}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return res.data;
};

const AllBlogs = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const role = user?.publicMetadata?.role;

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("newest");
  const [category, setCategory] = useState("");
  const [featured, setFeatured] = useState("");

  // Redirect if not admin
  if (role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  const { data, isLoading } = useQuery({
    queryKey: ["allBlogs", page, sort, category, featured],
    queryFn: async () => {
      const token = await getToken();
      return fetchAllBlogs(token, page, sort, category, featured);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (blogId) => {
      const token = await getToken();
      return axios.delete(`${import.meta.env.VITE_API_URL}/blogs/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["allBlogs"]);
      toast.success("Blog deleted successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data || "Failed to delete blog");
    },
  });

  const featureMutation = useMutation({
    mutationFn: async (blogId) => {
      const token = await getToken();
      return axios.patch(
        `${import.meta.env.VITE_API_URL}/blogs/feature`,
        { blogId },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["allBlogs"]);
      toast.success("Blog featured status updated!");
    },
    onError: (error) => {
      toast.error(error.response?.data || "Failed to update blog");
    },
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading blogs...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl mb-2">All Blogs</h1>
        <p className="text-muted">
          {data?.total || 0} &nbsp;blog{data?.total !== 1 ? "s" : ""} total
        </p>
      </div>

      {/* Filters */}
      <div className="hidden lg:flex flex-wrap gap-4 mb-6">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2 border border-soft rounded-lg bg-paper"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="popular">Most Popular</option>
          <option value="title">By Title</option>
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 border border-soft rounded-lg bg-paper"
        >
          <option value="">All Categories</option>
          <option value="technology">Technology</option>
          <option value="lifestyle">Lifestyle</option>
          <option value="startup">Startup</option>
          <option value="health">Health</option>
          <option value="gaming">Gaming</option>
        </select>

        <select
          value={featured}
          onChange={(e) => setFeatured(e.target.value)}
          className="px-4 py-2 border border-soft rounded-lg bg-paper"
        >
          <option value="">All Blogs</option>
          <option value="true">Featured Only</option>
          <option value="false">Non-Featured</option>
        </select>
      </div>
      {/* Mobile Filter */}
      <div className="lg:hidden flex flex-wrap gap-4 mb-6">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2 border border-soft rounded-lg bg-paper"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest </option>
          <option value="popular">Popular</option>
          <option value="title">By Title</option>
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 border border-soft rounded-lg bg-paper"
        >
          <option value="">Categories</option>
          <option value="technology">Technology</option>
          <option value="lifestyle">Lifestyle</option>
          <option value="startup">Startup</option>
          <option value="health">Health</option>
          <option value="gaming">Gaming</option>
        </select>

        <select
          value={featured}
          onChange={(e) => setFeatured(e.target.value)}
          className="px-4 py-2 border border-soft rounded-lg bg-paper"
        >
          <option value="">Blogs</option>
          <option value="true">Featured Only</option>
          <option value="false">Non-Featured</option>
        </select>
      </div>

      {/* Blogs List */}
      <div className="space-y-4">
        {data?.blogs?.length === 0 ? (
          <div className="text-center py-12 bg-paper border border-soft rounded-lg">
            <p className="text-muted">No blogs found</p>
          </div>
        ) : (
          data?.blogs?.map((blog) => (
            <div
              key={blog._id}
              className="bg-paper border border-soft p-6 rounded-lg hover:border-(--accent) transition-colors"
            >
              <div className="flex flex-col  md:items-start md:flex-row gap-4">
                {/* Image */}
                {blog.img && (
                  <img
                    src={blog.img}
                    alt={blog.title}
                    className="w-full md:w-28 md:h-28 lg:w-28 h-30 lg:h-28 object-cover rounded-lg border border-soft"
                  />
                )}

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <Link
                      to={`/${blog.slug}`}
                      className="text-xl font-semibold hover:text-(--accent) line-clamp-2 transition-colors no-underline"
                    >
                      {blog.title}
                    </Link>
                    {blog.isFeatured && (
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
                            fill={blog.isFeatured ? "currentColor" : "none"}
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>{" "}
                        </g>
                      </svg>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted mb-4">
                    <span>by {blog.user?.username || "Unknown"}</span>
                    <div className="flex items-center gap-1">
                      <span className="capitalize">{blog.category}</span>
                      <span>•</span>
                      <span>{format(blog.createdAt)}</span>
                    </div>
                    <span className="flex items-center gap-1">
                      <Eye size={16} />
                      {blog.views || 0} views
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/${blog.slug}`}
                      className="text-sm text-(--text-muted) hover:underline no-underline"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => featureMutation.mutate(blog._id)}
                      disabled={featureMutation.isPending}
                      className="text-sm text-blue-500 hover:underline disabled:opacity-50"
                    >
                      {blog.isFeatured ? "Featured" : "Feature"}
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(blog._id)}
                      disabled={deleteMutation.isPending}
                      className="text-sm text-rose-700 hover:underline disabled:opacity-50"
                    >
                      {deleteMutation.isPending ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 border border-soft rounded-lg hover:border-[var(--accent)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="text-muted">Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!data?.hasMore}
          className="px-4 py-2 border border-soft rounded-lg hover:border-[var(--accent)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllBlogs;
