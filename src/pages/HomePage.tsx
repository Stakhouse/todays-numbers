import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import Dashboard from '../components/Dashboard';

const HomePage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Today's Numbers
        </Typography>
        <Typography variant="h6" component="p" gutterBottom align="center" color="text.secondary">
          Your Caribbean lottery and data hub
        </Typography>
        <Dashboard />
      </Box>
    </Container>
  );
};

export default HomePage;