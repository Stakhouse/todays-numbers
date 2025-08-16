import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Alert,
} from '@mui/material';
import { Casino, History, TrendingUp, Refresh } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useIsland, ISLANDS } from '../../context/IslandContext';

const LotteryDetails: React.FC = () => {
  const { islandId } = useParams<{ islandId: string }>();
  const { currentIsland } = useIsland();
  
  // Use URL param if available, otherwise current island
  const island = islandId ? ISLANDS.find(i => i.id === islandId) || currentIsland : currentIsland;

  // Mock lottery data - in production this would come from API
  const currentDraw = {
    numbers: [7, 14, 23, 31, 42, 49],
    jackpot: '$2.5M',
    drawDate: new Date().toLocaleDateString(),
    winners: 3,
  };

  const recentDraws = [
    { date: '2024-01-14', numbers: [3, 17, 25, 33, 41, 48], jackpot: '$2.1M', winners: 2 },
    { date: '2024-01-13', numbers: [12, 19, 27, 35, 44, 47], jackpot: '$1.8M', winners: 1 },
    { date: '2024-01-12', numbers: [8, 16, 22, 29, 38, 46], jackpot: '$1.5M', winners: 0 },
    { date: '2024-01-11', numbers: [5, 13, 21, 34, 39, 45], jackpot: '$1.2M', winners: 4 },
    { date: '2024-01-10', numbers: [2, 11, 24, 32, 40, 43], jackpot: '$1.0M', winners: 1 },
  ];

  const statistics = {
    mostDrawn: [7, 14, 23, 31],
    leastDrawn: [1, 6, 11, 28],
    hotNumbers: [7, 14, 23],
    coldNumbers: [1, 6, 28],
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          {island.flag} {island.name} Lottery
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Complete lottery results and statistics
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Current Draw */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Casino sx={{ fontSize: 32, color: 'primary.main' }} />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Latest Draw
                </Typography>
                <Chip label="Live" color="success" size="small" />
              </Box>

              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {currentDraw.drawDate}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
                  {currentDraw.numbers.map((num, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        backgroundColor: 'primary.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        boxShadow: 2,
                      }}
                    >
                      {num}
                    </Box>
                  ))}
                </Box>
                <Typography variant="h4" color="secondary.main" sx={{ fontWeight: 700 }}>
                  {currentDraw.jackpot}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {currentDraw.winners} winner{currentDraw.winners !== 1 ? 's' : ''}
                </Typography>
              </Box>

              <Button 
                variant="outlined" 
                startIcon={<Refresh />} 
                fullWidth
                sx={{ mt: 2 }}
              >
                Check My Numbers
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Statistics */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <TrendingUp sx={{ fontSize: 32, color: 'info.main' }} />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Number Statistics
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                    🔥 Hot Numbers
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {statistics.hotNumbers.map((num) => (
                      <Chip key={num} label={num} color="error" size="small" />
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                    ❄️ Cold Numbers
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {statistics.coldNumbers.map((num) => (
                      <Chip key={num} label={num} color="info" size="small" />
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                    Most Drawn
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {statistics.mostDrawn.map((num) => (
                      <Chip key={num} label={num} variant="outlined" size="small" />
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                    Least Drawn
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {statistics.leastDrawn.map((num) => (
                      <Chip key={num} label={num} variant="outlined" color="secondary" size="small" />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Draws History */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <History sx={{ fontSize: 32, color: 'secondary.main' }} />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Recent Draws
                </Typography>
              </Box>

              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Winning Numbers</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Jackpot</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Winners</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentDraws.map((draw, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{draw.date}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {draw.numbers.map((num, numIndex) => (
                              <Box
                                key={numIndex}
                                sx={{
                                  width: 30,
                                  height: 30,
                                  borderRadius: '50%',
                                  backgroundColor: 'primary.light',
                                  color: 'primary.dark',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.875rem',
                                  fontWeight: 'bold',
                                }}
                              >
                                {num}
                              </Box>
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'secondary.main' }}>
                          {draw.jackpot}
                        </TableCell>
                        <TableCell>{draw.winners}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Info Alert */}
        <Grid item xs={12}>
          <Alert severity="info">
            <Typography variant="body2">
              <strong>Note:</strong> This is demo data. In production, this would show real lottery results 
              from {island.name}'s official lottery system with live updates and historical data.
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LotteryDetails;
