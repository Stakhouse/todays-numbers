import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  TextField,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  DoneAll,
  Close,
  CheckCircle,
  Cancel,
  Warning,
} from '@mui/icons-material';
import { useState } from 'react';
import { ApprovalQueueItem } from '../../types/admin';

interface BatchApprovalProps {
  items: ApprovalQueueItem[];
  open: boolean;
  onClose: () => void;
  onBatchApprove?: (itemIds: string[], action: 'approve' | 'reject' | 'request_changes', notes?: string) => void;
}

const BatchApproval: React.FC<BatchApprovalProps> = ({
  items,
  open,
  onClose,
  onBatchApprove,
}) => {
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
  const [action, setAction] = useState<'approve' | 'reject' | 'request_changes'>('approve');
  const [notes, setNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    const newSelection: Record<string, boolean> = {};
    items.forEach(item => {
      newSelection[item.id] = checked;
    });
    setSelectedItems(newSelection);
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    setSelectedItems(prev => ({
      ...prev,
      [id]: checked
    }));
  };

  const handleBatchAction = async () => {
    const selectedIds = Object.keys(selectedItems).filter(id => selectedItems[id]);
    
    if (selectedIds.length === 0) {
      alert('Please select at least one item');
      return;
    }

    setProcessing(true);
    
    try {
      onBatchApprove?.(selectedIds, action, notes);
      // Close the dialog after successful batch action
      onClose();
    } catch (error) {
      console.error('Batch approval failed:', error);
      alert('Batch approval failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const selectedCount = Object.values(selectedItems).filter(Boolean).length;
  const allSelected = selectedCount === items.length && items.length > 0;
  const indeterminate = selectedCount > 0 && selectedCount < items.length;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <DoneAll color="primary" />
            <Typography variant="h6">
              Batch Approval
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={allSelected}
                  indeterminate={indeterminate}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              }
              label={`Select All (${items.length} items)`}
            />
            
            <Chip
              label={`${selectedCount} selected`}
              color={selectedCount > 0 ? 'primary' : 'default'}
              variant="outlined"
            />
          </Box>
          
          <Box sx={{ 
            maxHeight: 300, 
            overflowY: 'auto', 
            border: '1px solid rgba(0, 0, 0, 0.12)', 
            borderRadius: 1, 
            mb: 2 
          }}>
            {items.map((item) => (
              <Box 
                key={item.id} 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2, 
                  p: 2,
                  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                  '&:last-child': {
                    borderBottom: 'none'
                  }
                }}
              >
                <Checkbox
                  checked={!!selectedItems[item.id]}
                  onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" fontWeight={500}>
                    {item.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.island.toUpperCase()} • {item.dataType} • {new Date(item.submittedAt).toLocaleDateString()}
                  </Typography>
                </Box>
                <Chip 
                  label={item.priority} 
                  size="small" 
                  color={
                    item.priority === 'urgent' ? 'error' :
                    item.priority === 'high' ? 'warning' :
                    item.priority === 'medium' ? 'info' : 'success'
                  }
                  variant="outlined"
                />
              </Box>
            ))}
          </Box>
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Action Type
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Button
              variant={action === 'approve' ? 'contained' : 'outlined'}
              color="success"
              startIcon={<CheckCircle />}
              onClick={() => setAction('approve')}
            >
              Approve
            </Button>
            <Button
              variant={action === 'reject' ? 'contained' : 'outlined'}
              color="error"
              startIcon={<Cancel />}
              onClick={() => setAction('reject')}
            >
              Reject
            </Button>
            <Button
              variant={action === 'request_changes' ? 'contained' : 'outlined'}
              color="warning"
              startIcon={<Warning />}
              onClick={() => setAction('request_changes')}
            >
              Request Changes
            </Button>
          </Box>
        </Box>
        
        <TextField
          fullWidth
          multiline
          rows={3}
          label={action === 'approve' ? 'Approval notes (optional)' : 
                 action === 'reject' ? 'Rejection reason' : 
                 'Requested changes'}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          variant="outlined"
        />
      </DialogContent>
      
      <DialogActions>
        {processing && <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0 }} />}
        <Button onClick={onClose} disabled={processing}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color={
            action === 'approve' ? 'success' :
            action === 'reject' ? 'error' :
            'warning'
          }
          onClick={handleBatchAction}
          disabled={selectedCount === 0 || processing}
        >
          {action === 'approve' && `Approve ${selectedCount} Items`}
          {action === 'reject' && `Reject ${selectedCount} Items`}
          {action === 'request_changes' && `Request Changes for ${selectedCount} Items`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BatchApproval;