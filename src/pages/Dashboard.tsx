import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import Dashboard from '../components/Dashboard';

const DashboardPage: React.FC = () => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Caribbean Dashboard
        </Typography>
        <Typography variant="h6" component="p" gutterBottom align="center" color="text.secondary">
          Your comprehensive view of Caribbean data
        </Typography>
        <Dashboard />
      </Box>
    </Container>
  );
};

export default DashboardPage;