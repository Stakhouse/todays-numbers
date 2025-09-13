import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  Button,
  IconButton,
  Tooltip,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Tabs,
  Tab,
  Badge,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Pending,
  PlaylistAddCheck,
  Warning,
  Refresh,
  FilterList,
  Search,
  Info,
  Lock,
  LockOpen,
  Schedule,
  DoneAll,
  History,
  Visibility,
  Close,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { ApprovalQueueItem, ApprovalStatus, ApprovalWorkflowStats } from '../../../types/admin';
import PendingDataReview from '../PendingDataReview';
import ApprovalDetails from '../ApprovalDetails';
import BatchApproval from '../BatchApproval';
import ApprovalStatistics from '../ApprovalStatistics';

// Mock data for demonstration
const mockPendingItems: ApprovalQueueItem[] = [
  {
    id: '1',
    dataType: 'lottery',
    island: 'jamaica',
    title: 'Jamaica Lotto Results',
    summary: 'Lotto draw for 2025-09-13 with 6 numbers',
    source: 'scraper',
    submittedAt: new Date(Date.now() - 3600000),
    submittedBy: 'Jamaica Scraper',
    priority: 'high',
    estimatedReviewTime: 5,
    dataPreview: {
      game: 'Lotto',
      numbers: [12, 25, 7, 33, 41, 5],
      drawDate: '2025-09-13',
    },
    requiresSpecialPermission: false,
  },
  {
    id: '2',
    dataType: 'hotel',
    island: 'barbados',
    title: 'Oceanview Resort Rates',
    summary: 'Updated room rates for Oceanview Resort',
    source: 'admin_entry',
    submittedAt: new Date(Date.now() - 7200000),
    submittedBy: 'admin@barbados.gov.bb',
    priority: 'medium',
    estimatedReviewTime: 10,
    dataPreview: {
      hotelName: 'Oceanview Resort',
      rate: 250,
      currency: 'BBD',
    },
    requiresSpecialPermission: false,
  },
  {
    id: '3',
    dataType: 'commodity',
    island: 'svg',
    title: 'Rice Price Update',
    summary: 'Updated price for white rice per kg',
    source: 'admin_entry',
    submittedAt: new Date(Date.now() - 10800000),
    submittedBy: 'market-admin@svg.gov.vc',
    priority: 'high',
    estimatedReviewTime: 3,
    dataPreview: {
      commodityName: 'White Rice',
      price: 12.5,
      currency: 'XCD',
      unit: 'per kg',
    },
    requiresSpecialPermission: false,
  },
  {
    id: '4',
    dataType: 'event',
    island: 'trinidad',
    title: 'Carnival Parade Details',
    summary: 'Updated schedule for annual carnival parade',
    source: 'scraper',
    submittedAt: new Date(Date.now() - 14400000),
    submittedBy: 'Trinidad Events Scraper',
    priority: 'urgent',
    estimatedReviewTime: 15,
    dataPreview: {
      eventName: 'Annual Carnival Parade',
      startDate: '2025-09-20',
      location: 'Port of Spain',
    },
    requiresSpecialPermission: true,
  },
];

const mockStats: ApprovalWorkflowStats = {
  pendingCount: 24,
  approvedToday: 12,
  rejectedToday: 3,
  averageApprovalTime: 8.5,
  oldestPendingItem: {
    id: '5',
    title: 'Historical Lottery Data',
    daysPending: 3,
  },
  approvalsByAdmin: {
    'admin1': 45,
    'admin2': 38,
    'admin3': 29,
  },
  approvalsByDataType: {
    'lottery': 62,
    'hotel': 18,
    'commodity': 24,
    'event': 15,
  },
  approvalsByIsland: {
    'jamaica': 35,
    'barbados': 22,
    'svg': 19,
    'trinidad': 16,
    'grenada': 11,
    'stkitts': 8,
    'guyana': 7,
    'belize': 5,
    'antigua': 4,
    'stlucia': 3,
    'dominica': 2,
  },
};

const ApprovalDashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [pendingItems, setPendingItems] = useState<ApprovalQueueItem[]>(mockPendingItems);
  const [stats, setStats] = useState<ApprovalWorkflowStats>(mockStats);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [batchApprovalOpen, setBatchApprovalOpen] = useState(false);

  // Simulate data fetching
  useEffect(() => {
    // In a real implementation, this would fetch from an API
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleApprove = (id: string, notes?: string) => {
    console.log(`Approved item ${id} with notes: ${notes}`);
    // In a real implementation, this would call an API
    setPendingItems(prev => prev.filter(item => item.id !== id));
    setStats(prev => ({
      ...prev,
      pendingCount: prev.pendingCount - 1,
      approvedToday: prev.approvedToday + 1
    }));
  };

  const handleReject = (id: string, reason: string) => {
    console.log(`Rejected item ${id} with reason: ${reason}`);
    // In a real implementation, this would call an API
    setPendingItems(prev => prev.filter(item => item.id !== id));
    setStats(prev => ({
      ...prev,
      pendingCount: prev.pendingCount - 1,
      rejectedToday: prev.rejectedToday + 1
    }));
  };

  const handleRequestChanges = (id: string, changes: string) => {
    console.log(`Requested changes for item ${id}: ${changes}`);
    // In a real implementation, this would call an API
    // For now, we'll just remove it from the pending list
    setPendingItems(prev => prev.filter(item => item.id !== id));
  };

  const handleViewDetails = (id: string) => {
    const item = pendingItems.find(item => item.id === id);
    if (item) {
      setSelectedItem(item);
    }
  };

  const handleCloseDetails = () => {
    setSelectedItem(null);
  };

  const [selectedItem, setSelectedItem] = useState<ApprovalQueueItem | null>(null);

  const handleBatchApprove = (itemIds: string[], action: 'approve' | 'reject' | 'request_changes', notes?: string) => {
    console.log(`Batch ${action} for items:`, itemIds, notes);
    // In a real implementation, this would call an API
    
    // Update the pending items list
    setPendingItems(prev => prev.filter(item => !itemIds.includes(item.id)));
    
    // Update stats
    setStats(prev => ({
      ...prev,
      pendingCount: prev.pendingCount - itemIds.length,
      approvedToday: action === 'approve' ? prev.approvedToday + itemIds.length : prev.approvedToday,
      rejectedToday: action === 'reject' ? prev.rejectedToday + itemIds.length : prev.rejectedToday
    }));
  };

  const handleOpenBatchApproval = () => {
    setBatchApprovalOpen(true);
  };

  const handleCloseBatchApproval = () => {
    setBatchApprovalOpen(false);
  };

  // Update the existing useEffect to close dialogs on refresh
  useEffect(() => {
    // In a real implementation, this would fetch from an API
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    // Close any open dialogs
    setSelectedItem(null);
    setBatchApprovalOpen(false);
  }, []);

  const getStatusColor = (status: ApprovalStatus) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'pending_approval': return 'warning';
      case 'draft': return 'info';
      case 'requires_changes': return 'secondary';
      case 'published': return 'success';
      case 'archived': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: ApprovalStatus) => {
    switch (status) {
      case 'approved': return <CheckCircle />;
      case 'rejected': return <Cancel />;
      case 'pending_approval': return <Pending />;
      case 'draft': return <Schedule />;
      case 'requires_changes': return <Warning />;
      case 'published': return <CheckCircle />;
      case 'archived': return <History />;
      default: return <Pending />;
    }
  };

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
      default: return 'inherit';
    }
  };

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <PlaylistAddCheck sx={{ fontSize: 32, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Approval Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Review and manage pending data entries across all 11 Caribbean islands
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<DoneAll />}
            onClick={() => alert('Batch approval feature coming soon')}
          >
            Batch Approve
          </Button>
        </Box>
      </Box>

      {/* Stats Overview */}
      <ApprovalStatistics stats={stats} />

      {/* Approval Workflow Tabs */}
      <Box sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons="auto"
        >
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Pending />
                <span>Pending ({pendingItems.length})</span>
              </Box>
            } 
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle />
                <span>Approved</span>
              </Box>
            } 
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Cancel />
                <span>Rejected</span>
              </Box>
            } 
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <History />
                <span>History</span>
              </Box>
            } 
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PlaylistAddCheck />
                <span>Statistics</span>
              </Box>
            } 
          />
        </Tabs>
      </Box>

      {/* Pending Items Table */}
      {activeTab === 0 && (
        <Card>
          <CardContent>
            <PendingDataReview
              items={pendingItems}
              loading={loading}
              onRefresh={handleRefresh}
              onApprove={handleApprove}
              onReject={handleReject}
              onRequestChanges={handleRequestChanges}
              onViewDetails={handleViewDetails}
            />
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                startIcon={<DoneAll />}
                onClick={handleOpenBatchApproval}
                disabled={pendingItems.length === 0}
              >
                Batch Approve ({pendingItems.length} items)
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Approval Details Dialog */}
      <ApprovalDetails
        item={selectedItem}
        open={!!selectedItem}
        onClose={handleCloseDetails}
        onApprove={handleApprove}
        onReject={handleReject}
        onRequestChanges={handleRequestChanges}
      />
      
      {/* Batch Approval Dialog */}
      <BatchApproval
        items={pendingItems}
        open={batchApprovalOpen}
        onClose={handleCloseBatchApproval}
        onBatchApprove={handleBatchApprove}
      />

      {/* Statistics Tab */}
      {activeTab === 4 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Approvals by Data Type
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                  {Object.entries(stats.approvalsByDataType).map(([dataType, count]) => (
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
                        value={(count / Math.max(...Object.values(stats.approvalsByDataType))) * 100} 
                        color={getPriorityColor('medium')}
                      />
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Approvals by Island
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                  {Object.entries(stats.approvalsByIsland).map(([island, count]) => (
                    <Box key={island}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">
                          {island.toUpperCase()}
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {count}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={(count / Math.max(...Object.values(stats.approvalsByIsland))) * 100} 
                        color={getPriorityColor('medium')}
                      />
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Admin Performance
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Admin User</TableCell>
                        <TableCell>Approvals</TableCell>
                        <TableCell>Performance</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(stats.approvalsByAdmin).map(([adminId, count]) => (
                        <TableRow key={adminId}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                                {adminId.charAt(0).toUpperCase()}
                              </Avatar>
                              <Typography variant="body2">
                                {adminId}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={500}>
                              {count}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={(count / Math.max(...Object.values(stats.approvalsByAdmin))) * 100} 
                                sx={{ flex: 1 }}
                                color={count > 30 ? 'success' : count > 15 ? 'warning' : 'info'}
                              />
                              <Typography variant="caption" sx={{ width: 40 }}>
                                {Math.round((count / Math.max(...Object.values(stats.approvalsByAdmin))) * 100)}%
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Info Section */}
      <Box sx={{ mt: 4, p: 3, backgroundColor: 'info.light', borderRadius: 2 }}>
        <Typography variant="h6" color="info.dark" gutterBottom>
          🔒 Approval Workflow Information
        </Typography>
        <Typography variant="body2" color="info.dark" paragraph>
          All data entries (scraped or manually entered) must go through the approval workflow before being published. 
          This ensures data quality and maintains the integrity of the Caribbean Data Hub.
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
          <Chip 
            icon={<Lock />} 
            label="Mandatory Approval" 
            color="info" 
            variant="outlined" 
            size="small"
          />
          <Chip 
            icon={<History />} 
            label="Complete Audit Trail" 
            color="info" 
            variant="outlined" 
            size="small"
          />
          <Chip 
            icon={<PlaylistAddCheck />} 
            label="Batch Approval Available" 
            color="info" 
            variant="outlined" 
            size="small"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ApprovalDashboard;