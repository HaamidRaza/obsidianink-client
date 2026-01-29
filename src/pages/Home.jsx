import { Link } from "react-router-dom";
import Categories from "../components/Categories";
import FeaturedPosts from "../components/FeaturedPosts";
import BlogList from "../components/BlogList";

const Home = () => {
  return (
    <div className="mt-4 flex flex-col gap-4 lg:gap-0">
      {/* HeroSection */}
      <div className="flex items-center justify-between">
        {/* title */}
        <div>
          <h1>A Chronicle of Ideas, Insights & Inspiration</h1>
          <p>
            Step into a curated collection where thoughtful writing meets
            timeless design. Explore articles penned by voices both familiar and
            new, save the pieces that speak to you, and contribute your own
            chapters to this ever-growing anthology of human experience and
            creativity.
          </p>
        </div>
        {/* animated button */}
        <Link to="write" className="hidden md:block relative">
          <svg
            viewBox="0 0 200 200"
            width="220"
            height="220"
            className="text-lg tracking-widest animate-spin-slow   animatedButton"
          >
            <path
              id="circlePath"
              fill="none"
              d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
            />
            <text
              fill="var(--text-muted)"
              fontSize="12"
              fontFamily="Libre Baskerville, serif"
              letterSpacing="0.2em"
            >
              <textPath href="#circlePath" startOffset="0%">
                Write your story •
              </textPath>
              <textPath href="#circlePath" startOffset="50%">
                Share your idea •
              </textPath>
            </text>
          </svg>
          <button className="absolute cursor-pointer rounded-full top-0 left-0 right-0 bottom-0 m-auto w-28 h-28 border border-soft hover:border-(--accent) bg-paper transition-all duration-300 flex flex-col items-center justify-center gap-1 group">
            <svg
              viewBox="0 0 24 24"
              width="50"
              height="50"
              fill="var(--text-main)"
              xmlns="http://www.w3.org/2000/svg"
              className="group-hover:fill-(--accent) transition-colors"
            >
              <path d="M31.009 0.878c-5.937 0.218-10.752 1.502-14.433 3.482l-1.838 3.073-0.31-1.752c-0.657 0.462-1.266 0.949-1.827 1.46l-0.917 2.813-0.315-1.572c-2.724 3.049-3.942 6.736-3.635 10.504h-4.602v3.063h2.519l-2.703 2.373-1.389 5.303 0.907 0.99h11.058l0.907-0.99-1.389-5.303-2.558-2.373h2.206v-3.063h-4.055c1.596-0.827 3.146-1.971 4.68-3.293l-1.862 0.097 0.017-0.019 3.343-1.423c2.923-2.722 5.828-5.925 8.936-8.625l-1.529-0.324 3.535-1.317c1.673-1.276 3.413-2.358 5.254-3.105z" />
            </svg>
          </button>
        </Link>
      </div>
      {/* Categories */}
      <Categories />
      {/* Featured BLogs */}
      <FeaturedPosts />
      {/* Blog lists */}
      <div>
        <h1 className="text-4xl">Recent Blogs</h1>
        <BlogList />
      </div>
    </div>
  );
};

export default Home;
