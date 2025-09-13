import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Grid,
  Chip,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useTheme,
  useMediaQuery,
  Fade,
} from '@mui/material';
import {
  Casino,
  ShoppingCart,
  Hotel,
  Event,
  ExpandMore,
  Close,
  AttachMoney,
  Schedule,
  TrendingUp,
  Visibility,
} from '@mui/icons-material';
import { Island } from '../context/IslandContext';
import { useLottery } from '../contexts/LotteryContext';

interface ComprehensiveIslandCardProps {
  island: Island;
  isSelected?: boolean;
  onExpand?: (island: Island) => void;
}

interface MockData {
  hotels: Array<{
    name: string;
    rate: string;
    rating: number;
    type: string;
  }>;
  events: Array<{
    name: string;
    date: string;
    type: string;
    location: string;
    price?: string;
  }>;
  commodities: Array<{
    item: string;
    price: string;
    unit: string;
    change?: string;
  }>;
}

const ComprehensiveIslandCard: React.FC<ComprehensiveIslandCardProps> = ({
  island,
  isSelected = false,
  onExpand,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { state } = useLottery();
  const [modalOpen, setModalOpen] = useState(false);

  // Get lottery data for the island
  const islandData = state.islands[island.id];

  // Mock data for additional island information
  const getMockData = (islandId: string): MockData => {
    const mockData: { [key: string]: MockData } = {
      'jamaica': {
        hotels: [
          { name: 'Sandals Royal Caribbean', rate: '$450/night', rating: 5, type: 'All-Inclusive Resort' },
          { name: 'Half Moon Resort', rate: '$380/night', rating: 5, type: 'Luxury Resort' },
        ],
        events: [
          { name: 'Reggae Sumfest', date: 'July 15-20, 2024', type: 'Music Festival', location: 'Montego Bay', price: '$75' },
          { name: 'Kingston Jazz Festival', date: 'March 10-12, 2024', type: 'Jazz Festival', location: 'Kingston', price: '$45' },
        ],
        commodities: [
          { item: 'Rice (local)', price: '$2.50', unit: 'per lb', change: '+2%' },
          { item: 'Cooking Oil', price: '$4.20', unit: 'per liter', change: '-1%' },
          { item: 'Gasoline', price: '$5.45', unit: 'per liter', change: '+3%' },
        ],
      },
      'barbados': {
        hotels: [
          { name: 'Sandy Lane Resort', rate: '$800/night', rating: 5, type: 'Ultra-Luxury Resort' },
          { name: 'The Crane Resort', rate: '$350/night', rating: 4, type: 'Boutique Resort' },
        ],
        events: [
          { name: 'Crop Over Festival', date: 'July-August 2024', type: 'Cultural Festival', location: 'Island-wide', price: '$30' },
          { name: 'Barbados Food & Rum Festival', date: 'November 15-18, 2024', type: 'Food Festival', location: 'Bridgetown', price: '$60' },
        ],
        commodities: [
          { item: 'Rice (imported)', price: '$2.80', unit: 'per lb', change: '+3%' },
          { item: 'Cooking Oil', price: '$4.60', unit: 'per liter', change: '+2%' },
          { item: 'Gasoline', price: '$5.20', unit: 'per liter', change: '+2%' },
        ],
      },
      'st-vincent': {
        hotels: [
          { name: 'Buccament Bay Resort', rate: '$180/night', rating: 4, type: 'All-Inclusive Resort' },
          { name: 'Mariners Hotel', rate: '$90/night', rating: 3, type: 'Waterfront Hotel' },
        ],
        events: [
          { name: 'Vincy Mas Carnival', date: 'June 28 - July 9, 2024', type: 'Carnival', location: 'Kingstown', price: '$25' },
          { name: 'Nine Mornings Festival', date: 'December 16-24, 2024', type: 'Christmas Festival', location: 'Island-wide' },
        ],
        commodities: [
          { item: 'Rice', price: '$2.40', unit: 'per lb', change: '+1%' },
          { item: 'Cooking Oil', price: '$4.00', unit: 'per liter', change: '+2%' },
          { item: 'Dasheen', price: '$2.20', unit: 'per lb', change: '0%' },
        ],
      },
    };
    return mockData[islandId] || {
      hotels: [{ name: 'Local Hotel', rate: '$100/night', rating: 3, type: 'Standard Hotel' }],
      events: [{ name: 'Local Festival', date: 'TBD', type: 'Cultural Event', location: 'Island-wide' }],
      commodities: [{ item: 'Rice', price: '$2.50', unit: 'per lb', change: '0%' }],
    };
  };

  const mockData = getMockData(island.id);

  const handleCardClick = () => {
    setModalOpen(true);
    if (onExpand) {
      onExpand(island);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const formatCurrency = (amount: number) => {
    if (!amount) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      <Card
        sx={{
          height: '100%',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          background: isSelected 
            ? `linear-gradient(135deg, ${theme.palette.secondary.light}15 0%, ${theme.palette.primary.light}15 100%)`
            : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          border: isSelected 
            ? `2px solid ${theme.palette.secondary.main}`
            : '2px solid transparent',
          boxShadow: isSelected 
            ? `0 8px 32px rgba(255, 191, 0, 0.3)`
            : '0 4px 20px rgba(0,0,0,0.1)',
          transform: isSelected ? 'translateY(-4px)' : 'translateY(0)',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
            border: `2px solid ${theme.palette.primary.light}`,
          },
        }}
        onClick={handleCardClick}
      >
        <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Island Header */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 3,
            p: 2,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}20 0%, ${theme.palette.secondary.main}20 100%)`,
            borderRadius: 2,
            border: `1px solid ${theme.palette.primary.light}30`,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h2" sx={{ fontSize: '2rem' }}>
                {island.flag}
              </Typography>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.dark' }}>
                  {island.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                  {island.region} • {island.currency}
                </Typography>
              </Box>
            </Box>
            <Chip
              label={`${islandData?.total_games || 0} games`}
              color="primary"
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </Box>

          {/* Content Sections */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Lottery Section */}
            <Accordion defaultExpanded sx={{ boxShadow: 'none', border: '1px solid rgba(0,0,0,0.1)' }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Casino color="primary" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Lottery ({islandData?.games?.length || 0} games)
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {islandData?.games && islandData.games.length > 0 ? (
                  <Box>
                    {islandData.games.slice(0, 2).map((game, index) => (
                      <Box key={game.id || index} sx={{ mb: 1.5, p: 1, backgroundColor: 'grey.50', borderRadius: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {game.game}
                          </Typography>
                          {game.jackpotFormatted && (
                            <Typography variant="caption" sx={{ color: 'secondary.main', fontWeight: 700 }}>
                              {game.jackpotFormatted}
                            </Typography>
                          )}
                        </Box>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {game.numbers?.slice(0, 6).map((num, numIndex) => (
                            <Box
                              key={numIndex}
                              sx={{
                                width: 28,
                                height: 28,
                                borderRadius: '50%',
                                backgroundColor: 'secondary.main',
                                color: 'primary.dark',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                              }}
                            >
                              {num}
                            </Box>
                          )) || []}
                        </Box>
                      </Box>
                    ))}
                    {islandData.games.length > 2 && (
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                        +{islandData.games.length - 2} more games available
                      </Typography>
                    )}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No lottery data available
                  </Typography>
                )}
              </AccordionDetails>
            </Accordion>

            {/* Quick Info Sections */}
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center', p: 1, backgroundColor: 'grey.50', borderRadius: 1 }}>
                  <Hotel color="primary" sx={{ fontSize: 20, mb: 0.5 }} />
                  <Typography variant="caption" sx={{ display: 'block', fontWeight: 600 }}>
                    Hotels
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {mockData.hotels.length} options
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center', p: 1, backgroundColor: 'grey.50', borderRadius: 1 }}>
                  <Event color="primary" sx={{ fontSize: 20, mb: 0.5 }} />
                  <Typography variant="caption" sx={{ display: 'block', fontWeight: 600 }}>
                    Events
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {mockData.events.length} upcoming
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center', p: 1, backgroundColor: 'grey.50', borderRadius: 1 }}>
                  <ShoppingCart color="primary" sx={{ fontSize: 20, mb: 0.5 }} />
                  <Typography variant="caption" sx={{ display: 'block', fontWeight: 600 }}>
                    Prices
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {mockData.commodities.length} items
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Expand Button */}
            <Box sx={{ mt: 'auto', pt: 2 }}>
              <Button
                variant="outlined"
                endIcon={<Visibility />}
                fullWidth
                sx={{
                  borderColor: 'primary.light',
                  color: 'primary.main',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'primary.light',
                  },
                }}
              >
                View All Details
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Detailed Modal */}
      <Dialog
        open={modalOpen}
        onClose={handleModalClose}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '16px',
            maxHeight: '90vh',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h4">{island.flag}</Typography>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {island.name}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {island.region} • Pop: {island.population?.toLocaleString()}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={handleModalClose} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Lottery Games */}
            <Grid item xs={12}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Casino color="primary" />
                  All Lottery Games ({islandData?.games?.length || 0})
                </Typography>
                {islandData?.games && islandData.games.length > 0 ? (
                  <Grid container spacing={2}>
                    {islandData.games.map((game, index) => (
                      <Grid item xs={12} sm={6} key={game.id || index}>
                        <Card variant="outlined">
                          <CardContent sx={{ p: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                              {game.game}
                            </Typography>
                            {game.jackpotFormatted && (
                              <Typography variant="body2" sx={{ color: 'secondary.main', fontWeight: 600, mb: 1 }}>
                                {game.jackpotFormatted}
                              </Typography>
                            )}
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                              {game.numbers?.map((num, numIndex) => (
                                <Box
                                  key={numIndex}
                                  sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: '50%',
                                    backgroundColor: 'secondary.main',
                                    color: 'primary.dark',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.9rem',
                                    fontWeight: 'bold',
                                  }}
                                >
                                  {num}
                                </Box>
                              )) || []}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography color="text.secondary">No lottery data available</Typography>
                )}
              </Box>
            </Grid>

            {/* Hotels */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Hotel color="primary" />
                Hotels
              </Typography>
              <List dense>
                {mockData.hotels.map((hotel, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemText
                      primary={hotel.name}
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          <Chip label={hotel.rate} color="secondary" size="small" sx={{ mr: 0.5, fontWeight: 600 }} />
                          <Chip label={hotel.type} variant="outlined" size="small" />
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>

            {/* Events */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Event color="primary" />
                Events
              </Typography>
              <List dense>
                {mockData.events.map((event, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemText
                      primary={event.name}
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          <Typography variant="caption" display="block" color="text.secondary">
                            {event.date} • {event.location}
                          </Typography>
                          <Box sx={{ mt: 0.5 }}>
                            <Chip label={event.type} color="primary" variant="outlined" size="small" />
                            {event.price && (
                              <Chip label={event.price} color="secondary" size="small" sx={{ ml: 0.5, fontWeight: 600 }} />
                            )}
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>

            {/* Commodities */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <ShoppingCart color="primary" />
                Commodity Prices
              </Typography>
              <List dense>
                {mockData.commodities.map((commodity, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemText
                      primary={commodity.item}
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
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
                              icon={<TrendingUp sx={{ fontSize: '0.7rem' }} />}
                            />
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
          <Button onClick={handleModalClose} variant="outlined" size="large">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ComprehensiveIslandCard;