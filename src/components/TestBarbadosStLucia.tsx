import React from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';


const TestBarbadosStLucia: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Test Barbados and St. Lucia Lottery Games
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <LotteryCard islandId="barbados" maxGames={10} />
        </Grid>
        <Grid item xs={12} md={6}>
          <LotteryCard islandId="st-lucia" maxGames={10} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default TestBarbadosStLucia;