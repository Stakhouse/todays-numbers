import { Navigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute check:', { currentUser, isAdmin, isLoading });

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="body1" color="text.secondary">
          Verifying admin access...
        </Typography>
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    console.log('No current user, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to client home if authenticated but not an admin
  if (!isAdmin) {
    console.log('User is not admin, redirecting to client home');
    return <Navigate to="/all-islands" replace />;
  }

  // User is authenticated and is an admin, render the protected component
  console.log('User is authenticated admin, rendering protected content');
  return <>{children}</>;
};

export default ProtectedRoute;