import React, { useState } from 'react';
import Dashboard from './DashBoard/DashBoard';
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
import { styled } from '@mui/material/styles';
import instance from '../Service/AxiosOrder';

// Styled components
const GradientBackground = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  width: '100vw',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #62cff4 15%, #2c67f2 100%)',
  position: 'fixed',
  top: 0,
  left: 0,
  margin: 0,
  padding: 0,
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    animation: 'moveBackground 20s linear infinite',
  },
  '@keyframes moveBackground': {
    '0%': { transform: 'translate(0, 0)' },
    '100%': { transform: 'translate(-60px, -60px)' },
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

const LoginPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  background: 'rgba(255, 255, 255, 0.98)',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  width: '100%',
  maxWidth: 380,

}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #62cff4 30%, #2c67f2 90%)',
  border: 0,
  borderRadius: theme.spacing(1.5),
  boxShadow: '0 4px 15px rgba(44, 103, 242, 0.3)',
  color: 'white',
  height: 48,
  padding: '0 30px',
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #4fbff0 30%, #1f5ae8 90%)',
    boxShadow: '0 6px 20px rgba(44, 103, 242, 0.4)',
  },
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
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleSignUpClick = () => {
    setShowRegister(true);
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

  // If user wants to register, show Register component
  if (showRegister) {
    const Register = React.lazy(() => import('./Register'));
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
        <Register />
      </React.Suspense>
    );
  }

  return (
    <GradientBackground>
      {/* Floating bubbles */}
      <FloatingBubble sx={{ width: 40, height: 40, top: '10%', left: '10%', animationDelay: '0s' }} />
      <FloatingBubble sx={{ width: 60, height: 60, top: '20%', right: '15%', animationDelay: '2s' }} />
      <FloatingBubble sx={{ width: 30, height: 30, top: '60%', left: '20%', animationDelay: '4s' }} />
      <FloatingBubble sx={{ width: 50, height: 50, bottom: '20%', right: '25%', animationDelay: '1s' }} />
      <FloatingBubble sx={{ width: 35, height: 35, top: '40%', left: '70%', animationDelay: '3s' }} />
      <FloatingBubble sx={{ width: 45, height: 45, bottom: '40%', left: '15%', animationDelay: '5s' }} />
      
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
          <LoginPaper elevation={24}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  display:'flex',
                  justifyContent:'left',
                  fontWeight: 700,
                  color:'black'
                }}
              >
                Log in
              </Typography>
              <Typography variant="body1"  sx={{display:'flex',
                  justifyContent:'left', color:'#A8A8A8',fontWeight:'500'}}>
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