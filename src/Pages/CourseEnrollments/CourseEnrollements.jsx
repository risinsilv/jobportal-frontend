import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Alert,
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
import instance from '../../Service/AxiosOrder';

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
  console.log('CourseEnrollments component loaded');
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDialogOpen, setStudentDialogOpen] = useState(false);
  
  // API state management
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get current trainer/user ID from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = localStorage.getItem('user');
  const role = localStorage.getItem('role');
  console.log('Current user role:', role);
  console.log('Current user ID:', userId);

  useEffect(() => {
    if (role === 'Trainer' && userId) {
      loadTrainerCourses();
    }
  }, [userId, role]);

  // Function to generate video thumbnail
  const generateVideoThumbnail = (videoUrl, title) => {
    // If videoUrl is a YouTube URL, extract thumbnail
    if (videoUrl && videoUrl.includes('youtube.com/watch')) {
      const videoId = videoUrl.split('v=')[1]?.split('&')[0];
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }
    }
    
    // If videoUrl is a YouTube short URL
    if (videoUrl && videoUrl.includes('youtu.be/')) {
      const videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0];
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }
    }

    // If videoUrl is a Vimeo URL
    if (videoUrl && videoUrl.includes('vimeo.com/')) {
      const videoId = videoUrl.split('vimeo.com/')[1]?.split('?')[0];
      if (videoId) {
        return `https://vumbnail.com/${videoId}.jpg`;
      }
    }
    
    // Create a styled placeholder with course-based colors
    const colors = ['4f46e5', '7c3aed', 'db2777', 'dc2626', 'ea580c', '059669', '0891b2', '3b82f6'];
    const colorIndex = (title?.length || 0) % colors.length;
    const color = colors[colorIndex];
    const titleText = encodeURIComponent(title?.substring(0, 20) || 'Course Video');
    
    return `https://via.placeholder.com/640x360/${color}/FFFFFF?text=${titleText}`;
  };

  // Load courses created by the current trainer
  const loadTrainerCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Loading courses for trainer:', userId);
      
      // Get courses by trainer ID using the specific endpoint
      const coursesResponse = await instance.get(`/api/courses/trainer/${userId}`);
      const trainerCourses = coursesResponse.data;
      console.log('Trainer courses found:', trainerCourses);
      
      // For each course, get enrollment details using the /by-course/{courseId} endpoint
      const coursesWithEnrollments = await Promise.all(
        trainerCourses.map(async (course) => {
          try {
            const enrollmentsResponse = await instance.get(`/api/enrollments/by-course/${course.courseId}`);
            const courseEnrollments = enrollmentsResponse.data;
            
            return {
              ...course,
              enrollments: courseEnrollments.length,
              enrollmentsList: courseEnrollments,
              completions: Math.floor(courseEnrollments.length * 0.7), // Mock completion rate
              revenue: courseEnrollments.length * parseFloat(course.cost.toString().replace('$', '')),
              rating: 4.5 + Math.random() * 0.5, // Mock rating
              status: 'Active'
            };
          } catch (error) {
            console.log(`Could not load enrollments for course ${course.courseId}:`, error);
            return {
              ...course,
              enrollments: 0,
              enrollmentsList: [],
              completions: 0,
              revenue: 0,
              rating: 4.5,
              status: 'Active'
            };
          }
        })
      );
      
      setCourses(coursesWithEnrollments);
      console.log('Loaded trainer courses with enrollments:', coursesWithEnrollments);
      
    } catch (error) {
      console.error('Failed to load trainer courses:', error);
      setError('Failed to load courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load enrollments for a specific course
  const loadCourseEnrollments = async (courseId) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Loading enrollments for course:', courseId);
      
      const enrollmentsResponse = await instance.get(`/api/enrollments/by-course/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const courseEnrollments = enrollmentsResponse.data;
      
      // For each enrollment, get user details
      const enrollmentsWithUserDetails = await Promise.all(
        courseEnrollments.map(async (enrollment) => {
          try {
            const userResponse = await instance.get(`/api/users/${enrollment.userId}`);
            const userData = userResponse.data;
            
            return {
              id: enrollment.enrollmentId,
              name: userData.name,
              email: userData.email,
              phone: userData.phoneNumber || 'Not provided',
              enrolledDate: enrollment.enrollmentDate || new Date().toISOString(),
              lastActive: '1 hour ago', // Mock data - you might want to add this to your backend
              progress: Math.floor(Math.random() * 100), // Mock progress
              status: 'Active',
              avatar: userData.profilePic 
                ? `/api/users/images/${userData.profilePic}` 
                : `https://via.placeholder.com/150/4f46e5/FFFFFF?text=${userData.name?.charAt(0) || 'U'}`,
            };
          } catch (error) {
            console.log(`Could not load user details for enrollment ${enrollment.enrollmentId}:`, error);
            return {
              id: enrollment.enrollmentId,
              name: 'Unknown User',
              email: 'email@example.com',
              phone: 'Not provided',
              enrolledDate: enrollment.enrollmentDate || new Date().toISOString(),
              lastActive: 'Unknown',
              progress: 0,
              status: 'Unknown',
              avatar: 'https://via.placeholder.com/150/666/FFFFFF?text=U',
            };
          }
        })
      );
      
      setEnrollments(enrollmentsWithUserDetails);
      console.log('Loaded course enrollments with user details:', enrollmentsWithUserDetails);
      
    } catch (error) {
      console.error('Failed to load course enrollments:', error);
      setError('Failed to load enrollments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelect = async (course) => {
    setSelectedCourse(course);
    await loadCourseEnrollments(course.courseId);
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setSearchTerm('');
    setEnrollments([]);
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

  const filteredEnrollments = enrollments.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const totalEnrollments = courses.reduce((sum, course) => sum + course.enrollments, 0);

  // Role-based access control
  if (role !== 'Trainer') {
    return (
      <CourseEnrollmentsContainer>
        <Container maxWidth="lg">
          <Alert 
            severity="warning" 
            sx={{ 
              mt: 4,
              backgroundColor: 'rgba(255, 152, 0, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 152, 0, 0.2)'
            }}
          >
            Access denied. This page is only available for trainers.
          </Alert>
        </Container>
      </CourseEnrollmentsContainer>
    );
  }

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
            {/* Loading State */}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={40} sx={{ color: '#2c67f2' }} />
              </Box>
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
                    onClick={loadTrainerCourses}
                  >
                    Retry
                  </Button>
                }
              >
                {error}
              </Alert>
            )}

            {/* Statistics Overview */}
            {!loading && !error && (
              <>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} md={3}>
                    <StatCard>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                        <School sx={{ fontSize: 40, color: '#2c67f2', mr: 1 }} />
                        <Typography variant="h4" fontWeight="bold" color="#2c67f2">
                          {courses.length}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Total Courses
                      </Typography>
                    </StatCard>
                  </Grid>
                  <Grid item xs={12} md={3}>
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
                  <Grid item xs={12} md={3}>
                    <StatCard>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                        <CheckCircle sx={{ fontSize: 40, color: '#ff9800', mr: 1 }} />
                        <Typography variant="h4" fontWeight="bold" color="#ff9800">
                          {courses.reduce((sum, course) => sum + (course.completions || 0), 0)}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Completions
                      </Typography>
                    </StatCard>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <StatCard>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                        <Assignment sx={{ fontSize: 40, color: '#9c27b0', mr: 1 }} />
                        <Typography variant="h4" fontWeight="bold" color="#9c27b0">
                          ${courses.reduce((sum, course) => sum + (course.revenue || 0), 0).toFixed(0)}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Total Revenue
                      </Typography>
                    </StatCard>
                  </Grid>
                </Grid>

                {/* Courses Grid */}
                {courses.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <School sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h5" color="text.secondary" gutterBottom>
                      No Training Courses Found
                    </Typography>
                    <Typography variant="body2" color="text.disabled">
                      You haven't created any training courses yet. Start by creating your first course to manage enrollments.
                    </Typography>
                  </Box>
                ) : (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h5" fontWeight="bold" sx={{ color: '#2c67f2' }}>
                        Your Training Courses ({courses.length})
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Click on any course to view detailed enrollment information
                      </Typography>
                    </Box>
                    <Grid container spacing={3}>
                      {courses.map((course) => (
                        <Grid item xs={12} md={6} lg={4} key={course.courseId}>
                          <GlassCard>
                            {/* Video Thumbnail Section */}
                            {course.videoUrl && course.videoUrl !== 'https://example.com/sample-course' && (
                              <Box 
                                sx={{ 
                                  position: 'relative',
                                  paddingTop: '56.25%', // 16:9 aspect ratio
                                  overflow: 'hidden',
                                  borderRadius: '16px 16px 0 0',
                                  backgroundColor: '#f5f5f5'
                                }}
                              >
                                {/* Video Thumbnail */}
                                <Box
                                  component="img"
                                  src={generateVideoThumbnail(course.videoUrl, course.title)}
                                  alt={`${course.title} thumbnail`}
                                  sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    cursor: 'pointer',
                                    transition: 'transform 0.3s ease',
                                    '&:hover': {
                                      transform: 'scale(1.05)',
                                    }
                                  }}
                                  onClick={() => window.open(course.videoUrl, '_blank')}
                                />
                                
                                {/* Play Button Overlay */}
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    cursor: 'pointer',
                                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                    borderRadius: '50%',
                                    width: 60,
                                    height: 60,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                      backgroundColor: 'rgba(44, 103, 242, 0.9)',
                                      transform: 'translate(-50%, -50%) scale(1.1)',
                                    }
                                  }}
                                  onClick={() => window.open(course.videoUrl, '_blank')}
                                >
                                  <PlayArrow sx={{ color: 'white', fontSize: 30, ml: 0.5 }} />
                                </Box>

                                {/* Video Duration Badge */}
                                <Chip
                                  label={course.duration || "30 mins"}
                                  size="small"
                                  sx={{
                                    position: 'absolute',
                                    bottom: 8,
                                    right: 8,
                                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                    color: 'white',
                                    fontSize: '0.75rem'
                                  }}
                                />
                              </Box>
                            )}
                            
                            <CardContent>
                              {/* Course Header */}
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, color: '#2c67f2' }}>
                                    {course.title}
                                  </Typography>
                                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                                    <Chip 
                                      label={course.category} 
                                      size="small" 
                                      sx={{ backgroundColor: '#e3f2fd', color: '#1976d2' }}
                                    />
                                    <Chip
                                      label={course.status}
                                      color={course.status === 'Active' ? 'success' : 'default'}
                                      size="small"
                                    />
                                  </Box>
                                </Box>
                              </Box>

                              {/* Course Description */}
                              <Typography 
                                variant="body2" 
                                color="text.secondary" 
                                sx={{ 
                                  mb: 2, 
                                  display: '-webkit-box',
                                  WebkitLineClamp: 3,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  minHeight: '60px'
                                }}
                              >
                                {course.description || 'No description available'}
                              </Typography>

                              {/* Course Details Grid */}
                              <Box sx={{ mb: 3 }}>
                                <Grid container spacing={1}>
                                  <Grid item xs={6}>
                                    <Box sx={{ textAlign: 'center', p: 1, backgroundColor: 'rgba(44, 103, 242, 0.05)', borderRadius: 1 }}>
                                      <Typography variant="h6" fontWeight="bold" color="#2c67f2">
                                        {course.enrollments}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        Enrollments
                                      </Typography>
                                    </Box>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Box sx={{ textAlign: 'center', p: 1, backgroundColor: 'rgba(76, 175, 80, 0.05)', borderRadius: 1 }}>
                                      <Typography variant="h6" fontWeight="bold" color="#4caf50">
                                        {course.cost}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        Price
                                      </Typography>
                                    </Box>
                                  </Grid>
                                </Grid>
                              </Box>

                              {/* Additional Course Info */}
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                  <strong>Course ID:</strong> {course.courseId}
                                </Typography>
                                {course.duration && (
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                    <strong>Duration:</strong> {course.duration}
                                  </Typography>
                                )}
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                  <strong>Revenue:</strong> ${course.revenue?.toFixed(2) || '0.00'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                  <strong>Completion Rate:</strong> {((course.completions / course.enrollments) * 100 || 0).toFixed(1)}%
                                </Typography>
                                {course.rating && (
                                  <Typography variant="body2" color="text.secondary">
                                    <strong>Rating:</strong> ⭐ {course.rating.toFixed(1)}/5.0
                                  </Typography>
                                )}
                                {course.videoUrl && course.videoUrl !== 'https://example.com/sample-course' && (
                                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    <strong>Video:</strong> 
                                    <Button
                                      variant="text"
                                      size="small"
                                      startIcon={<PlayArrow />}
                                      onClick={() => window.open(course.videoUrl, '_blank')}
                                      sx={{
                                        color: '#ff5722',
                                        fontSize: '0.75rem',
                                        ml: 1,
                                        minWidth: 'auto',
                                        padding: '2px 8px',
                                        '&:hover': {
                                          backgroundColor: 'rgba(255, 87, 34, 0.04)',
                                        },
                                      }}
                                    >
                                      Watch
                                    </Button>
                                  </Typography>
                                )}
                              </Box>

                              {/* Action Button */}
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
                )}
              </>
            )}
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
