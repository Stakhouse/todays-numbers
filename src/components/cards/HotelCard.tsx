import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, CircularProgress, Chip, Rating } from '@mui/material';
import { Hotel } from '@mui/icons-material';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface HotelCardProps {
  islandId: string;
}

// Fallback mock data for when no real data exists
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
  const [hotelData, setHotelData] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for real-time hotel rates from Firestore
    const q = query(
      collection(db, 'hotel_rates'),
      where('islandId', '==', islandId),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc'),
      limit(8) // Get latest 8 hotel rates
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results: { [key: string]: any } = {};
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        const hotelName = data.hotelName || data.data?.hotel?.hotelName;
        const roomType = data.roomType || data.data?.hotel?.roomType;
        const pricePerNight = data.pricePerNight || data.data?.hotel?.pricePerNight;
        const currency = data.currency || data.data?.hotel?.currency || '$';
        const starRating = data.starRating || data.data?.hotel?.starRating;
        const availability = data.availability ?? data.data?.hotel?.availability ?? true;
        
        if (hotelName && pricePerNight) {
          const key = roomType ? `${hotelName} (${roomType})` : hotelName;
          results[key] = {
            price: `${currency}${pricePerNight}/night`,
            rating: starRating,
            available: availability
          };
        }
      });

      // If no real data, use mock data as fallback
      if (Object.keys(results).length === 0) {
        const mockData: { [key: string]: any } = {};
        const mock = mockHotelData[islandId] || {};
        Object.keys(mock).forEach(key => {
          mockData[key] = { 
            price: mock[key], 
            rating: null, 
            available: true 
          };
        });
        setHotelData(mockData);
      } else {
        setHotelData(results);
      }
      
      setLoading(false);
    }, (error) => {
      console.error('Error fetching hotel data:', error);
      // Fallback to mock data on error
      const mockData: { [key: string]: any } = {};
      const mock = mockHotelData[islandId] || {};
      Object.keys(mock).forEach(key => {
        mockData[key] = { 
          price: mock[key], 
          rating: null, 
          available: true 
        };
      });
      setHotelData(mockData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [islandId]);

  const data = hotelData;

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Hotel sx={{ color: 'info.main' }} />
          <Typography variant="h6" color="primary">
            Hotel Rates
          </Typography>
        </Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : Object.keys(data).length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            No hotel rates available
          </Typography>
        ) : (
          Object.keys(data).map((hotel) => (
            <Box key={hotel} sx={{ mb: 1.5, p: 1, backgroundColor: 'grey.50', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {hotel}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {data[hotel].rating && (
                      <Rating value={data[hotel].rating} size="small" readOnly />
                    )}
                    {!data[hotel].available && (
                      <Chip label="Unavailable" size="small" color="error" />
                    )}
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 500, color: 'info.dark' }}>
                  {data[hotel].price}
                </Typography>
              </Box>
            </Box>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default HotelCard;