import React, { useState } from 'react';
import { Container, Typography, Box, Grid, Paper, Button } from '@mui/material';
import { Add, Pending, Dashboard } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import ManualDataEntryForm from '../components/admin/ManualDataEntryForm';
import PendingDataReview from '../components/admin/PendingDataReview';
import ApprovalDashboard from '../components/admin/pages/ApprovalDashboard';
import { ApprovalQueueItem } from '../types/admin';

const AdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [manualEntryOpen, setManualEntryOpen] = useState(false);
  const [selectedDataType, setSelectedDataType] = useState<'lottery' | 'hotel' | 'commodity' | 'event'>('lottery');
  const [selectedIsland, setSelectedIsland] = useState('jamaica');
  
  // Mock data for pending items - in real app this would come from API/context
  const mockPendingItems: ApprovalQueueItem[] = [
    {
      id: 'mock-1',
      title: 'Jamaica Lottery Results - Cash Pot',
      dataType: 'lottery',
      island: 'jamaica',
      summary: 'Cash Pot lottery results for Jamaica',
      source: 'scraper', // Use valid DataSource value
      submittedBy: 'system-bot', // Should be string, not object
      submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      priority: 'high',
      estimatedReviewTime: 15, // Should be number (minutes)
      dataPreview: {
        game: 'Cash Pot',
        numbers: [5],
        drawDate: new Date().toLocaleDateString()
      }
    }
  ];

  const handleDataEntrySubmit = (data: any) => {
    console.log('Submitted data entry:', data);
    setManualEntryOpen(false);
    // TODO: Send to approval workflow
  };

  const handleRefreshPending = () => {
    console.log('Refreshing pending items...');
    // TODO: Fetch latest pending items
  };

  const handleApprove = (id: string, notes?: string) => {
    console.log('Approving item:', id, notes);
    // TODO: Approve item
  };

  const handleReject = (id: string, reason: string) => {
    console.log('Rejecting item:', id, reason);
    // TODO: Reject item
  };

  const handleRequestChanges = (id: string, changes: string) => {
    console.log('Requesting changes for item:', id, changes);
    // TODO: Request changes
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Welcome back, {currentUser?.email}
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Manual Data Entry
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setManualEntryOpen(true)}
                sx={{ mb: 2 }}
              >
                Add New Entry
              </Button>
              <Typography variant="body2" color="text.secondary">
                Manually add lottery results, hotel rates, commodity prices, and events.
                All entries require admin approval before publishing.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Pending color="warning" />
                Pending Reviews ({mockPendingItems.length})
              </Typography>
              <PendingDataReview
                items={mockPendingItems}
                onRefresh={handleRefreshPending}
                onApprove={handleApprove}
                onReject={handleReject}
                onRequestChanges={handleRequestChanges}
                loading={false}
              />
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Dashboard color="primary" />
                Approval Dashboard
              </Typography>
              <ApprovalDashboard />
            </Paper>
          </Grid>
        </Grid>
      </Box>
      
      <ManualDataEntryForm
        dataType={selectedDataType}
        island={selectedIsland}
        open={manualEntryOpen}
        onClose={() => setManualEntryOpen(false)}
        onSubmit={handleDataEntrySubmit}
        loading={false}
      />
    </Container>
  );
};

export default AdminDashboard;