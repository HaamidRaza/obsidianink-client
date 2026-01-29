// pages/dashboard/Activity.jsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { FileText, MessageSquare, Clock } from "lucide-react";
import { format } from "timeago.js";

const fetchActivity = async (token) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/dashboard/activity?limit=20`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

const Activity = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const role = user?.publicMetadata?.role;

  const { data, isLoading, error } = useQuery({
    queryKey: ["activity"],
    queryFn: async () => {
      const token = await getToken();
      return fetchActivity(token);
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted">Loading activity...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-500">Failed to load activity</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-3xl sm:text-4xl mb-2">Recent Activity</h1>
        <p className="text-muted">
          {role === "admin" ? "All platform activity" : "Your recent activity"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Blogs */}
        <div className="bg-paper border border-soft p-4 rounded-lg">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="text-[var(--accent)]" size={24} />
            <h2 className="text-xl">Recent Blogs</h2>
          </div>

          <div className="space-y-4">
            {data?.recentBlogs?.length === 0 ? (
              <p className="text-muted text-center py-8">No recent blogs</p>
            ) : (
              data?.recentBlogs?.map((blog) => (
                <div
                  key={blog._id}
                  className="p-4 bg-[var(--bg-main)] rounded-lg border border-soft hover:border-[var(--accent)] transition-colors"
                >
                  <Link
                    to={`/${blog.slug}`}
                    className="font-semibold hover:text-[var(--accent)] transition-colors no-underline block mb-2 line-clamp-2"
                  >
                    {blog.title}
                  </Link>
                  <div className="flex items-center gap-3 text-sm text-muted">
                    {role === "admin" && blog.user && (
                      <>
                        <span>by {blog.user.username}</span>
                        <span>•</span>
                      </>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {format(blog.createdAt)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Comments */}
        <div className="bg-paper border border-soft p-4 rounded-lg">
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="text-(--accent)" size={24} />
            <h2 className="text-xl">Recent Comments</h2>
          </div>

          <div className="space-y-4">
            {data?.recentComments?.length === 0 ? (
              <p className="text-muted text-center py-8">No recent comments</p>
            ) : (
              data?.recentComments?.map((comment) => (
                <div
                  key={comment._id}
                  className="p-4 bg-[var(--bg-main)] rounded-lg border border-soft hover:border-[var(--accent)] transition-colors"
                >
                  <p className="text-sm mb-2 line-clamp-2">{comment.desc}</p>
                  <div className="flex flex-col gap-1 text-xs text-muted">
                    {role === "admin" && comment.user && (
                      <span>by {comment.user.username}</span>
                    )}
                    {comment.blog && (
                      <Link
                        to={`/${comment.blog.slug}`}
                        className="text-(--accent) hover:underline no-underline line-clamp-1"
                      >
                        on "{comment.blog.title}"
                      </Link>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {format(comment.createdAt)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activity;