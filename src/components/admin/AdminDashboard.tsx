import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Campaign,
  People,
  LocationOn,
  Assessment,
  TrendingUp,
  Notifications,
  Add,
  Speed,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Mock data for overview statistics
  const stats = [
    {
      title: 'Ad Submissions',
      value: '12',
      subtitle: 'Pending Review',
      icon: Campaign,
      color: 'warning.main',
      action: () => navigate('/admin/ads'),
    },
    {
      title: 'Active Users',
      value: '2.4K',
      subtitle: 'This Month',
      icon: People,
      color: 'primary.main',
      action: () => navigate('/admin/users'),
    },
    {
      title: 'Islands Online',
      value: '8',
      subtitle: 'All Connected',
      icon: LocationOn,
      color: 'success.main',
      action: () => navigate('/admin/islands'),
    },
    {
      title: 'System Health',
      value: '99.2%',
      subtitle: 'Uptime',
      icon: Speed,
      color: 'info.main',
      action: () => navigate('/admin/analytics'),
    },
  ];

  // Mock recent activity data
  const recentActivity = [
    {
      id: 1,
      type: 'submission',
      title: 'New lottery ad submitted',
      subtitle: 'From Barbados - Awaiting review',
      time: '2 minutes ago',
      status: 'pending',
    },
    {
      id: 2,
      type: 'approval',
      title: 'Hotel rates updated',
      subtitle: 'Jamaica hotel data refreshed',
      time: '15 minutes ago',
      status: 'completed',
    },
    {
      id: 3,
      type: 'user',
      title: 'New admin user invited',
      subtitle: 'Trinidad & Tobago admin access',
      time: '1 hour ago',
      status: 'completed',
    },
    {
      id: 4,
      type: 'system',
      title: 'Database backup completed',
      subtitle: 'All island data secured',
      time: '2 hours ago',
      status: 'completed',
    },
  ];

  // Quick action buttons
  const quickActions = [
    {
      title: 'Review Submissions',
      description: 'Check pending ad submissions',
      icon: Campaign,
      color: 'warning',
      action: () => navigate('/admin/ads'),
    },
    {
      title: 'Add Island Data',
      description: 'Update commodity prices',
      icon: Add,
      color: 'primary',
      action: () => navigate('/admin/islands'),
    },
    {
      title: 'View Reports',
      description: 'Generate analytics reports',
      icon: Assessment,
      color: 'info',
      action: () => navigate('/admin/reports'),
    },
  ];

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <DashboardIcon sx={{ fontSize: 32, color: 'primary.main' }} />
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Dashboard Overview
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back! Here's what's happening across all Caribbean islands.
          </Typography>
        </Box>
      </Box>

      {/* Overview Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                },
              }}
              onClick={stat.action}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <stat.icon sx={{ fontSize: 40, color: stat.color }} />
                  <Box>
                    <Typography variant="h4" component="div">
                      {stat.value}
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      {stat.title}
                    </Typography>
                    <Typography color="text.secondary" variant="caption">
                      {stat.subtitle}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Activity Feed */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Notifications sx={{ color: 'primary.main' }} />
                <Typography variant="h6">
                  Recent Activity
                </Typography>
              </Box>
              
              <List>
                {recentActivity.map((activity, index) => (
                  <Box key={activity.id}>
                    <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar 
                          sx={{ 
                            backgroundColor: activity.status === 'pending' ? 'warning.light' : 'success.light',
                            color: activity.status === 'pending' ? 'warning.dark' : 'success.dark',
                          }}
                        >
                          {activity.type === 'submission' && <Campaign />}
                          {activity.type === 'approval' && <TrendingUp />}
                          {activity.type === 'user' && <People />}
                          {activity.type === 'system' && <Speed />}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1">
                              {activity.title}
                            </Typography>
                            <Chip 
                              label={activity.status === 'pending' ? 'Pending' : 'Completed'}
                              size="small"
                              color={activity.status === 'pending' ? 'warning' : 'success'}
                              variant="outlined"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {activity.subtitle}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {activity.time}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < recentActivity.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Speed sx={{ color: 'primary.main' }} />
                Quick Actions
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
                {quickActions.map((action, index) => (
                  <Card 
                    key={index}
                    variant="outlined"
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: `${action.color}.main`,
                        backgroundColor: `${action.color}.light`,
                        transform: 'translateX(4px)',
                      },
                    }}
                    onClick={action.action}
                  >
                    <CardContent sx={{ py: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <action.icon sx={{ color: `${action.color}.main` }} />
                        <Box>
                          <Typography variant="body1" fontWeight={600}>
                            {action.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {action.description}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>

              {/* Phase Status */}
              <Box sx={{ mt: 3, p: 2, backgroundColor: 'primary.light', borderRadius: 2 }}>
                <Typography variant="body2" fontWeight={600} color="primary.dark">
                  🎉 Phase 2 Complete!
                </Typography>
                <Typography variant="body2" color="primary.dark" sx={{ mt: 0.5 }}>
                  Admin layout and navigation fully implemented.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
