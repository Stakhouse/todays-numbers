import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface SVGGameDraw {
  draw_date: string;
  draw_time: string;
  draw_number: string | null;
  numbers: number[];
}

interface DebugSVGLotteryCardProps {
  game: {
    game: string;
    island: string;
    draws: SVGGameDraw[];
    jackpot?: string | number | null;
  };
}

const DebugSVGLotteryCard: React.FC<DebugSVGLotteryCardProps> = ({ game }) => {
  console.log('DebugSVGLotteryCard received game data:', game);
  
  return (
    <Card sx={{ mb: 2, p: 2, border: '2px solid red' }}>
      <CardContent>
        <Typography variant="h6" component="h3" sx={{ color: 'red' }}>
          DEBUG CARD
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography><strong>Game:</strong> {game.game}</Typography>
          <Typography><strong>Island:</strong> {game.island}</Typography>
          <Typography><strong>Number of Draws:</strong> {game.draws.length}</Typography>
          <Typography><strong>Jackpot:</strong> {game.jackpot?.toString() || 'null'}</Typography>
          
          {game.draws.map((draw, index) => (
            <Box key={index} sx={{ mt: 2, p: 1, border: '1px dashed gray' }}>
              <Typography variant="subtitle2">Draw {index + 1}:</Typography>
              <Typography><strong>Date:</strong> {draw.draw_date}</Typography>
              <Typography><strong>Time:</strong> {draw.draw_time}</Typography>
              <Typography><strong>Number:</strong> {draw.draw_number || 'null'}</Typography>
              <Typography><strong>Numbers:</strong> {draw.numbers.join(', ')}</Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default DebugSVGLotteryCard;