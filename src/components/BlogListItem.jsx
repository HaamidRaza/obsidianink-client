import CustomImage from "./Image";
import { Link } from "react-router-dom";
import { format } from "timeago.js";

export const BlogListItem = ({ blog }) => {
  return (
    <div className="flex flex-col xl:flex-row gap-6 py-8 border-b border-soft last:border-b-0 group">
      {/* Image */}
      <div className="md:hidden xl:block xl:w-1/3">
        <div className="overflow-hidden border border-soft bg-paper">
          <Link to={`/${blog.slug}`}>
            <CustomImage
              src={blog.img || "sheeps.jpg"}
              className="w-full aspect-video object-cover transition-opacity duration-500 group-hover:opacity-75"
              width={733}
            />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 xl:w-2/3">
        {/* Category & Date */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to={`/blogs?category=${blog.category}`}
            className="meta text-[0.65rem] sm:text-[0.7rem] px-2 py-1 border border-soft hover:border-(--accent) hover:text-(--accent) transition-all no-underline"
          >
            {blog.category}
          </Link>
          <span className="text-muted text-xs">{format(blog.createdAt)}</span>
        </div>

        {/* Title */}
        <Link
          to={`/${blog.slug}`}
          className="text-xl sm:text-2xl md:text-3xl leading-tight hover:text-(--accent) transition-colors no-underline line-clamp-2"
        >
          {blog.title}
        </Link>

        {/* Author */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted">
          <span>By</span>
          <Link
            to={`/blogs?author=${blog.user?.username}`}
            className="font-medium text-ink hover:text-(--accent) transition-colors no-underline"
          >
            {blog.user?.username || "Unknown"}
          </Link>
        </div>

        {/* Excerpt */}
        <p className="text-sm leading-relaxed text-muted line-clamp-2">
          {blog.desc}
        </p>

        {/* Arrow Link */}
        <Link
          to={`/${blog.slug}`}
          className="text-[var(--accent)] hover:underline text-sm inline-flex items-center gap-2 group/link w-fit"
        >
          <span>Continue reading</span>
          <span className="transition-transform group-hover/link:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </div>
  );
};
