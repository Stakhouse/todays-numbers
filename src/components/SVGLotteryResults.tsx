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
import './SVGLotteryResults.css';

interface SVGLotteryResultsProps {
  islandId?: string;
}

const SVGLotteryResults: React.FC<SVGLotteryResultsProps> = ({ islandId = 'st-vincent' }) => {
  const { state } = useLottery();
  const { islands } = state;
  
  const svgData = islands[islandId];
  
  // Define the required games
  const requiredGames = ["Super 6", "Lotto", "3D", "Play 4"];
  
  // Filter to only show the required games
  const filteredGames = svgData?.games?.filter(game => 
    requiredGames.includes(game.game)
  ) || [];
  
  // Debug: Log the data to see what we're working with
  React.useEffect(() => {
    if (svgData) {
      console.log('SVG data:', svgData);
      console.log('Number of games:', svgData.games?.length);
      console.log('Game names:', svgData.games?.map(g => g.game));
      console.log('Filtered games:', filteredGames);
      console.log('Number of filtered games:', filteredGames.length);
    }
  }, [svgData, filteredGames]);
  
  if (!svgData) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" color="textSecondary">
            No data available for St. Vincent & Grenadines
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const getNumberColor = (number: number, gameType: string) => {
    if (gameType && gameType.toLowerCase().includes('super')) {
      if (number <= 15) return 'red';
      if (number <= 30) return 'blue';
      if (number <= 45) return 'green';
      return 'purple';
    } else if (gameType && gameType.toLowerCase().includes('daily')) {
      if (number <= 2) return 'orange';
      if (number <= 6) return 'blue';
      if (number <= 8) return 'green';
      return 'purple';
    } else if (gameType && gameType.toLowerCase().includes('pick')) {
      if (number <= 3) return 'orange';
      if (number <= 6) return 'blue';
      return 'green';
    }
    return 'blue';
  };

  const GameCard: React.FC<{ game: any }> = ({ game }) => {
    const [tabValue, setTabValue] = useState(0);
    
    // Handle tab change for multi-draw games
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
      setTabValue(newValue);
    };
    
    // Check if this is a multi-draw game (3D or Play 4)
    const isMultiDrawGame = game.game === "3D" || game.game === "Play 4";
    
    // For multi-draw games, we need to handle the draws array
    // For single-draw games, we use the game object directly
    const currentDraw = isMultiDrawGame ? game.draws[tabValue] : game;
    
    return (
      <Card variant="outlined" className="svg-game-card" sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1} className="svg-game-header">
            <Typography variant="h6" component="h3" className="svg-game-title">
              {game.game}
            </Typography>
            {game.jackpotFormatted && (
              <Chip 
                label={game.jackpotFormatted} 
                className="svg-game-jackpot"
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
                <Tab label="Day" />
                <Tab label="Night" />
              </Tabs>
              
              <Grid container spacing={1} mb={1} className="svg-game-info-grid">
                <Grid item xs={12} sm={6} className="svg-game-info-item">
                  <Typography variant="body2" className="svg-game-info-label">
                    Date
                  </Typography>
                  <Typography variant="body1" className="svg-game-info-value">
                    {currentDraw.draw_date ? new Date(currentDraw.draw_date).toLocaleDateString() : 'Pending'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} className="svg-game-info-item">
                  <Typography variant="body2" className="svg-game-info-label">
                    Time
                  </Typography>
                  <Typography variant="body1" className="svg-game-info-value">
                    {currentDraw.draw_time || 'Pending'}
                  </Typography>
                </Grid>
                {currentDraw.draw_number && (
                  <Grid item xs={12} sm={6} className="svg-game-info-item">
                    <Typography variant="body2" className="svg-game-info-label">
                      Draw #
                    </Typography>
                    <Typography variant="body1" className="svg-game-info-value">
                      {currentDraw.draw_number}
                    </Typography>
                  </Grid>
                )}
                {game.frequency && (
                  <Grid item xs={12} sm={6} className="svg-game-info-item">
                    <Typography variant="body2" className="svg-game-info-label">
                      Frequency
                    </Typography>
                    <Typography variant="body1" className="svg-game-info-value">
                      {game.frequency}
                    </Typography>
                  </Grid>
                )}
                {game.draw_times && game.draw_times.length > 0 && (
                  <Grid item xs={12} className="svg-game-info-item">
                    <Typography variant="body2" className="svg-game-info-label">
                      All Draw Times
                    </Typography>
                    <Typography variant="body1" className="svg-game-info-value">
                      {game.draw_times.join(', ')}
                    </Typography>
                  </Grid>
                )}
              </Grid>
              
              <Box className="svg-game-numbers">
                {currentDraw.numbers && currentDraw.numbers.length > 0 ? (
                  currentDraw.numbers.map((number: number, index: number) => (
                    <Box
                      key={index}
                      className={`svg-number-ball ${getNumberColor(number, game.game)}`}
                    >
                      {number}
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary" className="svg-pending">
                    Pending
                  </Typography>
                )}
              </Box>
              {/* Note for multi-draw games that have multiple winners */}
              <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                Multiple winners with smaller cash prizes
              </Typography>
            </>
          ) : (
            <>
              <Grid container spacing={1} mb={1} className="svg-game-info-grid">
                <Grid item xs={12} sm={6} className="svg-game-info-item">
                  <Typography variant="body2" className="svg-game-info-label">
                    Date
                  </Typography>
                  <Typography variant="body1" className="svg-game-info-value">
                    {currentDraw.draw_date ? new Date(currentDraw.draw_date).toLocaleDateString() : 'Pending'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} className="svg-game-info-item">
                  <Typography variant="body2" className="svg-game-info-label">
                    Time
                  </Typography>
                  <Typography variant="body1" className="svg-game-info-value">
                    {currentDraw.draw_time || 'Pending'}
                  </Typography>
                </Grid>
                {currentDraw.draw_number && (
                  <Grid item xs={12} sm={6} className="svg-game-info-item">
                    <Typography variant="body2" className="svg-game-info-label">
                      Draw #
                    </Typography>
                    <Typography variant="body1" className="svg-game-info-value">
                      {currentDraw.draw_number}
                    </Typography>
                  </Grid>
                )}
                {game.frequency && (
                  <Grid item xs={12} sm={6} className="svg-game-info-item">
                    <Typography variant="body2" className="svg-game-info-label">
                      Frequency
                    </Typography>
                    <Typography variant="body1" className="svg-game-info-value">
                      {game.frequency}
                    </Typography>
                  </Grid>
                )}
                {game.draw_times && game.draw_times.length > 0 && (
                  <Grid item xs={12} className="svg-game-info-item">
                    <Typography variant="body2" className="svg-game-info-label">
                      Draw Times
                    </Typography>
                    <Typography variant="body1" className="svg-game-info-value">
                      {game.draw_times.join(', ')}
                    </Typography>
                  </Grid>
                )}
              </Grid>
              
              <Box className="svg-game-numbers">
                {currentDraw.numbers && currentDraw.numbers.length > 0 ? (
                  currentDraw.numbers.map((number: number, index: number) => (
                    <Box
                      key={index}
                      className={`svg-number-ball ${getNumberColor(number, game.game)}`}
                    >
                      {number}
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary" className="svg-pending">
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
    <Box className="svg-lottery-results">
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={2} className="svg-header">
            <Typography variant="h4" component="h2" className="svg-title">
              🇻🇨 St. Vincent & Grenadines Lottery
            </Typography>
            <Chip label="LIVE" color="success" size="small" />
          </Box>
          
          <Typography variant="body1" color="textSecondary" mb={2} className="svg-operator">
            Latest lottery results from SVG National Lottery
          </Typography>
          
          <Box display="flex" gap={2} flexWrap="wrap" className="svg-updated">
            <Typography variant="body2">
              <strong>Operator:</strong> {svgData.operator}
            </Typography>
            <Typography variant="body2">
              <strong>Last Updated:</strong> {svgData.lastUpdatedFormatted}
            </Typography>
            <Typography variant="body2">
              <strong>Total Games:</strong> {filteredGames.length}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Display only the required games */}
      <Box>
        <Typography variant="h5" className="svg-game-group-title" sx={{ mb: 2 }}>
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

export default SVGLotteryResults;