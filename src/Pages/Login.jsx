import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from './DashBoard/DashBoard';
import "@fontsource/open-sans";
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
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import googleLogo from '../assets/google.png';
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

// Decorative bubbles removed for a clean, minimal look

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

const LoginPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  background: 'rgba(255, 255, 255, 0.25)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  width: '100%',
  maxWidth: 420,
  border: 'none',
  boxShadow: 'none',
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
  // Make the press ripple white
  '& .MuiTouchRipple-child': {
    backgroundColor: '#ffffff',
  },
}));

const GoogleButton = styled(Button)(({ theme }) => ({
  background: '#ffffff',
  color: '#202124',
  border: '1px solid #dadce0',
  borderRadius: theme.spacing(1.5),
  height: 48,
  padding: '0 24px',
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  transition: 'background 0.2s ease, border-color 0.2s ease',
  '&:hover': {
    background: 'linear-gradient(#ffffff, #ffffff) padding-box, linear-gradient(90deg, #DB4437, #F4B400, #0F9D58, #4285F4) border-box',
    border: '2px solid transparent',
  },
  '&:focus': { boxShadow: 'none' },
  '&:focus-visible': { boxShadow: 'none' },
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

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSignUpClick = () => {
    navigate('/register');
  };

  const handleOpen = () => {
    setIsLoading(true);
  };

  const login = () => {
    handleOpen();
    
    const loginData = {
      email: email,
      password: password
    };
    
    console.log('Sending login request with data:', loginData);
    console.log('Request URL: /api/users/login');
    
    instance.post('api/users/login', loginData)
    .then(function (response) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', response.data.id);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('name', response.data.name);
      // Store email for profile-pic lookup by email
      localStorage.setItem('email', email);
      console.log(response.data.role);
      console.log(response.data.name);
      console.log(response.data.id);
      console.log(response.data.token);
      
      setSuccess('Login successful! Redirecting...');
      setOpenSnackbar(true);
      window.location.reload();
      

    })
    .catch(function (error) {
      console.log('Full error object:', error);
      console.log('Error response:', error.response);
      console.log('Error data:', error.response?.data);
      console.log('Error status:', error.response?.status);
      console.log('Error message:', error.response?.data?.message);
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response?.status === 401) {
        errorMessage = 'Invalid email or password. Please check your credentials.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      setOpenSnackbar(true);
    })
    .finally(function () {
      setIsLoading(false);
    });
  };
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      setOpenSnackbar(true);
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setOpenSnackbar(true);
      return false;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setOpenSnackbar(true);
      return false;
    }
    
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    login(); // Use your existing login function
  };

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
        <Fade in timeout={500}>
          <LoginPaper
            sx={{
              animation: 'slideUp 0.4s ease-out',
              '@keyframes slideUp': {
                from: {
                  opacity: 0,
                  transform: 'translateY(20px)',
                },
                to: {
                  opacity: 1,
                  transform: 'translateY(0)',
                },
              },
            }}
          >
            <style>{`
              @keyframes slideUp {
                from {
                  opacity: 0;
                  transform: translateY(20px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}</style>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  display:'flex',
                  justifyContent:'left',
                  fontWeight: 600,
                  color:'#202124'
                }}
              >
                Log in
              </Typography>
              <Typography variant="body1"  sx={{display:'flex',
                  justifyContent:'left', color:'#5f6368',fontWeight:'500'}}>
                Sign in to your account
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
              <StyledTextField
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2 }}
              />
              <StyledTextField
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 3 }}
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

              <GradientButton
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{ mb: 3 }}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </GradientButton>

              <GoogleButton
                type="button"
                fullWidth
                variant="outlined"
                startIcon={
                  <Box
                    component="img"
                    src={googleLogo}
                    alt="Google"
                    sx={{ width: 20, height: 20 }}
                    marginRight={'10px'}
                  />
                }
                onClick={() => { /* No-op for now */ }}
                sx={{ mb: 2 }}
              >
                Log in with Google
              </GoogleButton>

              <Box sx={{ textAlign: 'center' }}>
                <Link
                  href="#"
                  variant="body2"
                  sx={{
                    color: '#2c67f2',
                    textDecoration: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      textDecoration: 'underline',
                    }
                  }}
                >
                  Forgot your password?
                </Link>
              </Box>

              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <Link
                    onClick={handleSignUpClick}
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
                    Sign up
                  </Link>
                </Typography>
              </Box>
            </Box>
          </LoginPaper>
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

export default Login;