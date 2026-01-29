import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../../assets/assets";
import { motion } from "framer-motion";

const SideBar = () => {
  return (
    <>
      {/* Mobile: Horizontal Navigation */}
      <nav className="md:hidden border-b border-soft bg-paper overflow-x-auto">
        <div className="flex gap-1 p-2">
          <NavLink
            end={true}
            to={"/admin"}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 px-4 py-3 min-w-20 transition-colors relative ${
                isActive
                  ? "text-ink bg-(--bg-main)"
                  : "text-muted hover:text-ink"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <img
                  src={assets.home_icon}
                  alt="home"
                  className="w-5 h-5 opacity-70"
                />
                <p className="text-[0.65rem] meta">Dashboard</p>
                {isActive && (
                  <motion.div
                    layoutId="mobile-underline"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--accent)]"
                  />
                )}
              </>
            )}
          </NavLink>

          <NavLink
            end={true}
            to={"/admin/addBlog"}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 px-4 py-3 min-w-[80px] transition-colors relative ${
                isActive
                  ? "text-ink bg-(--bg-main)"
                  : "text-muted hover:text-ink"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <img
                  src={assets.add_icon}
                  alt="add"
                  className="w-5 h-5 opacity-70"
                />
                <p className="text-[0.65rem] meta">Add</p>
                {isActive && (
                  <motion.div
                    layoutId="mobile-underline"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--accent)]"
                  />
                )}
              </>
            )}
          </NavLink>

          <NavLink
            end={true}
            to={"/admin/listBlog"}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 px-4 py-3 min-w-[80px] transition-colors relative ${
                isActive
                  ? "text-ink bg-(--bg-main)"
                  : "text-muted hover:text-ink"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <img
                  src={assets.list_icon}
                  alt="list"
                  className="w-5 h-5 opacity-70"
                />
                <p className="text-[0.65rem] meta">List</p>
                {isActive && (
                  <motion.div
                    layoutId="mobile-underline"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--accent)]"
                  />
                )}
              </>
            )}
          </NavLink>

          <NavLink
            end={true}
            to={"/admin/comments"}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 px-4 py-3 min-w-[80px] transition-colors relative ${
                isActive
                  ? "text-ink bg-(--bg-main)"
                  : "text-muted hover:text-ink"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <img
                  src={assets.comments_icon}
                  alt="comments"
                  className="w-5 h-5 opacity-70"
                />
                <p className="text-[0.65rem] meta">Comments</p>
                {isActive && (
                  <motion.div
                    layoutId="mobile-underline"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--accent)]"
                  />
                )}
              </>
            )}
          </NavLink>
        </div>
      </nav>

      {/* Desktop: Vertical Sidebar */}
      <aside className="hidden md:block fixed left-0 top-22 bottom-0 w-64 border-r border-soft bg-paper overflow-y-auto">
        <nav className="flex flex-col gap-2 p-6">
          <NavLink
            end={true}
            to={"/admin"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 transition-colors relative ${
                isActive
                  ? "text-ink bg-(--bg-main)"
                  : "text-muted hover:text-ink"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="desktop-sidebar"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute left-0 top-0 bottom-0 w-0.5 bg-(--accent)"
                  />
                )}
                <img
                  src={assets.home_icon}
                  alt="home"
                  className="min-w-4 w-6 opacity-70"
                />
                <p className="text-[16px]">Dashboard</p>
              </>
            )}
          </NavLink>

          <NavLink
            end={true}
            to={"/admin/addBlog"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 transition-colors relative ${
                isActive
                  ? "text-ink bg-(--bg-main)"
                  : "text-muted hover:text-ink"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="desktop-sidebar"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--accent)]"
                  />
                )}
                <img
                  src={assets.add_icon}
                  alt="add"
                  className="min-w-4 w-6 opacity-70"
                />
                <p className="text-[16px]">Add Blogs</p>
              </>
            )}
          </NavLink>

          <NavLink
            end={true}
            to={"/admin/listBlog"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 transition-colors relative ${
                isActive
                  ? "text-ink bg-[var(--bg-main)]"
                  : "text-muted hover:text-ink"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="desktop-sidebar"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--accent)]"
                  />
                )}
                <img
                  src={assets.list_icon}
                  alt="list"
                  className="min-w-4 w-6 opacity-70"
                />
                <p className="text-[16px]">List of Blogs</p>
              </>
            )}
          </NavLink>

          <NavLink
            end={true}
            to={"/admin/comments"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 transition-colors relative ${
                isActive
                  ? "text-ink bg-(--bg-main)"
                  : "text-muted hover:text-ink"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="desktop-sidebar"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute left-0 top-0 bottom-0 w-0.5 bg-(--accent)"
                  />
                )}
                <img
                  src={assets.comments_icon}
                  alt="comments"
                  className="min-w-4 w-6 opacity-70"
                />
                <p className="text-[16px]">Comments</p>
              </>
            )}
          </NavLink>
        </nav>
      </aside>
    </>
  );
};

export default SideBar;