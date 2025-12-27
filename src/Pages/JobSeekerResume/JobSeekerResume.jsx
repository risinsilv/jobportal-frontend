import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Chip,
  Avatar,
  LinearProgress,
  Paper,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  Edit,
  CloudUpload,
  Download,
  Visibility,
  ArrowBack,
  Phone,
  Email,
  LocationOn,
  Close,
  Delete,
} from '@mui/icons-material';
import { Assessment } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import instance from '../../Service/AxiosOrder';

// Print-specific styles for PDF optimization
const printStyles = `
  @media print {
    @page {
      size: A4;
      margin: 0;
    }
    html, body {
      background: #fff !important;
      color: #000 !important;
      font-size: 11px !important;
      line-height: 1.4 !important;
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      height: auto !important;
      min-height: 0 !important;
      font-family: 'Arial', 'Helvetica Neue', Arial, sans-serif !important;
      overflow: hidden !important;
    }
    /* Remove all backgrounds, gradients, and profile images */
    .MuiAvatar-root,
    [class*="ProfileBanner"],
    .MuiIconButton-root,
    .MuiButton-root:not(.print-button),
    .MuiLinearProgress-root,
    .MuiAlert-root,
    .MuiSnackbar-root {
      display: none !important;
    }
    .MuiContainer-root {
      max-width: none !important;
      width: 100% !important;
      margin: 0 !important;
      padding: 12px 16px 12px 16px !important; /* Reduce print padding */
      background: #fff !important;
      box-sizing: border-box !important;
      page-break-before: avoid !important;
      page-break-after: avoid !important;
      overflow: hidden !important;
      height: auto !important;
      min-height: 0 !important;
    }
    .MuiPaper-root,
    [class*="Section"],
    [class*="HeaderSection"],
    [class*="ProfileContent"] {
      background: #fff !important;
      border: 1px solid #e0e0e0 !important;
      box-shadow: none !important;
      border-radius: 6px !important;
      margin-bottom: 10px !important;
      padding: 10px 12px 8px 12px !important;
      page-break-inside: avoid !important;
      page-break-after: avoid !important;
    }
    .MuiTypography-h4 {
      font-size: 16px !important;
      font-weight: bold !important;
      margin-bottom: 8px !important;
      color: #000 !important;
      text-align: left !important;
    }
    .MuiTypography-h5 {
      font-size: 12px !important;
      font-weight: bold !important;
      margin-bottom: 6px !important;
      color: #000 !important;
      text-align: left !important;
    }
    .MuiTypography-h6 {
      font-size: 11px !important;
      font-weight: bold !important;
      margin-bottom: 4px !important;
      color: #000 !important;
      text-align: left !important;
    }
    .MuiTypography-body1, .MuiTypography-body2 {
      font-size: 10px !important;
      line-height: 1.3 !important;
      color: #000 !important;
      margin-bottom: 4px !important;
      text-align: left !important;
      white-space: pre-line !important;
      word-break: break-word !important;
    }
    .MuiChip-root {
      font-size: 9px !important;
      height: 16px !important;
      margin: 1px 2px 1px 0 !important;
      background: #fff !important;
      border: 1px solid #bbb !important;
      color: #000 !important;
      box-shadow: none !important;
    }
    .MuiTextField-root {
      margin-bottom: 6px !important;
      background: #fff !important;
    }
    .MuiDivider-root {
      margin: 6px 0 !important;
      border-color: #bbb !important;
    }
    .MuiBox-root {
      margin-bottom: 6px !important;
      padding: 0 !important;
      background: none !important;
      border: none !important;
      box-shadow: none !important;
    }
    /* Only allow page breaks inside sections if absolutely needed */
    .page-break-before { page-break-before: avoid !important; }
    .page-break-after { page-break-after: avoid !important; }
    .page-break-inside-avoid { page-break-inside: avoid !important; }
    /* Remove excessive whitespace from <br> */
    br { line-height: 1.1 !important; }
    /* REMOVE ALL TRUNCATION: show all content, no max-height, no line-clamp */
    .about-section, .experience-section, .education-section, .skills-section, .certifications-section {
      max-height: none !important;
      overflow: visible !important;
      text-overflow: initial !important;
      display: block !important;
      -webkit-line-clamp: unset !important;
      -webkit-box-orient: unset !important;
    }
  }
`;

// Inject print styles only once
if (typeof document !== 'undefined' && !document.getElementById('jobseeker-print-style')) {
  const styleElement = document.createElement('style');
  styleElement.textContent = printStyles;
  styleElement.id = 'jobseeker-print-style';
  document.head.appendChild(styleElement);
}

// Styled components - Minimal Google theme
const ResumeContainer = styled(Box)(({ theme }) => ({
  minHeight: 'calc(100vh - 64px)',
  background: '#ffffff',
  color: '#202124',
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  fontFamily: '"Google Sans"',
  '& *': { fontFamily: '"Google Sans" !important' },
  [theme.breakpoints.down('sm')]: {
    minHeight: 'calc(100vh - 56px)'
  }
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  background: '#ffffff',
  color: '#202124',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  position: 'relative',
  borderRadius: theme.spacing(2),
  border: '1px solid #dadce0',
  boxShadow: 'none',
}));

