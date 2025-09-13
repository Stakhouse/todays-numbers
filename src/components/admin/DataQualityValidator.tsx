import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Alert,
  AlertTitle,
  LinearProgress,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Warning,
  Info,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';

interface ValidationResult {
  id: string;
  field: string;
  isValid: boolean;
  message: string;
  severity: 'error' | 'warning' | 'info' | 'success';
}

interface DataQualityValidatorProps {
  data: any;
  dataType: 'lottery' | 'hotel' | 'commodity' | 'event';
  island: string;
}

const DataQualityValidator: React.FC<DataQualityValidatorProps> = ({
  data,
  dataType,
  island,
}) => {
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [overallScore, setOverallScore] = useState(100);

  useEffect(() => {
    validateData();
  }, [data, dataType, island]);

  const validateData = () => {
    const results: ValidationResult[] = [];
    
    // Common validations for all data types
    if (!data.island) {
      results.push({
        id: 'island-required',
        field: 'Island',
        isValid: false,
        message: 'Island is required',
        severity: 'error'
      });
    }
    
    // Data type specific validations
    switch (dataType) {
      case 'lottery':
        validateLotteryData(data, results);
        break;
      case 'hotel':
        validateHotelData(data, results);
        break;
      case 'commodity':
        validateCommodityData(data, results);
        break;
      case 'event':
        validateEventData(data, results);
        break;
    }
    
    // Cross-island validations
    validateCrossIslandRules(data, results, island);
    
    setValidationResults(results);
    
    // Calculate overall score
    const totalChecks = results.length;
    const passedChecks = results.filter(r => r.isValid).length;
    const score = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 100;
    setOverallScore(score);
  };

  const validateLotteryData = (data: any, results: ValidationResult[]) => {
    // Game name validation
    if (!data.game || data.game.trim().length === 0) {
      results.push({
        id: 'game-required',
        field: 'Game Name',
        isValid: false,
        message: 'Game name is required',
        severity: 'error'
      });
    } else if (data.game.length > 50) {
      results.push({
        id: 'game-length',
        field: 'Game Name',
        isValid: false,
        message: 'Game name should be less than 50 characters',
        severity: 'warning'
      });
    }
    
    // Draw date validation
    if (!data.drawDate) {
      results.push({
        id: 'draw-date-required',
        field: 'Draw Date',
        isValid: false,
        message: 'Draw date is required',
        severity: 'error'
      });
    } else {
      const drawDate = new Date(data.drawDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (drawDate > today) {
        results.push({
          id: 'draw-date-future',
          field: 'Draw Date',
          isValid: false,
          message: 'Draw date cannot be in the future',
          severity: 'error'
        });
      }
    }
    
    // Numbers validation
    if (!data.numbers || !Array.isArray(data.numbers) || data.numbers.length === 0) {
      results.push({
        id: 'numbers-required',
        field: 'Numbers',
        isValid: false,
        message: 'Lottery numbers are required',
        severity: 'error'
      });
    } else {
      // Check for valid numbers
      const invalidNumbers = data.numbers.filter((n: any) => typeof n !== 'number' || n < 0 || !Number.isInteger(n));
      if (invalidNumbers.length > 0) {
        results.push({
          id: 'numbers-invalid',
          field: 'Numbers',
          isValid: false,
          message: 'All numbers must be positive integers',
          severity: 'error'
        });
      }
      
      // Check for duplicates
      const uniqueNumbers = [...new Set(data.numbers)];
      if (uniqueNumbers.length !== data.numbers.length) {
        results.push({
          id: 'numbers-duplicate',
          field: 'Numbers',
          isValid: false,
          message: 'Lottery numbers cannot contain duplicates',
          severity: 'warning'
        });
      }
    }
    
    // Jackpot validation
    if (data.jackpot !== undefined && (typeof data.jackpot !== 'number' || data.jackpot < 0)) {
      results.push({
        id: 'jackpot-invalid',
        field: 'Jackpot',
        isValid: false,
        message: 'Jackpot amount must be a positive number',
        severity: 'warning'
      });
    }
  };

  const validateHotelData = (data: any, results: ValidationResult[]) => {
    // Hotel name validation
    if (!data.hotelName || data.hotelName.trim().length === 0) {
      results.push({
        id: 'hotel-name-required',
        field: 'Hotel Name',
        isValid: false,
        message: 'Hotel name is required',
        severity: 'error'
      });
    }
    
    // Location validation
    if (!data.location || data.location.trim().length === 0) {
      results.push({
        id: 'location-required',
        field: 'Location',
        isValid: false,
        message: 'Location is required',
        severity: 'error'
      });
    }
    
    // Rate validation
    if (data.rate === undefined || typeof data.rate !== 'number' || data.rate <= 0) {
      results.push({
        id: 'rate-invalid',
        field: 'Rate',
        isValid: false,
        message: 'Rate must be a positive number',
        severity: 'error'
      });
    }
    
    // Currency validation
    if (!data.currency || data.currency.trim().length === 0) {
      results.push({
        id: 'currency-required',
        field: 'Currency',
        isValid: false,
        message: 'Currency is required',
        severity: 'error'
      });
    } else if (!/^[A-Z]{3}$/.test(data.currency)) {
      results.push({
        id: 'currency-format',
        field: 'Currency',
        isValid: false,
        message: 'Currency should be a 3-letter code (e.g., USD, EUR)',
        severity: 'warning'
      });
    }
    
    // Rating validation
    if (data.rating !== undefined && (typeof data.rating !== 'number' || data.rating < 1 || data.rating > 5)) {
      results.push({
        id: 'rating-invalid',
        field: 'Rating',
        isValid: false,
        message: 'Rating must be between 1 and 5',
        severity: 'warning'
      });
    }
  };

  const validateCommodityData = (data: any, results: ValidationResult[]) => {
    // Commodity name validation
    if (!data.commodityName || data.commodityName.trim().length === 0) {
      results.push({
        id: 'commodity-name-required',
        field: 'Commodity Name',
        isValid: false,
        message: 'Commodity name is required',
        severity: 'error'
      });
    }
    
    // Category validation
    const validCategories = ['food', 'fuel', 'household', 'building_materials', 'other'];
    if (!data.category || !validCategories.includes(data.category)) {
      results.push({
        id: 'category-invalid',
        field: 'Category',
        isValid: false,
        message: 'Invalid category',
        severity: 'error'
      });
    }
    
    // Price validation
    if (data.price === undefined || typeof data.price !== 'number' || data.price <= 0) {
      results.push({
        id: 'price-invalid',
        field: 'Price',
        isValid: false,
        message: 'Price must be a positive number',
        severity: 'error'
      });
    }
    
    // Currency validation
    if (!data.currency || data.currency.trim().length === 0) {
      results.push({
        id: 'currency-required',
        field: 'Currency',
        isValid: false,
        message: 'Currency is required',
        severity: 'error'
      });
    } else if (!/^[A-Z]{3}$/.test(data.currency)) {
      results.push({
        id: 'currency-format',
        field: 'Currency',
        isValid: false,
        message: 'Currency should be a 3-letter code (e.g., USD, EUR)',
        severity: 'warning'
      });
    }
    
    // Unit validation
    if (!data.unit || data.unit.trim().length === 0) {
      results.push({
        id: 'unit-required',
        field: 'Unit',
        isValid: false,
        message: 'Unit is required (e.g., per kg, per liter)',
        severity: 'error'
      });
    }
  };

  const validateEventData = (data: any, results: ValidationResult[]) => {
    // Event name validation
    if (!data.eventName || data.eventName.trim().length === 0) {
      results.push({
        id: 'event-name-required',
        field: 'Event Name',
        isValid: false,
        message: 'Event name is required',
        severity: 'error'
      });
    }
    
    // Event type validation
    const validTypes = ['carnival', 'music_festival', 'cultural', 'sports', 'religious', 'other'];
    if (!data.eventType || !validTypes.includes(data.eventType)) {
      results.push({
        id: 'event-type-invalid',
        field: 'Event Type',
        isValid: false,
        message: 'Invalid event type',
        severity: 'error'
      });
    }
    
    // Description validation
    if (!data.description || data.description.trim().length === 0) {
      results.push({
        id: 'description-required',
        field: 'Description',
        isValid: false,
        message: 'Description is required',
        severity: 'error'
      });
    } else if (data.description.length < 10) {
      results.push({
        id: 'description-length',
        field: 'Description',
        isValid: false,
        message: 'Description should be at least 10 characters',
        severity: 'warning'
      });
    }
    
    // Start date validation
    if (!data.startDate) {
      results.push({
        id: 'start-date-required',
        field: 'Start Date',
        isValid: false,
        message: 'Start date is required',
        severity: 'error'
      });
    } else {
      const startDate = new Date(data.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (startDate < today) {
        results.push({
          id: 'start-date-past',
          field: 'Start Date',
          isValid: false,
          message: 'Start date cannot be in the past',
          severity: 'warning'
        });
      }
    }
    
    // End date validation
    if (data.endDate) {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      
      if (endDate < startDate) {
        results.push({
          id: 'end-date-before-start',
          field: 'End Date',
          isValid: false,
          message: 'End date cannot be before start date',
          severity: 'error'
        });
      }
    }
    
    // Location validation
    if (!data.location || data.location.trim().length === 0) {
      results.push({
        id: 'location-required',
        field: 'Location',
        isValid: false,
        message: 'Location is required',
        severity: 'error'
      });
    }
  };

  const validateCrossIslandRules = (data: any, results: ValidationResult[], island: string) => {
    // Add cross-island validation rules here
    // For example, currency validation based on island
    const islandCurrencies: Record<string, string> = {
      'jamaica': 'JMD',
      'barbados': 'BBD',
      'trinidad': 'TTD',
      'grenada': 'XCD',
      'svg': 'XCD',
      'stkitts': 'XCD',
      'stlucia': 'XCD',
      'antigua': 'XCD',
      'dominica': 'XCD',
      'guyana': 'GYD',
      'belize': 'BZD'
    };
    
    if (data.currency && islandCurrencies[island] && data.currency !== islandCurrencies[island]) {
      results.push({
        id: 'currency-island-mismatch',
        field: 'Currency',
        isValid: false,
        message: `Expected currency for ${island.toUpperCase()} is ${islandCurrencies[island]}`,
        severity: 'warning'
      });
    }
    
    // Add more cross-island rules as needed
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error': return <Cancel color="error" />;
      case 'warning': return <Warning color="warning" />;
      case 'success': return <CheckCircle color="success" />;
      default: return <Info color="info" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'success': return 'success';
      default: return 'info';
    }
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="h6">
            Data Quality Check
          </Typography>
          <Chip 
            label={`${overallScore}%`} 
            color={overallScore >= 90 ? 'success' : overallScore >= 70 ? 'warning' : 'error'} 
            variant="outlined"
          />
        </Box>
        
        {overallScore < 100 && (
          <Alert 
            severity={overallScore >= 70 ? 'warning' : 'error'}
            sx={{ mb: 2 }}
          >
            <AlertTitle>
              {overallScore >= 70 ? 'Quality Warnings' : 'Quality Issues'}
            </AlertTitle>
            This data entry has {validationResults.filter(r => !r.isValid).length} issues that should be addressed before approval.
          </Alert>
        )}
        
        {overallScore === 100 && (
          <Alert severity="success" sx={{ mb: 2 }}>
            <AlertTitle>Excellent Quality</AlertTitle>
            This data entry passes all quality checks and is ready for approval.
          </Alert>
        )}
        
        <LinearProgress 
          variant="determinate" 
          value={overallScore} 
          color={overallScore >= 90 ? 'success' : overallScore >= 70 ? 'warning' : 'error'}
          sx={{ mb: 2 }}
        />
        
        <List>
          {validationResults.map((result) => (
            <ListItem key={result.id} sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                {getSeverityIcon(result.severity)}
              </ListItemIcon>
              <ListItemText 
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" fontWeight={result.isValid ? 'normal' : 'bold'}>
                      {result.field}
                    </Typography>
                    <Chip 
                      label={result.isValid ? 'Pass' : 'Fail'} 
                      size="small" 
                      color={getSeverityColor(result.severity)}
                      variant="outlined"
                    />
                  </Box>
                }
                secondary={
                  <Typography 
                    variant="caption" 
                    color={result.isValid ? 'text.secondary' : `${getSeverityColor(result.severity)}.main`}
                  >
                    {result.message}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default DataQualityValidator;