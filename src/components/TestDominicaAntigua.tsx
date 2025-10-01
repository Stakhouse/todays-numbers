import React from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';


const TestDominicaAntigua: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Test Dominica and Antigua & Barbuda Lottery Games
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <LotteryCard islandId="dominica" maxGames={10} />
        </Grid>
        <Grid item xs={12} md={6}>
          <LotteryCard islandId="antigua" maxGames={10} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default TestDominicaAntigua;