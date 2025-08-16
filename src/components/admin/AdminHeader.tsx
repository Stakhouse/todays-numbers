import {
  Box,
  Typography,
  IconButton,
  Button,
  Avatar,
  Breadcrumbs,
  Link,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ExitToApp,
  NavigateNext,
  Home,
  Info,
  ContactMail,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface AdminHeaderProps {
  onMenuClick: () => void;
  showMenuButton: boolean;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onMenuClick, showMenuButton }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Generate breadcrumbs based on current path
  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [];

    // Always start with Admin
    breadcrumbs.push({
      label: 'Admin',
      path: '/admin',
      active: location.pathname === '/admin',
    });

    // Add additional breadcrumbs based on path
    if (pathSegments.length > 1) {
      const page = pathSegments[1];
      const pageLabels: Record<string, string> = {
        ads: 'Ad Submissions',
        users: 'User Management',
        islands: 'Island Data',
        reports: 'Reports',
        analytics: 'Analytics',
      };

      if (pageLabels[page]) {
        breadcrumbs.push({
          label: pageLabels[page],
          path: `/admin/${page}`,
          active: true,
        });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
      }}
    >
      {/* Left Side - Menu Button + Logo + Navigation */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        {showMenuButton && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 1 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Today's Numbers Logo - Clickable */}
        <Typography
          variant="h6"
          component="h1"
          sx={{
            fontWeight: 700,
            color: 'white',
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8,
            },
            display: { xs: 'none', md: 'block' },
          }}
          onClick={() => navigate('/')}
        >
          Today's Numbers
        </Typography>

        {/* Main Site Navigation */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            startIcon={<Home sx={{ fontSize: 18 }} />}
            onClick={() => navigate('/')}
            sx={{
              color: 'white',
              textTransform: 'none',
              fontSize: '0.875rem',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
              display: { xs: 'none', lg: 'flex' },
            }}
          >
            Home
          </Button>
          <Button
            startIcon={<Info sx={{ fontSize: 18 }} />}
            onClick={() => navigate('/about')}
            sx={{
              color: 'white',
              textTransform: 'none',
              fontSize: '0.875rem',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
              display: { xs: 'none', lg: 'flex' },
            }}
          >
            About
          </Button>
          <Button
            startIcon={<ContactMail sx={{ fontSize: 18 }} />}
            onClick={() => navigate('/contact')}
            sx={{
              color: 'white',
              textTransform: 'none',
              fontSize: '0.875rem',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
              display: { xs: 'none', lg: 'flex' },
            }}
          >
            Contact
          </Button>
        </Box>

        {/* Admin Breadcrumbs */}
        <Box sx={{ ml: 2 }}>
          <Breadcrumbs
            separator={<NavigateNext fontSize="small" />}
            sx={{
              color: 'white',
              '& .MuiTypography-root': {
                color: 'white',
                fontSize: '0.875rem',
              },
              '& .MuiLink-root': {
                color: 'rgba(255, 255, 255, 0.8)',
                textDecoration: 'none',
                '&:hover': {
                  color: 'white',
                  textDecoration: 'underline',
                },
              },
            }}
          >
            {breadcrumbs.map((crumb) => (
              crumb.active ? (
                <Typography key={crumb.path} color="inherit" sx={{ fontWeight: 600 }}>
                  {crumb.label}
                </Typography>
              ) : (
                <Link
                  key={crumb.path}
                  onClick={() => navigate(crumb.path)}
                  sx={{ cursor: 'pointer' }}
                >
                  {crumb.label}
                </Link>
              )
            ))}
          </Breadcrumbs>
        </Box>
      </Box>

      {/* Right Side - User Info + Logout */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Admin Status Chip */}
          <Chip
            label="Admin"
            size="small"
            sx={{
              backgroundColor: 'secondary.main',
              color: 'secondary.contrastText',
              fontWeight: 600,
              display: { xs: 'none', sm: 'flex' },
            }}
          />

          {/* User Avatar & Info */}
          <Avatar
            sx={{
              width: 32,
              height: 32,
              backgroundColor: 'secondary.main',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            {currentUser?.email?.charAt(0).toUpperCase()}
          </Avatar>

          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Typography
              variant="body2"
              sx={{
                color: 'white',
                fontWeight: 500,
                lineHeight: 1.2,
              }}
            >
              {currentUser?.email}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: 1,
              }}
            >
              Super Admin
            </Typography>
          </Box>
        </Box>

        {/* Logout Button */}
        <Button
          variant="outlined"
          size="small"
          startIcon={<ExitToApp />}
          onClick={handleLogout}
          sx={{
            color: 'white',
            borderColor: 'rgba(255, 255, 255, 0.5)',
            '&:hover': {
              borderColor: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
            display: { xs: 'none', sm: 'flex' },
          }}
        >
          Logout
        </Button>

        {/* Mobile Logout Button */}
        <IconButton
          color="inherit"
          onClick={handleLogout}
          sx={{
            display: { xs: 'flex', sm: 'none' },
          }}
        >
          <ExitToApp />
        </IconButton>
      </Box>
    </Box>
  );
};

export default AdminHeader;
