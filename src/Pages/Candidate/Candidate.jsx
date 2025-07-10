import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Tabs,
  Tab,
  Badge,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  ArrowBack,
  Person,
  Work,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  MoreVert,
  CheckCircle,
  Cancel,
  Schedule,
  Star,
  Download,
  Visibility,
  Edit,
  FilterList,
  Search,
  Add,
  AttachMoney,
  People,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Styled components with glassmorphism
const CandidatesContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
}));

const CandidatesHeader = styled(Paper)(({ theme }) => ({
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

const StatsCard = styled(Card)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderRadius: theme.spacing(2),
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  },
}));

const CandidateCard = styled(Card)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(15px)',
  WebkitBackdropFilter: 'blur(15px)',
  borderRadius: theme.spacing(2),
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #62cff4 15%, #2c67f2 100%)',
  color: 'white',
  borderRadius: theme.spacing(1.5),
  boxShadow: '0 4px 15px rgba(44, 103, 242, 0.3)',
  padding: theme.spacing(1, 2),
  fontSize: '0.9rem',
  fontWeight: 600,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #4fbff0 15%, #1f5ae8 100%)',
    boxShadow: '0 6px 20px rgba(44, 103, 242, 0.4)',
    transform: 'translateY(-2px)',
  },
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderRadius: theme.spacing(1.5),
  border: '1px solid rgba(255, 255, 255, 0.2)',
  marginBottom: theme.spacing(3),
  '& .MuiTabs-indicator': {
    backgroundColor: '#2c67f2',
    height: 3,
    borderRadius: '3px 3px 0 0',
  },
}));

