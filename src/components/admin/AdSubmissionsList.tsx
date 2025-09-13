import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Tooltip,
  CircularProgress,
  Stack,
  Button,
} from '@mui/material';
import {
  Search,
  FilterList,
  Visibility,
  CheckCircle,
  Cancel,
  Edit,
} from '@mui/icons-material';
import { AdSubmission, AdStatus, AdCategory, AdSubmissionFilters } from '../../types/admin';

// Mock data for development - will be replaced with Firestore data
const MOCK_SUBMISSIONS: AdSubmission[] = [
  {
    id: '1',
    title: 'Weekly Lottery Results',
    category: 'lottery',
    islandId: 'vc',
    status: 'approved',
    submittedBy: 'system@todaysnumbers.com',
    submittedAt: new Date('2023-09-01T10:00:00'),
    reviewedAt: new Date('2023-09-01T14:30:00'),
    reviewedBy: 'admin@todaysnumbers.com',
    data: { drawDate: new Date('2023-09-01'), lotteryType: 'National' },
  },
  {
    id: '2',
    title: 'Beach Resort Special Rates',
    category: 'hotel',
    islandId: 'lc',
    status: 'pending',
    submittedBy: 'resort@example.com',
    submittedAt: new Date('2023-09-02T09:15:00'),
    data: {
      hotelName: 'Tropical Beach Resort',
      startDate: new Date('2023-10-01'),
      endDate: new Date('2023-12-15'),
    },
  },
  {
    id: '3',
    title: 'Local Football Match Results',
    category: 'sports',
    islandId: 'gd',
    status: 'rejected',
    submittedBy: 'sports@example.com',
    submittedAt: new Date('2023-09-01T18:45:00'),
    reviewedAt: new Date('2023-09-02T10:20:00'),
    reviewedBy: 'admin@todaysnumbers.com',
    data: { gameDate: new Date('2023-09-01'), sportType: 'Football' },
    notes: 'Incorrect scores provided. Please verify and resubmit.',
  },
  {
    id: '4',
    title: 'Weekend Music Festival',
    category: 'event',
    islandId: 'tt',
    status: 'approved',
    submittedBy: 'events@example.com',
    submittedAt: new Date('2023-09-03T11:30:00'),
    reviewedAt: new Date('2023-09-03T15:45:00'),
    reviewedBy: 'admin@todaysnumbers.com',
    data: {
      eventName: 'Island Rhythms Festival',
      startDate: new Date('2023-09-15'),
      endDate: new Date('2023-09-17'),
    },
  },
  {
    id: '5',
    title: 'Fresh Produce Market Prices',
    category: 'commodity',
    islandId: 'dm',
    status: 'pending',
    submittedBy: 'market@example.com',
    submittedAt: new Date('2023-09-04T08:00:00'),
    data: { commodityName: 'Various Produce', category: 'Agriculture' },
  },
];

// Mock island data
const ISLANDS = [
  { id: 'vc', name: 'St. Vincent & Grenadines', flag: '🇻🇨' },
  { id: 'lc', name: 'St. Lucia', flag: '🇱🇨' },
  { id: 'dm', name: 'Dominica', flag: '🇩🇲' },
  { id: 'gd', name: 'Grenada', flag: '🇬🇩' },
  { id: 'tt', name: 'Trinidad & Tobago', flag: '🇹🇹' },
];

interface AdSubmissionsListProps {
  onViewSubmission?: (submission: AdSubmission) => void;
  onApproveSubmission?: (id: string) => void;
  onRejectSubmission?: (id: string) => void;
  onEditSubmission?: (id: string) => void;
}

