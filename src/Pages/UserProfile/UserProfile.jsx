import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Input,
  Grid,
  Divider,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  PhotoCamera,
  Edit,
  Save,
  Cancel,
  Lock,
  Close,
  ExpandMore,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import instance from '../../Service/AxiosOrder';


const ProfileCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: 'none',
  border: '1px solid #dadce0',
  background: '#fff',
  marginBottom: theme.spacing(3),
}));

const ProfileHeader = styled(Box)(({ theme }) => ({
  background: '#ffffff',
  color: '#202124',
  padding: theme.spacing(2),
  borderRadius: `${theme.spacing(2)} ${theme.spacing(2)} 0 0`,
  borderBottom: '1px solid #dadce0',
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: '#4285F4',
  border: 0,
  borderRadius: theme.spacing(1.5),
  boxShadow: 'none',
  color: 'white',
  height: 44,
  padding: '0 24px',
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  transition: 'background 0.2s ease',
  '&:hover': {
    background: '#1a73e8',
    boxShadow: 'none',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(1.5),
    backgroundColor: '#ffffff',
    '&.Mui-focused': {
      '& fieldset': {
        borderColor: '#2c67f2',
        borderWidth: 2,
      }
    },
    '& fieldset': {
      borderColor: '#dadce0',
    }
  }
}));


const ProfilePicContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  position: 'relative',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  marginLeft  : 'auto', 
}));

// Minimal full-viewport wrapper (same concept as Home)
const Page = styled(Box)(({ theme }) => ({
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
  fontFamily: '"Google Sans", Roboto, Arial, sans-serif',
  '& *': {
    fontFamily: '"Google Sans" !important',
  },
}));

const LogoText = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  left: theme.spacing(3),
  fontWeight: 550,
  fontSize: '28px',
  color: '#202124',
  letterSpacing: 0.3,
}));

