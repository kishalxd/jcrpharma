import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Candidates = () => {
  const navigate = useNavigate();
  const [expandedFaq, setExpandedFaq] = useState(null);

  const featuredJobs = [
    {
      id: 1,
      title: 'Senior Biostatistician - Oncology',
      company: 'Global Pharma Inc.',
      location: 'London, UK',
      workMode: 'Hybrid',
      salary: '£80,000 - £95,000',
      posted: '2 days ago',
      skills: ['SAS', 'R', 'CDISC', 'Oncology']
    },
    {
      id: 2,
      title: 'Principal Bioinformatics Scientist',
      company: 'Genomics Research Ltd',
      location: 'Oxford, UK',
      workMode: 'Remote',
      salary: '£90,000 - £110,000',
      posted: '3 days ago',
      skills: ['Python', 'NGS', 'Machine Learning']
    },
    {
      id: 3,
      title: 'Clinical Data Manager',
      company: 'BioTech Solutions',
      location: 'Cambridge, UK',
      workMode: 'Onsite',
      salary: '£450 - £550 per day',
      posted: '1 day ago',
      skills: ['EDC', 'Data Quality', 'GCP']
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'Senior Biostatistician',
      company: 'PharmaCorp',
      content: 'JCR helped me transition from CRO to pharma seamlessly. Their understanding of the biometrics space is unmatched.',
      image: '/testimonial1.jpg'
    },
    {
      id: 2,
      name: 'Dr. Michael Roberts',
      role: 'Principal Data Scientist',
      company: 'BioTech Innovations',
      content: 'The team at JCR truly understands what candidates need. They found me the perfect role that aligned with my career goals.',
      image: '/testimonial2.jpg'
    },
    {
      id: 3,
      name: 'Emma Thompson',
      role: 'Clinical Programmer',
      company: 'Global Research',
      content: 'Professional, honest, and genuinely caring. JCR made my job search stress-free and successful.',
      image: '/testimonial3.jpg'
    }
  ];

  const faqs = [
    {
      question: 'How does JCR find the right opportunities for me?',
      answer: 'We use our deep industry knowledge and extensive network to match your skills, experience, and career goals with the best opportunities in biometrics and life sciences.'
    },
    {
      question: 'What types of roles do you specialize in?',
      answer: 'We focus on biostatistics, clinical data management, bioinformatics, statistical programming, and related life sciences roles across pharmaceutical, biotech, and CRO sectors.'
    },
    {
      question: 'Is there a fee for candidates?',
      answer: 'No, our services are completely free for candidates. We are paid by our client companies when we successfully place candidates.'
    },
    {
      question: 'How long does the placement process typically take?',
      answer: 'Our average placement time is 14 days, though this can vary depending on role complexity and your specific requirements.'
    },
    {
      question: 'Do you work with candidates at all experience levels?',
      answer: 'Yes, we work with candidates from entry-level to C-suite positions across all experience levels in our specialized areas.'
    }
  ];

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Header Section */}
      <section className="bg-brand-blue text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-light mb-8 leading-tight">
              Your next role in<br />biometrics
            </h1>
            <p className="text-gray-300 text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
              Connect with leading pharmaceutical and biotech organizations. 
              Find your perfect role with specialized recruitment experts who understand your field.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/find-jobs')}
                className="bg-white text-brand-blue hover:bg-gray-100 px-8 py-3 rounded-full transition-all duration-300 font-medium"
              >
                Upload Your CV
              </button>
              <button 
                onClick={() => navigate('/jobs')}
                className="text-white hover:bg-white/10 px-8 py-3 rounded-full transition-all duration-300 font-medium border border-white/30"
              >
                Browse Jobs
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-gray-900">
              How it works
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Our streamlined recruitment process helps you find the perfect role efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-blue/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4 text-gray-900">1. Submit Your Profile</h3>
              <p className="text-gray-600 leading-relaxed">
                Upload your CV and tell us about your career goals. Our experts will review 
                your profile and understand your aspirations.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4 text-gray-900">2. We Find Matches</h3>
              <p className="text-gray-600 leading-relaxed">
                Using our industry expertise and network, we identify opportunities 
                that align with your skills and career objectives.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-brand-blue/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4 text-gray-900">3. Get Placed</h3>
              <p className="text-gray-600 leading-relaxed">
                We guide you through the interview process and support you 
                until you secure your ideal position.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-gray-900">
              Featured opportunities
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Discover the latest roles from our partner organizations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-12">
            {featuredJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{job.title}</h3>
                    <p className="text-brand-blue font-medium mb-1">{job.company}</p>
                    <p className="text-gray-600 text-sm">{job.location} • {job.workMode}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-lg font-medium text-gray-900 mb-2">{job.salary}</p>
                  <p className="text-gray-500 text-sm">Posted {job.posted}</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.map((skill, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>

                <button className="w-full bg-brand-blue text-white hover:bg-blue-700 py-2 px-4 rounded-lg transition-colors duration-300">
                  Apply Now
                </button>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button 
              onClick={() => navigate('/jobs')}
              className="bg-brand-blue text-white hover:bg-blue-700 px-8 py-3 rounded-full transition-colors duration-300 font-medium"
            >
              View All Jobs
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Section - Salary Guides Teaser */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-gray-900">
              Know your worth
            </h2>
            <p className="text-gray-600 text-lg mb-12 max-w-3xl mx-auto leading-relaxed">
              Access our comprehensive salary guides for life sciences professionals. 
              Stay informed about market rates across different specialisms and experience levels.
            </p>
            
            <div className="bg-gradient-to-br from-brand-blue to-blue-700 text-white rounded-lg p-8 mb-8">
              <div className="flex items-center justify-center mb-6">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-medium mb-4">2025 Life Sciences Salary Guide</h3>
              <p className="text-blue-100 mb-6">
                Comprehensive data on salaries across biostatistics, clinical data management, 
                and bioinformatics roles in the UK and EU markets.
              </p>
              <button className="bg-white text-brand-blue hover:bg-gray-100 px-6 py-3 rounded-full transition-all duration-300 font-medium">
                Download Free Guide
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Get Started CTA Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-gray-900">
              Get started today
            </h2>
            <p className="text-gray-600 text-lg mb-12 max-w-3xl mx-auto leading-relaxed">
              Submit your CV and preferences to receive personalized job alerts and opportunities from leading life sciences organizations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/find-jobs')}
                className="bg-brand-blue text-white hover:bg-blue-700 px-8 py-3 rounded-full transition-all duration-300 font-medium"
              >
                Submit Your Profile
              </button>
              <button 
                onClick={() => navigate('/jobs')}
                className="text-gray-900 hover:bg-gray-900/10 px-8 py-3 rounded-full transition-all duration-300 font-medium border border-gray-300 hover:border-gray-400"
              >
                Browse Jobs First
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-gray-900">
              Success stories
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Hear from professionals who found their dream roles through JCR
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden mr-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-brand-blue/10 rounded-full flex items-center justify-center" style={{display: 'none'}}>
                      <span className="text-sm font-medium text-brand-blue">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-sm text-brand-blue">{testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-gray-900">
                Frequently asked questions
              </h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                Common questions from candidates about our recruitment process
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left p-6 flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                  >
                    <h3 className="text-lg font-medium text-gray-900 pr-4">{faq.question}</h3>
                    <svg
                      className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${expandedFaq === index ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Global CTA Section */}
      <section className="bg-brand-blue py-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-white">
              Ready to advance your career?
            </h2>
            <p className="text-gray-300 text-lg mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of life sciences professionals who have found their ideal roles through JCR. 
              Let our expertise work for you.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/find-jobs')}
                className="bg-white text-brand-blue hover:bg-gray-100 px-8 py-3 rounded-full transition-all duration-300 font-medium"
              >
                Upload Your CV
              </button>
              <button 
                onClick={() => navigate('/jobs')}
                className="text-white hover:bg-white/10 px-8 py-3 rounded-full transition-all duration-300 font-medium border border-white/30"
              >
                Browse All Jobs
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Candidates; 