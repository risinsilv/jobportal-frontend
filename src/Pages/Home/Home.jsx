import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import '@fontsource/open-sans';

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

const SearchCard = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: 820,
  border: '1px solid #dadce0',
  borderRadius: theme.spacing(2),
  background: '#fff',
  boxShadow: 'none',
  padding: theme.spacing(3),
}));

const Home = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (title) params.set('title', title);
    if (location) params.set('location', location);
    navigate(`/JobSearch?${params.toString()}`);
  };

  return (
    <Page>
      <LogoText variant="h6">
        <Box component="span" sx={{ color: '#4285F4' }}>J</Box>ob{' '}
        <Box component="span" sx={{ color: '#4285F4' }}>P</Box>ortal
      </LogoText>
      <Container maxWidth="md" sx={{ textAlign: 'center' }}>
        <Typography variant="h3" sx={{ fontWeight: 400, mb: 2, color: '#202124' }}>
          Find your next job
        </Typography>
        <Typography variant="body1" sx={{ color: '#5f6368', mb: 3 }}>
          Search roles and locations — simple and focused.
        </Typography>

        <SearchCard>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr auto' }, gap: 2 }}>
            <TextField
              fullWidth
              label="Job title or company"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              variant="outlined"
              InputProps={{ sx: { borderRadius: 2 } }}
            />
            <TextField
              fullWidth
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              variant="outlined"
              InputProps={{ sx: { borderRadius: 2 } }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              sx={{
                height: 56,
                alignSelf: 'stretch',
                background: '#4285F4',
                color: '#fff',
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2,
                boxShadow: 'none',
                '&:hover': { background: '#1a73e8', boxShadow: 'none' },
              }}
            >
              Search
            </Button>
          </Box>
        </SearchCard>

        <Box sx={{ mt: 3, color: '#5f6368' }}>
          <Typography variant="body2">
            Try: Software Engineer · Data Analyst · UI Designer
          </Typography>
        </Box>
      </Container>
    </Page>
  );
};

export default Home;
