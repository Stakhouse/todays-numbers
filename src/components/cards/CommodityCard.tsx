import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface CommodityCardProps {
  islandId: string;
}

const mockCommodityData: { [key: string]: any } = {
  'st-vincent': {
    'Gasoline': '$15.50/gal',
    'Flour': '$8.25/bag',
  },
  'st-lucia': {
    'Sugar': '$5.00/kg',
    'Bananas': '$1.50/lb',
  },
  'dominica': {
    'Dasheen': '$3.00/lb',
    'Plantains': '$2.00/lb',
  },
  'grenada': {
    'Nutmeg': '$10.00/lb',
    'Mace': '$15.00/lb',
  },
  'trinidad': {
    'Natural Gas': '$2.50/MMBtu',
    'Methanol': '$300/tonne',
  },
};

const CommodityCard: React.FC<CommodityCardProps> = ({ islandId }) => {
  const data = mockCommodityData[islandId] || {};

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Commodity Prices
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

export default CommodityCard;