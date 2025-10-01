import React from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';


const TestNewIslands: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Test New Islands - Dominica and Antigua & Barbuda
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        This page tests the newly implemented lottery games for Dominica and Antigua & Barbuda.
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Typography variant="h5" component="h2" gutterBottom>
            Dominica Lottery Games
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <LotteryCard islandId="dominica" maxGames={10} />
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
            Antigua & Barbuda Lottery Games
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <LotteryCard islandId="antigua" maxGames={10} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default TestNewIslands;