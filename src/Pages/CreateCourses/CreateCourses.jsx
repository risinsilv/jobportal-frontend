import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    TextField,
    Button,
    Grid,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Alert,
    Snackbar,
    Paper,
    Chip,
    IconButton,
    InputAdornment,
} from '@mui/material';
import {
    ArrowBack,
    Preview,
    VideoLibrary,
    Category,
    Title as TitleIcon,
    Description,
    AttachMoney,
    School,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Styled components with glassmorphism effect
const CreateCoursesContainer = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
}));

const CreateCoursesHeader = styled(Paper)(({ theme }) => ({
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

const GlassCard = styled(Card)(({ theme }) => ({
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: theme.spacing(2),
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    marginBottom: theme.spacing(3),
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
    '& .MuiInputLabel-root': {
        fontWeight: 500,
    },
}));

const CategoryChip = styled(Chip)(({ theme }) => ({
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    fontWeight: 500,
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: 'rgba(44, 103, 242, 0.1)',
        borderColor: 'rgba(44, 103, 242, 0.3)',
    },
    '&.selected': {
        backgroundColor: '#2c67f2',
        color: 'white',
        borderColor: '#2c67f2',
    },
}));

const CreateCourses = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        cost: '',
        videoUrl: '',
    });
    const [errors, setErrors] = useState({});
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    // Course categories
    const courseCategories = [
        'Programming',
        'Web Development',
        'Mobile Development',
        'Data Science',
        'Machine Learning',
        'Artificial Intelligence',
        'DevOps',
        'Cloud Computing',
        'Cybersecurity',
        'UI/UX Design',
        'Digital Marketing',
        'Project Management',
        'Business Analysis',
        'Database Management',
        'Software Testing',
        'Other',
    ];

    const handleInputChange = (field) => (event) => {
        setFormData({
            ...formData,
            [field]: event.target.value,
        });
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors({
                ...errors,
                [field]: '',
            });
        }
    };

    const handleCategorySelect = (category) => {
        setFormData({
            ...formData,
            category: category,
        });
        if (errors.category) {
            setErrors({
                ...errors,
                category: '',
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Course title is required';
        }

        if (!formData.category) {
            newErrors.category = 'Please select a category';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Course description is required';
        } else if (formData.description.length < 50) {
            newErrors.description = 'Description should be at least 50 characters';
        }

        if (!formData.cost.trim()) {
            newErrors.cost = 'Course cost is required';
        } else if (isNaN(formData.cost) || parseFloat(formData.cost) < 0) {
            newErrors.cost = 'Please enter a valid cost (use 0 for free courses)';
        }

        if (formData.videoUrl && !isValidUrl(formData.videoUrl)) {
            newErrors.videoUrl = 'Please enter a valid URL';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleSubmit = (isDraft = false) => {
        if (!validateForm() && !isDraft) {
            setSnackbar({
                open: true,
                message: 'Please fix the errors before submitting',
                severity: 'error',
            });
            return;
        }

        // Here you would typically send the data to your backend
        console.log('Course data:', {
            ...formData,
            trainerId: localStorage.getItem('userId'), // Assuming trainer ID is stored
            isDraft,
            createdAt: new Date().toISOString(),
        });

        setSnackbar({
            open: true,
            message: isDraft ? 'Course saved as draft!' : 'Course created successfully!',
            severity: 'success',
        });

        // Reset form after successful submission
        if (!isDraft) {
            setFormData({
                title: '',
                category: '',
                description: '',
                cost: '',
                videoUrl: '',
            });
        }
    };

    const handlePreview = () => {
        console.log('Preview course:', formData);
        // You could open a preview modal or navigate to a preview page
        setSnackbar({
            open: true,
            message: 'Preview functionality coming soon!',
            severity: 'info',
        });
    };

    const handleBack = () => {
        navigate('/Dashboard');
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <CreateCoursesContainer>
            <Container maxWidth="lg">
                {/* Header */}
                <CreateCoursesHeader>
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
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
                            <Typography variant="h4" component="h1" fontWeight="bold">
                                Create New Course
                            </Typography>
                        </Box>
                        <Typography variant="h6" opacity={0.9}>
                            Share your expertise and help others learn new skills
                        </Typography>
                    </Box>
                </CreateCoursesHeader>

                {/* Main Form */}
                <GlassCard>
                    <CardContent sx={{ p: 4 }}>
                        <Grid container spacing={3}>
                            {/* Course Title */}
                            <Grid item xs={12}>
                                <StyledTextField
                                    fullWidth
                                    label="Course Title"
                                    variant="outlined"
                                    value={formData.title}
                                    onChange={handleInputChange('title')}
                                    error={!!errors.title}
                                    helperText={errors.title}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <TitleIcon sx={{ color: '#2c67f2' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    placeholder="e.g., Complete React Development Bootcamp"
                                />
                            </Grid>

                            {/* Category Selection */}
                            <Grid item xs={12}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2c67f2' }}>
                                    <Category sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    Course Category
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                    {courseCategories.map((category) => (
                                        <CategoryChip
                                            key={category}
                                            label={category}
                                            onClick={() => handleCategorySelect(category)}
                                            className={formData.category === category ? 'selected' : ''}
                                        />
                                    ))}
                                </Box>
                                {errors.category && (
                                    <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                                        {errors.category}
                                    </Typography>
                                )}
                            </Grid>

                            {/* Cost and Video URL */}
                            <Grid item xs={12} md={6}>
                                <StyledTextField
                                    fullWidth
                                    label="Course Cost"
                                    variant="outlined"
                                    value={formData.cost}
                                    onChange={handleInputChange('cost')}
                                    error={!!errors.cost}
                                    helperText={errors.cost || 'Enter 0 for free courses'}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AttachMoney sx={{ color: '#2c67f2' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    placeholder="99.99"
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <StyledTextField
                                    fullWidth
                                    label="Video URL (Optional)"
                                    variant="outlined"
                                    value={formData.videoUrl}
                                    onChange={handleInputChange('videoUrl')}
                                    error={!!errors.videoUrl}
                                    helperText={errors.videoUrl || 'YouTube, Vimeo, or direct video link'}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <VideoLibrary sx={{ color: '#2c67f2' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    placeholder="https://youtube.com/watch?v=..."
                                />
                            </Grid>
                            <StyledTextField
                                fullWidth
                                label="Course Description"
                                variant="outlined"
                                multiline
                                rows={6}
                                value={formData.description}
                                onChange={handleInputChange('description')}
                                error={!!errors.description}
                                helperText={errors.description || `${formData.description.length}/500 characters`}
                                inputProps={{ maxLength: 500 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                                            <Description sx={{ color: '#2c67f2' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                placeholder="Provide a detailed description of what students will learn, course objectives, prerequisites, and any other relevant information..."
                            />

                            {/* Action Buttons */}
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                                    <Button
                                        variant="outlined"
                                        onClick={handlePreview}
                                        startIcon={<Preview />}
                                        sx={{
                                            borderColor: 'rgba(0, 0, 0, 0.23)',
                                            color: '#2c67f2',
                                            '&:hover': {
                                                borderColor: '#2c67f2',
                                                backgroundColor: 'rgba(44, 103, 242, 0.04)',
                                            },
                                        }}
                                    >
                                        Preview
                                    </Button>

                                    <GradientButton
                                        onClick={() => handleSubmit(false)}
                                        startIcon={<School />}
                                        size="large"
                                    >
                                        Create Course
                                    </GradientButton>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </GlassCard>
            </Container>

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
        </CreateCoursesContainer>
    );
};

export default CreateCourses;
