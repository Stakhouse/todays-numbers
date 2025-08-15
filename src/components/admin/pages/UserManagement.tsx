import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
} from '@mui/material';
import { People, AdminPanelSettings, PersonAdd, Security } from '@mui/icons-material';

const UserManagement: React.FC = () => {
  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <People sx={{ fontSize: 32, color: 'primary.main' }} />
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            User Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage admin users, permissions, and access control
          </Typography>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AdminPanelSettings sx={{ fontSize: 40, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h4" component="div">
                    3
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Super Admins
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
                <People sx={{ fontSize: 40, color: 'info.main' }} />
                <Box>
                  <Typography variant="h4" component="div">
                    8
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Island Admins
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
                <PersonAdd sx={{ fontSize: 40, color: 'success.main' }} />
                <Box>
                  <Typography variant="h4" component="div">
                    2
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Pending Invites
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
                <Security sx={{ fontSize: 40, color: 'warning.main' }} />
                <Box>
                  <Typography variant="h4" component="div">
                    5
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Active Sessions
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
              label="👥 Admin user list with role management" 
              variant="outlined" 
              size="small"
            />
            <Chip 
              label="🔐 Role-based access control (Super Admin, Island Admin)" 
              variant="outlined" 
              size="small"
            />
            <Chip 
              label="📧 Invite new admin users" 
              variant="outlined" 
              size="small"
            />
            <Chip 
              label="🏝️ Island-specific admin assignments" 
              variant="outlined" 
              size="small"
            />
            <Chip 
              label="📋 Admin activity audit logs" 
              variant="outlined" 
              size="small"
            />
            <Chip 
              label="⏰ Session management and timeout handling" 
              variant="outlined" 
              size="small"
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserManagement;
