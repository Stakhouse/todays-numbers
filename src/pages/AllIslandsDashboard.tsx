import React from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';
import { useIsland } from '../context/IslandContext';
import LotteryCard from '../components/cards/LotteryCard';
import SportsCard from '../components/cards/SportsCard';
import CommodityCard from '../components/cards/CommodityCard';
import HotelCard from '../components/cards/HotelCard';
import EventsCard from '../components/cards/EventsCard';

const AllIslandsDashboard: React.FC = () => {
  const { islands } = useIsland();

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          All Islands Dashboard
        </Typography>
        <Typography variant="h6" component="p" gutterBottom align="center" color="text.secondary">
          Comprehensive view across all Caribbean islands
        </Typography>
        
        {islands.map((island) => (
          <Box key={island.id} sx={{ mb: 6 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              {island.flag} {island.name}
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={4}>
                <LotteryCard islandId={island.id} />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <SportsCard islandId={island.id} />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <CommodityCard islandId={island.id} />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <HotelCard islandId={island.id} />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <EventsCard islandId={island.id} />
              </Grid>
            </Grid>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default AllIslandsDashboard;