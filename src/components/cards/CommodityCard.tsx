import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, CircularProgress, Chip } from '@mui/material';
import { Store, TrendingUp, TrendingDown } from '@mui/icons-material';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface CommodityCardProps {
  islandId: string;
}

// Fallback mock data for when no real data exists
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
  const [commodityData, setCommodityData] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for real-time commodity prices from Firestore
    const q = query(
      collection(db, 'commodity_prices'),
      where('islandId', '==', islandId),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc'),
      limit(10) // Get latest 10 prices
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results: { [key: string]: any } = {};
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        const itemName = data.itemName || data.data?.commodity?.itemName;
        const price = data.price || data.data?.commodity?.price;
        const unit = data.unit || data.data?.commodity?.unit;
        const currency = data.currency || data.data?.commodity?.currency || '$';
        const priceChange = data.priceChange || data.data?.commodity?.priceChange;
        
        if (itemName && price) {
          const priceText = `${currency}${price}/${unit}`;
          results[itemName] = { 
            price: priceText,
            change: priceChange
          };
        }
      });

      // If no real data, use mock data as fallback
      if (Object.keys(results).length === 0) {
        const mockData: { [key: string]: any } = {};
        const mock = mockCommodityData[islandId] || {};
        Object.keys(mock).forEach(key => {
          mockData[key] = { price: mock[key], change: null };
        });
        setCommodityData(mockData);
      } else {
        setCommodityData(results);
      }
      
      setLoading(false);
    }, (error) => {
      console.error('Error fetching commodity data:', error);
      // Fallback to mock data on error
      const mockData: { [key: string]: any } = {};
      const mock = mockCommodityData[islandId] || {};
      Object.keys(mock).forEach(key => {
        mockData[key] = { price: mock[key], change: null };
      });
      setCommodityData(mockData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [islandId]);

  const data = commodityData;

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Store sx={{ color: 'success.main' }} />
          <Typography variant="h6" color="primary">
            Commodity Prices
          </Typography>
        </Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : Object.keys(data).length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            No commodity prices available
          </Typography>
        ) : (
          Object.keys(data).map((item) => (
            <Box key={item} sx={{ mb: 1.5, p: 1, backgroundColor: 'grey.50', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {item}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: 'success.dark' }}>
                    {data[item].price}
                  </Typography>
                  {data[item].change !== null && data[item].change !== undefined && (
                    <Chip
                      icon={data[item].change > 0 ? <TrendingUp /> : <TrendingDown />}
                      label={`${data[item].change > 0 ? '+' : ''}${data[item].change}%`}
                      size="small"
                      color={data[item].change > 0 ? 'error' : 'success'}
                      sx={{ height: 20, '& .MuiChip-label': { fontSize: '0.7rem' } }}
                    />
                  )}
                </Box>
              </Box>
            </Box>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default CommodityCard;