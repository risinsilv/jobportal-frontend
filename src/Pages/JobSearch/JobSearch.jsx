import React, { useState, useMemo, useEffect } from 'react';
import route from '../../Navigation/Navigation';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Stack,
  Paper,
  TextField,
  Button,
  Grid,
  InputAdornment,
  CircularProgress,
  Alert,
  Snackbar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Link,
} from '@mui/material';
import {
  LocationOn,
  Business,
  AccessTime,
  Search,
  AttachMoney,
  Work,
  Close,
  Language,
  Email,
  Phone,
  CalendarToday,
  Assignment,
  WorkOutline,
  School,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import instance from '../../Service/AxiosOrder';

// Styled components
const SearchContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#f8fafc',
  minHeight: '100vh',
  paddingTop: theme.spacing(3),
}));

const SearchHeader = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  background: 'linear-gradient(135deg, #62cff4 15%, #2c67f2 100%)',
  color: 'white',
  boxShadow: '0 4px 20px rgba(44, 103, 242, 0.15)',
}));

const JobCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
  border: '1px solid rgba(0, 0, 0, 0.06)',
  transition: 'all 0.3s ease',
  marginBottom: theme.spacing(2),
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
    borderColor: 'black',
    backgroundColor: 'black',
    color: 'white',
    '& .MuiTypography-root': {
      color: 'white',
    },
    '& .MuiSvgIcon-root': {
      color: 'white',
    },
    '& .MuiChip-root': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      color: 'white',
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
  },
}));

const JobDetailDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.spacing(2),
    maxWidth: '800px',
    maxHeight: '90vh',
    margin: theme.spacing(2),
  },
}));

const JobDetailHeader = styled(Box)(({ theme }) => ({
  background: 'black',
  color: 'white',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
}));

const SectionHeader = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
  marginTop: theme.spacing(3),
  color: theme.palette.text.primary,
  fontSize: '1.1rem',
  '&:first-of-type': {
    marginTop: 0,
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    background: 'rgba(255, 255, 255, 0.15)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: theme.spacing(1.5),
    // border: '1px solid rgba(255, 255, 255, 0.3)',
    transition: 'all 0.3s ease',
    '& fieldset': {
      border: 'none',
    },
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.5)',
    },
    '&.Mui-focused': {
      background: 'rgba(255, 255, 255, 0.25)',
      border: '1px solid rgba(255, 255, 255, 0.7)',
      boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
    }
  },
  '& .MuiInputBase-input': {
    color: '#fff',
    fontWeight: 500,
    '&::placeholder': {
      color: 'rgba(255, 255, 255, 0.7)',
      opacity: 1,
    },
  },
  '& .MuiInputAdornment-root .MuiSvgIcon-root': {
    color: 'rgba(255, 255, 255, 0.8)',
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'black',
  border: 0,
  borderRadius: theme.spacing(1.5),
  boxShadow: '0 4px 15px rgba(44, 103, 242, 0.3)',
  color: 'white',
  height: 56,
  padding: '0 30px',
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #4fbff0 30%, #1f5ae8 90%)',
    boxShadow: '0 6px 20px rgba(44, 103, 242, 0.4)',
    transform: 'translateY(-1px)',
  },
}));

