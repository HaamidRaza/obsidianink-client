import { Link } from "react-router-dom";
import CustomImage from "./Image";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "timeago.js";

const fetchBlogs = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/blogs?featured=true&limit=4&sort=trending`,
  );
  if (!res.data) {
    throw new Error("Blog not found");
  }
  
  return res.data;
};

const FeaturedPosts = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["featuredBlogs"],
    queryFn: () => fetchBlogs(),
  });

  if (isPending) {
    return (
      <div className="mt-12 md:mt-16 lg:mt-20 mb-12 md:mb-16 lg:mb-20 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 xl:px-12">
        <div className="text-center mb-8 md:mb-10 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl mb-2">
            Featured Blogs
          </h2>
        </div>
        <div className="text-center text-muted">Loading featured blogs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-12 sm:mt-16 md:mt-20 mb-12 sm:mb-16 md:mb-20 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="text-center text-red-500">
          Something went wrong! {error.message}
        </div>
      </div>
    );
  }

  const blogs = data.blogs;
  
  if (!blogs || blogs.length === 0) {
    return null;
  }

  // Get the first blog for the main featured post
  const mainBlog = blogs[0];
  // Get the remaining blogs for the secondary grid
  const secondaryBlogs = blogs.slice(1, 4);

  return (
    <div className="mt-8 md:mt-6 lg:mt-2 mb-12 md:mb-16 lg:mb-20 max-w-7xl px-4">
      {/* Section Header */}
      <div className="text-center mb-8 sm:mb-10 md:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl mb-2">
          Featured Blogs
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Main Featured Post */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4 sm:gap-6 group">
          {/* Image */}
          <div className="overflow-hidden border border-soft bg-paper rounded-2xl">
            <Link to={`/${mainBlog.slug}`}>
              <CustomImage
                src={mainBlog.img || "sheeps.jpg"}
                className="w-full aspect-[4/3] object-cover transition-opacity duration-500 group-hover:opacity-75 rounded-2xl"
                width="895"
              />
            </Link>
          </div>

          {/* Details */}
          <div className="flex items-center justify-between gap-3 sm:gap-4 text-sm sm:text-base">
            <span className="text-3xl sm:text-4xl font-light text-[var(--accent)]">
              01.
            </span>
            <span className="flex items-baseline sm:flex-col md:flex-row md:items-center gap-1 sm:gap-2">
              <Link
                to={`/blogs?cat=${mainBlog.category}`}
                className="meta text-[0.65rem] sm:text-[0.7rem] px-2 py-1 border border-soft hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all no-underline uppercase"
              >
                {mainBlog.category}
              </Link>
              <span className="text-muted text-xs">
                {format(mainBlog.createdAt)}
              </span>
            </span>
          </div>

          {/* Title */}
          <Link
            to={`/${mainBlog.slug}`}
            className="text-xl sm:text-2xl md:text-3xl leading-tight hover:text-[var(--accent)] transition-colors no-underline"
          >
            <h2>{mainBlog.title}</h2>
            <p className="text-sm md:text-[20px] text-muted line-clamp-2 mt-2">
              {mainBlog.desc}
            </p>
          </Link>
        </div>

        {/* Secondary Posts Grid */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6 sm:gap-8">
          {secondaryBlogs.map((blog, index) => (
            <div
              key={blog._id}
              className={`flex gap-4 sm:gap-6 group ${
                index < secondaryBlogs.length - 1
                  ? "pb-6 sm:pb-8 border-b border-soft"
                  : ""
              }`}
            >
              <div className="w-1/3 shrink-0 aspect-square overflow-hidden border border-soft bg-paper">
                <Link to={`/${blog.slug}`}>
                  <CustomImage
                    src={blog.img || "default-image.jpg"}
                    className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-75"
                    width={298}
                  />
                </Link>
              </div>

              <div className="w-2/3 flex flex-col gap-2 sm:gap-3">
                <div className="flex items-center justify-between gap-2 sm:gap-3 text-xs sm:text-sm">
                  <span className="text-2xl sm:text-3xl font-light text-[var(--accent)]">
                    0{index + 2}.
                  </span>
                  <span className="flex items-baseline sm:flex-col md:flex-row md:items-center gap-1 sm:gap-2">
                    <Link
                      to={`/blogs?cat=${blog.category}`}
                      className="inline-flex items-center px-2.5 py-0.5 border border-soft hover:border-[var(--accent)] hover:text-[var(--accent)] sm:text-[0.65rem] font-medium hover:opacity-80 transition-opacity no-underline uppercase"
                    >
                      {blog.category}
                    </Link>
                    <span className="text-muted text-[0.65rem] sm:text-xs">
                      {format(blog.createdAt)}
                    </span>
                  </span>
                </div>
                <Link to={`/${blog.slug}`}>
                  <h4 className="text-base sm:text-lg md:text-xl leading-snug hover:text-[var(--accent)] transition-colors no-underline">
                    {blog.title}
                  </h4>
                  <p className="text-sm md:text-md text-muted line-clamp-2 mt-1">
                    {blog.desc}
                  </p>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedPosts;