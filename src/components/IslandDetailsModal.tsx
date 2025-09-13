import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  IconButton,
  Chip,
  Tab,
  Tabs,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Skeleton,
  useTheme,
  useMediaQuery,
  Slide,
  Fade,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { styled } from '@mui/material/styles';
import {
  Close,
  Casino,
  Hotel,
  Event,
  ShoppingCart,
  Schedule,
  AttachMoney,
  TrendingUp,
  LocationOn,
  Info,
  SportsBaseball,
  Store,
} from '@mui/icons-material';
import { ISLANDS, Island } from '../context/IslandContext';
import LotteryCard from './cards/LotteryCard';
import SportsCard from './cards/SportsCard';
import CommodityCard from './cards/CommodityCard';
import HotelCard from './cards/HotelCard';
import EventsCard from './cards/EventsCard';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '20px',
    maxWidth: '95vw',
    maxHeight: '90vh',
    margin: theme.spacing(1),
    background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
  },
}));

const ModalHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: 'white',
  padding: theme.spacing(3),
  borderRadius: '20px 20px 0 0',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+Cjwvc3ZnPg==") repeat',
    opacity: 0.3,
  },
}));

const NumberBall = styled(Box)(({ theme }) => ({
  width: '35px',
  height: '35px',
  borderRadius: '50%',
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.primary.dark,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.9rem',
  fontWeight: 'bold',
  boxShadow: '0 2px 8px rgba(255, 191, 0, 0.4)',
  border: `2px solid ${theme.palette.background.paper}`,
  margin: '2px',
}));

