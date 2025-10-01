import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  Grid
} from '@mui/material';
import { useLottery } from '../contexts/LotteryContext';
import './JamaicaLotteryResults.css';

interface JamaicaLotteryResultsProps {
  islandId?: string;
}

const JamaicaLotteryResults: React.FC<JamaicaLotteryResultsProps> = ({ islandId = 'jamaica' }) => {
  const { state } = useLottery();
  const { islands } = state;
  
  const jamaicaData = islands[islandId];
  
  // Debug: Log the data to see what we're working with
  React.useEffect(() => {
    if (jamaicaData) {
      console.log('Jamaica data:', jamaicaData);
      console.log('Number of games:', jamaicaData.games?.length);
      console.log('Game names:', jamaicaData.games?.map(g => g.game));
    }
  }, [jamaicaData]);
  
  if (!jamaicaData) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" color="textSecondary">
            No data available for Jamaica
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const getNumberColor = (number: number, gameType: string) => {
    if (gameType && gameType.toLowerCase().includes('lotto')) {
      if (number <= 10) return 'red';
      if (number <= 20) return 'blue';
      if (number <= 30) return 'green';
      return 'purple';
    } else if (gameType && gameType.toLowerCase().includes('pick')) {
      if (number <= 3) return 'orange';
      if (number <= 6) return 'blue';
      return 'green';
    }
    return 'blue';
  };

  const GameCard: React.FC<{ game: any }> = ({ game }) => (
    <Card variant="outlined" className="game-card" sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1} className="game-header">
          <Typography variant="h6" component="h3" className="game-title">
            {game.game}
          </Typography>
          {game.jackpotFormatted && (
            <Chip 
              label={game.jackpotFormatted} 
              className="game-jackpot"
              size="small"
            />
          )}
        </Box>
        
        <Grid container spacing={1} mb={1} className="game-info-grid">
          <Grid item xs={12} sm={6} className="game-info-item">
            <Typography variant="body2" className="game-info-label">
              Date
            </Typography>
            <Typography variant="body1" className="game-info-value">
              {game.draw_date ? new Date(game.draw_date).toLocaleDateString() : 'Pending'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} className="game-info-item">
            <Typography variant="body2" className="game-info-label">
              Time
            </Typography>
            <Typography variant="body1" className="game-info-value">
              {game.draw_time || 'Pending'}
            </Typography>
          </Grid>
          {game.frequency && (
            <Grid item xs={12} sm={6} className="game-info-item">
              <Typography variant="body2" className="game-info-label">
                Frequency
              </Typography>
              <Typography variant="body1" className="game-info-value">
                {game.frequency}
              </Typography>
            </Grid>
          )}
          {game.draw_times && game.draw_times.length > 0 && (
            <Grid item xs={12} className="game-info-item">
              <Typography variant="body2" className="game-info-label">
                Draw Times
              </Typography>
              <Typography variant="body1" className="game-info-value">
                {game.draw_times.join(', ')}
              </Typography>
            </Grid>
          )}
          {game.draw_number && (
            <Grid item xs={12} className="game-info-item">
              <Typography variant="body2" className="game-info-label">
                Draw #
              </Typography>
              <Typography variant="body1" className="game-info-value">
                {game.draw_number}
              </Typography>
            </Grid>
          )}
        </Grid>
        
        <Box className="game-numbers">
          {game.numbers && game.numbers.length > 0 ? (
            game.numbers.map((number: number, index: number) => (
              <Box
                key={index}
                className={`number-ball ${getNumberColor(number, game.game)}`}
              >
                {number}
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary" className="pending">
              Pending
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box className="jamaica-lottery-results">
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={2} className="jamaica-header">
            <Typography variant="h4" component="h2" className="jamaica-title">
              🇯🇲 Jamaica Lottery Results
            </Typography>
            <Chip label="LIVE" color="success" size="small" />
          </Box>
          
          <Typography variant="body1" color="textSecondary" mb={2} className="jamaica-operator">
            Latest lottery results from the Jamaica Lottery Corporation
          </Typography>
          
          <Box display="flex" gap={2} flexWrap="wrap" className="jamaica-updated">
            <Typography variant="body2">
              <strong>Operator:</strong> {jamaicaData.operator}
            </Typography>
            <Typography variant="body2">
              <strong>Last Updated:</strong> {jamaicaData.lastUpdatedFormatted}
            </Typography>
            <Typography variant="body2">
              <strong>Total Games:</strong> {jamaicaData.games.length}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Display all games without grouping */}
      <Box>
        <Typography variant="h5" className="game-group-title" sx={{ mb: 2 }}>
          All Games ({jamaicaData.games.length})
        </Typography>
        {jamaicaData.games.map((game, index) => (
          <GameCard key={`${game.id}-${index}`} game={game} />
        ))}
      </Box>
    </Box>
  );
};

export default JamaicaLotteryResults;