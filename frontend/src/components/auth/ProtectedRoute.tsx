/**
 * Route guard for pages that require an authenticated user.
 *
 * Wraps protected routes in App.tsx via <Route element={<ProtectedRoute />}>
 * with child routes nested inside. Redirects to /login when there is no
 * authenticated user, preserving the originally requested location so
 * LoginPage can send the user back afterward.
 */

import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

function ProtectedRoute() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <p className="text-sm font-medium text-gray-500">Loading…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;