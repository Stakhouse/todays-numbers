import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import TodaysNumbers from '../components/TodaysNumbers';

const TodaysNumbersPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Today's Numbers
        </Typography>
        <Typography variant="h6" component="p" gutterBottom align="center" color="text.secondary">
          Latest lottery results across the Caribbean
        </Typography>
        <TodaysNumbers />
      </Box>
    </Container>
  );
};

export default TodaysNumbersPage;