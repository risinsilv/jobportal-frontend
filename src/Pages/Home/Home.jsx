import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Fade,
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  Work,
  School,
  People,
  TrendingUp,
  PlayArrow,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Styled components
const SlideshowContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: 0,
  padding: 0,
  zIndex: 1,
}));

const SlideBackground = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  transition: 'all 0.8s ease-in-out',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, rgba(44, 103, 242, 0.8) 0%, rgba(98, 207, 244, 0.6) 100%)',
    backdropFilter: 'blur(2px)',
  },
}));

const SlideContent = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  color: 'white',
  textAlign: 'center',
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto',
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #ffffff 30%, #f8f9fa 90%)',
  border: 0,
  borderRadius: theme.spacing(3),
  boxShadow: '0 6px 20px rgba(255, 255, 255, 0.3)',
  color: '#2c67f2',
  height: 50,
  padding: '0 32px',
  fontSize: '1rem',
  fontWeight: 700,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #f8f9fa 30%, #ffffff 90%)',
    boxShadow: '0 8px 25px rgba(255, 255, 255, 0.4)',
    transform: 'translateY(-2px)',
  },
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
  border: '2px solid rgba(255, 255, 255, 0.8)',
  borderRadius: theme.spacing(3),
  color: 'white',
  height: 50,
  padding: '0 32px',
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  backdropFilter: 'blur(10px)',
  background: 'rgba(255, 255, 255, 0.1)',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'white',
    transform: 'translateY(-2px)',
  },
}));

const NavigationButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 3,
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  color: 'white',
  width: 60,
  height: 60,
  border: '1px solid rgba(255, 255, 255, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: 'translateY(-50%) scale(1.1)',
  },
}));

const DotsContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 30,
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: theme.spacing(1),
  zIndex: 3,
}));

const Dot = styled(Box)(({ theme, active }) => ({
  width: 12,
  height: 12,
  borderRadius: '50%',
  backgroundColor: active ? 'white' : 'rgba(255, 255, 255, 0.5)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'white',
    transform: 'scale(1.2)',
  },
}));

