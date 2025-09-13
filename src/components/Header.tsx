import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Box,
  CircularProgress,
  Button,
  IconButton,
} from '@mui/material';
import { LocationOn, Login as LoginIcon, AccountCircle, ExitToApp } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIsland, ISLANDS } from '../context/IslandContext';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { currentIsland, setCurrentIsland, isLoading } = useIsland();
  const { currentUser, logout, isAdmin } = useAuth();
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

  return (
    <AppBar position="static" sx={{ backgroundColor: 'primary.main' }}>
      {/* Main Toolbar */}
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: 64 }}>
        {/* Left: Logo/Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: 700,
              color: 'white',
              fontSize: { xs: '1.2rem', sm: '1.5rem' },
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            Today's Numbers
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255,255,255,0.8)',
              display: { xs: 'none', sm: 'block' },
            }}
          >
            Caribbean Data Hub
          </Typography>
        </Box>

        {/* Right: Island Selector + Login */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Island Selector */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOn sx={{ color: 'white', fontSize: '1.2rem' }} />
            {isLoading ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : (
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select
                  value={currentIsland.id}
                  onChange={(e) => {
                    const island = ISLANDS.find(i => i.id === e.target.value);
                    if (island) setCurrentIsland(island);
                  }}
                  sx={{
                    color: 'white',
                    '.MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255,255,255,0.3)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255,255,255,0.5)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'white',
                    },
                    '.MuiSvgIcon-root': {
                      color: 'white',
                    },
                  }}
                >
                  {ISLANDS.map((island) => (
                    <MenuItem key={island.id} value={island.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{island.flag}</span>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: { xs: '0.8rem', sm: '0.875rem' },
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: { xs: '120px', sm: '200px' },
                          }}
                        >
                          {island.name}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>

          {/* Authentication Buttons */}
          {currentUser ? (
            // Logged in - Show user info and logout
            <>
              {/* Admin Dashboard Button (for admins) */}
              {isAdmin && (
                <Button
                  onClick={() => navigate('/admin')}
                  sx={{
                    color: 'secondary.main',
                    borderColor: 'secondary.main',
                    backgroundColor: 'rgba(255, 191, 0, 0.1)',
                    '&:hover': {
                      borderColor: 'secondary.main',
                      backgroundColor: 'rgba(255, 191, 0, 0.2)',
                    },
                    display: { xs: 'none', md: 'flex' },
                    fontWeight: 600,
                  }}
                  variant="outlined"
                  size="small"
                >
                  Admin Dashboard
                </Button>
              )}
              
              {/* User Account Button */}
              <Button
                startIcon={<AccountCircle />}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.5)',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                  display: { xs: 'none', sm: 'flex' },
                  textTransform: 'none',
                }}
                variant="outlined"
                size="small"
              >
                {currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}
              </Button>

              {/* Logout Button */}
              <Button
                onClick={handleLogout}
                startIcon={<ExitToApp />}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.5)',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                  display: { xs: 'none', sm: 'flex' },
                }}
                variant="outlined"
                size="small"
              >
                Logout
              </Button>

              {/* Mobile User Menu */}
              <IconButton
                sx={{
                  color: 'white',
                  display: { xs: 'flex', sm: 'none' },
                }}
                size="small"
              >
                <AccountCircle />
              </IconButton>
            </>
          ) : (
            // Not logged in - Show login button
            <>
              <Button
                onClick={() => navigate('/login')}
                startIcon={<LoginIcon />}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.5)',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                  display: { xs: 'none', sm: 'flex' },
                }}
                variant="outlined"
                size="small"
              >
                Login
              </Button>

              {/* Mobile Login Button */}
              <IconButton
                onClick={() => navigate('/login')}
                sx={{
                  color: 'white',
                  display: { xs: 'flex', sm: 'none' },
                }}
                size="small"
              >
                <LoginIcon />
              </IconButton>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;