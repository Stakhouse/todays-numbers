import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Divider,
  Avatar,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Warning,
  Close,
  Lock,
  LockOpen,
  Schedule,
  History,
  Person,
  CalendarToday,
  Info,
} from '@mui/icons-material';
import { useState } from 'react';
import { ApprovalQueueItem, ApprovalStatus } from '../../types/admin';
import DataEntryStatus from './DataEntryStatus';
import DataQualityValidator from './DataQualityValidator';

interface ApprovalDetailsProps {
  item: ApprovalQueueItem | null;
  open: boolean;
  onClose: () => void;
  onApprove?: (id: string, notes?: string) => void;
  onReject?: (id: string, reason: string) => void;
  onRequestChanges?: (id: string, changes: string) => void;
}

const ApprovalDetails: React.FC<ApprovalDetailsProps> = ({
  item,
  open,
  onClose,
  onApprove,
  onReject,
  onRequestChanges,
}) => {
  const [actionNotes, setActionNotes] = useState('');

  if (!item) return null;

  const handleAction = (action: 'approve' | 'reject' | 'request_changes') => {
    switch (action) {
      case 'approve':
        onApprove?.(item.id, actionNotes);
        break;
      case 'reject':
        onReject?.(item.id, actionNotes);
        break;
      case 'request_changes':
        onRequestChanges?.(item.id, actionNotes);
        break;
    }
    
    setActionNotes('');
    onClose();
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

  const getLinearProgressColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'inherit'; // 'inherit' for LinearProgress components
    }
  };

  const getSourceIcon = (source: string) => {
    return source === 'scraper' ? <LockOpen fontSize="small" /> : <Lock fontSize="small" />;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', width: 40, height: 40 }}>
              {getDataTypeIcon(item.dataType)}
            </Avatar>
            <Box>
              <Typography variant="h6" component="div">
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.dataType.charAt(0).toUpperCase() + item.dataType.slice(1)} • {item.island.toUpperCase()}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Data Preview
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {item.summary}
                  </Typography>
                  
                  {/* Data Preview */}
                  <Box sx={{ backgroundColor: 'grey.50', p: 2, borderRadius: 1 }}>
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {JSON.stringify(item.dataPreview, null, 2)}
                    </pre>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="h6" gutterBottom>
                  Additional Information
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Person color="action" />
                      <Typography variant="body2" color="text.secondary">
                        Submitted By
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getSourceIcon(item.source)}
                      <Typography variant="body2">
                        {item.submittedBy}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Info color="action" />
                      <Typography variant="body2" color="text.secondary">
                        Source & Status
                      </Typography>
                    </Box>
                    <DataEntryStatus 
                      source={item.source} 
                      approvalStatus="pending_approval" 
                      size="small" 
                      showLabels
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <CalendarToday color="action" />
                      <Typography variant="body2" color="text.secondary">
                        Submitted At
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      {new Date(item.submittedAt).toLocaleString()}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Schedule color="action" />
                      <Typography variant="body2" color="text.secondary">
                        Estimated Review Time
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      {item.estimatedReviewTime} minutes
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Info color="action" />
                      <Typography variant="body2" color="text.secondary">
                        Priority
                      </Typography>
                    </Box>
                    <Chip 
                      label={item.priority} 
                      size="small" 
                      color={getPriorityColor(item.priority)}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Actions
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircle />}
                    onClick={() => handleAction('approve')}
                    fullWidth
                  >
                    Approve
                  </Button>
                  
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<Cancel />}
                    onClick={() => handleAction('reject')}
                    fullWidth
                  >
                    Reject
                  </Button>
                  
                  <Button
                    variant="contained"
                    color="warning"
                    startIcon={<Warning />}
                    onClick={() => handleAction('request_changes')}
                    fullWidth
                  >
                    Request Changes
                  </Button>
                </Box>
                
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Notes"
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  variant="outlined"
                  margin="normal"
                  placeholder="Add notes for your action..."
                />
              </CardContent>
            </Card>
            
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Approval Workflow
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Current Status
                    </Typography>
                    <Chip 
                      label="Pending Approval" 
                      color="warning" 
                      icon={<Schedule />} 
                      variant="outlined"
                    />
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Next Steps
                    </Typography>
                    <Typography variant="body2">
                      • Review data accuracy
                    </Typography>
                    <Typography variant="body2">
                      • Verify source authenticity
                    </Typography>
                    <Typography variant="body2">
                      • Check for duplicates
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApprovalDetails;