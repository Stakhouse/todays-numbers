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
  Container,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import { 
  Google as GoogleIcon, 
  AdminPanelSettings, 
  PersonOutline,
  Login as LoginIcon 
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

// Check if we're in development mode
const isDevelopmentMode = import.meta.env.VITE_FIREBASE_API_KEY === 'example_api_key_here';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`login-tabpanel-${index}`}
      aria-labelledby={`login-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const UnifiedLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0); // 0 = Client, 1 = Admin
  const [isSignUp, setIsSignUp] = useState(false); // Track if showing signup form
  
  const { signInWithEmail, signInWithGoogle, signUpWithEmail, currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  if (currentUser) {
    if (isAdmin) {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError('');
    setEmail('');
    setPassword('');
    setDisplayName('');
    setIsSignUp(false);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp) {
      // Handle signup
      if (!email || !password || !displayName) {
        setError('Please fill in all fields');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }
    } else {
      // Handle login
      if (!email || !password) {
        setError('Please fill in all fields');
        return;
      }
    }

    setIsLoading(true);
    setError('');

    try {
      if (isSignUp) {
        // Handle signup (only for client)
        await signUpWithEmail(email, password, displayName);
        navigate('/');
      } else {
        // Handle login
        if (tabValue === 1) { // Admin login
          await signInWithEmail(email, password, true);
          navigate('/admin');
        } else { // Client login
          await signInWithEmail(email, password, false);
          navigate('/');
        }
      }
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
      if (tabValue === 1) { // Admin login
        await signInWithGoogle(true);
        navigate('/admin');
      } else { // Client login
        await signInWithGoogle(false);
        navigate('/');
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4
        }}
      >
        <Card
          sx={{
            width: '100%',
            maxWidth: 450,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <LoginIcon 
                sx={{ 
                  fontSize: 48, 
                  color: 'primary.main',
                  mb: 2 
                }} 
              />
              <Typography variant="h4" component="h1" gutterBottom>
                Welcome Back
              </Typography>
              <Typography variant="body2" color="text.secondary">
                🏝️ Today's Numbers - Sign in to continue
              </Typography>
            </Box>

            {/* Login Type Tabs */}
            <Paper sx={{ mb: 3 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{
                  '& .MuiTab-root': {
                    minHeight: 48,
                  },
                }}
              >
                <Tab 
                  icon={<PersonOutline />} 
                  iconPosition="start"
                  label="Client Login" 
                  id="login-tab-0"
                  aria-controls="login-tabpanel-0"
                />
                <Tab 
                  icon={<AdminPanelSettings />} 
                  iconPosition="start"
                  label="Admin Login" 
                  id="login-tab-1"
                  aria-controls="login-tabpanel-1"
                />
              </Tabs>
            </Paper>

            {/* Development Mode Notice */}
            {isDevelopmentMode && tabValue === 1 && (
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  🚧 Development Mode - Admin Access
                </Typography>
                <Typography variant="body2">
                  Use these test credentials:
                  <br />• Email: <strong>admin@todaysnumbers.com</strong>
                  <br />• Password: <strong>admin</strong>
                </Typography>
              </Alert>
            )}

            {/* Development Mode Notice for Client */}
            {isDevelopmentMode && tabValue === 0 && (
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  🚧 Development Mode - Client Access
                </Typography>
                <Typography variant="body2">
                  Use any email and password (6+ chars) to create an account or sign in as a client user.
                </Typography>
              </Alert>
            )}

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Tab Panels */}
            <TabPanel value={tabValue} index={0}>
              {/* Client Login/Signup Form */}
              <Box component="form" onSubmit={handleEmailLogin}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  sx={{ mb: 2 }}
                  autoComplete="email"
                />
                
                {isSignUp && (
                  <TextField
                    fullWidth
                    label="Full Name"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    disabled={isLoading}
                    sx={{ mb: 2 }}
                    autoComplete="name"
                  />
                )}
                
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  sx={{ mb: 3 }}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  helperText={isSignUp ? "Must be at least 6 characters" : ""}
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
                    isSignUp ? 'Create Account' : 'Sign In'
                  )}
                </Button>
                
                <Button
                  fullWidth
                  variant="text"
                  size="small"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                    setEmail('');
                    setPassword('');
                    setDisplayName('');
                  }}
                  disabled={isLoading}
                  sx={{ mb: 2 }}
                >
                  {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
                </Button>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              {/* Admin Login Form */}
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
                    'Sign In as Admin'
                  )}
                </Button>
              </Box>
            </TabPanel>

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
              {tabValue === 1 
                ? 'Admin access restricted to authorized personnel only' 
                : 'New to Today\'s Numbers? Contact support for account setup'
              }
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default UnifiedLogin;
