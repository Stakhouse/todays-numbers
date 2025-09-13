/**
 * All Islands Dashboard
 * Displays lottery data for all 11 Caribbean islands in a grid layout
 */
import React, { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Fade,
  Paper,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Button,
  ButtonGroup,
} from '@mui/material';
import { ViewModule, ViewList, Public, Refresh } from '@mui/icons-material';
import { ISLANDS } from '../context/IslandContext';
import LotteryCard from './cards/LotteryCard';
import { useLottery } from '../contexts/LotteryContext';

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
      id={`region-tabpanel-${index}`}
      aria-labelledby={`region-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const AllIslandsDashboard: React.FC = () => {
  const { state, actions } = useLottery();
  const [selectedRegion, setSelectedRegion] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'name' | 'population' | 'region'>('region');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Group islands by region
  const regions = [
    { name: 'All Islands', islands: ISLANDS },
    { name: 'Windward Islands', islands: ISLANDS.filter(i => i.region === 'Windward Islands') },
    { name: 'Leeward Islands', islands: ISLANDS.filter(i => i.region === 'Leeward Islands') },
    { name: 'Greater Antilles', islands: ISLANDS.filter(i => i.region === 'Greater Antilles') },
    { name: 'Lesser Antilles', islands: ISLANDS.filter(i => i.region === 'Lesser Antilles') },
    { name: 'Other Regions', islands: ISLANDS.filter(i => !['Windward Islands', 'Leeward Islands', 'Greater Antilles', 'Lesser Antilles'].includes(i.region)) }
  ];

  // Sort islands
  const sortedIslands = [...regions[selectedRegion].islands].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'population':
        return (b.population || 0) - (a.population || 0);
      case 'region':
        return a.region.localeCompare(b.region) || a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const handleRegionChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedRegion(newValue);
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSortBy(event.target.value as 'name' | 'population' | 'region');
  };

  const handleRefreshAll = async () => {
    await actions.refreshData();
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 4 } }}>
      <Fade in timeout={500}>
        <Box>
          {/* Header */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
              <Public sx={{ fontSize: 40, color: 'primary.main' }} />
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  fontSize: { xs: '2rem', sm: '3rem' },
                }}
              >
                Caribbean Lottery Numbers
              </Typography>
            </Box>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mb: 2, fontSize: { xs: '1rem', sm: '1.25rem' } }}
            >
              Live lottery results from all 11 Caribbean islands
            </Typography>
            
            {/* Status and Controls */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: 2,
              mb: 3
            }}>
              {state.backendConnected ? (
                <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  🟢 Live data connected
                  {state.lastUpdated && (
                    <span style={{ marginLeft: 8, color: 'text.secondary' }}>
                      • Updated {new Date(state.lastUpdated).toLocaleTimeString()}
                    </span>
                  )}
                </Typography>
              ) : (
                <Typography variant="body2" color="warning.main">
                  🟡 Using mock data - Backend unavailable
                </Typography>
              )}
              
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={handleRefreshAll}
                disabled={state.loading || state.refreshing}
                size="small"
              >
                {state.refreshing ? 'Refreshing...' : 'Refresh All'}
              </Button>
            </Box>
          </Box>

          {/* Region Tabs */}
          <Paper sx={{ mb: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={selectedRegion} 
                onChange={handleRegionChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="Caribbean regions"
              >
                {regions.map((region, index) => (
                  <Tab 
                    key={region.name}
                    label={`${region.name} (${region.islands.length})`}
                    id={`region-tab-${index}`}
                    aria-controls={`region-tabpanel-${index}`}
                  />
                ))}
              </Tabs>
            </Box>

            {/* Controls Bar */}
            <Box sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'stretch', sm: 'center' },
              justifyContent: 'space-between',
              gap: 2
            }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Sort by</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort by"
                  onChange={handleSortChange}
                >
                  <MenuItem value="region">Region</MenuItem>
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="population">Population</MenuItem>
                </Select>
              </FormControl>

              <ButtonGroup size="small" variant="outlined">
                <Button
                  onClick={() => setViewMode('grid')}
                  variant={viewMode === 'grid' ? 'contained' : 'outlined'}
                  startIcon={<ViewModule />}
                >
                  Grid
                </Button>
                <Button
                  onClick={() => setViewMode('list')}
                  variant={viewMode === 'list' ? 'contained' : 'outlined'}
                  startIcon={<ViewList />}
                >
                  List
                </Button>
              </ButtonGroup>
            </Box>
          </Paper>

          {/* Tab Panels */}
          {regions.map((region, index) => (
            <TabPanel key={region.name} value={selectedRegion} index={index}>
              <Grid container spacing={{ xs: 2, sm: 3, md: 3 }}>
                {sortedIslands.map((island) => (
                  <Grid 
                    item 
                    xs={12} 
                    sm={viewMode === 'list' ? 12 : 6} 
                    md={viewMode === 'list' ? 12 : 4} 
                    lg={viewMode === 'list' ? 12 : 3} 
                    key={island.id}
                  >
                    <Paper 
                      elevation={2} 
                      sx={{ 
                        p: 0, 
                        height: '100%', 
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          elevation: 4,
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      {/* Island Header */}
                      <Box sx={{ 
                        p: 2, 
                        pb: 1, 
                        background: `linear-gradient(135deg, ${island.region.includes('Windward') ? '#e3f2fd' : 
                                     island.region.includes('Leeward') ? '#f3e5f5' : 
                                     island.region.includes('Greater') ? '#e8f5e9' : 
                                     island.region.includes('Lesser') ? '#fff3e0' : '#f5f5f5'} 0%, #ffffff 100%)`
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="h4" sx={{ fontSize: '2rem' }}>
                              {island.flag}
                            </Typography>
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                                {island.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {island.region} • {island.currency}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        {island.population && (
                          <Typography variant="caption" color="text.secondary">
                            Population: {island.population.toLocaleString()}
                          </Typography>
                        )}
                      </Box>

                      {/* Lottery Data */}
                      <Box sx={{ px: 2, pb: 2 }}>
                        <LotteryCard islandId={island.id} maxGames={viewMode === 'list' ? 5 : 3} />
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              {sortedIslands.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h6" color="text.secondary">
                    No islands in this region
                  </Typography>
                </Box>
              )}
            </TabPanel>
          ))}

          {/* Footer */}
          <Box sx={{ mt: 6, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Showing lottery data from {ISLANDS.length} Caribbean islands and territories
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Data updates automatically every 5 minutes • Last updated: {new Date().toLocaleTimeString()}
            </Typography>
          </Box>
        </Box>
      </Fade>
    </Container>
  );
};

export default AllIslandsDashboard;
