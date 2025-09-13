import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Paper, 
  useTheme, 
  useMediaQuery,
  alpha
} from '@mui/material';
import { 
  ArrowBackIos, 
  ArrowForwardIos,
  Public
} from '@mui/icons-material';
import { ISLANDS, Island } from '../context/IslandContext';
// Removed IslandTabs.css import since styling is handled with MUI sx props

interface IslandTabsProps {
  onIslandSelect: (island: Island) => void;
  selectedIslandId: string;
}

const IslandTabs: React.FC<IslandTabsProps> = ({ onIslandSelect, selectedIslandId }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Get abbreviated name for display
  const getAbbreviatedName = (name: string): string => {
    if (name.length <= 12) return name;
    
    const words = name.split(' ');
    if (words.length === 1) return name.substring(0, 12) + '...';
    
    // For multi-word names, use first letter of each word
    if (name.length > 15) {
      return words.map(word => word.charAt(0)).join('').toUpperCase();
    }
    
    return name;
  };

  // Handle scroll events to show/hide arrows
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // Check scroll position on mount and resize
  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, []);

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: alpha(theme.palette.background.paper, 0.95),
        backdropFilter: 'blur(10px)',
        borderRadius: '12px 12px 0 0',
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: 1.5,
        pb: 0.5,
        borderBottom: `1px solid ${theme.palette.divider}`
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Public sx={{ color: theme.palette.primary.main }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Caribbean Islands
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary">
            {ISLANDS.length} islands
          </Typography>
      </Box>
      
      {/* Scrollable container with arrows */}
      <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
        {/* Left arrow */}
        {showLeftArrow && !isMobile && (
          <IconButton 
            onClick={scrollLeft}
            sx={{ 
              position: 'absolute',
              left: 0,
              zIndex: 10,
              background: alpha(theme.palette.background.paper, 0.8),
              borderRadius: '50%',
              m: 1,
              boxShadow: 2,
              '&:hover': {
                background: theme.palette.background.paper
              }
            }}
            size="small"
          >
            <ArrowBackIos sx={{ fontSize: '0.9rem' }} />
          </IconButton>
        )}
        
        {/* Island tabs */}
        <Box
          ref={scrollContainerRef}
          onScroll={handleScroll}
          sx={{
            display: 'flex',
            overflowX: 'auto',
            py: 1,
            px: isMobile ? 1 : 2,
            scrollBehavior: 'smooth',
            '&::-webkit-scrollbar': {
              display: 'none'
            },
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            width: '100%'
          }}
        >
          {ISLANDS.map((island) => (
            <Box
              key={island.id}
              onClick={() => onIslandSelect(island)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: isMobile ? 80 : 100,
                mx: 0.5,
                p: 1,
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: selectedIslandId === island.id 
                  ? alpha(theme.palette.primary.main, 0.1) 
                  : 'transparent',
                border: selectedIslandId === island.id 
                  ? `2px solid ${theme.palette.primary.main}` 
                  : '1px solid transparent',
                '&:hover': {
                  background: alpha(theme.palette.primary.main, 0.05),
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <Typography variant="h4" sx={{ mb: 0.5, fontSize: isMobile ? '1.5rem' : '2rem' }}>
                {island.flag}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  fontWeight: selectedIslandId === island.id ? 600 : 400,
                  textAlign: 'center',
                  color: selectedIslandId === island.id 
                    ? theme.palette.primary.main 
                    : 'text.primary'
                }}
              >
                {getAbbreviatedName(island.name)}
              </Typography>
            </Box>
          ))}
        </Box>
        
        {/* Right arrow */}
        {showRightArrow && !isMobile && (
          <IconButton 
            onClick={scrollRight}
            sx={{ 
              position: 'absolute',
              right: 0,
              zIndex: 10,
              background: alpha(theme.palette.background.paper, 0.8),
              borderRadius: '50%',
              m: 1,
              boxShadow: 2,
              '&:hover': {
                background: theme.palette.background.paper
              }
            }}
            size="small"
          >
            <ArrowForwardIos sx={{ fontSize: '0.9rem' }} />
          </IconButton>
        )}
      </Box>
    </Paper>
  );
};

export default IslandTabs;