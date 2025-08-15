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
} from '@mui/material';
import { LocationOn } from '@mui/icons-material';
import { useIsland, ISLANDS } from '../context/IslandContext';

const Header: React.FC = () => {
  const { currentIsland, setCurrentIsland, isLoading } = useIsland();

  return (
    <AppBar position="static" sx={{ backgroundColor: 'primary.main' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: 700,
              color: 'white',
              fontSize: { xs: '1.2rem', sm: '1.5rem' },
            }}
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
      </Toolbar>
    </AppBar>
  );
};

export default Header;