import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
} from '@mui/material';
import {
  Dashboard,
  Campaign,
  People,
  LocationOn,
  Assessment,
  Analytics,
  PlaylistAddCheck,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

interface AdminSidebarProps {
  onMobileClose?: () => void;
}

interface MenuItemType {
  title: string;
  icon: React.ElementType;
  path: string;
  badge?: string;
  badgeColor?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

const menuItems: MenuItemType[] = [
  {
    title: 'Dashboard',
    icon: Dashboard,
    path: '/admin',
  },
  {
    title: 'Ad Submissions',
    icon: Campaign,
    path: '/admin/ads',
    badge: 'New',
    badgeColor: 'secondary',
  },
  {
    title: 'Approval Dashboard',
    icon: PlaylistAddCheck,
    path: '/admin/approvals',
    badge: '12',
    badgeColor: 'warning',
  },
  {
    title: 'User Management',
    icon: People,
    path: '/admin/users',
  },
  {
    title: 'Island Data',
    icon: LocationOn,
    path: '/admin/islands',
  },
  {
    title: 'Reports',
    icon: Assessment,
    path: '/admin/reports',
  },
  {
    title: 'Analytics',
    icon: Analytics,
    path: '/admin/analytics',
  },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onMobileClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'white',
      }}
    >
      {/* Logo/Brand Section */}
      <Box
        sx={{
          px: 3,
          py: 3,
          backgroundColor: 'primary.main',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
          🏝️ Today's Numbers
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
          Admin Dashboard
        </Typography>
      </Box>

      <Divider />

      {/* Navigation Menu */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <List sx={{ pt: 2 }}>
          {menuItems.map((item) => (
            <ListItem key={item.path} disablePadding sx={{ px: 2, py: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    color: 'primary.dark',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.dark',
                    },
                    '&:hover': {
                      backgroundColor: 'primary.light',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    borderRadius: 2,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: location.pathname === item.path ? 'primary.dark' : 'text.secondary',
                    minWidth: 40,
                  }}
                >
                  <item.icon />
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    variant: 'body2',
                    fontWeight: location.pathname === item.path ? 600 : 500,
                  }}
                />
                {item.badge && (
                  <Chip
                    label={item.badge}
                    size="small"
                    color={item.badgeColor}
                    sx={{
                      height: 20,
                      fontSize: '0.75rem',
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider />

      {/* Bottom Section */}
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            backgroundColor: 'background.default',
            borderRadius: 2,
            p: 2,
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary" gutterBottom>
            🌴 Caribbean Admin Hub
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Manage all island data from one dashboard
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminSidebar;
