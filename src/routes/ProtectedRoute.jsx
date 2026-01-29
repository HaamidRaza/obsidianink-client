// routes/ProtectedRoute.jsx
import { useUser } from "@clerk/clerk-react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { isSignedIn, isLoaded } = useUser();

  // Show loading while checking auth
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted">Loading...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;