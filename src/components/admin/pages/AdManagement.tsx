import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Alert,
  Snackbar,
} from '@mui/material';
import { Campaign, PendingActions, CheckCircle, Cancel } from '@mui/icons-material';
import { useState } from 'react';
import AdSubmissionsList from '../AdSubmissionsList';
import { AdSubmission } from '../../../types/admin';

const AdManagement: React.FC = () => {
  // State for selected submission and dialog
  const [selectedSubmission, setSelectedSubmission] = useState<AdSubmission | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  
  // State for snackbar notifications
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  // Handle view submission
  const handleViewSubmission = (submission: AdSubmission) => {
    setSelectedSubmission(submission);
    setViewDialogOpen(true);
  };

  // Handle approve submission
  const handleApproveSubmission = (id: string) => {
    // In production, this would update Firestore
    console.log(`Approving submission ${id}`);
    setSnackbar({
      open: true,
      message: `Submission #${id} has been approved`,
      severity: 'success',
    });
  };

  // Handle reject submission
  const handleRejectSubmission = (id: string) => {
    // In production, this would update Firestore
    console.log(`Rejecting submission ${id}`);
    setSnackbar({
      open: true,
      message: `Submission #${id} has been rejected`,
      severity: 'error',
    });
  };

  // Handle edit submission
  const handleEditSubmission = (id: string) => {
    // In production, this would open an edit form
    console.log(`Editing submission ${id}`);
    setSnackbar({
      open: true,
      message: `Edit mode for submission #${id}`,
      severity: 'info',
    });
  };

  // Handle close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Campaign sx={{ fontSize: 32, color: 'primary.main' }} />
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Ad Submissions Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Review, approve, and manage all submitted advertisements
          </Typography>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <PendingActions sx={{ fontSize: 40, color: 'warning.main' }} />
                <Box>
                  <Typography variant="h4" component="div">
                    12
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Pending Review
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CheckCircle sx={{ fontSize: 40, color: 'success.main' }} />
                <Box>
                  <Typography variant="h4" component="div">
                    45
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Approved
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Cancel sx={{ fontSize: 40, color: 'error.main' }} />
                <Box>
                  <Typography variant="h4" component="div">
                    8
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Rejected
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Campaign sx={{ fontSize: 40, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h4" component="div">
                    65
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Total Submissions
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Ad Submissions List */}
      <AdSubmissionsList 
        onViewSubmission={handleViewSubmission}
        onApproveSubmission={handleApproveSubmission}
        onRejectSubmission={handleRejectSubmission}
        onEditSubmission={handleEditSubmission}
      />

      {/* View Submission Dialog */}
      <Dialog 
        open={viewDialogOpen} 
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedSubmission && (
          <>
            <DialogTitle>
              Submission Details: {selectedSubmission.title}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Submission ID
                  </Typography>
                  <Typography variant="body1">
                    {selectedSubmission.id}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                    {selectedSubmission.status}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Category
                  </Typography>
                  <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                    {selectedSubmission.category}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Submitted By
                  </Typography>
                  <Typography variant="body1">
                    {selectedSubmission.submittedBy}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Submitted At
                  </Typography>
                  <Typography variant="body1">
                    {new Date(selectedSubmission.submittedAt).toLocaleString()}
                  </Typography>
                </Grid>
                {selectedSubmission.reviewedAt && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Reviewed At
                    </Typography>
                    <Typography variant="body1">
                      {new Date(selectedSubmission.reviewedAt).toLocaleString()}
                    </Typography>
                  </Grid>
                )}
                {selectedSubmission.reviewedBy && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Reviewed By
                    </Typography>
                    <Typography variant="body1">
                      {selectedSubmission.reviewedBy}
                    </Typography>
                  </Grid>
                )}
              </Grid>

              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom>
                Submission Data
              </Typography>
              <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
                <pre style={{ margin: 0, overflow: 'auto' }}>
                  {JSON.stringify(selectedSubmission.data, null, 2)}
                </pre>
              </Box>

              {selectedSubmission.notes && (
                <>
                  <Typography variant="h6" sx={{ mt: 3 }} gutterBottom>
                    Review Notes
                  </Typography>
                  <Alert severity="info" sx={{ mt: 1 }}>
                    {selectedSubmission.notes}
                  </Alert>
                </>
              )}
            </DialogContent>
            <DialogActions>
              {selectedSubmission.status === 'pending' && (
                <>
                  <Button 
                    onClick={() => {
                      handleRejectSubmission(selectedSubmission.id);
                      setViewDialogOpen(false);
                    }} 
                    color="error"
                  >
                    Reject
                  </Button>
                  <Button 
                    onClick={() => {
                      handleApproveSubmission(selectedSubmission.id);
                      setViewDialogOpen(false);
                    }} 
                    color="success"
                  >
                    Approve
                  </Button>
                </>
              )}
              <Button onClick={() => setViewDialogOpen(false)}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdManagement;