const ProfileBanner = styled(Box)(({ theme }) => ({
  height: 128,
  background: '#ffffff',
  borderRadius: `${theme.spacing(2)} ${theme.spacing(2)} 0 0`,
  borderBottom: '1px solid #dadce0',
  position: 'relative',
}));

const ProfileContent = styled(Box)(({ theme }) => ({
  background: '#ffffff',
  color: '#202124',
  paddingBottom: theme.spacing(3),
  position: 'relative',
  borderRadius: `0 0 ${theme.spacing(2)} ${theme.spacing(2)}`,
  border: '1px solid #dadce0',
  borderTop: '0',
  boxShadow: 'none',
}));

const Section = styled(Box)(({ theme }) => ({
  background: '#ffffff',
  color: '#202124',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(2),
  border: '1px solid #dadce0',
  boxShadow: 'none',
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

const EditButton = styled(Button)(({ theme }) => ({
  color: '#2c67f2',
  borderColor: '#2c67f2',
  backgroundColor: 'transparent',
  borderRadius: theme.spacing(1.5),
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '14px',
  padding: '6px 16px',
  border: '1px solid #2c67f2',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: 'rgba(44, 103, 242, 0.06)',
    borderColor: '#2c67f2',
    boxShadow: 'none',
  },
}));

const SaveButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#4285F4',
  color: 'white',
  borderRadius: theme.spacing(1.5),
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '14px',
  padding: '8px 24px',
  border: 'none',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#1a73e8',
    boxShadow: 'none',
  },
  '&:disabled': {
    backgroundColor: '#c6dafc',
    boxShadow: 'none',
  },
}));

