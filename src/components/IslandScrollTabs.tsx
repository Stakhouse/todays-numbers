import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  useTheme,
  useMediaQuery,
  Fade,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Island, ISLANDS } from '../context/IslandContext';

const ScrollableContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  backgroundColor: theme.palette.primary.main,
  boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
  borderRadius: '16px 16px 0 0',
  overflow: 'hidden',
}));

const TabsContainer = styled(Box)({
  display: 'flex',
  overflowX: 'auto',
  overflowY: 'hidden',
  scrollBehavior: 'smooth',
  padding: '12px 0',
  gap: '12px',
  paddingLeft: '16px',
  paddingRight: '16px',
  '&::-webkit-scrollbar': {
    height: '4px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '2px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: '2px',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.5)',
    },
  },
});

const IslandTab = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '12px 16px',
  minWidth: '90px',
  height: '80px',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  backgroundColor: isSelected 
    ? theme.palette.secondary.main 
    : 'rgba(255,255,255,0.15)',
  backdropFilter: 'blur(10px)',
  border: isSelected 
    ? `2px solid ${theme.palette.secondary.light}`
    : '2px solid transparent',
  borderRadius: '16px',
  boxShadow: isSelected 
    ? `0 4px 20px rgba(255, 191, 0, 0.4)`
    : '0 2px 10px rgba(0,0,0,0.1)',
  transform: isSelected ? 'translateY(-4px) scale(1.05)' : 'translateY(0) scale(1)',
  '&:hover': {
    backgroundColor: isSelected 
      ? theme.palette.secondary.main 
      : 'rgba(255,255,255,0.25)',
    transform: isSelected 
      ? 'translateY(-4px) scale(1.05)' 
      : 'translateY(-2px) scale(1.02)',
    boxShadow: isSelected 
      ? `0 6px 25px rgba(255, 191, 0, 0.5)`
      : '0 4px 15px rgba(0,0,0,0.15)',
  },
  '&:active': {
    transform: isSelected 
      ? 'translateY(-2px) scale(1.03)' 
      : 'translateY(-1px) scale(1.01)',
  },
}));

const FlagDisplay = styled(Typography)(({ theme }) => ({
  fontSize: '24px',
  lineHeight: 1,
  marginBottom: '4px',
  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
}));

const IslandName = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
  fontSize: '0.75rem',
  fontWeight: isSelected ? 700 : 600,
  color: isSelected ? theme.palette.primary.dark : 'rgba(255,255,255,0.9)',
  textAlign: 'center',
  lineHeight: 1.2,
  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
}));

const GameCountChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
  position: 'absolute',
  top: -6,
  right: -6,
  height: '20px',
  fontSize: '0.65rem',
  fontWeight: 600,
  backgroundColor: isSelected 
    ? theme.palette.error.main 
    : theme.palette.primary.light,
  color: 'white',
  border: `2px solid ${theme.palette.background.paper}`,
  '& .MuiChip-label': {
    paddingLeft: '6px',
    paddingRight: '6px',
  },
}));

interface IslandScrollTabsProps {
  selectedIsland: Island;
  onIslandSelect: (island: Island) => void;
  gameCount?: { [key: string]: number };
  className?: string;
}

const IslandScrollTabs: React.FC<IslandScrollTabsProps> = ({
  selectedIsland,
  onIslandSelect,
  gameCount = {},
  className,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getIslandDisplayName = (island: Island): string => {
    // Use abbreviations for longer names to save space
    const abbreviations: { [key: string]: string } = {
      'st-vincent': 'SVG',
      'st-kitts': 'St. Kitts',
      'st-lucia': 'St. Lucia',
      'antigua': 'Antigua',
      'trinidad': 'T&T',
      'barbados': 'Barbados',
      'jamaica': 'Jamaica',
      'grenada': 'Grenada',
      'dominica': 'Dominica',
      'guyana': 'Guyana',
      'belize': 'Belize',
    };
    return abbreviations[island.id] || island.name;
  };

  const handleTabClick = (island: Island) => {
    onIslandSelect(island);
    
    // Smooth scroll to center the selected tab
    setTimeout(() => {
      const selectedTab = document.querySelector(`[data-island-id="${island.id}"]`);
      if (selectedTab) {
        selectedTab.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }, 100);
  };

  return (
    <Fade in={true} timeout={500}>
      <ScrollableContainer className={className}>
        <Box sx={{ 
          textAlign: 'center', 
          py: 1, 
          borderBottom: '1px solid rgba(255,255,255,0.2)' 
        }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(255,255,255,0.9)', 
              fontWeight: 600,
              fontSize: '0.85rem',
            }}
          >
            Select Island
          </Typography>
        </Box>
        
        <TabsContainer>
          {ISLANDS.map((island) => {
            const isSelected = selectedIsland.id === island.id;
            const count = gameCount[island.id] || 0;
            
            return (
              <Box 
                key={island.id} 
                sx={{ position: 'relative' }}
                data-island-id={island.id}
              >
                <IslandTab
                  isSelected={isSelected}
                  onClick={() => handleTabClick(island)}
                  elevation={isSelected ? 8 : 2}
                  role="tab"
                  aria-selected={isSelected}
                  aria-label={`Select ${island.name} island`}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleTabClick(island);
                    }
                  }}
                >
                  <FlagDisplay>{island.flag}</FlagDisplay>
                  <IslandName isSelected={isSelected}>
                    {getIslandDisplayName(island)}
                  </IslandName>
                  
                  {count > 0 && (
                    <GameCountChip
                      isSelected={isSelected}
                      label={count}
                      size="small"
                      aria-label={`${count} games available`}
                    />
                  )}
                </IslandTab>
              </Box>
            );
          })}
        </TabsContainer>
        
        {/* Swipe indicator for mobile */}
        {isMobile && (
          <Box sx={{ 
            textAlign: 'center', 
            py: 0.5,
            backgroundColor: 'rgba(255,255,255,0.1)' 
          }}>
            <Box sx={{
              width: '40px',
              height: '4px',
              backgroundColor: 'rgba(255,255,255,0.3)',
              borderRadius: '2px',
              margin: '0 auto',
            }} />
          </Box>
        )}
      </ScrollableContainer>
    </Fade>
  );
};

export default IslandScrollTabs;
