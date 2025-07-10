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
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

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

  // Status options based on the enum
  const statusOptions = ['All', 'Applied', 'Shortlisted', 'Rejected', 'Hired'];

  // Sample application data based on the Applications entity
  const [applications, setApplications] = useState([
    {
      applicationId: 1,
      job: {
        jobId: 101,
        title: 'Senior Frontend Developer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        logo: 'https://via.placeholder.com/50/2c67f2/FFFFFF?text=TC',
      },
      status: 'Shortlisted',
      appliedAt: '2024-12-20T10:30:00',
    },
    {
      applicationId: 2,
      job: {
        jobId: 102,
        title: 'Full Stack Developer',
        company: 'StartupXYZ',
        location: 'New York, NY',
        logo: 'https://via.placeholder.com/50/62cff4/FFFFFF?text=SX',
      },
      status: 'Applied',
      appliedAt: '2024-12-25T14:15:00',
    },
    {
      applicationId: 3,
      job: {
        jobId: 103,
        title: 'React Developer',
        company: 'WebSolutions',
        location: 'Austin, TX',
        logo: 'https://via.placeholder.com/50/4f46e5/FFFFFF?text=WS',
      },
      status: 'Hired',
      appliedAt: '2024-12-15T09:45:00',
    },
    {
      applicationId: 4,
      job: {
        jobId: 104,
        title: 'Software Engineer',
        company: 'InnovateLab',
        location: 'Seattle, WA',
        logo: 'https://via.placeholder.com/50/10b981/FFFFFF?text=IL',
      },
      status: 'Rejected',
      appliedAt: '2024-12-18T16:20:00',
    },
    {
      applicationId: 5,
      job: {
        jobId: 105,
        title: 'UI/UX Developer',
        company: 'DesignStudio',
        location: 'Los Angeles, CA',
        logo: 'https://via.placeholder.com/50/f59e0b/FFFFFF?text=DS',
      },
      status: 'Applied',
      appliedAt: '2024-12-28T11:00:00',
    },
  ]);

  useEffect(() => {
    // Load applications data on component mount
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load applications:', error);
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
      // Navigate to job details page
      navigate(`/job/${selectedApplication.job.jobId}`);
    }
    handleMenuClose();
  };

  const handleWithdrawApplication = () => {
    if (selectedApplication) {
      // Remove application from list
      setApplications(prev => 
        prev.filter(app => app.applicationId !== selectedApplication.applicationId)
      );
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

        {/* Application Cards */}
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
                          </Stack>

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
