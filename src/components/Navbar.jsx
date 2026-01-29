import { useState, useEffect } from "react";
import CustomImage from "./Image";
import { Link, useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import { Bookmark } from "lucide-react";

const Navbar = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const role = user?.id;

  // Check for saved theme preference or default to light mode
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDark((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return newMode;
    });
  };

  return (
    <div className="flex justify-between items-center px-4 py-6 sm:px-6 sm:py-8 md:px-8 lg:px-12 border-b border-soft max-w-full mx-auto">
      {/* LOGO */}
      <div className="flex items-center gap-4 text-2xl font-bold">
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

      {/* Mobile menu */}
      <div className="flex items-center gap-3 md:hidden">
        {/* Dark Mode Toggle - Mobile */}
        <button
          onClick={toggleDarkMode}
          className="p-2 hover:bg-(--bg-paper) transition-all rounded group relative"
          aria-label={
            isDark ? "Switch to parchment mode" : "Switch to candlelight mode"
          }
          title={isDark ? "Parchment Mode" : "Candlelight Mode"}
        >
          {isDark ? (
            // Parchment/Quill Icon for Light Mode
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 17C20.5 17 22 16 22 14.5C22 13 20.5 12 18 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18 18C18 16.3431 15.3137 15 12 15C8.68629 15 6 16.3431 6 18C6 19.6569 8.68629 21 12 21C15.3137 21 18 19.6569 18 18Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M9 15V8C9 7.44772 10.3431 7 12 7C13.6569 7 15 7.44772 15 8V15"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 2C12 2 9.5 5 9.5 6.5C9.5 7.88071 10.6193 9 12 9C13.3807 9 14.5 7.88071 14.5 6.5C14.5 5 12 2 12 2Z"
                fill="currentColor"
              />
              <path
                d="M12 1V0"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
              <path
                d="M7.5 3.5L6.5 2.5"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
              <path
                d="M16.5 3.5L17.5 2.5"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
              <path
                d="M5 7H4"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
              <path
                d="M20 7H19"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 17C20.5 17 22 16 22 14.5C22 13 20.5 12 18 13"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M18 18C18 16.3431 15.3137 15 12 15C8.68629 15 6 16.3431 6 18C6 19.6569 8.68629 21 12 21C15.3137 21 18 19.6569 18 18Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linejoin="round"
              />
              <path
                d="M9 15V8C9 7.44772 10.3431 7 12 7C13.6569 7 15 7.44772 15 8V15"
                stroke="currentColor"
                stroke-width="2"
                stroke-linejoin="round"
              />
              <ellipse
                cx="12"
                cy="8"
                rx="3"
                ry="1"
                stroke="currentColor"
                stroke-width="2"
              />
              <path
                d="M12 7V5"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
              <path
                d="M10 10H14"
                stroke="currentColor"
                stroke-width="1"
                opacity="0.5"
              />
              <path
                d="M10 12.5H14"
                stroke="currentColor"
                stroke-width="1"
                opacity="0.5"
              />
            </svg>
            // Candle Icon for Dark Mode
          )}
        </button>

        {/* MOBILE BTN */}
        <div>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
        <div
          className="cursor-pointer text-3xl px-2"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? "✕" : "☰"}
        </div>
      </div>

      {/* MOBILE LINK LIST */}
      {open && (
        <div className="w-full h-screen text-xl flex flex-col items-center justify-center gap-8 absolute top-24 left-0 bg-paper z-50 border-t border-soft">
          <Link
            to="/saved"
            reloadDocument
            className="flex items-center gap-2 hover:text-[var(--accent)]"
          >
            <span>Saved</span>
          </Link>
          <Link
            to="/blogs"
            onClick={() => setOpen(false)}
            reloadDocument
            className="hover:accent transition-colors"
          >
            Blog List
          </Link>
          <Link
            to="/dashboard"
            className="btn-vintage cursor-pointer transition-all text-[0.65rem] sm:text-[0.75rem] px-3 py-2 sm:px-6 sm:py-3"
          >
            Dashboard
          </Link>
          <SignedOut>
            <button
              onClick={() => navigate("/login")}
              className="btn-vintage cursor-pointer transition-all text-[0.65rem] sm:text-[0.75rem] px-3 py-2 sm:px-6 sm:py-3"
            >
              Get started
            </button>
          </SignedOut>
        </div>
      )}

      {/* Desktop menu */}
      <div className="hidden md:flex items-center gap-4 xl:gap-10">
        <Link
          to="/blogs"
          onClick={() => setOpen(false)}
          reloadDocument
          className="hover:accent transition-colors"
        >
          Blog List
        </Link>
        <Link
          to="/saved"
          className="flex items-center gap-2 hover:text-[var(--accent)]"
        >
          <span>Saved</span>
        </Link>

        {/* Dark Mode Toggle - Desktop */}
        <button
          onClick={toggleDarkMode}
          className={
            isDark
              ? "p-2 hover:bg-(--accent) cursor-pointer transition-all rounded group relative"
              : "p-2 hover:bg-(--bg-paper) cursor-pointer transition-all rounded group relative"
          }
          aria-label={
            isDark ? "Switch to parchment mode" : "Switch to candlelight mode"
          }
          title={isDark ? "Parchment Mode" : "Candlelight Mode"}
        >
          {isDark ? (
            // Parchment/Quill Icon for Light Mode
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 17C20.5 17 22 16 22 14.5C22 13 20.5 12 18 13"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M18 18C18 16.3431 15.3137 15 12 15C8.68629 15 6 16.3431 6 18C6 19.6569 8.68629 21 12 21C15.3137 21 18 19.6569 18 18Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linejoin="round"
              />
              <path
                d="M9 15V8C9 7.44772 10.3431 7 12 7C13.6569 7 15 7.44772 15 8V15"
                stroke="currentColor"
                stroke-width="2"
                stroke-linejoin="round"
              />
              <path
                d="M12 2C12 2 9.5 5 9.5 6.5C9.5 7.88071 10.6193 9 12 9C13.3807 9 14.5 7.88071 14.5 6.5C14.5 5 12 2 12 2Z"
                fill="currentColor"
              />
              <path
                d="M12 1V0"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
              <path
                d="M7.5 3.5L6.5 2.5"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
              <path
                d="M16.5 3.5L17.5 2.5"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
              <path
                d="M5 7H4"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
              <path
                d="M20 7H19"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          ) : (
            // Candle Icon for Dark Mode
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 17C20.5 17 22 16 22 14.5C22 13 20.5 12 18 13"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M18 18C18 16.3431 15.3137 15 12 15C8.68629 15 6 16.3431 6 18C6 19.6569 8.68629 21 12 21C15.3137 21 18 19.6569 18 18Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linejoin="round"
              />
              <path
                d="M9 15V8C9 7.44772 10.3431 7 12 7C13.6569 7 15 7.44772 15 8V15"
                stroke="currentColor"
                stroke-width="2"
                stroke-linejoin="round"
              />
              <ellipse
                cx="12"
                cy="8"
                rx="3"
                ry="1"
                stroke="currentColor"
                stroke-width="2"
              />
              <path
                d="M12 7V5"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
              <path
                d="M10 10H14"
                stroke="currentColor"
                stroke-width="1"
                opacity="0.5"
              />
              <path
                d="M10 12.5H14"
                stroke="currentColor"
                stroke-width="1"
                opacity="0.5"
              />
            </svg>
          )}
        </button>
        {role && (
          <button
            onClick={() => navigate("/dashboard")}
            className="btn-vintage cursor-pointer transition-all text-[0.65rem] sm:text-[0.75rem] px-3 py-2 sm:px-6 sm:py-3"
          >
            Dashboard
          </button>
        )}
        <SignedOut>
          <button
            onClick={() => navigate("/register")}
            className="btn-vintage cursor-pointer transition-all text-[0.65rem] sm:text-[0.75rem] px-3 py-2 sm:px-6 sm:py-3"
          >
            Get started
          </button>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
};

export default Navbar;
