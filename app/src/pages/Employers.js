import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Employers = () => {
  const navigate = useNavigate();
  const [activeQuestion, setActiveQuestion] = useState(null);

  const toggleQuestion = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  const faqData = [
    {
      question: "What is your average time-to-hire for specialized roles?",
      answer: "Our average time-to-hire is 14 days for most specialized biometrics and data science roles. For senior positions, we typically deliver qualified candidates within 21 days."
    },
    {
      question: "Do you provide candidates with regulatory compliance experience?",
      answer: "Yes, all our candidates are pre-screened for regulatory compliance knowledge including FDA, EMA, and ICH guidelines relevant to their specialization."
    },
    {
      question: "What geographical markets do you cover?",
      answer: "We provide talent across UK, EU, and US markets with deep expertise in local regulatory requirements and market conditions."
    },
    {
      question: "What is your candidate retention rate?",
      answer: "We maintain a 92% candidate retention rate at 12 months, demonstrating our thorough vetting process and cultural fit assessment."
    },
    {
      question: "Do you offer contract and permanent placements?",
      answer: "Yes, we provide both contract and permanent placement solutions, tailored to your specific project needs and organizational requirements."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-brand-blue text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-light mb-8 leading-tight">
              Hire biometrics & data talent, fast
            </h1>
            <p className="text-gray-300 text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
              Access pre-vetted specialists in biostatistics, clinical data management, and bioinformatics. 
              14-day average placement with 92% success rate.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button 
                onClick={() => navigate('/hire-talent')}
                className="bg-white text-brand-blue hover:bg-gray-100 px-8 py-3 rounded-full transition-all duration-300 font-medium"
              >
                Post a role
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full transition-all duration-300 backdrop-blur-md font-medium border border-white/30">
                View our process
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features List Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-gray-600 text-sm uppercase tracking-wide mb-4">Our USPs</p>
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-gray-900">
              Why leading companies choose us
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Specialized recruitment that delivers speed, quality, compliance, and global reach
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {/* Speed */}
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-blue/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4 text-gray-900">Speed</h3>
              <p className="text-gray-600 leading-relaxed">
                14-day average placement with streamlined processes and pre-qualified talent pools
              </p>
            </div>

            {/* Quality */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4 text-gray-900">Quality</h3>
              <p className="text-gray-600 leading-relaxed">
                Rigorous technical assessment and cultural fit evaluation for long-term success
              </p>
            </div>

            {/* Compliance */}
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-blue/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4 text-gray-900">Compliance</h3>
              <p className="text-gray-600 leading-relaxed">
                All candidates pre-screened for regulatory knowledge and industry certifications
              </p>
            </div>

            {/* Reach */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4 text-gray-900">Global Reach</h3>
              <p className="text-gray-600 leading-relaxed">
                Extensive network across UK, EU, and US markets with local expertise
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-gray-600 text-sm uppercase tracking-wide mb-4">Our process</p>
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-gray-900">
              How we deliver exceptional results
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Detailed process with guaranteed SLAs and transparent communication
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Step 1 */}
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-brand-blue text-white rounded-full flex items-center justify-center font-medium mr-4">
                  1
                </div>
                <h3 className="text-xl font-medium text-gray-900">Requirement Analysis</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Detailed consultation to understand your specific needs, team dynamics, and technical requirements.
              </p>
              <div className="text-sm text-brand-blue font-medium">
                SLA: 24 hours response
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-brand-blue text-white rounded-full flex items-center justify-center font-medium mr-4">
                  2
                </div>
                <h3 className="text-xl font-medium text-gray-900">Candidate Sourcing</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Leveraging our network and advanced screening to identify top-tier candidates matching your criteria.
              </p>
              <div className="text-sm text-brand-blue font-medium">
                SLA: 5 business days for shortlist
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-brand-blue text-white rounded-full flex items-center justify-center font-medium mr-4">
                  3
                </div>
                <h3 className="text-xl font-medium text-gray-900">Interview & Placement</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Coordinated interview process with feedback and support through to successful placement and onboarding.
              </p>
              <div className="text-sm text-brand-blue font-medium">
                SLA: 14 days average placement
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-gray-600 text-sm uppercase tracking-wide mb-4">Global presence</p>
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-gray-900">
              Coverage across key markets
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Strategic presence in major life-sciences hubs with local market expertise
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
            {/* Map Placeholder */}
            <div className="order-2 lg:order-1">
              <div className="bg-gray-200 rounded-lg aspect-[4/3] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Global Coverage Map</p>
                </div>
              </div>
            </div>

            {/* Locations List */}
            <div className="order-1 lg:order-2 space-y-8">
              <div>
                <h3 className="text-2xl font-medium text-gray-900 mb-4">United Kingdom</h3>
                <p className="text-gray-600 mb-3">London, Cambridge, Oxford, Manchester</p>
                <p className="text-sm text-gray-500">Hub for European pharmaceutical and biotech innovation</p>
              </div>

              <div>
                <h3 className="text-2xl font-medium text-gray-900 mb-4">European Union</h3>
                <p className="text-gray-600 mb-3">Basel, Amsterdam, Dublin, Berlin</p>
                <p className="text-sm text-gray-500">Access to major pharmaceutical headquarters and research centers</p>
              </div>

              <div>
                <h3 className="text-2xl font-medium text-gray-900 mb-4">United States</h3>
                <p className="text-gray-600 mb-3">Boston, San Francisco, Research Triangle, New York</p>
                <p className="text-sm text-gray-500">Coverage of key biotech clusters and FDA regulatory expertise</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-gray-600 text-sm uppercase tracking-wide mb-4">Success stories</p>
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-gray-900">
              Employer case studies
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Real results from leading pharmaceutical and biotech companies
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Case Study 1 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="h-48 bg-brand-blue/10 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 bg-brand-blue/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6 text-brand-blue" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                    </svg>
                  </div>
                  <p className="text-brand-blue text-sm">Global Pharma Co.</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium mb-3 text-gray-900">
                  Rapid biostatistics team scaling
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Delivered 12 senior biostatisticians in 3 weeks for critical Phase III trial analysis
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-brand-blue font-medium">12 placements</span>
                  <span className="text-gray-500">3 weeks</span>
                </div>
              </div>
            </div>

            {/* Case Study 2 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                    </svg>
                  </div>
                  <p className="text-gray-700 text-sm">Biotech Startup</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium mb-3 text-gray-900">
                  Data management infrastructure
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Built complete clinical data management team from zero to full operation
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 font-medium">8 specialists</span>
                  <span className="text-gray-500">6 weeks</span>
                </div>
              </div>
            </div>

            {/* Case Study 3 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="h-48 bg-brand-blue/10 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 bg-brand-blue/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6 text-brand-blue" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                    </svg>
                  </div>
                  <p className="text-brand-blue text-sm">Research Institute</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium mb-3 text-gray-900">
                  Bioinformatics capability expansion
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Enhanced computational biology team with specialized genomics expertise
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-brand-blue font-medium">5 experts</span>
                  <span className="text-gray-500">4 weeks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20" style={{backgroundColor: '#d7e5fd'}}>
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="flex items-center justify-center space-x-2 text-gray-800 mb-8">
                <div className="w-8 h-8 bg-brand-blue transform rotate-45"></div>
                <span className="text-2xl font-semibold">PharmaCorp</span>
              </div>
            </div>

            <blockquote className="text-2xl md:text-3xl font-light text-gray-900 mb-12 leading-relaxed">
              "The quality of candidates and speed of delivery exceeded our expectations. We filled critical biostatistics roles in half the time of traditional recruiters."
            </blockquote>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-brand-blue/20 rounded-full mb-4 flex items-center justify-center">
                <div className="w-12 h-12 bg-brand-blue/40 rounded-full"></div>
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-1">Sarah Johnson</h4>
              <p className="text-gray-600">VP of Clinical Operations, PharmaCorp</p>
            </div>
          </div>
        </div>
      </section>

      {/* Get Started CTA Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-gray-900">
              Tell us about your hiring needs
            </h2>
            <p className="text-gray-600 text-lg mb-12 max-w-3xl mx-auto leading-relaxed">
              Submit your requirements and we'll provide a tailored recruitment strategy within 24 hours. Connect with specialized talent across biostatistics, clinical data management, and bioinformatics.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/hire-talent')}
                className="bg-brand-blue text-white hover:bg-blue-700 px-8 py-3 rounded-full transition-all duration-300 font-medium"
              >
                Submit Your Requirements
              </button>
              <button 
                onClick={() => navigate('/jobs')}
                className="text-gray-900 hover:bg-gray-900/10 px-8 py-3 rounded-full transition-all duration-300 font-medium border border-gray-300 hover:border-gray-400"
              >
                View Talent Pool
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-gray-900">
              Frequently asked questions
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Everything you need to know about our hiring process
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqData.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm">
                <button
                  className="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none"
                  onClick={() => toggleQuestion(index)}
                >
                  <span className="text-lg font-medium text-gray-900">{item.question}</span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transform transition-transform ${
                      activeQuestion === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeQuestion === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-blue py-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-white">
              Ready to hire exceptional talent?
            </h2>
            <p className="text-gray-300 text-lg mb-12 max-w-3xl mx-auto leading-relaxed">
              Join leading pharmaceutical and biotech companies who trust us to deliver specialized talent fast
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/hire-talent')}
                className="bg-white text-brand-blue hover:bg-gray-100 px-8 py-3 rounded-full transition-all duration-300 font-medium"
              >
                Post your first role
              </button>
              <button className="text-white hover:bg-white/10 px-8 py-3 rounded-full transition-all duration-300 font-medium border border-white/30">
                Schedule consultation
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Employers; 