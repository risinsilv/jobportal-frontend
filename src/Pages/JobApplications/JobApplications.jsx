import React, { useState, useMemo, useEffect } from 'react';
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
  Chip,
  Tab,
  Tabs,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link,
} from '@mui/material';
import {
  LocationOn,
  Business,
  AccessTime,
  Search,
  FilterList,
  Schedule,
  CheckCircle,
  Cancel,
  WorkOutline,
  MoreVert,
  Visibility,
  Delete,
  AttachMoney,
  Work,
  CalendarToday,
  Assignment,
  School,
  Close,
  Language,
  Email,
  Phone,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import instance from '../../Service/AxiosOrder';

// Styled components with glassmorphism
const ApplicationsContainer = styled(Box)(({ theme }) => ({
  backgroundColor: 'transparent',
  minHeight: '100vh',
  paddingTop: theme.spacing(3),
}));

const ApplicationsHeader = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  background: 'linear-gradient(135deg, #62cff4 15%, #2c67f2 100%)',
  color: 'white',
  boxShadow: '0 8px 32px rgba(44, 103, 242, 0.3)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 'inherit',
    backdropFilter: 'blur(10px)',
  },
}));

const ApplicationCard = styled(Card)(({ theme, status }) => {
  return {
    backgroundColor: 'white',
    borderRadius: theme.spacing(2),
    border: '1px solid rgba(0, 0, 0, 0.06)',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    marginBottom: theme.spacing(2),
    '&:hover': {
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
      transform: 'translateY(-2px)',
      borderColor: '#2c67f2',
    },
  };
});

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
     boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: theme.spacing(1.5),
    transition: 'all 0.3s ease',
    '& fieldset': {
      border: 'none',
    },
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.5)',
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
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

const FilterTabs = styled(Tabs)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderRadius: theme.spacing(1.5),
  border: '1px solid rgba(255, 255, 255, 0.2)',
  marginBottom: theme.spacing(3),
  '& .MuiTabs-flexContainer': {
    padding: theme.spacing(0.5),
  },
  '& .MuiTab-root': {
    borderRadius: theme.spacing(1),
    textTransform: 'none',
    fontWeight: 600,
    minHeight: 40,
    transition: 'all 0.3s ease',
    '&.Mui-selected': {
      backgroundColor: 'rgba(44, 103, 242, 0.8)',
      color: 'white',
      backdropFilter: 'blur(10px)',
    },
  },
  '& .MuiTabs-indicator': {
    display: 'none',
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.9) 100%)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: theme.spacing(1.5),
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
  color: 'white',
  height: 56,
  padding: '0 30px',
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 1) 100%)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)',
    transform: 'translateY(-1px)',
  },
}));

const StatsCard = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
  padding: theme.spacing(3),
  textAlign: 'center',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 32px rgba(255, 255, 255, 0.2)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
    borderRadius: 'inherit',
    pointerEvents: 'none',
  },
}));

