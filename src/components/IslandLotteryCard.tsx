import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  Button,
  Grid,
  Skeleton,
  useTheme,
  useMediaQuery,
  Fade,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Casino,
  Schedule,
  TrendingUp,
  Visibility,
  AttachMoney,
} from '@mui/icons-material';
import { Island } from '../context/IslandContext';

const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
  height: '100%',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  background: isSelected 
    ? `linear-gradient(135deg, ${theme.palette.secondary.light}15 0%, ${theme.palette.primary.light}15 100%)`
    : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
  border: isSelected 
    ? `2px solid ${theme.palette.secondary.main}`
    : '2px solid transparent',
  boxShadow: isSelected 
    ? `0 8px 32px rgba(255, 191, 0, 0.3)`
    : '0 4px 20px rgba(0,0,0,0.1)',
  transform: isSelected ? 'translateY(-4px)' : 'translateY(0)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
    border: `2px solid ${theme.palette.primary.light}`,
  },
  '&:active': {
    transform: 'translateY(-2px)',
  },
}));

const IslandHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  background: `linear-gradient(135deg, ${theme.palette.primary.main}20 0%, ${theme.palette.secondary.main}20 100%)`,
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.primary.light}30`,
}));

const IslandTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 700,
  color: theme.palette.primary.dark,
  textShadow: '0 1px 2px rgba(0,0,0,0.1)',
}));

const GameCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  background: 'rgba(255,255,255,0.9)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.primary.light}30`,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    background: 'rgba(255,255,255,1)',
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
    transform: 'translateY(-2px)',
  },
  '&:last-child': {
    marginBottom: 0,
  },
}));

const NumberBall = styled(Box)(({ theme }) => ({
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.primary.dark,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1rem',
  fontWeight: 'bold',
  boxShadow: '0 2px 8px rgba(255, 191, 0, 0.4)',
  border: `2px solid ${theme.palette.background.paper}`,
}));

const GameTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.1rem',
  fontWeight: 600,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(1),
}));

const GameInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
  fontSize: '0.85rem',
  color: theme.palette.text.secondary,
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

interface IslandLotteryCardProps {
  island: Island;
  islandData?: IslandData;
  onCardClick: (island: Island) => void;
  isSelected?: boolean;
  isLoading?: boolean;
}

const IslandLotteryCard: React.FC<IslandLotteryCardProps> = ({
  island,
  islandData,
  onCardClick,
  isSelected = false,
  isLoading = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleCardClick = () => {
    onCardClick(island);
  };

  const formatCurrency = (amount: number) => {
    if (!amount) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getDisplayGames = () => {
    if (!islandData?.games) return [];
    return islandData.games.slice(0, 2); // Show only first 2 games
  };

  const remainingGamesCount = () => {
    if (!islandData?.games) return 0;
    return Math.max(0, islandData.games.length - 2);
  };

  if (isLoading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Skeleton variant="rectangular" height={60} sx={{ mb: 2, borderRadius: 2 }} />
          <Skeleton variant="rectangular" height={120} sx={{ mb: 2, borderRadius: 2 }} />
          <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Fade in={true} timeout={500}>
      <StyledCard
        isSelected={isSelected}
        onClick={handleCardClick}
        role="button"
        aria-label={`View ${island.name} lottery details`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick();
          }
        }}
      >
        <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Island Header */}
          <IslandHeader>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h2" sx={{ fontSize: '2rem' }}>
                {island.flag}
              </Typography>
              <Box>
                <IslandTitle variant="h5">
                  {island.name}
                </IslandTitle>
                {islandData?.operator && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.85rem',
                      fontWeight: 500,
                    }}
                  >
                    {islandData.operator}
                  </Typography>
                )}
              </Box>
            </Box>
            
            {islandData?.total_games && (
              <Chip
                icon={<Casino />}
                label={`${islandData.total_games} games`}
                color="primary"
                size="small"
                sx={{ fontWeight: 600 }}
              />
            )}
          </IslandHeader>

          {/* Games Display */}
          <Box sx={{ flex: 1 }}>
            {islandData ? (
              <>
                {getDisplayGames().map((game) => (
                  <GameCard key={game.id}>
                    <CardContent sx={{ p: 2 }}>
                      <GameTitle>{game.game}</GameTitle>
                      
                      {/* Game Info */}
                      <Box sx={{ mb: 2 }}>
                        {game.draw_date && (
                          <GameInfo>
                            <Schedule sx={{ fontSize: '1rem' }} />
                            {new Date(game.draw_date).toLocaleDateString()}
                            {game.draw_time && ` • ${game.draw_time}`}
                          </GameInfo>
                        )}
                        
                        {(game.jackpot || game.jackpotFormatted) && (
                          <GameInfo>
                            <AttachMoney sx={{ fontSize: '1rem' }} />
                            <Typography
                              variant="body2"
                              sx={{ 
                                fontWeight: 700, 
                                color: 'secondary.main',
                                fontSize: '1rem' 
                              }}
                            >
                              {game.jackpotFormatted || formatCurrency(game.jackpot || 0)}
                            </Typography>
                          </GameInfo>
                        )}
                      </Box>

                      {/* Lottery Numbers */}
                      <Box sx={{ 
                        display: 'flex', 
                        flexWrap: 'wrap',
                        gap: 1.5,
                        alignItems: 'center',
                        justifyContent: 'center' 
                      }}>
                        {game.numbers && game.numbers.length > 0 ? (
                          game.numbers.map((number, index) => (
                            <NumberBall key={index}>
                              {number}
                            </NumberBall>
                          ))
                        ) : (
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: 'text.secondary',
                              fontStyle: 'italic',
                              textAlign: 'center',
                              py: 2
                            }}
                          >
                            Draw pending...
                          </Typography>
                        )}
                      </Box>
                    </CardContent>
                  </GameCard>
                ))}

                {/* View More Button */}
                {remainingGamesCount() > 0 && (
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Button
                      variant="outlined"
                      startIcon={<Visibility />}
                      size="small"
                      sx={{
                        borderColor: 'primary.light',
                        color: 'primary.main',
                        '&:hover': {
                          borderColor: 'primary.main',
                          backgroundColor: 'primary.light',
                        },
                      }}
                    >
                      +{remainingGamesCount()} more games
                    </Button>
                  </Box>
                )}

                {/* Last Updated */}
                {islandData.lastUpdatedFormatted && (
                  <Box sx={{ 
                    mt: 'auto', 
                    pt: 2, 
                    borderTop: '1px solid rgba(0,0,0,0.1)',
                    textAlign: 'center' 
                  }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 0.5,
                      }}
                    >
                      <Schedule sx={{ fontSize: '0.8rem' }} />
                      Updated: {islandData.lastUpdatedFormatted}
                    </Typography>
                  </Box>
                )}
              </>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '200px',
                textAlign: 'center' 
              }}>
                <Casino sx={{ 
                  fontSize: '4rem', 
                  color: 'text.disabled',
                  mb: 2 
                }} />
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'text.secondary',
                    mb: 1,
                    fontWeight: 500,
                  }}
                >
                  No lottery data available
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ color: 'text.disabled' }}
                >
                  Click to view island details
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </StyledCard>
    </Fade>
  );
};

export default IslandLotteryCard;
