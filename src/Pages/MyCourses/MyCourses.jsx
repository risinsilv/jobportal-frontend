import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Grid,
  Avatar,
  Stack,
  Paper,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack,
  PlayArrow,
  Person,
  School,
  BookmarkBorder,
  Bookmark,
  Share,
  OpenInNew,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import instance from '../../Service/AxiosOrder';

// Styled components with glassmorphism
const MyCoursesContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  paddingTop: theme.spacing(3),
}));

const MyCoursesHeader = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  background: 'linear-gradient(135deg, #009688 15%, #00695c 100%)',
  color: 'white',
  boxShadow: '0 8px 32px rgba(0, 150, 136, 0.3)',
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

const CourseCard = styled(Card)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderRadius: theme.spacing(2),
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  marginBottom: theme.spacing(2),
  overflow: 'hidden',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
    transform: 'translateY(-4px)',
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

const MyCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarkedCourses, setBookmarkedCourses] = useState(new Set());


  const userId = localStorage.getItem('user');

  useEffect(() => {
    if (userId) {
      loadMyCourses();
    } else {
      setError('Please log in to view your courses.');
      setLoading(false);
    }
  }, [userId]);

  // Function to generate thumbnail from video URL
  const generateThumbnail = (videoUrl, title, category) => {
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
    
    // Create a styled placeholder with category-based colors
    const categoryColors = {
      'Programming': '009688',
      'Web Development': '4caf50',
      'Mobile Development': 'ff5722',
      'Data Science': 'ffc107',
      'Machine Learning': '9c27b0',
      'UI/UX Design': 'e91e63',
      'Digital Marketing': 'ff9800',
      'Business': '607d8b',
      'Other': '795548'
    };
    
    const color = categoryColors[category] || categoryColors['Other'];
    const titleText = encodeURIComponent(title.length > 30 ? title.substring(0, 27) + '...' : title);
    
    return `https://via.placeholder.com/500x280/${color}/FFFFFF?text=${titleText}`;
  };

  // Function to fetch trainer details
  const fetchTrainerDetails = async (trainerId) => {
    try {
      const response = await instance.get(`/api/trainers/${trainerId}`);
      const trainerData = response.data;
      
      // Also fetch user details for the trainer
      const userResponse = await instance.get(`/api/users/${trainerId}`);
      const userData = userResponse.data;
      
      return {
        userId: trainerId,
        name: userData.name || 'Course Instructor',
        profilePic: userData.profilePic 
          ? `/api/users/images/${userData.profilePic}` 
          : `https://via.placeholder.com/50/009688/FFFFFF?text=${userData.name?.charAt(0) || 'T'}`,
        specialization: trainerData.specialization,
        bio: trainerData.bio,
      };
    } catch (error) {
      console.log(`Could not fetch trainer details for ID: ${trainerId}`);
      return {
        userId: trainerId,
        name: 'Course Instructor',
        profilePic: `https://via.placeholder.com/50/009688/FFFFFF?text=${trainerId}`,
      };
    }
  };

  // Load user's enrolled courses
  const loadMyCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Loading courses for user:', userId);
      
      // First, get user's enrollments
      const enrollmentsResponse = await instance.get(`/api/enrollments/user/${userId}`);
      const enrollments = enrollmentsResponse.data;
      
      console.log('User enrollments:', enrollments);
      
      if (enrollments.length === 0) {
        setCourses([]);
        return;
      }
      
      // For each enrollment, get the course details
      const coursesWithDetails = await Promise.all(
        enrollments.map(async (enrollment) => {
          try {
            // Get course details by courseId
            const courseResponse = await instance.get(`/api/courses/${enrollment.courseId}`);
            const courseData = courseResponse.data;
            
            // Get trainer details
            const trainerDetails = await fetchTrainerDetails(courseData.trainerId);
            
            return {
              enrollmentId: enrollment.enrollmentId,
              enrollmentDate: enrollment.enrollmentDate,
              courseId: courseData.courseId,
              title: courseData.title,
              description: courseData.description,
              cost: courseData.cost.toString().startsWith('$') ? courseData.cost : `$${courseData.cost}`,
              videoUrl: courseData.videoUrl,
              category: courseData.category || 'Other',
              trainer: trainerDetails,
              duration: '30 hours', // Default - consider adding to backend
              rating: 4.5 + Math.random() * 0.5, // Mock rating
              studentsEnrolled: Math.floor(Math.random() * 500) + 50,
              thumbnail: generateThumbnail(courseData.videoUrl, courseData.title, courseData.category || 'Other'),
            };
          } catch (error) {
            console.error(`Failed to load course details for courseId: ${enrollment.courseId}`, error);
            return null;
          }
        })
      );
      
      // Filter out null values (failed course loads)
      const validCourses = coursesWithDetails.filter(course => course !== null);
      setCourses(validCourses);
      
      console.log('Loaded user courses:', validCourses);
      
    } catch (error) {
      console.error('Failed to load user courses:', error);
      setError('Failed to load your courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/Dashboard');
  };

  const handleBookmark = (courseId) => {
    setBookmarkedCourses(prev => {
      const newBookmarks = new Set(prev);
      if (newBookmarks.has(courseId)) {
        newBookmarks.delete(courseId);
      } else {
        newBookmarks.add(courseId);
      }
      return newBookmarks;
    });
  };

  const handleContinueCourse = (course) => {
    // Open course video URL
    if (course.videoUrl && course.videoUrl !== 'https://example.com/sample-course') {
      window.open(course.videoUrl, '_blank', 'noopener,noreferrer');
    } else {
      console.log('Continue course:', course.courseId);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Calculate statistics
  const totalCourses = courses.length;

  return (
    <MyCoursesContainer>
      <Container maxWidth="lg">
        {/* Header */}
        <MyCoursesHeader>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <IconButton
                onClick={handleBack}
                sx={{
                  color: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
                }}
              >
                <ArrowBack />
              </IconButton>
              <Typography variant="h4" component="h1" fontWeight="bold">
                My Courses
              </Typography>
            </Box>
            <Typography variant="h6" opacity={0.9}>
              Continue your learning journey with your enrolled courses
            </Typography>
          </Box>
        </MyCoursesHeader>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={40} sx={{ color: '#009688' }} />
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
                onClick={loadMyCourses}
                disabled={loading}
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
              <Grid item xs={12} sm={6} md={4}>
                <StatCard>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <School sx={{ fontSize: 40, color: '#009688', mr: 1 }} />
                    <Typography variant="h4" fontWeight="bold" color="#009688">
                      {totalCourses}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Enrolled
                  </Typography>
                </StatCard>
              </Grid>
            </Grid>

            {/* Courses Grid */}
            {courses.length === 0 ? (
              <Paper
                sx={{
                  p: 6,
                  textAlign: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  borderRadius: 3,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
              >
                <School sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No Courses Enrolled
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  You haven't enrolled in any courses yet. Start learning today!
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/Courses')}
                  sx={{
                    background: 'linear-gradient(45deg, #009688 30%, #00695c 90%)',
                    color: 'white',
                  }}
                >
                  Browse Courses
                </Button>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {courses.map((course) => (
                  <Grid item xs={12} sm={6} md={4} key={course.courseId}>
                    <CourseCard>
                      {/* Course Thumbnail */}
                      <CardMedia
                        component="img"
                        height="220"
                        image={course.thumbnail}
                        alt={course.title}
                        sx={{ 
                          cursor: 'pointer',
                          backgroundColor: '#f5f5f5',
                          objectFit: 'cover',
                          '&:hover': {
                            transform: 'scale(1.02)',
                            transition: 'transform 0.3s ease',
                          }
                        }}
                        onClick={() => handleContinueCourse(course)}
                      />
                      
                      <CardContent sx={{ p: 2 }}>
                        {/* Course Header */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography
                            variant="h6"
                            component="h3"
                            fontWeight="bold"
                            color="text.primary"
                            sx={{ 
                              fontSize: '1.1rem',
                              lineHeight: 1.3,
                              cursor: 'pointer',
                              '&:hover': {
                                color: 'primary.main',
                              }
                            }}
                            onClick={() => handleContinueCourse(course)}
                          >
                            {course.title}
                          </Typography>
                          
                          <IconButton
                            size="small"
                            onClick={() => handleBookmark(course.courseId)}
                            sx={{
                              backgroundColor: 'rgba(255, 255, 255, 0.8)',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              },
                            }}
                          >
                            {bookmarkedCourses.has(course.courseId) ? (
                              <Bookmark color="primary" fontSize="small" />
                            ) : (
                              <BookmarkBorder fontSize="small" />
                            )}
                          </IconButton>
                        </Box>

                        {/* Category */}
                        <Chip 
                          label={course.category} 
                          size="small" 
                          sx={{ mb: 2, backgroundColor: '#e0f2f1', color: '#00695c' }}
                        />

                        {/* Trainer Info */}
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                          <Avatar
                            src={course.trainer.profilePic}
                            alt={course.trainer.name}
                            sx={{ width: 32, height: 32, fontSize: '0.8rem' }}
                          >
                            {course.trainer.name.charAt(0)}
                          </Avatar>
                          <Typography variant="body2" color="text.secondary">
                            {course.trainer.name}
                          </Typography>
                        </Stack>

                        {/* Enrollment Date */}
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Enrolled: {formatDate(course.enrollmentDate)}
                        </Typography>

                        {/* Action Button */}
                        <Button
                          variant="contained"
                          fullWidth
                          startIcon={<PlayArrow />}
                          onClick={() => handleContinueCourse(course)}
                          sx={{
                            background: 'linear-gradient(45deg, #009688 30%, #00695c 90%)',
                            color: 'white',
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': {
                              background: 'linear-gradient(45deg, #00796b 30%, #004d40 90%)',
                            },
                          }}
                        >
                          View Course
                        </Button>
                      </CardContent>
                    </CourseCard>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </Container>
    </MyCoursesContainer>
  );
};

export default MyCourses;
