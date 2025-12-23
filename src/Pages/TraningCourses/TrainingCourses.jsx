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
  IconButton,
  CardMedia,
  LinearProgress,
  Rating,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Search,
  PlayArrow,
  AccessTime,
  Person,
  AttachMoney,
  FilterList,
  Bookmark,
  BookmarkBorder,
  Share,
  School,
  Star,
  StarBorder,
  Refresh,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import instance from '../../Service/AxiosOrder';

// Styled components with glassmorphism
const CoursesContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  paddingTop: theme.spacing(3),
}));

const CoursesHeader = styled(Paper)(({ theme }) => ({
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

const FilterChip = styled(Chip)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  color: '#333',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  '&.MuiChip-filled': {
    backgroundColor: 'rgba(44, 103, 242, 0.8)',
    color: 'white',
    '&:hover': {
      backgroundColor: 'rgba(44, 103, 242, 0.9)',
    },
  },
}));

const TrainingCourses = () => {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [bookmarkedCourses, setBookmarkedCourses] = useState(new Set());
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState(new Set());
  const [enrollmentLoading, setEnrollmentLoading] = useState(new Set());
  const [successMessage, setSuccessMessage] = useState('');

  // Course categories for filtering
  const categories = ['All', 'Programming', 'Web Development', 'Mobile Development', 'Data Science', 'Machine Learning', 'UI/UX Design', 'Digital Marketing', 'Business', 'Other'];

  useEffect(() => {
    // Load courses data and user enrollments on component mount
    loadCoursesWithTrainers();
    loadUserEnrollments();
  }, []);

  // Function to load user's current enrollments
  const loadUserEnrollments = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = currentUser.id;

      if (!userId) return;

      console.log('Loading user enrollments for user:', userId);
      const response = await instance.get(`/api/enrollments/user/${userId}`);
      const enrollments = response.data;
      
      // Extract course IDs from enrollments
      const enrolledCourseIds = new Set(enrollments.map(enrollment => enrollment.courseId));
      setEnrolledCourses(enrolledCourseIds);
      
      console.log('User enrolled courses:', enrolledCourseIds);
    } catch (error) {
      console.log('Could not load user enrollments:', error);
      // Don't show error for this, as user might not be logged in
    }
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
          : `https://via.placeholder.com/50/4f46e5/FFFFFF?text=${userData.name?.charAt(0) || 'T'}`,
        specialization: trainerData.specialization,
        bio: trainerData.bio,
      };
    } catch (error) {
      console.log(`Could not fetch trainer details for ID: ${trainerId}`);
      return {
        userId: trainerId,
        name: 'Course Instructor',
        profilePic: `https://via.placeholder.com/50/4f46e5/FFFFFF?text=${trainerId}`,
      };
    }
  };

  // Function to generate thumbnail from video URL or create a styled placeholder
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
    
    // If videoUrl is a Vimeo URL
    if (videoUrl && videoUrl.includes('vimeo.com/')) {
      // For Vimeo, we'd need an API call, so fall back to styled placeholder
    }
    
    // Create a styled placeholder with category-based colors
    const categoryColors = {
      'Programming': '4f46e5',
      'Web Development': '059669',
      'Mobile Development': 'dc2626',
      'Data Science': 'ca8a04',
      'Machine Learning': '7c3aed',
      'UI/UX Design': 'ea580c',
      'Digital Marketing': 'be185d',
      'Business': '0f766e',
      'Other': '6b7280'
    };
    
    const color = categoryColors[category] || categoryColors['Other'];
    const titleText = encodeURIComponent(title.length > 30 ? title.substring(0, 27) + '...' : title);
    
    return `https://via.placeholder.com/500x280/${color}/FFFFFF?text=${titleText}`;
  };

  // Enhanced function to load courses with trainer details
  const loadCoursesWithTrainers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Fetching courses from API...');
      const response = await instance.get('/api/courses');
      const coursesData = response.data;
      
      console.log('Courses fetched successfully:', coursesData);
      
      // Fetch trainer details for each course
      const coursesWithTrainers = await Promise.all(
        coursesData.map(async (course) => {
          const trainerDetails = await fetchTrainerDetails(course.trainerId);
          
          return {
            courseId: course.courseId,
            title: course.title,
            description: course.description,
            cost: course.cost.toString().startsWith('$') ? course.cost : `$${course.cost}`,
            videoUrl: course.videoUrl,
            category: course.category || 'Other',
            trainer: trainerDetails,
            duration: '30 hours', // Default - consider adding to backend
            rating: 4.5, // Default - consider adding ratings system
            studentsEnrolled: Math.floor(Math.random() * 2000) + 100, // Random for now
            createdAt: course.createdAt || new Date().toISOString(),
            thumbnail: generateThumbnail(course.videoUrl, course.title, course.category || 'Other'),
          };
        })
      );
      
      setCourses(coursesWithTrainers);
    } catch (error) {
      console.error('Failed to load courses:', error);
      setError('Failed to load courses. Please try again later.');
      
      // Fallback to basic loadCourses function
      await loadCourses();
    } finally {
      setIsLoading(false);
    }
  };

  const loadCourses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Fetching courses from API...');
      const response = await instance.get('/api/courses');
      const coursesData = response.data;
      
      console.log('Courses fetched successfully:', coursesData);
      
      // Transform the API data to match the UI requirements
      const transformedCourses = coursesData.map(course => ({
        courseId: course.courseId,
        title: course.title,
        description: course.description,
        cost: course.cost.startsWith('$') ? course.cost : `$${course.cost}`,
        videoUrl: course.videoUrl,
        category: course.category || 'Other',
        trainer: {
          userId: course.trainerId,
          name: 'Course Instructor', // You might need to fetch trainer details separately
          profilePic: `https://via.placeholder.com/50/4f46e5/FFFFFF?text=${course.trainerId}`,
        },
        duration: '30 hours', // Default duration - you might want to add this to your backend
        rating: 4.5, // Default rating - you might want to add ratings to your backend
        studentsEnrolled: Math.floor(Math.random() * 2000) + 100, // Random for now
        createdAt: course.createdAt || new Date().toISOString(),
        thumbnail: generateThumbnail(course.videoUrl, course.title, course.category || 'Other'),
      }));
      
      setCourses(transformedCourses);
    } catch (error) {
      console.error('Failed to load courses:', error);
      setError('Failed to load courses. Please try again later.');
      
      // Fallback to sample data for development
      setCourses([
        {
          courseId: 1,
          title: 'Sample Course - API Unavailable',
          description: 'This is a sample course displayed because the API is not available. Please check your backend connection.',
          cost: '$99.99',
          videoUrl: 'https://example.com/sample-course',
          trainer: {
            userId: 1,
            name: 'Sample Instructor',
            profilePic: 'https://via.placeholder.com/50/4f46e5/FFFFFF?text=SI',
          },
          category: 'Programming',
          duration: '30 hours',
          rating: 4.0,
          studentsEnrolled: 100,
          createdAt: new Date().toISOString(),
          thumbnail: 'https://via.placeholder.com/400x225/4f46e5/FFFFFF?text=Sample+Course',
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter courses based on search and category
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const keywordMatch = !searchKeyword || 
        course.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        course.description.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        course.trainer.name.toLowerCase().includes(searchKeyword.toLowerCase());
      
      const categoryMatch = selectedCategory === 'All' || course.category === selectedCategory;
      
      return keywordMatch && categoryMatch;
    });
  }, [courses, searchKeyword, selectedCategory]);

  const handleSearch = () => {
    console.log('Searching courses:', { keyword: searchKeyword, category: selectedCategory });
  };

  const handleClearSearch = () => {
    setSearchKeyword('');
    setSelectedCategory('All');
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

  const handleEnrollCourse = async (courseId) => {
    // Get current user ID from localStorage or context
    
    const userId = localStorage.getItem('user'); // Assuming userId is stored in localStorage

    if (!userId) {
      setError('Please log in to enroll in courses.');
      return;
    }

    // Check if already enrolled
    if (enrolledCourses.has(courseId)) {
      setError('You are already enrolled in this course.');
      return;
    }

    // Set loading state for this specific course
    setEnrollmentLoading(prev => new Set(prev).add(courseId));

    try {
      console.log('Creating enrollment...', { courseId, userId });
      
      const enrollmentData = {
        courseId: courseId,
        userId: userId
      };

      const response = await instance.post('/api/enrollments', enrollmentData);
      
      console.log('Enrollment created successfully:', response.data);
      
      // Add to enrolled courses
      setEnrolledCourses(prev => new Set(prev).add(courseId));
      
      // Show success message
      setError(null);
      setSuccessMessage('Successfully enrolled in the course!');
      
    } catch (error) {
      console.error('Failed to enroll in course:', error);
      
      if (error.response?.status === 409) {
        setError('You are already enrolled in this course.');
      } else if (error.response?.status === 404) {
        setError('Course or user not found.');
      } else {
        setError('Failed to enroll in course. Please try again.');
      }
    } finally {
      // Remove loading state for this course
      setEnrollmentLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(courseId);
        return newSet;
      });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <CoursesContainer>
      <Container maxWidth="lg">
        <CoursesHeader>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Training Courses
            </Typography>
            <Typography variant="h6" opacity={0.9} gutterBottom>
              Enhance your skills with our expert-led courses
            </Typography>
            
            {/* Search Form */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} md={8}>
                <StyledTextField
                  fullWidth
                  placeholder="Search courses, instructors, or topics"
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
                  {(searchKeyword || selectedCategory !== 'All') && (
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
        </CoursesHeader>

        {/* Category Filter */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            {categories.map((category) => (
              <FilterChip
                key={category}
                label={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? 'filled' : 'outlined'}
                icon={<FilterList fontSize="small" />}
              />
            ))}
          </Stack>
        </Box>

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
                onClick={() => loadCoursesWithTrainers()}
                disabled={isLoading}
              >
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" color="text.primary">
              {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
              {(searchKeyword || selectedCategory !== 'All') && (
                <Typography component="span" color="primary.main" sx={{ ml: 1 }}>
                  {searchKeyword && `for "${searchKeyword}"`}
                  {searchKeyword && selectedCategory !== 'All' && ' '}
                  {selectedCategory !== 'All' && `in "${selectedCategory}"`}
                </Typography>
              )}
            </Typography>
            
            <Stack direction="row" spacing={1}>
              <IconButton
                onClick={() => loadCoursesWithTrainers()}
                disabled={isLoading}
                sx={{
                  backgroundColor: 'rgba(44, 103, 242, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(44, 103, 242, 0.2)',
                  },
                }}
              >
                <Refresh sx={{ color: '#2c67f2' }} />
              </IconButton>
              
              {(searchKeyword || selectedCategory !== 'All') && (
                <Button
                  variant="text"
                  onClick={handleClearSearch}
                  sx={{ color: 'text.secondary' }}
                >
                  Show all courses
                </Button>
              )}
            </Stack>
          </Stack>
        </Box>

        {/* Course Cards */}
        {filteredCourses.length > 0 ? (
          <Grid container spacing={3}>
            {filteredCourses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course.courseId}>
                <CourseCard>
                  {/* Course Thumbnail */}
                  <CardMedia
                    component="img"
                    height="500"
                    image={course.thumbnail}
                    alt={course.title}
                    sx={{ 
                      cursor: 'pointer',
                      backgroundColor: '#f5f5f5',
                      objectFit: 'cover',
                      width: '100%',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        transition: 'transform 0.3s ease',
                      }
                    }}
                    onError={(e) => {
                      // Fallback to a category-based placeholder if image fails to load
                      const categoryColors = {
                        'Programming': '4f46e5',
                        'Web Development': '059669',
                        'Mobile Development': 'dc2626',
                        'Data Science': 'ca8a04',
                        'Machine Learning': '7c3aed',
                        'UI/UX Design': 'ea580c',
                        'Digital Marketing': 'be185d',
                        'Business': '0f766e',
                        'Other': '6b7280'
                      };
                      const color = categoryColors[course.category] || categoryColors['Other'];
                      const titleText = encodeURIComponent(course.title.length > 25 ? course.title.substring(0, 22) + '...' : course.title);
                      e.target.src = `https://via.placeholder.com/500x280/${color}/FFFFFF?text=${titleText}`;
                    }}
                    onClick={() => {
                      if (course.videoUrl && course.videoUrl !== 'https://example.com/sample-course') {
                        window.open(course.videoUrl, '_blank', 'noopener,noreferrer');
                      } else {
                        handleEnrollCourse(course.courseId);
                      }
                    }}
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
                        onClick={() => handleEnrollCourse(course.courseId)}
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

                    {/* Description */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ 
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.4,
                      }}
                    >
                      {course.description}
                    </Typography>

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

                    {/* Course Stats */}
                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {course.duration}
                        </Typography>
                      </Stack>
                      
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {course.studentsEnrolled}
                        </Typography>
                      </Stack>
                    </Stack>

                    {/* Rating */}
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                      <Rating
                        value={course.rating}
                        readOnly
                        precision={0.1}
                        size="small"
                        sx={{
                          '& .MuiRating-iconFilled': {
                            color: '#ffc107',
                          },
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {course.rating} ({course.studentsEnrolled} students)
                      </Typography>
                    </Stack>

                    {/* Price and Action */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        color="primary.main"
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        <AttachMoney sx={{ fontSize: 20 }} />
                        {course.cost.replace('$', '')}
                      </Typography>
                      
                      <Button
                        variant="contained"
                        startIcon={enrolledCourses.has(course.courseId) ? <School /> : <PlayArrow />}
                        onClick={() => handleEnrollCourse(course.courseId)}
                        disabled={enrollmentLoading.has(course.courseId) || enrolledCourses.has(course.courseId)}
                        sx={{
                          background: enrolledCourses.has(course.courseId) 
                            ? 'linear-gradient(45deg, #4caf50 30%, #2e7d32 90%)'
                            : 'linear-gradient(45deg, #62cff4 30%, #2c67f2 90%)',
                          color: 'white',
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                          '&:hover': {
                            background: enrolledCourses.has(course.courseId)
                              ? 'linear-gradient(45deg, #388e3c 30%, #1b5e20 90%)'
                              : 'linear-gradient(45deg, #4fbff0 30%, #1f5ae8 90%)',
                          },
                          '&:disabled': {
                            background: enrolledCourses.has(course.courseId)
                              ? 'linear-gradient(45deg, #4caf50 30%, #2e7d32 90%)'
                              : 'rgba(0, 0, 0, 0.26)',
                            color: 'white',
                          },
                        }}
                      >
                        {enrollmentLoading.has(course.courseId) 
                          ? 'Enrolling...' 
                          : enrolledCourses.has(course.courseId) 
                            ? 'Enrolled' 
                            : 'Enroll'
                        }
                      </Button>
                    </Stack>
                  </CardContent>
                </CourseCard>
              </Grid>
            ))}
          </Grid>
        ) : (
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
              No courses found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchKeyword || selectedCategory !== 'All'
                ? 'Try adjusting your search criteria or clearing the filters.'
                : 'No training courses are currently available.'
              }
            </Typography>
            {(searchKeyword || selectedCategory !== 'All') && (
              <Button
                variant="contained"
                onClick={handleClearSearch}
                sx={{
                  background: 'linear-gradient(45deg, #62cff4 30%, #2c67f2 90%)',
                  color: 'white',
                }}
              >
                Show All Courses
              </Button>
            )}
          </Paper>
        )}

        {/* Success Snackbar */}
        <Snackbar
          open={!!successMessage}
          autoHideDuration={4000}
          onClose={() => setSuccessMessage('')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setSuccessMessage('')} 
            severity="success" 
            sx={{ 
              backgroundColor: 'rgba(76, 175, 80, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(76, 175, 80, 0.3)'
            }}
          >
            {successMessage}
          </Alert>
        </Snackbar>
      </Container>
    </CoursesContainer>
  );
};

export default TrainingCourses;
