import React from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';
import DebugSVGLotteryCard from '../cards/DebugSVGLotteryCard';

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

const SVGLotteryPage: React.FC = () => {
  // Log to verify we have the correct data
  console.log('SVG Lottery Page - Games data:', mockSVGData);
  console.log('SVG Lottery Page - Number of games:', mockSVGData.length);
  console.log('SVG Lottery Page - Game names:', mockSVGData.map(g => g.game));

  // Explicitly use only the mock data and filter to required games
  const gamesData = mockSVGData;
  
  const requiredGames = ["Super 6", "Lotto", "3D", "Play 4"];
  const filteredGames = gamesData.filter(game => 
    requiredGames.includes(game.game)
  );
  
  console.log('SVG Lottery Page - Filtered games:', filteredGames);
  console.log('SVG Lottery Page - Number of filtered games:', filteredGames.length);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          🇻🇨 St. Vincent & the Grenadines Lottery
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Today's Numbers
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Latest lottery results from SVG National Lottery
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {filteredGames.map((game, index) => (
          <Grid item xs={12} md={6} key={index}>
            <DebugSVGLotteryCard game={game} />
          </Grid>
        ))}
      </Grid>

      {filteredGames.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No lottery data available for St. Vincent & the Grenadines
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default SVGLotteryPage;