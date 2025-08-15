import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface SportsCardProps {
  islandId: string;
}

const mockSportsData: { [key: string]: any } = {
  'st-vincent': {
    'Cricket': 'SVG vs Grenada - 150/7',
    'Football': 'SVG vs Barbados - 2-1',
  },
  'st-lucia': {
    'Cricket': 'SLU vs Dominica - 200/5',
    'Basketball': 'SLU vs Antigua - 85-70',
  },
  'dominica': {
    'Cricket': 'DMA vs St. Lucia - 180/9',
    'Football': 'DMA vs Montserrat - 3-0',
  },
  'grenada': {
    'Cricket': 'GND vs St. Vincent - 140/8',
    'Athletics': 'Kirani James Invitational - Results Pending',
  },
  'trinidad': {
    'Cricket': 'T&T vs Jamaica - 250/4',
    'Football': 'T&T vs Guyana - 1-1',
  },
};

const SportsCard: React.FC<SportsCardProps> = ({ islandId }) => {
  const data = mockSportsData[islandId] || {};

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Sports Scores
        </Typography>
        {Object.keys(data).map((item) => (
          <Box key={item} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1">{item}</Typography>
            <Typography variant="body2">{data[item]}</Typography>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default SportsCard;