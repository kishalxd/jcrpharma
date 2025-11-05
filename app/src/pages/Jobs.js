import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useSEO } from '../hooks/useSEO';

const Jobs = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    specialism: [],
    contract: [],
    seniority: [],
    workMode: [],
    location: [],
    salaryRange: '',
    posted: '',
    skills: []
  });
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [sortBy, setSortBy] = useState('recent');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(10);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const navigate = useNavigate();

  // Set SEO metadata
  useSEO(
    'Jobs',
    'Browse the latest life sciences and biometrics job opportunities. Find biostatistics, clinical data management, data science, bioinformatics, and medical affairs roles at top pharmaceutical and biotech companies across UK, USA, and Europe. Search, filter, and apply for your next career move.'
  );

  const popularSearches = [
    'Biostatistician', 'Clinical Data Manager', 'SAS Programmer', 'Bioinformatics',
    'Statistical Programming', 'CDISC', 'Medical Writer', 'Regulatory Affairs'
  ];

  const filterOptions = {
    specialism: ['Biostatistics', 'Clinical Data Management', 'Bioinformatics', 'Medical Affairs', 'Regulatory Affairs'],
    contract: ['Permanent', 'Contract', 'Interim'],
    seniority: ['Entry Level', 'Mid Level', 'Senior Level', 'Director Level', 'C-Suite'],
    workMode: ['Remote', 'Hybrid', 'Onsite'],
    location: ['London', 'Cambridge', 'Oxford', 'Manchester', 'Edinburgh', 'Dublin'],
    salaryRange: ['£30k-50k', '£50k-70k', '£70k-100k', '£100k-150k', '£150k+'],
    posted: ['24h', '7d', '14d', '30d'],
    skills: ['SAS', 'R', 'Python', 'SQL', 'CDISC', 'ADaM', 'SDTM', 'TLFs']
  };

  // Fetch jobs from database
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to load jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const toggleFilter = (category, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      specialism: [],
      contract: [],
      seniority: [],
      workMode: [],
      location: [],
      salaryRange: '',
      posted: '',
      skills: []
    });
  };

  const getFilteredJobs = () => {
    return jobs.filter(job => {
      // Keyword search
      if (searchKeyword) {
        const keyword = searchKeyword.toLowerCase();
        const matchesKeyword = 
          job.title.toLowerCase().includes(keyword) ||
          job.company.toLowerCase().includes(keyword) ||
          job.description.toLowerCase().includes(keyword) ||
          job.skills.some(skill => skill.toLowerCase().includes(keyword));
        
        if (!matchesKeyword) return false;
      }

      // Location search
      if (searchLocation) {
        const location = searchLocation.toLowerCase();
        if (!job.location.toLowerCase().includes(location)) return false;
      }

      // Specialism filter
      if (selectedFilters.specialism.length > 0) {
        if (!selectedFilters.specialism.includes(job.specialism)) return false;
      }

      // Contract filter
      if (selectedFilters.contract.length > 0) {
        if (!selectedFilters.contract.includes(job.contract)) return false;
      }

      // Seniority filter
      if (selectedFilters.seniority.length > 0) {
        if (!selectedFilters.seniority.includes(job.seniority)) return false;
      }

      // Work mode filter
      if (selectedFilters.workMode.length > 0) {
        if (!selectedFilters.workMode.includes(job.work_mode)) return false;
      }

      // Location filter
      if (selectedFilters.location.length > 0) {
        const jobLocation = job.location.split(',')[0].trim(); // Get city part
        if (!selectedFilters.location.some(loc => jobLocation.toLowerCase().includes(loc.toLowerCase()))) return false;
      }

      // Skills filter
      if (selectedFilters.skills.length > 0) {
        if (!selectedFilters.skills.some(skill => job.skills.includes(skill))) return false;
      }

      // Posted date filter
      if (selectedFilters.posted) {
        const jobDate = new Date(job.created_at);
        const now = new Date();
        const daysDiff = Math.floor((now - jobDate) / (1000 * 60 * 60 * 24));
        
        switch (selectedFilters.posted) {
          case '24h':
            if (daysDiff > 1) return false;
            break;
          case '7d':
            if (daysDiff > 7) return false;
            break;
          case '14d':
            if (daysDiff > 14) return false;
            break;
          case '30d':
            if (daysDiff > 30) return false;
            break;
          default:
            break;
        }
      }

      return true;
    });
  };

  const getSortedJobs = (jobs) => {
    // First, separate featured and non-featured jobs
    const featuredJobs = jobs.filter(job => job.featured);
    const nonFeaturedJobs = jobs.filter(job => !job.featured);
    
    // Sort each group separately
    const sortJobs = (jobList) => {
      switch (sortBy) {
        case 'salary-high':
          return [...jobList].sort((a, b) => {
            const aMax = parseInt(a.salary?.match(/£(\d+),?(\d+)?/)?.[1] || '0');
            const bMax = parseInt(b.salary?.match(/£(\d+),?(\d+)?/)?.[1] || '0');
            return bMax - aMax;
          });
        case 'salary-low':
          return [...jobList].sort((a, b) => {
            const aMax = parseInt(a.salary?.match(/£(\d+),?(\d+)?/)?.[1] || '0');
            const bMax = parseInt(b.salary?.match(/£(\d+),?(\d+)?/)?.[1] || '0');
            return aMax - bMax;
          });
        case 'recent':
          return [...jobList].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        case 'oldest':
          return [...jobList].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        case 'title-asc':
          return [...jobList].sort((a, b) => a.title.localeCompare(b.title));
        case 'title-desc':
          return [...jobList].sort((a, b) => b.title.localeCompare(a.title));
        case 'company-asc':
          return [...jobList].sort((a, b) => a.company.localeCompare(b.company));
        case 'company-desc':
          return [...jobList].sort((a, b) => b.company.localeCompare(a.company));
        default:
          return jobList;
      }
    };
    
    // Return featured jobs first, then non-featured jobs
    return [...sortJobs(featuredJobs), ...sortJobs(nonFeaturedJobs)];
  };

  const getPostedTime = (createdAt) => {
    const now = new Date();
    const jobDate = new Date(createdAt);
    const diffInMs = now - jobDate;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else if (diffInDays === 1) {
      return '1 day ago';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 14) {
      return '1 week ago';
    } else if (diffInDays < 30) {
      return `${Math.floor(diffInDays / 7)} weeks ago`;
    } else {
      return `${Math.floor(diffInDays / 30)} months ago`;
    }
  };

  const filteredJobs = getFilteredJobs();
  const sortedJobs = getSortedJobs(filteredJobs);

  // Pagination calculations
  const totalPages = Math.ceil(sortedJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const paginatedJobs = sortedJobs.slice(startIndex, endIndex);

  // Reset to page 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchKeyword, searchLocation, selectedFilters, sortBy]);

  // Generate pagination buttons
  const getPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(i);
      }
    } else {
      // Always show first page
      buttons.push(1);

      if (currentPage > 3) {
        buttons.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          buttons.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        buttons.push('...');
      }

      // Always show last page
      if (totalPages > 1) {
        buttons.push(totalPages);
      }
    }

    return buttons;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Header Section */}
      <section className="bg-brand-blue">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center text-white mb-8">
            <h1 className="text-3xl md:text-4xl font-light mb-4 leading-tight">
              Find your next role in<br />
              biometrics & data
            </h1>
            <p className="text-gray-300 text-base md:text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover specialised opportunities in biostatistics, clinical data management, bioinformatics,<br />
              and medical affairs across leading life-sciences companies.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-4xl mx-auto mb-6">
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Job title, keyword, or skill"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:border-white/50 focus:bg-white/30 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Location"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:border-white/50 focus:bg-white/30 transition-all text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Popular Search Chips */}
            <div className="max-w-4xl mx-auto">
              <p className="text-gray-300 text-xs mb-2">Popular searches:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchKeyword(search)}
                    className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full text-xs transition-all duration-300 backdrop-blur-sm"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-gray-50 py-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                  <button
                    onClick={clearAllFilters}
                    className="text-brand-blue hover:text-blue-700 text-sm font-medium"
                  >
                    Clear all
                  </button>
                </div>

                {/* Specialism Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Specialism</h4>
                  <div className="space-y-2">
                    {filterOptions.specialism.map((option) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedFilters.specialism.includes(option)}
                          onChange={() => toggleFilter('specialism', option)}
                          className="mr-3 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                        />
                        <span className="text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Contract Type Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Contract Type</h4>
                  <div className="space-y-2">
                    {filterOptions.contract.map((option) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedFilters.contract.includes(option)}
                          onChange={() => toggleFilter('contract', option)}
                          className="mr-3 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                        />
                        <span className="text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Seniority Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Seniority</h4>
                  <div className="space-y-2">
                    {filterOptions.seniority.map((option) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedFilters.seniority.includes(option)}
                          onChange={() => toggleFilter('seniority', option)}
                          className="mr-3 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                        />
                        <span className="text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Work Mode Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Work Mode</h4>
                  <div className="space-y-2">
                    {filterOptions.workMode.map((option) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedFilters.workMode.includes(option)}
                          onChange={() => toggleFilter('workMode', option)}
                          className="mr-3 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                        />
                        <span className="text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Posted Date Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Posted</h4>
                  <select 
                    value={selectedFilters.posted}
                    onChange={(e) => setSelectedFilters(prev => ({...prev, posted: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  >
                    <option value="">Any time</option>
                    {filterOptions.posted.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Skills Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.skills.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => toggleFilter('skills', skill)}
                        className={`px-3 py-1 rounded-full text-xs transition-all ${
                          selectedFilters.skills.includes(skill)
                            ? 'bg-brand-blue text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="lg:w-3/4">
              {/* Stats and Controls */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">
                      {sortedJobs.length} jobs found
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Showing results for biometrics & data roles
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {/* Sort Options */}
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
                    >
                      <option value="recent">Most recent</option>
                      <option value="oldest">Oldest first</option>
                      <option value="salary-high">Salary: High to Low</option>
                      <option value="salary-low">Salary: Low to High</option>
                      <option value="title-asc">Title: A-Z</option>
                      <option value="title-desc">Title: Z-A</option>
                      <option value="company-asc">Company: A-Z</option>
                      <option value="company-desc">Company: Z-A</option>
                    </select>

                    {/* View Toggle */}
                    <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setViewMode('list')}
                        className={`px-3 py-2 text-sm ${
                          viewMode === 'list'
                            ? 'bg-brand-blue text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        List
                      </button>
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`px-3 py-2 text-sm ${
                          viewMode === 'grid'
                            ? 'bg-brand-blue text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Grid
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading jobs...</p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-800">{error}</p>
                  </div>
                  <button
                    onClick={fetchJobs}
                    className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Job Listings */}
              {!loading && !error && (
                <div className={`space-y-6 ${viewMode === 'grid' ? 'md:grid md:grid-cols-2 md:gap-6 md:space-y-0' : ''}`}>
                  {paginatedJobs.map((job) => (
                  <div
                    key={job.id}
                    className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${
                      job.featured ? 'ring-2 ring-brand-blue/20 border-brand-blue/30' : ''
                    }`}
                  >
                    {job.featured && (
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-t-lg text-center">
                        ⭐ FEATURED JOB
                      </div>
                    )}
                    <div className="p-6">
                      {/* Job Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 onClick={() => navigate(`/jobs/view/${job.id}`)} className="text-xl font-semibold text-gray-900 hover:text-brand-blue cursor-pointer">
                              {job.title}
                            </h3>
                            {job.featured && (
                              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                                Featured
                              </span>
                            )}
                          </div>
                          {job.show_company !== false && (
                            <p className="text-gray-600 font-medium mb-1">{job.company}</p>
                          )}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {job.location}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            job.work_mode === 'Remote' ? 'bg-green-100 text-green-800' :
                            job.work_mode === 'Hybrid' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {job.work_mode}
                          </span>
                        </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900 mb-1">{job.salary || 'Salary not specified'}</p>
                          <p className="text-sm text-gray-500">{job.contract}</p>
                        </div>
                      </div>

                      {/* Job Description (Rich Text) */}
                      <div
                        className="rte text-gray-800 mb-4 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: job.brief_description || job.description || '' }}
                      />

                      {/* Skills Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills && job.skills.length > 0 ? job.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium"
                          >
                            {skill}
                          </span>
                        )) : (
                          <span className="text-gray-400 text-sm">No skills specified</span>
                        )}
                      </div>

                      {/* Job Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            {job.specialism}
                          </span>
                          <span>Posted {getPostedTime(job.created_at)}</span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <button onClick={() => navigate(`/jobs/apply/${job.id}`)} className="bg-brand-blue hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-300 font-medium text-sm">
                            Apply
                          </button>
                          <button onClick={() => navigate(`/jobs/view/${job.id}`)} className="text-brand-blue hover:text-blue-700 font-medium text-sm transition-colors">
                            View details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              )}

              {/* Pagination */}
              {!loading && !error && sortedJobs.length > 0 && totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-all duration-300 font-medium border border-gray-300 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {getPaginationButtons().map((page, index) => (
                      page === '...' ? (
                        <span key={`ellipsis-${index}`} className="text-gray-500 px-2">...</span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            currentPage === page
                              ? 'bg-brand-blue text-white'
                              : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    ))}
                  </div>
                  
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-all duration-300 font-medium border border-gray-300 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Empty State Feature Section (Hidden when jobs exist) */}
      {!loading && !error && sortedJobs.length === 0 && (
        <section className="bg-white py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <h2 className="text-3xl font-light mb-6 text-gray-900">
                No jobs found matching your criteria
              </h2>
              
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Try adjusting your filters or search terms to find more opportunities.
              </p>

              {/* Helpful Tips */}
              <div className="bg-blue-50 rounded-lg p-6 mb-8 text-left">
                <h3 className="font-semibold text-gray-900 mb-4">Search Tips:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-brand-blue mt-1">•</span>
                    <span>Try broader keywords like "biostatistics" instead of specific terms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-blue mt-1">•</span>
                    <span>Remove location filters to see remote and hybrid opportunities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-blue mt-1">•</span>
                    <span>Consider both permanent and contract positions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-blue mt-1">•</span>
                    <span>Check back regularly as new jobs are posted daily</span>
                  </li>
                </ul>
              </div>

              {/* Top 5 Related Searches */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Popular job searches:</h3>
                <div className="flex flex-wrap gap-3 justify-center">
                  {['Senior Biostatistician', 'Clinical Data Manager', 'SAS Programmer', 'Bioinformatics Scientist', 'Medical Writer'].map((search, index) => (
                    <button
                      key={index}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm transition-all duration-300"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={clearAllFilters}
                className="bg-brand-blue hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-all duration-300 font-medium"
              >
                Clear all filters
              </button>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-gray-900">
              Frequently asked questions
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Common questions about finding and applying for life sciences jobs
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {[
                {
                  question: 'How do I apply for remote positions?',
                  answer: 'Many of our life sciences roles offer remote or hybrid options. Use the "Work Mode" filter to find remote positions, and check the job description for specific remote work policies and requirements.'
                },
                {
                  question: 'What is the typical recruitment process?',
                  answer: 'Our recruitment process typically takes 2-3 weeks and includes: initial application review, phone screening with our consultant, client interviews (usually 2-3 rounds), and offer negotiation. We support you throughout the entire process.'
                },
                {
                  question: 'How do I apply for jobs?',
                  answer: 'Simply click "Apply" on any job listing to submit your application. You can also create job alerts to be notified of new opportunities matching your criteria, or submit your CV for our consultants to review.'
                }
              ].map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                    <svg 
                      className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${openFaqIndex === index ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaqIndex === index && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-brand-blue py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-white">
              Ready to take the next step<br />
              in your career?
            </h2>
            <p className="text-gray-300 text-lg mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of life sciences professionals who have found their dream roles through our specialised recruitment platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/find-jobs')}
                className="bg-white hover:bg-gray-100 text-brand-blue px-8 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
              >
                Submit your CV
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <div className="flex items-center justify-between gap-4">
          <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </button>
          <button className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM3 12v5a2 2 0 002 2h5m0-14V3a2 2 0 012-2h5l5 5v2M9 21h6" />
            </svg>
            Alerts
          </button>
          <button 
            onClick={() => navigate('/find-jobs')}
            className="flex-1 bg-brand-blue hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Submit CV
          </button>
        </div>
      </div>
    </div>
  );
};

export default Jobs; 