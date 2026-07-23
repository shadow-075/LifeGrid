import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageLoader from '../ui/PageLoader';

const WAKE_MESSAGE =
  "Waking up the server - our free hosting tier falls asleep when idle, this can take up to 30 seconds...";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, wakingServer } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoader message={wakingServer ? WAKE_MESSAGE : undefined} />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;