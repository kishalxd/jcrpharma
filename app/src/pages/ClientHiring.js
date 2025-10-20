import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const ClientHiring = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect');
  const [formData, setFormData] = useState({
    personName: '',
    title: '',
    businessName: '',
    email: '',
    phone: '',
    location: '',
    roleOverview: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Submit form data to database
      const { data, error } = await supabase
        .from('hiring_requests')
        .insert({
          person_name: formData.personName,
          title: formData.title,
          business_name: formData.businessName,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          role_overview: formData.roleOverview,
          status: 'pending'
        })
        .select();

      if (error) {
        throw error;
      }

      console.log('Hiring request submitted successfully:', data);
      setSubmitMessage('Hiring request submitted successfully! We\'ll contact you soon to discuss your requirements.');
      
      // Reset form
      setFormData({
        personName: '',
        title: '',
        businessName: '',
        email: '',
        phone: '',
        location: '',
        roleOverview: ''
      });

      // Navigate back to appropriate page after a delay
      setTimeout(() => {
        if (redirectTo === 'admin-dashboard') {
          navigate('/admin-dashboard');
        } else {
          navigate('/');
        }
      }, 2000);

    } catch (error) {
      console.error('Error submitting hiring request:', error);
      setSubmitMessage(`Error submitting request: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Form Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-200">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
                Find the Perfect Talent
              </h2>
              <p className="text-gray-600 text-lg">
                Tell us about your hiring needs and we'll connect you with qualified life sciences professionals
              </p>
            </div>

            {/* Submit Message */}
            {submitMessage && (
              <div className={`p-4 rounded-lg text-center ${
                submitMessage.includes('Error') 
                  ? 'bg-red-50 text-red-700 border border-red-200' 
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}>
                {submitMessage}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Person Name */}
              <div>
                <label htmlFor="personName" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Full Name *
                </label>
                                 <input
                   type="text"
                   id="personName"
                   name="personName"
                   value={formData.personName}
                   onChange={handleInputChange}
                   required
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all duration-300"
                   placeholder="Enter your full name"
                 />
              </div>

              {/* Title and Business Name in a row */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Job Title *
                  </label>
                                     <input
                     type="text"
                     id="title"
                     name="title"
                     value={formData.title}
                     onChange={handleInputChange}
                     required
                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all duration-300"
                     placeholder="e.g., HR Director, Hiring Manager"
                   />
                </div>

                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all duration-300"
                    placeholder="Your company name"
                  />
                </div>
              </div>

              {/* Email and Phone in a row */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all duration-300"
                    placeholder="your.email@company.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all duration-300"
                    placeholder="+44 20 1234 5678"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all duration-300"
                  placeholder="e.g., London, UK or Berlin, Germany"
                />
              </div>

              {/* Role Overview */}
              <div>
                <label htmlFor="roleOverview" className="block text-sm font-medium text-gray-700 mb-2">
                  Brief Overview of the Role *
                </label>
                <textarea
                  id="roleOverview"
                  name="roleOverview"
                  value={formData.roleOverview}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all duration-300"
                  placeholder="e.g., Hi we're looking for a recruitment partner that can help us hire a statistical programmer for our clinical trials team in oncology research"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    if (redirectTo === 'admin-dashboard') {
                      navigate('/admin-dashboard');
                    } else {
                      navigate('/');
                    }
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                                 <button
                   type="submit"
                   disabled={isSubmitting}
                   className="flex-1 px-6 py-3 bg-brand-blue text-white rounded-lg hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md hover:shadow-lg"
                 >
                   {isSubmitting ? 'Submitting...' : 'Submit Request'}
                 </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientHiring; 