import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Link,
  Fade,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Input,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  PhotoCamera,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import instance from '../Service/AxiosOrder';

// Styled components
const GradientBackground = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  width: '100vw',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#ffffff',
  color: '#202124',
  position: 'fixed',
  top: 0,
  left: 0,
  margin: 0,
  padding: 0,
  overflow: 'hidden',
  fontFamily: '"Google Sans"',
  '& *': {
    fontFamily: '"Google Sans" !important',
  },
}));

const FloatingBubble = styled(Box)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.2)',
  pointerEvents: 'none',
  animation: 'float 6s ease-in-out infinite',
  '@keyframes float': {
    '0%, 100%': { 
      transform: 'translateY(0px) scale(1)',
      opacity: 0.7,
    },
    '50%': { 
      transform: 'translateY(-20px) scale(1.1)',
      opacity: 0.3,
    },
  },
}));

const RegisterPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  background: 'rgba(255, 255, 255, 0.25)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  boxShadow: 'none',
  border: 'none',
  width: '100%',
  maxWidth: 420,
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: '#4285F4',
  border: 0,
  borderRadius: theme.spacing(1.5),
  boxShadow: 'none',
  color: 'white',
  height: 48,
  padding: '0 30px',
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  transition: 'background 0.2s ease',
  '&:hover': {
    background: '#000000',
    boxShadow: 'none',
  },
  '&:active': {
    background: '#000000',
    boxShadow: 'none',
  },
  '& .MuiTouchRipple-child': {
    backgroundColor: '#ffffff',
  },
}));

const LogoText = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  left: theme.spacing(2),
  fontWeight: 550,
  fontSize: '30px',
  color: '#202124',
  zIndex: 2,
  letterSpacing: 0.3,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(1.5),
    backgroundColor: 'white',
    '&.Mui-focused': {
      '& fieldset': {
        borderColor: '#2c67f2',
        borderWidth: 2,
      }
    },
    '& fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.23)',
    }
  }
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(1.5),
    backgroundColor: 'white',
    '&.Mui-focused': {
      '& fieldset': {
        borderColor: '#2c67f2',
        borderWidth: 2,
      }
    },
    '& fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.23)',
    }
  }
}));

const ProfilePicContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    profilePic: null,
  });
  const [profilePreview, setProfilePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profilePic: file
      }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.role) {
      setError('Please fill in all required fields');
      setOpenSnackbar(true);
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setOpenSnackbar(true);
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setOpenSnackbar(true);
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setOpenSnackbar(true);
      return false;
    }
    
    return true;
  };

   const register = async () => {
    setIsLoading(true);
    
    try {
      let profilePicUrl = null;
      
      // First upload the profile picture if one is selected
      if (formData.profilePic) {
        console.log('Uploading profile picture...');
        
        const imageFormData = new FormData();
        imageFormData.append('file', formData.profilePic);
        
        const uploadResponse = await instance.post('api/users/upload', imageFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        // Extract only the filename from the response (e.g., "/api/images/filename.png" -> "filename.png")
        const fullPath = uploadResponse.data; // This should be like "/api/images/filename"
        profilePicUrl = fullPath.split('/').pop(); // Get only the filename part
        console.log('Image uploaded successfully, filename:', profilePicUrl);
      }
      
      // Now register the user with the image URL
      const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        profilePic: profilePicUrl, // Send the image URL instead of the file
      };
      
      console.log('Sending registration request with data:', registrationData);
      console.log('Request URL: /api/users/register');
      
      const response = await instance.post('api/users/register', registrationData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Registration successful:', response.data);
      
      setSuccess('Registration successful! Please login to continue.');
      setOpenSnackbar(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
        profilePic: null,
      });
      setProfilePreview(null);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        setShowLogin(true);
      }, 2000);
      
    } catch (error) {
      console.log('Full error object:', error);
      console.log('Error response:', error.response);
      console.log('Error data:', error.response?.data);
      console.log('Error status:', error.response?.status);
      console.log('Error message:', error.response?.data?.message);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Invalid registration data. Please check your inputs.';
      } else if (error.response?.status === 409) {
        errorMessage = 'Email already exists. Please use a different email address.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    register();
  };

  const roles = [
    { value: 'JobSeeker', label: 'Job Seeker' },
    { value: 'Employer', label: 'Employer' },
    { value: 'Trainer', label: 'Trainer' },
    { value: 'Admin', label: 'Admin' },
  ];

  // If user wants to login, show Login component
  if (showLogin) {
    const Login = React.lazy(() => import('./Login'));
    return (
      <React.Suspense fallback={
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          background: 'linear-gradient(135deg, #62cff4 15%, #2c67f2 100%)'
        }}>
          <CircularProgress size={60} sx={{ color: 'white' }} />
        </Box>
      }>
        <Login />
      </React.Suspense>
    );
  }

  return (
    <GradientBackground>
      <LogoText variant="h6">
        <Box component="span" sx={{ color: '#4285F4' }}>J</Box>ob{' '}
        <Box component="span" sx={{ color: '#4285F4' }}>P</Box>ortal
      </LogoText>
      
      <Container 
        maxWidth="sm" 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '100vh',
          padding: 2,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Fade in timeout={800}>
          <RegisterPaper>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  display: 'flex',
                  justifyContent: 'left',
                  fontWeight: 600,
                  color: '#202124'
                }}
              >
                Sign Up
              </Typography>
              <Typography 
                variant="body1" 
                sx={{
                  display: 'flex',
                  justifyContent: 'left', 
                  color: '#5f6368',
                  fontWeight: '500'
                }}
              >
                Create your account
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleRegister} sx={{ mt: 2 }}>
              {/* Profile Picture Upload */}
              <ProfilePicContainer>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    mb: 1,
                    background: profilePreview ? 'transparent' : 'linear-gradient(45deg, #62cff4 30%, #2c67f2 90%)',
                  }}
                  src={profilePreview}
                >
                  {!profilePreview && <PhotoCamera sx={{ fontSize: 30 }} />}
                </Avatar>
                <Input
                  accept="image/*"
                  id="profile-pic-upload"
                  type="file"
                  onChange={handleProfilePicChange}
                  sx={{ display: 'none' }}
                />
                <label htmlFor="profile-pic-upload">
                  <Button
                    variant="text"
                    component="span"
                    size="small"
                    sx={{ color: '#2c67f2', fontWeight: 500 }}
                  >
                    Upload Profile Picture
                  </Button>
                </label>
              </ProfilePicContainer>

              <StyledTextField
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                autoComplete="name"
                autoFocus
                value={formData.name}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                required
              />
              
              <StyledTextField
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                required
              />
              
              <StyledFormControl fullWidth sx={{ mb: 2 }} required>
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  name="role"
                  value={formData.role}
                  label="Role"
                  onChange={handleInputChange}
                >
                  {roles.map((role) => (
                    <MenuItem key={role.value} value={role.value}>
                      {role.label}
                    </MenuItem>
                  ))}
                </Select>
              </StyledFormControl>
              
              <StyledTextField
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                        sx={{ color: '#2c67f2' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              <StyledTextField
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                sx={{ mb: 3 }}
                required
              />

              <GradientButton
                type="submit"
                variant="contained"
                fullWidth
                disabled={isLoading}
                sx={{ mb: 2 }}
              >
                {isLoading ? 'Processing...' : 'Sign Up'}
              </GradientButton>

              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <Link
                    onClick={handleLoginClick}
                    sx={{
                      color: '#2c67f2',
                      textDecoration: 'none',
                      fontWeight: 600,
                      cursor: 'pointer',
                      '&:hover': {
                        textDecoration: 'underline',
                      }
                    }}
                  >
                    Log in
                  </Link>
                </Typography>
              </Box>
            </Box>
          </RegisterPaper>
        </Fade>

        {/* Snackbar for error/success messages */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={error ? 'error' : 'success'}
            sx={{ width: '100%' }}
          >
            {error || success}
          </Alert>
        </Snackbar>
      </Container>
    </GradientBackground>
  );
};

export default Register;
