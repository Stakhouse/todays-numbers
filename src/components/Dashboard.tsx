import React from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Fade,
} from '@mui/material';
import { useIsland } from '../context/IslandContext';
import LotteryCard from './cards/LotteryCard';
import SportsCard from './cards/SportsCard';
import CommodityCard from './cards/CommodityCard';
import HotelCard from './cards/HotelCard';
import EventsCard from './cards/EventsCard';

const Dashboard: React.FC = () => {
  const { currentIsland, isLoading } = useIsland();

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <Typography variant="h6" color="text.secondary">
            Loading island data...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
      <Fade in={!isLoading} timeout={500}>
        <Box>
          {/* Island Header */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                mb: 1,
                fontSize: { xs: '1.8rem', sm: '2.125rem' },
              }}
            >
              {currentIsland.flag} {currentIsland.name}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
            >
              Latest numbers, scores, and information
            </Typography>
          </Box>

          {/* Data Cards Grid */}
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {/* Lottery Numbers - Featured prominently */}
            <Grid item xs={12}>
              <LotteryCard islandId={currentIsland.id} />
            </Grid>

            {/* Sports Scores */}
            <Grid item xs={12} md={6}>
              <SportsCard islandId={currentIsland.id} />
            </Grid>

            {/* Commodity Prices */}
            <Grid item xs={12} md={6}>
              <CommodityCard islandId={currentIsland.id} />
            </Grid>

            {/* Hotel Rates */}
            <Grid item xs={12} md={6}>
              <HotelCard islandId={currentIsland.id} />
            </Grid>

            {/* Events & Tickets */}
            <Grid item xs={12} md={6}>
              <EventsCard islandId={currentIsland.id} />
            </Grid>
          </Grid>

          {/* Footer Info */}
          <Box sx={{ mt: 6, textAlign: 'center' }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: '0.8rem' }}
            >
              Data updates automatically • Last updated: {new Date().toLocaleTimeString()}
            </Typography>
          </Box>
        </Box>
      </Fade>
    </Container>
  );
};

export default Dashboard;