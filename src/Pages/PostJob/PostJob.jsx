import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Chip,
  Alert,
  Snackbar,
  LinearProgress,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  Divider,
} from '@mui/material';
import {
  ArrowBack,
  Work,
  LocationOn,
  AttachMoney,
  Description,
  CheckCircle,
  Preview,
  Publish,
  Clear,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import instance from '../../Service/AxiosOrder';

// Styled components with glassmorphism
const PostJobContainer = styled(Box)(({ theme }) => ({

  minHeight: '100vh',
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
}));

const PostJobHeader = styled(Paper)(({ theme }) => ({
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

const FormCard = styled(Card)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderRadius: theme.spacing(2),
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  marginBottom: theme.spacing(3),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: theme.spacing(1),
    border: '1px solid rgba(255, 255, 255, 0.3)',
    transition: 'all 0.3s ease',
    '& fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(44, 103, 242, 0.5)',
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      '& fieldset': {
        borderColor: '#2c67f2',
        borderWidth: 2,
      },
    },
  },
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
  '&:disabled': {
    background: 'rgba(0, 0, 0, 0.12)',
    color: 'rgba(0, 0, 0, 0.26)',
    boxShadow: 'none',
  },
}));

const PreviewCard = styled(Paper)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(15px)',
  WebkitBackdropFilter: 'blur(15px)',
  borderRadius: theme.spacing(2),
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  padding: theme.spacing(3),
  marginTop: theme.spacing(2),
}));

