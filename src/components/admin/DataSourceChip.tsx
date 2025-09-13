import { Chip, Tooltip } from '@mui/material';
import { Lock, LockOpen } from '@mui/icons-material';
import { DataSource } from '../../types/admin';

interface DataSourceChipProps {
  source: DataSource;
  showTooltip?: boolean;
  size?: 'small' | 'medium';
}

const DataSourceChip: React.FC<DataSourceChipProps> = ({
  source,
  showTooltip = true,
  size = 'small'
}) => {
  const getSourceConfig = () => {
    switch (source) {
      case 'scraper':
        return {
          label: 'Scraper',
          color: 'info' as const,
          icon: <LockOpen />,
          tooltip: 'Automatically collected by Python scraper'
        };
      case 'admin_entry':
        return {
          label: 'Admin Entry',
          color: 'primary' as const,
          icon: <Lock />,
          tooltip: 'Manually entered by admin'
        };
      case 'manual':
        return {
          label: 'Manual Entry',
          color: 'primary' as const,
          icon: <Lock />,
          tooltip: 'Manually entered'
        };
      case 'imported':
        return {
          label: 'Imported',
          color: 'secondary' as const,
          icon: <LockOpen />,
          tooltip: 'Imported from external source'
        };
      default:
        return {
          label: source,
          color: 'default' as const,
          icon: undefined,
          tooltip: ''
        };
    }
  };

  const config = getSourceConfig();

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

export default DataSourceChip;