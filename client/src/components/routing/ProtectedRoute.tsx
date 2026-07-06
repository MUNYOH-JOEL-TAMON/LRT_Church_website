import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

// ProtectedRoute: A wrapper component that checks auth state.
// If the user is NOT authenticated, they are redirected to login.
// If they ARE authenticated, the requested page renders via <Outlet />.
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Outlet /> : <Navigate to="/portal/login" replace />;
};

export default ProtectedRoute;