const JobApplications = () => {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState(null);
  const [jobDetailOpen, setJobDetailOpen] = useState(false);
  const [selectedJobDetail, setSelectedJobDetail] = useState(null);

  // Get jobseeker ID from localStorage
  const jobSeekerId = localStorage.getItem('user');

  // Status options based on the enum
  const statusOptions = ['All', 'Applied', 'Shortlisted', 'Rejected', 'Hired'];

  useEffect(() => {
    if (jobSeekerId) {
      loadApplications();
    } else {
      setError('Please log in to view your applications.');
    }
  }, [jobSeekerId]);

  // Function to fetch job details from job ID
  const fetchJobDetails = async (jobId) => {
    try {
      const response = await instance.get(`/api/jobpostings/${jobId}`);
      const jobData = response.data;
      
      // Fetch employer details if available
      let employerDetails = {};
      if (jobData.employerId) {
        try {
          const employerResponse = await instance.get(`/api/employers/${jobData.employerId}`);
          employerDetails = {
            companyName: employerResponse.data.companyName || jobData.companyName,
            companyWebsite: employerResponse.data.companyWebsite,
            companyAddress: employerResponse.data.companyAddress,
            contactInfo: employerResponse.data.contactInfo,
            position: employerResponse.data.position,
          };
        } catch (employerError) {
          console.log('Could not fetch employer details for jobId:', jobId);
        }
      }
      
      return {
        jobId: jobData.jobId,
        title: jobData.title,
        company: employerDetails.companyName || jobData.companyName || 'Company Name',
        location: jobData.location || 'Location not specified',
        logo: `https://via.placeholder.com/50/2c67f2/FFFFFF?text=${(employerDetails.companyName || jobData.companyName || 'C').charAt(0)}`,
        description: jobData.description,
        requirements: jobData.requirements,
        salary: jobData.salary,
        jobType: jobData.jobType,
        employmentType: jobData.employmentType,
        experienceLevel: jobData.experienceLevel,
        skills: jobData.skills,
        benefits: jobData.benefits,
        applicationDeadline: jobData.applicationDeadline,
        postedDate: jobData.postedDate,
        employerId: jobData.employerId,
        employer: employerDetails,
        // Additional fields from JobSearch
        companyWebsite: employerDetails.companyWebsite,
        companyAddress: employerDetails.companyAddress,
        contactInfo: employerDetails.contactInfo,
      };
    } catch (error) {
      console.error(`Failed to fetch job details for jobId: ${jobId}`, error);
      return {
        jobId: jobId,
        title: 'Job Title Unavailable',
        company: 'Company Name',
        location: 'Location not specified',
        logo: `https://via.placeholder.com/50/2c67f2/FFFFFF?text=J`,
        description: 'Job details could not be loaded.',
        requirements: 'N/A',
        salary: 'N/A',
        jobType: 'N/A',
      };
    }
  };

  const loadApplications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Loading applications for jobseeker:', jobSeekerId);
      
      // Fetch applications by jobseeker ID
      const response = await instance.get(`/api/applications/by-jobseeker/${jobSeekerId}`);
      const applicationsData = response.data;
      
      console.log('Applications data:', applicationsData);
      
      if (applicationsData.length === 0) {
        setApplications([]);
        return;
      }
      
      // For each application, fetch the job details
      const applicationsWithJobDetails = await Promise.all(
        applicationsData.map(async (application) => {
          try {
            const jobDetails = await fetchJobDetails(application.jobId);
            
            return {
              applicationId: application.applicationId,
              job: jobDetails,
              status: application.status,
              appliedAt: application.appliedAt,
              jobId: application.jobId,
              jobSeekerId: application.jobSeekerId,
            };
          } catch (error) {
            console.error(`Failed to load job details for application: ${application.applicationId}`, error);
            return null;
          }
        })
      );
      
      // Filter out null values (failed job loads)
      const validApplications = applicationsWithJobDetails.filter(app => app !== null);
      setApplications(validApplications);
      
      console.log('Loaded applications with job details:', validApplications);
      
    } catch (error) {
      console.error('Failed to load applications:', error);
      setError('Failed to load your applications. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter applications based on search and status
  const filteredApplications = useMemo(() => {
    return applications.filter(application => {
      const keywordMatch = !searchKeyword || 
        application.job.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        application.job.company.toLowerCase().includes(searchKeyword.toLowerCase());
      
      const statusMatch = selectedStatus === 'All' || application.status === selectedStatus;
      
      return keywordMatch && statusMatch;
    });
  }, [applications, searchKeyword, selectedStatus]);

  const handleSearch = () => {
    console.log('Searching applications:', { keyword: searchKeyword, status: selectedStatus });
  };

  const handleClearSearch = () => {
    setSearchKeyword('');
    setSelectedStatus('All');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Applied': return <Schedule sx={{ fontSize: 18 }} />;
      case 'Shortlisted': return <CheckCircle sx={{ fontSize: 18 }} />;
      case 'Rejected': return <Cancel sx={{ fontSize: 18 }} />;
      case 'Hired': return <WorkOutline sx={{ fontSize: 18 }} />;
      default: return <Schedule sx={{ fontSize: 18 }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied': return 'primary';
      case 'Shortlisted': return 'warning';
      case 'Rejected': return 'error';
      case 'Hired': return 'success';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} week${Math.ceil(diffDays / 7) > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const handleMenuOpen = (event, application) => {
    setAnchorEl(event.currentTarget);
    setSelectedApplication(application);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedApplication(null);
  };

  const handleViewJob = () => {
    if (selectedApplication) {
      setSelectedJobDetail(selectedApplication.job);
      setJobDetailOpen(true);
    }
    handleMenuClose();
  };

  const handleCloseJobDetail = () => {
    setJobDetailOpen(false);
    setSelectedJobDetail(null);
  };

  const handleWithdrawApplication = async () => {
    if (selectedApplication) {
      try {
        // Call API to withdraw the application
        await instance.delete(`/api/applications/${selectedApplication.applicationId}`);
        
        // Remove application from list
        setApplications(prev => 
          prev.filter(app => app.applicationId !== selectedApplication.applicationId)
        );
        
        console.log('Application withdrawn successfully');
      } catch (error) {
        console.error('Failed to withdraw application:', error);
        setError('Failed to withdraw application. Please try again.');
      }
    }
    handleMenuClose();
  };

  const getApplicationStats = () => {
    const stats = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {});
    return stats;
  };

  const stats = getApplicationStats();

  return (
    <ApplicationsContainer>
      <Container maxWidth="lg">
        <ApplicationsHeader>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h6" opacity={0.9} gutterBottom>
              Track and manage your job applications
            </Typography>
            
            {/* Stats Summary */}
            <Grid container spacing={2} sx={{ mt: 2, mb: 3 }}>
              <Grid item xs={6} sm={3}>
                <StatsCard>
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: 'white', mb: 1 }}>
                      {applications.length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                      Total Applications
                    </Typography>
                  </Box>
                </StatsCard>
              </Grid>
              <Grid item xs={6} sm={3}>
                <StatsCard>
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: 'white', mb: 1 }}>
                      {stats.Applied || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                      Pending
                    </Typography>
                  </Box>
                </StatsCard>
              </Grid>
              <Grid item xs={6} sm={3}>
                <StatsCard>
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: 'white', mb: 1 }}>
                      {stats.Shortlisted || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                      Shortlisted
                    </Typography>
                  </Box>
                </StatsCard>
              </Grid>
              <Grid item xs={6} sm={3}>
                <StatsCard>
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: 'white', mb: 1 }}>
                      {stats.Hired || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                      Hired
                    </Typography>
                  </Box>
                </StatsCard>
              </Grid>
            </Grid>
            
            {/* Search Form */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <StyledTextField
                  fullWidth
                  placeholder="Search by job title or company"
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
                <Stack direction="row" spacing={1} sx={{ height: '100%' }}>
                  <GradientButton
                    onClick={handleSearch}
                    startIcon={<Search />}
                    sx={{ flexGrow: 1 }}
                  >
                    Search
                  </GradientButton>
                  {(searchKeyword || selectedStatus !== 'All') && (
                    <Button
                      variant="outlined"
                      onClick={handleClearSearch}
                      sx={{
                        color: 'white',
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                        backdropFilter: 'blur(10px)',
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
          </Box>
        </ApplicationsHeader>

        {/* Status Filter Tabs */}
        <FilterTabs
          value={selectedStatus}
          onChange={(e, newValue) => setSelectedStatus(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {statusOptions.map((status) => (
            <Tab
              key={status}
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  {status !== 'All' && getStatusIcon(status)}
                  <span>{status}</span>
                  {status !== 'All' && (
                    <Chip
                      label={stats[status] || 0}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        color: 'inherit',
                        height: 20,
                        fontSize: '0.7rem',
                      }}
                    />
                  )}
                </Stack>
              }
              value={status}
            />
          ))}
        </FilterTabs>

        {isLoading && (
          <LinearProgress 
            sx={{ 
              mb: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#2c67f2'
              }
            }} 
          />
        )}

        {/* Error State */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              backgroundColor: 'rgba(244, 67, 54, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(244, 67, 54, 0.2)'
            }}
            action={
              <Button 
                color="inherit" 
                size="small" 
                onClick={loadApplications}
                disabled={isLoading}
              >
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {!isLoading && !error && (
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" color="text.primary">
                {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''}
                {(searchKeyword || selectedStatus !== 'All') && (
                  <Typography component="span" color="primary.main" sx={{ ml: 1 }}>
                    {searchKeyword && `for "${searchKeyword}"`}
                    {searchKeyword && selectedStatus !== 'All' && ' '}
                    {selectedStatus !== 'All' && `with status "${selectedStatus}"`}
                  </Typography>
                )}
              </Typography>
              
              {(searchKeyword || selectedStatus !== 'All') && (
                <Button
                  variant="text"
                  onClick={handleClearSearch}
                  sx={{ color: 'text.secondary' }}
                >
                  Show all applications
                </Button>
              )}
            </Stack>
          </Box>
        )}

        {/* Application Cards */}
        {!isLoading && !error && (
          <>
            {filteredApplications.length > 0 ? (
              <Stack spacing={2}>
                {filteredApplications.map((application) => (
              <ApplicationCard key={application.applicationId} status={application.status}>
                <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                  <Stack direction="row" spacing={3} alignItems="center">
                    {/* Company Logo */}
                    <Avatar
                      src={application.job.logo}
                      alt={application.job.company}
                      sx={{
                        width: 60,
                        height: 60,
                        bgcolor: 'primary.main',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                      }}
                    >
                      {application.job.company.charAt(0)}
                    </Avatar>

                    {/* Job Details */}
                    <Box sx={{ flexGrow: 1 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                          <Typography
                            variant="h6"
                            component="h3"
                            fontWeight="bold"
                            color="text.primary"
                            gutterBottom
                          >
                            {application.job.title}
                          </Typography>
                          
                          <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 1 }}>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                              <Business sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary">
                                {application.job.company}
                              </Typography>
                            </Stack>
                            
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                              <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary">
                                {application.job.location}
                              </Typography>
                            </Stack>

                            {application.job.salary && application.job.salary !== 'N/A' && (
                              <Stack direction="row" alignItems="center" spacing={0.5}>
                                <AttachMoney sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                  {application.job.salary}
                                </Typography>
                              </Stack>
                            )}
                          </Stack>

                          {/* Job Type and Experience Level */}
                          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                            {application.job.jobType && application.job.jobType !== 'N/A' && (
                              <Chip
                                icon={<Work sx={{ fontSize: 14 }} />}
                                label={application.job.jobType}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.75rem' }}
                              />
                            )}
                            {application.job.employmentType && (
                              <Chip
                                icon={<CalendarToday sx={{ fontSize: 14 }} />}
                                label={application.job.employmentType}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.75rem' }}
                              />
                            )}
                            {application.job.experienceLevel && (
                              <Chip
                                icon={<School sx={{ fontSize: 14 }} />}
                                label={application.job.experienceLevel}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.75rem' }}
                              />
                            )}
                          </Stack>

                          {/* Job Description Preview */}
                          {application.job.description && application.job.description !== 'Job details could not be loaded.' && (
                            <Typography 
                              variant="body2" 
                              color="text.secondary" 
                              sx={{ 
                                mb: 2,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                lineHeight: 1.4,
                              }}
                            >
                              {application.job.description.length > 150 
                                ? `${application.job.description.substring(0, 150)}...`
                                : application.job.description
                              }
                            </Typography>
                          )}

                          {/* Status and Date */}
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Chip
                              icon={getStatusIcon(application.status)}
                              label={application.status}
                              color={getStatusColor(application.status)}
                              size="small"
                            />
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                              <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary">
                                Applied {formatDate(application.appliedAt)}
                              </Typography>
                            </Stack>
                          </Stack>
                        </Box>

                        {/* Action Menu */}
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, application)}
                          sx={{
                            backgroundColor: '#f5f5f5',
                            '&:hover': {
                              backgroundColor: '#e0e0e0',
                            },
                          }}
                        >
                          <MoreVert />
                        </IconButton>
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </ApplicationCard>
            ))}
          </Stack>
        ) : (
          <Paper
            sx={{
              p: 6,
              textAlign: 'center',
              backgroundColor: 'white',
              borderRadius: 3,
              border: '1px solid rgba(0, 0, 0, 0.06)',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No applications found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchKeyword || selectedStatus !== 'All'
                ? 'Try adjusting your search criteria or clearing the filters.'
                : 'You haven\'t applied to any jobs yet. Start exploring opportunities!'
              }
            </Typography>
            {(searchKeyword || selectedStatus !== 'All') ? (
              <Button
                variant="contained"
                onClick={handleClearSearch}
                sx={{
                  background: 'linear-gradient(45deg, #62cff4 30%, #2c67f2 90%)',
                  color: 'white',
                }}
              >
                Show All Applications
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={() => navigate('/job-search')}
                sx={{
                  background: 'linear-gradient(45deg, #62cff4 30%, #2c67f2 90%)',
                  color: 'white',
                }}
              >
                Browse Jobs
              </Button>
            )}
          </Paper>
        )}
          </>
        )}

        {/* Job Detail Dialog */}
        <Dialog
          open={jobDetailOpen}
          onClose={handleCloseJobDetail}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              maxHeight: '90vh',
            },
          }}
        >
          {selectedJobDetail && (
            <>
              <DialogTitle
                sx={{
                  background: 'black',
                  color: 'white',
                  position: 'relative',
                  pr: 6,
                }}
              >
                <Typography variant="h5" component="h2" fontWeight="bold">
                  {selectedJobDetail.title}
                </Typography>
                <Typography variant="subtitle1" sx={{ mt: 1, opacity: 0.9 }}>
                  {selectedJobDetail.company}
                </Typography>
                <IconButton
                  onClick={handleCloseJobDetail}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: 'white',
                  }}
                >
                  <Close />
                </IconButton>
              </DialogTitle>

              <DialogContent sx={{ p: 3 }}>
                {/* Basic Job Info */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <LocationOn color="primary" />
                      <Typography variant="body1">
                        <strong>Location:</strong> {selectedJobDetail.location}
                      </Typography>
                    </Stack>
                  </Grid>
                  
                  {selectedJobDetail.salary && selectedJobDetail.salary !== 'N/A' && (
                    <Grid item xs={12} sm={6}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <AttachMoney color="primary" />
                        <Typography variant="body1">
                          <strong>Salary:</strong> {selectedJobDetail.salary}
                        </Typography>
                      </Stack>
                    </Grid>
                  )}

                  {selectedJobDetail.jobType && selectedJobDetail.jobType !== 'N/A' && (
                    <Grid item xs={12} sm={6}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Work color="primary" />
                        <Typography variant="body1">
                          <strong>Job Type:</strong> {selectedJobDetail.jobType}
                        </Typography>
                      </Stack>
                    </Grid>
                  )}

                  {selectedJobDetail.employmentType && (
                    <Grid item xs={12} sm={6}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <CalendarToday color="primary" />
                        <Typography variant="body1">
                          <strong>Employment:</strong> {selectedJobDetail.employmentType}
                        </Typography>
                      </Stack>
                    </Grid>
                  )}

                  {selectedJobDetail.experienceLevel && (
                    <Grid item xs={12} sm={6}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <School color="primary" />
                        <Typography variant="body1">
                          <strong>Experience:</strong> {selectedJobDetail.experienceLevel}
                        </Typography>
                      </Stack>
                    </Grid>
                  )}

                  {selectedJobDetail.applicationDeadline && (
                    <Grid item xs={12} sm={6}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Assignment color="primary" />
                        <Typography variant="body1">
                          <strong>Deadline:</strong> {new Date(selectedJobDetail.applicationDeadline).toLocaleDateString()}
                        </Typography>
                      </Stack>
                    </Grid>
                  )}
                </Grid>

                <Divider sx={{ my: 2 }} />

                {/* Job Description */}
                {selectedJobDetail.description && selectedJobDetail.description !== 'Job details could not be loaded.' && (
                  <>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
                      Job Description
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ lineHeight: 1.6 }}>
                      {selectedJobDetail.description}
                    </Typography>
                  </>
                )}

                {/* Requirements */}
                {selectedJobDetail.requirements && selectedJobDetail.requirements !== 'N/A' && (
                  <>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>
                      Requirements
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ lineHeight: 1.6 }}>
                      {selectedJobDetail.requirements}
                    </Typography>
                  </>
                )}

                {/* Skills */}
                {selectedJobDetail.skills && (
                  <>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>
                      Required Skills
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                      {selectedJobDetail.skills.split(',').map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill.trim()}
                          variant="outlined"
                          size="small"
                        />
                      ))}
                    </Stack>
                  </>
                )}

                {/* Benefits */}
                {selectedJobDetail.benefits && (
                  <>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>
                      Benefits
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ lineHeight: 1.6 }}>
                      {selectedJobDetail.benefits}
                    </Typography>
                  </>
                )}

                {/* Company Information */}
                {selectedJobDetail.employer && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Company Information
                    </Typography>
                    <Grid container spacing={2}>
                      {selectedJobDetail.companyWebsite && (
                        <Grid item xs={12}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Language color="primary" />
                            <Typography variant="body1">
                              <strong>Website:</strong>{' '}
                              <Link href={selectedJobDetail.companyWebsite} target="_blank" rel="noopener">
                                {selectedJobDetail.companyWebsite}
                              </Link>
                            </Typography>
                          </Stack>
                        </Grid>
                      )}
                      {selectedJobDetail.companyAddress && (
                        <Grid item xs={12}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <LocationOn color="primary" />
                            <Typography variant="body1">
                              <strong>Address:</strong> {selectedJobDetail.companyAddress}
                            </Typography>
                          </Stack>
                        </Grid>
                      )}
                      {selectedJobDetail.contactInfo && (
                        <Grid item xs={12}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Email color="primary" />
                            <Typography variant="body1">
                              <strong>Contact:</strong> {selectedJobDetail.contactInfo}
                            </Typography>
                          </Stack>
                        </Grid>
                      )}
                    </Grid>
                  </>
                )}

                {/* Posted Date */}
                {selectedJobDetail.postedDate && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      <strong>Posted:</strong> {new Date(selectedJobDetail.postedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Typography>
                  </>
                )}
              </DialogContent>

              <DialogActions sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                <Button onClick={handleCloseJobDetail} variant="outlined">
                  Close
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              backgroundColor: 'white',
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              border: '1px solid rgba(0, 0, 0, 0.06)',
            }
          }}
        >
          <MenuItem onClick={handleViewJob}>
            <Visibility sx={{ mr: 1 }} />
            View Job Details
          </MenuItem>
          <Divider />
          <MenuItem 
            onClick={handleWithdrawApplication}
            sx={{ color: 'error.main' }}
          >
            <Delete sx={{ mr: 1 }} />
            Withdraw Application
          </MenuItem>
        </Menu>
      </Container>
    </ApplicationsContainer>
  );
};

export default JobApplications;
