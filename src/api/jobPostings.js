import instance from '../Service/AxiosOrder';

// Build params from non-empty filters and optional pagination
export async function searchJobPostings(filters = {}, page, size) {
  const params = {};

  const addIfString = (key, val) => {
    if (typeof val === 'string' && val.trim().length > 0) {
      params[key] = val.trim();
    }
  };

  const addIfEnum = (key, val) => {
    if (typeof val === 'string' && val.length > 0) {
      // Special-case status: default 'Open' should not be sent
      if (key === 'status' && val === 'Open') return;
      params[key] = val; // assume exact backend enum string
    }
  };

  const addIfNumber = (key, val) => {
    const num = Number(val);
    if (!Number.isNaN(num)) {
      params[key] = num;
    }
  };

  const addIfPositiveNumber = (key, val) => {
    const num = Number(val);
    if (!Number.isNaN(num) && num > 0) {
      params[key] = num;
    }
  };

  // Strings
  addIfString('title', filters.title);
  addIfString('location', filters.location);
  addIfString('currency', filters.currency);

  // Enums
  addIfEnum('experienceLevel', filters.experienceLevel);
  addIfEnum('jobType', filters.jobType);
  addIfEnum('workplaceType', filters.workplaceType);
  addIfEnum('status', filters.status);

  // Numbers
  // Treat 0 as "not provided" for salary filters
  addIfPositiveNumber('salaryMin', filters.salaryMin);
  addIfPositiveNumber('salaryMax', filters.salaryMax);
  addIfNumber('employerId', filters.employerId);
  // Only include lastHours if > 0
  addIfPositiveNumber('lastHours', filters.lastHours);

  // Pagination (optional) - must include page=0
  if (page !== undefined && size !== undefined) {
    addIfNumber('page', page);
    addIfNumber('size', size);
  }

  // Public search endpoint, no Authorization header should be sent
  const res = await instance.get('/api/jobpostings/search', { params });
  console.log('searchJobPostings response:', res.data);
  return res.data;
}
