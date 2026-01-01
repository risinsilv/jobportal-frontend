import React, { useEffect, useState, useMemo } from 'react';
import '@fontsource/open-sans';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Chip, Divider, Alert, Button, Skeleton, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import instance from '../../Service/AxiosOrder';
import { LocationOn, Schedule, BookmarkBorder, ArrowBack } from '@mui/icons-material';

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
  '& *': { fontFamily: '"Google Sans" !important' },
}));

const Section = styled(Box)(({ theme }) => ({
  border: 'none',
  borderRadius: 0,
  padding: theme.spacing(2),
}));
const SidebarBox = styled(Box)(({ theme }) => ({
  border: '1px solid #e0e0e0',
  borderRadius: 15,
  padding: theme.spacing(1.5),
  
}));

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

const hexToRGBA = (hex, alpha = 0.14) => {
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

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const fetchJob = async () => {
      setLoading(true);
      setError('');
      try {
        const resp = await instance.get(`/api/jobpostings/${jobId}`);
        const data = resp?.data || null;
        if (mounted) setJob(data);
      } catch (e) {
        const msg = e?.response?.data?.message || e?.message || 'Failed to load job details';
        if (mounted) setError(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchJob();
    return () => { mounted = false; };
  }, [jobId]);

  const jobType = job?.jobType ?? job?.JobType ?? '';
  const workplaceType = job?.workplaceType ?? job?.worlkplaceType ?? '';
  const experienceLevel = job?.experienceLevel ?? '';
  const salaryMin = Number(job?.salaryMin ?? 0);
  const salaryMax = Number(job?.salaryMax ?? 0);
  const currency = job?.currency ?? '';

  const tags = useMemo(() => {
    const list = [];
    if (jobType) list.push({ key: 'jobType', label: prettifyEnum(jobType), color: GOOGLE_COLORS.red });
    if (workplaceType) list.push({ key: 'workplace', label: prettifyEnum(workplaceType), color: GOOGLE_COLORS.yellow });
    if (experienceLevel) list.push({ key: 'exp', label: prettifyEnum(experienceLevel), color: GOOGLE_COLORS.green });
    if (currency && (salaryMin > 0 || salaryMax > 0)) {
      let label = currency + ' ';
      if (salaryMin > 0 && salaryMax > 0) label += `${formatCompact(salaryMin)}–${formatCompact(salaryMax)}`;
      else if (salaryMin > 0) label += `≥${formatCompact(salaryMin)}`;
      else label += `≤${formatCompact(salaryMax)}`;
      list.push({ key: 'salary', label, color: GOOGLE_COLORS.blue });
    }
    // Legacy salary field if structured not present
    if (!currency && !salaryMin && !salaryMax && job?.salary) {
      list.push({ key: 'salaryLegacy', label: job.salary, color: GOOGLE_COLORS.blue });
    }
    if (job?.status) {
      const st = String(job.status);
      const color = st.toLowerCase() === 'open' ? GOOGLE_COLORS.green : GOOGLE_COLORS.gray;
      list.push({ key: 'status', label: st, color });
    }
    return list;
  }, [jobType, workplaceType, experienceLevel, salaryMin, salaryMax, currency]);

  const bulletItems = (text) => {
    if (!text) return [];
    const src = String(text);
    const parts = src.includes('•') ? src.split('•') : src.split(/\r?\n|;|,/);
    return parts.map(s => s.trim()).filter(Boolean);
  };

  return (
    <Page>
      <Container maxWidth={false} sx={{ px: { xs: 1, md: 4 }, py: 1 }}>
        {/* Fixed-position back control */}
        <Box sx={{ position: 'fixed', top: { xs: 72, md: 80 }, left: { xs: 8, md: 24 }, zIndex: 1200 }}>
          <IconButton aria-label="back" onClick={() => navigate(-1)} sx={{ border: 'none' }}>
            <ArrowBack />
          </IconButton>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 320px' }, gap: 3 }}>
          {/* Right sidebar: company details box */}
          <Box sx={{ order: { xs: 2, md: 2 } }}>
            <SidebarBox>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                Company
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <Box sx={{ width: 56, height: 56, borderRadius: 2, bgcolor: '#f1f3f4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Box component="img" src="/vite.svg" alt="Company" sx={{ width: 28, height: 28, opacity: 0.9 }} />
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>{job?.organization || 'Company'}</Typography>
                  <Typography variant="caption" sx={{ color: GOOGLE_COLORS.gray }}>Technology • 200–500 employees</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'grid', rowGap: 1 }}>
                <Typography variant="body2"><b>Website:</b> www.example.com</Typography>
                <Typography variant="body2"><b>Headquarters:</b> San Francisco, CA</Typography>
                <Typography variant="body2"><b>Founded:</b> 2012</Typography>
                <Typography variant="body2"><b>About:</b> We build delightful products that scale.</Typography>
              </Box>
            </SidebarBox>

            {/* Action buttons below the organization card */}
            <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton aria-label="bookmark" sx={{ border: 'none', borderRadius: 999 }}>
                <BookmarkBorder />
              </IconButton>
              <Button
                variant="contained"
                sx={{
                  textTransform: 'none',
                  bgcolor: GOOGLE_COLORS.blue,
                  color: '#fff',
                  borderRadius: 999,
                  boxShadow: 'none',
                  flex: 1,
                  '&:hover': { bgcolor: '#3367D6', boxShadow: 'none' },
                }}
                onClick={() => {
                  if (job?.jobId) {
                    window.location.href = `/jobs/${job.jobId}/apply`;
                  }
                }}
              >
                Apply
              </Button>
            </Box>
          </Box>

          {/* Main content (left) */}
          <Box sx={{ order: { xs: 1, md: 1 } }}>
            <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontWeight: 500, fontSize: { xs: '26px', md: '34px' } }}>
            {job?.title || (loading ? <Skeleton width={260} /> : 'Untitled role')}
          </Typography>
          <Typography variant="body2" sx={{ color: '#5f6368', fontWeight: 500 }}>
            {job?.organization || (loading ? <Skeleton width={160} /> : 'Company')}
          </Typography>
          <Box sx={{ mt: 0.75, borderBottom: '1px solid #eaecef' }} />
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Section sx={{ mb: 2, p: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <LocationOn sx={{ fontSize: 18, color: GOOGLE_COLORS.red }} />
                <Typography variant="body2" sx={{ color: GOOGLE_COLORS.gray }}>
                  {job?.location || (loading ? <Skeleton width={120} /> : 'Location')}
                </Typography>
                {job?.postedAt && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 2 }}>
                    <Schedule sx={{ fontSize: 16, color: GOOGLE_COLORS.blue }} />
                    <Typography variant="caption" sx={{ color: GOOGLE_COLORS.gray }}>
                      {formatPostedDate(job.postedAt)}
                    </Typography>
                  </Box>
                )}
              </Box>
              {tags.length > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
                  {tags.map(t => (
                    <Chip
                      key={t.key}
                      label={t.label}
                      size="small"
                      sx={{ bgcolor: hexToRGBA(t.color, 0.14), color: darkenHex(t.color, 0.2), border: 'none', height: 24 }}
                    />
                  ))}
                </Box>
              )}
            </Section>

            <Section sx={{ p: 0 }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>About this job</Typography>
              <Typography variant="body2" sx={{ color: '#5f6368' }}>
                {job?.description || 'No description provided.'}
              </Typography>
            </Section>

            {bulletItems(job?.responsibilities).length > 0 && (
              <Section sx={{ mt: 2, p: 0 }}>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>Responsibilities</Typography>
                <Box component="ul" sx={{ m: 0, pl: 3 }}>
                  {bulletItems(job?.responsibilities).map((item, idx) => (
                    <Box key={idx} component="li" sx={{ color: '#5f6368', mb: 0.5 }}>{item}</Box>
                  ))}
                </Box>
              </Section>
            )}

            {bulletItems(job?.requirements).length > 0 && (
              <Section sx={{ mt: 2, p: 0 }}>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>Requirements</Typography>
                <Box component="ul" sx={{ m: 0, pl: 3 }}>
                  {bulletItems(job?.requirements).map((item, idx) => (
                    <Box key={idx} component="li" sx={{ color: '#5f6368', mb: 0.5 }}>{item}</Box>
                  ))}
                </Box>
              </Section>
            )}

            {bulletItems(job?.niceToHave).length > 0 && (
              <Section sx={{ mt: 2, p: 0 }}>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>Nice to Have</Typography>
                <Box component="ul" sx={{ m: 0, pl: 3 }}>
                  {bulletItems(job?.niceToHave).map((item, idx) => (
                    <Box key={idx} component="li" sx={{ color: '#5f6368', mb: 0.5 }}>{item}</Box>
                  ))}
                </Box>
              </Section>
            )}

            {bulletItems(job?.other).length > 0 && (
              <Section sx={{ mt: 2, p: 0 }}>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>Other</Typography>
                <Box component="ul" sx={{ m: 0, pl: 3 }}>
                  {bulletItems(job?.other).map((item, idx) => (
                    <Box key={idx} component="li" sx={{ color: '#5f6368', mb: 0.5 }}>{item}</Box>
                  ))}
                </Box>
              </Section>
            )}

            {/* Removed bottom Back and Apply buttons per request */}
          </Box>
        </Box>
      </Container>
    </Page>
  );
};

export default JobDetails;
