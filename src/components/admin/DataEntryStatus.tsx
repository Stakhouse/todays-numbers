import { Box } from '@mui/material';
import ApprovalStatusChip from './ApprovalStatusChip';
import DataSourceChip from './DataSourceChip';
import { DataSource, ApprovalStatus } from '../../types/admin';

interface DataEntryStatusProps {
  source: DataSource;
  approvalStatus: ApprovalStatus;
  showLabels?: boolean;
  size?: 'small' | 'medium';
}

const DataEntryStatus: React.FC<DataEntryStatusProps> = ({
  source,
  approvalStatus,
  showLabels = false,
  size = 'small'
}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
      {showLabels && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <span style={{ fontSize: '0.8rem', color: 'rgba(0, 0, 0, 0.6)' }}>Source:</span>
          <DataSourceChip source={source} size={size} showTooltip={false} />
        </Box>
      )}
      {!showLabels && <DataSourceChip source={source} size={size} />}
      
      {showLabels && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <span style={{ fontSize: '0.8rem', color: 'rgba(0, 0, 0, 0.6)' }}>Status:</span>
          <ApprovalStatusChip status={approvalStatus} size={size} showTooltip={false} />
        </Box>
      )}
      {!showLabels && <ApprovalStatusChip status={approvalStatus} size={size} />}
    </Box>
  );
};

export default DataEntryStatus;