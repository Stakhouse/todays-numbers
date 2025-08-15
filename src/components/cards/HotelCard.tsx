import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface HotelCardProps {
  islandId: string;
}

const mockHotelData: { [key: string]: any } = {
  'st-vincent': {
    'Sunset Shores': '$250/night',
    'Young Island Resort': '$450/night',
  },
  'st-lucia': {
    'Jade Mountain': '$1200/night',
    'Sandals Grande': '$800/night',
  },
  'dominica': {
    'Fort Young Hotel': '$200/night',
    'Secret Bay': '$1500/night',
  },
  'grenada': {
    'Spice Island Beach Resort': '$1000/night',
    'Radisson Grenada': '$300/night',
  },
  'trinidad': {
    'Hyatt Regency': '$400/night',
    'Hilton Trinidad': '$350/night',
  },
};

const HotelCard: React.FC<HotelCardProps> = ({ islandId }) => {
  const data = mockHotelData[islandId] || {};

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Hotel Prices
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

export default HotelCard;