const JobSeekerResume = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasJobSeekerProfile, setHasJobSeekerProfile] = useState(false);
  const [jobSeekerId, setJobSeekerId] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const objectUrlRef = useRef(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [createProfileDialogOpen, setCreateProfileDialogOpen] = useState(false);
  const [profileCreationStep, setProfileCreationStep] = useState(0);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  const [hasCvFile, setHasCvFile] = useState(false);
  // CV analysis state
  const [analyzingCv, setAnalyzingCv] = useState(false);
  const [cvAnalysisResult, setCvAnalysisResult] = useState(null);
  const [analysisDialogOpen, setAnalysisDialogOpen] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);

  // Profile creation form data
  const [profileFormData, setProfileFormData] = useState({
    title: '',
    address: '',
    profileSummary: '',
    skills: '',
    jobHistory: '',
    experience: '',
    certifications: '',
    education: '',
  });

  // Resume data state based on JobSeekers entity
  const [resumeData, setResumeData] = useState({
    title: '',
    address: '',
    resumeUrl: '',
    profileSummary: '',
    skills: '',
    jobHistory: '',
    experience: '',
    certifications: '',
    contactInfo: '',
    education: '',
  });

  // User data state - fetched from API
  const [userData, setUserData] = useState({
    id: null,
    name: '',
    email: '',
    phone: '',
    location: '',
    profilePic: null,
  });

  // Profile picture handling
  const [profilePreview, setProfilePreview] = useState(null);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    // Fetch user data and check for job seeker profile on component mount
    fetchUserData();
    checkJobSeekerProfile();
  }, []);

  useEffect(() => {
    // Check for CV file when job seeker profile is loaded
    if (hasJobSeekerProfile && userData.id) {
      checkCvFile();
    }
  }, [hasJobSeekerProfile, userData.id]);

  const fetchUserData = async () => {
    try {
      const userId = localStorage.getItem('user');
      const storedName = localStorage.getItem('name');
      
      if (userId) {
        console.log('Fetching user data for ID:', userId);
        const response = await instance.get(`/api/users/${userId}`);
        const userResponse = response.data;
        console.log('User data received:', userResponse);
        
        setUserData({
          id: userResponse.id || userId,
          name: userResponse.name || storedName || '',
          email: userResponse.email || '',
          phone: userResponse.phone || '',
          location: userResponse.location || '',
          profilePic: userResponse.profilePic || null,
        });
        // Fetch profile picture as blob via protected endpoint
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
          // Ignore; default avatar fallback will be shown
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (error.response?.status === 401) {
        setSnackbarMessage('Authentication failed. Please login again.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        navigate('/login');
      } else {
        setSnackbarMessage('Failed to load user data');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    }
  };

  const checkCvFile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !userData.id) return;

      const response = await instance.get(`/api/jobseekers/cv/${userData.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        setHasCvFile(true);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setHasCvFile(false);
      } else {
        console.error('Error checking CV file:', error);
      }
    }
  };

  const checkJobSeekerProfile = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setSnackbarMessage('Authentication required. Please login again.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        navigate('/login');
        return;
      }

      // Try to get job seeker profile by user ID
      const response = await instance.get(`/api/jobseekers/${localStorage.getItem('user')}`);

      if (response.data) {
        setHasJobSeekerProfile(true);
        setJobSeekerId(response.data.id);
        loadResumeData(response.data);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        // No job seeker profile exists
        setHasJobSeekerProfile(false);
        setCreateProfileDialogOpen(true);
      } else if (error.response?.status === 401) {
        setSnackbarMessage('Authentication failed. Please login again.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        navigate('/login');
      } else {
        setSnackbarMessage('Failed to load profile data');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadResumeData = (jobSeekerData) => {
    if (jobSeekerData) {
      setResumeData({
        title: jobSeekerData.title || '',
        address: jobSeekerData.address || '',
        resumeUrl: jobSeekerData.resumeUrl || '',
        profileSummary: jobSeekerData.profileSummary || '',
        skills: jobSeekerData.skills || '',
        jobHistory: jobSeekerData.jobHistory || '',
        experience: jobSeekerData.experience || '',
        certifications: jobSeekerData.certifications || '',
        contactInfo: jobSeekerData.contactInfo || '',
        education: jobSeekerData.education || '',
      });
    }
  };

  const createJobSeekerProfile = async () => {
    setIsLoading(true);
    try {

      // Build contact info only with available data
      const contactInfoParts = [];
      if (userData.email) contactInfoParts.push(`Email: ${userData.email}`);
      if (userData.phone) contactInfoParts.push(`Phone: ${userData.phone}`);
      if (userData.location) contactInfoParts.push(`Location: ${userData.location}`);

      const newJobSeekerData = {
        ...profileFormData,
        contactInfo: contactInfoParts.join('\n'),
        resumeUrl: '',
        userId: parseInt(localStorage.getItem('user')),
      };
      console.log('Creating job seeker profile with data:', newJobSeekerData);

      const response = await instance.post('/api/jobseekers', newJobSeekerData);

      if (response.data) {
        setHasJobSeekerProfile(true);
        setJobSeekerId(response.data.id);
        loadResumeData(response.data);
        setCreateProfileDialogOpen(false);
        setProfileCreationStep(0);
        setProfileFormData({
          title: '',
          address: '',
          profileSummary: '',
          skills: '',
          jobHistory: '',
          experience: '',
          certifications: '',
          education: '',
        });
        setSnackbarMessage('Job seeker profile created successfully!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('Error creating job seeker profile:', error);
      setSnackbarMessage('Failed to create job seeker profile');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileFormChange = (field) => (event) => {
    setProfileFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleNextStep = () => {
    if (profileCreationStep < 3) {
      setProfileCreationStep(prev => prev + 1);
    } else {
      createJobSeekerProfile();
    }
  };

  const handlePreviousStep = () => {
    if (profileCreationStep > 0) {
      setProfileCreationStep(prev => prev - 1);
    }
  };

  const handleCloseProfileDialog = () => {
    setCreateProfileDialogOpen(false);
    setProfileCreationStep(0);
    setProfileFormData({
      title: '',
      address: '',
      profileSummary: '',
      skills: '',
      jobHistory: '',
      experience: '',
      certifications: '',
      education: '',
    });
  };

  const handleInputChange = (field) => (event) => {
    setResumeData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setSnackbarMessage('Authentication required. Please login again.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        return;
      }

      if (!hasJobSeekerProfile || !jobSeekerId) {
        setSnackbarMessage('Job seeker profile not found. Please create a profile first.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        return;
      }
      console.log(resumeData)
      const response = await instance.put(`/api/jobseekers/${jobSeekerId}`, resumeData);

      if (response.data) {
        setSnackbarMessage('Resume updated successfully!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating resume:', error);
      if (error.response?.status === 401) {
        setSnackbarMessage('Authentication failed. Please login again.');
        navigate('/login');
      } else {
        setSnackbarMessage('Failed to update resume');
      }
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reload original data from the last saved state
    checkJobSeekerProfile();
  };

  const handleEdit = () => {
    if (!hasJobSeekerProfile) {
      setCreateProfileDialogOpen(true);
      return;
    }
    setIsEditing(true);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      setSnackbarMessage('Please select a PDF file only.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setSnackbarMessage('File size must be less than 5MB.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    setCvFile(file);
    await uploadCvFile(file);
  };

  const uploadCvFile = async (file) => {
    if (!jobSeekerId) {
      setSnackbarMessage('Job seeker profile not found.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    setUploadingCv(true);
    try {
      console.log("jobSeekerId:", jobSeekerId);
      const formData = new FormData();
      formData.append('cv', file);

      const endpoint = hasCvFile 
        ? `/api/jobseekers/update-cv/${jobSeekerId}`
        : `/api/jobseekers/upload-cv/${jobSeekerId}`;

      const response = await instance.post(endpoint, formData);

      if (response.status === 200) {
        setHasCvFile(true);
        setSnackbarMessage('Resume uploaded successfully!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        
        // Update resume data with file name
        setResumeData(prev => ({
          ...prev,
          resumeUrl: file.name
        }));
      }
    } catch (error) {
      console.error('Error uploading CV:', error);
      if (error.response?.status === 401) {
        setSnackbarMessage('Authentication failed. Please login again.');
        navigate('/login');
      } else {
        setSnackbarMessage('Failed to upload resume. Please try again.');
      }
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setUploadingCv(false);
    }
  };

  const downloadCvFile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await instance.get(`/api/jobseekers/cv/${userData.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        responseType: 'blob',
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `resume_${userData.name || 'user'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setSnackbarMessage('Resume downloaded successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error downloading CV:', error);
      if (error.response?.status === 404) {
        setSnackbarMessage('No resume file found.');
      } else if (error.response?.status === 401) {
        setSnackbarMessage('Authentication failed. Please login again.');
        navigate('/login');
      } else {
        setSnackbarMessage('Failed to download resume.');
      }
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const deleteCvFile = async () => {
    if (!window.confirm('Are you sure you want to delete your resume file?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await instance.delete(`/api/jobseekers/cv/${userData.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 204) {
        setHasCvFile(false);
        setCvFile(null);
        setResumeData(prev => ({
          ...prev,
          resumeUrl: ''
        }));
        setSnackbarMessage('Resume file deleted successfully!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('Error deleting CV:', error);
      if (error.response?.status === 401) {
        setSnackbarMessage('Authentication failed. Please login again.');
        navigate('/login');
      } else {
        setSnackbarMessage('Failed to delete resume file.');
      }
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  // Analyze CV (send only user ID)
  const analyzeCv = async () => {
    if (!userData.id) return;
    setAnalyzingCv(true);
    setAnalysisError(null);
    try {
      const response = await instance.get(`/api/analyze/${userData.id}`);
      console.log(response.data);
      setCvAnalysisResult(response.data);
      setAnalysisDialogOpen(true);
    } catch (error) {
      console.error('Error analyzing CV:', error);
      setAnalysisError('Failed to analyze resume. Try again later.');
      setSnackbarMessage('Resume analysis failed');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setAnalyzingCv(false);
    }
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleAvatarError = () => {
    setAvatarError(true);
  };

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, []);

  const getAvatarContent = () => {
    if (profilePreview && !avatarError) {
      return (
        <Avatar 
          src={profilePreview} 
          sx={{ 
            width: 150, 
            height: 150, 
            position: 'absolute',
            top: -75,
            left: 24,
            border: '4px solid white',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }} 
          onError={handleAvatarError} 
        />
      );
    }
    return (
      <Avatar 
        sx={{ 
          width: 150, 
          height: 150, 
          position: 'absolute',
          top: -75,
          left: 24,
          fontSize: '3rem', 
          bgcolor: '#2c67f2',
          border: '4px solid white',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}
      >
        {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
      </Avatar>
    );
  };

  return (
    <ResumeContainer>
      <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 }, maxWidth: 'none', width: '100%' }}>
        {/* Loading State */}
        {isLoading && !hasJobSeekerProfile && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <CircularProgress size={50} />
            <Typography variant="h6" sx={{ ml: 2 }}>
              Loading profile...
            </Typography>
          </Box>
        )}

        {/* No Profile Message */}
        {!isLoading && !hasJobSeekerProfile && !createProfileDialogOpen && (
          <Paper
            sx={{
              p: 6,
              textAlign: 'center',
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              borderRadius: 3,
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography variant="h5" fontWeight="600" gutterBottom>
              No Job Seeker Profile Found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              You need to create a job seeker profile to manage your resume and apply for jobs.
            </Typography>
            <SaveButton onClick={() => setCreateProfileDialogOpen(true)}>
              Create Job Seeker Profile
            </SaveButton>
          </Paper>
        )}

        {/* Profile Content - Only show if profile exists */}
        {hasJobSeekerProfile && (
          <>
            {/* Header with Banner and Profile */}
            <HeaderSection>
          <ProfileBanner>
            <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
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
            </Box>
          </ProfileBanner>
          
          <ProfileContent>
            {/* Profile Picture and Basic Info */}
            <Box sx={{ position: 'relative', pt: 3 }}>
              {getAvatarContent()}
              
              <Box sx={{ ml: 20, pt: 10 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="600" sx={{ color: '#000', mb: 0.5 }}>
                      {userData.name || 'User Name'}
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#666', mb: 1, fontWeight: 400 }}>
                      {resumeData.title || 'Job Title'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                      {resumeData.address || userData.location || ''}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#0073b1' }}>
                      {[userData.email, userData.phone].filter(Boolean).join(' • ') || 'Contact info'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {!isEditing ? (
                      <>
                        <EditButton
                          variant="outlined"
                          startIcon={<Visibility />}
                          onClick={() => setPreviewDialogOpen(true)}
                          disabled={!hasJobSeekerProfile}
                        >
                          Preview
                        </EditButton>
                        <EditButton
                          variant="outlined"
                          startIcon={<Edit />}
                          onClick={handleEdit}
                        >
                          {hasJobSeekerProfile ? 'Edit profile' : 'Create profile'}
                        </EditButton>
                      </>
                    ) : (
                      <>
                        <EditButton
                          variant="outlined"
                          onClick={handleCancel}
                          disabled={isLoading}
                        >
                          Cancel
                        </EditButton>
                        <SaveButton
                          variant="contained"
                          onClick={handleSave}
                          disabled={isLoading}
                        >
                          {isLoading ? 'Saving...' : 'Save'}
                        </SaveButton>
                      </>
                    )}
                  </Box>
                </Box>
                
                {isLoading && (
                  <LinearProgress 
                    sx={{ 
                      mt: 2, 
                      backgroundColor: '#e6e6e6',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#0073b1'
                      }
                    }} 
                  />
                )}
              </Box>
            </Box>
          </ProfileContent>
        </HeaderSection>

        {/* Profile Title & Address Section */}
        <Section>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" fontWeight="600" sx={{ color: '#000' }}>
              Professional Details
            </Typography>
            {!isEditing && (
              <IconButton size="small" onClick={handleEdit} disabled={!hasJobSeekerProfile}>
                <Edit fontSize="small" />
              </IconButton>
            )}
          </Box>
          
          {isEditing ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <StyledTextField
                fullWidth
                value={resumeData.title}
                onChange={handleInputChange('title')}
                placeholder="e.g., Software Engineer, Project Manager, Data Analyst..."
                variant="outlined"
                label="Professional Title"
              />
              <StyledTextField
                fullWidth
                multiline
                rows={2}
                value={resumeData.address}
                onChange={handleInputChange('address')}
                placeholder="Enter your full address..."
                variant="outlined"
                label="Address"
              />
            </Box>
          ) : (
            <Box>
              <Typography variant="body1" sx={{ color: '#000', lineHeight: 1.6, mb: 1 }}>
                <strong>Title:</strong> {resumeData.title || 'Add your professional title'}
              </Typography>
              <Typography variant="body1" sx={{ color: '#000', lineHeight: 1.6 }}>
                <strong>Address:</strong> {resumeData.address || 'Add your address'}
              </Typography>
            </Box>
          )}
        </Section>

        {/* About Section */}
        <Section className="page-break-inside-avoid about-section">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" fontWeight="600" sx={{ color: '#000' }}>
              About
            </Typography>
            {!isEditing && (
              <IconButton size="small" onClick={handleEdit} disabled={!hasJobSeekerProfile}>
                <Edit fontSize="small" />
              </IconButton>
            )}
          </Box>
          
          {isEditing ? (
            <StyledTextField
              fullWidth
              multiline
              rows={4}
              value={resumeData.profileSummary}
              onChange={handleInputChange('profileSummary')}
              placeholder="Write a summary about yourself..."
              variant="outlined"
            />
          ) : (
            <Typography variant="body1" sx={{ color: '#000', lineHeight: 1.6 }}>
              {resumeData.profileSummary || 'Add a summary about yourself to help others understand your background and interests.'}
            </Typography>
          )}
        </Section>

        {/* Experience Section */}
        <Section className="page-break-inside-avoid experience-section">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" fontWeight="600" sx={{ color: '#000' }}>
              Experience
            </Typography>
            {!isEditing && (
              <IconButton size="small" onClick={handleEdit} disabled={!hasJobSeekerProfile}>
                <Edit fontSize="small" />
              </IconButton>
            )}
          </Box>
          
          {isEditing ? (
            <StyledTextField
              fullWidth
              multiline
              rows={6}
              value={resumeData.jobHistory}
              onChange={handleInputChange('jobHistory')}
              placeholder="Describe your work experience..."
              variant="outlined"
            />
          ) : (
            <Typography variant="body1" sx={{ color: '#000', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
              {resumeData.jobHistory || 'Add your work experience to showcase your professional background.'}
            </Typography>
          )}
        </Section>

        {/* Education Section */}
        <Section className="page-break-inside-avoid education-section">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" fontWeight="600" sx={{ color: '#000' }}>
              Education
            </Typography>
            {!isEditing && (
              <IconButton size="small" onClick={handleEdit} disabled={!hasJobSeekerProfile}>
                <Edit fontSize="small" />
              </IconButton>
            )}
          </Box>
          
          {isEditing ? (
            <StyledTextField
              fullWidth
              multiline
              rows={4}
              value={resumeData.education}
              onChange={handleInputChange('education')}
              placeholder="Add your educational background..."
              variant="outlined"
            />
          ) : (
            <Typography variant="body1" sx={{ color: '#000', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
              {resumeData.education || 'Add your educational background.'}
            </Typography>
          )}
        </Section>

        {/* Skills Section */}
        <Section className="page-break-inside-avoid skills-section">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" fontWeight="600" sx={{ color: '#000' }}>
              Skills
            </Typography>
            {!isEditing && (
              <IconButton size="small" onClick={handleEdit} disabled={!hasJobSeekerProfile}>
                <Edit fontSize="small" />
              </IconButton>
            )}
          </Box>
          
          {isEditing ? (
            <StyledTextField
              fullWidth
              multiline
              rows={3}
              value={resumeData.skills}
              onChange={handleInputChange('skills')}
              placeholder="List your skills..."
              variant="outlined"
            />
          ) : (
            <Box>
              {resumeData.skills ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {resumeData.skills.split(',').map((skill, index) => (
                    <Chip 
                      key={index}
                      label={skill.trim()} 
                      variant="outlined"
                      sx={{ 
                        borderColor: '#e6e6e6',
                        backgroundColor: '#f3f2ef',
                        '&:hover': {
                          backgroundColor: '#e6e6e6',
                        }
                      }}
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body1" sx={{ color: '#666' }}>
                  Add skills to showcase your expertise.
                </Typography>
              )}
            </Box>
          )}
        </Section>

        {/* Certifications Section */}
        <Section className="page-break-inside-avoid certifications-section">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" fontWeight="600" sx={{ color: '#000' }}>
              Licenses & Certifications
            </Typography>
            {!isEditing && (
              <IconButton size="small" onClick={handleEdit} disabled={!hasJobSeekerProfile}>
                <Edit fontSize="small" />
              </IconButton>
            )}
          </Box>
          
          {isEditing ? (
            <StyledTextField
              fullWidth
              multiline
              rows={4}
              value={resumeData.certifications}
              onChange={handleInputChange('certifications')}
              placeholder="List your certifications..."
              variant="outlined"
            />
          ) : (
            <Typography variant="body1" sx={{ color: '#000', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
              {resumeData.certifications || 'Add your professional certifications and licenses.'}
            </Typography>
          )}
        </Section>

        {/* Contact Information Section */}
        <Section>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" fontWeight="600" sx={{ color: '#000' }}>
              Contact Information
            </Typography>
            {!isEditing && (
              <IconButton size="small" onClick={handleEdit} disabled={!hasJobSeekerProfile}>
                <Edit fontSize="small" />
              </IconButton>
            )}
          </Box>
          
          {isEditing ? (
            <StyledTextField
              fullWidth
              multiline
              rows={4}
              value={resumeData.contactInfo}
              onChange={handleInputChange('contactInfo')}
              placeholder="Add your contact information..."
              variant="outlined"
            />
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {userData.email && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email fontSize="small" sx={{ color: '#666' }} />
                  <Typography variant="body2" sx={{ color: '#000' }}>{userData.email}</Typography>
                </Box>
              )}
              {userData.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone fontSize="small" sx={{ color: '#666' }} />
                  <Typography variant="body2" sx={{ color: '#000' }}>{userData.phone}</Typography>
                </Box>
              )}
              {userData.location && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn fontSize="small" sx={{ color: '#666' }} />
                  <Typography variant="body2" sx={{ color: '#000' }}>{userData.location}</Typography>
                </Box>
              )}
              {!userData.email && !userData.phone && !userData.location && !resumeData.contactInfo && (
                <Typography variant="body2" sx={{ color: '#666', fontStyle: 'italic' }}>
                  No contact information available. Please update your profile.
                </Typography>
              )}
              {resumeData.contactInfo && (
                <Typography variant="body2" sx={{ color: '#000', mt: 1, whiteSpace: 'pre-line' }}>
                  {resumeData.contactInfo}
                </Typography>
              )}
            </Box>
          )}
        </Section>

        {/* Resume File Section */}
        <Section>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" fontWeight="600" sx={{ color: '#000' }}>
              Resume File (PDF)
            </Typography>
            {hasCvFile && (
              <EditButton
                onClick={analyzeCv}
                disabled={analyzingCv}
                startIcon={analyzingCv ? <CircularProgress size={16} /> : <Assessment />}
                sx={{ ml: 'auto' }}
              >
                {analyzingCv ? 'Analyzing...' : 'Analyze Resume'}
              </EditButton>
            )}
          </Box>
          
          {hasCvFile ? (
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <EditButton
                startIcon={<Download />}
                onClick={downloadCvFile}
                disabled={uploadingCv}
              >
                Download Resume
              </EditButton>
              <EditButton
                startIcon={<Visibility />}
                onClick={downloadCvFile}
                disabled={uploadingCv}
              >
                View Resume
              </EditButton>
              {isEditing && (
                <EditButton
                  color="error"
                  onClick={deleteCvFile}
                  disabled={uploadingCv}
                  sx={{ 
                    color: '#d32f2f',
                    borderColor: 'rgba(211, 47, 47, 0.5)',
                    '&:hover': {
                      backgroundColor: 'rgba(211, 47, 47, 0.08)',
                      borderColor: '#d32f2f',
                    }
                  }}
                >
                  Delete
                </EditButton>
              )}
            </Box>
          ) : (
            <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
              No resume file uploaded
            </Typography>
          )}

          {(isEditing || !hasCvFile) && (
            <Box>
              <input
                accept=".pdf"
                style={{ display: 'none' }}
                id="resume-upload"
                type="file"
                onChange={handleFileUpload}
                disabled={uploadingCv}
              />
              <label htmlFor="resume-upload">
                <EditButton
                  component="span"
                  startIcon={uploadingCv ? <CircularProgress size={16} /> : <CloudUpload />}
                  disabled={uploadingCv}
                >
                  {uploadingCv ? 'Uploading...' : hasCvFile ? 'Replace Resume' : 'Upload Resume (PDF only)'}
                </EditButton>
              </label>
              {!hasCvFile && (
                <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#666' }}>
                  Maximum file size: 5MB. PDF format only.
                </Typography>
              )}
            </Box>
          )}
        </Section>
        {/* CV Analysis Result Dialog */}
        <Dialog
          open={analysisDialogOpen}
          onClose={() => setAnalysisDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              backgroundColor: 'rgba(255,255,255,0.95)'
            }
          }}
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Assessment sx={{ color: '#0073b1' }} />
              <Typography variant="h6" fontWeight={600}>Resume Analysis Feedback</Typography>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            {analysisError && (
              <Alert severity="error" sx={{ mb: 2 }}>{analysisError}</Alert>
            )}
            {!analysisError && (
              <Typography variant="body2" sx={{ whiteSpace: 'pre-line', color: '#000' }}>
                {cvAnalysisResult || 'No feedback returned.'}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAnalysisDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
        </>
        )}

        {/* Create Job Seeker Profile Dialog */}
        <Dialog
          open={createProfileDialogOpen}
          onClose={handleCloseProfileDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
              minHeight: '500px',
            }
          }}
        >
          <DialogTitle sx={{ 
            background: '#ffffff',
            color: '#202124',
            borderRadius: '16px 16px 0 0',
            textAlign: 'center',
            position: 'relative',
            borderBottom: '1px solid #dadce0',
          }}>
            <Typography variant="h6" fontWeight="bold">
              Create Your Job Seeker Profile
            </Typography>
            <Typography variant="body2" sx={{ color: '#5f6368', mt: 0.5 }}>
              Step {profileCreationStep + 1} of 4
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Stepper activeStep={profileCreationStep} alternativeLabel>
                {['Info', 'Experience', 'Education & Skills', 'Certifications'].map((label) => (
                  <Step key={label}>
                    <StepLabel sx={{ '& .MuiStepLabel-label': { fontSize: '0.85rem' } }}>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          </DialogTitle>
          
          <DialogContent sx={{ p: 4 }}>
            {/* Step 0: Basic Info, Title, Address & About */}
            {profileCreationStep === 0 && (
              <Box sx={{
                animation: 'slideUp 0.3s ease-out',
                '@keyframes slideUp': {
                  from: { opacity: 0, transform: 'translateY(12px)' },
                  to: { opacity: 1, transform: 'translateY(0)' }
                }
              }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Professional Information
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Start with your basic professional details and a summary about yourself.
                </Typography>
                
                <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
                  Professional Title
                </Typography>
                <StyledTextField
                  fullWidth
                  value={profileFormData.title}
                  onChange={handleProfileFormChange('title')}
                  placeholder="e.g., Software Engineer, Project Manager, Data Analyst..."
                  variant="outlined"
                  sx={{ mb: 3 }}
                />

                <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
                  Address
                </Typography>
                <StyledTextField
                  fullWidth
                  multiline
                  rows={2}
                  value={profileFormData.address}
                  onChange={handleProfileFormChange('address')}
                  placeholder="Enter your full address..."
                  variant="outlined"
                  sx={{ mb: 3 }}
                />

                <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
                  About Yourself
                </Typography>
                <StyledTextField
                  fullWidth
                  multiline
                  rows={4}
                  value={profileFormData.profileSummary}
                  onChange={handleProfileFormChange('profileSummary')}
                  placeholder="e.g., Experienced professional with expertise in your field. Passionate about delivering quality results and contributing to team success..."
                  variant="outlined"
                />
              </Box>
            )}

            {/* Step 1: Experience & Job History */}
            {profileCreationStep === 1 && (
              <Box sx={{
                animation: 'slideUp 0.3s ease-out'
              }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Your Work Experience
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  List your work experience, including job titles, companies, and key achievements.
                </Typography>
                <StyledTextField
                  fullWidth
                  multiline
                  rows={8}
                  value={profileFormData.jobHistory}
                  onChange={handleProfileFormChange('jobHistory')}
                  placeholder="e.g., Senior Position at Company Name (2022-Present)&#10;• Key achievement or responsibility&#10;• Management or technical accomplishment&#10;&#10;Previous Position at Previous Company (2020-2022)&#10;• Notable project or contribution"
                  variant="outlined"
                />
              </Box>
            )}

            {/* Step 2: Education & Skills */}
            {profileCreationStep === 2 && (
              <Box sx={{
                animation: 'slideUp 0.3s ease-out'
              }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Education & Skills
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Add your educational background and professional skills.
                </Typography>
                
                <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
                  Education
                </Typography>
                <StyledTextField
                  fullWidth
                  multiline
                  rows={4}
                  value={profileFormData.education}
                  onChange={handleProfileFormChange('education')}
                  placeholder="e.g., Degree Name in Field of Study&#10;University Name (Start Year - End Year)&#10;GPA: (if applicable)"
                  variant="outlined"
                  sx={{ mb: 3 }}
                />

                <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
                  Skills (comma-separated)
                </Typography>
                <StyledTextField
                  fullWidth
                  multiline
                  rows={3}
                  value={profileFormData.skills}
                  onChange={handleProfileFormChange('skills')}
                  placeholder="e.g., Programming Languages, Frameworks, Tools, Soft Skills"
                  variant="outlined"
                />
              </Box>
            )}

            {/* Step 3: Certifications & Final Review */}
            {profileCreationStep === 3 && (
              <Box sx={{
                animation: 'slideUp 0.3s ease-out'
              }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Certifications & Review
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Add any professional certifications or licenses you have earned.
                </Typography>
                
                <StyledTextField
                  fullWidth
                  multiline
                  rows={4}
                  value={profileFormData.certifications}
                  onChange={handleProfileFormChange('certifications')}
                  placeholder="e.g., Professional Certification Name&#10;Industry-Specific Certification&#10;Project Management Certification"
                  variant="outlined"
                  sx={{ mb: 3 }}
                />

                <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
                  Profile Summary
                </Typography>
                <Paper sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    Once created, you'll be able to edit all sections, upload your resume file, and apply for jobs.
                  </Typography>
                </Paper>
              </Box>
            )}
          </DialogContent>
          
          <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
            <Box>
              {profileCreationStep > 0 && (
                <EditButton onClick={handlePreviousStep}>
                  Previous
                </EditButton>
              )}
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <EditButton onClick={handleCloseProfileDialog}>
                Cancel
              </EditButton>
              <SaveButton 
                onClick={handleNextStep} 
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : profileCreationStep === 3 ? 'Create Profile' : 'Next'}
              </SaveButton>
            </Box>
          </DialogActions>
        </Dialog>

        {/* Preview Dialog */}
        <Dialog
          open={previewDialogOpen}
          onClose={() => setPreviewDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              maxHeight: '90vh',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
            }
          }}
        >
          <DialogTitle sx={{ 
            background: 'linear-gradient(135deg, #0073b1 0%, #005885 100%)',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: '12px 12px 0 0',
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
          }}>
            <Typography variant="h6" fontWeight="bold" sx={{ position: 'relative', zIndex: 1 }}>
              Resume Preview
            </Typography>
            <IconButton 
              onClick={() => setPreviewDialogOpen(false)} 
              sx={{ 
                color: 'white', 
                position: 'relative', 
                zIndex: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ 
            p: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(15px)',
          }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {userData.name || 'User Name'}
            </Typography>
            <Typography variant="h6" color="primary" gutterBottom>
              {resumeData.title || 'Job Title'}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {[userData.email, userData.phone, resumeData.address || userData.location].filter(Boolean).join(' | ') || 'Contact information not available'}
            </Typography>
            
            {(resumeData.title || resumeData.address) && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                  Professional Details
                </Typography>
                {resumeData.title && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Title:</strong> {resumeData.title}
                  </Typography>
                )}
                {resumeData.address && (
                  <Typography variant="body2">
                    <strong>Address:</strong> {resumeData.address}
                  </Typography>
                )}
              </Box>
            )}
            
            {resumeData.profileSummary && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                  About
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                  {resumeData.profileSummary}
                </Typography>
              </Box>
            )}
            
            {resumeData.jobHistory && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                  Experience
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                  {resumeData.jobHistory}
                </Typography>
              </Box>
            )}
            
            {resumeData.education && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                  Education
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                  {resumeData.education}
                </Typography>
              </Box>
            )}
            
            {resumeData.skills && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                  Skills
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                  {resumeData.skills}
                </Typography>
              </Box>
            )}
            
            {resumeData.certifications && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                  Certifications
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                  {resumeData.certifications}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPreviewDialogOpen(false)}>Close</Button>
            <SaveButton onClick={() => window.print()}>
              Print/Save as PDF
            </SaveButton>
          </DialogActions>
        </Dialog>

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
    </ResumeContainer>
  );
};

export default JobSeekerResume;