const Home = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');

  // Get user name and role from localStorage
  useEffect(() => {
    const storedName = localStorage.getItem('name');
    const storedRole = localStorage.getItem('role');
    if (storedName) {
      setUserName(storedName);
    }
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []);

  // Role-specific slideshow data
  const getRoleSpecificSlides = () => {
    const role = userRole || localStorage.getItem('role');
    
    switch (role) {
      case 'JobSeeker':
        return [
          {
            id: 1,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            title: `Welcome back, ${userName || 'Job Seeker'}! 🎉`,
            subtitle: 'Discover Your Next Career Opportunity',
            description: 'Explore thousands of job opportunities from top companies around the world. Your dream job is just a click away.',
            primaryAction: 'Browse Jobs',
            secondaryAction: 'View Profile',
            primaryClick: () => navigate('/JobSearch'),
            secondaryClick: () => navigate('/UserProfile'),
            icon: <Work sx={{ fontSize: 80, color: 'white', opacity: 0.7 }} />,
          },
          {
            id: 2,
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            title: 'Advance Your Skills 📚',
            subtitle: 'Professional Training & Certification',
            description: 'Join expert-led courses and training programs. Enhance your skills and stay competitive in today\'s job market.',
            primaryAction: 'Explore Courses',
            secondaryAction: 'My Learning',
            primaryClick: () => navigate('/Courses'),
            secondaryClick: () => navigate('/MyCourses'),
            icon: <School sx={{ fontSize: 80, color: 'white', opacity: 0.7 }} />,
          },
          {
            id: 3,
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            title: 'Track Your Applications 📈',
            subtitle: 'Monitor Your Job Search Journey',
            description: 'Keep track of your job applications, interview schedules, and career progress. Stay organized and focused on your goals.',
            primaryAction: 'My Applications',
            secondaryAction: 'Update Resume',
            primaryClick: () => navigate('/JobApplications'),
            secondaryClick: () => navigate('/JobSeekerResume'),
            icon: <TrendingUp sx={{ fontSize: 80, color: 'white', opacity: 0.7 }} />,
          },
        ];
      
      case 'Employer':
        return [
          {
            id: 1,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            title: `Welcome back, ${userName || 'Employer'}! 🎉`,
            subtitle: 'Find the Perfect Candidates',
            description: 'Post job openings and discover talented professionals who match your company\'s needs and culture.',
            primaryAction: 'Post New Job',
            secondaryAction: 'View Candidates',
            primaryClick: () => navigate('/CreateJob'),
            secondaryClick: () => navigate('/Candidate'),
            icon: <Work sx={{ fontSize: 80, color: 'white', opacity: 0.7 }} />,
          },
          {
            id: 2,
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            title: 'Invest in Training 📚',
            subtitle: 'Develop Your Team\'s Skills',
            description: 'Explore professional training programs to upskill your employees and keep your team competitive.',
            primaryAction: 'Browse Training',
            secondaryAction: 'My Courses',
            primaryClick: () => navigate('/Courses'),
            secondaryClick: () => navigate('/MyCourses'),
            icon: <School sx={{ fontSize: 80, color: 'white', opacity: 0.7 }} />,
          },
          {
            id: 3,
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            title: 'Manage Job Postings 🤝',
            subtitle: 'Track Your Recruitment Process',
            description: 'Monitor your job postings, review applications, and manage your hiring pipeline effectively.',
            primaryAction: 'My Job Postings',
            secondaryAction: 'Review Applications',
            primaryClick: () => navigate('/JobSearch'),
            secondaryClick: () => navigate('/Candidate'),
            icon: <People sx={{ fontSize: 80, color: 'white', opacity: 0.7 }} />,
          },
        ];
      
      case 'Trainer':
        return [
          {
            id: 1,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            title: `Welcome back, ${userName || 'Trainer'}! 🎉`,
            subtitle: 'Shape the Future of Learning',
            description: 'Create impactful training programs and courses that help professionals advance their careers.',
            primaryAction: 'Create Course',
            secondaryAction: 'View Profile',
            primaryClick: () => navigate('/CreateCourses'),
            secondaryClick: () => navigate('/UserProfile'),
            icon: <School sx={{ fontSize: 80, color: 'white', opacity: 0.7 }} />,
          },
          {
            id: 2,
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            title: 'Manage Enrollments 👥',
            subtitle: 'Track Student Progress',
            description: 'Monitor course enrollments, student progress, and engagement across all your training programs.',
            primaryAction: 'View Enrollments',
            secondaryAction: 'My Courses',
            primaryClick: () => navigate('/CourseEnrollments'),
            secondaryClick: () => navigate('/MyCourses'),
            icon: <People sx={{ fontSize: 80, color: 'white', opacity: 0.7 }} />,
          },
          {
            id: 3,
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            title: 'Explore Training Programs 📈',
            subtitle: 'Discover New Opportunities',
            description: 'Browse available training programs to expand your expertise and learn new teaching methodologies.',
            primaryAction: 'Browse Programs',
            secondaryAction: 'My Learning',
            primaryClick: () => navigate('/Courses'),
            secondaryClick: () => navigate('/MyCourses'),
            icon: <TrendingUp sx={{ fontSize: 80, color: 'white', opacity: 0.7 }} />,
          },
        ];
      
      default:
        // Default slides for unknown roles or during loading
        return [
          {
            id: 1,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            title: `Welcome, ${userName || 'Professional'}! 🎉`,
            subtitle: 'Discover Your Platform',
            description: 'Explore opportunities, enhance your skills, and connect with professionals in your industry.',
            primaryAction: 'Browse Jobs',
            secondaryAction: 'View Profile',
            primaryClick: () => navigate('/JobSearch'),
            secondaryClick: () => navigate('/UserProfile'),
            icon: <Work sx={{ fontSize: 80, color: 'white', opacity: 0.7 }} />,
          },
          {
            id: 2,
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            title: 'Learn & Grow 📚',
            subtitle: 'Professional Development',
            description: 'Access training programs and courses to advance your skills and career prospects.',
            primaryAction: 'Explore Courses',
            secondaryAction: 'My Learning',
            primaryClick: () => navigate('/Courses'),
            secondaryClick: () => navigate('/MyCourses'),
            icon: <School sx={{ fontSize: 80, color: 'white', opacity: 0.7 }} />,
          },
        ];
    }
  };

  // Get role-specific slides
  const slides = getRoleSpecificSlides();

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <Box sx={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw', 
      height: '100vh', 
      overflow: 'hidden',
      margin: 0,
      padding: 0,
      zIndex: 1,
    }}>
      {/* Main Slideshow */}
      <SlideshowContainer>
        <SlideBackground
          sx={{
            background: currentSlideData.background,
          }}
        />

        {/* Navigation Buttons */}
        <NavigationButton
          onClick={prevSlide}
          sx={{ left: 30 }}
        >
          <ArrowBack sx={{ fontSize: 30 }} />
        </NavigationButton>

        <NavigationButton
          onClick={nextSlide}
          sx={{ right: 30 }}
        >
          <ArrowForward sx={{ fontSize: 30 }} />
        </NavigationButton>

        {/* Slide Content */}
        <SlideContent>
          <Fade in={true} timeout={800} key={currentSlide}>
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              width: '100%',
              px: { xs: 2, md: 4 },
            }}>
              {/* Icon */}
              <Box sx={{ mb: 3 }}>
                {currentSlideData.icon}
              </Box>

              {/* Title */}
              <Typography 
                variant="h2" 
                sx={{ 
                  fontWeight: 800,
                  mb: 2,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                  lineHeight: 1.2,
                }}
              >
                {currentSlideData.title}
              </Typography>

              {/* Subtitle */}
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 400,
                  mb: 3,
                  opacity: 0.95,
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                }}
              >
                {currentSlideData.subtitle}
              </Typography>

              {/* Description */}
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 4,
                  opacity: 0.9,
                  maxWidth: 800,
                  mx: 'auto',
                  lineHeight: 1.6,
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                }}
              >
                {currentSlideData.description}
              </Typography>

              {/* Action Buttons */}
              <Box sx={{ 
                display: 'flex', 
                gap: 3, 
                justifyContent: 'center',
                flexWrap: 'wrap',
                mt: 4
              }}>
                <GradientButton
                  onClick={currentSlideData.primaryClick}
                  startIcon={<PlayArrow />}
                  size="large"
                >
                  {currentSlideData.primaryAction}
                </GradientButton>
                <SecondaryButton
                  onClick={currentSlideData.secondaryClick}
                  size="large"
                >
                  {currentSlideData.secondaryAction}
                </SecondaryButton>
              </Box>
            </Box>
          </Fade>
        </SlideContent>

        {/* Dots Navigation */}
        <DotsContainer>
          {slides.map((_, index) => (
            <Dot
              key={index}
              active={index === currentSlide}
              onClick={() => goToSlide(index)}
            />
          ))}
        </DotsContainer>
      </SlideshowContainer>
    </Box>
  );
};

export default Home;
