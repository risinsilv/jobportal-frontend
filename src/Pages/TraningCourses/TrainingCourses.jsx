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
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

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

  // Course categories for filtering
  const categories = ['All', 'Programming', 'Design', 'Business', 'Marketing', 'Data Science'];

  // Sample course data based on the Courses entity
  const [courses, setCourses] = useState([
    {
      courseId: 1,
      title: 'Complete React Development Course',
      description: 'Master React from basics to advanced concepts including hooks, context, and state management. Build real-world projects and learn industry best practices.',
      cost: '$99.99',
      videoUrl: 'https://example.com/react-course',
      trainer: {
        userId: 101,
        name: 'John Smith',
        profilePic: 'https://via.placeholder.com/50/4f46e5/FFFFFF?text=JS',
      },
      category: 'Programming',
      duration: '40 hours',
      rating: 4.8,
      studentsEnrolled: 1250,
      createdAt: '2024-12-15T10:30:00',
      thumbnail: 'https://via.placeholder.com/400x225/4f46e5/FFFFFF?text=React+Course',
    },
    {
      courseId: 2,
      title: 'UI/UX Design Fundamentals',
      description: 'Learn the principles of user interface and user experience design. Create stunning designs using Figma and Adobe XD.',
      cost: '$79.99',
      videoUrl: 'https://example.com/uiux-course',
      trainer: {
        userId: 102,
        name: 'Sarah Johnson',
        profilePic: 'https://via.placeholder.com/50/ec4899/FFFFFF?text=SJ',
      },
      category: 'Design',
      duration: '25 hours',
      rating: 4.6,
      studentsEnrolled: 890,
      createdAt: '2024-12-20T14:15:00',
      thumbnail: 'https://via.placeholder.com/400x225/ec4899/FFFFFF?text=UI+UX+Design',
    },
    {
      courseId: 3,
      title: 'Digital Marketing Masterclass',
      description: 'Comprehensive guide to digital marketing including SEO, social media marketing, email campaigns, and analytics.',
      cost: '$129.99',
      videoUrl: 'https://example.com/marketing-course',
      trainer: {
        userId: 103,
        name: 'Mike Chen',
        profilePic: 'https://via.placeholder.com/50/10b981/FFFFFF?text=MC',
      },
      category: 'Marketing',
      duration: '35 hours',
      rating: 4.9,
      studentsEnrolled: 2100,
      createdAt: '2024-12-10T09:45:00',
      thumbnail: 'https://via.placeholder.com/400x225/10b981/FFFFFF?text=Digital+Marketing',
    },
    {
      courseId: 4,
      title: 'Python for Data Science',
      description: 'Learn Python programming for data analysis, visualization, and machine learning. Includes pandas, numpy, and scikit-learn.',
      cost: '$149.99',
      videoUrl: 'https://example.com/python-course',
      trainer: {
        userId: 104,
        name: 'Dr. Lisa Wang',
        profilePic: 'https://via.placeholder.com/50/f59e0b/FFFFFF?text=LW',
      },
      category: 'Data Science',
      duration: '50 hours',
      rating: 4.7,
      studentsEnrolled: 1650,
      createdAt: '2024-12-25T11:20:00',
      thumbnail: 'https://via.placeholder.com/400x225/f59e0b/FFFFFF?text=Python+Data+Science',
    },
    {
      courseId: 5,
      title: 'Business Strategy & Leadership',
      description: 'Develop essential business leadership skills and strategic thinking. Learn from real case studies and industry experts.',
      cost: '$199.99',
      videoUrl: 'https://example.com/business-course',
      trainer: {
        userId: 105,
        name: 'Robert Davis',
        profilePic: 'https://via.placeholder.com/50/8b5cf6/FFFFFF?text=RD',
      },
      category: 'Business',
      duration: '30 hours',
      rating: 4.5,
      studentsEnrolled: 750,
      createdAt: '2024-12-18T16:00:00',
      thumbnail: 'https://via.placeholder.com/400x225/8b5cf6/FFFFFF?text=Business+Strategy',
    },
    {
      courseId: 6,
      title: 'Advanced JavaScript & Node.js',
      description: 'Deep dive into JavaScript ES6+, async programming, and backend development with Node.js and Express.',
      cost: '$119.99',
      videoUrl: 'https://example.com/javascript-course',
      trainer: {
        userId: 106,
        name: 'Emma Thompson',
        profilePic: 'https://via.placeholder.com/50/ef4444/FFFFFF?text=ET',
      },
      category: 'Programming',
      duration: '45 hours',
      rating: 4.8,
      studentsEnrolled: 1400,
      createdAt: '2024-12-22T13:30:00',
      thumbnail: 'https://via.placeholder.com/400x225/ef4444/FFFFFF?text=JavaScript+Node.js',
    },
  ]);

  useEffect(() => {
    // Load courses data on component mount
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setIsLoading(true);
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load courses:', error);
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

  const handleEnrollCourse = (courseId) => {
    // Navigate to course details or enrollment page
    navigate(`/course/${courseId}`);
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
                    height="180"
                    image={course.thumbnail}
                    alt={course.title}
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        transition: 'transform 0.3s ease',
                      }
                    }}
                    onClick={() => handleEnrollCourse(course.courseId)}
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
                        startIcon={<PlayArrow />}
                        onClick={() => handleEnrollCourse(course.courseId)}
                        sx={{
                          background: 'linear-gradient(45deg, #62cff4 30%, #2c67f2 90%)',
                          color: 'white',
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                          '&:hover': {
                            background: 'linear-gradient(45deg, #4fbff0 30%, #1f5ae8 90%)',
                          },
                        }}
                      >
                        Enroll
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
      </Container>
    </CoursesContainer>
  );
};

export default TrainingCourses;
