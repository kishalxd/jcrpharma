import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import RichTextEditor from './RichTextEditor';

const JobManager = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [viewingJob, setViewingJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [applicantsCountByJobId, setApplicantsCountByJobId] = useState({});
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [downloadingCvId, setDownloadingCvId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    work_mode: 'Hybrid',
    contract: 'Permanent',
    salary: '',
    specialism: 'Biostatistics',
    seniority: 'Mid Level',
    brief_description: '',
    full_description: '',
    skills: [],
    featured: false,
    show_company: true,
    status: 'active'
  });

  const filterOptions = {
    specialism: ['Biostatistics', 'Clinical Data Management', 'Bioinformatics', 'Medical Affairs', 'Regulatory Affairs'],
    contract: ['Permanent', 'Contract', 'Interim'],
    seniority: ['Entry Level', 'Mid Level', 'Senior Level', 'Director Level', 'C-Suite'],
    work_mode: ['Remote', 'Hybrid', 'Onsite'],
    status: ['active', 'archived', 'draft']
  };

  const skillOptions = ['SAS', 'R', 'Python', 'SQL', 'CDISC', 'ADaM', 'SDTM', 'TLFs', 'EDC', 'Data Quality', 'Clinical Trials', 'GCP', 'NGS', 'Machine Learning', 'Genomics', 'Medical Communications', 'Oncology', 'Scientific Writing', 'FDA', 'CE Mark', 'Medical Devices', 'Regulatory Strategy'];

  // Fetch jobs from database
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
      // Fetch applicants count per job
      if (data && data.length > 0) {
        const countsEntries = await Promise.all(
          data.map(async (job) => {
            const { count, error: countError } = await supabase
              .from('job_applications')
              .select('*', { count: 'exact', head: true })
              .eq('job_id', job.id);
            if (countError) {
              return [job.id, 0];
            }
            return [job.id, count || 0];
          })
        );
        const map = Object.fromEntries(countsEntries);
        setApplicantsCountByJobId(map);
      } else {
        setApplicantsCountByJobId({});
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSkillToggle = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const jobData = {
        ...formData,
        created_at: editingJob ? editingJob.created_at : new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (editingJob) {
        const { error } = await supabase
          .from('jobs')
          .update(jobData)
          .eq('id', editingJob.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('jobs')
          .insert([jobData]);
        
        if (error) throw error;
      }

      setShowForm(false);
      setEditingJob(null);
      setFormData({
        title: '',
        company: '',
        location: '',
        work_mode: 'Hybrid',
        contract: 'Permanent',
        salary: '',
        specialism: 'Biostatistics',
        seniority: 'Mid Level',
        brief_description: '',
        full_description: '',
        skills: [],
        featured: false,
        show_company: true,
        status: 'active'
      });
      fetchJobs();
    } catch (error) {
      console.error('Error saving job:', error);
      alert('Error saving job: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title || '',
      company: job.company || '',
      location: job.location || '',
      work_mode: job.work_mode || 'Hybrid',
      contract: job.contract || 'Permanent',
      salary: job.salary || '',
      specialism: job.specialism || 'Biostatistics',
      seniority: job.seniority || 'Mid Level',
      brief_description: job.brief_description || '',
      full_description: job.full_description || job.description || '',
      skills: job.skills || [],
      featured: job.featured || false,
      show_company: job.show_company !== false, // Default to true if not set
      status: job.status || 'active'
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Error deleting job: ' + error.message);
    }
  };

  const handleArchive = async (id, currentStatus) => {
    const newStatus = currentStatus === 'archived' ? 'active' : 'archived';
    
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      fetchJobs();
    } catch (error) {
      console.error('Error updating job status:', error);
      alert('Error updating job status: ' + error.message);
    }
  };

  const fetchApplicantsForJob = async (jobId) => {
    setLoadingApplicants(true);
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('job_id', jobId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setApplicants(data || []);
    } catch (err) {
      console.error('Error fetching applicants:', err);
      setApplicants([]);
    } finally {
      setLoadingApplicants(false);
    }
  };

  const downloadCV = async (cvFileUrl, cvFileName, applicantId) => {
    try {
      setDownloadingCvId(applicantId || null);
      const { data, error } = await supabase.storage
        .from('cv-files')
        .download(cvFileUrl);
      if (error) throw error;
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = cvFileName || 'cv.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading CV:', error);
      alert('Error downloading CV file');
    } finally {
      setDownloadingCvId(null);
    }
  };

  const getFilteredAndSortedJobs = () => {
    let filtered = jobs;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(job => job.status === filterStatus);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'created_at' || sortBy === 'updated_at') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  const filteredJobs = getFilteredAndSortedJobs();

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800 border-green-200',
      archived: 'bg-gray-100 text-gray-800 border-gray-200',
      draft: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (showForm) {
    return (
      <div className="bg-white shadow-sm">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-black">
              {editingJob ? 'Edit Job' : 'Create New Job'}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingJob(null);
                setFormData({
                  title: '',
                  company: '',
                  location: '',
                  work_mode: 'Hybrid',
                  contract: 'Permanent',
                  salary: '',
                  specialism: 'Biostatistics',
                  seniority: 'Mid Level',
                  brief_description: '',
                  full_description: '',
                  skills: [],
        featured: false,
        show_company: true,
        status: 'active'
                });
              }}
              className="text-gray-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Company</label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="show_company"
                      checked={formData.show_company}
                      onChange={handleInputChange}
                      className="mr-2 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                    />
                    <label className="text-xs text-gray-600">Show company name</label>
                  </div>
                </div>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Salary</label>
                <input
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  placeholder="e.g., £80,000 - £95,000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                />
              </div>
            </div>

            {/* Job Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Job Details</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specialism *</label>
                <select
                  name="specialism"
                  value={formData.specialism}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                >
                  {filterOptions.specialism.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contract Type *</label>
                <select
                  name="contract"
                  value={formData.contract}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                >
                  {filterOptions.contract.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Seniority *</label>
                <select
                  name="seniority"
                  value={formData.seniority}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                >
                  {filterOptions.seniority.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Work Mode *</label>
                <select
                  name="work_mode"
                  value={formData.work_mode}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                >
                  {filterOptions.work_mode.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                >
                  {filterOptions.status.map(option => (
                    <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Descriptions */}
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brief Description</label>
              <textarea
                name="brief_description"
                value={formData.brief_description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Description (Rich Text)</label>
              <RichTextEditor
                value={formData.full_description}
                onChange={(html) => setFormData(prev => ({ ...prev, full_description: html }))}
                placeholder="Write the full job description..."
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills</label>
            <div className="flex flex-wrap gap-2">
              {skillOptions.map(skill => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleSkillToggle(skill)}
                  className={`px-3 py-1 rounded-full text-xs transition-all ${
                    formData.skills.includes(skill)
                      ? 'bg-brand-blue text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Featured */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleInputChange}
              className="mr-3 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
            />
            <label className="text-sm font-medium text-gray-700">Featured Job</label>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingJob(null);
                setFormData({
                  title: '',
                  company: '',
                  location: '',
                  work_mode: 'Hybrid',
                  contract: 'Permanent',
                  salary: '',
                  specialism: 'Biostatistics',
                  seniority: 'Mid Level',
                  brief_description: '',
                  full_description: '',
                  skills: [],
        featured: false,
        show_company: true,
        status: 'active'
                });
              }}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-brand-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : (editingJob ? 'Update Job' : 'Create Job')}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
              <option value="draft">Draft</option>
            </select>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
            >
              <option value="created_at-desc">Newest First</option>
              <option value="created_at-asc">Oldest First</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
              <option value="company-asc">Company A-Z</option>
            </select>
            <button
              onClick={() => setShowForm(true)}
              className="bg-brand-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add Job</span>
            </button>
            <button
              onClick={fetchJobs}
              disabled={loading}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-4 px-6 text-black font-medium text-sm">Job Title</th>
              <th className="text-left py-4 px-6 text-black font-medium text-sm">Company</th>
                  <th className="text-left py-4 px-6 text-black font-medium text-sm">Location</th>
                  <th className="text-left py-4 px-6 text-black font-medium text-sm">Work Mode</th>
                  <th className="text-left py-4 px-6 text-black font-medium text-sm">Applicants</th>
                  <th className="text-left py-4 px-6 text-black font-medium text-sm">Status</th>
                  <th className="text-left py-4 px-6 text-black font-medium text-sm">Featured</th>
                  <th className="text-left py-4 px-6 text-black font-medium text-sm">Created</th>
                  <th className="text-left py-4 px-6 text-black font-medium text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-8 px-6 text-center text-gray-500">
                  {loading ? 'Loading jobs...' : searchTerm || filterStatus !== 'all' ? 'No jobs match your search criteria' : 'No jobs found'}
                </td>
              </tr>
            ) : (
              filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50 transition-colors border-t border-gray-100">
                  <td className="py-4 px-6">
                    <div>
                      <div className="text-black font-medium text-sm">{job.title}</div>
                      <div className="text-gray-600 text-xs">{job.specialism} • {job.seniority}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600 text-sm">{job.company}</td>
                  <td className="py-4 px-6 text-gray-600 text-sm">{job.location}</td>
                  <td className="py-4 px-6 text-gray-600 text-sm">{job.work_mode}</td>
                <td className="py-4 px-6 text-gray-600 text-sm">
                  <div className="flex items-center gap-2">
                    <span>{applicantsCountByJobId[job.id] ?? 0}</span>
                    <button
                      onClick={() => { setViewingJob(job); fetchApplicantsForJob(job.id); }}
                      className="text-brand-blue hover:text-blue-700 text-sm font-medium"
                    >
                      View
                    </button>
                  </div>
                </td>
                  <td className="py-4 px-6">
                    <span className={`text-xs px-3 py-1 rounded-full border font-medium ${getStatusColor(job.status)}`}>
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {job.featured ? (
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                        Featured
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">-</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-gray-600 text-sm">
                    {new Date(job.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(job)}
                        className="text-brand-blue hover:text-blue-700 px-2 py-1 rounded text-sm font-medium"
                        title="Edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleArchive(job.id, job.status)}
                        className={`px-2 py-1 rounded text-sm font-medium ${
                          job.status === 'archived'
                            ? 'text-green-600 hover:text-green-700'
                            : 'text-orange-600 hover:text-orange-700'
                        }`}
                        title={job.status === 'archived' ? 'Unarchive' : 'Archive'}
                      >
                        {job.status === 'archived' ? 'Unarchive' : 'Archive'}
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="text-red-600 hover:text-red-700 px-2 py-1 rounded text-sm font-medium"
                        title="Delete"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Applicants Modal */}
      {viewingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Applicants</h3>
                <p className="text-sm text-gray-600">{viewingJob.title}</p>
              </div>
              <button onClick={() => { setViewingJob(null); setApplicants([]); }} className="text-gray-600 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6">
              {loadingApplicants ? (
                <div className="text-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-blue mx-auto mb-3"></div>
                  <p className="text-gray-600">Loading applicants...</p>
                </div>
              ) : applicants.length === 0 ? (
                <div className="text-center text-gray-600 py-10">No applicants yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 text-gray-900 text-sm font-medium">Name</th>
                        <th className="text-left py-3 px-4 text-gray-900 text-sm font-medium">Email</th>
                        <th className="text-left py-3 px-4 text-gray-900 text-sm font-medium">Location</th>
                        <th className="text-left py-3 px-4 text-gray-900 text-sm font-medium">Experience</th>
                        <th className="text-left py-3 px-4 text-gray-900 text-sm font-medium">Cover Letter</th>
                        <th className="text-left py-3 px-4 text-gray-900 text-sm font-medium">CV</th>
                        <th className="text-left py-3 px-4 text-gray-900 text-sm font-medium">Applied</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applicants.map((a) => (
                        <tr key={a.id} className="border-t border-gray-100">
                          <td className="py-3 px-4 text-gray-900 text-sm">{a.full_name}</td>
                          <td className="py-3 px-4 text-gray-700 text-sm">{a.email}</td>
                          <td className="py-3 px-4 text-gray-700 text-sm">{a.location || '-'}</td>
                          <td className="py-3 px-4 text-gray-700 text-sm">{a.experience_level || '-'}</td>
                          <td className="py-3 px-4">
                            {a.cover_letter ? (
                              <button onClick={() => setSelectedApplicant(a)} className="text-brand-blue hover:text-blue-700 text-sm font-medium">
                                View
                              </button>
                            ) : (
                              <span className="text-gray-400 text-sm">-</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {a.cv_file_url ? (
                              <button
                                onClick={() => downloadCV(a.cv_file_url, a.cv_file_name, a.id)}
                                disabled={downloadingCvId === a.id}
                                className={`text-sm font-medium flex items-center gap-2 ${downloadingCvId === a.id ? 'text-gray-400 cursor-not-allowed' : 'text-brand-blue hover:text-blue-700'}`}
                              >
                                {downloadingCvId === a.id ? (
                                  <>
                                    <svg className="animate-spin h-4 w-4 text-gray-400" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                    </svg>
                                    <span>Downloading...</span>
                                  </>
                                ) : (
                                  <span>Download CV</span>
                                )}
                              </button>
                            ) : (
                              <span className="text-gray-400 text-sm">No CV</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-gray-700 text-sm">{new Date(a.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 text-right">
              <button onClick={() => { setViewingJob(null); setApplicants([]); }} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Cover Letter Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Cover Letter</h3>
                <p className="text-sm text-gray-600">{selectedApplicant.full_name}</p>
              </div>
              <button onClick={() => setSelectedApplicant(null)} className="text-gray-600 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6">
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed text-sm">
                {selectedApplicant.cover_letter}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 text-right">
              <button onClick={() => setSelectedApplicant(null)} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobManager;
