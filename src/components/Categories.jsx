import { Link } from "react-router-dom";
import { useState } from "react";
import { Search } from "./Search";

const Categories = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { name: "All", slug: "all", path: "/blogs" },
    { name: "Lifestyle", slug: "lifestyle", path: "/blogs?cat=lifestyle" },
    { name: "Technology", slug: "technology", path: "/blogs?cat=technology" },
    { name: "Startup", slug: "startup", path: "/blogs?cat=startup" },
    { name: "Health", slug: "health", path: "/blogs?cat=health" },
    { name: "Gaming", slug: "gaming", path: "/blogs?cat=gaming" },
  ];

  return (
    <div className="hidden md:flex bg-(--bg-paper) border border-soft p-4 sm:p-6 shadow-sm items-center justify-between gap-4 max-w-7xl mb-4 mt-4">
      {/* Category Links */}
      <div className="flex items-center justify-start flex-wrap gap-3">
        {categories.map((category) => (
          <Link
            key={category.slug}
            to={category.path}
            onClick={() => setActiveCategory(category.slug)}
            className={`meta text-[0.7rem] sm:text-[0.75rem] px-4 py-2 border transition-all ${
              activeCategory === category.slug
                ? "bg-(--accent) text-(--bg-paper) border-(--accent)"
                : "bg-transparent text-(--text-main) border-soft hover:border-(--accent) hover:text-(--accent)"
            }`}
          >
            {category.name}
          </Link>
        ))}
      </div>

      {/* Divider */}
      <span className="text-2xl text-(--border-soft) font-light">|</span>

      {/* Search */}
      <Search />
    </div>
  );
};

export default Categories;
