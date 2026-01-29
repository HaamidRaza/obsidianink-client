import React from "react";
import { Search } from "./Search";
import { useSearchParams } from "react-router-dom";

const SideMenu = ({ onClose }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSort = searchParams.get("sort") || "newest";
  const currentCategory = searchParams.get("cat") || "";

  const handleFilterChange = (e) => {
    const newParams = Object.fromEntries(searchParams.entries());
    newParams.sort = e.target.value;
    setSearchParams(newParams);
    onClose?.();
  };

  const handleCategoryChange = (category) => {
    const newParams = Object.fromEntries(searchParams.entries());
    
    if (category === "all") {
      delete newParams.cat;
    } else {
      newParams.cat = category;
    }
    
    setSearchParams(newParams);
    // Close menu on mobile after selection
    onClose?.();
  };

  return (
    <div className="bg-paper border border-soft p-6 sticky top-8">
      {/* Search */}
      <div className="mb-6">
        <h3 className="text-xl mb-4 pb-3 border-b border-soft">Search</h3>
        <Search onSearch={onClose} />
      </div>

      {/* Filters */}
      <div className="mb-6 pb-6 border-b border-soft">
        <h3 className="text-xl mb-4">Sort By</h3>
        <div className="flex flex-col gap-3">
          <label
            htmlFor="newest"
            className="flex items-center gap-3 cursor-pointer group hover:pl-2 transition-all duration-200"
          >
            <input
              type="radio"
              name="sort"
              id="newest"
              value="newest"
              checked={currentSort === "newest"}
              onChange={handleFilterChange}
              className="w-4 h-4 accent-(--accent) cursor-pointer"
            />
            <span className="meta group-hover:text-ink">Newest First</span>
          </label>

          <label
            htmlFor="popular"
            className="flex items-center gap-3 cursor-pointer group hover:pl-2 transition-all duration-200"
          >
            <input
              type="radio"
              name="sort"
              id="popular"
              value="popular"
              checked={currentSort === "popular"}
              onChange={handleFilterChange}
              className="w-4 h-4 accent-[var(--accent)] cursor-pointer"
            />
            <span className="meta group-hover:text-ink">Most Popular</span>
          </label>

          <label
            htmlFor="trending"
            className="flex items-center gap-3 cursor-pointer group hover:pl-2 transition-all duration-200"
          >
            <input
              type="radio"
              name="sort"
              id="trending"
              value="trending"
              checked={currentSort === "trending"}
              onChange={handleFilterChange}
              className="w-4 h-4 accent-[var(--accent)] cursor-pointer"
            />
            <span className="meta group-hover:text-ink">Trending</span>
          </label>

          <label
            htmlFor="oldest"
            className="flex items-center gap-3 cursor-pointer group hover:pl-2 transition-all duration-200"
          >
            <input
              type="radio"
              name="sort"
              id="oldest"
              value="oldest"
              checked={currentSort === "oldest"}
              onChange={handleFilterChange}
              className="w-4 h-4 accent-[var(--accent)] cursor-pointer"
            />
            <span className="meta group-hover:text-ink">Oldest First</span>
          </label>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-xl mb-4">Categories</h3>
        <div className="flex flex-col gap-2">
          <span
            onClick={() => handleCategoryChange("all")}
            className={`meta hover:text-ink hover:pl-2 transition-all duration-200 py-1 cursor-pointer ${
              currentCategory === "" ? "text-ink font-semibold" : ""
            }`}
          >
            All
          </span>
          <span
            onClick={() => handleCategoryChange("lifestyle")}
            className={`meta hover:text-ink hover:pl-2 transition-all duration-200 py-1 cursor-pointer ${
              currentCategory === "lifestyle" ? "text-ink font-semibold" : ""
            }`}
          >
            Lifestyle
          </span>
          <span
            onClick={() => handleCategoryChange("technology")}
            className={`meta hover:text-ink hover:pl-2 transition-all duration-200 py-1 cursor-pointer ${
              currentCategory === "technology" ? "text-ink font-semibold" : ""
            }`}
          >
            Technology
          </span>
          <span
            onClick={() => handleCategoryChange("startup")}
            className={`meta hover:text-ink hover:pl-2 transition-all duration-200 py-1 cursor-pointer ${
              currentCategory === "startup" ? "text-ink font-semibold" : ""
            }`}
          >
            Startup
          </span>
          <span
            onClick={() => handleCategoryChange("health")}
            className={`meta hover:text-ink hover:pl-2 transition-all duration-200 py-1 cursor-pointer ${
              currentCategory === "health" ? "text-ink font-semibold" : ""
            }`}
          >
            Health
          </span>
          <span
            onClick={() => handleCategoryChange("gaming")}
            className={`meta hover:text-ink hover:pl-2 transition-all duration-200 py-1 cursor-pointer ${
              currentCategory === "gaming" ? "text-ink font-semibold" : ""
            }`}
          >
            Gaming
          </span>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;