const UserProfile = () => {
  const objectUrlRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    role: '',
    profilePic: null,
    createdAt: null,
    // Employer-specific fields
    companyName: '',
    companyWebsite: '',
    companyAddress: '',
    contactInfo: '',
    position: '',
    // Trainer-specific fields
    bio: '',
    specialization: '',
    company: '',
    certifications: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profilePreview, setProfilePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [hasEmployerProfile, setHasEmployerProfile] = useState(false);
  const [showEmployerProfileCreation, setShowEmployerProfileCreation] = useState(false);
  const [hasTrainerProfile, setHasTrainerProfile] = useState(false);
  const [showTrainerProfileCreation, setShowTrainerProfileCreation] = useState(false);
  const [emailVerified, setEmailVerified] = useState(null);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userId = localStorage.getItem('user');
        const storedName = localStorage.getItem('name');
        const userRole = localStorage.getItem('role');
        
        if (userId) {
          const response = await instance.get(`/api/users/${userId}`);
          const userData = response.data;

          // Fetch profile picture as a blob via token-protected endpoint
          try {
            const picResp = await instance.get(`/api/users/${userId}/profile-pic/file`, { responseType: 'blob' });
            const blob = picResp?.data;
            if (blob && blob.size > 0) {
              if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
              const url = URL.createObjectURL(blob);
              objectUrlRef.current = url;
              setProfilePreview(url);
              setAvatarError(false);
            }
          } catch (picErr) {
            if (picErr?.response?.status === 403) {
              // Not allowed: force re-login
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              localStorage.removeItem('role');
              localStorage.removeItem('name');
              window.location.reload();
              return;
            }
            // Other errors: ignore; default avatar or selected file preview will be used
          }
          
          let profileDataToSet = {
            name: userData.name || storedName || '',
            email: userData.email || '',
            role: userData.role || userRole || '',
            profilePic: userData.profilePic || null,
            createdAt: userData.createdAt || null,
            // Employer-specific fields (will be empty for non-employers)
            companyName: userData.companyName || '',
            companyWebsite: userData.companyWebsite || '',
            companyAddress: userData.companyAddress || '',
            contactInfo: userData.contactInfo || '',
            position: userData.position || '',
            // Trainer-specific fields (will be empty for non-trainers)
            bio: userData.bio || '',
            specialization: userData.specialization || '',
            company: userData.company || '',
            certifications: userData.certifications || '',
          };

          // If user is an Employer, fetch additional Employer data
          if ((userData.role || userRole) === 'Employer') {
            try {
              const employerResponse = await instance.get(`/api/employers/${userId}`);
              const employerData = employerResponse.data;
              console.log('Employer data received:', employerData);
              
              // Merge Employer-specific data
              profileDataToSet = {
                ...profileDataToSet,
                companyName: employerData.companyName || '',
                companyWebsite: employerData.companyWebsite || '',
                companyAddress: employerData.companyAddress || '',
                contactInfo: employerData.contactInfo || '',
                position: employerData.position || '',
              };
              
              setHasEmployerProfile(true);
            } catch (employerError) {
              console.log('Employer profile not found or error fetching:', employerError);
              // This is expected for new Employers who haven't created their profile yet
              setHasEmployerProfile(false);
            }
          }

          // If user is a Trainer, fetch additional Trainer data
          if ((userData.role || userRole) === 'Trainer') {
            try {
              const trainerResponse = await instance.get(`/api/trainers/${userId}`);
              const trainerData = trainerResponse.data;
              console.log('Trainer data received:', trainerData);
              
              // Merge Trainer-specific data
              profileDataToSet = {
                ...profileDataToSet,
                bio: trainerData.bio || '',
                specialization: trainerData.specialization || '',
                company: trainerData.company || '',
                certifications: trainerData.certifications || '',
              };
              
              setHasTrainerProfile(true);
            } catch (trainerError) {
              console.log('Trainer profile not found or error fetching:', trainerError);
              // This is expected for new Trainers who haven't created their profile yet
              setHasTrainerProfile(false);
            }
          }

          setProfileData(profileDataToSet);
          // Check email verification status (requires Bearer token for same user)
          try {
            const verResp = await instance.get(`/api/users/${userId}/verified`);
            setEmailVerified(Boolean(verResp?.data));
          } catch (verErr) {
            setEmailVerified(false);
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load profile data',
          severity: 'error'
        });
      }
    };

    fetchUserProfile();
  }, []);

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, []);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setSnackbar({
          open: true,
          message: 'Please select a valid image file',
          severity: 'error'
        });
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setSnackbar({
          open: true,
          message: 'Image size should be less than 5MB',
          severity: 'error'
        });
        return;
      }

      setSelectedFile(file);
      // Revoke any existing object URL before setting a data URL preview
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
        setAvatarError(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarError = () => {
    setAvatarError(true);
  };

  const getAvatarContent = () => {
    if (profilePreview && !avatarError) {
      return <Avatar src={profilePreview} sx={{ width: 120, height: 120, borderRadius: 4 }} onError={handleAvatarError} />;
    }
    return (
      <Avatar sx={{ width: 120, height: 120, fontSize: '1.5rem', bgcolor: '#2c67f2', borderRadius: 4 }}>
        {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
      </Avatar>
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    setIsLoading(true);
    
    try {
      const userId = localStorage.getItem('user');
      let profilePicFilename = profileData.profilePic;

      // Only upload image if a new file was selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
          const uploadResponse = await instance.post('/api/users/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          
          // Extract filename from the response
          const imageUrl = uploadResponse.data.imageUrl; // e.g., "/api/images/filename.jpg"
          profilePicFilename = imageUrl.split('/').pop(); // Extract just the filename
          console.log('Image uploaded, filename:', profilePicFilename);
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          setSnackbar({
            open: true,
            message: 'Failed to upload profile picture',
            severity: 'error'
          });
          setIsLoading(false);
          return;
        }
      }

      // Update user profile - only include profilePic if it was changed
      const updateData = {
        name: profileData.name,
      };

      // Only include profilePic in update if a new file was uploaded
      if (selectedFile) {
        updateData.profilePic = profilePicFilename;
      }

      const response = await instance.put(`/api/users/${userId}`, updateData);
      console.log('Profile updated successfully:', response.data);

      // Update localStorage with new name
      localStorage.setItem('name', profileData.name);

      // Handle Employer profile update (only if employer profile exists)
      if (profileData.role === 'Employer' && hasEmployerProfile) {
        const employerData = {
          companyName: profileData.companyName,
          companyWebsite: profileData.companyWebsite,
          companyAddress: profileData.companyAddress,
          contactInfo: profileData.contactInfo,
          position: profileData.position,
        };

        try {
          console.log('Updating existing Employer profile:', employerData);
          await instance.put(`/api/employers/${userId}`, employerData);
          console.log('Employer profile updated successfully');
        } catch (updateError) {
          console.error('Error updating Employer profile:', updateError);
          setSnackbar({
            open: true,
            message: 'Failed to update Employer profile',
            severity: 'error'
          });
          setIsLoading(false);
          return;
        }
      }

      // Handle Trainer profile update (only if trainer profile exists)
      if (profileData.role === 'Trainer' && hasTrainerProfile) {
        const trainerData = {
          bio: profileData.bio,
          specialization: profileData.specialization,
          company: profileData.company,
          certifications: profileData.certifications,
        };

        try {
          console.log('Updating existing Trainer profile:', trainerData);
          await instance.put(`/api/trainers/${userId}`, trainerData);
          console.log('Trainer profile updated successfully');
        } catch (updateError) {
          console.error('Error updating Trainer profile:', updateError);
          setSnackbar({
            open: true,
            message: 'Failed to update Trainer profile',
            severity: 'error'
          });
          setIsLoading(false);
          return;
        }
      }

      setIsEditing(false);
      setSelectedFile(null);
      
      setSnackbar({
        open: true,
        message: 'Profile updated successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update profile',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSnackbar({
        open: true,
        message: 'New passwords do not match!',
        severity: 'error'
      });
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setSnackbar({
        open: true,
        message: 'Password must be at least 6 characters long!',
        severity: 'error'
      });
      return;
    }
    
    setPasswordLoading(true);
    
    try {
      const userId = localStorage.getItem('user');
      const passwordUpdateData = {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      };

      await instance.put(`/api/users/${userId}/password`, passwordUpdateData);
      
      setPasswordDialogOpen(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setSnackbar({
        open: true,
        message: 'Password updated successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating password:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to update password',
        severity: 'error'
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedFile(null);
    setShowEmployerProfileCreation(false);
    setShowTrainerProfileCreation(false);
    // Reset preview to original if it was changed
    const userId = localStorage.getItem('user');
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    if (userId) {
      instance
        .get(`/api/users/${userId}/profile-pic/file`, { responseType: 'blob' })
        .then((resp) => {
          const blob = resp?.data;
          if (blob && blob.size > 0) {
            const url = URL.createObjectURL(blob);
            objectUrlRef.current = url;
            setProfilePreview(url);
          } else {
            setProfilePreview(null);
          }
        })
        .catch(() => setProfilePreview(null));
    } else {
      setProfilePreview(null);
    }
    setAvatarError(false);
    
    // Refetch original data
    if (userId) {
      instance.get(`/api/users/${userId}`)
        .then(async (response) => {
          const userData = response.data;
          let profileDataToSet = {
            name: userData.name || '',
            email: userData.email || '',
            role: userData.role || '',
            profilePic: userData.profilePic || null,
            createdAt: userData.createdAt || null,
            // Employer-specific fields
            companyName: userData.companyName || '',
            companyWebsite: userData.companyWebsite || '',
            companyAddress: userData.companyAddress || '',
            contactInfo: userData.contactInfo || '',
            position: userData.position || '',
            // Trainer-specific fields
            bio: userData.bio || '',
            specialization: userData.specialization || '',
            company: userData.company || '',
            certifications: userData.certifications || '',
          };              // If user is an Employer, fetch Employer data
              if (userData.role === 'Employer') {
                try {
                  const employerResponse = await instance.get(`/api/employers/${userId}`);
                  const employerData = employerResponse.data;
                  
                  profileDataToSet = {
                    ...profileDataToSet,
                    companyName: employerData.companyName || '',
                    companyWebsite: employerData.companyWebsite || '',
                    companyAddress: employerData.companyAddress || '',
                    contactInfo: employerData.contactInfo || '',
                    position: employerData.position || '',
                  };
                  
                  setHasEmployerProfile(true);
                } catch (employerError) {
                  console.log('Employer profile not found:', employerError);
                  setHasEmployerProfile(false);
                }
              }

              // If user is a Trainer, fetch Trainer data
              if (userData.role === 'Trainer') {
                try {
                  const trainerResponse = await instance.get(`/api/trainers/${userId}`);
                  const trainerData = trainerResponse.data;
                  
                  profileDataToSet = {
                    ...profileDataToSet,
                    bio: trainerData.bio || '',
                    specialization: trainerData.specialization || '',
                    company: trainerData.company || '',
                    certifications: trainerData.certifications || '',
                  };
                  
                  setHasTrainerProfile(true);
                } catch (trainerError) {
                  console.log('Trainer profile not found:', trainerError);
                  setHasTrainerProfile(false);
                }
              }

          setProfileData(profileDataToSet);
        })
        .catch(error => console.error('Error refetching profile data:', error));
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const openOtpDialog = async () => {
    const userId = localStorage.getItem('user');
    if (!userId) return;
    setOtpLoading(true);
    setSnackbar({ open: false, message: '', severity: 'success' });
    try {
      await instance.post('api/email-otp/send', { userId: Number(userId) });
      setOtpDialogOpen(true);
      setSnackbar({ open: true, message: 'OTP sent to your email', severity: 'success' });
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to send OTP';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    const userId = localStorage.getItem('user');
    if (!userId || !otpValue || otpValue.length !== 6) {
      setSnackbar({ open: true, message: 'Enter a valid 6-digit OTP', severity: 'error' });
      return;
    }
    setOtpLoading(true);
    try {
      await instance.post('api/email-otp/verify', { userId: Number(userId), otp: otpValue });
      setEmailVerified(true);
      setOtpDialogOpen(false);
      setOtpValue('');
      setSnackbar({ open: true, message: 'Email verified successfully!', severity: 'success' });
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'OTP verification failed';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    } finally {
      setOtpLoading(false);
    }
  };

  const handlePasswordDialogClose = () => {
    setPasswordDialogOpen(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setShowPassword(false);
  };

  const handleCreateEmployerProfile = () => {
    setShowEmployerProfileCreation(true);
    // Don't set isEditing to true - we only want to enable employer fields
  };

  const handleSaveEmployerProfile = async (e) => {
    e.preventDefault();
    
    // Validate employer profile fields
    if (!profileData.companyName || !profileData.contactInfo || !profileData.position) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required company fields (Company Name, Contact Info, and Position)',
        severity: 'error'
      });
      return;
    }

    setIsLoading(true);

    try {
      const userId = localStorage.getItem('user');
      
      const employerData = {
        userId: parseInt(userId),
        companyName: profileData.companyName,
        companyWebsite: profileData.companyWebsite,
        companyAddress: profileData.companyAddress,
        contactInfo: profileData.contactInfo,
        position: profileData.position,
      };

      console.log('Creating new Employer profile:', employerData);
      await instance.post('/api/employers/create', employerData);
      console.log('Employer profile created successfully');
      
      setHasEmployerProfile(true);
      setShowEmployerProfileCreation(false);
      
      setSnackbar({
        open: true,
        message: 'Company profile created successfully!',
        severity: 'success'
      });
    } catch (createError) {
      console.error('Error creating Employer profile:', createError);
      setSnackbar({
        open: true,
        message: 'Failed to create Employer profile',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEmployerProfile = () => {
    setShowEmployerProfileCreation(false);
    // Don't set isEditing to false - maintain current editing state
    // Reset employer fields
    setProfileData(prev => ({
      ...prev,
      companyName: '',
      companyWebsite: '',
      companyAddress: '',
      contactInfo: '',
      position: '',
    }));
  };

  const handleCreateTrainerProfile = () => {
    setShowTrainerProfileCreation(true);
    // Don't set isEditing to true - we only want to enable trainer fields
  };

  const handleSaveTrainerProfile = async (e) => {
    e.preventDefault();
    
    // Validate trainer profile fields
    if (!profileData.bio || !profileData.specialization) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields (Bio and Specialization)',
        severity: 'error'
      });
      return;
    }

    setIsLoading(true);

    try {
      const userId = localStorage.getItem('user');
      
      const trainerData = {
        userId: parseInt(userId),
        bio: profileData.bio,
        specialization: profileData.specialization,
        company: profileData.company,
        certifications: profileData.certifications,
      };

      console.log('Creating new Trainer profile:', trainerData);
      await instance.post('/api/trainers', trainerData);
      console.log('Trainer profile created successfully');
      
      setHasTrainerProfile(true);
      setShowTrainerProfileCreation(false);
      
      setSnackbar({
        open: true,
        message: 'Trainer profile created successfully!',
        severity: 'success'
      });
    } catch (createError) {
      console.error('Error creating Trainer profile:', createError);
      setSnackbar({
        open: true,
        message: 'Failed to create Trainer profile',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelTrainerProfile = () => {
    setShowTrainerProfileCreation(false);
    // Don't set isEditing to false - maintain current editing state
    // Reset trainer fields
    setProfileData(prev => ({
      ...prev,
      bio: '',
      specialization: '',
      company: '',
      certifications: '',
    }));
  };

  // Helper function to format the member since date
  const formatMemberSinceDate = (createdAt) => {
    if (!createdAt) return 'Not available';
    
    try {
      const date = new Date(createdAt);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Not available';
    }
  };

  const roles = [
    { value: 'Employer', label: 'Employer' },
    { value: 'Trainer', label: 'Trainer' },
    { value: 'Admin', label: 'Admin' },
  ];

  return (
    <Page>
      <LogoText variant="h6">
        <Box component="span" sx={{ color: '#4285F4' }}>J</Box>ob{' '}
        <Box component="span" sx={{ color: '#4285F4' }}>P</Box>ortal
      </LogoText>
      <Container maxWidth="md" sx={{ textAlign: 'left' }}>
      <ProfileCard>
        <ProfileHeader>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 500 }}>
              My Account
            </Typography>
            {!isEditing ? (
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setIsEditing(true)}
                sx={{
                  color: '#2c67f2',
                  borderColor: '#2c67f2',
                  '&:hover': {
                    backgroundColor: 'rgba(44, 103, 242, 0.06)',
                    borderColor: '#2c67f2',
                  }
                }}
              >
                Edit Profile
              </Button>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={handleCancel}
                  sx={{
                    color: '#2c67f2',
                    borderColor: '#2c67f2',
                    '&:hover': {
                      backgroundColor: 'rgba(44, 103, 242, 0.06)',
                      borderColor: '#2c67f2',
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSave}
                  disabled={isLoading}
                  sx={{
                    backgroundColor: '#4285F4',
                    boxShadow: 'none',
                    '&:hover': {
                      backgroundColor: '#1a73e8',
                      boxShadow: 'none',
                    }
                  }}
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </Button>
              </Box>
            )}
          </Box>
        </ProfileHeader>

        <CardContent sx={{ pt: 0 }}>
          {/* Profile Picture Section */}
          <ProfilePicContainer>
            {getAvatarContent()}
            {isEditing && (
              <>
                <Input
                  accept="image/*"
                  id="profile-pic-upload"
                  type="file"
                  onChange={handleProfilePicChange}
                  sx={{ display: 'none' }}
                />
                <label htmlFor="profile-pic-upload">
                  <IconButton
                    component="span"
                    sx={{
                      position: 'absolute',
                      bottom: 10,
                      right: '50%',
                      transform: 'translateX(50%)',
                      backgroundColor: '#2c67f2',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#1f5ae8',
                      }
                    }}
                  >
                    <PhotoCamera />
                  </IconButton>
                </label>
              </>
            )}
          </ProfilePicContainer>

          <Box component="form" onSubmit={handleSave}>
            <Grid container spacing={3}>

              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  id="name"
                  label="Full Name"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  type="email"
                  value={profileData.email}
                  disabled={true}
                  required
                />
              </Grid>

              {/* Employer-specific fields */}
              {profileData.role === 'Employer' && (
                <>
                  {!hasEmployerProfile && !showEmployerProfileCreation ? (
                    <Grid item xs={12}>
                      <Card sx={{ 
                        mt: 2, 
                        border: '2px dashed #2c67f2', 
                        backgroundColor: 'rgba(44, 103, 242, 0.02)',
                        borderRadius: 2 
                      }}>
                        <CardContent sx={{ textAlign: 'center', py: 4 }}>
                          <Typography variant="h6" sx={{ mb: 2, color: '#2c67f2', fontWeight: 600 }}>
                            Complete Your Employer Profile
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                            Create your company profile to post jobs and connect with candidates
                          </Typography>
                          <GradientButton
                            onClick={handleCreateEmployerProfile}
                            variant="contained"
                            sx={{ px: 4 }}
                          >
                            Create Company Profile
                          </GradientButton>
                        </CardContent>
                      </Card>
                    </Grid>
                  ) : (
                    <>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c67f2' }}>
                            Company Information
                          </Typography>
                          {hasEmployerProfile && (
                            <Typography variant="body2" sx={{ 
                              color: 'success.main', 
                              fontWeight: 500,
                              backgroundColor: 'rgba(76, 175, 80, 0.1)',
                              padding: '4px 12px',
                              borderRadius: '16px',
                              fontSize: '0.75rem'
                            }}>
                              Profile Complete
                            </Typography>
                          )}
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <StyledTextField
                          fullWidth
                          id="companyName"
                          label="Company Name"
                          name="companyName"
                          value={profileData.companyName}
                          onChange={handleInputChange}
                          disabled={!isEditing && !showEmployerProfileCreation}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <StyledTextField
                          fullWidth
                          id="companyWebsite"
                          label="Company Website"
                          name="companyWebsite"
                          type="url"
                          value={profileData.companyWebsite}
                          onChange={handleInputChange}
                          disabled={!isEditing && !showEmployerProfileCreation}
                          placeholder="https://www.example.com"
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <StyledTextField
                          fullWidth
                          id="companyAddress"
                          label="Company Address"
                          name="companyAddress"
                          multiline
                          rows={3}
                          value={profileData.companyAddress}
                          onChange={handleInputChange}
                          disabled={!isEditing && !showEmployerProfileCreation}
                          placeholder="Enter your company's full address..."
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <StyledTextField
                          fullWidth
                          id="contactInfo"
                          label="Contact Information"
                          name="contactInfo"
                          value={profileData.contactInfo}
                          onChange={handleInputChange}
                          disabled={!isEditing && !showEmployerProfileCreation}
                          placeholder="Phone, email, or other contact details"
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <StyledTextField
                          fullWidth
                          id="position"
                          label="Your Position"
                          name="position"
                          value={profileData.position}
                          onChange={handleInputChange}
                          disabled={!isEditing && !showEmployerProfileCreation}
                          placeholder="e.g., HR Manager, CEO, Recruiter"
                          required
                        />
                      </Grid>

                      {showEmployerProfileCreation && (
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
                            <Button
                              variant="outlined"
                              onClick={handleCancelEmployerProfile}
                              sx={{ color: '#2c67f2', borderColor: '#2c67f2' }}
                            >
                              Cancel
                            </Button>
                            <GradientButton
                              onClick={handleSaveEmployerProfile}
                              disabled={isLoading || !profileData.companyName || !profileData.contactInfo || !profileData.position}
                              startIcon={<Save />}
                            >
                              {isLoading ? 'Creating...' : 'Create Profile'}
                            </GradientButton>
                          </Box>
                        </Grid>
                      )}
                    </>
                  )}
                </>
              )}

              {/* Trainer-specific fields */}
              {profileData.role === 'Trainer' && (
                <>
                  {!hasTrainerProfile && !showTrainerProfileCreation ? (
                    <Grid item xs={12}>
                      <Card sx={{ 
                        mt: 2, 
                        border: '2px dashed #2c67f2', 
                        backgroundColor: 'rgba(44, 103, 242, 0.02)',
                        borderRadius: 2 
                      }}>
                        <CardContent sx={{ textAlign: 'center', py: 4 }}>
                          <Typography variant="h6" sx={{ mb: 2, color: '#2c67f2', fontWeight: 600 }}>
                            Complete Your Trainer Profile
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                            Enhance your profile to attract more clients and showcase your expertise
                          </Typography>
                          <GradientButton
                            onClick={handleCreateTrainerProfile}
                            variant="contained"
                            sx={{ px: 4 }}
                          >
                            Create Trainer Profile
                          </GradientButton>
                        </CardContent>
                      </Card>
                    </Grid>
                  ) : (
                    <>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c67f2' }}>
                            Trainer Information
                          </Typography>
                          {hasTrainerProfile && (
                            <Typography variant="body2" sx={{ 
                              color: 'success.main', 
                              fontWeight: 500,
                              backgroundColor: 'rgba(76, 175, 80, 0.1)',
                              padding: '4px 12px',
                              borderRadius: '16px',
                              fontSize: '0.75rem'
                            }}>
                              Profile Complete
                            </Typography>
                          )}
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                      </Grid>

                      
                        <StyledTextField
                          fullWidth
                          id="bio"
                          label="Short Bio"
                          name="bio"
                          value={profileData.bio}
                          onChange={handleInputChange}
                          disabled={!isEditing && !showTrainerProfileCreation}
                          multiline
                          rows={3}
                          placeholder="Tell us about yourself"
                          required
                        />
                      

                     
                        <StyledTextField
                          fullWidth
                          id="specialization"
                          label="Specialization"
                          name="specialization"
                          value={profileData.specialization}
                          onChange={handleInputChange}
                          disabled={!isEditing && !showTrainerProfileCreation}
                          placeholder="e.g., Yoga, Personal Training, Nutrition"
                          required
                        />
                    

                      
                        <StyledTextField
                          fullWidth
                          id="certifications"
                          label="Certifications"
                          name="certifications"
                          multiline
                          value={profileData.certifications}
                          onChange={handleInputChange}
                          disabled={!isEditing && !showTrainerProfileCreation}
                          placeholder="List your relevant certifications"
                        />
                     

                      
                        <StyledTextField
                          fullWidth
                          id="company"
                          label="Company (if any)"
                          name="company"
                          value={profileData.company}
                          onChange={handleInputChange}
                          disabled={!isEditing && !showTrainerProfileCreation}
                          placeholder="Your affiliated company or organization"
                        />
                      

                      {showTrainerProfileCreation && (
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
                            <Button
                              variant="outlined"
                              onClick={handleCancelTrainerProfile}
                              sx={{ color: '#2c67f2', borderColor: '#2c67f2' }}
                            >
                              Cancel
                            </Button>
                            <GradientButton
                              onClick={handleSaveTrainerProfile}
                              disabled={isLoading || !profileData.bio || !profileData.specialization}
                              startIcon={<Save />}
                            >
                              {isLoading ? 'Creating...' : 'Create Profile'}
                            </GradientButton>
                          </Box>
                        </Grid>
                      )}
                    </>
                  )}
                </>
              )}

              {/* Change Password Button */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Lock />}
                    onClick={() => setPasswordDialogOpen(true)}
                    sx={{
                      color: '#2c67f2',
                      borderColor: '#2c67f2',
                      '&:hover': {
                        backgroundColor: 'rgba(44, 103, 242, 0.04)',
                        borderColor: '#2c67f2',
                      }
                    }}
                  >
                    Change Password
                  </Button>
                </Box>
              </Grid>

              {/* Save Button for mobile */}
              {isEditing && (
                <Grid item xs={12} sx={{ mt: 3, display: { md: 'none' } }}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={handleCancel}
                      sx={{ color: '#2c67f2', borderColor: '#2c67f2' }}
                    >
                      Cancel
                    </Button>
                    <GradientButton
                      type="submit"
                      variant="contained"
                      startIcon={<Save />}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </GradientButton>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        </CardContent>
      </ProfileCard>

      {/* Additional Information - Collapsed to keep viewport fit */}
      <Accordion defaultExpanded={false} sx={{ border: '1px solid #dadce0', borderRadius: 2, boxShadow: 'none', background: '#fff' }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#202124' }}>
            Account Information
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Member Since
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {formatMemberSinceDate(profileData.createdAt)}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Account Type
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {profileData.role}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Account Status
              </Typography>
              <Typography variant="body1" fontWeight={500} color="success.main">
                Active
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Email Verification
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body1" fontWeight={500} color={emailVerified ? 'success.main' : 'warning.main'}>
                  {emailVerified ? 'Verified' : 'Not Verified'}
                </Typography>
                {!emailVerified && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={openOtpDialog}
                    disabled={otpLoading}
                    sx={{ ml: 1, color: '#2c67f2', borderColor: '#2c67f2', textTransform: 'none' }}
                  >
                    {otpLoading ? 'Sending…' : 'Verify Email'}
                  </Button>
                )}
              </Box>
            </Grid>
            {profileData.role === 'Employer' && profileData.companyName && (
              <>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Company
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {profileData.companyName}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Position
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {profileData.position || 'Not specified'}
                  </Typography>
                </Grid>
              </>
            )}
            {profileData.role === 'Trainer' && profileData.specialization && (
              <>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Specialization
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {profileData.specialization}
                  </Typography>
                </Grid>
                {profileData.company && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Company/Organization
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {profileData.company}
                    </Typography>
                  </Grid>
                )}
              </>
            )}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Email Verification Dialog */}
      <Dialog 
        open={otpDialogOpen} 
        onClose={() => setOtpDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
          }
        }}
      >
        <DialogTitle>
          Verify Email
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter the 6-digit OTP sent to your registered email.
          </Typography>
          <StyledTextField
            fullWidth
            label="OTP"
            value={otpValue}
            onChange={(e) => setOtpValue(e.target.value.slice(0, 6))}
            inputProps={{ maxLength: 6 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setOtpDialogOpen(false)} sx={{ color: '#666' }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleVerifyEmail}
            disabled={otpLoading || !otpValue || otpValue.length !== 6}
            sx={{ background: '#4285F4', textTransform: 'none', boxShadow: 'none', '&:hover': { background: '#1a73e8' } }}
          >
            {otpLoading ? 'Verifying…' : 'Verify'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Password Change Dialog */}
      <Dialog 
        open={passwordDialogOpen} 
        onClose={handlePasswordDialogClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #62cff4 15%, #2c67f2 100%)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 0
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Lock />
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              Change Password
            </Typography>
          </Box>
          <IconButton
            onClick={handlePasswordDialogClose}
            sx={{ color: 'white' }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3 }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            Please enter your current password and choose a new secure password (minimum 6 characters).
          </Alert>
          
          <Box component="form" onSubmit={handlePasswordSave}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  name="currentPassword"
                  label="Current Password"
                  type={showPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
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
              </Grid>

              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  name="newPassword"
                  label="New Password"
                  type={showPassword ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  helperText="Password must be at least 6 characters long"
                />
              </Grid>

              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  name="confirmPassword"
                  label="Confirm New Password"
                  type={showPassword ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  error={passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword}
                  helperText={
                    passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword
                      ? "Passwords don't match"
                      : "" 
                  }
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={handlePasswordDialogClose}
            variant="outlined"
            sx={{ color: '#2c67f2', borderColor: '#2c67f2' }}
          >
            Cancel
          </Button>
          <GradientButton
            onClick={handlePasswordSave}
            disabled={passwordLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
            startIcon={<Save />}
          >
            {passwordLoading ? 'Changing...' : 'Change Password'}
          </GradientButton>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      </Container>
    </Page>
  );
};

export default UserProfile;
