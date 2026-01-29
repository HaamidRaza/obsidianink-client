import React, { useState } from "react";
import BlogList from "../components/BlogList.jsx";
import SideMenu from "../components/SideMenu";

const BlogListPage = () => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-0 py-12">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-soft flex items-center justify-between">
        <h1 className="text-[1.5rem] lg:text-[2.6rem]">Articles & Blogs</h1>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="btn-vintage cursor-pointer md:hidden "
        >
          <span className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
              />
            </svg>
            Filter
          </span>
        </button>
      </div>

      {/* Mobile Filter Menu Overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Menu Content */}
          <div className="relative bg-paper border-2 border-soft shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto animate-slideDown">
            <div className="p-4">
              <div className="flex items-center justify-between pb-4">
                <h2 className="text-2xl">Filters & Search</h2>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-(--bg-main) transition-colors rounded"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <SideMenu onClose={handleClose} />
            </div>
          </div>
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] lg:grid-cols-[1fr_380px] gap-8 lg:gap-12">
        <div className="min-w-0">
          <BlogList />
        </div>
        <aside className="hidden md:block md:min-w-60 lg:min-w-80">
          <SideMenu />
        </aside>
      </div>
    </div>
  );
};

export default BlogListPage;
