import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Card,
  CardContent,
  CardActionArea,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  PersonOutline,
  StorefrontOutlined,
  CloudUploadOutlined,
  CheckCircleOutline,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import googleLogo from '../../assets/google.png';
import instance from '../../Service/AxiosOrder';

// Logo styling
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

// Styled components (matching Login theme)
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
  fontFamily: '"Google Sans", Roboto, Arial, sans-serif',
  '& *': {
    fontFamily: '"Google Sans" !important',
  },
}));

const RegisterPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  background: 'rgba(255, 255, 255, 0.25)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  width: '100%',
  maxWidth: 450,
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
  '& .MuiTouchRipple-child': {
    backgroundColor: '#ffffff',
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

const GoogleButton = styled(Button)(({ theme }) => ({
  background: '#ffffff',
  color: '#202124',
  border: '2px solid #dadce0',
  borderRadius: theme.spacing(1.5),
  height: 48,
  padding: '0 24px',
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: 'transparent',
    background: 'linear-gradient(#ffffff, #ffffff) padding-box, linear-gradient(90deg, #DB4437, #F4B400, #0F9D58, #4285F4) border-box',
    border: '2px solid transparent',
  },
  '&:focus': { boxShadow: 'none' },
  '&:focus-visible': { boxShadow: 'none' },
}));

