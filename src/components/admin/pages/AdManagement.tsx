import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
} from '@mui/material';
import { Campaign, PendingActions, CheckCircle, Cancel } from '@mui/icons-material';

const AdManagement: React.FC = () => {
  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Campaign sx={{ fontSize: 32, color: 'primary.main' }} />
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Ad Submissions Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Review, approve, and manage all submitted advertisements
          </Typography>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <PendingActions sx={{ fontSize: 40, color: 'warning.main' }} />
                <Box>
                  <Typography variant="h4" component="div">
                    12
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Pending Review
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
                <CheckCircle sx={{ fontSize: 40, color: 'success.main' }} />
                <Box>
                  <Typography variant="h4" component="div">
                    45
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Approved
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
                <Cancel sx={{ fontSize: 40, color: 'error.main' }} />
                <Box>
                  <Typography variant="h4" component="div">
                    8
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Rejected
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
                <Campaign sx={{ fontSize: 40, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h4" component="div">
                    65
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Total Submissions
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
            🚧 Phase 3 Development Status
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            This page is scheduled for implementation in Phase 3 - Ad Management System (Week 3).
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
              label="📋 Filterable submission table with status indicators" 
              variant="outlined" 
              size="small"
            />
            <Chip 
              label="🏝️ Island and category filtering" 
              variant="outlined" 
              size="small"
            />
            <Chip 
              label="🔍 Search functionality" 
              variant="outlined" 
              size="small"
            />
            <Chip 
              label="✅ Approval/rejection workflow with review modal" 
              variant="outlined" 
              size="small"
            />
            <Chip 
              label="🔄 Real-time Firestore integration" 
              variant="outlined" 
              size="small"
            />
            <Chip 
              label="📝 Review notes and admin comments" 
              variant="outlined" 
              size="small"
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdManagement;
