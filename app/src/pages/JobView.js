import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const JobView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJob = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
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

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job...</p>
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-light mb-2">{job.title}</h1>
              <div className="flex flex-wrap gap-3 text-sm text-gray-200">
                {job.show_company !== false && job.company && (
                  <span className="font-medium">{job.company}</span>
                )}
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
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
              <p className="text-lg font-semibold">{job.salary || 'Salary not specified'}</p>
              <p className="text-sm text-gray-200">{job.contract}</p>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button onClick={() => navigate(`/jobs/apply/${job.id}`)} className="bg-white text-brand-blue px-6 py-2 rounded-lg font-medium hover:bg-gray-100">Apply now</button>
            <button onClick={() => navigate('/jobs')} className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-medium border border-white/20">Back to jobs</button>
          </div>
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="container mx-auto px-6 max-w-4xl">
          {job.brief_description && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Brief description</h2>
              <p className="text-gray-700 leading-relaxed">{job.brief_description}</p>
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Full description</h2>
            <div className="rte text-gray-800" dangerouslySetInnerHTML={{ __html: job.full_description || job.description || '' }} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default JobView;


