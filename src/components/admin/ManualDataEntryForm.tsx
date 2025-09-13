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
} from '@mui/material';
import {
  Add,
  Close,
  Save,
  Lock,
  Info,
} from '@mui/icons-material';
import { useState } from 'react';
import { BaseDataEntry, DataSource, ApprovalInfo } from '../../types/admin';

interface ManualDataEntryFormProps {
  dataType: 'lottery' | 'hotel' | 'commodity' | 'event';
  island: string;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  loading?: boolean;
}

const ManualDataEntryForm: React.FC<ManualDataEntryFormProps> = ({
  dataType,
  island,
  open,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    const fields = getFormFields();

    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
      
      if (field.type === 'number' && formData[field.name] !== undefined) {
        const value = parseFloat(formData[field.name]);
        if (isNaN(value)) {
          newErrors[field.name] = `${field.label} must be a number`;
        }
        if (field.min !== undefined && value < field.min) {
          newErrors[field.name] = `${field.label} must be at least ${field.min}`;
        }
        if (field.max !== undefined && value > field.max) {
          newErrors[field.name] = `${field.label} must be at most ${field.max}`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    // Prepare the data entry object
    const dataEntry: BaseDataEntry = {
      id: `manual_${dataType}_${Date.now()}`,
      island,
      source: 'admin_entry' as DataSource,
      approval: {
        status: 'draft',
        approvalLevel: 'island_admin'
      } as ApprovalInfo,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      ...formData
    };

    // Process specific fields
    if (dataType === 'lottery' && formData.numbers) {
      // Convert numbers string to array
      dataEntry.numbers = formData.numbers.split(',').map((n: string) => parseInt(n.trim())).filter((n: number) => !isNaN(n));
    }

    onSubmit(dataEntry);
  };

  const formFields = getFormFields();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Add color="primary" />
            <Box>
              <Typography variant="h6">
                Add {dataType.charAt(0).toUpperCase() + dataType.slice(1)} Data
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
        <Box sx={{ mb: 2 }}>
          <Alert severity="info" icon={<Lock />}>
            <Typography variant="body2">
              This entry will be saved as a draft and require admin approval before publishing.
            </Typography>
          </Alert>
        </Box>
        
        <Grid container spacing={3}>
          {formFields.map((field) => (
            <Grid item xs={12} sm={6} key={field.name}>
              {field.type === 'select' ? (
                <FormControl fullWidth error={!!errors[field.name]}>
                  <InputLabel>{field.label}</InputLabel>
                  <Select
                    value={formData[field.name] || ''}
                    label={field.label}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                  >
                    {field.options?.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors[field.name] && (
                    <Typography variant="caption" color="error">
                      {errors[field.name]}
                    </Typography>
                  )}
                </FormControl>
              ) : field.type === 'textarea' ? (
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label={field.label}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  error={!!errors[field.name]}
                  helperText={errors[field.name]}
                  required={field.required}
                />
              ) : (
                <TextField
                  fullWidth
                  type={field.type}
                  label={field.label}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  error={!!errors[field.name]}
                  helperText={errors[field.name]}
                  required={field.required}
                  InputLabelProps={
                    field.type === 'date' || field.type === 'datetime-local' 
                      ? { shrink: true } 
                      : undefined
                  }
                />
              )}
            </Grid>
          ))}
        </Grid>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Info color="action" />
          <Typography variant="body2" color="text.secondary">
            After submission, this entry will appear in the approval queue for admin review.
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
        >
          Save as Draft
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManualDataEntryForm;