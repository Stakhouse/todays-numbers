import { Chip, Tooltip } from '@mui/material';
import { 
  Schedule, 
  Pending, 
  CheckCircle, 
  Cancel, 
  Warning, 
  History,
  Lock,
  LockOpen
} from '@mui/icons-material';
import { ApprovalStatus } from '../../types/admin';

interface ApprovalStatusChipProps {
  status: ApprovalStatus;
  showTooltip?: boolean;
  showIcon?: boolean;
  size?: 'small' | 'medium';
}

const ApprovalStatusChip: React.FC<ApprovalStatusChipProps> = ({
  status,
  showTooltip = true,
  showIcon = true,
  size = 'small'
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'draft':
        return {
          label: 'Draft',
          color: 'info' as const,
          icon: showIcon ? <Schedule /> : undefined,
          tooltip: 'Initial state for manual entries'
        };
      case 'pending_approval':
        return {
          label: 'Pending',
          color: 'warning' as const,
          icon: showIcon ? <Pending /> : undefined,
          tooltip: 'Awaiting admin review'
        };
      case 'approved':
        return {
          label: 'Approved',
          color: 'success' as const,
          icon: showIcon ? <CheckCircle /> : undefined,
          tooltip: 'Approved and ready to publish'
        };
      case 'published':
        return {
          label: 'Published',
          color: 'success' as const,
          icon: showIcon ? <CheckCircle /> : undefined,
          tooltip: 'Live on frontend'
        };
      case 'rejected':
        return {
          label: 'Rejected',
          color: 'error' as const,
          icon: showIcon ? <Cancel /> : undefined,
          tooltip: 'Rejected by admin'
        };
      case 'requires_changes':
        return {
          label: 'Changes Required',
          color: 'secondary' as const,
          icon: showIcon ? <Warning /> : undefined,
          tooltip: 'Admin requested modifications'
        };
      case 'archived':
        return {
          label: 'Archived',
          color: 'default' as const,
          icon: showIcon ? <History /> : undefined,
          tooltip: 'Removed from active use'
        };
      default:
        return {
          label: status,
          color: 'default' as const,
          icon: undefined,
          tooltip: ''
        };
    }
  };

  const config = getStatusConfig();

  const chip = (
    <Chip
      label={config.label}
      color={config.color}
      icon={config.icon}
      size={size}
      variant="outlined"
    />
  );

  return showTooltip && config.tooltip ? (
    <Tooltip title={config.tooltip}>
      {chip}
    </Tooltip>
  ) : chip;
};

export default ApprovalStatusChip;