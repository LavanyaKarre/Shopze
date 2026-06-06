import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Requires the user to be logged in
export const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

// Requires the user to be an admin
export const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return user.isAdmin ? children : <Navigate to="/" replace />;
};
