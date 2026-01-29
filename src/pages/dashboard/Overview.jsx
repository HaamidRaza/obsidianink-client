import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { FileText, Eye, MessageSquare, Star, TrendingUp } from "lucide-react";

const fetchDashboardStats = async (token) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/dashboard/stats`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return res.data;
};

const Overview = () => {
  const { getToken } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const token = await getToken();
      return fetchDashboardStats(token);
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-muted">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-red-500">Failed to load dashboard</div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Blogs",
      value: data.totalBlogs,
      icon: FileText,
      color: "text-blue-500",
    },
    {
      title: "Total Views",
      value: data.totalViews,
      icon: Eye,
      color: "text-green-500",
    },
    {
      title: "Comments",
      value: data.totalComments,
      icon: MessageSquare,
      color: "text-purple-500",
    },
    {
      title: "Featured",
      value: data.featuredBlogs,
      icon: Star,
      color: "text-yellow-500",
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl mb-2">Dashboard Overview</h1>
        <p className="text-muted">Welcome back! Here's your summary.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-paper border border-soft p-4 lg:p-6 rounded-lg flex lg:block"
            >
              <div className="flex items-center justify-between mb-0 lg:mb-4">
                <div className={`p-3 rounded-lg bg-(--bg-main) ${stat.color}`}>
                  <Icon size={24} />
                </div>
              </div>
              <div className="ml-4 lg:ml-0">
                <p className="text-sm text-muted">{stat.title}</p>
                <h3 className="text-2xl sm:text-3xl font-bold mb-1">
                  {stat.value.toLocaleString()}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Blogs Stats */}
      {data.recentBlogs !== undefined && (
        <div className="bg-paper border border-soft p-6 rounded-lg mb-6">
          <div className="flex items-center gap-3 mb-2 lg:mb-4">
            <TrendingUp className="text-[var(--accent)]" size={24} />
            <h2 className="text-xl">Recent Activity</h2>
          </div>
          <p className="text-muted">
            <span className="text-2xl font-bold text-ink">
              {data.recentBlogs}
            </span>
            &nbsp;&nbsp;blogs published in the last 7 days
          </p>
        </div>
      )}

      {/* Blogs by Category (Admin only) */}
      {data.blogsByCategory && (
        <div className="bg-paper border border-soft p-6 rounded-lg">
          <h2 className="text-xl mb-4">Blogs by Category</h2>
          <div className="space-y-3">
            {data.blogsByCategory.map((cat) => (
              <div key={cat._id} className="flex items-center justify-between">
                <span className="text-muted capitalize">{cat._id}</span>
                <span className="font-semibold">{cat.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Total Users (Admin only) */}
      {data.totalUsers !== undefined && (
        <div className="bg-paper border border-soft p-4 rounded-lg lg:flex lg:items-center lg:justify-between mt-6">
          <h2 className="text-xl">Platform Users</h2>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold">{data.totalUsers}</p>
            <p className="text-[1rem] text-muted">Total registered users</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;
