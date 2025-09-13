import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Edit,
  Close,
  Save,
  Lock,
  Info,
  CheckCircle,
  Warning,
} from '@mui/icons-material';
import { useState } from 'react';
import { BaseDataEntry, DataSource, ApprovalInfo } from '../../types/admin';
import DataEntryStatus from './DataEntryStatus';

interface DataOverrideFormProps {
  existingData: any;
  dataType: 'lottery' | 'hotel' | 'commodity' | 'event';
  island: string;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any, reason: string) => void;
  loading?: boolean;
}

const DataOverrideForm: React.FC<DataOverrideFormProps> = ({
  existingData,
  dataType,
  island,
  open,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const [overrideData, setOverrideData] = useState<any>({});
  const [overrideReason, setOverrideReason] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize override data with existing data
  useState(() => {
    setOverrideData({ ...existingData });
  }, [existingData]);

  const getFormFields = () => {
    switch (dataType) {
      case 'lottery':
        return [
          { name: 'game', label: 'Game Name', type: 'text', required: true },
          { name: 'drawDate', label: 'Draw Date', type: 'date', required: true },
          { name: 'numbers', label: 'Numbers (comma separated)', type: 'text', required: true },
          { name: 'jackpot', label: 'Jackpot Amount', type: 'number', required: false },
          { name: 'currency', label: 'Currency', type: 'text', required: false },
        ];
      case 'hotel':
        return [
          { name: 'hotelName', label: 'Hotel Name', type: 'text', required: true },
          { name: 'location', label: 'Location', type: 'text', required: true },
          { name: 'rate', label: 'Rate', type: 'number', required: true },
          { name: 'currency', label: 'Currency', type: 'text', required: true },
          { name: 'rateType', label: 'Rate Type', type: 'select', required: true, options: ['per_night', 'per_week', 'all_inclusive'] },
          { name: 'rating', label: 'Rating (1-5)', type: 'number', required: false, min: 1, max: 5 },
        ];
      case 'commodity':
        return [
          { name: 'commodityName', label: 'Commodity Name', type: 'text', required: true },
          { name: 'category', label: 'Category', type: 'select', required: true, options: ['food', 'fuel', 'household', 'building_materials', 'other'] },
          { name: 'price', label: 'Price', type: 'number', required: true },
          { name: 'currency', label: 'Currency', type: 'text', required: true },
          { name: 'unit', label: 'Unit (e.g., per kg, per liter)', type: 'text', required: true },
        ];
      case 'event':
        return [
          { name: 'eventName', label: 'Event Name', type: 'text', required: true },
          { name: 'eventType', label: 'Event Type', type: 'select', required: true, options: ['carnival', 'music_festival', 'cultural', 'sports', 'religious', 'other'] },
          { name: 'description', label: 'Description', type: 'textarea', required: true },
          { name: 'startDate', label: 'Start Date', type: 'datetime-local', required: true },
          { name: 'endDate', label: 'End Date', type: 'datetime-local', required: false },
          { name: 'location', label: 'Location', type: 'text', required: true },
        ];
      default:
        return [];
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!overrideReason.trim()) {
      newErrors.reason = 'Override reason is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (name: string, value: any) => {
    setOverrideData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    // Prepare the data entry object
    const dataEntry: BaseDataEntry = {
      ...existingData,
      ...overrideData,
      id: existingData.id,
      island,
      source: 'admin_entry' as DataSource,
      approval: {
        status: 'draft',
        approvalLevel: 'island_admin',
        changeRequests: overrideReason,
      } as ApprovalInfo,
      updatedAt: new Date(),
      lastModifiedBy: 'current_admin', // This would be the actual admin user ID
    };

    // Process specific fields
    if (dataType === 'lottery' && overrideData.numbers) {
      // Convert numbers string to array
      dataEntry.numbers = overrideData.numbers.split(',').map((n: string) => parseInt(n.trim())).filter((n: number) => !isNaN(n));
    }

    onSubmit(dataEntry, overrideReason);
  };

  const formFields = getFormFields();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Edit color="warning" />
            <Box>
              <Typography variant="h6">
                Override {dataType.charAt(0).toUpperCase() + dataType.slice(1)} Data
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Island: {island.toUpperCase()} • Requires Admin Approval
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <Alert severity="warning" icon={<Warning />}>
            <Typography variant="body2">
              You are overriding existing data. This action requires admin approval.
            </Typography>
          </Alert>
        </Box>
        
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" color="text.secondary">
                Existing Data
              </Typography>
              <DataEntryStatus 
                source={existingData.source} 
                approvalStatus={existingData.approval?.status || 'published'} 
                size="small" 
              />
            </Box>
            
            <List dense>
              {Object.entries(existingData).map(([key, value]) => {
                // Skip complex objects and internal fields
                if (typeof value === 'object' || key.startsWith('_') || key === 'approval' || key === 'source') {
                  return null;
                }
                
                return (
                  <ListItem key={key} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 120 }}>
                      <Typography variant="body2" color="text.secondary">
                        {key}:
                      </Typography>
                    </ListItemIcon>
                    <ListItemText 
                      primary={String(value)} 
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                );
              })}
            </List>
          </CardContent>
        </Card>
        
        <Typography variant="h6" gutterBottom>
          Override Data
        </Typography>
        
        <Grid container spacing={3}>
          {formFields.map((field) => (
            <Grid item xs={12} sm={6} key={field.name}>
              {field.type === 'select' ? (
                <FormControl fullWidth>
                  <InputLabel>{field.label}</InputLabel>
                  <Select
                    value={overrideData[field.name] || ''}
                    label={field.label}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                  >
                    {field.options?.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : field.type === 'textarea' ? (
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label={field.label}
                  value={overrideData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
              ) : (
                <TextField
                  fullWidth
                  type={field.type}
                  label={field.label}
                  value={overrideData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  InputLabelProps={
                    field.type === 'date' || field.type === 'datetime-local' 
                      ? { shrink: true } 
                      : undefined
                  }
                />
              )}
            </Grid>
          ))}
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Override Reason *"
              value={overrideReason}
              onChange={(e) => {
                setOverrideReason(e.target.value);
                if (errors.reason) {
                  setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.reason;
                    return newErrors;
                  });
                }
              }}
              error={!!errors.reason}
              helperText={errors.reason || 'Explain why this data needs to be overridden'}
              required
            />
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Info color="action" />
          <Typography variant="body2" color="text.secondary">
            After submission, this override will be saved as a draft and require admin approval before replacing the existing data.
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={handleSubmit}
          disabled={loading}
          color="warning"
        >
          Submit Override for Approval
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DataOverrideForm;