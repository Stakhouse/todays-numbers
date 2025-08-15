import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
} from '@mui/material';
import { LocationOn, Store, Hotel, Event, SportsBaseball } from '@mui/icons-material';

const IslandDataManagement: React.FC = () => {
  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <LocationOn sx={{ fontSize: 32, color: 'primary.main' }} />
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Island Data Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage commodity prices, hotel rates, events, and sports data
          </Typography>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Store sx={{ fontSize: 40, color: 'success.main' }} />
                <Box>
                  <Typography variant="h4" component="div">
                    24
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Commodity Prices
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Hotel sx={{ fontSize: 40, color: 'info.main' }} />
                <Box>
                  <Typography variant="h4" component="div">
                    15
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Hotel Rates
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Event sx={{ fontSize: 40, color: 'warning.main' }} />
                <Box>
                  <Typography variant="h4" component="div">
                    8
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Upcoming Events
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <SportsBaseball sx={{ fontSize: 40, color: 'error.main' }} />
                <Box>
                  <Typography variant="h4" component="div">
                    12
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Sports Updates
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Implementation Status */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            🚧 Phase 4 Development Status
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            This page is scheduled for implementation in Phase 4 - Data Management (Week 4).
            The following features will be implemented:
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Progress: 0% Complete
            </Typography>
            <LinearProgress variant="determinate" value={0} />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Chip 
              label="🛒 Commodity Price Management - Weekly price updates" 
              variant="outlined" 
              size="small"
            />
            <Chip 
              label="🏨 Hotel Rate Management - Weekly/monthly rate updates" 
              variant="outlined" 
              size="small"
            />
            <Chip 
              label="📅 Event Management - Add/edit/delete events" 
              variant="outlined" 
              size="small"
            />
            <Chip 
              label="🎲 Lottery Results - Manual entry (backup system)" 
              variant="outlined" 
              size="small"
            />
            <Chip 
              label="⚽ Sports Score Management - Manual entry interface" 
              variant="outlined" 
              size="small"
            />
            <Chip 
              label="📋 Data validation with real-time error handling" 
              variant="outlined" 
              size="small"
            />
            <Chip 
              label="📤📥 Bulk data import/export functionality" 
              variant="outlined" 
              size="small"
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default IslandDataManagement;
