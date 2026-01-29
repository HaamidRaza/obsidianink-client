import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Eye, Edit, Trash2, Star } from "lucide-react";
import { toast } from "react-toastify";
import { format } from "timeago.js";

const fetchMyBlogs = async (token, page, sort) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/dashboard/my-blogs?page=${page}&limit=10&sort=${sort}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return res.data;
};

const MyBlogs = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("newest");

  const { data, isLoading } = useQuery({
    queryKey: ["myBlogs", page, sort],
    queryFn: async () => {
      const token = await getToken();
      return fetchMyBlogs(token, page, sort);
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
      queryClient.invalidateQueries(["myBlogs"]);
      toast.success("Blog deleted successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data || "Failed to delete blog");
    },
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading your blogs...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl mb-2">My Blogs</h1>
          <p className="text-muted">
            {data?.total || 0} blog{data?.total !== 1 ? "s" : ""} published
          </p>
        </div>
        <Link
          to="/write"
          className="px-4 py-2 bg-(--accent) text-white rounded-lg hover:opacity-90 transition-opacity no-underline"
        >
          Write New Blog
        </Link>
      </div>

      {/* Sort Filter */}
      <div className="mb-6">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2 border border-soft rounded-lg bg-paper cursor-pointer"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="popular">Most Popular</option>
          <option value="title">By Title</option>
        </select>
      </div>

      {/* Blogs List */}
      <div className="space-y-4">
        {data?.blogs?.length === 0 ? (
          <div className="text-center py-12 bg-paper border border-soft rounded-lg">
            <p className="text-muted mb-4">
              You haven't published any blogs yet
            </p>
            <Link to="/write" className="text-[var(--accent)] hover:underline">
              Write your first blog →
            </Link>
          </div>
        ) : (
          data?.blogs?.map((blog) => (
            <div
              key={blog._id}
              className="bg-paper border border-soft p-6 rounded-lg hover:border-[var(--accent)] transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* Image */}
                {blog.img && (
                  <img
                    src={blog.img}
                    alt={blog.title}
                    className="w-24 h-24 object-cover rounded-lg border border-soft"
                  />
                )}

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <Link
                      to={`/${blog.slug}`}
                      className="text-xl font-semibold hover:text-(--accent) transition-colors no-underline line-clamp-2"
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

                  <div className="flex flex-wrap items-center gap-1  lg:gap-4 text-sm text-muted mb-4">
                    <span className="capitalize">{blog.category}</span>
                    <span>•</span>
                    <span>{format(blog.createdAt)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye size={16} />
                      {blog.views || 0} views
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/${blog.slug}`}
                      className="text-sm text-(--text-main) hover:underline no-underline"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => deleteMutation.mutate(blog._id)}
                      disabled={deleteMutation.isPending}
                      className="text-sm text-(--accent) hover:underline disabled:opacity-50"
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
      {data?.hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-6 py-2 border border-soft rounded-lg hover:border-[var(--accent)] transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default MyBlogs;
