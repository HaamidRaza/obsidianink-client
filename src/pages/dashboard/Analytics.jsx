// pages/dashboard/Analytics.jsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { Eye, FileText } from "lucide-react";

const fetchAnalytics = async (token, days) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/dashboard/analytics?days=${days}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

const Analytics = () => {
  const { getToken } = useAuth();
  const [days, setDays] = useState(30);

  const { data, isLoading } = useQuery({
    queryKey: ["analytics", days],
    queryFn: async () => {
      const token = await getToken();
      return fetchAnalytics(token, days);
    },
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-3xl sm:text-4xl mb-2">Analytics</h1>
        <p className="text-muted">Track your blog performance</p>
      </div>

      {/* Time Range Selector */}
      <div className="mb-6">
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="px-4 py-2 border border-soft rounded-lg bg-paper"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* Top Performing Blogs */}
      <div className="bg-paper border border-soft p-4 rounded-lg mb-6">
        <h2 className="text-xl mb-4">Top Performing Blogs</h2>
        <div className="space-y-4">
          {data?.topBlogs?.map((blog, index) => (
            <div
              key={blog._id}
              className="flex items-center justify-between p-4 bg-(--bg-main) rounded-lg"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-muted">
                  #{index + 1}
                </span>
                <div>
                  <h3 className="font-semibold line-clamp-2">{blog.title}</h3>
                  <p className="text-sm text-muted capitalize">{blog.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Eye size={16} className="text-muted" />
                <span className="font-semibold">{blog.views}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Blogs Over Time */}
        <div className="bg-paper border border-soft p-6 rounded-lg">
          <h2 className="text-xl mb-4 flex items-center gap-2">
            <FileText size={20} />
            Blogs Published
          </h2>
          <div className="space-y-2">
            {data?.blogsOverTime?.map((item) => (
              <div key={item._id} className="flex items-center justify-between">
                <span className="text-sm text-muted">{item._id}</span>
                <span className="font-semibold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Views Over Time */}
        <div className="bg-paper border border-soft p-6 rounded-lg">
          <h2 className="text-xl mb-4 flex items-center gap-2">
            <Eye size={20} />
            Views Over Time
          </h2>
          <div className="space-y-2">
            {data?.viewsOverTime?.map((item) => (
              <div key={item._id} className="flex items-center justify-between">
                <span className="text-sm text-muted">{item._id}</span>
                <span className="font-semibold">{item.views}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;