const PostJob = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Form data based on JobPostings entity
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
    requirements: '',
    status: 'Open',
    employmentType: '',
    experience: '',
    category: '',
    skills: [],
  });

  // Form validation errors
  const [errors, setErrors] = useState({});

  // Steps for the stepper
  const steps = ['Job Details', 'Requirements & Skills', 'Review & Publish'];


  const commonSkills = [
    'JavaScript',
    'React',
    'Node.js',
    'Python',
    'Java',
    'SQL',
    'AWS',
    'Docker',
    'Git',
    'Project Management',
    'Communication',
    'Leadership',
    'Problem Solving',
    'Teamwork',
  ];

  const handleInputChange = (field) => (event) => {
    setJobData(prev => ({
      ...prev,
      [field]: event.target.value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSkillAdd = (skill) => {
    if (!jobData.skills.includes(skill)) {
      setJobData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setJobData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!jobData.title.trim()) newErrors.title = 'Job title is required';
    if (!jobData.description.trim()) newErrors.description = 'Job description is required';
    if (!jobData.location.trim()) newErrors.location = 'Location is required';
    if (!jobData.salary.trim()) newErrors.salary = 'Salary information is required';
    if (!jobData.requirements.trim()) newErrors.requirements = 'Requirements are required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (activeStep === 0) {
      // Validate basic job details
      const step1Errors = {};
      if (!jobData.title.trim()) step1Errors.title = 'Job title is required';
      if (!jobData.description.trim()) step1Errors.description = 'Job description is required';
      if (!jobData.location.trim()) step1Errors.location = 'Location is required';
      if (!jobData.salary.trim()) step1Errors.salary = 'Salary information is required';

      if (Object.keys(step1Errors).length > 0) {
        setErrors(step1Errors);
        return;
      }
    }

    if (activeStep === 1) {
      // Validate requirements and skills
      const step2Errors = {};
      if (!jobData.requirements.trim()) step2Errors.requirements = 'Requirements are required';

      if (Object.keys(step2Errors).length > 0) {
        setErrors(step2Errors);
        return;
      }
    }

    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setSnackbarMessage('Please fill in all required fields');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    setIsLoading(true);
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        setSnackbarMessage('Authentication required. Please login again.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        setIsLoading(false);
        return;
      }

      // Prepare job posting data according to JobPostingsDto
      const jobPostingData = {
        employerId: localStorage.getItem('user'),
        title: jobData.title,
        description: jobData.description,
        location: jobData.location,
        salary: jobData.salary,
        requirements: jobData.requirements,
        status: jobData.status,
        // skills: jobData.skills.join(', '), // Convert array to comma-separated string
        // employer will be set by backend based on the authenticated user
      };

      console.log('Submitting job posting:', jobPostingData);

      // Call the API endpoint with Authorization header
      const response = await instance.post('/api/jobpostings', jobPostingData);

      console.log('Job posting created successfully:', response.data);

      setSnackbarMessage('Job posted successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);

      // Navigate to job listings or dashboard after success
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error creating job posting:', error);

      let errorMessage = 'Failed to post job. Please try again.';

      if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
        // Optionally redirect to login
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Invalid job posting data. Please check your inputs.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
    setIsLoading(false);
  };

  const handleClear = () => {
    setJobData({
      title: '',
      description: '',
      location: '',
      salary: '',
      requirements: '',
      status: 'Open',
      employmentType: '',
      experience: '',
      category: '',
      skills: [],
    });
    setErrors({});
    setActiveStep(0);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <StyledTextField
                fullWidth
                label="Job Title"
                placeholder="e.g., Senior Software Engineer"
                value={jobData.title}
                onChange={handleInputChange('title')}
                error={!!errors.title}
                helperText={errors.title}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <StyledTextField
                fullWidth
                label="Location"
                placeholder="e.g., Remote, New York NY, or multiple locations..."
                value={jobData.location}
                onChange={handleInputChange('location')}
                error={!!errors.location}
                helperText={errors.location}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <StyledTextField
                fullWidth
                label="Salary Range"
                placeholder="e.g., $80,000 - $120,000"
                value={jobData.salary}
                onChange={handleInputChange('salary')}
                error={!!errors.salary}
                helperText={errors.salary}
                required
              />
            </Grid>
              <StyledTextField
                fullWidth
                multiline
                rows={8}
                label="Job Description"
                placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
                value={jobData.description}
                onChange={handleInputChange('description')}
                error={!!errors.description}
                helperText={errors.description}
                required
              />
          </Grid>




        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <StyledTextField
                fullWidth
                multiline
                rows={6}
                label="Requirements"
                placeholder="List the required qualifications, skills, and experience..."
                value={jobData.requirements}
                onChange={handleInputChange('requirements')}
                error={!!errors.requirements}
                helperText={errors.requirements}
                required
              />
            </Grid>


            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Required Skills (optional)
              </Typography>
              <Box sx={{ mb: 2 }}>
                {commonSkills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    onClick={() => handleSkillAdd(skill)}
                    variant={jobData.skills.includes(skill) ? 'filled' : 'outlined'}
                    color={jobData.skills.includes(skill) ? 'primary' : 'default'}
                    sx={{ m: 0.5, cursor: 'pointer' }}
                  />
                ))}
              </Box>
              {jobData.skills.length > 0 && (
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Selected Skills:
                  </Typography>
                  {jobData.skills.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      onDelete={() => handleSkillRemove(skill)}
                      color="primary"
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </Box>
              )}
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Review Your Job Posting
              </Typography>
              <PreviewCard>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {jobData.title || 'Job Title'}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<LocationOn />}
                    label={jobData.location || 'Location'}
                    variant="outlined"
                  />
                  <Chip
                    icon={<AttachMoney />}
                    label={jobData.salary || 'Salary'}
                    variant="outlined"
                  />
                  <Chip
                    icon={<Work />}
                    label={jobData.status || 'Open'}
                    variant="outlined"
                  />
                </Box>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Description
                </Typography>
                <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-wrap' }}>
                  {jobData.description || 'Job description will appear here...'}
                </Typography>

                <Typography variant="h6" gutterBottom>
                  Requirements
                </Typography>
                <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-wrap' }}>
                  {jobData.requirements || 'Job requirements will appear here...'}
                </Typography>

                {jobData.skills.length > 0 && (
                  <>
                    <Typography variant="h6" gutterBottom>
                      Required Skills
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      {jobData.skills.map((skill) => (
                        <Chip
                          key={skill}
                          label={skill}
                          color="primary"
                          sx={{ m: 0.5 }}
                        />
                      ))}
                    </Box>
                  </>
                )}
              </PreviewCard>
            </Grid>
          </Grid>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <PostJobContainer>
      <Container maxWidth="lg">
        <PostJobHeader>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <IconButton
                onClick={() => navigate('/dashboard')}
                sx={{
                  color: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
                }}
              >
                <ArrowBack />
              </IconButton>
              <Typography variant="h4" component="h1" fontWeight="bold">
                Post a New Job
              </Typography>
            </Box>
            <Typography variant="h6" opacity={0.9}>
              Create and publish job opportunities for talented candidates
            </Typography>
          </Box>
        </PostJobHeader>

        {/* Stepper */}
        <FormCard>
          <CardContent>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {isLoading && (
              <LinearProgress
                sx={{
                  mb: 3,
                  backgroundColor: 'rgba(44, 103, 242, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#2c67f2'
                  }
                }}
              />
            )}

            {/* Step Content */}
            {renderStepContent(activeStep)}

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  onClick={handleClear}
                  startIcon={<Clear />}
                  sx={{ color: 'text.secondary' }}
                >
                  Clear All
                </Button>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ color: 'text.secondary' }}
                >
                  Back
                </Button>

                {activeStep === steps.length - 1 ? (
                  <GradientButton
                    onClick={handleSubmit}
                    startIcon={<Publish />}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Publishing...' : 'Publish Job'}
                  </GradientButton>
                ) : (
                  <GradientButton onClick={handleNext}>
                    Next
                  </GradientButton>
                )}
              </Box>
            </Box>
          </CardContent>
        </FormCard>

        {/* Snackbar */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity={snackbarSeverity}
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </PostJobContainer>
  );
};

export default PostJob;
