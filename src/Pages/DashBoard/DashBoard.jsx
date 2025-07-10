import React, { useState, useEffect } from 'react';
import route from '../../Navigation/Navigation';
import instance from '../../Service/AxiosOrder';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Container,
  Grid,
  Card,
  CardContent,
  Paper,
  Badge,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Work,
  Person,
  Notifications,
  Settings,
  ExitToApp,
  Search,
  Add,
  TrendingUp,
  People,
  BusinessCenter,
  School,
  MoreVert,
  CheckCircle,
  Schedule,
  Cancel,
  Description,
  PostAdd,
  PersonAdd,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Route, Routes, useNavigate } from 'react-router-dom';

// Styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(135deg, #62cff4 15%, #2c67f2 100%)',
  boxShadow: '0 4px 20px rgba(44, 103, 242, 0.15)',
}));

const DashboardContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#f8fafc',
  minHeight: '100vh',
  paddingTop: theme.spacing(10), // Add top padding to account for fixed navbar
}));

const StatsCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
  border: '1px solid rgba(0, 0, 0, 0.04)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #62cff4 30%, #2c67f2 90%)',
  border: 0,
  borderRadius: theme.spacing(1.5),
  boxShadow: '0 4px 15px rgba(44, 103, 242, 0.3)',
  color: 'white',
  height: 40,
  padding: '0 24px',
  fontSize: '0.9rem',
  fontWeight: 600,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #4fbff0 30%, #1f5ae8 90%)',
    boxShadow: '0 6px 20px rgba(44, 103, 242, 0.4)',
  },
}));

