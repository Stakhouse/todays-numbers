import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  LocationOn,
  TrendingUp,
  Schedule,
  Security,
  Devices,
  Public,
} from '@mui/icons-material';

const About: React.FC = () => {
  const features = [
    {
      icon: LocationOn,
      title: 'Caribbean Coverage',
      description: 'Comprehensive data from all major Caribbean islands including Jamaica, Barbados, Trinidad & Tobago, and more.',
    },
    {
      icon: TrendingUp,
      title: 'Real-Time Updates',
      description: 'Get the latest lottery numbers, sports scores, commodity prices, and hotel rates as they happen.',
    },
    {
      icon: Schedule,
      title: 'Daily Fresh Data',
      description: 'Our platform is updated daily with the most current information to keep you informed.',
    },
    {
      icon: Security,
      title: 'Reliable & Secure',
      description: 'Built with modern security practices and reliable infrastructure to ensure data accuracy.',
    },
    {
      icon: Devices,
      title: 'Mobile Friendly',
      description: 'Access your data from any device - desktop, tablet, or mobile with our responsive design.',
    },
    {
      icon: Public,
      title: 'Community Focused',
      description: 'Designed specifically for Caribbean communities with local insights and cultural understanding.',
    },
  ];

  const islands = [
    { name: 'Jamaica', flag: '🇯🇲', description: 'Lottery, sports, commodities, hotels' },
    { name: 'Barbados', flag: '🇧🇧', description: 'Tourism, events, local prices' },
    { name: 'Trinidad & Tobago', flag: '🇹🇹', description: 'Energy sector, carnival events' },
    { name: 'Bahamas', flag: '🇧🇸', description: 'Resort rates, fishing reports' },
    { name: 'Antigua & Barbuda', flag: '🇦🇬', description: 'Sailing, tourism data' },
    { name: 'St. Lucia', flag: '🇱🇨', description: 'Hotel rates, cultural events' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 6 } }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
          }}
        >
          About Today's Numbers
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            maxWidth: 800,
            mx: 'auto',
            fontSize: { xs: '1rem', sm: '1.25rem' },
            lineHeight: 1.6,
          }}
        >
          Your trusted source for Caribbean data - bringing together lottery numbers, sports scores, 
          commodity prices, hotel rates, and local events from across the Caribbean islands.
        </Typography>
      </Box>

      {/* Mission Statement */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 4, 
          mb: 6, 
          backgroundColor: 'primary.light',
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" gutterBottom color="primary.dark" sx={{ fontWeight: 600 }}>
          🏝️ Our Mission
        </Typography>
        <Typography variant="body1" color="primary.dark" sx={{ lineHeight: 1.7 }}>
          To create the Caribbean's most comprehensive and reliable data hub, connecting communities 
          across the islands with the information they need daily. From lottery enthusiasts to 
          business travelers, from local residents to tourists - we serve everyone who needs 
          current, accurate Caribbean data.
        </Typography>
      </Paper>

      {/* Features Grid */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4, fontWeight: 600 }}>
          What We Offer
        </Typography>
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <feature.icon sx={{ fontSize: 40, color: 'primary.main', mt: 0.5 }} />
                    <Box>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {feature.description}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Islands Coverage */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4, fontWeight: 600 }}>
          Islands We Cover
        </Typography>
        <Grid container spacing={2}>
          {islands.map((island, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card variant="outlined" sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" sx={{ mb: 1 }}>
                  {island.flag}
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {island.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {island.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Data Categories */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4, fontWeight: 600 }}>
          Data Categories
        </Typography>
        <Paper sx={{ p: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                🎲 Lottery & Gaming
              </Typography>
              <List dense>
                <ListItem sx={{ pl: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Chip label="Daily" size="small" color="secondary" />
                  </ListItemIcon>
                  <ListItemText primary="Daily lottery results from all major Caribbean lotteries" />
                </ListItem>
                <ListItem sx={{ pl: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Chip label="Live" size="small" color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Real-time draw results and winning numbers" />
                </ListItem>
              </List>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                ⚽ Sports & Entertainment
              </Typography>
              <List dense>
                <ListItem sx={{ pl: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Chip label="Live" size="small" color="error" />
                  </ListItemIcon>
                  <ListItemText primary="Cricket, football, and regional sports scores" />
                </ListItem>
                <ListItem sx={{ pl: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Chip label="Events" size="small" color="info" />
                  </ListItemIcon>
                  <ListItemText primary="Cultural events, festivals, and entertainment" />
                </ListItem>
              </List>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                💰 Economic Data
              </Typography>
              <List dense>
                <ListItem sx={{ pl: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Chip label="Weekly" size="small" color="warning" />
                  </ListItemIcon>
                  <ListItemText primary="Commodity prices and market trends" />
                </ListItem>
                <ListItem sx={{ pl: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Chip label="Daily" size="small" color="secondary" />
                  </ListItemIcon>
                  <ListItemText primary="Currency exchange rates" />
                </ListItem>
              </List>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                🏨 Tourism & Travel
              </Typography>
              <List dense>
                <ListItem sx={{ pl: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Chip label="Real-time" size="small" color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Hotel rates and availability" />
                </ListItem>
                <ListItem sx={{ pl: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Chip label="Seasonal" size="small" color="info" />
                  </ListItemIcon>
                  <ListItemText primary="Tourist events and seasonal activities" />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Contact/Future */}
      <Box sx={{ textAlign: 'center' }}>
        <Paper 
          sx={{ 
            p: 4, 
            backgroundColor: 'secondary.light',
            borderRadius: 3,
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            🚀 Always Growing
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.7 }}>
            Today's Numbers is continuously expanding our coverage and improving our services. 
            We're committed to being the Caribbean's premier data resource, with new features 
            and islands being added regularly.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Built with ❤️ for the Caribbean community
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default About;
