import React, { useRef, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  useTheme,
  useMediaQuery,
  Fade,
  Chip,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Island } from '../context/IslandContext';

interface HorizontalIslandTabsProps {
  islands: Island[];
  selectedIsland: string | null;
  onIslandSelect: (islandId: string) => void;
  className?: string;
}

const HorizontalIslandTabs: React.FC<HorizontalIslandTabsProps> = ({
  islands,
  selectedIsland,
  onIslandSelect,
  className,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll position to show/hide navigation buttons
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    const handleResize = () => checkScrollPosition();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [islands]);

  // Scroll to selected island
  useEffect(() => {
    if (selectedIsland && scrollContainerRef.current) {
      const selectedElement = scrollContainerRef.current.querySelector(
        `[data-island-id="${selectedIsland}"]`
      ) as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [selectedIsland]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = isMobile ? 200 : 300;
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  };

  const handleTabClick = (islandId: string) => {
    onIslandSelect(islandId);
  };

  return (
    <Paper
      elevation={8}
      className={className}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.appBar - 1,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderTop: `2px solid ${theme.palette.primary.light}`,
        borderRadius: '16px 16px 0 0',
        boxShadow: '0 -8px 32px rgba(0,0,0,0.1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          boxShadow: '0 -12px 40px rgba(0,0,0,0.15)',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          py: 1.5,
          px: 1,
          maxWidth: '100vw',
          overflow: 'hidden',
        }}
      >
        {/* Left scroll button */}
        <Fade in={canScrollLeft}>
          <IconButton
            onClick={() => scroll('left')}
            sx={{
              position: 'absolute',
              left: 8,
              zIndex: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              border: `1px solid ${theme.palette.primary.light}`,
              width: 40,
              height: 40,
              '&:hover': {
                backgroundColor: theme.palette.primary.light,
                transform: 'scale(1.05)',
              },
            }}
          >
            <ChevronLeft />
          </IconButton>
        </Fade>

        {/* Island tabs container */}
        <Box
          ref={scrollContainerRef}
          onScroll={checkScrollPosition}
          sx={{
            display: 'flex',
            gap: 1.5,
            overflowX: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            px: canScrollLeft ? 6 : 1,
            paddingRight: canScrollRight ? 6 : 1,
            flex: 1,
            alignItems: 'center',
            minHeight: 70,
          }}
        >
          {islands.map((island) => {
            const isSelected = selectedIsland === island.id;
            
            return (
              <Box
                key={island.id}
                data-island-id={island.id}
                onClick={() => handleTabClick(island.id)}
                sx={{
                  minWidth: isMobile ? 120 : 140,
                  height: 60,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  borderRadius: '12px',
                  border: `2px solid ${isSelected ? theme.palette.secondary.main : 'transparent'}`,
                  background: isSelected
                    ? `linear-gradient(135deg, ${theme.palette.secondary.light}20 0%, ${theme.palette.primary.light}20 100%)`
                    : 'transparent',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    background: isSelected
                      ? `linear-gradient(135deg, ${theme.palette.secondary.light}30 0%, ${theme.palette.primary.light}30 100%)`
                      : `linear-gradient(135deg, ${theme.palette.primary.light}15 0%, ${theme.palette.secondary.light}15 100%)`,
                    border: `2px solid ${isSelected ? theme.palette.secondary.main : theme.palette.primary.light}`,
                    transform: 'translateY(-2px)',
                    boxShadow: isSelected
                      ? '0 6px 24px rgba(255, 191, 0, 0.4)'
                      : '0 4px 16px rgba(0,0,0,0.1)',
                  },
                  '&:active': {
                    transform: 'translateY(0px)',
                  },
                }}
              >
                {/* Flag */}
                <Typography
                  variant="h4"
                  sx={{
                    fontSize: isMobile ? '1.5rem' : '1.8rem',
                    lineHeight: 1,
                    mb: 0.5,
                    filter: isSelected ? 'brightness(1.1)' : 'brightness(1)',
                    transition: 'filter 0.3s ease',
                  }}
                >
                  {island.flag}
                </Typography>
                
                {/* Island name (abbreviated) */}
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: isMobile ? '0.7rem' : '0.75rem',
                    fontWeight: isSelected ? 700 : 600,
                    color: isSelected ? 'primary.dark' : 'text.primary',
                    textAlign: 'center',
                    lineHeight: 1,
                    transition: 'all 0.3s ease',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  {island.name.length > 8 ? island.name.substring(0, 7) + '...' : island.name}
                </Typography>

                {/* Selection indicator */}
                {isSelected && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: -1,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 24,
                      height: 3,
                      backgroundColor: theme.palette.secondary.main,
                      borderRadius: '3px 3px 0 0',
                      boxShadow: `0 0 8px ${theme.palette.secondary.main}80`,
                    }}
                  />
                )}

                {/* Ripple effect on hover */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: '12px',
                    background: 'radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%)',
                    opacity: 0,
                    transform: 'scale(0)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    pointerEvents: 'none',
                    '.MuiBox-root:hover &': {
                      opacity: 1,
                      transform: 'scale(1)',
                    },
                  }}
                />
              </Box>
            );
          })}
        </Box>

        {/* Right scroll button */}
        <Fade in={canScrollRight}>
          <IconButton
            onClick={() => scroll('right')}
            sx={{
              position: 'absolute',
              right: 8,
              zIndex: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              border: `1px solid ${theme.palette.primary.light}`,
              width: 40,
              height: 40,
              '&:hover': {
                backgroundColor: theme.palette.primary.light,
                transform: 'scale(1.05)',
              },
            }}
          >
            <ChevronRight />
          </IconButton>
        </Fade>
      </Box>

      {/* Selection info bar */}
      {selectedIsland && (
        <Box
          sx={{
            px: 3,
            pb: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Chip
            label={`Viewing ${islands.find(i => i.id === selectedIsland)?.name} details`}
            color="secondary"
            variant="filled"
            size="small"
            sx={{
              fontWeight: 600,
              fontSize: '0.7rem',
              height: 24,
              '& .MuiChip-label': {
                px: 1.5,
              },
            }}
          />
        </Box>
      )}
    </Paper>
  );
};

export default HorizontalIslandTabs;