const Dashboard = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [quickActionAnchor, setQuickActionAnchor] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [userProfilePic, setUserProfilePic] = useState(null);
  const [userName, setUserName] = useState('');
  const [avatarError, setAvatarError] = useState(false);
  const [userDataLoading, setUserDataLoading] = useState(true);
  const navigate = useNavigate();

  // Handle avatar image load error
  const handleAvatarError = () => {
    console.log('Avatar image failed to load, falling back to initials');
    setAvatarError(true);
  };

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userId = localStorage.getItem('user');
        const storedName = localStorage.getItem('name');
        
        if (storedName) {
          setUserName(storedName);
        }
        
        if (userId) {
          console.log('Fetching user profile for ID:', userId);
          const response = await instance.get(`/api/users/${userId}`);
          const userData = response.data;
          console.log('User data received:', userData);
          
          // If user has a profile picture, set the image URL
          if (userData.profilePic) {
            const profilePicUrl = `/api/users/images/${userData.profilePic}`;
            console.log('Setting profile picture URL:', profilePicUrl);
            setUserProfilePic(profilePicUrl);
          }
          
          // Update name if not already set
          if (userData.name && !storedName) {
            setUserName(userData.name);
            localStorage.setItem('name', userData.name);
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Don't show error to user, just continue with default avatar
        // The avatar will fall back to showing the first letter of the name
      } finally {
        // Set loading to false after data fetching is complete
        setUserDataLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  
  };
  const myProfileClick = () => {
    navigate('/UserProfile');
    handleProfileMenuClose();
  };

  const handleNotificationOpen = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleQuickActionOpen = (event) => {
    setQuickActionAnchor(event.currentTarget);
  };

  const handleQuickActionClose = () => {
    setQuickActionAnchor(null);
  };

  const handleLogout = () => {
    // Open confirmation dialog instead of immediately logging out
    setLogoutDialogOpen(true);
    handleProfileMenuClose();
  
  };

  const handleLogoutConfirm = () => {
    // Clear all stored authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('name');

    // Close the confirmation dialog
    setLogoutDialogOpen(false);

    // Reload the page to trigger the App component to show Login
    window.location.reload();
  };

  const handleLogoutCancel = () => {
    // Just close the dialog without logging out
    setLogoutDialogOpen(false);
  };

  // Navigation functions for stats
  const handleJobsClick = () => {
    navigate('/JobSearch');
  };

  const handleApplicationsClick = () => {
    console.log('Navigating to My Applications...');
    navigate('/JobApplications');
    // Add your navigation logic here, e.g., navigate('/my-applications')
  };

  const handleTrainingClick = () => {
    console.log('Navigating to Training Programs...');
    navigate('/Courses');
    // Add your navigation logic here, e.g., navigate('/training')
  };

  const handleResumeClick = () => {
    navigate('/JobSeekerResume');
  };

  const handleJobCreationClick = () => {
    console.log('Navigating to Job Creation...');
    navigate('/CreateJob');
    // Add your navigation logic here for job posting creation
  };

  const handleCandidatesClick = () => {
    console.log('Navigating to Candidates...');
    navigate('/Candidate');
    // Add your navigation logic here for viewing candidates/applicants
    // navigate('/candidates');
  };

  const handleCreateCoursesClick = () => {
    console.log('Navigating to Create Courses...');
    navigate('/CreateCourses');
    // Add your navigation logic here for course creation
  };

  const handleCourseEnrollmentsClick = () => {
    console.log('Navigating to Course Enrollments...');
    navigate('/CourseEnrollments');
    // Add your navigation logic here for viewing course enrollments
  };

  // Quick Action handlers
  const handleSearchJobsClick = () => {
    navigate('/JobSearch');
    handleQuickActionClose();
  };

  const handleSearchCoursesClick = () => {
    navigate('/Courses');
    handleQuickActionClose();
  };

  const handleMyApplicationsClick = () => {
    navigate('/JobApplications');
    handleQuickActionClose();
  };

  // Sample data for dashboard
  const stats = [
    {
      title: 'Total Jobs',
      value: '1,234',
      change: '+12%',
      icon: <Work sx={{ fontSize: 40, color: '#2c67f2' }} />,
      color: '#e3f2fd',
      onClick: handleJobsClick, // Function for this stat
    },
    {
      title: 'Active Applications',
      value: '89',
      change: '+5%',
      icon: <People sx={{ fontSize: 40, color: '#4caf50' }} />,
      color: '#e8f5e8',
      onClick: handleApplicationsClick, // Function for this stat
    },
    {
      title: 'Training Programs',
      value: '67',
      change: '+15%',
      icon: <School sx={{ fontSize: 40, color: '#9c27b0' }} />,
      color: '#f3e5f5',
      onClick: handleTrainingClick, // Function for this stat
    },
    {
      title: 'My Resume',
      value: 'Updated',
      change: 'Today',
      icon: <Description sx={{ fontSize: 40, color: '#ff9800' }} />,
      color: '#fff3e0',
      onClick: handleResumeClick, // Function for this stat
    },
    {
      title: 'Create Job Opening',
      value: 'Post Job',
      change: 'Quick Action',
      icon: <PostAdd sx={{ fontSize: 40, color: '#e91e63' }} />,
      color: '#fce4ec',
      onClick: handleJobCreationClick, // Function for this stat
    },
    {
      title: 'Candidates',
      value: '156',
      change: '+8%',
      icon: <People sx={{ fontSize: 40, color: '#00bcd4' }} />,
      color: '#e0f2f1',
      onClick: handleCandidatesClick, // Function for this stat
    },
    {
      title: 'Create Courses',
      value: 'Add Course',
      change: 'For Trainers',
      icon: <Add sx={{ fontSize: 40, color: '#795548' }} />,
      color: '#efebe9',
      onClick: handleCreateCoursesClick, // Function for this stat
    },
    {
      title: 'Course Enrollments',
      value: '234',
      change: '+18%',
      icon: <PersonAdd sx={{ fontSize: 40, color: '#673ab7' }} />,
      color: '#f3e5f5',
      onClick: handleCourseEnrollmentsClick, // Function for this stat
    },
  ];



  const notifications = [
    {
      id: 1,
      title: 'New Job Match',
      message: 'We found 3 new jobs that match your profile',
      time: '1 hour ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Application Update',
      message: 'Your application status has been updated',
      time: '3 hours ago',
      unread: true,
    },
    {
      id: 3,
      title: 'Course Reminder',
      message: 'Your React course starts tomorrow',
      time: '1 day ago',
      unread: false,
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle sx={{ color: '#4caf50', fontSize: 20 }} />;
      case 'pending':
        return <Schedule sx={{ color: '#ff9800', fontSize: 20 }} />;
      case 'scheduled':
        return <Schedule sx={{ color: '#2196f3', fontSize: 20 }} />;
      default:
        return <Cancel sx={{ color: '#f44336', fontSize: 20 }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'scheduled':
        return 'info';
      default:
        return 'error';
    }
  };

  return (
    <Box>
      {/* Navigation Bar */}
      <StyledAppBar position="fixed" elevation={0}>
        <Toolbar sx={{position:'sticky'}}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto' }}>
            <GradientButton
              startIcon={<Add />}
              onClick={handleQuickActionOpen}
              sx={{
                background: 'rgba(255, 255, 255, 0.2)',
                '&:hover': { background: 'rgba(255, 255, 255, 0.3)' }
              }}
            >
              Quick Action
            </GradientButton>

            <IconButton
              color="inherit"
              onClick={handleNotificationOpen}
            >
              <Badge badgeContent={2} color="error">
                <Notifications />
              </Badge>
            </IconButton>

            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{ p: 0 }}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  bgcolor: !userProfilePic || avatarError ? '#2c67f2' : 'transparent',
                  color: 'white',
                  fontWeight: 600,
                }}
                src={!avatarError ? userProfilePic : undefined}
                alt={userName}
                onError={handleAvatarError}
              >
                {(!userProfilePic || avatarError) && userName ? userName.charAt(0).toUpperCase() : ''}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </StyledAppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
            minWidth: 200,
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)', // Safari support
            border: '1px solid rgba(255, 255, 255, 0.3)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 'inherit',
              zIndex: -1,
            }
          }
        }}
        MenuListProps={{
          sx: {
            py: 1,
            background: 'transparent',
          }
        }}
      >
        <MenuItem onClick={myProfileClick}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          <ListItemText>My Profile</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <ExitToApp fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
            maxWidth: 350,
            minWidth: 300,
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)', // Safari support
            border: '1px solid rgba(255, 255, 255, 0.3)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 'inherit',
              zIndex: -1,
            }
          }
        }}
        MenuListProps={{
          sx: {
            py: 0,
            background: 'transparent',
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c67f2' }}>
            Notifications
          </Typography>
        </Box>
        <Divider />
        {notifications.map((notification) => (
          <MenuItem key={notification.id} onClick={handleNotificationClose}>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {notification.title}
                </Typography>
                {notification.unread && (
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#2c67f2' }} />
                )}
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                {notification.message}
              </Typography>
              <Typography variant="caption" color="text.disabled">
                {notification.time}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>

      {/* Quick Action Menu */}
      <Menu
        anchorEl={quickActionAnchor}
        open={Boolean(quickActionAnchor)}
        onClose={handleQuickActionClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
            minWidth: 320,
            maxWidth: 400,
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)', // Safari support
            border: '1px solid rgba(255, 255, 255, 0.3)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 'inherit',
              zIndex: -1,
            }
          }
        }}
        MenuListProps={{
          sx: {
            py: 2,
            background: 'transparent',
          }
        }}
      >
        <Box sx={{ px: 2, mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c67f2', mb: 1 }}>
            Quick Actions
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
            Access key features quickly
          </Typography>
        </Box>
        
        {/* Stats Cards as Quick Actions */}
        <Box sx={{ px: 2, mb: 2 }}>
          <Grid container spacing={1.5}>
            <Grid item xs={6}>
              <Card 
                onClick={() => { handleJobsClick(); handleQuickActionClose(); }}
                sx={{ 
                  cursor: 'pointer',
                  p: 1.5,
                  borderRadius: 1.5,
                  background: 'rgba(44, 103, 242, 0.1)',
                  border: '1px solid rgba(44, 103, 242, 0.2)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'rgba(44, 103, 242, 0.15)',
                    transform: 'translateY(-1px)',
                  }
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Work sx={{ fontSize: 24, color: '#2c67f2', mb: 0.5 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                    1,234
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total Jobs
                  </Typography>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card 
                onClick={() => { handleApplicationsClick(); handleQuickActionClose(); }}
                sx={{ 
                  cursor: 'pointer',
                  p: 1.5,
                  borderRadius: 1.5,
                  background: 'rgba(76, 175, 80, 0.1)',
                  border: '1px solid rgba(76, 175, 80, 0.2)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'rgba(76, 175, 80, 0.15)',
                    transform: 'translateY(-1px)',
                  }
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <People sx={{ fontSize: 24, color: '#4caf50', mb: 0.5 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                    89
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Applications
                  </Typography>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card 
                onClick={() => { handleTrainingClick(); handleQuickActionClose(); }}
                sx={{ 
                  cursor: 'pointer',
                  p: 1.5,
                  borderRadius: 1.5,
                  background: 'rgba(156, 39, 176, 0.1)',
                  border: '1px solid rgba(156, 39, 176, 0.2)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'rgba(156, 39, 176, 0.15)',
                    transform: 'translateY(-1px)',
                  }
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <School sx={{ fontSize: 24, color: '#9c27b0', mb: 0.5 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                    67
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Training
                  </Typography>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card 
                onClick={() => { handleResumeClick(); handleQuickActionClose(); }}
                sx={{ 
                  cursor: 'pointer',
                  p: 1.5,
                  borderRadius: 1.5,
                  background: 'rgba(255, 152, 0, 0.1)',
                  border: '1px solid rgba(255, 152, 0, 0.2)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'rgba(255, 152, 0, 0.15)',
                    transform: 'translateY(-1px)',
                  }
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Description sx={{ fontSize: 24, color: '#ff9800', mb: 0.5 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                    Updated
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Resume
                  </Typography>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ mx: 2, my: 1 }} />

        {/* Additional Quick Actions */}
        <MenuItem 
          onClick={() => { handleJobCreationClick(); handleQuickActionClose(); }}
          sx={{
            py: 1.5,
            px: 2,
            mx: 1,
            borderRadius: 1,
            transition: 'all 0.2s ease',
            '&:hover': {
              background: 'rgba(233, 30, 99, 0.1)',
              color: '#e91e63',
            }
          }}
        >
          <ListItemIcon sx={{ color: 'inherit' }}>
            <PostAdd fontSize="small" />
          </ListItemIcon>
          <ListItemText 
            primary="Create Job Opening" 
            secondary="Post a new job"
            primaryTypographyProps={{
              fontWeight: 500,
              fontSize: '0.95rem'
            }}
          />
        </MenuItem>
        
        <MenuItem 
          onClick={() => { handleCandidatesClick(); handleQuickActionClose(); }}
          sx={{
            py: 1.5,
            px: 2,
            mx: 1,
            borderRadius: 1,
            transition: 'all 0.2s ease',
            '&:hover': {
              background: 'rgba(0, 188, 212, 0.1)',
              color: '#00bcd4',
            }
          }}
        >
          <ListItemIcon sx={{ color: 'inherit' }}>
            <People fontSize="small" />
          </ListItemIcon>
          <ListItemText 
            primary="View Candidates" 
            secondary="Manage applicants"
            primaryTypographyProps={{
              fontWeight: 500,
              fontSize: '0.95rem'
            }}
          />
        </MenuItem>

        <MenuItem 
          onClick={() => { handleCreateCoursesClick(); handleQuickActionClose(); }}
          sx={{
            py: 1.5,
            px: 2,
            mx: 1,
            borderRadius: 1,
            transition: 'all 0.2s ease',
            '&:hover': {
              background: 'rgba(121, 85, 72, 0.1)',
              color: '#795548',
            }
          }}
        >
          <ListItemIcon sx={{ color: 'inherit' }}>
            <Add fontSize="small" />
          </ListItemIcon>
          <ListItemText 
            primary="Create Courses" 
            secondary="Add new training course"
            primaryTypographyProps={{
              fontWeight: 500,
              fontSize: '0.95rem'
            }}
          />
        </MenuItem>

        <MenuItem 
          onClick={() => { handleCourseEnrollmentsClick(); handleQuickActionClose(); }}
          sx={{
            py: 1.5,
            px: 2,
            mx: 1,
            borderRadius: 1,
            transition: 'all 0.2s ease',
            '&:hover': {
              background: 'rgba(103, 58, 183, 0.1)',
              color: '#673ab7',
            }
          }}
        >
          <ListItemIcon sx={{ color: 'inherit' }}>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          <ListItemText 
            primary="Course Enrollments" 
            secondary="View student enrollments"
            primaryTypographyProps={{
              fontWeight: 500,
              fontSize: '0.95rem'
            }}
          />
        </MenuItem>
      </Menu>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
          }
        }}
      >
        <DialogTitle sx={{ color: '#2c67f2', fontWeight: 600 }}>
          Confirm Logout
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to logout? You will need to sign in again to access your dashboard.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={handleLogoutCancel}
            sx={{
              color: '#666',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              }
            }}
          >
            Cancel
          </Button>
          <GradientButton
            onClick={handleLogoutConfirm}
            startIcon={<ExitToApp />}
            sx={{ height: 36 }}
          >
            Logout
          </GradientButton>
        </DialogActions>
      </Dialog>

      {/* Dashboard Content */}
      <DashboardContainer>
        <Container maxWidth="xl">
          {/* Welcome Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 1 }}>
              Welcome back, {userName || 'User'}! 👋
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Here's what's happening with your job search today.
            </Typography>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
                <StatsCard 
                  onClick={stat.onClick}
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography color="text.secondary" gutterBottom variant="overline">
                          {stat.title}
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                          {stat.value}
                        </Typography>
                        <Chip
                          label={stat.change}
                          size="small"
                          sx={{
                            backgroundColor: '#e8f5e8',
                            color: '#4caf50',
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: 2,
                          backgroundColor: stat.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {stat.icon}
                      </Box>
                    </Box>
                  </CardContent>
                </StatsCard>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={3}>
            {/* Recent Activity */}
            {/* <Grid item xs={12} md={8}>
              <StatsCard>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c67f2' }}>
                      Recent Activity
                    </Typography>
                    <IconButton size="small">
                      <MoreVert />
                    </IconButton>
                  </Box>
                  <List>
                    {recentActivities.map((activity, index) => (
                      <ListItem key={activity.id} sx={{ px: 0 }}>
                        <ListItemIcon>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 1,
                              backgroundColor: '#f5f5f5',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#2c67f2',
                            }}
                          >
                            {activity.icon}
                          </Box>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {activity.title}
                              </Typography>
                              {getStatusIcon(activity.status)}
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {activity.description}
                              </Typography>
                              <Typography variant="caption" color="text.disabled">
                                {activity.time}
                              </Typography>
                            </Box>
                          }
                        />
                        <Chip
                          label={activity.status}
                          size="small"
                          color={getStatusColor(activity.status)}
                          variant="outlined"
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </StatsCard>
            </Grid> */}

            {/* Quick Actions */}
            {/* <Grid item xs={12} md={4}>
              <StatsCard sx={{ height: 'fit-content' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c67f2', mb: 3 }}>
                    Quick Actions
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <GradientButton
                      fullWidth
                      startIcon={<Search />}
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Browse Jobs
                    </GradientButton>
                    <GradientButton
                      fullWidth
                      startIcon={<Person />}
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Update Profile
                    </GradientButton>
                    <GradientButton
                      fullWidth
                      startIcon={<School />}
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Find Training
                    </GradientButton>
                    <GradientButton
                      fullWidth
                      startIcon={<TrendingUp />}
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      View Analytics
                    </GradientButton>
                  </Box>
                </CardContent>
              </StatsCard>
            </Grid> */}
          </Grid>
          <Routes>
            {route.map((val, index) =>
              <Route key={index} path={val.path} element={val.element}></Route>
            )}
          </Routes>
        </Container>
      </DashboardContainer>
    </Box>
  );
};

export default Dashboard;