const JobSearch = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobDetailOpen, setJobDetailOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState(new Set());

  // Fetch jobs from API
  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        const jobSeekerId = localStorage.getItem('jobSeekerId') || localStorage.getItem('userId');
        
        if (token && jobSeekerId) {
          const response = await instance.get(`/api/applications/jobseeker/${jobSeekerId}`);
          const appliedJobIds = response.data.map(app => app.jobId);
          setAppliedJobs(new Set(appliedJobIds));
        }
      } catch (error) {
        console.log('Failed to fetch applied jobs:', error);
        // Don't show error to user as this is not critical
      }
    };

    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication required. Please login again.');
          return;
        }

        console.log('Fetching jobs from API...');
        const response = await instance.get('/api/jobpostings', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log('Jobs fetched successfully:', response.data);
        
        // Fetch employer details for each job
        const jobsWithEmployerDetails = await Promise.all(
          (response.data || []).map(async (job) => {
            try {
              // Fetch employer profile details for company name only
              if (job.employerId) {
                const employerResponse = await instance.get(`/api/employers/${job.employerId}`);

                return {
                  ...job,
                  employer: {
                    ...job.employer,
                    companyName: employerResponse.data.companyName || job.companyName,
                    companyWebsite: employerResponse.data.companyWebsite,
                    companyAddress: employerResponse.data.companyAddress,
                    contactInfo: employerResponse.data.contactInfo,
                    position: employerResponse.data.position,
                  }
                };
              }
              return job;
            } catch (employerError) {
              console.log('Error fetching employer details for job:', job.id, employerError);
              return job; // Return original job if employer details fetch fails
            }
          })
        );

        setJobs(jobsWithEmployerDetails);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        
        let errorMessage = 'Failed to load job postings.';
        
        if (error.response?.status === 401) {
          errorMessage = 'Authentication failed. Please login again.';
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        setError(errorMessage);
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: 'error'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppliedJobs();
    fetchJobs();
  }, []);

  const handleSearch = () => {
    // Search functionality is handled by the filteredJobs useMemo hook
    console.log('Searching for:', { keyword: searchKeyword, location: searchLocation });
  };

  const handleClearSearch = () => {
    setSearchKeyword('');
    setSearchLocation('');
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setJobDetailOpen(true);
  };

  const handleCloseJobDetail = () => {
    setJobDetailOpen(false);
    setSelectedJob(null);
  };

  // Handle job application
  const handleApplyJob = async (jobId) => {
    try {
      setIsApplying(true);
      
      // Get jobSeekerId from localStorage (assuming it's stored there after login)
      const jobSeekerId = localStorage.getItem('jobSeekerId') || localStorage.getItem('userId');
      
      if (!jobSeekerId) {
        setSnackbar({
          open: true,
          message: 'Please login as a job seeker to apply for jobs.',
          severity: 'error'
        });
        return;
      }

      // Create application data according to ApplicationsDto
      const applicationData = {
        jobSeekerId: parseInt(jobSeekerId),
        jobId: parseInt(jobId)
      };

      console.log('Submitting application:', applicationData);

      // POST to the applications endpoint
      const response = await instance.post('/api/applications', applicationData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Application submitted successfully:', response.data);

      // Add job to applied jobs set
      setAppliedJobs(prev => new Set([...prev, jobId]));

      // Show success message
      setSnackbar({
        open: true,
        message: 'Application submitted successfully!',
        severity: 'success'
      });

      // Close job detail dialog
      setJobDetailOpen(false);

    } catch (error) {
      console.error('Error submitting application:', error);
      
      let errorMessage = 'Failed to submit application. Please try again.';
      
      if (error.response?.status === 400) {
        errorMessage = 'Invalid application data. Please check your information.';
      } else if (error.response?.status === 409) {
        errorMessage = 'You have already applied for this job.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setIsApplying(false);
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return '1 day ago';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 14) return '1 week ago';
      if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
      return `${Math.ceil(diffDays / 30)} months ago`;
    } catch (error) {
      return 'Recently';
    }
  };
  // Filter jobs based on search criteria
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const keywordMatch = !searchKeyword || 
        job.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        (job.employer?.companyName && job.employer.companyName.toLowerCase().includes(searchKeyword.toLowerCase()));
      
      const locationMatch = !searchLocation || 
        job.location.toLowerCase().includes(searchLocation.toLowerCase());
      
      return keywordMatch && locationMatch;
    });
  }, [searchKeyword, searchLocation, jobs]);

  return (
    <SearchContainer>
      <Container maxWidth="lg">
        <SearchHeader>
          <Typography variant="h6" opacity={0.9} gutterBottom>
            Find your next career opportunity
          </Typography>
          
          {/* Search Form */}
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} md={5}>
              <StyledTextField
                fullWidth
                placeholder="Job title, keywords, or company"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StyledTextField
                fullWidth
                placeholder="City, state, or country"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn sx={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Stack direction="row" spacing={1} sx={{ height: '100%' }}>
                <GradientButton
                  onClick={handleSearch}
                  startIcon={<Search />}
                  sx={{ flexGrow: 1 }}
                >
                  Search
                </GradientButton>
                {(searchKeyword || searchLocation) && (
                  <Button
                    variant="outlined"
                    onClick={handleClearSearch}
                    sx={{
                      color: 'white',
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    Clear
                  </Button>
                )}
              </Stack>
            </Grid>
          </Grid>
        </SearchHeader>

        <Box sx={{ mb: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" color="text.secondary">
              {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
              {(searchKeyword || searchLocation) && (
                <Typography component="span" color="primary.main" sx={{ ml: 1 }}>
                  {searchKeyword && `for "${searchKeyword}"`}
                  {searchKeyword && searchLocation && ' '}
                  {searchLocation && `in "${searchLocation}"`}
                </Typography>
              )}
            </Typography>
            
            {(searchKeyword || searchLocation) && (
              <Button
                variant="text"
                onClick={handleClearSearch}
                sx={{ color: 'text.secondary' }}
              >
                Show all jobs
              </Button>
            )}
          </Stack>
        </Box>

        {/* Job Cards */}
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={50} />
          </Box>
        ) : error ? (
          <Paper
            sx={{
              p: 6,
              textAlign: 'center',
              bgcolor: 'grey.50',
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" color="error" gutterBottom>
              {error}
            </Typography>
            <Button
              variant="contained"
              onClick={() => window.location.reload()}
              sx={{
                mt: 2,
                background: 'linear-gradient(45deg, #62cff4 30%, #2c67f2 90%)',
                color: 'white',
              }}
            >
              Try Again
            </Button>
          </Paper>
        ) : filteredJobs.length > 0 ? (
          <Stack spacing={2}>
            {filteredJobs.map((job) => (
              <JobCard key={job.id} onClick={() => handleJobClick(job)}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" spacing={3} alignItems="center">
                    {/* Company Logo */}
                    <Avatar
                      sx={{
                        width: 60,
                        height: 60,
                        bgcolor: 'primary.main',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                      }}
                    >
                      {job.employer?.companyName ? job.employer.companyName.charAt(0).toUpperCase() : 'J'}
                    </Avatar>

                    {/* Job Details */}
                    <Box sx={{ flexGrow: 1 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography
                            variant="h6"
                            component="h3"
                            fontWeight="bold"
                            color="text.primary"
                            gutterBottom
                          >
                            {job.title}
                          </Typography>
                          
                          <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 2 }}>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                              <Business sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary">
                                {job.employer?.companyName || 'Company Name Not Available'}
                              </Typography>
                            </Stack>
                            
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                              <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary">
                                {job.location}
                              </Typography>
                            </Stack>
                            
                            {job.salary && (
                              <Stack direction="row" alignItems="center" spacing={0.5}>
                                <AttachMoney sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                  {job.salary}
                                </Typography>
                              </Stack>
                            )}
                          </Stack>

                          {/* Job chips */}
                          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
                            <Chip
                              icon={<Work />}
                              label={job.status || 'Open'}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                            {job.employmentType && (
                              <Chip
                                label={job.employmentType}
                                size="small"
                                variant="outlined"
                              />
                            )}
                            {job.experience && (
                              <Chip
                                label={job.experience}
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </Stack>

                          {/* Job description preview */}
                          {job.description && (
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ 
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                mt: 1
                              }}
                            >
                              {job.description}
                            </Typography>
                          )}
                        </Box>

                        {/* Posted Date */}
                        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ ml: 2 }}>
                          <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(job.createdAt)}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </JobCard>
            ))}
          </Stack>
        ) : (
          <Paper
            sx={{
              p: 6,
              textAlign: 'center',
              bgcolor: 'grey.50',
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No jobs found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchKeyword || searchLocation
                ? 'Try adjusting your search criteria or clearing the filters.'
                : 'No jobs are currently available.'
              }
            </Typography>
            {(searchKeyword || searchLocation) && (
              <Button
                variant="contained"
                onClick={handleClearSearch}
                sx={{
                  background: 'linear-gradient(45deg, #62cff4 30%, #2c67f2 90%)',
                  color: 'white',
                }}
              >
                Show All Jobs
              </Button>
            )}
          </Paper>
        )}

        {/* Snackbar for error messages */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Job Detail Modal */}
        <JobDetailDialog
          open={jobDetailOpen}
          onClose={handleCloseJobDetail}
          maxWidth="md"
          fullWidth
        >
          {selectedJob && (
            <>
              <JobDetailHeader>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                      {selectedJob.title}
                    </Typography>
                    <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 2 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Business sx={{ fontSize: 20 }} />
                        <Typography variant="h6">
                          {selectedJob.employer?.companyName || 'Company Name Not Available'}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <LocationOn sx={{ fontSize: 20 }} />
                        <Typography variant="h6">
                          {selectedJob.location}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <Chip
                        icon={<Work />}
                        label={selectedJob.status || 'Open'}
                        size="small"
                        sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
                      />
                      {selectedJob.employmentType && (
                        <Chip
                          label={selectedJob.employmentType}
                          size="small"
                          sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
                        />
                      )}
                      {selectedJob.experience && (
                        <Chip
                          label={selectedJob.experience}
                          size="small"
                          sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
                        />
                      )}
                    </Stack>
                  </Box>
                  <Button
                    onClick={handleCloseJobDetail}
                    sx={{
                      color: 'white',
                      minWidth: 'auto',
                      p: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    <Close />
                  </Button>
                </Stack>
              </JobDetailHeader>

              <DialogContent sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  {/* Job Information */}
                  <Grid item xs={12} md={8}>
                    <Box>
                      <SectionHeader variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Assignment color="primary" />
                        Job Description
                      </SectionHeader>
                      <Typography variant="body1" paragraph>
                        {selectedJob.description || 'No description available.'}
                      </Typography>
                    </Box>

                    {selectedJob.responsibilities && (
                      <Box>
                        <SectionHeader variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <WorkOutline color="primary" />
                          Responsibilities
                        </SectionHeader>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                          {selectedJob.responsibilities}
                        </Typography>
                      </Box>
                    )}

                    {selectedJob.requirements && (
                      <Box>
                        <SectionHeader variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <School color="primary" />
                          Requirements
                        </SectionHeader>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                          {selectedJob.requirements}
                        </Typography>
                      </Box>
                    )}
                  </Grid>

                  {/* Job Details & Company Info */}
                  <Grid item xs={12} md={4}>
                    <Box>
                      <SectionHeader variant="h6">
                        Job Details
                      </SectionHeader>
                      <Stack spacing={2}>
                        {selectedJob.salary && (
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <AttachMoney sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Salary
                              </Typography>
                              <Typography variant="body1" fontWeight="medium">
                                {selectedJob.salary}
                              </Typography>
                            </Box>
                          </Stack>
                        )}
                        
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Posted
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {formatDate(selectedJob.createdAt)}
                            </Typography>
                          </Box>
                        </Stack>

                        {selectedJob.employmentType && (
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Work sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Employment Type
                              </Typography>
                              <Typography variant="body1" fontWeight="medium">
                                {selectedJob.employmentType}
                              </Typography>
                            </Box>
                          </Stack>
                        )}

                        {selectedJob.experience && (
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <School sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Experience Level
                              </Typography>
                              <Typography variant="body1" fontWeight="medium">
                                {selectedJob.experience}
                              </Typography>
                            </Box>
                          </Stack>
                        )}
                      </Stack>
                    </Box>

                    {/* Company Information */}
                    <Box sx={{ mt: 4 }}>
                      <SectionHeader variant="h6">
                        Company Information
                      </SectionHeader>
                      <Stack spacing={2}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: 'primary.main',
                              fontSize: '1rem',
                              fontWeight: 'bold',
                            }}
                          >
                            {selectedJob.employer?.companyName ? selectedJob.employer.companyName.charAt(0).toUpperCase() : 'C'}
                          </Avatar>
                          <Box>
                            <Typography variant="body1" fontWeight="medium">
                              {selectedJob.employer?.companyName || 'Company Name Not Available'}
                            </Typography>
                            {selectedJob.employer?.position && (
                              <Typography variant="body2" color="text.secondary">
                                {selectedJob.employer.position}
                              </Typography>
                            )}
                          </Box>
                        </Stack>

                        {selectedJob.employer?.companyWebsite && (
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Language sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Website
                              </Typography>
                              <Link
                                href={selectedJob.employer.companyWebsite}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ textDecoration: 'none' }}
                              >
                                <Typography variant="body1" fontWeight="medium" color="primary">
                                  {selectedJob.employer.companyWebsite}
                                </Typography>
                              </Link>
                            </Box>
                          </Stack>
                        )}

                        {selectedJob.employer?.companyAddress && (
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Address
                              </Typography>
                              <Typography variant="body1" fontWeight="medium">
                                {selectedJob.employer.companyAddress}
                              </Typography>
                            </Box>
                          </Stack>
                        )}

                        {selectedJob.employer?.contactInfo && (
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Contact
                              </Typography>
                              <Typography variant="body1" fontWeight="medium">
                                {selectedJob.employer.contactInfo}
                              </Typography>
                            </Box>
                          </Stack>
                        )}

                        {selectedJob.employer?.email && (
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Email
                              </Typography>
                              <Link
                                href={`mailto:${selectedJob.employer.email}`}
                                sx={{ textDecoration: 'none' }}
                              >
                                <Typography variant="body1" fontWeight="medium" color="primary">
                                  {selectedJob.employer.email}
                                </Typography>
                              </Link>
                            </Box>
                          </Stack>
                        )}
                      </Stack>
                    </Box>
                  </Grid>
                </Grid>
              </DialogContent>

              <DialogActions sx={{ p: 3, pt: 0 }}>
                <Button
                  onClick={handleCloseJobDetail}
                  sx={{ color: 'text.secondary' }}
                >
                  Close
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    background: 'black',
                    color: 'white',
                    px: 4,
                    '&:hover': {
                      background: '#333',
                    },
                  }}
                  onClick={() => handleApplyJob(selectedJob.id)}
                  disabled={isApplying || appliedJobs.has(selectedJob.id)}
                >
                  {isApplying ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : appliedJobs.has(selectedJob.id) ? (
                    'Applied'
                  ) : (
                    'Apply Now'
                  )}
                </Button>
              </DialogActions>
            </>
          )}
        </JobDetailDialog>
      </Container>
    </SearchContainer>
  );
};

export default JobSearch;
