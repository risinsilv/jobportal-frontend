import React, { useEffect, useMemo, useState } from 'react';
import { Box, Container, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, CircularProgress, Alert, Skeleton, Chip, IconButton, Collapse, Fade } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import '@fontsource/open-sans';
import { searchJobPostings } from '../../api/jobPostings';
import { 
  Search as SearchIcon, 
  LocationOn, 
  TuneOutlined, 
  ClearAll, 
  BookmarkBorder,
  Work,
  AttachMoney,
  Business,
  Schedule,
  ArrowUpward,
  ArrowDownward
} from '@mui/icons-material';

// Google brand palette
const GOOGLE_COLORS = {
  blue: '#4285F4',
  red: '#EA4335',
  yellow: '#FBBC04',
  green: '#34A853',
  gray: '#5f6368',
};

const Page = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: '100vh',
  color: '#202124',
  fontFamily: '"Google Sans"',
  '& *': {
    fontFamily: '"Google Sans" !important',
  },
}));

const SearchBar = styled(Box)(({ theme }) => ({
  width: '100%',
  border: '1px solid #dadce0',
  borderRadius: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  gap: theme.spacing(1),
}));

const Home = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    title: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
    currency: '',
    experienceLevel: '',
    jobType: '',
    workplaceType: '',
    status: 'Open',
    lastHours: '72', // Default: last 3 days for relevant feed
  });
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchTriggered, setSearchTriggered] = useState(false);

  // Auto-search on mount
  useEffect(() => {
    handleSearch(true);
  }, []);

  // Debounce title input
  useEffect(() => {
    if (!searchTriggered) return;
    const t = filters.title?.trim();
    if (t.length === 0) return;
    const id = setTimeout(() => {
      handleSearch(true);
    }, 500);
    return () => clearTimeout(id);
  }, [filters.title]);

  const handleSearch = async (resetPage = false) => {
    const isInitialLoad = resetPage;
    const currentPage = resetPage ? 0 : page;
    
    if (isInitialLoad) {
      setLoading(true);
      setPage(0);
    } else {
      setLoadingMore(true);
    }
    
    setError('');
    setSearchTriggered(true);
    
    try {
      const data = await searchJobPostings(filters, currentPage, size);
      const list = Array.isArray(data) ? data : (data?.content || []);
      
      // Set hasMore based on returned results
      setHasMore(list.length === size);
      
      if (isInitialLoad) {
        setResults(list);
      } else {
        setResults(prev => [...prev, ...list]);
      }
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || 'Failed to fetch job postings';
      setError(msg);
      if (isInitialLoad) {
        setResults([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    handleSearch(false);
  };

  const clearAllFilters = () => {
    setFilters({
      title: '',
      location: '',
      salaryMin: '',
      salaryMax: '',
      currency: '',
      experienceLevel: '',
      jobType: '',
      workplaceType: '',
      status: 'Open',
      lastHours: '72',
    });
    setPage(0);
    handleSearch(true);
  };

  const removeFilter = (key) => {
    const defaultValue = key === 'status' ? 'Open' : (key === 'lastHours' ? '72' : '');
    setFilters(prev => ({ ...prev, [key]: defaultValue }));
    handleSearch(true);
  };

  const activeFiltersCount = useMemo(() => {
    return Object.entries(filters).filter(([key, val]) => {
      if (key === 'status' && val === 'Open') return false;
      if (key === 'lastHours' && val === '72') return false; // Default filter doesn't count
      return val && val.toString().trim() !== '';
    }).length;
  }, [filters]);

  const quickFilterToggle = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key] === value ? '' : value
    }));
  };

  return (
    <Page>
      <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 }, py: 3, }}>
        {/* Header */}
        <Box sx={{ mb: 1.5 }}>
          <Typography sx={{ fontWeight: 400, mb: 0.5, color: '#202124', fontSize: { xs: '30px', md: '50px' } }}>
            Discover your next opportunity
          </Typography>
          <Typography variant="body1" sx={{ color: '#5f6368' }}>
            {results.length > 0 ? `${results.length} jobs found` : 'Search smart. Find faster.'}
          </Typography>
        </Box>


        {/* Search Bar (sticky) */}
        <Box sx={{ position: 'sticky', top: 8, zIndex: 10, mb: 3, py: 1 }}>
          <SearchBar>
            <SearchIcon sx={{ color: GOOGLE_COLORS.blue }} />
            <TextField
              fullWidth
              placeholder="Job title, keywords, or company"
              value={filters.title}
              onChange={(e) => setFilters({ ...filters, title: e.target.value })}
              variant="standard"
              InputProps={{ 
                disableUnderline: true,
                sx: { fontSize: '16px' }
              }}
            />
            <LocationOn sx={{ color: GOOGLE_COLORS.red }} />
            <TextField
              placeholder="Location"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              variant="standard"
              sx={{ minWidth: 180 }}
              InputProps={{ 
                disableUnderline: true,
                sx: { fontSize: '16px' }
              }}
            />
            <IconButton 
              onClick={() => setShowAdvanced(!showAdvanced)}
              sx={{ 
                color: showAdvanced ? GOOGLE_COLORS.green : GOOGLE_COLORS.gray
              }}
            >
              <TuneOutlined />
            </IconButton>
            <Button
              variant="outlined"
              onClick={handleSearch}
              startIcon={<SearchIcon sx={{}}/>}
              disabled={loading}
              sx={{
                background: GOOGLE_COLORS.blue,
                color: '#fff',
                textTransform: 'none',
                fontWeight: 600,
                px: 6,
                borderRadius: 999
              }}
            >
              Search
            </Button>
          </SearchBar>

          {/* Advanced Filters */}
          <Collapse in={showAdvanced}>
            <Box sx={{ mt: 2, p: 2, borderRadius: 2, border: '1px solid #dadce0' }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
                <TextField
                  label="Salary min"
                  type="number"
                  size="small"
                  value={filters.salaryMin}
                  onChange={(e) => setFilters({ ...filters, salaryMin: e.target.value })}
                />
                <TextField
                  label="Salary max"
                  type="number"
                  size="small"
                  value={filters.salaryMax}
                  onChange={(e) => setFilters({ ...filters, salaryMax: e.target.value })}
                />
                <TextField
                  label="Currency"
                  size="small"
                  value={filters.currency}
                  onChange={(e) => setFilters({ ...filters, currency: e.target.value })}
                  placeholder="USD, EUR, etc."
                />
                <FormControl size="small">
                  <InputLabel>Experience</InputLabel>
                  <Select
                    label="Experience"
                    value={filters.experienceLevel}
                    onChange={(e) => setFilters({ ...filters, experienceLevel: e.target.value })}
                  >
                    <MenuItem value="">Any</MenuItem>
                    <MenuItem value="INTERNSHIP">Internship</MenuItem>
                    <MenuItem value="ENTRY_LEVEL">Entry Level</MenuItem>
                    <MenuItem value="ASSOCIATE">Associate</MenuItem>
                    <MenuItem value="MID_SENIOR_LEVEL">Mid-Senior</MenuItem>
                    <MenuItem value="DIRECTOR">Director</MenuItem>
                    <MenuItem value="EXECUTIVE">Executive</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small">
                  <InputLabel>Job type</InputLabel>
                  <Select
                    label="Job type"
                    value={filters.jobType}
                    onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
                  >
                    <MenuItem value="">Any</MenuItem>
                    <MenuItem value="FULL_TIME">Full-time</MenuItem>
                    <MenuItem value="PART_TIME">Part-time</MenuItem>
                    <MenuItem value="CONTRACT">Contract</MenuItem>
                    <MenuItem value="TEMPORARY">Temporary</MenuItem>
                    <MenuItem value="INTERN">Intern</MenuItem>
                    <MenuItem value="FREELANCE">Freelance</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small">
                  <InputLabel>Workplace</InputLabel>
                  <Select
                    label="Workplace"
                    value={filters.workplaceType}
                    onChange={(e) => setFilters({ ...filters, workplaceType: e.target.value })}
                  >
                    <MenuItem value="">Any</MenuItem>
                    <MenuItem value="ONSITE">Onsite</MenuItem>
                    <MenuItem value="HYBRID">Hybrid</MenuItem>
                    <MenuItem value="REMOTE">Remote</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    label="Status"
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  >
                    <MenuItem value="">Any</MenuItem>
                    <MenuItem value="Open">Open</MenuItem>
                    <MenuItem value="Closed">Closed</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small">
                  <InputLabel>Posted within</InputLabel>
                  <Select
                    label="Posted within"
                    value={filters.lastHours}
                    onChange={(e) => setFilters({ ...filters, lastHours: e.target.value })}
                  >
                    <MenuItem value="">Any time</MenuItem>
                    <MenuItem value="24">Last 24 hours</MenuItem>
                    <MenuItem value="72">Last 3 days</MenuItem>
                    <MenuItem value="168">Last week</MenuItem>
                    <MenuItem value="720">Last month</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Collapse>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ color: '#5f6368' }}>Active filters:</Typography>
              {Object.entries(filters).map(([key, val]) => {
                if (!val || (key === 'status' && val === 'Open') || (key === 'lastHours' && val === '72')) return null;
                
                const getLabelForFilter = () => {
                  if (key === 'lastHours') {
                    const hours = parseInt(val);
                    if (hours === 24) return 'Last 24h';
                    if (hours === 72) return 'Last 3 days';
                    if (hours === 168) return 'Last week';
                    if (hours === 720) return 'Last month';
                    return `Last ${hours}h`;
                  }
                  if (key === 'salaryMin') return `Min: ${val}`;
                  if (key === 'salaryMax') return `Max: ${val}`;
                  return val;
                };
                
                const label = getLabelForFilter();
                const colorMap = {
                  title: GOOGLE_COLORS.blue,
                  location: GOOGLE_COLORS.red,
                  salaryMin: GOOGLE_COLORS.yellow,
                  salaryMax: GOOGLE_COLORS.green,
                  currency: GOOGLE_COLORS.blue,
                  experienceLevel: GOOGLE_COLORS.green,
                  jobType: GOOGLE_COLORS.red,
                  workplaceType: GOOGLE_COLORS.yellow,
                  status: GOOGLE_COLORS.blue,
                  lastHours: GOOGLE_COLORS.green,
                };
                const chipColor = colorMap[key] || GOOGLE_COLORS.blue;
                return (
                  <Chip
                    key={key}
                    label={label}
                    size="small"
                    onDelete={() => removeFilter(key)}
                    sx={{ border: `1px solid ${chipColor}`, color: chipColor }}
                  />
                );
              })}
              <Button
                size="small"
                startIcon={<ClearAll />}
                onClick={clearAllFilters}
                sx={{ textTransform: 'none', color: '#5f6368' }}
              >
                Clear all
              </Button>
            </Box>
          )}
        </Box>

        {/* Results */}
        <Box>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          {loading && (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr', lg: '1fr' }, gap: 2 }}>
              {[...Array(6)].map((_, i) => (
                <Box key={i} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 2 }}>
                  <Skeleton variant="text" width="60%" height={32} />
                  <Skeleton variant="text" width="40%" />
                  <Skeleton variant="text" width="80%" />
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Skeleton variant="rounded" width={80} height={24} />
                    <Skeleton variant="rounded" width={80} height={24} />
                  </Box>
                </Box>
              ))}
            </Box>
          )}
          
          {!loading && results.length > 0 && (
            <Fade in timeout={400}>
              <Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr', lg: '1fr' }, gap: 2 }}>
                  {results.map((job, idx) => (
                    <ResultCard key={job.jobId || idx} job={job} />
                  ))}
                </Box>
                
                {/* Load More Button */}
                {hasMore && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Button
                      variant="outlined"
                      disabled={loadingMore}
                      onClick={handleLoadMore}
                      sx={{ 
                        textTransform: 'none',
                        borderColor: '#dadce0',
                        color: '#5f6368',
                        px: 4,
                        py: 1.5,
                        minWidth: 200
                      }}
                    >
                      {loadingMore ? 'Loading more...' : 'Load More Jobs'}
                    </Button>
                  </Box>
                )}
                
                {/* Loading More Indicator */}
                {loadingMore && (
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    mt: 2,
                    p: 2,
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    color: '#5f6368'
                  }}>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    <Typography variant="body2">Loading more jobs...</Typography>
                  </Box>
                )}
                
                {/* End of Results Message */}
                {!hasMore && results.length > 0 && (
                  <Box sx={{ 
                    textAlign: 'center', 
                    mt: 3, 
                    p: 2,
                    color: '#5f6368',
                    borderTop: '1px solid #e0e0e0'
                  }}>
                    <Typography variant="body2">
                      You've reached the end of the results ({results.length} jobs)
                    </Typography>
                  </Box>
                )}
              </Box>
            </Fade>
          )}
          
          {!loading && results.length === 0 && (
            <Box sx={{ 
              border: '1px dashed #dadce0', 
              borderRadius: 2, 
              p: 6, 
              textAlign: 'center', 
              color: '#5f6368'
            }}>
              <SearchIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>No jobs found</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Try adjusting your filters or search terms
              </Typography>
              {activeFiltersCount > 0 && (
                <Button
                  variant="outlined"
                  startIcon={<ClearAll />}
                  onClick={clearAllFilters}
                  sx={{ textTransform: 'none' }}
                >
                  Clear all filters
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Container>
    </Page>
  );
};

// Result Card Component
const ResultCard = ({ job }) => {
  const [saved, setSaved] = useState(false);
  const palette = [GOOGLE_COLORS.blue, GOOGLE_COLORS.red, GOOGLE_COLORS.yellow, GOOGLE_COLORS.green];
  const accent = palette[(Number(job?.jobId) || 0) % 4];

  const hexToRGBA = (hex, alpha = 0.2) => {
    const c = hex?.replace('#', '') || '000000';
    const r = parseInt(c.length >= 2 ? c.slice(0, 2) : '00', 16);
    const g = parseInt(c.length >= 4 ? c.slice(2, 4) : '00', 16);
    const b = parseInt(c.length >= 6 ? c.slice(4, 6) : '00', 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  const darkenHex = (hex, amount = 0.15) => {
    const c = hex?.replace('#', '') || '000000';
    const r = Math.max(0, Math.min(255, Math.floor(parseInt(c.slice(0, 2), 16) * (1 - amount))));
    const g = Math.max(0, Math.min(255, Math.floor(parseInt(c.slice(2, 4), 16) * (1 - amount))));
    const b = Math.max(0, Math.min(255, Math.floor(parseInt(c.slice(4, 6), 16) * (1 - amount))));
    const toHex = (n) => n.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const formatPostedDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };
  
  const prettifyEnum = (val) => {
    if (!val) return '';
    const v = String(val).toUpperCase();
    const map = {
      FULL_TIME: 'Full-time',
      PART_TIME: 'Part-time',
      MID_SENIOR_LEVEL: 'Mid-Senior Level',
      ENTRY_LEVEL: 'Entry Level',
      ONSITE: 'Onsite',
      HYBRID: 'Hybrid',
      REMOTE: 'Remote',
      INTERN: 'Intern',
      FREELANCE: 'Freelance',
      CONTRACT: 'Contract',
      TEMPORARY: 'Temporary',
      DIRECTOR: 'Director',
      EXECUTIVE: 'Executive',
      ASSOCIATE: 'Associate'
    };
    if (map[v]) return map[v];
    return v.split('_').map(s => s.charAt(0) + s.slice(1).toLowerCase()).join(' ');
  };

  const formatCompact = (num) => {
    try { return Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 }).format(num); }
    catch { return String(num); }
  };

  const jobType = job?.jobType ?? job?.JobType ?? '';
  const workplaceType = job?.workplaceType ?? job?.worlkplaceType ?? '';
  const experienceLevel = job?.experienceLevel ?? '';
  const salaryMin = Number(job?.salaryMin ?? 0);
  const salaryMax = Number(job?.salaryMax ?? 0);
  const currency = job?.currency ?? '';

  

  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={() => { if (job?.jobId) { window.location.href = `/jobs/${job.jobId}/apply`; } }}
      onKeyDown={(e) => { if (e.key === 'Enter' && job?.jobId) { window.location.href = `/jobs/${job.jobId}/apply`; } }}
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: 6,
        p: 2.5,
        userSelect: 'none',
        cursor: 'pointer',
        transition: 'transform 140ms ease, box-shadow 140ms ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 10px 24px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)'
        },
        '&:active': {
          transform: 'translateY(-1px)',
          boxShadow: '0 6px 16px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)'
        },
        outline: 'none',
      }}
   >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 2,
            bgcolor: '#f4f6f7ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            component="img"
            src="/vite.svg"
            alt="Company"
            sx={{ width: 35, height: 35, opacity: 0.9 }}
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 500, fontSize: '22px', lineHeight: 1.2, color: '#202124', mb: 0.5, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {job.title || 'Untitled role'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#5f6368', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {job.organization || 'Company'}
          </Typography>
          <Box sx={{ mt: 0.75, borderBottom: '1px solid #eaecef' }} />
        </Box>
        <IconButton size="small" onClick={(e) => { e.stopPropagation(); setSaved(!saved); }} sx={{ color: saved ? '#fbbc04' : '#dadce0' }}>
          <BookmarkBorder />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {job.location && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.70 }}>
              <LocationOn sx={{ fontSize: 20, color: GOOGLE_COLORS.red }} />
              <Typography variant="body2" sx={{ color: GOOGLE_COLORS.gray, fontWeight: 500 }}>{job.location}</Typography>
            </Box>
          )}
          {/* New meta tags under location (only if present) */}
          {(() => {
            const tags = [];
            if (jobType) tags.push({ key: 'jobType', label: prettifyEnum(jobType), color: GOOGLE_COLORS.red });
            if (workplaceType) tags.push({ key: 'workplace', label: prettifyEnum(workplaceType), color: GOOGLE_COLORS.yellow });
            if (experienceLevel) tags.push({ key: 'exp', label: prettifyEnum(experienceLevel), color: GOOGLE_COLORS.green });
            if (currency && (salaryMin > 0 || salaryMax > 0)) {
              let label = currency + ' ';
              if (salaryMin > 0 && salaryMax > 0) label += `${formatCompact(salaryMin)}–${formatCompact(salaryMax)}`;
              else if (salaryMin > 0) label += `≥${formatCompact(salaryMin)}`;
              else label += `≤${formatCompact(salaryMax)}`;
              tags.push({ key: 'salary', label, color: GOOGLE_COLORS.blue });
            }
            if (!tags.length) return null;
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap',mt: 0.5 }}>
                {tags.map(t => (
                  <Chip
                    key={t.key}
                    label={t.label}
                    size="large"
                    sx={{
                      bgcolor: hexToRGBA(t.color, 0.14),
                      color: darkenHex(t.color, 0.2),
                      border: 'none',
                      height: 26,
                      fontSize: '15px',
                      fontWeight: 500
                    }}
                  />
                ))}
              </Box>
            );
          })()}
          {job.postedAt && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 1 }}>
              <Schedule sx={{ fontSize: 17, color: GOOGLE_COLORS.blue }} />
              <Typography variant="caption" sx={{ color: GOOGLE_COLORS.gray,fontWeight: 800 }}>{formatPostedDate(job.postedAt)}</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
