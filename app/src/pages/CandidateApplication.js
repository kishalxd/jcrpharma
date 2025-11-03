import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { sendEmailNotification } from '../utils/emailUtils';

const CandidateApplication = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect');
  const [formData, setFormData] = useState({
    fullName: '',
    location: '',
    email: '',
    phone: '',
    cv: null,
    message: ''
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

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      cv: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      let cvFileUrl = null;
      let cvFileName = null;

      // Upload CV file if provided
      if (formData.cv) {
        const fileExt = formData.cv.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('cv-files')
          .upload(fileName, formData.cv);

        if (uploadError) {
          throw new Error(`File upload failed: ${uploadError.message}`);
        }

        cvFileUrl = uploadData.path;
        cvFileName = formData.cv.name;
      }

      // Submit form data to database
      const { data, error } = await supabase
        .from('employee_applications')
        .insert({
          full_name: formData.fullName,
          location: formData.location,
          email: formData.email,
          phone: formData.phone,
          cv_file_name: cvFileName,
          cv_file_url: cvFileUrl,
          message: formData.message,
          status: 'pending'
        })
        .select();

      if (error) {
        throw error;
      }

      console.log('Application submitted successfully:', data);
      
      // Send email notification
      const emailTitle = 'New Candidate Application Submitted';
      const emailBody = `A new candidate application has been submitted:\n\n` +
        `Name: ${formData.fullName}\n` +
        `Email: ${formData.email}\n` +
        `Phone: ${formData.phone}\n` +
        `Location: ${formData.location}\n` +
        `Message: ${formData.message}\n` +
        `${cvFileName ? `CV: ${cvFileName}` : 'No CV uploaded'}`;
      
      await sendEmailNotification(emailTitle, emailBody);
      
      setSubmitMessage('Application submitted successfully! We\'ll be in touch soon.');
      
      // Reset form
      setFormData({
        fullName: '',
        location: '',
        email: '',
        phone: '',
        cv: null,
        message: ''
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
      console.error('Error submitting application:', error);
      setSubmitMessage(`Error submitting application: ${error.message}`);
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
                Find Your Next Opportunity
              </h2>
              <p className="text-gray-600 text-lg">
                Complete the form below and we'll connect you with relevant life sciences positions
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
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                                 <input
                   type="text"
                   id="fullName"
                   name="fullName"
                   value={formData.fullName}
                   onChange={handleInputChange}
                   required
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all duration-300"
                   placeholder="Enter your full name"
                 />
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
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

              {/* Email and Phone in a row */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                                     <input
                     type="email"
                     id="email"
                     name="email"
                     value={formData.email}
                     onChange={handleInputChange}
                     required
                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all duration-300"
                     placeholder="your.email@example.com"
                   />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                                     <input
                     type="tel"
                     id="phone"
                     name="phone"
                     value={formData.phone}
                     onChange={handleInputChange}
                     required
                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all duration-300"
                     placeholder="+44 7123 456789"
                   />
                </div>
              </div>

              {/* CV Upload */}
              <div>
                <label htmlFor="cv" className="block text-sm font-medium text-gray-700 mb-2">
                  CV/Resume *
                </label>
                                 <input
                   type="file"
                   id="cv"
                   name="cv"
                   onChange={handleFileChange}
                   required
                   accept=".pdf,.doc,.docx"
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-blue/10 file:text-brand-blue hover:file:bg-brand-blue/20"
                 />
                <p className="text-sm text-gray-500 mt-1">
                  Accepted formats: PDF, DOC, DOCX (Max 5MB)
                </p>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Brief Message About What You're Looking For *
                </label>
                                 <textarea
                   id="message"
                   name="message"
                   value={formData.message}
                   onChange={handleInputChange}
                   required
                   rows={4}
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all duration-300"
                   placeholder="e.g., I'm a statistical programmer, looking for a new opportunity in Germany as a Senior Stat Programmer in Biotech's"
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
                   {isSubmitting ? 'Submitting...' : 'Submit Application'}
                 </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateApplication;