import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
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
  Grid,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Pending,
  Warning,
  Refresh,
  FilterList,
  Search,
  Info,
  Lock,
  LockOpen,
  Schedule,
  DoneAll,
  Visibility,
  Edit,
} from '@mui/icons-material';
import { useState } from 'react';
import { ApprovalQueueItem, ApprovalStatus, DataSource } from '../../types/admin';
import DataEntryStatus from './DataEntryStatus';

interface PendingDataReviewProps {
  items: ApprovalQueueItem[];
  onRefresh?: () => void;
  onApprove?: (id: string, notes?: string) => void;
  onReject?: (id: string, reason: string) => void;
  onRequestChanges?: (id: string, changes: string) => void;
  onViewDetails?: (id: string) => void;
  loading?: boolean;
}

const PendingDataReview: React.FC<PendingDataReviewProps> = ({
  items,
  onRefresh,
  onApprove,
  onReject,
  onRequestChanges,
  onViewDetails,
  loading = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedItem, setSelectedItem] = useState<ApprovalQueueItem | null>(null);
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    type: 'approve' | 'reject' | 'request_changes' | null;
    itemId: string | null;
  }>({ open: false, type: null, itemId: null });
  const [actionNotes, setActionNotes] = useState('');

  const handleAction = () => {
    if (!actionDialog.itemId) return;

    switch (actionDialog.type) {
      case 'approve':
        onApprove?.(actionDialog.itemId, actionNotes);
        break;
      case 'reject':
        onReject?.(actionDialog.itemId, actionNotes);
        break;
      case 'request_changes':
        onRequestChanges?.(actionDialog.itemId, actionNotes);
        break;
    }

    setActionDialog({ open: false, type: null, itemId: null });
    setActionNotes('');
  };

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
      default: return 'default'; // Valid for Chip components
    }
  };

  const openActionDialog = (type: 'approve' | 'reject' | 'request_changes', itemId: string) => {
    setActionDialog({ open: true, type, itemId });
  };

  const closeActionDialog = () => {
    setActionDialog({ open: false, type: null, itemId: null });
    setActionNotes('');
  };

  return (
    <Box>
      {/* Header Actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h6">
          Pending Data Review
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button startIcon={<FilterList />} variant="outlined">
            Filter
          </Button>
          <Button startIcon={<Search />} variant="outlined">
            Search
          </Button>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={onRefresh}
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

      {/* Pending Items Table */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <LinearProgress sx={{ width: '100%' }} />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Data Type</TableCell>
                <TableCell>Island</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Source & Status</TableCell>
                <TableCell>Submitted By</TableCell>
                <TableCell>Submitted At</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Est. Review Time</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>{getDataTypeIcon(item.dataType)}</span>
                      <Typography variant="body2" fontWeight={500}>
                        {item.dataType.charAt(0).toUpperCase() + item.dataType.slice(1)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={item.island.toUpperCase()} 
                      size="small" 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        {item.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.summary}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <DataEntryStatus 
                      source={item.source as DataSource} 
                      approvalStatus="pending_approval" 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {item.source === 'scraper' ? <LockOpen fontSize="small" /> : <Lock fontSize="small" />}
                      <Typography variant="body2">
                        {item.submittedBy}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(item.submittedAt).toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={item.priority} 
                      size="small" 
                      color={getPriorityColor(item.priority)}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {item.estimatedReviewTime} min
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Approve">
                        <IconButton 
                          color="success" 
                          size="small"
                          onClick={() => openActionDialog('approve', item.id)}
                        >
                          <CheckCircle />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reject">
                        <IconButton 
                          color="error" 
                          size="small"
                          onClick={() => openActionDialog('reject', item.id)}
                        >
                          <Cancel />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Request Changes">
                        <IconButton 
                          color="warning" 
                          size="small"
                          onClick={() => openActionDialog('request_changes', item.id)}
                        >
                          <Warning />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View Details">
                        <IconButton 
                          color="primary" 
                          size="small"
                          onClick={() => onViewDetails?.(item.id)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Action Dialog */}
      <Dialog open={actionDialog.open} onClose={closeActionDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {actionDialog.type === 'approve' && 'Approve Data Entry'}
          {actionDialog.type === 'reject' && 'Reject Data Entry'}
          {actionDialog.type === 'request_changes' && 'Request Changes'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography variant="body2" color="text.secondary" paragraph>
              {actionDialog.type === 'approve' && 'Are you sure you want to approve this data entry? It will be published to the live site.'}
              {actionDialog.type === 'reject' && 'Are you sure you want to reject this data entry? It will not be published.'}
              {actionDialog.type === 'request_changes' && 'Please specify the changes needed for this data entry.'}
            </Typography>
            
            <TextField
              fullWidth
              multiline
              rows={4}
              label={
                actionDialog.type === 'approve' ? 'Approval notes (optional)' :
                actionDialog.type === 'reject' ? 'Rejection reason' :
                'Requested changes'
              }
              value={actionNotes}
              onChange={(e) => setActionNotes(e.target.value)}
              variant="outlined"
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeActionDialog}>Cancel</Button>
          <Button
            variant="contained"
            color={
              actionDialog.type === 'approve' ? 'success' :
              actionDialog.type === 'reject' ? 'error' :
              'warning'
            }
            onClick={handleAction}
            disabled={!actionNotes && actionDialog.type !== 'approve'}
          >
            {actionDialog.type === 'approve' && 'Approve'}
            {actionDialog.type === 'reject' && 'Reject'}
            {actionDialog.type === 'request_changes' && 'Request Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PendingDataReview;