const Candidate = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedJob, setSelectedJob] = useState(null); // null means show job list, job object means show candidates
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [statusMenuAnchor, setStatusMenuAnchor] = useState(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);

  // Mock data - Employer's posted jobs
  const employerJobs = [
    { 
      id: 1, 
      title: 'Senior React Developer', 
      location: 'Remote', 
      postedDate: '2024-12-15',
      status: 'Active',
      applicationsCount: 3,
      salary: '$80,000 - $120,000',
      description: 'We are looking for an experienced React developer...'
    },
    { 
      id: 2, 
      title: 'Backend Engineer', 
      location: 'New York, NY', 
      postedDate: '2024-12-10',
      status: 'Active',
      applicationsCount: 1,
      salary: '$90,000 - $130,000',
      description: 'Join our backend team to build scalable systems...'
    },
    { 
      id: 3, 
      title: 'Full Stack Developer', 
      location: 'San Francisco, CA', 
      postedDate: '2024-12-08',
      status: 'Active',
      applicationsCount: 1,
      salary: '$85,000 - $125,000',
      description: 'Looking for a versatile full stack developer...'
    },
    { 
      id: 4, 
      title: 'DevOps Engineer', 
      location: 'Austin, TX', 
      postedDate: '2024-12-05',
      status: 'Closed',
      applicationsCount: 0,
      salary: '$95,000 - $140,000',
      description: 'Seeking a DevOps engineer to manage our infrastructure...'
    },
  ];

  const applications = [
    {
      applicationId: 1,
      job: { id: 1, title: 'Senior React Developer', location: 'Remote' },
      jobSeeker: {
        id: 101,
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '+1 (555) 123-4567',
        avatar: 'https://via.placeholder.com/60',
        experience: '5 years',
        skills: ['React', 'JavaScript', 'Node.js', 'TypeScript'],
        location: 'Boston, MA'
      },
      status: 'Applied',
      appliedAt: '2024-12-20T10:30:00',
    },
    {
      applicationId: 2,
      job: { id: 1, title: 'Senior React Developer', location: 'Remote' },
      jobSeeker: {
        id: 102,
        name: 'Michael Chen',
        email: 'michael.chen@email.com',
        phone: '+1 (555) 987-6543',
        avatar: 'https://via.placeholder.com/60',
        experience: '7 years',
        skills: ['React', 'Vue.js', 'Python', 'AWS'],
        location: 'Seattle, WA'
      },
      status: 'Shortlisted',
      appliedAt: '2024-12-19T14:15:00',
    },
    {
      applicationId: 3,
      job: { id: 2, title: 'Backend Engineer', location: 'New York, NY' },
      jobSeeker: {
        id: 103,
        name: 'Emily Rodriguez',
        email: 'emily.r@email.com',
        phone: '+1 (555) 456-7890',
        avatar: 'https://via.placeholder.com/60',
        experience: '4 years',
        skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker'],
        location: 'New York, NY'
      },
      status: 'Applied',
      appliedAt: '2024-12-18T09:45:00',
    },
    {
      applicationId: 4,
      job: { id: 1, title: 'Senior React Developer', location: 'Remote' },
      jobSeeker: {
        id: 104,
        name: 'David Kumar',
        email: 'david.k@email.com',
        phone: '+1 (555) 321-0987',
        avatar: 'https://via.placeholder.com/60',
        experience: '6 years',
        skills: ['React', 'Angular', 'MongoDB', 'Express'],
        location: 'Austin, TX'
      },
      status: 'Hired',
      appliedAt: '2024-12-17T16:20:00',
    },
    {
      applicationId: 5,
      job: { id: 3, title: 'Full Stack Developer', location: 'San Francisco, CA' },
      jobSeeker: {
        id: 105,
        name: 'Lisa Wang',
        email: 'lisa.wang@email.com',
        phone: '+1 (555) 654-3210',
        avatar: 'https://via.placeholder.com/60',
        experience: '3 years',
        skills: ['JavaScript', 'Python', 'React', 'Django'],
        location: 'San Francisco, CA'
      },
      status: 'Rejected',
      appliedAt: '2024-12-16T11:30:00',
    },
  ];

  // Filter applications based on selected job and filters
  const filteredApplications = applications.filter(app => {
    if (!selectedJob) return false; // Only show applications when a job is selected
    const matchesJob = app.job.id === selectedJob.id;
    const matchesStatus = statusFilter === 'all' || app.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch = searchTerm === '' || 
      app.jobSeeker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobSeeker.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesJob && matchesStatus && matchesSearch;
  });

  // Get statistics based on whether we're viewing all jobs or specific job applications
  const getStats = () => {
    if (!selectedJob) {
      // Stats for all employer jobs
      const totalJobs = employerJobs.length;
      const activeJobs = employerJobs.filter(job => job.status === 'Active').length;
      const totalApplications = employerJobs.reduce((sum, job) => sum + job.applicationsCount, 0);
      const recentJobs = employerJobs.filter(job => {
        const postedDate = new Date(job.postedDate);
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return postedDate >= oneWeekAgo;
      }).length;
      
      return { 
        total: totalJobs, 
        active: activeJobs, 
        applications: totalApplications, 
        recent: recentJobs,
        type: 'jobs'
      };
    } else {
      // Stats for specific job applications
      const jobApplications = applications.filter(app => app.job.id === selectedJob.id);
      const total = jobApplications.length;
      const applied = jobApplications.filter(app => app.status === 'Applied').length;
      const shortlisted = jobApplications.filter(app => app.status === 'Shortlisted').length;
      const hired = jobApplications.filter(app => app.status === 'Hired').length;
      const rejected = jobApplications.filter(app => app.status === 'Rejected').length;

      return { total, applied, shortlisted, hired, rejected, type: 'applications' };
    }
  };

  const stats = getStats();

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setSearchTerm(''); // Clear search when switching to candidates view
  };

  const handleBackToJobs = () => {
    setSelectedJob(null);
    setStatusFilter('all');
    setSearchTerm('');
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleViewDetails = (candidate) => {
    setSelectedCandidate(candidate);
    setDetailsDialogOpen(true);
  };

  const handleStatusMenuOpen = (event, applicationId) => {
    setStatusMenuAnchor(event.currentTarget);
    setSelectedApplicationId(applicationId);
  };

  const handleStatusMenuClose = () => {
    setStatusMenuAnchor(null);
    setSelectedApplicationId(null);
  };

  const handleStatusChange = (newStatus) => {
    console.log(`Changing status of application ${selectedApplicationId} to ${newStatus}`);
    // Here you would make an API call to update the status
    handleStatusMenuClose();
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'applied':
        return 'info';
      case 'shortlisted':
        return 'warning';
      case 'hired':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'applied':
        return <Schedule />;
      case 'shortlisted':
        return <Star />;
      case 'hired':
        return <CheckCircle />;
      case 'rejected':
        return <Cancel />;
      default:
        return <Schedule />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <CandidatesContainer>
      <Container maxWidth="lg">
        <CandidatesHeader>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <IconButton
                onClick={selectedJob ? handleBackToJobs : () => navigate('/dashboard')}
                sx={{ 
                  color: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
                }}
              >
                <ArrowBack />
              </IconButton>
              <Typography variant="h4" component="h1" fontWeight="bold">
                {selectedJob ? `Candidates for ${selectedJob.title}` : 'My Job Postings'}
              </Typography>
            </Box>
            <Typography variant="h6" opacity={0.9}>
              {selectedJob 
                ? `Manage applications for this position`
                : 'View your posted jobs and manage applications'
              }
            </Typography>
          </Box>
        </CandidatesHeader>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.type === 'jobs' ? (
            // Stats for job postings
            <>
              <Grid item xs={12} sm={6} md={3}>
                <StatsCard>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold" color="primary">
                      {stats.total}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Jobs Posted
                    </Typography>
                  </CardContent>
                </StatsCard>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatsCard>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#4caf50' }}>
                      {stats.active}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Jobs
                    </Typography>
                  </CardContent>
                </StatsCard>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatsCard>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#ff9800' }}>
                      {stats.applications}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Applications
                    </Typography>
                  </CardContent>
                </StatsCard>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatsCard>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#2196f3' }}>
                      {stats.recent}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Recent Posts
                    </Typography>
                  </CardContent>
                </StatsCard>
              </Grid>
            </>
          ) : (
            // Stats for applications
            <>
              <Grid item xs={12} sm={6} md={2.4}>
                <StatsCard>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold" color="primary">
                      {stats.total}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Applications
                    </Typography>
                  </CardContent>
                </StatsCard>
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <StatsCard>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#2196f3' }}>
                      {stats.applied}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      New Applications
                    </Typography>
                  </CardContent>
                </StatsCard>
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <StatsCard>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#ff9800' }}>
                      {stats.shortlisted}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Shortlisted
                    </Typography>
                  </CardContent>
                </StatsCard>
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <StatsCard>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#4caf50' }}>
                      {stats.hired}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Hired
                    </Typography>
                  </CardContent>
                </StatsCard>
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <StatsCard>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#f44336' }}>
                      {stats.rejected}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Rejected
                    </Typography>
                  </CardContent>
                </StatsCard>
              </Grid>
            </>
          )}
        </Grid>

        {/* Filters - Only show when viewing candidates */}
        {selectedJob && (
          <StatsCard sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    placeholder="Search candidates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Filter by Status</InputLabel>
                    <Select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      label="Filter by Status"
                    >
                      <MenuItem value="all">All Statuses</MenuItem>
                      <MenuItem value="applied">Applied</MenuItem>
                      <MenuItem value="shortlisted">Shortlisted</MenuItem>
                      <MenuItem value="hired">Hired</MenuItem>
                      <MenuItem value="rejected">Rejected</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </StatsCard>
        )}

        {/* Main Content */}
        <StatsCard>
          <CardContent>
            {!selectedJob ? (
              // Show Job Postings List
              <>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                  My Job Postings ({employerJobs.length})
                </Typography>
                
                {employerJobs.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                      No job postings yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Start by creating your first job posting
                    </Typography>
                    <GradientButton sx={{ mt: 2 }} startIcon={<Add />}>
                      Post New Job
                    </GradientButton>
                  </Box>
                ) : (
                  <List>
                    {employerJobs.map((job, index) => (
                      <React.Fragment key={job.id}>
                        <ListItem
                          sx={{
                            border: '1px solid rgba(0, 0, 0, 0.1)',
                            borderRadius: 2,
                            mb: 2,
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.8)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                            },
                            transition: 'all 0.3s ease',
                          }}
                          onClick={() => handleJobClick(job)}
                        >
                          <ListItemAvatar>
                            <Avatar
                              sx={{ 
                                width: 60, 
                                height: 60, 
                                backgroundColor: job.status === 'Active' ? '#4caf50' : '#f44336',
                                color: 'white'
                              }}
                            >
                              <Work />
                            </Avatar>
                          </ListItemAvatar>
                          
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                <Typography variant="h6" fontWeight="bold">
                                  {job.title}
                                </Typography>
                                <Chip
                                  label={job.status}
                                  color={job.status === 'Active' ? 'success' : 'error'}
                                  size="small"
                                />
                                <Badge 
                                  badgeContent={job.applicationsCount} 
                                  color="primary"
                                  sx={{ ml: 1 }}
                                >
                                  <People sx={{ color: 'text.secondary' }} />
                                </Badge>
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                                    <Typography variant="body2" color="text.secondary">
                                      {job.location}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <AttachMoney sx={{ fontSize: 16, color: 'text.secondary' }} />
                                    <Typography variant="body2" color="text.secondary">
                                      {job.salary}
                                    </Typography>
                                  </Box>
                                </Box>
                                <Typography variant="body2" color="text.primary" sx={{ mb: 1 }}>
                                  {job.description.substring(0, 100)}...
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Posted: {formatDate(job.postedDate)}
                                </Typography>
                              </Box>
                            }
                          />
                          
                          <ListItemSecondaryAction>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                              <Typography variant="h6" fontWeight="bold" color="primary">
                                {job.applicationsCount}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Applications
                              </Typography>
                            </Box>
                          </ListItemSecondaryAction>
                        </ListItem>
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </>
            ) : (
              // Show Candidates List for Selected Job
              <>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                  Applications ({filteredApplications.length})
                </Typography>
                
                {filteredApplications.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                      No applications found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'Try adjusting your filters or search criteria'
                        : 'No candidates have applied for this position yet'
                      }
                    </Typography>
                  </Box>
                ) : (
                  <List>
                {filteredApplications.map((application, index) => (
                  <React.Fragment key={application.applicationId}>
                    <ListItem
                      sx={{
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        borderRadius: 2,
                        mb: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={application.jobSeeker.avatar}
                          sx={{ width: 60, height: 60 }}
                        >
                          {application.jobSeeker.name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <Typography variant="h6" fontWeight="bold">
                              {application.jobSeeker.name}
                            </Typography>
                            <Chip
                              icon={getStatusIcon(application.status)}
                              label={application.status}
                              color={getStatusColor(application.status)}
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.primary" sx={{ mb: 0.5 }}>
                              Applied for: <strong>{application.job.title}</strong>
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                  {application.jobSeeker.email}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                  {application.jobSeeker.location}
                                </Typography>
                              </Box>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                              {application.jobSeeker.skills.slice(0, 3).map((skill) => (
                                <Chip
                                  key={skill}
                                  label={skill}
                                  size="small"
                                  variant="outlined"
                                />
                              ))}
                              {application.jobSeeker.skills.length > 3 && (
                                <Chip
                                  label={`+${application.jobSeeker.skills.length - 3}`}
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              Applied: {formatDate(application.appliedAt)}
                            </Typography>
                          </Box>
                        }
                      />
                      
                      <ListItemSecondaryAction>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            startIcon={<Visibility />}
                            onClick={() => handleViewDetails(application)}
                          >
                            View
                          </Button>
                          <IconButton
                            onClick={(e) => handleStatusMenuOpen(e, application.applicationId)}
                          >
                            <MoreVert />
                          </IconButton>
                        </Box>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            )}
              </>
            )}
          </CardContent>
        </StatsCard>

        {/* Status Change Menu */}
        <Menu
          anchorEl={statusMenuAnchor}
          open={Boolean(statusMenuAnchor)}
          onClose={handleStatusMenuClose}
        >
          <MenuItem onClick={() => handleStatusChange('Shortlisted')}>
            <Star sx={{ mr: 1 }} /> Shortlist
          </MenuItem>
          <MenuItem onClick={() => handleStatusChange('Hired')}>
            <CheckCircle sx={{ mr: 1 }} /> Hire
          </MenuItem>
          <MenuItem onClick={() => handleStatusChange('Rejected')}>
            <Cancel sx={{ mr: 1 }} /> Reject
          </MenuItem>
        </Menu>

        {/* Candidate Details Dialog */}
        <Dialog
          open={detailsDialogOpen}
          onClose={() => setDetailsDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          {selectedCandidate && (
            <>
              <DialogTitle sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    src={selectedCandidate.jobSeeker.avatar}
                    sx={{ width: 60, height: 60 }}
                  >
                    {selectedCandidate.jobSeeker.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {selectedCandidate.jobSeeker.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedCandidate.jobSeeker.experience} experience
                    </Typography>
                  </Box>
                </Box>
              </DialogTitle>
              
              <DialogContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Contact Information</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Email />
                      <Typography>{selectedCandidate.jobSeeker.email}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Phone />
                      <Typography>{selectedCandidate.jobSeeker.phone}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOn />
                      <Typography>{selectedCandidate.jobSeeker.location}</Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Application Details</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Position:</strong> {selectedCandidate.job.title}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Status:</strong> 
                      <Chip
                        label={selectedCandidate.status}
                        color={getStatusColor(selectedCandidate.status)}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                    <Typography variant="body2">
                      <strong>Applied:</strong> {formatDate(selectedCandidate.appliedAt)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>Skills</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {selectedCandidate.jobSeeker.skills.map((skill) => (
                        <Chip
                          key={skill}
                          label={skill}
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              </DialogContent>
              
              <DialogActions sx={{ p: 3, gap: 1 }}>
                <Button onClick={() => setDetailsDialogOpen(false)}>
                  Close
                </Button>
                <Button startIcon={<Download />} variant="outlined">
                  Download Resume
                </Button>
                <GradientButton startIcon={<Email />}>
                  Contact Candidate
                </GradientButton>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </CandidatesContainer>
  );
};

export default Candidate;
