import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import JamaicaLotteryResults from '../components/JamaicaLotteryResults';

const JamaicaLotteryResultsPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Jamaica Lottery Results
        </Typography>
        <Typography variant="h6" component="p" gutterBottom align="center" color="text.secondary">
          Latest results from Jamaica's lottery games
        </Typography>
        <JamaicaLotteryResults />
      </Box>
    </Container>
  );
};

export default JamaicaLotteryResultsPage;