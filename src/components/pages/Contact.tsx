import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Alert,
  Tabs,
  Tab,
  Paper,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  ContactMail,
  Send,
  Campaign,
  Phone,
  Email,
  LocationOn,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`contact-tabpanel-${index}`}
      aria-labelledby={`contact-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const Contact: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: currentUser?.displayName || '',
    email: currentUser?.email || '',
    subject: '',
    message: '',
  });

  // Submission form state
  const [submissionForm, setSubmissionForm] = useState({
    title: '',
    category: '',
    island: '',
    description: '',
    contactInfo: currentUser?.email || '',
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setSubmitSuccess(false);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setContactForm({
        name: currentUser?.displayName || '',
        email: currentUser?.email || '',
        subject: '',
        message: '',
      });
    }, 2000);
  };

  const handleSubmissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setSubmissionForm({
        title: '',
        category: '',
        island: '',
        description: '',
        contactInfo: currentUser?.email || '',
      });
    }, 2000);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <ContactMail sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Contact Us
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Get in touch with Today's Numbers team
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Contact Information */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: 'fit-content', mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                🏝️ Caribbean Data Hub
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Email sx={{ color: 'primary.main' }} />
                  <Typography variant="body2">
                    info@todaysnumbers.com
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Phone sx={{ color: 'primary.main' }} />
                  <Typography variant="body2">
                    +1 (888) TODAY-NUM
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LocationOn sx={{ color: 'primary.main' }} />
                  <Typography variant="body2">
                    Caribbean Islands
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Quick Contact Info */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                📞 Quick Contact
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                For urgent lottery inquiries or data corrections, contact us directly.
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Response Times:</strong>
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Chip label="General Inquiries: 24 hours" size="small" color="info" />
                <Chip label="Data Issues: 4 hours" size="small" color="warning" />
                <Chip label="Technical Support: 8 hours" size="small" color="secondary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Forms */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 0 }}>
            {/* Tabs for different contact types */}
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  minHeight: 48,
                  textTransform: 'none',
                },
              }}
            >
              <Tab 
                icon={<ContactMail />} 
                iconPosition="start"
                label="General Inquiry" 
              />
              {currentUser && !isAdmin && (
                <Tab 
                  icon={<Campaign />} 
                  iconPosition="start"
                  label="Submit Content" 
                />
              )}
            </Tabs>

            <Box sx={{ p: 4 }}>
              {submitSuccess && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  <Typography variant="body2">
                    Thank you! Your {tabValue === 0 ? 'message' : 'submission'} has been received. 
                    We'll get back to you within 24 hours.
                  </Typography>
                </Alert>
              )}

              {/* General Contact Form */}
              <TabPanel value={tabValue} index={0}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Send us a Message
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Have a question, suggestion, or need help? We'd love to hear from you.
                </Typography>

                <Box component="form" onSubmit={handleContactSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Your Name"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        required
                        disabled={isSubmitting}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        required
                        disabled={isSubmitting}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Subject"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        required
                        disabled={isSubmitting}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Message"
                        multiline
                        rows={6}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        required
                        disabled={isSubmitting}
                        placeholder="Please provide as much detail as possible about your inquiry..."
                      />
                    </Grid>
                  </Grid>

                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={isSubmitting ? <CircularProgress size={20} /> : <Send />}
                    disabled={isSubmitting}
                    sx={{ mt: 3 }}
                    size="large"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </Box>
              </TabPanel>

              {/* Content Submission Form */}
              {currentUser && !isAdmin && (
                <TabPanel value={tabValue} index={1}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Submit Content for Review
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Submit ads, events, or other content for inclusion on Today's Numbers.
                  </Typography>

                  <Box component="form" onSubmit={handleSubmissionSubmit}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Content Title"
                          value={submissionForm.title}
                          onChange={(e) => setSubmissionForm({ ...submissionForm, title: e.target.value })}
                          required
                          disabled={isSubmitting}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          select
                          label="Category"
                          value={submissionForm.category}
                          onChange={(e) => setSubmissionForm({ ...submissionForm, category: e.target.value })}
                          required
                          disabled={isSubmitting}
                          SelectProps={{
                            native: true,
                          }}
                        >
                          <option value="">Select Category</option>
                          <option value="lottery">Lottery</option>
                          <option value="sports">Sports</option>
                          <option value="hotel">Hotel/Tourism</option>
                          <option value="event">Event</option>
                          <option value="commodity">Commodity</option>
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          select
                          label="Island"
                          value={submissionForm.island}
                          onChange={(e) => setSubmissionForm({ ...submissionForm, island: e.target.value })}
                          required
                          disabled={isSubmitting}
                          SelectProps={{
                            native: true,
                          }}
                        >
                          <option value="">Select Island</option>
                          <option value="jamaica">🇯🇲 Jamaica</option>
                          <option value="barbados">🇧🇧 Barbados</option>
                          <option value="trinidad">🇹🇹 Trinidad & Tobago</option>
                          <option value="bahamas">🇧🇸 Bahamas</option>
                          <option value="antigua">🇦🇬 Antigua & Barbuda</option>
                          <option value="st-lucia">🇱🇨 St. Lucia</option>
                        </TextField>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Content Description"
                          multiline
                          rows={6}
                          value={submissionForm.description}
                          onChange={(e) => setSubmissionForm({ ...submissionForm, description: e.target.value })}
                          required
                          disabled={isSubmitting}
                          placeholder="Provide details about your submission, including dates, times, prices, or other relevant information..."
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Your Contact Information"
                          value={submissionForm.contactInfo}
                          onChange={(e) => setSubmissionForm({ ...submissionForm, contactInfo: e.target.value })}
                          required
                          disabled={isSubmitting}
                          placeholder="Email or phone number for follow-up questions"
                        />
                      </Grid>
                    </Grid>

                    <Alert severity="info" sx={{ mt: 3 }}>
                      <Typography variant="body2">
                        All submissions are reviewed by our team before publication. 
                        You'll receive an email confirmation once your content is approved.
                      </Typography>
                    </Alert>

                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={isSubmitting ? <CircularProgress size={20} /> : <Campaign />}
                      disabled={isSubmitting}
                      sx={{ mt: 3 }}
                      size="large"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit for Review'}
                    </Button>
                  </Box>
                </TabPanel>
              )}

              {/* Login prompt for non-logged in users */}
              {!currentUser && (
                <Alert severity="info" sx={{ mt: 3 }}>
                  <Typography variant="body2">
                    <strong>Want to submit content?</strong> Create an account or sign in to submit 
                    ads, events, and other content directly to our review team.
                  </Typography>
                </Alert>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Contact;