const AdSubmissionsList: React.FC<AdSubmissionsListProps> = ({
  onViewSubmission,
  onApproveSubmission,
  onRejectSubmission,
  onEditSubmission,
}) => {
  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // State for filtering
  const [filters, setFilters] = useState<AdSubmissionFilters>({
    status: 'all',
    category: 'all',
    islandId: 'all',
    searchTerm: '',
  });

  // State for submissions data
  const [submissions, setSubmissions] = useState<AdSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  // Load submissions data (mock for now, will be replaced with Firestore)
  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      setSubmissions(MOCK_SUBMISSIONS);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter submissions based on current filters
  const filteredSubmissions = submissions.filter((submission) => {
    // Filter by status
    if (filters.status !== 'all' && submission.status !== filters.status) {
      return false;
    }

    // Filter by category
    if (filters.category !== 'all' && submission.category !== filters.category) {
      return false;
    }

    // Filter by island
    if (filters.islandId !== 'all' && submission.islandId !== filters.islandId) {
      return false;
    }

    // Filter by search term
    if (filters.searchTerm && filters.searchTerm.trim() !== '') {
      const searchTerm = filters.searchTerm.toLowerCase();
      return (
        submission.title.toLowerCase().includes(searchTerm) ||
        submission.id.toLowerCase().includes(searchTerm)
      );
    }

    return true;
  });

  // Handle page change
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof AdSubmissionFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPage(0); // Reset to first page when filters change
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get island name by ID
  const getIslandName = (islandId: string) => {
    const island = ISLANDS.find((i) => i.id === islandId);
    return island ? `${island.flag} ${island.name}` : islandId;
  };

  // Render status chip
  const renderStatusChip = (status: AdStatus) => {
    switch (status) {
      case 'pending':
        return <Chip label="Pending" color="warning" size="small" />;
      case 'approved':
        return <Chip label="Approved" color="success" size="small" />;
      case 'rejected':
        return <Chip label="Rejected" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  // Render category chip
  const renderCategoryChip = (category: AdCategory) => {
    const categoryColors: Record<AdCategory, any> = {
      lottery: { bg: '#e3f2fd', color: '#1976d2' },
      sports: { bg: '#e8f5e9', color: '#2e7d32' },
      hotel: { bg: '#fff8e1', color: '#f57c00' },
      event: { bg: '#f3e5f5', color: '#7b1fa2' },
      commodity: { bg: '#e0f2f1', color: '#00796b' },
    };

    const style = categoryColors[category] || { bg: '#f5f5f5', color: '#757575' };

    return (
      <Chip
        label={category.charAt(0).toUpperCase() + category.slice(1)}
        size="small"
        sx={{
          backgroundColor: style.bg,
          color: style.color,
          fontWeight: 500,
        }}
      />
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems={{ xs: 'stretch', sm: 'center' }}
        >
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            fullWidth
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              value={filters.status}
              label="Status"
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="category-filter-label">Category</InputLabel>
            <Select
              labelId="category-filter-label"
              value={filters.category}
              label="Category"
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <MenuItem value="all">All Categories</MenuItem>
              <MenuItem value="lottery">Lottery</MenuItem>
              <MenuItem value="sports">Sports</MenuItem>
              <MenuItem value="hotel">Hotel</MenuItem>
              <MenuItem value="event">Event</MenuItem>
              <MenuItem value="commodity">Commodity</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="island-filter-label">Island</InputLabel>
            <Select
              labelId="island-filter-label"
              value={filters.islandId}
              label="Island"
              onChange={(e) => handleFilterChange('islandId', e.target.value)}
            >
              <MenuItem value="all">All Islands</MenuItem>
              {ISLANDS.map((island) => (
                <MenuItem key={island.id} value={island.id}>
                  {island.flag} {island.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() =>
              setFilters({
                status: 'all',
                category: 'all',
                islandId: 'all',
                searchTerm: '',
              })
            }
          >
            Clear
          </Button>
        </Stack>
      </Paper>

      {/* Submissions Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : filteredSubmissions.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No submissions found matching the current filters.
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="ad submissions table">
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Island</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Submitted</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredSubmissions
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((submission) => (
                      <TableRow hover key={submission.id}>
                        <TableCell component="th" scope="row">
                          {submission.title}
                        </TableCell>
                        <TableCell>{renderCategoryChip(submission.category)}</TableCell>
                        <TableCell>{getIslandName(submission.islandId)}</TableCell>
                        <TableCell>{renderStatusChip(submission.status)}</TableCell>
                        <TableCell>{formatDate(submission.submittedAt)}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => onViewSubmission?.(submission)}
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          {submission.status === 'pending' && (
                            <>
                              <Tooltip title="Approve">
                                <IconButton
                                  size="small"
                                  color="success"
                                  onClick={() => onApproveSubmission?.(submission.id)}
                                >
                                  <CheckCircle fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Reject">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => onRejectSubmission?.(submission.id)}
                                >
                                  <Cancel fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}

                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => onEditSubmission?.(submission.id)}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredSubmissions.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>
    </Box>
  );
};

export default AdSubmissionsList;