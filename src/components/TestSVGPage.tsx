import React from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';
import SVGLotteryCard from './cards/SVGLotteryCard';

// Mock data as specified in the requirements
const mockSVGData = [
  {
    game: "Super 6",
    island: "St. Vincent & the Grenadines",
    draws: [
      {
        draw_date: "2025-09-09",
        draw_time: "21:00",
        draw_number: "20250909-S6",
        numbers: [2, 9, 24, 31, 35, 16]
      }
    ],
    jackpot: "EC$100,000"
  },
  {
    game: "Lotto",
    island: "St. Vincent & the Grenadines",
    draws: [
      {
        draw_date: "2025-09-10",
        draw_time: "18:30",
        draw_number: "20250910-JF",
        numbers: [7, 11, 4, 2, 9]
      }
    ],
    jackpot: null
  },
  {
    game: "3D",
    island: "St. Vincent & the Grenadines",
    draws: [
      {
        draw_date: "2025-09-11",
        draw_time: "Night",
        draw_number: "20250911-3D-N",
        numbers: [4, 8, 2]
      },
      {
        draw_date: "2025-09-11",
        draw_time: "Day",
        draw_number: "20250911-3D-D",
        numbers: [1, 5, 9]
      }
    ]
  },
  {
    game: "Play 4",
    island: "St. Vincent & the Grenadines",
    draws: [
      {
        draw_date: "2025-09-11",
        draw_time: "Night",
        draw_number: "20250911-P4-N",
        numbers: [2, 6, 4, 8]
      },
      {
        draw_date: "2025-09-11",
        draw_time: "Day",
        draw_number: "20250911-P4-D",
        numbers: [1, 3, 7, 5]
      }
    ]
  }
];

const TestSVGPage: React.FC = () => {
  console.log('TestSVGPage rendered with mock data:', mockSVGData);
  console.log('Number of games:', mockSVGData.length);
  console.log('Game names:', mockSVGData.map(g => g.game));
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          🧪 Test SVG Lottery Page
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Testing with mock data
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {mockSVGData.map((game, index) => (
          <Grid item xs={12} md={6} key={index}>
            <SVGLotteryCard game={game} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TestSVGPage;