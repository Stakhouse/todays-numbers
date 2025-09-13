import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Divider,
  CircularProgress,
  Container
} from '@mui/material';
import { Google as GoogleIcon, AdminPanelSettings, Security } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

// Check if we're in development mode
const isDevelopmentMode = import.meta.env.VITE_FIREBASE_API_KEY === 'example_api_key_here';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signInWithEmail, signInWithGoogle, currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated as admin
  if (currentUser && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await signInWithEmail(email, password);
      navigate('/admin');
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      await signInWithGoogle();
      navigate('/admin');
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        backgroundColor: '#00BFA6', // Tropical teal background to distinguish from main site
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            width: '100%',
            maxWidth: 400,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box sx={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: 'primary.main',
                mb: 2
              }}>
                <AdminPanelSettings 
                  sx={{ 
                    fontSize: 32, 
                    color: 'white',
                  }} 
                />
              </Box>
              <Typography variant="h4" component="h1" gutterBottom>
                Admin Portal
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                🔒 Secure Administrator Access
              </Typography>
              <Box sx={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                px: 2,
                py: 1,
                backgroundColor: 'rgba(0, 191, 166, 0.1)',
                borderRadius: 1,
                mb: 1
              }}>
                <Security sx={{ fontSize: 16, color: 'primary.main', mr: 1 }} />
                <Typography variant="caption" color="primary.main" fontWeight={600}>
                  AUTHORIZED PERSONNEL ONLY
                </Typography>
              </Box>
            </Box>

            {/* Development Mode Notice */}
            {isDevelopmentMode && (
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  🚧 Development Mode Active
                </Typography>
                <Typography variant="body2">
                  Use these test credentials:
                  <br />• Email: <strong>admin@todaysnumbers.com</strong>
                  <br />• Password: <strong>admin</strong>
                  <br />Or click "Continue with Google" for instant access.
                </Typography>
              </Alert>
            )}

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Email/Password Form */}
            <Box component="form" onSubmit={handleEmailLogin}>
              <TextField
                fullWidth
                label="Admin Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                sx={{ mb: 2 }}
                autoComplete="email"
              />
              
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                sx={{ mb: 3 }}
                autoComplete="current-password"
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{ mb: 2, py: 1.5 }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Sign In to Admin Portal'
                )}
              </Button>
            </Box>

            {/* Divider */}
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            {/* Google Sign In */}
            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleLogin}
              disabled={isLoading}
              sx={{ py: 1.5 }}
            >
              Continue with Google
            </Button>

            {/* Footer Note */}
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ 
                display: 'block', 
                textAlign: 'center', 
                mt: 3,
                fontSize: '0.75rem'
              }}
            >
              Access restricted to authorized administrators only
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default AdminLogin;