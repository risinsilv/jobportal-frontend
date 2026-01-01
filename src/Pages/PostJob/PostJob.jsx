import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Snackbar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Collapse,
  IconButton,
} from '@mui/material';
import { ExpandMore, Add, Delete } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import instance from '../../Service/AxiosOrder';
import '@fontsource/open-sans';

const Page = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: '100vh',
  color: '#202124',
  fontFamily: '"Google Sans"',
  '& *': {
    fontFamily: '"Google Sans" !important',
  },
}));

const PostJob = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
    currency: '',
    experienceLevel: '',
    jobType: '',
    workplaceType: '',
    responsibilities: [''],
    requirements: [''],
    niceToHave: [''],
    other: '',
    status: 'Open',
  });

  const [errors, setErrors] = useState({});
  
  // Collapsible sections state
  const [expandedSections, setExpandedSections] = useState({
    requirements: false,
    responsibilities: false,
    niceToHave: false,
    other: false,
    jobDetails: false,
    salary: false,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleInputChange = (field) => (event) => {
    setJobData(prev => ({
      ...prev,
      [field]: event.target.value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Handle point-by-point array fields
  const handleArrayFieldChange = (field, index) => (event) => {
    const newArray = [...jobData[field]];
    newArray[index] = event.target.value;
    setJobData(prev => ({
      ...prev,
      [field]: newArray
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const addArrayField = (field) => {
    setJobData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field, index) => {
    const newArray = jobData[field].filter((_, i) => i !== index);
    // Ensure at least one field remains
    if (newArray.length === 0) {
      newArray.push('');
    }
    setJobData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!jobData.title.trim() || jobData.title.length < 3) {
      newErrors.title = 'Job title is required (min 3 characters)';
    }
    if (!jobData.description.trim()) {
      newErrors.description = 'Job description is required';
    }
    if (!jobData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    const nonEmptyRequirements = jobData.requirements.filter(r => r.trim());
    if (nonEmptyRequirements.length === 0) {
      newErrors.requirements = 'At least one requirement is required';
    }

    // Salary validation
    if (jobData.salaryMin || jobData.salaryMax) {
      const min = parseFloat(jobData.salaryMin);
      const max = parseFloat(jobData.salaryMax);
      
      if (jobData.salaryMin && isNaN(min)) {
        newErrors.salaryMin = 'Invalid salary minimum';
      }
      if (jobData.salaryMax && isNaN(max)) {
        newErrors.salaryMax = 'Invalid salary maximum';
      }
      if (!isNaN(min) && !isNaN(max) && min > max) {
        newErrors.salaryMin = 'Minimum salary cannot exceed maximum';
      }
      if ((jobData.salaryMin || jobData.salaryMax) && !jobData.currency) {
        newErrors.currency = 'Currency is required when salary is specified';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setSnackbarMessage('Please fix the errors in the form');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    setIsLoading(true);
    try {
      const userId = localStorage.getItem('user');
      if (!userId) {
        setSnackbarMessage('Authentication required. Please login again.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        setIsLoading(false);
        return;
      }

      const jobPostingData = {
        employerId: parseInt(userId),
        title: jobData.title,
        description: jobData.description,
        location: jobData.location,
        requirements: jobData.requirements.filter(r => r.trim()).join('\n• '),
        status: jobData.status,
      };

      // Add optional fields only if they have values
      if (jobData.salaryMin) jobPostingData.salaryMin = parseFloat(jobData.salaryMin);
      if (jobData.salaryMax) jobPostingData.salaryMax = parseFloat(jobData.salaryMax);
      if (jobData.currency) jobPostingData.currency = jobData.currency;
      if (jobData.experienceLevel) jobPostingData.experienceLevel = jobData.experienceLevel;
      if (jobData.jobType) jobPostingData.jobType = jobData.jobType;
      if (jobData.workplaceType) jobPostingData.workplaceType = jobData.workplaceType;
      
      const nonEmptyResponsibilities = jobData.responsibilities.filter(r => r.trim());
      if (nonEmptyResponsibilities.length > 0) {
        jobPostingData.responsibilities = nonEmptyResponsibilities.join('\n• ');
      }
      
      const nonEmptyNiceToHave = jobData.niceToHave.filter(r => r.trim());
      if (nonEmptyNiceToHave.length > 0) {
        jobPostingData.niceToHave = nonEmptyNiceToHave.join('\n• ');
      }
      
      if (jobData.other) jobPostingData.other = jobData.other;
9
      const response = await instance.post('/api/jobpostings', jobPostingData);

      setSnackbarMessage('Job posted successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setIsLoading(false);

      setTimeout(() => {
        navigate('/Home');
      }, 2000);

    } catch (error) {
      console.error('Error posting job:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to post job. Please try again.';
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Page>
      <Box sx={{ width: '90%', maxWidth: '1400px', margin: '0 auto', py: 5 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, color: '#202124' }}>
            Post a New Job
          </Typography>
          <Typography variant="body1" sx={{ color: '#5f6368' }}>
            Fill in the details below to create a job posting
          </Typography>
        </Box>

        {/* Form */}
        <Box sx={{ border: '1px solid #dadce0', borderRadius: 2, p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Row 1: Title */}
          <Box>
            <TextField
              fullWidth
              label="Job Title *"
              value={jobData.title}
              onChange={handleInputChange('title')}
              error={!!errors.title}
              helperText={errors.title}
              placeholder="e.g. Senior Software Engineer"
            />
          </Box>

          {/* Row 2: Location */}
          <Box>
            <TextField
              fullWidth
              label="Location *"
              value={jobData.location}
              onChange={handleInputChange('location')}
              error={!!errors.location}
              helperText={errors.location}
              placeholder="e.g. San Francisco, CA or Remote"
            />
          </Box>

          {/* Row 3: Description */}
          <Box>
            <TextField
              fullWidth
              multiline
              rows={8}
              label="Job Description *"
              value={jobData.description}
              onChange={handleInputChange('description')}
              error={!!errors.description}
              helperText={errors.description}
              placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
            />
          </Box>

          {/* Row 4: Requirements - Collapsible */}
          <Box sx={{ border: '1px solid #dadce0', borderRadius: 1 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                p: 2,
                cursor: 'pointer',
                '&:hover': { bgcolor: '#f8f9fa' }
              }}
              onClick={() => toggleSection('requirements')}
            >
              <Typography sx={{ fontWeight: 500, color: '#202124' }}>
                Requirements *
              </Typography>
              <IconButton 
                size="small"
                sx={{ 
                  transform: expandedSections.requirements ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s'
                }}
              >
                <ExpandMore />
              </IconButton>
            </Box>
            <Collapse in={expandedSections.requirements}>
              <Box sx={{ p: 2, pt: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {jobData.requirements.map((req, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                    <TextField
                      fullWidth
                      value={req}
                      onChange={handleArrayFieldChange('requirements', index)}
                      placeholder={`Requirement ${index + 1}...`}
                      multiline
                      maxRows={3}
                    />
                    <IconButton
                      onClick={() => removeArrayField('requirements', index)}
                      disabled={jobData.requirements.length === 1}
                      sx={{ mt: 0.5 }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  startIcon={<Add />}
                  onClick={() => addArrayField('requirements')}
                  sx={{ 
                    alignSelf: 'flex-start',
                    textTransform: 'none',
                    color: '#4285F4'
                  }}
                >
                  Add Requirement
                </Button>
                {errors.requirements && (
                  <Typography sx={{ color: '#d32f2f', fontSize: '0.75rem', mt: 0.5 }}>
                    {errors.requirements}
                  </Typography>
                )}
              </Box>
            </Collapse>
          </Box>

          {/* Row 5: Responsibilities - Collapsible */}
          <Box sx={{ border: '1px solid #dadce0', borderRadius: 1 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                p: 2,
                cursor: 'pointer',
                '&:hover': { bgcolor: '#f8f9fa' }
              }}
              onClick={() => toggleSection('responsibilities')}
            >
              <Typography sx={{ fontWeight: 500, color: '#202124' }}>
                Responsibilities (Optional)
              </Typography>
              <IconButton 
                size="small"
                sx={{ 
                  transform: expandedSections.responsibilities ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s'
                }}
              >
                <ExpandMore />
              </IconButton>
            </Box>
            <Collapse in={expandedSections.responsibilities}>
              <Box sx={{ p: 2, pt: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {jobData.responsibilities.map((resp, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                    <TextField
                      fullWidth
                      value={resp}
                      onChange={handleArrayFieldChange('responsibilities', index)}
                      placeholder={`Responsibility ${index + 1}...`}
                      multiline
                      maxRows={3}
                    />
                    <IconButton
                      onClick={() => removeArrayField('responsibilities', index)}
                      disabled={jobData.responsibilities.length === 1}
                      sx={{ mt: 0.5 }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  startIcon={<Add />}
                  onClick={() => addArrayField('responsibilities')}
                  sx={{ 
                    alignSelf: 'flex-start',
                    textTransform: 'none',
                    color: '#4285F4'
                  }}
                >
                  Add Responsibility
                </Button>
              </Box>
            </Collapse>
          </Box>

          {/* Row 6: Nice to Have - Collapsible */}
          <Box sx={{ border: '1px solid #dadce0', borderRadius: 1 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                p: 2,
                cursor: 'pointer',
                '&:hover': { bgcolor: '#f8f9fa' }
              }}
              onClick={() => toggleSection('niceToHave')}
            >
              <Typography sx={{ fontWeight: 500, color: '#202124' }}>
                Nice to Have (Optional)
              </Typography>
              <IconButton 
                size="small"
                sx={{ 
                  transform: expandedSections.niceToHave ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s'
                }}
              >
                <ExpandMore />
              </IconButton>
            </Box>
            <Collapse in={expandedSections.niceToHave}>
              <Box sx={{ p: 2, pt: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {jobData.niceToHave.map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                    <TextField
                      fullWidth
                      value={item}
                      onChange={handleArrayFieldChange('niceToHave', index)}
                      placeholder={`Nice to have ${index + 1}...`}
                      multiline
                      maxRows={3}
                    />
                    <IconButton
                      onClick={() => removeArrayField('niceToHave', index)}
                      disabled={jobData.niceToHave.length === 1}
                      sx={{ mt: 0.5 }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  startIcon={<Add />}
                  onClick={() => addArrayField('niceToHave')}
                  sx={{ 
                    alignSelf: 'flex-start',
                    textTransform: 'none',
                    color: '#4285F4'
                  }}
                >
                  Add Nice to Have
                </Button>
              </Box>
            </Collapse>
          </Box>

          {/* Row 7: Other Information - Collapsible */}
          <Box sx={{ border: '1px solid #dadce0', borderRadius: 1 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                p: 2,
                cursor: 'pointer',
                '&:hover': { bgcolor: '#f8f9fa' }
              }}
              onClick={() => toggleSection('other')}
            >
              <Typography sx={{ fontWeight: 500, color: '#202124' }}>
                Other Information (Optional)
              </Typography>
              <IconButton 
                size="small"
                sx={{ 
                  transform: expandedSections.other ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s'
                }}
              >
                <ExpandMore />
              </IconButton>
            </Box>
            <Collapse in={expandedSections.other}>
              <Box sx={{ p: 2, pt: 0 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={jobData.other}
                  onChange={handleInputChange('other')}
                  placeholder="Any additional information about the role or company..."
                />
              </Box>
            </Collapse>
          </Box>

          {/* Row 8: Job Details Dropdowns - Collapsible */}
          <Box sx={{ border: '1px solid #dadce0', borderRadius: 1 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                p: 2,
                cursor: 'pointer',
                '&:hover': { bgcolor: '#f8f9fa' }
              }}
              onClick={() => toggleSection('jobDetails')}
            >
              <Typography sx={{ fontWeight: 500, color: '#202124' }}>
                Job Details (Optional)
              </Typography>
              <IconButton 
                size="small"
                sx={{ 
                  transform: expandedSections.jobDetails ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s'
                }}
              >
                <ExpandMore />
              </IconButton>
            </Box>
            <Collapse in={expandedSections.jobDetails}>
              <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 30%', minWidth: '250px' }}>
                  <FormControl fullWidth>
                    <InputLabel>Job Type</InputLabel>
                    <Select
                      value={jobData.jobType}
                      onChange={handleInputChange('jobType')}
                      label="Job Type"
                    >
                      <MenuItem value="">Not specified</MenuItem>
                      <MenuItem value="FULL_TIME">Full-time</MenuItem>
                      <MenuItem value="PART_TIME">Part-time</MenuItem>
                      <MenuItem value="CONTRACT">Contract</MenuItem>
                      <MenuItem value="TEMPORARY">Temporary</MenuItem>
                      <MenuItem value="INTERN">Intern</MenuItem>
                      <MenuItem value="FREELANCE">Freelance</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ flex: '1 1 30%', minWidth: '250px' }}>
                  <FormControl fullWidth>
                    <InputLabel>Experience Level</InputLabel>
                    <Select
                      value={jobData.experienceLevel}
                      onChange={handleInputChange('experienceLevel')}
                      label="Experience Level"
                    >
                      <MenuItem value="">Not specified</MenuItem>
                      <MenuItem value="INTERNSHIP">Internship</MenuItem>
                      <MenuItem value="ENTRY_LEVEL">Entry Level</MenuItem>
                      <MenuItem value="ASSOCIATE">Associate</MenuItem>
                      <MenuItem value="MID_SENIOR_LEVEL">Mid-Senior Level</MenuItem>
                      <MenuItem value="DIRECTOR">Director</MenuItem>
                      <MenuItem value="EXECUTIVE">Executive</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ flex: '1 1 30%', minWidth: '250px' }}>
                  <FormControl fullWidth>
                    <InputLabel>Workplace Type</InputLabel>
                    <Select
                      value={jobData.workplaceType}
                      onChange={handleInputChange('workplaceType')}
                      label="Workplace Type"
                    >
                      <MenuItem value="">Not specified</MenuItem>
                      <MenuItem value="ONSITE">Onsite</MenuItem>
                      <MenuItem value="HYBRID">Hybrid</MenuItem>
                      <MenuItem value="REMOTE">Remote</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </Collapse>
          </Box>

          {/* Row 9: Salary - Collapsible */}
          <Box sx={{ border: '1px solid #dadce0', borderRadius: 1 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                p: 2,
                cursor: 'pointer',
                '&:hover': { bgcolor: '#f8f9fa' }
              }}
              onClick={() => toggleSection('salary')}
            >
              <Typography sx={{ fontWeight: 500, color: '#202124' }}>
                Salary Range (Optional)
              </Typography>
              <IconButton 
                size="small"
                sx={{ 
                  transform: expandedSections.salary ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s'
                }}
              >
                <ExpandMore />
              </IconButton>
            </Box>
            <Collapse in={expandedSections.salary}>
              <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 30%', minWidth: '200px' }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Minimum Salary"
                    value={jobData.salaryMin}
                    onChange={handleInputChange('salaryMin')}
                    error={!!errors.salaryMin}
                    helperText={errors.salaryMin}
                    placeholder="50000"
                  />
                </Box>

                <Box sx={{ flex: '1 1 30%', minWidth: '200px' }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Maximum Salary"
                    value={jobData.salaryMax}
                    onChange={handleInputChange('salaryMax')}
                    error={!!errors.salaryMax}
                    helperText={errors.salaryMax}
                    placeholder="100000"
                  />
                </Box>

                <Box sx={{ flex: '1 1 30%', minWidth: '200px' }}>
                  <TextField
                    fullWidth
                    label="Currency"
                    value={jobData.currency}
                    onChange={handleInputChange('currency')}
                    error={!!errors.currency}
                    helperText={errors.currency}
                    placeholder="USD"
                  />
                </Box>
              </Box>
            </Collapse>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              disabled={isLoading}
              sx={{ 
                textTransform: 'none',
                borderColor: '#dadce0',
                color: '#5f6368',
                px: 4,
                py: 1
              }}
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              onClick={handleSubmit}
              disabled={isLoading}
              sx={{ 
                textTransform: 'none',
                borderColor: '#4285F4',
                color: '#4285F4',
                px: 4,
                py: 1,
                fontWeight: 600
              }}
            >
              {isLoading ? 'Posting...' : 'Post Job'}
            </Button>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Page>
  );
};

export default PostJob;
