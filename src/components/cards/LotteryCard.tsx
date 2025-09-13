import React from 'react';
import { Card, CardContent, Typography, Box, Grid, Button, CircularProgress, Alert, Chip } from '@mui/material';
import { Casino, ArrowForward, Refresh, CloudOff, ErrorOutline } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useLottery } from '../../contexts/LotteryContext';

interface LotteryCardProps {
  islandId: string;
  maxGames?: number;
}

const LotteryCard: React.FC<LotteryCardProps> = ({ islandId, maxGames = 2 }) => {
  const { state, actions } = useLottery();
  const navigate = useNavigate();
  
  // Get island data from context
  const islandData = state.islands[islandId.toLowerCase()];
  const { loading, error, refreshing, backendConnected } = state;

  // Get number color based on value
  const getNumberColor = (number: number, gameType: string): string => {
    if (gameType.toLowerCase().includes('lotto')) {
      if (number <= 10) return '#ef4444'; // red
      if (number <= 20) return '#3b82f6'; // blue
      if (number <= 30) return '#10b981'; // green
      return '#8b5cf6'; // purple
    }
    return '#3b82f6'; // default blue
  };

  // Handle refresh
  const handleRefresh = async (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Refresh button clicked for island:', islandId);
    await actions.refreshData();
  };

  // Handle retry after error
  const handleRetry = async (e: React.MouseEvent) => {
    e.stopPropagation();
    actions.clearError();
    await actions.fetchAllData();
  };

  // Format island display name
  const getIslandDisplayName = (id: string): string => {
    const nameMap: { [key: string]: string } = {
      'st-vincent': 'St. Vincent & Grenadines',
      'grenada': 'Grenada',
      'barbados': 'Barbados',
      'jamaica': 'Jamaica',
      'trinidad': 'Trinidad & Tobago',
      'st-kitts': 'St. Kitts & Nevis',
      'guyana': 'Guyana',
      'belize': 'Belize',
      'antigua': 'Antigua & Barbuda',
      'st-lucia': 'St. Lucia',
      'dominica': 'Dominica',
      // Legacy mappings for backward compatibility
      'svg': 'St. Vincent & Grenadines',
      'tt': 'Trinidad & Tobago'
    };
    return nameMap[id.toLowerCase()] || id.charAt(0).toUpperCase() + id.slice(1);
  };

  // Add sparkle effect for Jamaica
  const isJamaica = islandId.toLowerCase() === 'jamaica';
  const cardStyles = isJamaica ? {
    background: 'linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%)',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    '&:hover': {
      transform: 'translateY(-6px)',
      boxShadow: '0 12px 32px rgba(255, 193, 7, 0.3)',
      border: '1px solid #ffd54f',
    },
  } : {
    backgroundColor: '#FFF8E1',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    },
  };

  return (
    <Card 
      sx={cardStyles}
      onClick={(e) => {
        // Only navigate if the click didn't come from the Details button
        if (!(e.target as HTMLElement).closest('button')) {
          console.log('Card clicked for island:', islandId);
          navigate(`/island/${islandId}`);
        }
      }}
    >
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          mb: 2,
          pb: 1,
          borderBottom: isJamaica ? '2px solid #ffd54f' : '1px solid rgba(0,0,0,0.1)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Casino sx={{ 
              color: isJamaica ? '#ff8f00' : 'primary.main',
              animation: isJamaica ? 'pulse 2s infinite' : 'none',
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.2)' },
                '100%': { transform: 'scale(1)' }
              }
            }} />
            <Typography 
              variant="h6" 
              sx={{ 
                color: isJamaica ? '#e65100' : 'primary.main',
                fontWeight: 700,
                textShadow: isJamaica ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              {getIslandDisplayName(islandId)}
            </Typography>
          </Box>
          
          {/* Status indicators */}
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {!backendConnected && (
              <Chip
                icon={<CloudOff />}
                label="Mock"
                size="small"
                color="warning"
                sx={{ 
                  fontSize: '0.7rem', 
                  height: 20,
                  background: isJamaica ? 'linear-gradient(135deg, #ffbf00, #ff8f00)' : undefined,
                  color: isJamaica ? 'white' : undefined
                }}
              />
            )}
            
            <Button
              size="small"
              onClick={refreshing ? undefined : handleRefresh}
              disabled={refreshing}
              sx={{ 
                minWidth: 'auto', 
                p: 0.5,
                color: isJamaica ? '#ff8f00' : 'inherit'
              }}
            >
              <Refresh 
                sx={{ 
                  fontSize: 16, 
                  animation: refreshing ? 'spin 1s linear infinite' : 'none',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                  }
                }} 
              />
            </Button>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1 }}>
          {loading && !islandData ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress size={24} />
            </Box>
          ) : error && !islandData ? (
            <Alert 
              severity="error" 
              sx={{ mb: 2 }}
              action={
                <Button color="inherit" size="small" onClick={handleRetry}>
                  Retry
                </Button>
              }
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ErrorOutline fontSize="small" />
                <Typography variant="body2">Failed to load</Typography>
              </Box>
            </Alert>
          ) : !islandData || !islandData.games || islandData.games.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
              No lottery results available
            </Typography>
          ) : (
            <Box>
              {islandData.games.slice(0, maxGames).map((game, gameIndex) => (
                <Box 
                  key={game.id || `game-${gameIndex}`} 
                  sx={{ 
                    mb: 2,
                    p: 1.5,
                    borderRadius: 1,
                    background: isJamaica ? 'rgba(255, 248, 225, 0.7)' : 'transparent',
                    border: isJamaica ? '1px dashed rgba(255, 213, 79, 0.5)' : 'none'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        fontWeight: 600,
                        color: isJamaica ? '#e65100' : 'inherit'
                      }}
                    >
                      {game.game}
                    </Typography>
                    {game.jackpotFormatted && (
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontWeight: 700,
                          color: isJamaica ? '#ff8f00' : 'success.main',
                          background: isJamaica ? 'rgba(255, 193, 7, 0.2)' : 'transparent',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1
                        }}
                      >
                        {game.jackpotFormatted}
                      </Typography>
                    )}
                  </Box>
                  
                  <Grid container spacing={0.5} sx={{ mb: 1 }}>
                    {game.numbers?.map((num: number, index: number) => (
                      <Grid item key={`${game.id}-${index}-${num}`}>
                        <Box
                          sx={{
                            fontWeight: 'bold',
                            fontSize: '0.95rem',
                            color: 'white',
                            backgroundColor: getNumberColor(num, game.game),
                            borderRadius: '50%',
                            width: 32,
                            height: 32,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: isJamaica ? '0 2px 4px rgba(0,0,0,0.2)' : 'none',
                            animation: isJamaica ? `float 3s infinite ease-in-out ${index * 0.2}s` : 'none',
                            '@keyframes float': {
                              '0%': { transform: 'translateY(0px)' },
                              '50%': { transform: 'translateY(-3px)' },
                              '100%': { transform: 'translateY(0px)' }
                            }
                          }}
                        >
                          {num}
                        </Box>
                      </Grid>
                    )) || []}
                  </Grid>
                  
                  {game.drawDateFormatted && (
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ 
                        fontStyle: isJamaica ? 'italic' : 'normal',
                        color: isJamaica ? '#5d4037' : 'inherit'
                      }}
                    >
                      Draw: {game.drawDateFormatted}
                    </Typography>
                  )}
                </Box>
              ))}
              
              {islandData.games.length > maxGames && (
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontStyle: 'italic',
                    color: isJamaica ? '#e65100' : 'text.secondary',
                    fontWeight: 600
                  }}
                >
                  +{islandData.games.length - maxGames} more games available
                </Typography>
              )}
            </Box>
          )}
        </Box>
        
        {/* Footer */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mt: 2, 
          pt: 1.5, 
          borderTop: isJamaica ? '2px dashed #ffd54f' : '1px solid rgba(0,0,0,0.1)'
        }}>
          <Typography 
            variant="caption" 
            sx={{ 
              color: isJamaica ? '#5d4037' : 'text.secondary'
            }}
          >
            {islandData?.lastUpdatedFormatted 
              ? `Updated: ${new Date(islandData.last_updated).toLocaleTimeString()}` 
              : 'No recent updates'}
          </Typography>
          
          <Button
            variant={isJamaica ? "contained" : "outlined"}
            endIcon={<ArrowForward />}
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Details button clicked for island:', islandId);
              navigate(`/island/${islandId}`);
            }}
            sx={{
              background: isJamaica ? 'linear-gradient(135deg, #ffbf00, #ff8f00)' : undefined,
              color: isJamaica ? 'white' : undefined,
              boxShadow: isJamaica ? '0 2px 6px rgba(255, 191, 0, 0.3)' : undefined,
              '&:hover': {
                background: isJamaica ? 'linear-gradient(135deg, #ff8f00, #ff6f00)' : undefined,
                boxShadow: isJamaica ? '0 4px 12px rgba(255, 191, 0, 0.4)' : undefined,
              }
            }}
          >
            Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LotteryCard;