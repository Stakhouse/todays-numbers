import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import Dashboard from './components/Dashboard';
import AllIslandsDashboard from './components/AllIslandsDashboard';
import Header from './components/Header';
import About from './components/pages/About';
import Contact from './components/pages/Contact';
import LotteryDetails from './components/pages/LotteryDetails';
import IslandPage from './components/pages/IslandPage';
import ClientLogin from './components/auth/ClientLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminLayout from './components/admin/AdminLayout';
import AdManagement from './components/admin/pages/AdManagement';
import UserManagement from './components/admin/pages/UserManagement';
import IslandDataManagement from './components/admin/pages/IslandDataManagement';
import Reports from './components/admin/pages/Reports';
import Analytics from './components/admin/pages/Analytics';
import ApprovalDashboard from './components/admin/pages/ApprovalDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ClientProtectedRoute from './components/auth/ClientProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import { IslandProvider } from './context/IslandContext';
import { AuthProvider } from './context/AuthContext';
import { LotteryProvider } from './contexts/LotteryContext';
import TodaysNumbersPage from './components/pages/TodaysNumbersPage';
import JamaicaLotteryResults from './components/JamaicaLotteryResults';
import LotteryLandingPage from './components/LotteryLandingPage';
import SVGLotteryPage from './components/pages/SVGLotteryPage';
import TestSVGPage from './components/TestSVGPage';
import NewSVGLotteryPage from './components/pages/NewSVGLotteryPage';

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
    <ErrorBoundary title="Application Error">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <IslandProvider>
            <LotteryProvider>
              <Router>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={
                    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
                      <Header />
                      <AllIslandsDashboard />
                    </Box>
                  } />
                  
                  {/* Client protected routes - only accessible to authenticated clients */}
                  <Route path="/all-islands" element={
                    <ClientProtectedRoute>
                      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
                        <Header />
                        <AllIslandsDashboard />
                      </Box>
                    </ClientProtectedRoute>
                  } />
                  <Route path="/dashboard" element={
                    <ClientProtectedRoute>
                      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
                        <Header />
                        <Dashboard />
                      </Box>
                    </ClientProtectedRoute>
                  } />
                  <Route path="/island/:islandId" element={
                    <ClientProtectedRoute>
                      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
                        <Header />
                        <Dashboard />
                      </Box>
                    </ClientProtectedRoute>
                  } />
                  <Route path="/today" element={
                    <ClientProtectedRoute>
                      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
                        <Header />
                        <TodaysNumbersPage />
                      </Box>
                    </ClientProtectedRoute>
                  } />
                  <Route path="/lottery/:islandId" element={
                    <ClientProtectedRoute>
                      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
                        <Header />
                        <LotteryDetails />
                      </Box>
                    </ClientProtectedRoute>
                  } />
                  <Route path="/island/:islandId" element={
                    <ClientProtectedRoute>
                      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
                        <Header />
                        <IslandPage />
                      </Box>
                    </ClientProtectedRoute>
                  } />
                  <Route path="/jamaica" element={
                    <ClientProtectedRoute>
                      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
                        <Header />
                        <JamaicaLotteryResults />
                      </Box>
                    </ClientProtectedRoute>
                  } />
                  <Route path="/svg" element={
                    <ClientProtectedRoute>
                      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
                        <Header />
                        <NewSVGLotteryPage />
                      </Box>
                    </ClientProtectedRoute>
                  } />
                  <Route path="/test-svg" element={
                    <ClientProtectedRoute>
                      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
                        <Header />
                        <TestSVGPage />
                      </Box>
                    </ClientProtectedRoute>
                  } />
                  
                  {/* About and Contact pages - accessible to everyone */}
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
                  
                  {/* Login route - single interface for both admin and client */}
                  <Route path="/login" element={<ClientLogin />} />
                  
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
                  <Route path="/admin/approvals" element={
                    <ProtectedRoute>
                      <AdminLayout>
                        <ApprovalDashboard />
                      </AdminLayout>
                    </ProtectedRoute>
                  } />
                </Routes>
              </Router>
            </LotteryProvider>
          </IslandProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;