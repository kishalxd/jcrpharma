import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { sendEmailNotification } from '../utils/emailUtils';

const JobApply = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    location: '',
    cover_letter: '',
    experience_level: ''
  });
  const [cvFile, setCvFile] = useState(null);

  const fetchJob = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('id,title,company,show_company,location,work_mode,contract')
        .eq('id', id)
        .single();

      if (error) throw error;
      setJob(data);
    } catch (err) {
      console.error('Error loading job:', err);
      setError('Failed to load job.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (!cvFile) {
        setError('Please upload your CV.');
        setSubmitting(false);
        return;
      }

      // Upload CV to Supabase Storage
      const fileExt = cvFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `${job?.id || 'unassigned'}/${fileName}`;

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('cv-files')
        .upload(filePath, cvFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { error } = await supabase
        .from('job_applications')
        .insert([
          {
            full_name: form.full_name,
            email: form.email,
            location: form.location,
            cover_letter: form.cover_letter,
            job_id: job?.id,
            experience_level: form.experience_level || null,
            cv_file_url: uploadData?.path || filePath,
            cv_file_name: cvFile.name,
            status: 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]);
      
      if (error) {
        // Fallback: if column experience_level doesn't exist, retry without it
        if (String(error.message || '').toLowerCase().includes('column') && String(error.message || '').toLowerCase().includes('does not exist')) {
          const { error: retryError } = await supabase
            .from('job_applications')
            .insert([
              {
                full_name: form.full_name,
                email: form.email,
                location: form.location,
                cover_letter: form.cover_letter,
                job_id: job?.id,
                cv_file_url: uploadData?.path || filePath,
                cv_file_name: cvFile.name,
                status: 'pending',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            ]);
          if (retryError) throw retryError;
        } else {
          throw error;
        }
      }
      
      // Send email notification
      const emailTitle = `New Job Application - ${job.title}`;
      const emailBody = `A new job application has been submitted:\n\n` +
        `Job Title: ${job.title}\n` +
        `Company: ${job.show_company !== false && job.company ? job.company : 'Not specified'}\n` +
        `Location: ${job.location}\n` +
        `Applicant Name: ${form.full_name}\n` +
        `Applicant Email: ${form.email}\n` +
        `Applicant Location: ${form.location || 'Not specified'}\n` +
        `Experience Level: ${form.experience_level || 'Not specified'}\n` +
        `Cover Letter: ${form.cover_letter || 'None provided'}\n` +
        `CV: ${cvFile.name}`;
      
      await sendEmailNotification(emailTitle, emailBody);
      
      setSuccess(true);
      setTimeout(() => navigate('/jobs'), 1500);
    } catch (err) {
      console.error('Error submitting application:', err);
      setError('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800 mb-4">{error || 'Job not found.'}</p>
          <button onClick={() => navigate('/jobs')} className="bg-brand-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">Back to jobs</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="bg-brand-blue">
        <div className="container mx-auto px-6 py-10 text-white">
          <h1 className="text-3xl md:text-4xl font-light mb-2">Apply for {job.title}</h1>
          <p className="text-gray-200">
            {job.show_company !== false && job.company ? `${job.company} • ` : ''}{job.location} • {job.contract} • {job.work_mode}
          </p>
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="container mx-auto px-6 max-w-3xl">
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-green-800">Application submitted successfully.</div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-800">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full name *</label>
              <input name="full_name" value={form.full_name} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input name="location" value={form.location} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Years of experience *</label>
              <select name="experience_level" value={form.experience_level} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue">
                <option value="">Select experience</option>
                <option value="Fresher">Fresher</option>
                <option value="1-2 years">1-2 years</option>
                <option value="3-5 years">3-5 years</option>
                <option value="6-10 years">6-10 years</option>
                <option value=">10 years">10+ years</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload CV (PDF/DOC/DOCX) *</label>
              <input type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(e) => setCvFile(e.target.files?.[0] || null)} required className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-blue file:text-white hover:file:bg-blue-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cover letter</label>
              <textarea name="cover_letter" value={form.cover_letter} onChange={handleChange} rows="5" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"></textarea>
            </div>
            <div className="flex items-center gap-3">
              <button type="submit" disabled={submitting} className="bg-brand-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">{submitting ? 'Submitting...' : 'Submit application'}</button>
              <button type="button" onClick={() => navigate(`/jobs/view/${job.id}`)} className="text-brand-blue hover:text-blue-700 px-3 py-2">Back to job</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default JobApply;


