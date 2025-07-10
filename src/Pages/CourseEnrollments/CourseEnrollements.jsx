import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Avatar,
  Chip,
  IconButton,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
} from '@mui/material';
import {
  ArrowBack,
  School,
  People,
  Visibility,
  FilterList,
  Search,
  Email,
  Phone,
  Assignment,
  PlayArrow,
  CheckCircle,
  Schedule,
  Person,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Styled components with glassmorphism
const CourseEnrollmentsContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
}));

const CourseEnrollmentsHeader = styled(Paper)(({ theme }) => ({
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

const GlassCard = styled(Card)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderRadius: theme.spacing(2),
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  marginBottom: theme.spacing(3),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  },
}));

const StatCard = styled(Card)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(15px)',
  WebkitBackdropFilter: 'blur(15px)',
  borderRadius: theme.spacing(2),
  border: '1px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  textAlign: 'center',
  padding: theme.spacing(2),
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #62cff4 15%, #2c67f2 100%)',
  color: 'white',
  borderRadius: theme.spacing(1.5),
  boxShadow: '0 4px 15px rgba(44, 103, 242, 0.3)',
  padding: theme.spacing(1.5, 3),
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #4fbff0 15%, #1f5ae8 100%)',
    boxShadow: '0 6px 20px rgba(44, 103, 242, 0.4)',
    transform: 'translateY(-2px)',
  },
}));

