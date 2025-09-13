import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, CircularProgress, Chip } from '@mui/material';
import { SportsBaseball } from '@mui/icons-material';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface SportsCardProps {
  islandId: string;
}

// Fallback mock data for when no real data exists
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
  const [sportsData, setSportsData] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for real-time sports scores from Firestore
    const q = query(
      collection(db, 'sports_scores'),
      where('islandId', '==', islandId),
      where('isActive', '==', true),
      orderBy('gameDate', 'desc'),
      limit(5) // Get latest 5 scores
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results: { [key: string]: any } = {};
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        const league = data.league || data.data?.sports?.league || 'Unknown';
        const teams = data.teams || data.data?.sports?.teams || [];
        const score = data.score || data.data?.sports?.score;
        const status = data.status || data.data?.sports?.status || 'finished';
        
        if (teams.length >= 2) {
          const displayText = score 
            ? `${teams.join(' vs ')} - ${score}`
            : `${teams.join(' vs ')} - ${status}`;
          results[league] = displayText;
        }
      });

      // If no real data, use mock data as fallback
      if (Object.keys(results).length === 0) {
        setSportsData(mockSportsData[islandId] || {});
      } else {
        setSportsData(results);
      }
      
      setLoading(false);
    }, (error) => {
      console.error('Error fetching sports data:', error);
      // Fallback to mock data on error
      setSportsData(mockSportsData[islandId] || {});
      setLoading(false);
    });

    return () => unsubscribe();
  }, [islandId]);

  const data = sportsData;

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <SportsBaseball sx={{ color: 'error.main' }} />
          <Typography variant="h6" color="primary">
            Sports Scores
          </Typography>
        </Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : Object.keys(data).length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            No sports scores available
          </Typography>
        ) : (
          Object.keys(data).map((sport) => (
            <Box key={sport} sx={{ mb: 1.5, p: 1, backgroundColor: 'grey.50', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                <Box sx={{ flex: 1 }}>
                  <Chip label={sport} size="small" color="error" sx={{ mb: 0.5 }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {data[sport]}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default SportsCard;