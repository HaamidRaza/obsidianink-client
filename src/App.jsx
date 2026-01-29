import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Write from "./pages/Write";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BlogListPage from "./pages/BlogListPage";
import Layouts from "./layout/layouts";
import DashboardLayout from "./layout/DashboardLayout";
import Overview from "./pages/dashboard/Overview";
import MyBlogs from "./pages/dashboard/UserBlogs";
import Analytics from "./pages/dashboard/Analytics";
import Activity from "./pages/dashboard/Activity";
import AllBlogs from "./pages/dashboard/AllBlogs";
import AllUsers from "./pages/dashboard/AllUsers";
import ProtectedRoute from "./routes/ProtectedRoute";
import SavedBlogs from "./pages/SavedBlogs";

const App = () => {
  return (
    <Routes>
      <Route path="/login/*" element={<Login />} />
      <Route path="/register/*" element={<Register />} />

      {/* Main Site Routes */}
      <Route element={<Layouts />}>
        <Route path="/" element={<Home />} />
        <Route path="/blogs" element={<BlogListPage />} />
        <Route path="/saved" element={<SavedBlogs />} />
        <Route path="/:slug" element={<Blog />} />
        <Route path="/write" element={<Write />} />
      </Route>

      {/* Dashboard Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="my-blogs" element={<MyBlogs />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="activity" element={<Activity />} />
          <Route path="all-blogs" element={<AllBlogs />} />
          <Route path="users" element={<AllUsers />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
