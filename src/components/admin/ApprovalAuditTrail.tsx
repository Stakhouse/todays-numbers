import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Divider,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Pending,
  Schedule,
  Warning,
  History,
  Refresh,
  Person,
  CalendarToday,
  Info,
} from '@mui/icons-material';
import { useState } from 'react';
import { AuditLogEntry } from '../../types/admin';
import ApprovalStatusChip from './ApprovalStatusChip';

interface ApprovalAuditTrailProps {
  entries: AuditLogEntry[];
  onRefresh?: () => void;
  loading?: boolean;
}

// Mock data for demonstration
const mockAuditEntries: AuditLogEntry[] = [
  {
    id: '1',
    userId: 'admin1',
    userEmail: 'admin@jamaica.gov.jm',
    action: 'APPROVED',
    resourceType: 'lottery',
    resourceId: 'lottery-123',
    details: {
      island: 'jamaica',
      game: 'Lotto',
      drawDate: '2025-09-13',
      numbers: [12, 25, 7, 33, 41, 5]
    },
    timestamp: new Date(Date.now() - 3600000),
    ipAddress: '192.168.1.100'
  },
  {
    id: '2',
    userId: 'admin2',
    userEmail: 'admin@barbados.gov.bb',
    action: 'REJECTED',
    resourceType: 'hotel',
    resourceId: 'hotel-456',
    details: {
      hotelName: 'Oceanview Resort',
      reason: 'Rate seems too high compared to competitors'
    },
    timestamp: new Date(Date.now() - 7200000),
    ipAddress: '192.168.1.101'
  },
  {
    id: '3',
    userId: 'admin3',
    userEmail: 'admin@svg.gov.vc',
    action: 'REQUESTED_CHANGES',
    resourceType: 'commodity',
    resourceId: 'commodity-789',
    details: {
      commodityName: 'White Rice',
      request: 'Please verify the source of this price update'
    },
    timestamp: new Date(Date.now() - 10800000),
    ipAddress: '192.168.1.102'
  },
  {
    id: '4',
    userId: 'admin1',
    userEmail: 'admin@jamaica.gov.jm',
    action: 'APPROVED',
    resourceType: 'event',
    resourceId: 'event-101',
    details: {
      eventName: 'Annual Carnival Parade',
      startDate: '2025-09-20'
    },
    timestamp: new Date(Date.now() - 14400000),
    ipAddress: '192.168.1.100'
  },
];

const ApprovalAuditTrail: React.FC<ApprovalAuditTrailProps> = ({
  entries = mockAuditEntries,
  onRefresh,
  loading = false,
}) => {
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedEntry(expandedEntry === id ? null : id);
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'APPROVED':
        return <CheckCircle color="success" />;
      case 'REJECTED':
        return <Cancel color="error" />;
      case 'REQUESTED_CHANGES':
        return <Warning color="warning" />;
      case 'SUBMITTED':
        return <Pending color="info" />;
      default:
        return <Info color="action" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'error';
      case 'REQUESTED_CHANGES':
        return 'warning';
      case 'SUBMITTED':
        return 'info';
      default:
        return 'default';
    }
  };

  const getResourceTypeLabel = (type: string) => {
    switch (type) {
      case 'lottery':
        return 'Lottery';
      case 'hotel':
        return 'Hotel';
      case 'commodity':
        return 'Commodity';
      case 'event':
        return 'Event';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'APPROVED':
        return 'Approved';
      case 'REJECTED':
        return 'Rejected';
      case 'REQUESTED_CHANGES':
        return 'Requested Changes';
      case 'SUBMITTED':
        return 'Submitted';
      default:
        return action;
    }
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <History color="action" />
            <Typography variant="h6">
              Approval Audit Trail
            </Typography>
          </Box>
          <IconButton onClick={onRefresh} disabled={loading}>
            <Refresh />
          </IconButton>
        </Box>

        <List>
          {entries.map((entry, index) => (
            <Box key={entry.id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'grey.100', color: 'grey.600' }}>
                    {getActionIcon(entry.action)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Typography variant="body2" fontWeight={600}>
                        {entry.userEmail}
                      </Typography>
                      <Chip
                        label={getActionLabel(entry.action)}
                        color={getActionColor(entry.action) as any}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={getResourceTypeLabel(entry.resourceType)}
                        size="small"
                        variant="outlined"
                      />
                      <Typography variant="caption" color="text.secondary">
                        {new Date(entry.timestamp).toLocaleString()}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {entry.details?.island && `Island: ${entry.details.island.toUpperCase()} • `}
                        {entry.details?.game && `Game: ${entry.details.game} • `}
                        {entry.details?.hotelName && `Hotel: ${entry.details.hotelName} • `}
                        {entry.details?.commodityName && `Commodity: ${entry.details.commodityName} • `}
                        {entry.details?.eventName && `Event: ${entry.details.eventName}`}
                      </Typography>
                      {expandedEntry === entry.id && (
                        <Box sx={{ mt: 1, p: 1, backgroundColor: 'grey.50', borderRadius: 1 }}>
                          <Typography variant="caption" component="div" color="text.secondary">
                            Details:
                          </Typography>
                          <pre style={{ margin: 0, fontSize: '0.75rem', whiteSpace: 'pre-wrap' }}>
                            {JSON.stringify(entry.details, null, 2)}
                          </pre>
                          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              IP: {entry.ipAddress}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {entry.resourceId}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  }
                />
                <IconButton 
                  size="small" 
                  onClick={() => toggleExpand(entry.id)}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  <Info fontSize="small" />
                </IconButton>
              </ListItem>
              {index < entries.length - 1 && <Divider />}
            </Box>
          ))}
        </List>

        {entries.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <History sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              No audit trail entries found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Approval actions will appear here once recorded
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ApprovalAuditTrail;