const CourseEnrollments = () => {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDialogOpen, setStudentDialogOpen] = useState(false);

  // Mock data for trainer's courses
  const trainerCourses = [
    {
      id: 1,
      title: 'Complete React Development Bootcamp',
      category: 'Web Development',
      enrollments: 45,
      completions: 32,
      revenue: 4500,
      rating: 4.8,
      duration: '12 weeks',
      status: 'Active',
    },
    {
      id: 2,
      title: 'JavaScript Fundamentals',
      category: 'Programming',
      enrollments: 78,
      completions: 65,
      revenue: 3900,
      rating: 4.6,
      duration: '8 weeks',
      status: 'Active',
    },
    {
      id: 3,
      title: 'Advanced Node.js Development',
      category: 'Backend Development',
      enrollments: 23,
      completions: 18,
      revenue: 2300,
      rating: 4.9,
      duration: '10 weeks',
      status: 'Active',
    },
    {
      id: 4,
      title: 'UI/UX Design Principles',
      category: 'Design',
      enrollments: 56,
      completions: 41,
      revenue: 5600,
      rating: 4.7,
      duration: '6 weeks',
      status: 'Completed',
    },
  ];

  // Mock data for course enrollments
  const courseEnrollments = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567',
      enrolledDate: '2024-12-15',
      lastActive: '2 hours ago',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+1 (555) 234-5678',
      enrolledDate: '2024-12-10',
      lastActive: '1 day ago',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@email.com',
      phone: '+1 (555) 345-6789',
      enrolledDate: '2024-12-20',
      lastActive: '5 hours ago',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    {
      id: 4,
      name: 'David Wilson',
      email: 'david.wilson@email.com',
      phone: '+1 (555) 456-7890',
      enrolledDate: '2024-11-28',
      lastActive: '1 week ago',
      avatar: 'https://i.pravatar.cc/150?img=4',
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      email: 'lisa.thompson@email.com',
      phone: '+1 (555) 567-8901',
      enrolledDate: '2024-12-22',
      lastActive: '1 hour ago',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
  ];

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setSearchTerm('');
  };

  const handleBack = () => {
    navigate('/Dashboard');
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setStudentDialogOpen(true);
  };

  const handleCloseStudentDialog = () => {
    setStudentDialogOpen(false);
    setSelectedStudent(null);
  };

  const filteredEnrollments = courseEnrollments.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const totalEnrollments = trainerCourses.reduce((sum, course) => sum + course.enrollments, 0);

  return (
    <CourseEnrollmentsContainer>
      <Container maxWidth="xl">
        {/* Header */}
        <CourseEnrollmentsHeader>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <IconButton
                onClick={selectedCourse ? handleBackToCourses : handleBack}
                sx={{
                  color: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
                }}
              >
                <ArrowBack />
              </IconButton>
              <Typography variant="h4" component="h1" fontWeight="bold">
                {selectedCourse ? `${selectedCourse.title} - Enrollments` : 'Course Enrollments'}
              </Typography>
            </Box>
            <Typography variant="h6" opacity={0.9}>
              {selectedCourse ? 
                `Manage students enrolled in ${selectedCourse.title}` : 
                'View and manage student enrollments across your courses'
              }
            </Typography>
          </Box>
        </CourseEnrollmentsHeader>

        {!selectedCourse ? (
          // Course List View
          <>
            {/* Statistics Overview */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <StatCard>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <School sx={{ fontSize: 40, color: '#2c67f2', mr: 1 }} />
                    <Typography variant="h4" fontWeight="bold" color="#2c67f2">
                      {trainerCourses.length}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Courses
                  </Typography>
                </StatCard>
              </Grid>
              <Grid item xs={12} md={6}>
                <StatCard>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <People sx={{ fontSize: 40, color: '#4caf50', mr: 1 }} />
                    <Typography variant="h4" fontWeight="bold" color="#4caf50">
                      {totalEnrollments}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Enrollments
                  </Typography>
                </StatCard>
              </Grid>
            </Grid>

            {/* Courses Grid */}
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: '#2c67f2' }}>
              Your Courses
            </Typography>
            <Grid container spacing={3}>
              {trainerCourses.map((course) => (
                <Grid item xs={12} md={6} lg={4} key={course.id}>
                  <GlassCard>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                            {course.title}
                          </Typography>
                          <Chip 
                            label={course.category} 
                            size="small" 
                            sx={{ mb: 1, backgroundColor: '#e3f2fd' }}
                          />
                        </Box>
                        <Chip
                          label={course.status}
                          color={course.status === 'Active' ? 'success' : 'default'}
                          size="small"
                        />
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Enrollments: {course.enrollments}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Duration: {course.duration}
                          </Typography>
                        </Box>
                      </Box>

                      <GradientButton
                        fullWidth
                        onClick={() => handleCourseSelect(course)}
                        startIcon={<Visibility />}
                      >
                        View Enrollments ({course.enrollments})
                      </GradientButton>
                    </CardContent>
                  </GlassCard>
                </Grid>
              ))}
            </Grid>
          </>
        ) : (
          // Enrollments View for Selected Course
          <>
            {/* Course Info and Filters */}
            <GlassCard>
              <CardContent>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                      {selectedCourse.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedCourse.enrollments} students enrolled • {selectedCourse.duration}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      InputProps={{
                        startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </GlassCard>

            {/* Students List */}
            <GlassCard>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                  Enrolled Students ({filteredEnrollments.length})
                </Typography>
                {filteredEnrollments.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <People sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      No students found
                    </Typography>
                    <Typography variant="body2" color="text.disabled">
                      Try adjusting your search or filter criteria
                    </Typography>
                  </Box>
                ) : (
                  <Grid container spacing={2}>
                    {filteredEnrollments.map((student) => (
                      <Grid item xs={12} key={student.id}>
                        <Card
                          sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              transform: 'translateY(-1px)',
                            },
                          }}
                        >
                          <CardContent>
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={12} md={4}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Avatar
                                    src={student.avatar}
                                    sx={{ width: 50, height: 50, mr: 2 }}
                                  />
                                  <Box>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                      {student.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      Enrolled: {new Date(student.enrolledDate).toLocaleDateString()}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={4}>
                                <Typography variant="body2" color="text.disabled">
                                  Last active: {student.lastActive}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} md={4}>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() => handleViewStudent(student)}
                                  startIcon={<Visibility />}
                                  sx={{
                                    borderColor: '#2c67f2',
                                    color: '#2c67f2',
                                    '&:hover': {
                                      backgroundColor: 'rgba(44, 103, 242, 0.04)',
                                    },
                                  }}
                                >
                                  View Details
                                </Button>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </CardContent>
            </GlassCard>
          </>
        )}

        {/* Student Details Dialog */}
        <Dialog
          open={studentDialogOpen}
          onClose={handleCloseStudentDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
            }
          }}
        >
          {selectedStudent && (
            <>
              <DialogTitle sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    src={selectedStudent.avatar}
                    sx={{ width: 50, height: 50, mr: 2 }}
                  />
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {selectedStudent.name}
                    </Typography>
                  </Box>
                </Box>
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Contact Information
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ backgroundColor: '#e3f2fd' }}>
                            <Email />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={selectedStudent.email}
                          secondary="Email Address"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ backgroundColor: '#e8f5e8' }}>
                            <Phone />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={selectedStudent.phone}
                          secondary="Phone Number"
                        />
                      </ListItem>
                    </List>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Enrollment Details
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Enrolled on: {new Date(selectedStudent.enrolledDate).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Last active: {selectedStudent.lastActive}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: 2, gap: 1 }}>
                <Button
                  onClick={handleCloseStudentDialog}
                  sx={{ color: '#666' }}
                >
                  Close
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Email />}
                  sx={{
                    borderColor: '#2c67f2',
                    color: '#2c67f2',
                    '&:hover': {
                      backgroundColor: 'rgba(44, 103, 242, 0.04)',
                    },
                  }}
                >
                  Send Message
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </CourseEnrollmentsContainer>
  );
};

export default CourseEnrollments;
