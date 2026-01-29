import React, { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export const Search = ({ onSearch }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");

  const handleSearch = () => {
    const query = searchValue.trim();
    
    if (location.pathname === "/blogs") {
      const newParams = Object.fromEntries(searchParams);
      if (query) {
        newParams.search = query;
      } else {
        delete newParams.search;
      }
      setSearchParams(newParams);
    } else {
      if (query) {
        navigate(`/blogs?search=${query}`);
      } else {
        navigate(`/blogs`);
      }
    }
    
    // Close mobile menu after search
    onSearch?.();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 px-2 border border-soft bg-transparent focus-within:border-accent transition-colors duration-200">
        <div className="py-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 text-muted"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search articles..."
          className="bg-transparent text-ink placeholder:text-muted placeholder:italic focus:outline-none py-2 pl-1 flex-1 font-serif text-sm"
          onKeyDown={handleKeyPress}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="py-2 text-[var(--accent)] hover:opacity-80 transition-opacity"
          aria-label="Search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};