import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import About from './components/pages/About';
import Contact from './components/pages/Contact';
import LotteryDetails from './components/pages/LotteryDetails';
import AdminLogin from './components/auth/AdminLogin';
import UnifiedLogin from './components/auth/UnifiedLogin';
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
              <Route path="/about" element={
                <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
                  <Header />
                  <About />
                </Box>
              } />
              <Route path="/contact" element={
                <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
                  <Header />
                  <Contact />
                </Box>
              } />
              <Route path="/lottery/:islandId" element={
                <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
                  <Header />
                  <LotteryDetails />
                </Box>
              } />
              
              {/* Login routes */}
              <Route path="/login" element={<UnifiedLogin />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              
              {/* Admin routes */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/ads" element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdManagement />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute>
                  <AdminLayout>
                    <UserManagement />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/islands" element={
                <ProtectedRoute>
                  <AdminLayout>
                    <IslandDataManagement />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/reports" element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Reports />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/analytics" element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Analytics />
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