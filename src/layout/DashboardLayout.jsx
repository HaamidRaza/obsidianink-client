import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  LayoutDashboard,
  FileText,
  Users,
  Activity,
  BarChart3,
  Menu,
  X,
} from "lucide-react";
import CustomImage from "../components/Image";

const DashboardLayout = () => {
  const { user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const role = user?.publicMetadata?.role;

  const navItems = [
    {
      name: "Overview",
      path: "/dashboard",
      icon: LayoutDashboard,
      admin: false,
    },
    {
      name: "My Blogs",
      path: "/dashboard/my-blogs",
      icon: FileText,
      admin: false,
    },
    {
      name: "Analytics",
      path: "/dashboard/analytics",
      icon: BarChart3,
      admin: false,
    },
    {
      name: "Activity",
      path: "/dashboard/activity",
      icon: Activity,
      admin: false,
    },
    {
      name: "All Blogs",
      path: "/dashboard/all-blogs",
      icon: FileText,
      admin: true,
    },
    {
      name: "All Users",
      path: "/dashboard/users",
      icon: Users,
      admin: true,
    },
  ];

  const filteredNavItems = navItems.filter(
    (item) => !item.admin || role === "admin",
  );

  return (
    <div className="min-h-screen bg-(--bg-main)">
      {/* Mobile menu button */}
      <div className="lg:hidden flex items-center justify-between gap-4 px-4 py-4 text-2xl font-bold">
        <span
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <CustomImage
            src="logo1.svg"
            className="h-8 w-8 sm:h-10 sm:w-10 transition-opacity group-hover:opacity-70"
            alt="logo"
          />
          <h3 className="text-xl sm:text-2xl md:text-3xl font-[450] tracking-wider transition-colors group-hover:accent">
            Obsidian Ink
          </h3>
        </span>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-paper border border-soft rounded-lg"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-paper border-r border-soft transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          {/* Logo/Header */}
          <div className="flex items-center gap-4 text-2xl font-bold mb-5">
            <span
              className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
              onClick={() => navigate("/")}
            >
              <CustomImage
                src="logo1.svg"
                className="h-8 w-8 sm:h-10 sm:w-10 transition-opacity group-hover:opacity-70"
                alt="logo"
              />
              <h3 className="text-xl sm:text-2xl md:text-3xl font-light tracking-wider transition-colors group-hover:accent">
                Obsidian Ink
              </h3>
            </span>
          </div>

          {/* User Info */}
          <div className="mb-6 p-3 bg-[var(--bg-main)] border border-soft rounded-lg">
            <div className="flex items-center gap-3">
              <img
                src={user?.imageUrl || "/default-image.jpg"}
                alt={user?.fullName}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-sm font-medium">{user?.fullName}</p>
                <p className="text-xs text-muted">
                  {role === "admin" ? "Admin" : "User"}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors no-underline ${
                    isActive
                      ? "bg-[var(--accent)] text-white"
                      : "text-muted hover:bg-[var(--bg-main)] hover:text-ink"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Back to Home */}
          <div className="mt-8 pt-8 border-t border-soft">
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2 text-muted hover:text-ink transition-colors no-underline"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
