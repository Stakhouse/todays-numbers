import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  Grid,
  Tabs,
  Tab
} from '@mui/material';
import { useLottery } from '../contexts/LotteryContext';

interface GrenadaLotteryResultsProps {
  islandId?: string;
}

const GrenadaLotteryResults: React.FC<GrenadaLotteryResultsProps> = ({ islandId = 'grenada' }) => {
  const { state } = useLottery();
  const { islands } = state;
  
  const grenadaData = islands[islandId];
  
  // Define the required games
  const requiredGames = ["Daily Cash 4", "Daily Pick 3", "Lotto", "Super 6"];
  
  // Filter to only show the required games
  const filteredGames = grenadaData?.games?.filter(game => 
    requiredGames.includes(game.game)
  ) || [];
  
  if (!grenadaData) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" color="textSecondary">
            No data available for Grenada
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const getNumberColor = (number: number, gameType: string) => {
    if (gameType && gameType.toLowerCase().includes('cash')) {
      if (number <= 2) return 'orange';
      if (number <= 6) return 'blue';
      if (number <= 8) return 'green';
      return 'purple';
    } else if (gameType && gameType.toLowerCase().includes('pick')) {
      if (number <= 3) return 'orange';
      if (number <= 6) return 'blue';
      return 'green';
    } else if (gameType && gameType.toLowerCase().includes('lotto')) {
      if (number <= 15) return 'red';
      if (number <= 30) return 'blue';
      if (number <= 45) return 'green';
      return 'purple';
    }
    return 'blue';
  };

  const GameCard: React.FC<{ game: any }> = ({ game }) => {
    const [tabValue, setTabValue] = useState(0);
    
    // Handle tab change for multi-draw games
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
      setTabValue(newValue);
    };
    
    // Check if this is a multi-draw game (Daily Cash 4 or Daily Pick 3)
    const isMultiDrawGame = game.game === "Daily Cash 4" || game.game === "Daily Pick 3";
    
    // For multi-draw games, we need to handle the draws array
    // For single-draw games, we use the game object directly
    const currentDraw = isMultiDrawGame ? game.draws[tabValue] : game;
    
    return (
      <Card variant="outlined" sx={{ mb: 2, borderLeft: '4px solid #00BFA6' }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 600, color: '#006241' }}>
              {game.game}
            </Typography>
            {game.jackpotFormatted && (
              <Chip 
                label={game.jackpotFormatted} 
                size="small"
                sx={{ 
                  fontWeight: 'bold',
                  backgroundColor: '#FFBF00',
                  color: '#000'
                }}
              />
            )}
          </Box>
          
          {isMultiDrawGame ? (
            <>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                variant="fullWidth"
                sx={{ mb: 2 }}
              >
                <Tab label="Morning" />
                <Tab label="Evening" />
              </Tabs>
              
              <Grid container spacing={1} mb={1}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Date
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {currentDraw.draw_date ? new Date(currentDraw.draw_date).toLocaleDateString() : 'Pending'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Time
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {currentDraw.draw_time || 'Pending'}
                  </Typography>
                </Grid>
                {currentDraw.draw_number && (
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Draw #
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {currentDraw.draw_number}
                    </Typography>
                  </Grid>
                )}
              </Grid>
              
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                {currentDraw.numbers && currentDraw.numbers.length > 0 ? (
                  currentDraw.numbers.map((number: number, index: number) => (
                    <Box
                      key={index}
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: getNumberColor(number, game.game),
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        boxShadow: 1,
                      }}
                    >
                      {number}
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    Pending
                  </Typography>
                )}
              </Box>
            </>
          ) : (
            <>
              <Grid container spacing={1} mb={1}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Date
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {currentDraw.draw_date ? new Date(currentDraw.draw_date).toLocaleDateString() : 'Pending'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Time
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {currentDraw.draw_time || 'Pending'}
                  </Typography>
                </Grid>
                {currentDraw.draw_number && (
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Draw #
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {currentDraw.draw_number}
                    </Typography>
                  </Grid>
                )}
              </Grid>
              
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                {currentDraw.numbers && currentDraw.numbers.length > 0 ? (
                  currentDraw.numbers.map((number: number, index: number) => (
                    <Box
                      key={index}
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: getNumberColor(number, game.game),
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        boxShadow: 1,
                      }}
                    >
                      {number}
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    Pending
                  </Typography>
                )}
              </Box>
              
              {game.jackpotFormatted && (
                <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold', color: '#FFBF00' }}>
                  Jackpot: {game.jackpotFormatted}
                </Typography>
              )}
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      <Card sx={{ mb: 3, backgroundColor: '#F5F5F5' }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 700, color: '#006241' }}>
              🇬🇩 Grenada Lottery
            </Typography>
            <Chip label="LIVE" color="success" size="small" />
          </Box>
          
          <Typography variant="body1" color="textSecondary" mb={2}>
            Latest lottery results from Grenada National Lottery
          </Typography>
          
          <Box display="flex" gap={2} flexWrap="wrap">
            <Typography variant="body2">
              <strong>Operator:</strong> {grenadaData.operator}
            </Typography>
            <Typography variant="body2">
              <strong>Last Updated:</strong> {grenadaData.lastUpdatedFormatted}
            </Typography>
            <Typography variant="body2">
              <strong>Total Games:</strong> {filteredGames.length}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Display only the required games */}
      <Box>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#006241' }}>
          All Games ({filteredGames.length})
        </Typography>
        {filteredGames.length > 0 ? (
          filteredGames.map((game, index) => (
            <GameCard key={`${game.id}-${index}`} game={game} />
          ))
        ) : (
          <Typography variant="body1" color="textSecondary">
            No games available
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default GrenadaLotteryResults;