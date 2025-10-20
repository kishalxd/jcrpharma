import React, { useState } from 'react';

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

  const jobListings = [
    {
      id: 1,
      title: 'Senior Biostatistician - Oncology',
      company: 'Global Pharma Inc.',
      location: 'London, UK',
      workMode: 'Hybrid',
      contract: 'Permanent',
      salary: '£80,000 - £95,000',
      posted: '2 days ago',
      specialism: 'Biostatistics',
      seniority: 'Senior Level',
      description: 'Lead statistical programming and analysis for Phase III oncology trials. Expertise in SAS, R, and CDISC standards required.',
      skills: ['SAS', 'R', 'CDISC', 'Oncology', 'Phase III'],
      featured: true
    },
    {
      id: 2,
      title: 'Clinical Data Manager',
      company: 'BioTech Solutions',
      location: 'Cambridge, UK',
      workMode: 'Onsite',
      contract: 'Contract',
      salary: '£450 - £550 per day',
      posted: '1 day ago',
      specialism: 'Clinical Data Management',
      seniority: 'Mid Level',
      description: 'Manage clinical trial databases and ensure data quality across multiple therapeutic areas.',
      skills: ['EDC', 'Data Quality', 'Clinical Trials', 'GCP'],
      featured: false
    },
    {
      id: 3,
      title: 'Principal Bioinformatics Scientist',
      company: 'Genomics Research Ltd',
      location: 'Oxford, UK',
      workMode: 'Remote',
      contract: 'Permanent',
      salary: '£90,000 - £110,000',
      posted: '3 days ago',
      specialism: 'Bioinformatics',
      seniority: 'Senior Level',
      description: 'Drive computational biology initiatives for precision medicine programs. NGS analysis and machine learning experience essential.',
      skills: ['Python', 'NGS', 'Machine Learning', 'Genomics'],
      featured: true
    },
    {
      id: 4,
      title: 'Statistical Programmer - CDISC',
      company: 'CRO Excellence',
      location: 'Manchester, UK',
      workMode: 'Hybrid',
      contract: 'Permanent',
      salary: '£55,000 - £70,000',
      posted: '5 days ago',
      specialism: 'Biostatistics',
      seniority: 'Mid Level',
      description: 'Develop and validate statistical programming deliverables for regulatory submissions.',
      skills: ['SAS', 'CDISC', 'ADaM', 'SDTM'],
      featured: false
    },
    {
      id: 5,
      title: 'Medical Science Liaison',
      company: 'International Pharma',
      location: 'Edinburgh, UK',
      workMode: 'Hybrid',
      contract: 'Permanent',
      salary: '£75,000 - £85,000',
      posted: '1 week ago',
      specialism: 'Medical Affairs',
      seniority: 'Senior Level',
      description: 'Provide scientific support and medical expertise for oncology portfolio across UK and Ireland.',
      skills: ['Medical Communications', 'Oncology', 'Scientific Writing'],
      featured: false
    },
    {
      id: 6,
      title: 'Regulatory Affairs Director',
      company: 'MedDevice Corp',
      location: 'London, UK',
      workMode: 'Onsite',
      contract: 'Permanent',
      salary: '£120,000 - £140,000',
      posted: '1 week ago',
      specialism: 'Regulatory Affairs',
      seniority: 'Director Level',
      description: 'Lead regulatory strategy for medical device submissions across EU and US markets.',
      skills: ['FDA', 'CE Mark', 'Medical Devices', 'Regulatory Strategy'],
      featured: true
    }
  ];

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
    return jobListings.filter(job => {
      // Apply filters here - simplified for demo
      return true;
    });
  };

  const getSortedJobs = (jobs) => {
    switch (sortBy) {
      case 'salary-high':
        return [...jobs].sort((a, b) => {
          const aMax = parseInt(a.salary.match(/£(\d+),?(\d+)?/)?.[1] || '0');
          const bMax = parseInt(b.salary.match(/£(\d+),?(\d+)?/)?.[1] || '0');
          return bMax - aMax;
        });
      case 'salary-low':
        return [...jobs].sort((a, b) => {
          const aMax = parseInt(a.salary.match(/£(\d+),?(\d+)?/)?.[1] || '0');
          const bMax = parseInt(b.salary.match(/£(\d+),?(\d+)?/)?.[1] || '0');
          return aMax - bMax;
        });
      default:
        return jobs;
    }
  };

  const filteredJobs = getFilteredJobs();
  const sortedJobs = getSortedJobs(filteredJobs);

  return (
    <div className="min-h-screen">
      {/* Hero Header Section */}
      <section className="bg-brand-blue">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center text-white mb-16">
            <h1 className="text-5xl md:text-6xl font-light mb-8 leading-tight">
              Find your next role in<br />
              biometrics & data
            </h1>
            <p className="text-gray-300 text-lg md:text-xl mb-12 max-w-4xl mx-auto leading-relaxed">
              Discover specialized opportunities in biostatistics, clinical data management, bioinformatics,<br />
              and medical affairs across leading life-sciences companies.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-4xl mx-auto mb-12">
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <input
                      type="text"
                      placeholder="Job title, keyword, or skill"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:border-white/50 focus:bg-white/30 transition-all"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <input
                      type="text"
                      placeholder="Location"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:border-white/50 focus:bg-white/30 transition-all"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <button className="w-full bg-white hover:bg-gray-100 text-brand-blue px-6 py-3 rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-xl">
                      Search Jobs
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Popular Search Chips */}
            <div className="max-w-4xl mx-auto">
              <p className="text-gray-300 text-sm mb-4">Popular searches:</p>
              <div className="flex flex-wrap gap-3 justify-center">
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm transition-all duration-300 backdrop-blur-sm"
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
      <section className="bg-gray-50 py-12">
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
                      <option value="salary-high">Salary: High to Low</option>
                      <option value="salary-low">Salary: Low to High</option>
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

              {/* Job Listings */}
              <div className={`space-y-6 ${viewMode === 'grid' ? 'md:grid md:grid-cols-2 md:gap-6 md:space-y-0' : ''}`}>
                {sortedJobs.map((job) => (
                  <div
                    key={job.id}
                    className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${
                      job.featured ? 'ring-2 ring-brand-blue/20 border-brand-blue/30' : ''
                    }`}
                  >
                    <div className="p-6">
                      {/* Job Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-gray-900 hover:text-brand-blue cursor-pointer">
                              {job.title}
                            </h3>
                            {job.featured && (
                              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 font-medium mb-1">{job.company}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {job.location}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              job.workMode === 'Remote' ? 'bg-green-100 text-green-800' :
                              job.workMode === 'Hybrid' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {job.workMode}
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900 mb-1">{job.salary}</p>
                          <p className="text-sm text-gray-500">{job.contract}</p>
                        </div>
                      </div>

                      {/* Job Description */}
                      <p className="text-gray-600 mb-4 leading-relaxed">{job.description}</p>

                      {/* Skills Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Job Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            {job.specialism}
                          </span>
                          <span>Posted {job.posted}</span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <button className="text-gray-400 hover:text-gray-600 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </button>
                          
                          <button className="bg-brand-blue hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-300 font-medium text-sm">
                            Apply
                          </button>
                          
                          <button className="text-brand-blue hover:text-blue-700 font-medium text-sm transition-colors">
                            View details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center gap-4 mt-8">
                <button className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-all duration-300 font-medium border border-gray-300 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed">
                  Previous
                </button>
                
                <div className="flex items-center gap-2">
                  <button className="bg-brand-blue text-white px-3 py-2 rounded-lg text-sm font-medium">1</button>
                  <button className="bg-white hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium border border-gray-300">2</button>
                  <button className="bg-white hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium border border-gray-300">3</button>
                  <span className="text-gray-500 px-2">...</span>
                  <button className="bg-white hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium border border-gray-300">12</button>
                </div>
                
                <button className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-all duration-300 font-medium border border-gray-300 hover:border-gray-400">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Empty State Feature Section (Hidden when jobs exist) */}
      {sortedJobs.length === 0 && (
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
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
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
              Join thousands of life sciences professionals who have found their dream roles through our specialized recruitment platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white hover:bg-gray-100 text-brand-blue px-8 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl font-medium">
                Submit your CV
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full transition-all duration-300 backdrop-blur-md shadow-[0_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.2)] font-medium border border-white/20">
                Talk to a consultant
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky CTA Bar for Desktop */}
      <div className="hidden lg:block fixed bottom-6 right-6 z-50">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 mb-1">Stay updated</p>
              <p className="text-xs text-gray-600">Get notified of new opportunities</p>
            </div>
            <div className="flex gap-2">
              <button className="bg-brand-blue hover:bg-blue-700 text-white px-3 py-2 rounded text-xs font-medium transition-all">
                Create alert
              </button>
              <button className="text-brand-blue hover:text-blue-700 px-3 py-2 rounded text-xs font-medium transition-all border border-brand-blue hover:border-blue-700">
                Submit CV
              </button>
            </div>
          </div>
        </div>
      </div>

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
          <button className="flex-1 bg-brand-blue hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2">
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