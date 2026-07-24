import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageLoader from '../ui/PageLoader';

const WAKE_MESSAGE =
  "Waking up the server, this can take up to 30 seconds...";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, wakingServer } = useAuth();

  if (loading) return <PageLoader message={wakingServer ? WAKE_MESSAGE : undefined} />;
  if (isAuthenticated) return <Navigate to="/" replace />;

  return children;
};

export default PublicRoute;