const RoleCard = styled(Card)(({ theme, selected }) => ({
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: selected ? '3px solid #4285F4' : '2px solid rgba(0, 0, 0, 0.12)',
  backgroundColor: selected ? 'rgba(66, 133, 244, 0.08)' : 'white',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
  '&:active': {
    transform: 'scale(0.98)',
    borderColor: '#4285F4',
  },
}));

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: credentials, 2: name, 3: role, 4: profile pic, 5: otp
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [userId, setUserId] = useState(''); // Store for OTP verification
  const [authToken, setAuthToken] = useState(''); // Temporary JWT for OTP APIs
  const [registeredUser, setRegisteredUser] = useState(null); // UsersDto from backend
  const [profilePicUrl, setProfilePicUrl] = useState(''); // Backend-served image URL
  const [skipOtp, setSkipOtp] = useState(false); // Option to skip OTP and auto-login

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setError('');
    setSuccess('');
  };

  // Step 1: Validate credentials
  const validateStep1 = () => {
    if (!email || !password || !confirmPassword) {
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
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setOpenSnackbar(true);
      return false;
    }
    return true;
  };

  // Step 2: Validate name
  const validateStep2 = () => {
    if (!firstName || !lastName) {
      setError('Please enter both first and last name');
      setOpenSnackbar(true);
      return false;
    }
    return true;
  };

  // Step 3: Validate role
  const validateStep3 = () => {
    if (!selectedRole) {
      setError('Please select a role');
      setOpenSnackbar(true);
      return false;
    }
    return true;
  };

  // Step 4: Validate and upload profile pic
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep4 = () => {
    // Profile picture is optional; if provided, ensure it's an image
    if (profilePic && !(profilePic.type || '').startsWith('image/')) {
      setError('Please upload a valid image file');
      setOpenSnackbar(true);
      return false;
    }
    return true;
  };

  // Step 5: Validate OTP
  const validateStep5 = () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      setOpenSnackbar(true);
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;
    if (step === 4 && !validateStep4()) return;

    // Simple next for steps 1-3
    if (step < 4) {
      setStep(step + 1);
      return;
    }

    // Step 4: register unverified user (multipart JSON+file), then send OTP, then go to step 5
    if (step === 4) {
      setIsLoading(true);
      setError('');
      setSuccess('');
      try {
        // 1) Register user (unverified) using multipart/form-data with JSON Blob + optional file
        const formData = new FormData();
        const userPayload = {
          name: `${firstName} ${lastName}`.trim(),
          email,
          password,
          role: selectedRole,
        };
        formData.append('user', new Blob([JSON.stringify(userPayload)], { type: 'application/json' }));
        if (profilePic) formData.append('profilePic', profilePic);

        const regRes = await instance.post('api/users/register-with-pic', formData);

        const dto = regRes?.data || {};
        // Extract userId from register response
        let newUserId = dto?.userId || dto?.id || dto?.user?.id;

        // Handle backend-served profile image URL if provided
        const relativePic = dto?.profilePic;
        if (relativePic) {
          const backendBase = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_BACKEND_BASE_URL)
            ? import.meta.env.VITE_BACKEND_BASE_URL
            : window.location.origin;
          const computedUrl = String(relativePic).startsWith('http')
            ? String(relativePic)
            : `${backendBase}${String(relativePic)}`;
          setProfilePicUrl(computedUrl);
        }
        setRegisteredUser(dto);

        if (!newUserId) {
          throw new Error('Unable to determine userId after registration');
        }

        // Save for later steps
        setUserId(String(newUserId));
        // Optionally persist for later navigation flows
        try { localStorage.setItem('otp_userId', String(newUserId)); } catch {}

        // Temporary login to obtain JWT for OTP endpoints
        let token = '';
        let loginData = {};
        try {
          const loginRes = await instance.post('api/users/login', { email, password });
          token = loginRes?.data?.token || loginRes?.data?.jwt || '';
          loginData = loginRes?.data || {};
        } catch (e) {
          // If login fails, surface a clear error
          throw new Error('Registered, but failed to obtain authorization token');
        }
        if (!token) {
          throw new Error('Unable to obtain authorization token');
        }
        setAuthToken(token);

        // If user opted to skip OTP, persist auth and go to app
        if (skipOtp) {
          try {
            localStorage.setItem('token', token);
            localStorage.setItem('user', String(loginData?.id || newUserId));
            localStorage.setItem('role', String(loginData?.role || selectedRole || ''));
            localStorage.setItem('name', String(loginData?.name || `${firstName} ${lastName}`.trim()));
            localStorage.setItem('email', email);
          } catch {}
          setSuccess('Account created. Logging you in...');
          setOpenSnackbar(true);
          setTimeout(() => {
            window.location.reload();
          }, 800);
          return;
        }

        // 2) Send OTP
        await instance.post('api/email-otp/send', { userId: Number(newUserId) }, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });

        setSuccess('OTP sent to your email');
        setOpenSnackbar(true);
        setStep(5);
      } catch (err) {
        console.error('Registration/OTP error:', err);
        const msg = err?.response?.data?.message || err?.message || 'Failed to register or send OTP';
        setError(msg);
        setOpenSnackbar(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleResendOtp = async () => {
    if (!userId || !authToken) {
      setError('Missing user session. Please restart signup.');
      setOpenSnackbar(true);
      return;
    }
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      await instance.post('api/email-otp/send', { userId: Number(userId) }, {
        headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
      });
      setSuccess('OTP re-sent');
      setOpenSnackbar(true);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to resend OTP';
      setError(msg);
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!validateStep5()) return;
    if (!userId || !authToken) {
      setError('Missing user session. Please restart signup.');
      setOpenSnackbar(true);
      return;
    }
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      await instance.post('api/email-otp/verify', { userId: Number(userId), otp }, {
        headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
      });
      setSuccess('Email verified! Redirecting to login...');
      setOpenSnackbar(true);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'OTP verification failed';
      setError(msg);
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-load PNG background (same as Login)
  const bgImageUrls = useMemo(() => {
    try {
      const modules = import.meta.glob('../../assets/bg/**/*.png', { eager: true, as: 'url' });
      return Object.values(modules);
    } catch (e) {
      return [];
    }
  }, []);

  // Generate random PNG sprites
  const sprites = useMemo(() => {
    const pick = () => bgImageUrls[Math.floor(Math.random() * bgImageUrls.length)] || '';
    const { w, h } = (typeof window !== 'undefined') ? { w: window.innerWidth, h: window.innerHeight } : { w: 1200, h: 800 };
    const gridForViewport = () => {
      if (w < 600) return { cols: 5, rows: 8 };
      if (w < 1024) return { cols: 7, rows: 6 };
      return { cols: 9, rows: 5 };
    };
    const { cols, rows } = gridForViewport();
    const totalCells = cols * rows;
    const desired = Math.min(Math.floor(totalCells / 3), (bgImageUrls.length || 8) * 2);
    const indices = Array.from({ length: totalCells }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    const chosen = indices.slice(0, desired);
    const cellW = w / cols;
    const cellH = h / rows;
    return chosen.map(idx => {
      const c = idx % cols;
      const r = Math.floor(idx / cols);
      const base = Math.min(cellW, cellH);
      const sizePx = Math.max(16, base * (0.40 + Math.random() * 0.25));
      const leftPx = c * cellW + cellW * (0.2 + Math.random() * 0.6) - sizePx / 2;
      const topPx = r * cellH + cellH * (0.2 + Math.random() * 0.6) - sizePx / 2;
      return {
        src: pick(),
        top: `${(topPx / h) * 100}%`,
        left: `${(leftPx / w) * 100}%`,
        size: sizePx,
        duration: `${8 + Math.random() * 10}s`,
        delay: `${Math.random() * 6}s`,
        rotate: `${-90 + Math.random() * 180}deg`,
        opacity: 0.25 + Math.random() * 0.15,
      };
    });
  }, [bgImageUrls]);

  return (
    <GradientBackground>
      <LogoText variant="h6">
        <Box component="span" sx={{ color: '#4285F4' }}>J</Box>ob{' '}
        <Box component="span" sx={{ color: '#4285F4' }}>P</Box>ortal
      </LogoText>
      {/* PNG Repeating Background Layer (same as Login) */}
      {bgImageUrls.length > 0 && (
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          <style>{`
            @keyframes pngFloat {
              0%, 100% { transform: translate3d(0,0,0); }
              50% { transform: translate3d(0,-8px,0); }
            }
          `}</style>
          {sprites.map((s, i) => (
            <Box
              key={i}
              component="img"
              src={s.src}
              alt="bg-icon"
              sx={{
                position: 'absolute',
                top: s.top,
                left: s.left,
                width: s.size,
                height: 'auto',
                opacity: s.opacity,
                filter: 'none',
                transform: `rotate(${s.rotate})`,
                animation: `pngFloat ${s.duration} ease-in-out ${s.delay} infinite`,
              }}
            />
          ))}
        </Box>
      )}

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
          <RegisterPaper
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
            {/* Step 1: Credentials */}
            {step === 1 && (
              <Box>
                <Box sx={{ textAlign: 'center', mb: 4,animation: 'slideUp 0.4s ease-out',
              '@keyframes slideUp': {
                from: {
                  opacity: 0,
                  transform: 'translateY(20px)',
                },
                to: {
                  opacity: 1,
                  transform: 'translateY(0)',
                },
              }, }}>
                  <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                      display: 'flex',
                      justifyContent: 'left',
                      fontWeight: 600,
                      color: '#202124',
                    }}
                  >
                    Create Account
                  </Typography>
                  <Typography variant="body1" sx={{ display: 'flex', justifyContent: 'left', color: '#5f6368', fontWeight: '500' }}>
                    Step 1 of 5: Email & Password
                  </Typography>
                </Box>

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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{ mb: 2 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
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
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  sx={{ mb: 3 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          sx={{ color: '#2c67f2' }}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <GradientButton fullWidth variant="contained" onClick={handleNext} sx={{ mb: 2 }}>
                  Next
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
                  Sign up with Google
                </GoogleButton>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Already have an account?{' '}
                    <Link
                      onClick={() => navigate('/login')}
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
            )}

            {/* Step 2: Name */}
            {step === 2 && (
              <Box>
                <Box sx={{ textAlign: 'center', mb: 4,animation: 'slideUp 0.4s ease-out',
              '@keyframes slideUp': {
                from: {
                  opacity: 0,
                  transform: 'translateY(20px)',
                },
                to: {
                  opacity: 1,
                  transform: 'translateY(0)',
                },
              }, }}>
                  <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                      display: 'flex',
                      justifyContent: 'left',
                      fontWeight: 600,
                      color: '#202124',
                    }}
                  >
                    Tell us your name
                  </Typography>
                  <Typography variant="body1" sx={{ display: 'flex', justifyContent: 'left', color: '#5f6368', fontWeight: '500' }}>
                    Step 2 of 5: Personal Information
                  </Typography>
                </Box>

                <StyledTextField
                  fullWidth
                  label="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoFocus
                  sx={{ mb: 2 }}
                />
                <StyledTextField
                  fullWidth
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  sx={{ mb: 3 }}
                />

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleBack}
                    sx={{ color: '#2c67f2', borderColor: '#2c67f2' }}
                  >
                    Back
                  </Button>
                  <GradientButton fullWidth variant="contained" onClick={handleNext}>
                    Next
                  </GradientButton>
                </Box>
              </Box>
            )}

            {/* Step 3: Role Selection */}
            {step === 3 && (
              <Box>
                <Box sx={{ textAlign: 'center', mb: 4,animation: 'slideUp 0.4s ease-out',
              '@keyframes slideUp': {
                from: {
                  opacity: 0,
                  transform: 'translateY(20px)',
                },
                to: {
                  opacity: 1,
                  transform: 'translateY(0)',
                },
              }, }}>
                  <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                      display: 'flex',
                      justifyContent: 'left',
                      fontWeight: 600,
                      color: '#202124',
                    }}
                  >
                    Select your role
                  </Typography>
                  <Typography variant="body1" sx={{ display: 'flex', justifyContent: 'left', color: '#5f6368', fontWeight: '500' }}>
                    Step 3 of 5: Account Type
                  </Typography>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
                  <RoleCard
                    selected={selectedRole === 'JobSeeker'}
                    onClick={() => setSelectedRole('JobSeeker')}
                    aria-pressed={selectedRole === 'JobSeeker'}
                    sx={{ p: 0,border:"1px solid \t#D3D3D3",boxShadow:'none', borderRadius: 4, }}
                  >
                    <CardActionArea>
                      <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <PersonOutline sx={{ fontSize: 48, color: '#4285F4', mb: 2 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#202124' }}>
                        Job Seeker
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Find your next opportunity
                      </Typography>
                      </CardContent>
                    </CardActionArea>
                  </RoleCard>

                  <RoleCard
                    selected={selectedRole === 'Employer'}
                    onClick={() => setSelectedRole('Employer')}
                    aria-pressed={selectedRole === 'Employer'}
                    sx={{ p: 0 ,border:"1px solid \t#D3D3D3",boxShadow:'none', borderRadius: 4, }}
                  >
                    <CardActionArea>
                      <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <StorefrontOutlined sx={{ fontSize: 48, color: '#0F9D58', mb: 2 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#202124' }}>
                        Employer
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Hire talented people
                      </Typography>
                      </CardContent>
                    </CardActionArea>
                  </RoleCard>
                </Box>

                {/* Optional: Skip OTP toggle */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                  <FormControlLabel
                    control={<Checkbox checked={skipOtp} onChange={(e) => setSkipOtp(e.target.checked)} sx={{ color: '#2c67f2' }} />}
                    label={<Typography variant="body2" sx={{ color: '#5f6368' }}>Skip email verification for now</Typography>}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleBack}
                    sx={{ color: '#2c67f2', borderColor: '#2c67f2' }}
                  >
                    Back
                  </Button>
                  <GradientButton fullWidth variant="contained" onClick={handleNext}>
                    Next
                  </GradientButton>
                </Box>
              </Box>
            )}

            {/* Step 4: Profile Picture */}
            {step === 4 && (
              <Box>
                <Box sx={{ textAlign: 'center', mb: 4,animation: 'slideUp 0.4s ease-out',
              '@keyframes slideUp': {
                from: {
                  opacity: 0,
                  transform: 'translateY(20px)',
                },
                to: {
                  opacity: 1,
                  transform: 'translateY(0)',
                },
              }, }}>
                  <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                      display: 'flex',
                      justifyContent: 'left',
                      fontWeight: 600,
                      color: '#202124',
                    }}
                  >
                    Add profile photo
                  </Typography>
                  <Typography variant="body1" sx={{ display: 'flex', justifyContent: 'left', color: '#5f6368', fontWeight: '500' }}>
                    Step 4 of 5: Profile Picture
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px dashed #2c67f2',
                    borderRadius: 2,
                    p: 4,
                    mb: 3,
                    cursor: 'pointer',
                    backgroundColor: 'rgba(66, 133, 244, 0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(66, 133, 244, 0.1)',
                    },
                  }}
                  component="label"
                >
                  {profilePicPreview ? (
                    <Box sx={{ textAlign: 'center' }}>
                      <Box
                        component="img"
                        src={profilePicPreview}
                        alt="Profile preview"
                        sx={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', mb: 2 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Click to change photo
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <CloudUploadOutlined sx={{ fontSize: 48, color: '#2c67f2', mb: 1 }} />
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#202124' }}>
                        Upload your photo
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Click or drag to upload
                      </Typography>
                    </Box>
                  )}
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={handleProfilePicChange}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleBack}
                    sx={{ color: '#2c67f2', borderColor: '#2c67f2' }}
                  >
                    Back
                  </Button>
                  <GradientButton fullWidth variant="contained" onClick={handleNext} disabled={isLoading}>
                    {isLoading ? 'Sending OTP...' : 'Continue'}
                  </GradientButton>
                </Box>
              </Box>
            )}

            {/* Step 5: OTP Verification */}
            {step === 5 && (
              <Box>
                <Box sx={{ textAlign: 'center', mb: 4,animation: 'slideUp 0.4s ease-out',
              '@keyframes slideUp': {
                from: {
                  opacity: 0,
                  transform: 'translateY(20px)',
                },
                to: {
                  opacity: 1,
                  transform: 'translateY(0)',
                },
              }, }}>
                  <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                      display: 'flex',
                      justifyContent: 'left',
                      fontWeight: 600,
                      color: '#202124',
                    }}
                  >
                    Verify your email
                  </Typography>
                  <Typography variant="body1" sx={{ display: 'flex', justifyContent: 'left', color: '#5f6368', fontWeight: '500' }}>
                    Step 5 of 5: Enter 6-digit OTP
                  </Typography>
                </Box>

                {/* Show registered user info and backend-hosted profile image */}
                {(registeredUser || profilePicUrl) && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    {profilePicUrl && (
                      <Box
                        component="img"
                        src={profilePicUrl}
                        alt="Profile"
                        sx={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }}
                      />
                    )}
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#202124' }}>
                        {registeredUser?.name || `${firstName} ${lastName}`.trim()}
                      </Typography>
                      {registeredUser?.email && (
                        <Typography variant="body2" color="text.secondary">{registeredUser.email}</Typography>
                      )}
                    </Box>
                  </Box>
                )}

                <Typography variant="body2" sx={{ color: '#5f6368', mb: 3 }}>
                  We've sent a verification code to <strong>{email}</strong>
                </Typography>

                <StyledTextField
                  fullWidth
                  label="Enter OTP"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                  inputProps={{ maxLength: 6, inputMode: 'numeric' }}
                  autoFocus
                  sx={{ mb: 3 }}
                />

                <GradientButton
                  fullWidth
                  variant="contained"
                  onClick={handleVerifyOtp}
                  disabled={isLoading}
                  sx={{ mb: 2 }}
                >
                  {isLoading ? 'Verifying...' : 'Verify & Complete'}
                </GradientButton>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Didn't receive code?{' '}
                    <Link
                      sx={{
                        color: '#2c67f2',
                        textDecoration: 'none',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                      onClick={isLoading ? undefined : handleResendOtp}
                    >
                      Resend
                    </Link>
                  </Typography>
                </Box>
              </Box>
            )}
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
