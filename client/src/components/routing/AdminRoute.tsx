import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

/**
 * AdminRoute: A route guard that only allows Admin, Pastor, or Editor roles.
 * Members and unauthenticated users are redirected.
 */
const AdminRoute = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/portal/login" replace />;
  }

  // Normalize role comparison to be case-insensitive for robustness
  const userRole = user?.role?.toLowerCase();
  const hasAdminAccess = userRole === 'admin' || userRole === 'pastor' || userRole === 'editor';

  if (!user || !hasAdminAccess) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-8xl font-heading font-extrabold text-secondary mb-4">403</h1>
          <h2 className="text-3xl font-heading font-bold text-white mb-2">Access Denied</h2>
          <p className="text-slate-400 mb-8">
            Your role ({user?.role || 'Unknown'}) does not have permission to access the Admin Dashboard.
          </p>
          <a href="/" className="text-secondary hover:text-secondary-light font-semibold transition-colors">
            ← Return to Home
          </a>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default AdminRoute;
