import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Tabs, 
  Tab, 
  Chip 
} from '@mui/material';

// Mock data as specified in the requirements - EXACTLY 4 GAMES with correct structure
const CORRECT_SVG_DATA = [
  {
    island: "St. Vincent & the Grenadines",
    game: "Super 6",
    draw_date: "2025-09-09",
    draw_time: "21:00",
    draw_number: "20250909-S6",
    numbers: [2, 9, 24, 31, 35, 16],
    jackpot: "EC$100,000"
  },
  {
    island: "St. Vincent & the Grenadines",
    game: "Lotto",
    draw_date: "2025-09-10",
    draw_time: "18:30",
    draw_number: "20250910-JF",
    numbers: [7, 11, 4, 2, 9],
    jackpot: "EC$50,000"
  },
  {
    island: "St. Vincent & the Grenadines",
    game: "3D",
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
    island: "St. Vincent & the Grenadines",
    game: "Play 4",
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

// Simple card component to display SVG lottery data
const SimpleSVGLotteryCard = ({ game }: { game: any }) => {
  console.log('Rendering game:', game.game);
  
  const [tabValue, setTabValue] = useState(0);
  
  // Handle tab change for multi-draw games
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // For multi-draw games (3D, Play 4), we need to handle them with tabs
  const isMultiDrawGame = game.game === "3D" || game.game === "Play 4";
  
  // Get the current draw data to display
  const currentDraw = isMultiDrawGame ? game.draws[tabValue] : game;
  
  return (
    <Card sx={{ mb: 2, border: '2px solid #00BFA6' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" component="h3" sx={{ color: '#00BFA6' }}>
            {game.game}
          </Typography>
          {game.jackpot && (
            <Chip 
              label={game.jackpot} 
              sx={{ 
                fontWeight: 'bold',
                backgroundColor: '#FFBF00',
                color: '#000'
              }}
              size="small"
            />
          )}
        </Box>
        
        {isMultiDrawGame ? (
          <>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              variant="fullWidth"
              sx={{ mb: 2 }}
            >
              <Tab label="Day" />
              <Tab label="Night" />
            </Tabs>
            
            <Box sx={{ mb: 2, p: 1, border: '1px dashed #ccc' }}>
              <Typography variant="body2"><strong>Date:</strong> {currentDraw.draw_date}</Typography>
              <Typography variant="body2"><strong>Time:</strong> {currentDraw.draw_time}</Typography>
              <Typography variant="body2"><strong>Draw #:</strong> {currentDraw.draw_number || 'N/A'}</Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                {currentDraw.numbers.map((num: number, numIndex: number) => (
                  <Box 
                    key={numIndex}
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      backgroundColor: '#00BFA6',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold'
                    }}
                  >
                    {num}
                  </Box>
                ))}
              </Box>
              {/* Note for multi-draw games that have multiple winners */}
              <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                Multiple winners with smaller cash prizes
              </Typography>
            </Box>
          </>
        ) : (
          <Box sx={{ mb: 2, p: 1, border: '1px dashed #ccc' }}>
            <Typography variant="body2"><strong>Date:</strong> {currentDraw.draw_date}</Typography>
            <Typography variant="body2"><strong>Time:</strong> {currentDraw.draw_time}</Typography>
            <Typography variant="body2"><strong>Draw #:</strong> {currentDraw.draw_number || 'N/A'}</Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
              {currentDraw.numbers.map((num: number, numIndex: number) => (
                <Box 
                  key={numIndex}
                  sx={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    backgroundColor: '#00BFA6',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                  }}
                >
                  {num}
                </Box>
              ))}
            </Box>
            {game.jackpot && (
              <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold', color: '#FFBF00' }}>
                Jackpot: {game.jackpot}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const NewSVGLotteryPage: React.FC = () => {
  console.log('NewSVGLotteryPage rendering with data:', CORRECT_SVG_DATA);
  console.log('Number of games:', CORRECT_SVG_DATA.length);
  
  // DOUBLE CHECK: Only use the first 4 items to ensure we never show more than 4
  const displayGames = CORRECT_SVG_DATA.slice(0, 4);
  
  console.log('Displaying games:', displayGames.map(g => g.game));
  
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
        <Typography variant="body2" color="error" sx={{ mt: 2, fontWeight: 'bold' }}>
          SHOWING EXACTLY {displayGames.length} GAMES
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {displayGames.map((game, index) => (
          <Grid item xs={12} md={6} key={index}>
            <SimpleSVGLotteryCard game={game} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default NewSVGLotteryPage;