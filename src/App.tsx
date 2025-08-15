import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import AdminLogin from './components/auth/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminLayout from './components/admin/AdminLayout';
import AdManagement from './components/admin/pages/AdManagement';
import UserManagement from './components/admin/pages/UserManagement';
import IslandDataManagement from './components/admin/pages/IslandDataManagement';
import Reports from './components/admin/pages/Reports';
import Analytics from './components/admin/pages/Analytics';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { IslandProvider } from './context/IslandContext';
import { AuthProvider } from './context/AuthContext';

// Create custom theme based on design guidelines
const theme = createTheme({
  palette: {
    primary: {
      main: '#00BFA6', // Tropical teal
    },
    secondary: {
      main: '#FFBF00', // Lottery gold
    },
    error: {
      main: '#FF5722', // Orange for CTAs
    },
    background: {
      default: '#E0F7FA', // Light cyan background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212121', // Dark gray
      secondary: '#757575', // Medium gray
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <IslandProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={
                <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
                  <Header />
                  <Dashboard />
                </Box>
              } />
              <Route path="/island/:islandId" element={
                <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
                  <Header />
                  <Dashboard />
                </Box>
              } />
              
              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/*" element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Routes>
                      <Route index element={<AdminDashboard />} />
                      <Route path="ads" element={<AdManagement />} />
                      <Route path="users" element={<UserManagement />} />
                      <Route path="islands" element={<IslandDataManagement />} />
                      <Route path="reports" element={<Reports />} />
                      <Route path="analytics" element={<Analytics />} />
                    </Routes>
                  </AdminLayout>
                </ProtectedRoute>
              } />
            </Routes>
          </Router>
        </IslandProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;