const TabPanel = ({ children, value, index, ...other }: any) => (
  <Box
    role="tabpanel"
    hidden={value !== index}
    id={`island-tabpanel-${index}`}
    aria-labelledby={`island-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
  </Box>
);

const Transition = React.forwardRef<unknown, TransitionProps & { children: React.ReactElement<any, any> }>(
  (props, ref) => <Slide direction="up" ref={ref} {...props} />
);

interface LotteryGame {
  id: string;
  game: string;
  numbers: number[];
  draw_date?: string;
  draw_time?: string;
  draw_number?: string;
  jackpot?: number;
  jackpotFormatted?: string;
}

interface IslandData {
  id: string;
  island: string;
  displayName: string;
  operator: string;
  games: LotteryGame[];
  last_updated: string;
  lastUpdatedFormatted: string;
  total_games: number;
}

interface HotelData {
  name: string;
  rate: string;
  rating: number;
  type: string;
}

interface EventData {
  name: string;
  date: string;
  type: string;
  location: string;
  price?: string;
}

interface CommodityData {
  item: string;
  price: string;
  unit: string;
  change?: string;
}

interface IslandDetailsModalProps {
  open: boolean;
  onClose: () => void;
  islandId: string;
  islandData?: IslandData;
  isLoading?: boolean;
}

const IslandDetailsModal: React.FC<IslandDetailsModalProps> = ({ open, onClose, islandId, islandData, isLoading = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [tabValue, setTabValue] = useState(0);
  
  // Find the island data
  const island: Island | undefined = ISLANDS.find(i => i.id === islandId);
  
  if (!island) {
    return null;
  }

  // Mock data for additional island information
  const getMockHotelData = (islandId: string): HotelData[] => {
    const hotelData: { [key: string]: HotelData[] } = {
      'jamaica': [
        { name: 'Sandals Royal Caribbean', rate: '$450/night', rating: 5, type: 'All-Inclusive Resort' },
        { name: 'Half Moon Resort', rate: '$380/night', rating: 5, type: 'Luxury Resort' },
        { name: 'Spanish Court Hotel', rate: '$120/night', rating: 4, type: 'Business Hotel' },
        { name: 'Knutsford Court Hotel', rate: '$95/night', rating: 3, type: 'Budget Hotel' },
      ],
      'barbados': [
        { name: 'Sandy Lane Resort', rate: '$800/night', rating: 5, type: 'Ultra-Luxury Resort' },
        { name: 'The Crane Resort', rate: '$350/night', rating: 4, type: 'Boutique Resort' },
        { name: 'Hilton Barbados Resort', rate: '$280/night', rating: 4, type: 'Chain Hotel' },
        { name: 'Ocean Two Resort', rate: '$200/night', rating: 4, type: 'Beachfront Hotel' },
      ],
      'st-vincent': [
        { name: 'Buccament Bay Resort', rate: '$180/night', rating: 4, type: 'All-Inclusive Resort' },
        { name: 'Mariners Hotel', rate: '$90/night', rating: 3, type: 'Waterfront Hotel' },
        { name: 'Sunset Shores Beach Hotel', rate: '$110/night', rating: 3, type: 'Beach Hotel' },
      ],
    };
    return hotelData[islandId] || [];
  };

  const getMockEventData = (islandId: string): EventData[] => {
    const eventData: { [key: string]: EventData[] } = {
      'jamaica': [
        { name: 'Reggae Sumfest', date: 'July 15-20, 2024', type: 'Music Festival', location: 'Montego Bay', price: '$75' },
        { name: 'Kingston Jazz Festival', date: 'March 10-12, 2024', type: 'Jazz Festival', location: 'Kingston', price: '$45' },
        { name: 'Blue Mountain Coffee Festival', date: 'January 25-27, 2024', type: 'Cultural Event', location: 'Blue Mountains' },
        { name: 'Independence Day Celebration', date: 'August 6, 2024', type: 'National Holiday', location: 'Island-wide' },
      ],
      'barbados': [
        { name: 'Crop Over Festival', date: 'July-August 2024', type: 'Cultural Festival', location: 'Island-wide', price: '$30' },
        { name: 'Barbados Food & Rum Festival', date: 'November 15-18, 2024', type: 'Food Festival', location: 'Bridgetown', price: '$60' },
        { name: 'Jazz Festival', date: 'January 12-14, 2024', type: 'Music Festival', location: 'St. Lawrence Gap', price: '$55' },
      ],
      'st-vincent': [
        { name: 'Vincy Mas Carnival', date: 'June 28 - July 9, 2024', type: 'Carnival', location: 'Kingstown', price: '$25' },
        { name: 'Nine Mornings Festival', date: 'December 16-24, 2024', type: 'Christmas Festival', location: 'Island-wide' },
        { name: 'Breadfruit Festival', date: 'August 3-4, 2024', type: 'Food Festival', location: 'Kingstown' },
      ],
    };
    return eventData[islandId] || [];
  };

  const getMockCommodityData = (islandId: string): CommodityData[] => {
    const commodityData: { [key: string]: CommodityData[] } = {
      'jamaica': [
        { item: 'Rice (local)', price: '$2.50', unit: 'per lb', change: '+2%' },
        { item: 'Cooking Oil', price: '$4.20', unit: 'per liter', change: '-1%' },
        { item: 'Flour', price: '$1.80', unit: 'per lb', change: '+5%' },
        { item: 'Gasoline', price: '$5.45', unit: 'per liter', change: '+3%' },
        { item: 'Sugar', price: '$1.20', unit: 'per lb', change: '0%' },
        { item: 'Saltfish', price: '$8.50', unit: 'per lb', change: '+4%' },
      ],
      'barbados': [
        { item: 'Rice (imported)', price: '$2.80', unit: 'per lb', change: '+3%' },
        { item: 'Cooking Oil', price: '$4.60', unit: 'per liter', change: '+2%' },
        { item: 'Flour', price: '$2.10', unit: 'per lb', change: '+1%' },
        { item: 'Gasoline', price: '$5.20', unit: 'per liter', change: '+2%' },
        { item: 'Sugar', price: '$1.50', unit: 'per lb', change: '0%' },
      ],
      'st-vincent': [
        { item: 'Rice', price: '$2.40', unit: 'per lb', change: '+1%' },
        { item: 'Cooking Oil', price: '$4.00', unit: 'per liter', change: '+2%' },
        { item: 'Flour', price: '$1.70', unit: 'per lb', change: '+3%' },
        { item: 'Gasoline', price: '$4.95', unit: 'per liter', change: '+1%' },
        { item: 'Dasheen', price: '$2.20', unit: 'per lb', change: '0%' },
        { item: 'Plantain', price: '$1.80', unit: 'per lb', change: '-1%' },
      ],
    };
    return commodityData[islandId] || [];
  };

  const formatCurrency = (amount: number) => {
    if (!amount) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      keepMounted
      fullWidth
      maxWidth="md"
      aria-labelledby="island-details-title"
    >
      <ModalHeader>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h2" sx={{ fontSize: '3rem' }}>
              {island.flag}
            </Typography>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                {island.name}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500 }}>
                {island.region} • Pop: {island.population?.toLocaleString()}
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{
              color: 'white',
              backgroundColor: 'rgba(255,255,255,0.2)',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' },
            }}
            aria-label="Close dialog"
          >
            <Close />
          </IconButton>
        </Box>
      </ModalHeader>

      <DialogContent sx={{ p: 0 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant={isMobile ? 'scrollable' : 'fullWidth'}
          scrollButtons={isMobile ? 'auto' : false}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            px: 2,
            '& .MuiTab-root': {
              minHeight: 60,
              fontSize: '0.9rem',
              fontWeight: 600,
            },
          }}
        >
          <Tab
            icon={<Casino />}
            label="Lottery Games"
            iconPosition="start"
            aria-label="View lottery games"
          />
          <Tab
            icon={<Hotel />}
            label="Hotels"
            iconPosition="start"
            aria-label="View hotel rates"
          />
          <Tab
            icon={<Event />}
            label="Events"
            iconPosition="start"
            aria-label="View local events"
          />
          <Tab
            icon={<ShoppingCart />}
            label="Commodities"
            iconPosition="start"
            aria-label="View commodity prices"
          />
          <Tab
            icon={<SportsBaseball />}
            label="Sports"
            iconPosition="start"
            aria-label="View sports scores"
          />
        </Tabs>

        <Box sx={{ px: 3, pb: 2 }}>
          {/* Lottery Games Tab */}
          <TabPanel value={tabValue} index={0}>
            {isLoading ? (
              <Grid container spacing={2}>
                {[1, 2, 3, 4].map((item) => (
                  <Grid item xs={12} sm={6} key={item}>
                    <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2 }} />
                  </Grid>
                ))}
              </Grid>
            ) : islandData?.games && islandData.games.length > 0 ? (
              <Grid container spacing={2}>
                {islandData.games.map((game) => (
                  <Grid item xs={12} sm={6} key={game.id}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                          {game.game}
                        </Typography>
                        
                        {game.draw_date && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Schedule sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {new Date(game.draw_date).toLocaleDateString()}
                              {game.draw_time && ` • ${game.draw_time}`}
                            </Typography>
                          </Box>
                        )}

                        {(game.jackpot || game.jackpotFormatted) && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <AttachMoney sx={{ fontSize: '1rem', color: 'secondary.main' }} />
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 700, color: 'secondary.main' }}
                            >
                              {game.jackpotFormatted || formatCurrency(game.jackpot || 0)}
                            </Typography>
                          </Box>
                        )}

                        <Box sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 1,
                          justifyContent: 'center',
                          mt: 2
                        }}>
                          {game.numbers && game.numbers.length > 0 ? (
                            game.numbers.map((number, index) => (
                              <NumberBall key={index}>
                                {number}
                              </NumberBall>
                            ))
                          ) : (
                            <Typography 
                              variant="body2" 
                              sx={{ color: 'text.secondary', fontStyle: 'italic', py: 2 }}
                            >
                              Draw pending...
                            </Typography>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Casino sx={{ fontSize: '4rem', color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No lottery data available
                </Typography>
              </Box>
            )}
          </TabPanel>

          {/* Hotels Tab */}
          <TabPanel value={tabValue} index={1}>
            <List>
              {getMockHotelData(island.id).map((hotel, index) => (
                <Box key={index}>
                  <ListItem>
                    <ListItemIcon>
                      <Hotel color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={hotel.name}
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Chip
                            label={hotel.rate}
                            color="secondary"
                            size="small"
                            sx={{ mr: 1, fontWeight: 600 }}
                          />
                          <Chip
                            label={hotel.type}
                            variant="outlined"
                            size="small"
                            sx={{ mr: 1 }}
                          />
                          <Chip
                            label={`${hotel.rating} stars`}
                            color="primary"
                            variant="outlined"
                            size="small"
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < getMockHotelData(island.id).length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </TabPanel>

          {/* Events Tab */}
          <TabPanel value={tabValue} index={2}>
            <List>
              {getMockEventData(island.id).map((event, index) => (
                <Box key={index}>
                  <ListItem>
                    <ListItemIcon>
                      <Event color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={event.name}
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {event.date} • {event.location}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Chip
                              label={event.type}
                              color="primary"
                              size="small"
                              variant="outlined"
                            />
                            {event.price && (
                              <Chip
                                label={event.price}
                                color="secondary"
                                size="small"
                                sx={{ fontWeight: 600 }}
                              />
                            )}
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < getMockEventData(island.id).length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </TabPanel>

          {/* Commodities Tab */}
          <TabPanel value={tabValue} index={3}>
            <List>
              {getMockCommodityData(island.id).map((commodity, index) => (
                <Box key={index}>
                  <ListItem>
                    <ListItemIcon>
                      <ShoppingCart color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={commodity.item}
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                          <Chip
                            label={`${commodity.price} ${commodity.unit}`}
                            color="secondary"
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                          {commodity.change && (
                            <Chip
                              label={commodity.change}
                              size="small"
                              color={
                                commodity.change.startsWith('+') ? 'error' : 
                                commodity.change.startsWith('-') ? 'success' : 'default'
                              }
                              icon={<TrendingUp sx={{ fontSize: '0.8rem' }} />}
                            />
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < getMockCommodityData(island.id).length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </TabPanel>

          {/* Sports Tab */}
          <TabPanel value={tabValue} index={4}>
            <SportsCard islandId={islandId} />
          </TabPanel>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button onClick={onClose} variant="outlined" size="large">
          Close
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default IslandDetailsModal;