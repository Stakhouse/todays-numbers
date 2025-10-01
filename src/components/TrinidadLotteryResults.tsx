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

interface TrinidadLotteryResultsProps {
  islandId?: string;
}

const TrinidadLotteryResults: React.FC<TrinidadLotteryResultsProps> = ({ islandId = 'trinidad' }) => {
  const { state } = useLottery();
  const { islands } = state;
  
  const trinidadData = islands[islandId];
  
  if (!trinidadData) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" color="textSecondary">
            No data available for Trinidad & Tobago
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
    } else if (gameType && gameType.toLowerCase().includes('cash')) {
      if (number <= 10) return 'orange';
      if (number <= 20) return 'blue';
      return 'green';
    } else if (gameType && gameType.toLowerCase().includes('win')) {
      if (number <= 10) return 'red';
      if (number <= 20) return 'blue';
      if (number <= 30) return 'green';
      return 'purple';
    }
    return 'blue';
  };

  const GameCard: React.FC<{ game: any }> = ({ game }) => (
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
        
        <Grid container spacing={1} mb={1}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Date
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {game.draw_date ? new Date(game.draw_date).toLocaleDateString() : 'Pending'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Time
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {game.draw_time || 'Pending'}
            </Typography>
          </Grid>
          {game.draw_number && (
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Draw #
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {game.draw_number}
              </Typography>
            </Grid>
          )}
        </Grid>
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
          {game.numbers && game.numbers.length > 0 ? (
            game.numbers.map((number: number, index: number) => (
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
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Card sx={{ mb: 3, backgroundColor: '#F5F5F5' }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 700, color: '#006241' }}>
              🇹🇹 Trinidad & Tobago Lottery
            </Typography>
            <Chip label="LIVE" color="success" size="small" />
          </Box>
          
          <Typography variant="body1" color="textSecondary" mb={2}>
            Latest lottery results from Trinidad & Tobago Lottery Corporation
          </Typography>
          
          <Box display="flex" gap={2} flexWrap="wrap">
            <Typography variant="body2">
              <strong>Operator:</strong> {trinidadData.operator}
            </Typography>
            <Typography variant="body2">
              <strong>Last Updated:</strong> {trinidadData.lastUpdatedFormatted}
            </Typography>
            <Typography variant="body2">
              <strong>Total Games:</strong> {trinidadData.games.length}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Display all games */}
      <Box>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#006241' }}>
          All Games ({trinidadData.games.length})
        </Typography>
        {trinidadData.games.map((game, index) => (
          <GameCard key={`${game.id}-${index}`} game={game} />
        ))}
      </Box>
    </Box>
  );
};

export default TrinidadLotteryResults;