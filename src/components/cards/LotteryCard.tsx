import React from 'react';
import { Card, CardContent, Typography, Box, Grid, Button } from '@mui/material';
import { Casino, ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface LotteryCardProps {
  islandId: string;
}

const mockLotteryData: { [key: string]: any } = {
  'st-vincent': {
    'Lotto 6/42': [5, 12, 23, 31, 38, 42],
    'Super 6': [1, 9, 15, 22, 28, 36],
  },
  'st-lucia': {
    'Double Daily Grand': [10, 20, 30, 40, 50],
    'Big 4': [1, 2, 3, 4],
  },
  'dominica': {
    'Powerball': [8, 16, 24, 32, 40],
    'Play 4': [9, 8, 7, 6],
  },
  'grenada': {
    'Lotto': [3, 13, 21, 29, 35, 41],
    'Daily Pick 3': [7, 7, 7],
  },
  'trinidad': {
    'Lotto Plus': [4, 14, 19, 25, 30, 33],
    'Cash Pot': [2, 11, 22],
  },
};

const LotteryCard: React.FC<LotteryCardProps> = ({ islandId }) => {
  const data = mockLotteryData[islandId] || {};
  const navigate = useNavigate();

  return (
    <Card 
      sx={{ 
        backgroundColor: '#FFF8E1',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        },
      }}
      onClick={() => navigate(`/lottery/${islandId}`)}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Casino sx={{ color: 'primary.main' }} />
          <Typography variant="h6" color="primary">
            Lottery Numbers
          </Typography>
        </Box>
        {Object.keys(data).map((game) => (
          <Box key={game} sx={{ mb: 2 }}>
            <Typography variant="subtitle1" component="div">
              {game}
            </Typography>
            <Grid container spacing={1}>
              {data[game].map((num: number) => (
                <Grid item key={num}>
                  <Box
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '1.5rem',
                      color: '#FFBF00',
                      border: '1px solid #FFBF00',
                      borderRadius: '8px',
                      padding: '4px 8px',
                      minWidth: '40px',
                      textAlign: 'center',
                    }}
                  >
                    {num}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
        
        <Button
          variant="outlined"
          endIcon={<ArrowForward />}
          size="small"
          sx={{ mt: 2 }}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/lottery/${islandId}`);
          }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default LotteryCard;