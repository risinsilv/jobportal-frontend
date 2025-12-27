import React, { useState, useEffect } from 'react';
import "@fontsource/open-sans";
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
  Book,
  Assignment,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
 
 // Styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: '#fff',
  color: '#202124',
  borderBottom: '1px solid #dadce0',
  fontFamily: '"Google Sans"',
  '& *': {
    fontFamily: '"Google Sans" !important',
  },
}));
 
// const LogoText = styled(Typography)(({ theme }) => ({
//   fontWeight: 550,
//   fontSize: '30px',
//   letterSpacing: 0.3,
//   color: '#202124',
//   cursor: 'pointer',
//   userSelect: 'none',
// }));
const LogoText = styled(Typography)(({ theme }) => ({
  position: 'absolute',

  fontWeight: 550,
  fontSize: '25px',
  color: '#202124',
  zIndex: 2,
  letterSpacing: 0.3,
}));

 
 const DashboardContainer = styled(Box)(({ theme }) => ({
   marginTop: 72,
 }));
 
 const StatsCard = styled(Card)(({ theme }) => ({
   borderRadius: 12,
   border: '1px solid #e0e0e0',
   boxShadow: 'none',
 }));
 
 // Dashboard component
 const Dashboard = () => {
   const navigate = useNavigate();
   const location = useLocation();
 
   const [anchorEl, setAnchorEl] = useState(null);
   const [notificationAnchor, setNotificationAnchor] = useState(null);
   const [quickActionAnchor, setQuickActionAnchor] = useState(null);
   const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
   const [userName, setUserName] = useState(localStorage.getItem('name') || '');
   const [userProfilePic, setUserProfilePic] = useState(null);
   const [avatarError, setAvatarError] = useState(false);
   const [userDataLoading, setUserDataLoading] = useState(true);
   const [userRole, setUserRole] = useState(localStorage.getItem('role') || '');
 
   const handleAvatarError = () => setAvatarError(true);
 
   useEffect(() => {
     const fetchUserProfile = async () => {
       try {
         setUserDataLoading(true);
        const storedName = localStorage.getItem('name') || '';
        const userId = localStorage.getItem('user');
 
        // Preferred: fetch profile-pic via token-protected userId endpoint
        if (userId && userId !== 'undefined') {
          try {
            const resp = await instance.get(`/api/users/${userId}/profile-pic`, {
              responseType: 'text',
            });
            if (resp?.data) {
              const backendBase = import.meta.env.VITE_API_BASE_URL || window.location.origin;
              const finalUrl = `${backendBase}${resp.data}`;
              setUserProfilePic(finalUrl);
            }
          } catch (err) {
            if (err?.response?.status === 403) {
              // Not allowed: force re-login
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              localStorage.removeItem('role');
              localStorage.removeItem('name');
              window.location.reload();
              return;
            }
            // 404 or other errors: ignore; default avatar will be shown
          }

          // Fetch user details if name/role are missing
          try {
            const needName = !storedName;
            const needRole = !localStorage.getItem('role');
            if (needName || needRole) {
              const response = await instance.get(`/api/users/${userId}`);
              const userData = response.data;
              if (needName && userData?.name) {
                setUserName(userData.name);
                localStorage.setItem('name', userData.name);
              }
              if (needRole && userData?.role) {
                setUserRole(userData.role);
                localStorage.setItem('role', userData.role);
              }
            }
          } catch (err) {
            // Ignore if user details fail
          }
        }
       } catch (error) {
         console.error('Error fetching user profile:', error);
       } finally {
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
    // Training feature removed
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

  // Trainer course features removed

  const handleHomeClick = () => {
    console.log('Navigating to Home...');
    navigate('/Home');
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

  // Function to get role-specific stats
  const getRoleSpecificStats = () => {
    const role = userRole || localStorage.getItem('role');
    
    switch (role) {
      case 'JobSeeker':
        return [
          {
            title: 'Total Jobs',
            icon: <Work sx={{ fontSize: 40, color: '#2c67f2' }} />,
            color: '#e3f2fd',
            onClick: handleJobsClick,
          },
          {
            title: 'Active Applications',
            icon: <People sx={{ fontSize: 40, color: '#4caf50' }} />,
            color: '#e8f5e8',
            onClick: handleApplicationsClick,
          },
          {
            title: 'My Resume',
            icon: <Description sx={{ fontSize: 40, color: '#ff9800' }} />,
            color: '#fff3e0',
            onClick: handleResumeClick,
          },
          
        ];
      
      case 'Employer':
        return [
          {
            title: 'Create Job Opening',
            icon: <PostAdd sx={{ fontSize: 40, color: '#e91e63' }} />,
            color: '#fce4ec',
            onClick: handleJobCreationClick,
          },
          {
            title: 'Candidates',
            icon: <People sx={{ fontSize: 40, color: '#00bcd4' }} />,
            color: '#e0f2f1',
            onClick: handleCandidatesClick,
          },
          {
            title: 'My Job Postings',
            icon: <Work sx={{ fontSize: 40, color: '#2c67f2' }} />,
            color: '#e3f2fd',
            onClick: handleJobsClick,
          },
          
        ];
      
      case 'Trainer':
        return [
          {
            title: 'Training Programs',
            icon: <School sx={{ fontSize: 40, color: '#9c27b0' }} />,
            color: '#f3e5f5',
            onClick: handleTrainingClick,
          },
        ];
      
      default:
        // Default stats for unknown roles or during loading
        return [
          {
            title: 'Total Jobs',
            icon: <Work sx={{ fontSize: 40, color: '#2c67f2' }} />,
            color: '#e8f5e8',
            onClick: handleApplicationsClick,
          },
          {
            title: 'Training Programs',
            icon: <School sx={{ fontSize: 40, color: '#9c27b0' }} />,
            color: '#f3e5f5',
            onClick: handleTrainingClick,
          },
          
        ];
    }
  };

  // Function to get role-specific quick actions for menu
  const getRoleSpecificQuickActions = () => {
    const role = userRole || localStorage.getItem('role');
    
    switch (role) {
      case 'JobSeeker':
        return [
          { 
            title: 'Total Jobs', 
            subtitle: 'Browse available jobs', 
            icon: <Work fontSize="small" />,
            onClick: () => { handleJobsClick(); handleQuickActionClose(); },
            hoverColor: 'rgba(44, 103, 242, 0.1)',
            activeColor: '#2c67f2'
          },
          { 
            title: 'Active Applications', 
            subtitle: 'Track your applications', 
            icon: <People fontSize="small" />,
            onClick: () => { handleApplicationsClick(); handleQuickActionClose(); },
            hoverColor: 'rgba(76, 175, 80, 0.1)',
            activeColor: '#4caf50'
          },
          { 
            title: 'My Resume', 
            subtitle: 'Update profile', 
            icon: <Description fontSize="small" />,
            onClick: () => { handleResumeClick(); handleQuickActionClose(); },
            hoverColor: 'rgba(255, 152, 0, 0.1)',
            activeColor: '#ff9800'
          },
          
        ];
      case 'Employer':
        return [
          { 
            title: 'Create Job Opening', 
            subtitle: 'Post a new job', 
            icon: <PostAdd fontSize="small" />,
            onClick: () => { handleJobCreationClick(); handleQuickActionClose(); },
            hoverColor: 'rgba(233, 30, 99, 0.1)',
            activeColor: '#e91e63'
          },
          { 
            title: 'Candidates', 
            subtitle: 'Manage applicants', 
            icon: <People fontSize="small" />,
            onClick: () => { handleCandidatesClick(); handleQuickActionClose(); },
            hoverColor: 'rgba(0, 188, 212, 0.1)',
            activeColor: '#00bcd4'
          },
          { 
            title: 'My Job Postings', 
            subtitle: 'View your job posts', 
            icon: <Work fontSize="small" />,
            onClick: () => { handleJobsClick(); handleQuickActionClose(); },
            hoverColor: 'rgba(44, 103, 242, 0.1)',
            activeColor: '#2c67f2'
          },
          
        ];
      case 'Trainer':
        return [
          { 
            title: 'Training Programs', 
            subtitle: 'Explore courses', 
            icon: <School fontSize="small" />,
            onClick: () => { handleTrainingClick(); handleQuickActionClose(); },
            hoverColor: 'rgba(156, 39, 176, 0.1)',
            activeColor: '#9c27b0'
          }
        ];
      default:
        return [
          { 
            title: 'Total Jobs', 
            subtitle: 'Browse available jobs', 
            icon: <Work fontSize="small" />,
            onClick: () => { handleJobsClick(); handleQuickActionClose(); },
            hoverColor: 'rgba(44, 103, 242, 0.1)',
            activeColor: '#2c67f2'
          },
          { 
            title: 'Active Applications', 
            subtitle: 'Track your applications', 
            icon: <People fontSize="small" />,
            onClick: () => { handleApplicationsClick(); handleQuickActionClose(); },
            hoverColor: 'rgba(76, 175, 80, 0.1)',
            activeColor: '#4caf50'
          },
          
        ];
    }
  };

  // Sample data for dashboard
  const stats = getRoleSpecificStats();


  // Function to render dashboard content or empty view
  const renderDashboardContent = () => {
    // Return routes for all paths
    return (
      <Routes>
        {route.map((val, index) =>

          <Route key={index} path={val.path} element={val.element}></Route>
        )}
        {/* Root path: show Home within dashboard */}
        <Route path="/" element={route.find(r => r.path === '/Home')?.element} />
      </Routes>
    );
  };



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
        <Toolbar>
          {/* Left: Logo */}
          <LogoText variant="h6" onClick={() => navigate('/Home')}>
            <Box component="span" sx={{ color: '#4285F4' }}>J</Box>ob{' '}
            <Box component="span" sx={{ color: '#4285F4' }}>P</Box>ortal
          </LogoText>

          {/* Right: Hamburger + Avatar */}
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton aria-label="menu" onClick={handleQuickActionOpen}>
              <MenuIcon />
            </IconButton>
            <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0 }}>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  border: '1px solid #dadce0',
                  bgcolor: !userProfilePic || avatarError ? '#4285F4' : 'transparent',
                  color: '#fff',
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
            boxShadow: 'none',
            minWidth: 200,
            background: '#fff',
            border: '1px solid #dadce0',
          }
        }}
        MenuListProps={{
          sx: {
            py: 1,
            background: '#fff',
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
            boxShadow: 'none',
            maxWidth: 350,
            minWidth: 300,
            background: '#fff',
            border: '1px solid #dadce0',
          }
        }}
        MenuListProps={{
          sx: {
            py: 0,
            background: '#fff',
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
            boxShadow: 'none',
            minWidth: 320,
            maxWidth: 400,
            background: '#fff',
            border: '1px solid #dadce0',
          }
        }}
        MenuListProps={{
          sx: {
            py: 2,
            background: '#fff',
          }
        }}
      >
        <Box sx={{ px: 2, mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#202124', mb: 1 }}>
            Quick Actions
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
            Access key features quickly
          </Typography>
        </Box>

        <Divider sx={{ mx: 2, my: 1 }} />

        {/* Additional Quick Actions */}
        {getRoleSpecificQuickActions().map((action, index) => (
          <MenuItem 
            key={index}
            onClick={action.onClick}
            sx={{
              py: 1.5,
              px: 2,
              mx: 1,
              borderRadius: 1,
              '&:hover': {
                backgroundColor: '#f5f5f5',
              }
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>
              {action.icon}
            </ListItemIcon>
            <ListItemText 
              primary={action.title}
              secondary={action.subtitle}
              primaryTypographyProps={{
                fontWeight: 500,
                fontSize: '0.95rem'
              }}
            />
          </MenuItem>
        ))}
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
          <Button
            onClick={handleLogoutConfirm}
            startIcon={<ExitToApp />}
            variant="contained"
            sx={{
              height: 36,
              background: '#4285F4',
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': { background: '#1a73e8', boxShadow: 'none' },
            }}
          >
            Logout
          </Button>
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
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      textAlign: 'center',
                      py: 2
                    }}>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: 2,
                          backgroundColor: stat.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2,
                        }}
                      >
                        {stat.icon}
                      </Box>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 600, 
                          color: 'text.primary',
                          lineHeight: 1.2
                        }}
                      >
                        {stat.title}
                      </Typography>
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
          {/* Render Dashboard Content or Routes */}
          {renderDashboardContent()}
        </Container>
      </DashboardContainer>
    </Box>
  );
};

export default Dashboard;
