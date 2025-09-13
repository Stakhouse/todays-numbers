import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Chip,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  Pending,
  CheckCircle,
  Cancel,
  Schedule,
  Warning,
  Person,
  LocationOn,
  Category,
} from '@mui/icons-material';
import { ApprovalWorkflowStats } from '../../types/admin';

interface ApprovalStatisticsProps {
  stats: ApprovalWorkflowStats;
}

const ApprovalStatistics: React.FC<ApprovalStatisticsProps> = ({ stats }) => {
  const getDataTypeIcon = (dataType: string) => {
    switch (dataType) {
      case 'lottery': return '🎲';
      case 'hotel': return '🏨';
      case 'commodity': return '🛒';
      case 'event': return '📅';
      default: return '📋';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'primary';
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Main Stats */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.main' }}>
                <Pending />
              </Avatar>
              <Box>
                <Typography variant="h4" component="div">
                  {stats.pendingCount}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  Pending Items
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
              <Avatar sx={{ bgcolor: 'success.light', color: 'success.main' }}>
                <CheckCircle />
              </Avatar>
              <Box>
                <Typography variant="h4" component="div">
                  {stats.approvedToday}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  Approved Today
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
              <Avatar sx={{ bgcolor: 'error.light', color: 'error.main' }}>
                <Cancel />
              </Avatar>
              <Box>
                <Typography variant="h4" component="div">
                  {stats.rejectedToday}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  Rejected Today
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
              <Avatar sx={{ bgcolor: 'info.light', color: 'info.main' }}>
                <Schedule />
              </Avatar>
              <Box>
                <Typography variant="h4" component="div">
                  {stats.averageApprovalTime}m
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  Avg. Approval Time
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Approvals by Data Type */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Category color="action" />
              <Typography variant="h6">
                Approvals by Data Type
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              {Object.entries(stats.approvalsByDataType).map(([dataType, count]) => {
                const maxCount = Math.max(...Object.values(stats.approvalsByDataType));
                const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                
                return (
                  <Box key={dataType}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{getDataTypeIcon(dataType)}</span>
                        {dataType.charAt(0).toUpperCase() + dataType.slice(1)}
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {count}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={percentage} 
                      color={getPriorityColor('medium')}
                    />
                  </Box>
                );
              })}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Approvals by Island */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <LocationOn color="action" />
              <Typography variant="h6">
                Approvals by Island
              </Typography>
            </Box>
            
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
              gap: 1,
              mt: 1
            }}>
              {Object.entries(stats.approvalsByIsland).map(([island, count]) => (
                <Tooltip key={island} title={`${island.toUpperCase()}: ${count} approvals`}>
                    <Chip 
                      label={`${island.toUpperCase()}: ${count}`}
                      size="small"
                      variant="outlined"
                      sx={{ 
                        justifyContent: 'space-between',
                        width: '100%'
                      }}
                    />
                </Tooltip>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Admin Performance */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Person color="action" />
              <Typography variant="h6">
                Admin Performance
              </Typography>
            </Box>
            
            <Grid container spacing={2}>
              {Object.entries(stats.approvalsByAdmin).map(([adminId, count]) => {
                const maxCount = Math.max(...Object.values(stats.approvalsByAdmin));
                const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                const performanceColor = count > 30 ? 'success' : count > 15 ? 'warning' : 'info';
                
                return (
                  <Grid item xs={12} sm={6} md={4} key={adminId}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                        {adminId.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">
                            {adminId}
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {count}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={percentage} 
                            sx={{ flex: 1 }}
                            color={performanceColor}
                          />
                          <Typography variant="caption" sx={{ width: 40 }}>
                            {Math.round(percentage)}%
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Additional Stats */}
      {stats.oldestPendingItem && (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Warning color="warning" />
                  <Box>
                    <Typography variant="h6" color="warning.main">
                      Oldest Pending Item
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stats.oldestPendingItem.title} • {stats.oldestPendingItem.daysPending} days pending
                    </Typography>
                  </Box>
                </Box>
                <Chip 
                  label={`${stats.oldestPendingItem.daysPending} days`} 
                  color="warning" 
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );
};

export default ApprovalStatistics;