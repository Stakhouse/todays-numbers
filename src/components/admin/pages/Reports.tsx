import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
} from '@mui/material';
import { Assessment, FileDownload, DateRange, TrendingUp } from '@mui/icons-material';

const Reports: React.FC = () => {
  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Assessment sx={{ fontSize: 32, color: 'primary.main' }} />
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Reports & Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Generate reports, export data, and analyze system performance
          </Typography>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <DateRange sx={{ fontSize: 40, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h4" component="div">
                    7
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Daily Reports
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
                <FileDownload sx={{ fontSize: 40, color: 'success.main' }} />
                <Box>
                  <Typography variant="h4" component="div">
                    23
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Data Exports
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
                <TrendingUp sx={{ fontSize: 40, color: 'info.main' }} />
                <Box>
                  <Typography variant="h4" component="div">
                    89%
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    System Uptime
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
                <Assessment sx={{ fontSize: 40, color: 'warning.main' }} />
                <Box>
                  <Typography variant="h4" component="div">
                    156
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Insights Generated
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
            🚧 Phase 5 Development Status
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            This page is scheduled for implementation in Phase 5 - Advanced Features (Week 5).
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
              label="📊 Submission statistics (daily/weekly/monthly)" 
              variant="outlined" 
              size="small"
            />
            <Chip 
              label="🏝️ Island-specific metrics and breakdowns" 
              variant="outlined" 
              size="small"
            />
            <Chip 
              label="📈 Category breakdown charts and visualizations" 
              variant="outlined" 
              size="small"
            />
            <Chip 
              label="📋 Admin activity logs and audit trails" 
              variant="outlined" 
              size="small"
            />
            <Chip 
              label="👥 User engagement metrics and analytics" 
              variant="outlined" 
              size="small"
            />
            <Chip 
              label="📤 Export functionality (CSV/PDF formats)" 
              variant="outlined" 
              size="small"
            />
            <Chip 
              label="📅 Scheduled reports and automated delivery" 
              variant="outlined" 
              size="small"
            />
            <Chip 
              label="⚡ Performance metrics tracking" 
              variant="outlined" 
              size="small"
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Reports;
