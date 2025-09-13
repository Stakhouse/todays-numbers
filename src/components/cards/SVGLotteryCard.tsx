import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Tabs, Tab } from '@mui/material';
import './SVGLotteryCard.css';

interface SVGGameDraw {
  draw_date: string;
  draw_time: string;
  draw_number: string | null;
  numbers: number[];
}

interface SVGLotteryCardProps {
  game: {
    game: string;
    island: string;
    draws: SVGGameDraw[];
    jackpot?: string | number | null;
  };
}

const SVGLotteryCard: React.FC<SVGLotteryCardProps> = ({ game }) => {
  const [activeTab, setActiveTab] = React.useState(0);
  
  // For games with multiple draws (3D, Play 4)
  const isMultiDrawGame = game.game === '3D' || game.game === 'Play 4';
  
  // Format the date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get number color based on game type
  const getNumberColor = (number: number, gameType: string) => {
    if (gameType === 'Super 6') {
      if (number <= 15) return 'red';
      if (number <= 30) return 'blue';
      if (number <= 45) return 'green';
      return 'purple';
    } else if (gameType === 'Lotto') {
      if (number <= 10) return 'red';
      if (number <= 20) return 'blue';
      if (number <= 30) return 'green';
      return 'purple';
    } else {
      // For 3D and Play 4, use a simpler color scheme
      const colors = ['red', 'blue', 'green', 'orange', 'purple'];
      return colors[number % colors.length];
    }
  };

  // Get tab label based on draw time
  const getTabLabel = (drawTime: string) => {
    if (drawTime.toLowerCase().includes('night')) return 'Night';
    if (drawTime.toLowerCase().includes('day')) return 'Day';
    return drawTime;
  };

  return (
    <Card className="svg-lottery-card" sx={{ mb: 2 }}>
      <CardContent>
        {/* Game Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" component="h3" className="svg-game-title">
            {game.game}
          </Typography>
          {game.jackpot && (
            <Chip 
              label={typeof game.jackpot === 'number' 
                ? `EC$${game.jackpot.toLocaleString()}` 
                : game.jackpot} 
              className="svg-game-jackpot"
              size="small"
            />
          )}
        </Box>

        {/* Single Draw Game */}
        {!isMultiDrawGame ? (
          game.draws.length > 0 ? (
            <Box className="svg-game-content">
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2" className="svg-game-info">
                  <strong>Date:</strong> {formatDate(game.draws[0].draw_date)}
                </Typography>
                <Typography variant="body2" className="svg-game-info">
                  <strong>Time:</strong> {game.draws[0].draw_time}
                </Typography>
              </Box>
              
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="body2" className="svg-game-info">
                  <strong>Draw #:</strong> {game.draws[0].draw_number || 'N/A'}
                </Typography>
              </Box>
              
              <Box className="svg-game-numbers">
                {game.draws[0].numbers.map((number, index) => (
                  <Box
                    key={index}
                    className={`svg-number-ball ${getNumberColor(number, game.game)}`}
                  >
                    {number}
                  </Box>
                ))}
              </Box>
            </Box>
          ) : (
            <Typography variant="body2" color="textSecondary" className="svg-pending">
              Pending
            </Typography>
          )
        ) : (
          /* Multi Draw Game (3D, Play 4) */
          <Box className="svg-game-content">
            {game.draws.length > 0 ? (
              <>
                <Tabs 
                  value={activeTab} 
                  onChange={(e, newValue) => setActiveTab(newValue)}
                  variant="fullWidth"
                  className="svg-game-tabs"
                >
                  {game.draws.map((draw, index) => (
                    <Tab key={index} label={getTabLabel(draw.draw_time)} />
                  ))}
                </Tabs>
                
                {game.draws[activeTab] && (
                  <Box className="svg-game-tab-content">
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" className="svg-game-info">
                        <strong>Date:</strong> {formatDate(game.draws[activeTab].draw_date)}
                      </Typography>
                      <Typography variant="body2" className="svg-game-info">
                        <strong>Time:</strong> {game.draws[activeTab].draw_time}
                      </Typography>
                    </Box>
                    
                    <Box display="flex" justifyContent="space-between" mb={2}>
                      <Typography variant="body2" className="svg-game-info">
                        <strong>Draw #:</strong> {game.draws[activeTab].draw_number || 'N/A'}
                      </Typography>
                    </Box>
                    
                    <Box className="svg-game-numbers">
                      {game.draws[activeTab].numbers.map((number, index) => (
                        <Box
                          key={index}
                          className={`svg-number-ball ${getNumberColor(number, game.game)}`}
                        >
                          {number}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </>
            ) : (
              <Typography variant="body2" color="textSecondary" className="svg-pending">
                Pending
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default SVGLotteryCard;