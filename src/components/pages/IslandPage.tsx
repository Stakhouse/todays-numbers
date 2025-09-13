/**
 * Individual Island Page
 * Comprehensive page showing all lottery data and information for a specific Caribbean island
 */
import React, { useState, useEffect } from 'react';
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
  Tabs,
  Tab,
  Breadcrumbs,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Casino,
  History,
  TrendingUp,
  Refresh,
  Share,
  Info,
  Public,
  Schedule,
  AttachMoney,
  Language,
  Home,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { ISLANDS } from '../../context/IslandContext';
import { useLottery } from '../../contexts/LotteryContext';
import LotteryCard from '../cards/LotteryCard';
import SportsCard from '../cards/SportsCard';
import CommodityCard from '../cards/CommodityCard';
import HotelCard from '../cards/HotelCard';
import EventsCard from '../cards/EventsCard';
import JamaicaLotteryResults from '../JamaicaLotteryResults';
import SVGLotteryResults from '../SVGLotteryResults';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`island-tabpanel-${index}`}
      aria-labelledby={`island-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const IslandPage: React.FC = () => {
  const { islandId } = useParams<{ islandId: string }>();
  const navigate = useNavigate();
  const { state, actions } = useLottery();
  const [currentTab, setCurrentTab] = useState(0);
  
  // Find the island
  const island = ISLANDS.find(i => i.id === islandId);
  const islandData = state.islands[islandId || ''];

  // Redirect to home if island not found
  useEffect(() => {
    if (!island) {
      navigate('/');
    }
  }, [island, navigate]);

  if (!island) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error">
          Island not found
        </Typography>
        <Button onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Return Home
        </Button>
      </Container>
    );
  }

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${island.name} - Today's Numbers`,
          text: `Check out the latest lottery results for ${island.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleRefresh = async () => {
    if (islandId) {
      await actions.fetchIslandData(islandId);
    }
  };

  // Mock data for demonstration - in production this would come from the lottery API
  const mockCurrentDraw = {
    numbers: islandData?.games?.[0]?.numbers || [7, 14, 23, 31, 42, 49],
    jackpot: islandData?.games?.[0]?.jackpotFormatted || '$2.5M',
    drawDate: islandData?.games?.[0]?.drawDateFormatted || new Date().toLocaleDateString(),
    game: islandData?.games?.[0]?.game || 'Lotto',
    winners: Math.floor(Math.random() * 5),
  };

  const mockRecentDraws = Array.from({ length: 10 }, (_, i) => ({
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
    numbers: Array.from({ length: 6 }, () => Math.floor(Math.random() * 49) + 1),
    jackpot: `$${(Math.random() * 3 + 1).toFixed(1)}M`,
    winners: Math.floor(Math.random() * 5),
  }));

  const mockStatistics = {
    hotNumbers: [7, 14, 23],
    coldNumbers: [1, 6, 28],
    mostDrawn: [7, 14, 23, 31],
    leastDrawn: [1, 6, 11, 28],
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 4 } }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link
          underline="hover"
          color="inherit"
          onClick={() => navigate('/')}
          sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          <Home sx={{ fontSize: 16 }} />
          Home
        </Link>
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {island.flag} {island.name}
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Paper 
        sx={{ 
          p: 4, 
          mb: 4, 
          background: `linear-gradient(135deg, 
            ${island.region.includes('Windward') ? '#e3f2fd' : 
              island.region.includes('Leeward') ? '#f3e5f5' : 
              island.region.includes('Greater') ? '#e8f5e9' : 
              island.region.includes('Lesser') ? '#fff3e0' : '#f5f5f5'} 0%, #ffffff 100%)`,
          borderRadius: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h1" sx={{ fontSize: '4rem' }}>
              {island.flag}
            </Typography>
            <Box>
              <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 0.5 }}>
                {island.name}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {island.region} • Population: {island.population?.toLocaleString()}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Share this page">
              <IconButton onClick={handleShare} color="primary">
                <Share />
              </IconButton>
            </Tooltip>
            <Tooltip title="Refresh data">
              <IconButton onClick={handleRefresh} color="primary" disabled={state.refreshing}>
                <Refresh sx={{ 
                  animation: state.refreshing ? 'spin 1s linear infinite' : 'none',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                  }
                }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Quick Info */}
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <AttachMoney sx={{ fontSize: 24, color: 'success.main' }} />
              <Typography variant="body2" color="text.secondary">Currency</Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{island.currency}</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Schedule sx={{ fontSize: 24, color: 'info.main' }} />
              <Typography variant="body2" color="text.secondary">Timezone</Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {island.timezone.split('/')[1]?.replace('_', ' ')}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Language sx={{ fontSize: 24, color: 'warning.main' }} />
              <Typography variant="body2" color="text.secondary">Country Code</Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{island.country_code}</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Public sx={{ fontSize: 24, color: 'secondary.main' }} />
              <Typography variant="body2" color="text.secondary">Region</Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{island.region}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs Navigation */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<Casino />} label="Lottery" />
          <Tab icon={<History />} label="History" />
          <Tab icon={<TrendingUp />} label="Statistics" />
          <Tab icon={<Info />} label="All Data" />
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      <TabPanel value={currentTab} index={0}>
        {/* Current Lottery Results */}
        {islandId === 'jamaica' ? (
          // Use specialized Jamaica component
          <JamaicaLotteryResults islandId={islandId} />
        ) : islandId === 'st-vincent' ? (
          // Use specialized SVG component
          <SVGLotteryResults islandId={islandId} />
        ) : (
          // Use existing generic display for other islands
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Casino sx={{ fontSize: 32, color: 'primary.main' }} />
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      Latest Draw - {mockCurrentDraw.game}
                    </Typography>
                    <Chip label="Live" color="success" size="small" />
                  </Box>

                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {mockCurrentDraw.drawDate}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
                      {mockCurrentDraw.numbers.map((num, index) => (
                        <Box
                          key={index}
                          sx={{
                            width: { xs: 40, sm: 50 },
                            height: { xs: 40, sm: 50 },
                            borderRadius: '50%',
                            backgroundColor: 'primary.main',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: { xs: '1rem', sm: '1.2rem' },
                            fontWeight: 'bold',
                            boxShadow: 2,
                          }}
                        >
                          {num}
                        </Box>
                      ))}
                    </Box>
                    <Typography variant="h4" color="secondary.main" sx={{ fontWeight: 700 }}>
                      {mockCurrentDraw.jackpot}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {mockCurrentDraw.winners} winner{mockCurrentDraw.winners !== 1 ? 's' : ''}
                    </Typography>
                  </Box>

                  <Button 
                    variant="outlined" 
                    startIcon={<Casino />} 
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    Check My Numbers
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Quick Stats</Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon><TrendingUp /></ListItemIcon>
                        <ListItemText 
                          primary="Games Available" 
                          secondary={islandData?.games?.length || 'Loading...'} 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><Schedule /></ListItemIcon>
                        <ListItemText 
                          primary="Last Updated" 
                          secondary={islandData?.lastUpdatedFormatted || 'Loading...'} 
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        )}
      </TabPanel>

      <TabPanel value={currentTab} index={1}>
        {/* Historical Data */}
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Recent Draws History
            </Typography>
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
                  {mockRecentDraws.map((draw, index) => (
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
      </TabPanel>

      <TabPanel value={currentTab} index={2}>
        {/* Statistics */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  🔥 Hot Numbers (Most Frequent)
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                  {mockStatistics.hotNumbers.map((num) => (
                    <Chip key={num} label={num} color="error" size="medium" />
                  ))}
                </Box>
                
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  ❄️ Cold Numbers (Least Frequent)
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {mockStatistics.coldNumbers.map((num) => (
                    <Chip key={num} label={num} color="info" size="medium" />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  📊 Draw Analysis
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Most Drawn Numbers
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    {mockStatistics.mostDrawn.map((num) => (
                      <Chip key={num} label={num} variant="outlined" size="small" />
                    ))}
                  </Box>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Least Drawn Numbers
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {mockStatistics.leastDrawn.map((num) => (
                      <Chip key={num} label={num} variant="outlined" color="secondary" size="small" />
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={currentTab} index={3}>
        {/* All Data Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <LotteryCard islandId={island.id} maxGames={5} />
          </Grid>
          <Grid item xs={12} lg={6}>
            <SportsCard islandId={island.id} />
          </Grid>
          <Grid item xs={12} lg={6}>
            <CommodityCard islandId={island.id} />
          </Grid>
          <Grid item xs={12} lg={6}>
            <HotelCard islandId={island.id} />
          </Grid>
          <Grid item xs={12}>
            <EventsCard islandId={island.id} />
          </Grid>
        </Grid>
      </TabPanel>

      {/* Data Status Alert */}
      <Alert 
        severity={state.backendConnected ? "info" : "warning"} 
        sx={{ mt: 3 }}
      >
        <Typography variant="body2">
          {state.backendConnected ? (
            <>
              <strong>Live Data:</strong> Real-time lottery results from {island.name}.
              Last updated: {state.lastUpdated ? new Date(state.lastUpdated).toLocaleString() : 'Unknown'}
            </>
          ) : (
            <>
              <strong>Demo Mode:</strong> Using sample data. Real lottery results will be available when connected to the backend service.
            </>
          )}
        </Typography>
      </Alert>
    </Container>
  );
};

export default IslandPage;
