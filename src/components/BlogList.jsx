import { BlogListItem } from "./BlogListItem";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchParams } from "react-router-dom";

const fetchBlogs = async (pageParam, searchParams) => {
  const searchParamsObj = Object.fromEntries([...searchParams]);
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/blogs`, {
    params: { page: pageParam, limit: 10, ...searchParamsObj },
  });
  return res.data;
};

const BlogList = () => {
  const [searchParams] = useSearchParams();
  
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    status,
  } = useInfiniteQuery({
    queryKey: ["blogs", searchParams.toString()],
    queryFn: ({ pageParam = 1 }) => fetchBlogs(pageParam, searchParams),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length + 1 : undefined,
  });

  const allBlogs = data?.pages?.flatMap((page) => page.blogs) || [];

  if (status === "pending") {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="text-lg">Loading blogs...</span>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="text-red-500">Error: {error.message}</span>
      </div>
    );
  }

  if (allBlogs.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="text-lg text-gray-500">No blogs found</span>
      </div>
    );
  }

  return (
    <InfiniteScroll
      dataLength={allBlogs.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={
        <div className="text-center py-4">
          <span>Loading more blogs...</span>
        </div>
      }
      endMessage={
        <p className="text-center py-8 ">
          <b>You've reached the end!</b>
        </p>
      }
    >
      {allBlogs.map((blog) => (
        <BlogListItem key={blog._id} blog={blog} />
      ))}
    </InfiniteScroll>
  );
};

export default BlogList;