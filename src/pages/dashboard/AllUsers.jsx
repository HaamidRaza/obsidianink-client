// pages/dashboard/AllUsers.jsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { FileText, MessageSquare, Calendar } from "lucide-react";
import { format } from "timeago.js";

const fetchAllUsers = async (token, page) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/dashboard/users?page=${page}&limit=10`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

const AllUsers = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const role = user?.publicMetadata?.role;
  const [page, setPage] = useState(1);

  // Redirect if not admin
  if (role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  const { data, isLoading } = useQuery({
    queryKey: ["allUsers", page],
    queryFn: async () => {
      const token = await getToken();
      return fetchAllUsers(token, page);
    },
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading users...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl mb-2">All Users</h1>
        <p className="text-muted">
          {data?.total || 0} registered user{data?.total !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.users?.map((userData) => (
          <div
            key={userData._id}
            className="bg-paper border border-soft p-6 rounded-lg hover:border-[var(--accent)] transition-colors"
          >
            {/* User Header */}
            <div className="flex items-center gap-4 mb-4">
              <img
                src={userData.img || "/default-image.jpg"}
                alt={userData.username}
                className="w-16 h-16 rounded-full border-2 border-soft object-cover"
              />
              <div>
                <h3 className="font-semibold text-lg">{userData.username}</h3>
                {userData.email && (
                  <p className="text-sm text-muted truncate max-w-[200px]">
                    {userData.email}
                  </p>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted">
                  <FileText size={16} />
                  Blogs
                </span>
                <span className="font-semibold">{userData.blogCount || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted">
                  <MessageSquare size={16} />
                  Comments
                </span>
                <span className="font-semibold">
                  {userData.commentCount || 0}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted">
                  <Calendar size={16} />
                  Joined
                </span>
                <span className="text-muted text-xs">
                  {format(userData.createdAt)}
                </span>
              </div>
            </div>

            {/* Clerk ID (for admin reference) */}
            <div className="pt-4 border-t border-soft">
              <p className="text-xs text-muted truncate">
                ID: {userData.clerkUserId}
              </p>
            </div>
          </div>
        ))}
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

export default AllUsers;