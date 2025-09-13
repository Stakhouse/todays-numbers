import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Fade,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Island, ISLANDS, useIsland } from '../context/IslandContext';
import { useLottery } from '../contexts/LotteryContext';
import IslandScrollTabs from './IslandScrollTabs';
import IslandLotteryCard from './IslandLotteryCard';
import IslandDetailsModal from './IslandDetailsModal';

const MainContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  paddingBottom: '180px', // Space for fixed bottom tabs
  position: 'relative',
  background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, #f0f9ff 100%)`,
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(4, 0, 3, 0),
  background: `linear-gradient(135deg, transparent 0%, rgba(0, 191, 166, 0.05) 100%)`,
  borderRadius: `0 0 ${theme.spacing(4)} ${theme.spacing(4)}`,
  marginBottom: theme.spacing(4),
}));

const CardsContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  minHeight: '60vh',
  paddingTop: theme.spacing(2),
}));

const LoadingOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(4px)',
  borderRadius: theme.spacing(2),
  zIndex: 10,
}));

interface LotteryGame {
  id: string;
  game: string;
  numbers: number[];
  draw_date?: string;
  draw_time?: string;
  draw_number?: string;
  jackpot?: number;
  jackpotFormatted?: string;
}

interface IslandData {
  id: string;
  island: string;
  displayName: string;
  operator: string;
  games: LotteryGame[];
  last_updated: string;
  lastUpdatedFormatted: string;
  total_games: number;
}

const LotteryLandingPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentIsland, setCurrentIsland, isLoading: islandLoading } = useIsland();
  const { state: lotteryState } = useLottery();
  
  const [selectedIsland, setSelectedIsland] = useState<Island>(currentIsland);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIslandId, setModalIslandId] = useState<string>('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Update selected island when current island changes
  useEffect(() => {
    if (!islandLoading) {
      setSelectedIsland(currentIsland);
    }
  }, [currentIsland, islandLoading]);

  // Get lottery data for an island
  const getIslandLotteryData = (islandId: string): IslandData | undefined => {
    const data = lotteryState.islands[islandId];
    if (!data) return undefined;

    return {
      id: data.id,
      island: data.island,
      displayName: data.displayName || data.island,
      operator: data.operator,
      games: data.games || [],
      last_updated: data.last_updated,
      lastUpdatedFormatted: data.lastUpdatedFormatted,
      total_games: data.total_games || data.games?.length || 0,
    };
  };

  // Get game count for each island for the tabs
  const gameCount = useMemo(() => {
    const counts: { [key: string]: number } = {};
    ISLANDS.forEach(island => {
      const data = getIslandLotteryData(island.id);
      counts[island.id] = data?.total_games || 0;
    });
    return counts;
  }, [lotteryState.islands]);

  // Handle island selection from tabs
  const handleIslandSelect = (island: Island) => {
    if (island.id === selectedIsland.id) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedIsland(island);
      setCurrentIsland(island);
      setIsTransitioning(false);
    }, 200);
  };

  // Handle card click to open modal
  const handleCardClick = (island: Island) => {
    setModalIslandId(island.id);
    setModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setModalOpen(false);
    setTimeout(() => {
      setModalIslandId('');
    }, 300);
  };

  // Get islands to display (selected island + random others for demo)
  const getDisplayedIslands = (): Island[] => {
    if (isMobile) {
      return [selectedIsland]; // Only selected island on mobile
    }

    // On desktop, show selected + 2 others
    const otherIslands = ISLANDS.filter(island => island.id !== selectedIsland.id);
    const shuffled = [...otherIslands].sort(() => Math.random() - 0.5);
    return [selectedIsland, ...shuffled.slice(0, 2)];
  };

  const displayedIslands = getDisplayedIslands();

  if (islandLoading) {
    return (
      <MainContainer maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            gap: 3,
          }}
        >
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" color="text.secondary">
            Loading Caribbean lottery data...
          </Typography>
        </Box>
      </MainContainer>
    );
  }

  return (
    <>
      <MainContainer maxWidth="xl">
        {/* Header Section */}
        <HeaderSection>
          <Fade in timeout={800}>
            <Box>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                  fontWeight: 800,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2,
                  textShadow: '0 4px 8px rgba(0,0,0,0.1)',
                }}
              >
                Caribbean Lottery Hub
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                  color: 'text.secondary',
                  fontWeight: 500,
                  maxWidth: '600px',
                  mx: 'auto',
                  lineHeight: 1.4,
                }}
              >
                Real-time lottery numbers from across the Caribbean islands
              </Typography>
            </Box>
          </Fade>
        </HeaderSection>

        {/* Cards Container */}
        <CardsContainer>
          <Box sx={{ position: 'relative' }}>
            {isTransitioning && (
              <LoadingOverlay>
                <CircularProgress size={48} thickness={4} />
              </LoadingOverlay>
            )}

            <Fade in={!isTransitioning} timeout={500}>
              <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} sx={{ mb: 4 }}>
                {displayedIslands.map((island, index) => (
                  <Grid 
                    item 
                    xs={12} 
                    md={displayedIslands.length === 1 ? 12 : displayedIslands.length === 2 ? 6 : 4} 
                    key={`${island.id}-${index}`}
                  >
                    <Fade in timeout={600 + (index * 200)}>
                      <Box>
                        <IslandLotteryCard
                          island={island}
                          islandData={getIslandLotteryData(island.id)}
                          onCardClick={handleCardClick}
                          isSelected={island.id === selectedIsland.id}
                          isLoading={lotteryState.loading && Object.keys(lotteryState.islands).length === 0}
                        />
                      </Box>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            </Fade>
          </Box>

          {/* Status Messages */}
          {lotteryState.error && (
            <Box sx={{ mb: 3 }}>
              <Alert 
                severity="warning" 
                sx={{ 
                  borderRadius: 3,
                  fontSize: '0.9rem',
                  '& .MuiAlert-icon': {
                    fontSize: '1.5rem',
                  },
                }}
              >
                Some lottery data may be unavailable. Using demonstration data where needed.
              </Alert>
            </Box>
          )}

          {!lotteryState.backendConnected && (
            <Box sx={{ mb: 3 }}>
              <Alert 
                severity="info" 
                sx={{ 
                  borderRadius: 3,
                  fontSize: '0.9rem',
                  '& .MuiAlert-icon': {
                    fontSize: '1.5rem',
                  },
                }}
              >
                Currently showing demo lottery data. Real-time data will be available soon.
              </Alert>
            </Box>
          )}
        </CardsContainer>

        {/* Instructions for mobile users */}
        {isMobile && (
          <Box sx={{ textAlign: 'center', py: 2, px: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
              Select different islands using the tabs below • Tap cards for more details
            </Typography>
          </Box>
        )}

        {/* Footer spacing for mobile */}
        <Box sx={{ height: { xs: 20, sm: 10 } }} />
      </MainContainer>

      {/* Fixed Bottom Island Tabs */}
      <IslandScrollTabs
        selectedIsland={selectedIsland}
        onIslandSelect={handleIslandSelect}
        gameCount={gameCount}
      />

      {/* Island Details Modal */}
      <IslandDetailsModal
        open={modalOpen}
        onClose={handleModalClose}
        islandId={modalIslandId}
        islandData={modalIslandId ? getIslandLotteryData(modalIslandId) : undefined}
        isLoading={lotteryState.loading}
      />
    </>
  );
};

export default LotteryLandingPage;
