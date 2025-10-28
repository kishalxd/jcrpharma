import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const Specialisms = () => {
  const [searchParams] = useSearchParams();
  const [activeSpecialism, setActiveSpecialism] = useState('biostatistics');
  const [openFaq, setOpenFaq] = useState(null);

  const specialisms = {
    biostatistics: {
      title: 'Biostatistics Recruitment',
      description: 'Connect with top statistical programming talent for clinical research and regulatory submissions.',
      features: ['Statistical Programming', 'Clinical Data Analysis', 'Regulatory Compliance', 'SAS/R Programming'],
      roles: ['Senior Biostatistician', 'Statistical Programmer', 'Principal Biostatistician', 'Statistics Director']
    },
    clinical: {
      title: 'Clinical Data Management',
      description: 'Find experts in clinical data handling, database design, and regulatory compliance.',
      features: ['Database Design', 'Data Quality', 'EDC Systems', 'Regulatory Standards'],
      roles: ['CDM Manager', 'Data Manager', 'CDM Director', 'Database Developer']
    },
    'statistical-programming': {
      title: 'Statistical Programming',
      description: 'Specialised SAS, R, and Python programming talent for clinical research and regulatory submissions.',
      features: ['SAS Programming', 'R Programming', 'Python Programming', 'CDISC Standards'],
      roles: ['Senior Statistical Programmer', 'Principal Statistical Programmer', 'Statistical Programming Manager', 'Lead SAS Programmer']
    },
    'data-science': {
      title: 'Data Science',
      description: 'Machine learning and AI-driven insights for pharmaceutical innovation and biomarker discovery.',
      features: ['Machine Learning', 'AI Development', 'Biomarker Discovery', 'Predictive Analytics'],
      roles: ['Senior Data Scientist', 'Principal Data Scientist', 'Data Science Manager', 'AI/ML Engineer']
    },
    bioinformatics: {
      title: 'Bioinformatics',
      description: 'Recruit computational biologists and bioinformatics specialists for cutting-edge research.',
      features: ['Genomic Analysis', 'NGS Data Processing', 'Pipeline Development', 'Machine Learning'],
      roles: ['Bioinformatics Scientist', 'Computational Biologist', 'NGS Analyst', 'Bioinformatics Director']
    },
    medical: {
      title: 'Medical Affairs',
      description: 'Source medical science liaisons and clinical development professionals.',
      features: ['Medical Communications', 'Clinical Strategy', 'Regulatory Affairs', 'Publication Planning'],
      roles: ['Medical Science Liaison', 'Medical Director', 'Clinical Research Associate', 'Medical Writer']
    }
  };

  // Handle URL parameters to set the active specialism
  useEffect(() => {
    const focusParam = searchParams.get('focus');
    if (focusParam && specialisms[focusParam]) {
      setActiveSpecialism(focusParam);
    }
  }, [searchParams, specialisms]);

  const timeline = [
    {
      step: 1,
      title: 'Understand You First',
      description: 'We build a deep understanding of your business culture, goals, values, pipeline projects, growth objectives, and what makes you stand out in the market.',
      duration: '1-2 days',
      details: ['Company culture assessment', 'Business goals analysis', 'Growth objectives review', 'Market positioning evaluation']
    },
    {
      step: 2,
      title: 'Define Your Ideal Candidate',
      description: 'We identify the perfect candidate profile including non-negotiables, nice-to-haves, personality traits, and target companies for headhunting.',
      duration: '1 day',
      details: ['CV requirements mapping', 'Skills prioritization', 'Personality profiling', 'Target company identification']
    },
    {
      step: 3,
      title: 'The Search',
      description: 'Dual approach: searching our 10+ year database of biometric/bioinformatic professionals and proactive headhunting through multiple channels.',
      duration: '3-5 days',
      details: ['Database search', 'Cold calling campaigns', 'LinkedIn outreach', 'Industry platform promotion', 'Competitor targeting', 'Referral generation']
    },
    {
      step: 4,
      title: 'Candidate Shortlisting',
      description: 'Rigorous screening process including initial 20-minute calls, role presentation, and detailed information sharing before moving candidates forward.',
      duration: '2-3 days',
      details: ['Initial screening calls', 'Role presentation', 'Information package delivery', 'Interest confirmation']
    },
    {
      step: 5,
      title: 'Deep Pre-screening',
      description: 'Comprehensive follow-up calls covering financial expectations, skills assessment, detailed profiling, and ensuring full understanding of the opportunity.',
      duration: '1-2 days',
      details: ['Financial expectations review', 'Skills checklist completion', 'Detailed candidate profiling', 'Opportunity clarification']
    },
    {
      step: 6,
      title: 'Ongoing Collaboration',
      description: 'Continuous support through weekly updates, interview coordination, candidate preparation, and structured feedback collection throughout the process.',
      duration: '1-2 weeks',
      details: ['Weekly update calls', 'Interview scheduling', 'Candidate preparation', 'Feedback collection and sharing']
    },
    {
      step: 7,
      title: 'Closing the Offer',
      description: 'Proactive management of potential obstacles, deep understanding of candidate motivations, and strategic positioning to maximize offer acceptance rates.',
      duration: '3-5 days',
      details: ['Counteroffer management', 'Decision tracking', 'Motivation analysis', 'Strategic positioning']
    }
  ];

  const caseStudies = [
    {
      id: 1,
      title: 'Global Pharma Statistical Programming Team',
      category: 'Biostatistics',
      client: 'Top 10 Pharmaceutical Company',
      challenge: 'Needed 15 statistical programmers with CDISC expertise for regulatory submissions',
      solution: 'Delivered full team within 6 weeks, all candidates with 5+ years CDISC experience',
      result: '100% retention rate after 12 months, successful FDA submissions',
      image: '/placeholder-case-study-1.jpg'
    },
    {
      id: 2,
      title: 'Bioinformatics Centre of Excellence',
      category: 'Bioinformatics',
      client: 'Leading Biotech Company',
      challenge: 'Building specialised genomics team for precision medicine initiative',
      solution: 'Recruited PhD-level bioinformaticians with NGS and ML expertise',
      result: '3 successful drug targets identified, $50M Series B funding secured',
      image: '/placeholder-case-study-2.jpg'
    },
    {
      id: 3,
      title: 'Clinical Data Management Transformation',
      category: 'Clinical Data',
      client: 'Mid-size CRO',
      challenge: 'Modernizing CDM processes and transitioning to cloud-based EDC systems',
      solution: 'Placed senior CDM professionals with digital transformation experience',
      result: '40% improvement in data processing speed, 99.8% data quality achieved',
      image: '/placeholder-case-study-3.jpg'
    }
  ];

  const faqs = [
    {
      question: 'What specialisms do you cover in life sciences recruitment?',
      answer: 'We specialise in biostatistics, clinical data management, bioinformatics, medical affairs, regulatory affairs, and clinical research. Our focus is on data-driven roles within pharmaceutical, biotechnology, and medical device companies.'
    },
    {
      question: 'How long does the typical recruitment process take?',
      answer: 'Our average time-to-hire is 14 days for most positions. However, this can vary depending on the seniority level and specific technical requirements. Senior and director-level positions may take 3-4 weeks.'
    },
    {
      question: 'Do you work with both permanent and contract positions?',
      answer: 'Yes, we handle both permanent placements and contract assignments. We also offer contract-to-permanent options for clients who want to evaluate candidates before making permanent offers.'
    },
    {
      question: 'What geographic regions do you cover?',
      answer: 'We operate across the UK, EU, and US markets. Our consultants have deep knowledge of local regulations, salary benchmarks, and market conditions in each region.'
    },
    {
      question: 'How do you ensure candidate quality and technical competency?',
      answer: 'All candidates undergo rigorous technical screening including skills assessments, portfolio reviews, and reference checks. We verify certifications, experience with specific tools/platforms, and domain expertise.'
    },
    {
      question: 'What is your fee structure?',
      answer: 'Our fees are competitive and based on successful placements. We offer different pricing models including retained search for senior positions and contingency-based recruitment for mid-level roles. Contact us for a detailed quote.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-brand-blue">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center text-white mb-16">
            <h1 className="text-5xl md:text-6xl font-light mb-8 leading-tight">
              {specialisms[activeSpecialism].title}
            </h1>
            <p className="text-gray-300 text-lg md:text-xl mb-12 max-w-4xl mx-auto leading-relaxed">
              {specialisms[activeSpecialism].description}
            </p>
            
            {/* CTA Button */}
            <div className="mb-20">
              <button className="bg-white/10 hover:bg-white/20 text-white hover:text-white px-8 py-3 rounded-full transition-all duration-300 backdrop-blur-md shadow-[0_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.2)] hover:backdrop-blur-lg font-medium">
                Start Recruitment Process
              </button>
            </div>
          </div>
          
          {/* Specialism Selector */}
          <div className="max-w-5xl mx-auto mb-16">
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(specialisms).map(([key, specialism]) => (
                <button
                  key={key}
                  onClick={() => setActiveSpecialism(key)}
                  className={`p-6 rounded-lg transition-all duration-300 text-left ${
                    activeSpecialism === key 
                      ? 'bg-white/20 text-white border-2 border-white/30' 
                      : 'bg-white/10 text-gray-300 hover:bg-white/15 border-2 border-transparent'
                  }`}
                >
                  {/* Image Placeholder */}
                  <div className="mb-6">
                    <div className="h-32 bg-white/10 rounded-lg flex items-center justify-center">
                      <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3">{specialism.title}</h3>
                  <p className="text-sm opacity-75 mb-4">{specialism.features[0]}</p>
                  <p className="text-xs opacity-60">{specialism.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features List Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-gray-600 text-sm uppercase tracking-wide mb-4">Core Capabilities</p>
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-gray-900">
              Our recruitment expertise
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Delivering specialised talent solutions with unmatched speed, quality, compliance, and global reach
            </p>
          </div>

          {/* USPs Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-16">
            {/* Speed */}
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-blue/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4 text-gray-900">Speed</h3>
              <p className="text-gray-600 leading-relaxed">
                Average 14-day time-to-hire with our specialised network and streamlined processes
              </p>
            </div>

            {/* Quality */}
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-blue/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4 text-gray-900">Quality</h3>
              <p className="text-gray-600 leading-relaxed">
                92% interview-to-offer success rate through rigorous technical screening and assessment
              </p>
            </div>

            {/* Compliance */}
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-blue/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4 text-gray-900">Compliance</h3>
              <p className="text-gray-600 leading-relaxed">
                Full adherence to GxP standards and regulatory requirements across all markets
              </p>
            </div>

            {/* Global Reach */}
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-blue/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4 text-gray-900">Global Reach</h3>
              <p className="text-gray-600 leading-relaxed">
                Active across UK, EU, and US markets with 150+ successful placements worldwide
              </p>
            </div>
          </div>

          {/* Roles Grid */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-light mb-8 text-center text-gray-900">
              Key roles in {specialisms[activeSpecialism].title.toLowerCase()}
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {specialisms[activeSpecialism].roles.map((role, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium text-gray-900">{role}</h4>
                    <button className="text-brand-blue hover:text-brand-blue/80 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-gray-600 text-sm uppercase tracking-wide mb-4">Our Process</p>
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-gray-900">
              Recruitment process timeline
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              A structured 7-step methodology built on 10+ years of biometric and bioinformatic recruitment expertise
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-300"></div>
              
              {timeline.map((item, index) => (
                <div key={index} className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Step Number */}
                  <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-brand-blue rounded-full items-center justify-center z-10 shadow-lg">
                    <span className="text-white font-bold text-sm">{item.step}</span>
                  </div>
                  
                  {/* Content */}
                  <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pr-16' : 'md:pl-16'}`}>
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                      <div className="flex items-center mb-4 md:hidden">
                        <div className="w-8 h-8 bg-brand-blue rounded-full flex items-center justify-center mr-4 shadow-md">
                          <span className="text-white text-sm font-bold">{item.step}</span>
                        </div>
                        <span className="text-gray-500 text-sm font-medium">{item.duration}</span>
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-3 text-gray-900">{item.title}</h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">{item.description}</p>
                      
                      {/* Key Activities */}
                      {item.details && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Key Activities:</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {item.details.map((detail, detailIndex) => (
                              <li key={detailIndex} className="flex items-center">
                                <div className="w-1.5 h-1.5 bg-brand-blue rounded-full mr-2 flex-shrink-0"></div>
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <span className="hidden md:inline-block text-brand-blue text-sm font-semibold bg-brand-blue/10 px-3 py-1 rounded-full">{item.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-gray-600 text-sm uppercase tracking-wide mb-4">Success Stories</p>
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-gray-900">
              Case studies by specialism
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Real examples of how we've delivered exceptional recruitment results across different specialisms
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {caseStudies.map((study) => (
              <div key={study.id} className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
                {/* Case Study Image Placeholder */}
                <div className="h-48 bg-gray-300 flex items-center justify-center">
                  <div className="w-16 h-16 bg-gray-400 rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                    </svg>
                  </div>
                </div>
                
                {/* Case Study Content */}
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">{study.category}</span>
                  </div>
                  
                  <h3 className="text-xl font-medium mb-3 text-gray-900 leading-tight">
                    {study.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    <span className="font-medium">Challenge:</span> {study.challenge}
                  </p>
                  
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    <span className="font-medium">Result:</span> {study.result}
                  </p>
                  
                  <button className="text-brand-blue hover:text-brand-blue/80 transition-colors flex items-center gap-1 text-sm font-medium">
                    Read full case study
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-gray-600 text-sm uppercase tracking-wide mb-4">FAQ</p>
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-gray-900">
              Frequently asked questions
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Common questions about our specialised recruitment process and services
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                    <svg 
                      className={`w-5 h-5 text-gray-500 transition-transform ${openFaq === index ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaq === index && (
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

      {/* CTA Form Section */}
      <section className="bg-brand-blue py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-white">
              Start your recruitment<br />
              journey today
            </h2>
            <p className="text-gray-300 text-lg mb-12 max-w-3xl mx-auto leading-relaxed">
              Get in touch with our specialised recruitment team to discuss your hiring needs and learn how we can help you find the perfect candidates.
            </p>
            
            {/* Contact Form */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 max-w-2xl mx-auto">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <input
                      type="text"
                      placeholder="First Name"
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:border-white/50 focus:bg-white/30 transition-all"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Last Name"
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:border-white/50 focus:bg-white/30 transition-all"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:border-white/50 focus:bg-white/30 transition-all"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Company"
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:border-white/50 focus:bg-white/30 transition-all"
                    />
                  </div>
                </div>
                
                <div>
                  <select className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:border-white/50 focus:bg-white/30 transition-all">
                    <option value="">Select Specialism</option>
                    <option value="biostatistics">Biostatistics</option>
                    <option value="clinical">Clinical Data Management</option>
                    <option value="bioinformatics">Bioinformatics</option>
                    <option value="medical">Medical Affairs</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <textarea
                    rows="4"
                    placeholder="Tell us about your recruitment needs..."
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:border-white/50 focus:bg-white/30 transition-all resize-none"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-white hover:bg-gray-100 text-brand-blue px-8 py-3 rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                >
                  Get Started
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-blue text-white">
        {/* Main Footer Content */}
        <div className="pt-20 pb-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-light mb-6 leading-tight">
                Connect with specialised talent today
              </h2>
              <p className="text-gray-300 text-lg mb-10 max-w-3xl mx-auto leading-relaxed">
                Join hundreds of life-sciences companies who trust us to deliver exceptional recruitment results.
              </p>
              
              {/* Email Signup */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-lg mx-auto mb-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-5 py-3 rounded-full bg-transparent border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:border-white/50 text-sm"
                />
                <button className="bg-brand-blue hover:bg-brand-blue/90 text-white px-8 py-3 rounded-full transition-all duration-300 font-medium text-sm">
                  Subscribe
                </button>
              </div>
              
              <p className="text-gray-400 text-sm">
                Get updates on market insights and recruitment trends.
              </p>
            </div>

            {/* Footer Links */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-6xl mx-auto">
              {/* Logo */}
              <div className="lg:col-span-1">
                <div className="mb-8">
                  <img 
                    src="/jcr_white_transparent.png" 
                    alt="JCR Pharma" 
                    className="h-12 w-auto object-cover"
                    style={{
                      clipPath: 'inset(20% 0 20% 0)',
                      transform: 'scaleY(1.67)'
                    }}
                  />
                </div>
                <p className="text-gray-300 leading-relaxed text-sm">
                  Specialised recruitment for life-sciences data and biometrics roles.
                </p>
              </div>

              {/* Specialisms */}
              <div>
                <h4 className="text-white font-medium mb-6">Specialisms</h4>
                <ul className="space-y-4">
                  <li><a href="/specialisms/biostatistics" className="text-gray-300 hover:text-white transition-colors text-sm">Biostatistics</a></li>
                  <li><a href="/specialisms/clinical" className="text-gray-300 hover:text-white transition-colors text-sm">Clinical Data Management</a></li>
                  <li><a href="/specialisms/bioinformatics" className="text-gray-300 hover:text-white transition-colors text-sm">Bioinformatics</a></li>
                  <li><a href="/specialisms/medical" className="text-gray-300 hover:text-white transition-colors text-sm">Medical Affairs</a></li>
                  <li><a href="/specialisms/regulatory" className="text-gray-300 hover:text-white transition-colors text-sm">Regulatory Affairs</a></li>
                </ul>
              </div>

              {/* Services */}
              <div>
                <h4 className="text-white font-medium mb-6">Services</h4>
                <ul className="space-y-4">
                  <li><a href="/services/permanent" className="text-gray-300 hover:text-white transition-colors text-sm">Permanent Placement</a></li>
                  <li><a href="/services/contract" className="text-gray-300 hover:text-white transition-colors text-sm">Contract Staffing</a></li>
                  <li><a href="/services/executive" className="text-gray-300 hover:text-white transition-colors text-sm">Executive Search</a></li>
                  <li><a href="/services/consulting" className="text-gray-300 hover:text-white transition-colors text-sm">Recruitment Consulting</a></li>
                  <li><a href="/services/market-insights" className="text-gray-300 hover:text-white transition-colors text-sm">Market Insights</a></li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="text-white font-medium mb-6">Company</h4>
                <ul className="space-y-4">
                  <li><a href="/about" className="text-gray-300 hover:text-white transition-colors text-sm">About Us</a></li>
                  <li><a href="/careers" className="text-gray-300 hover:text-white transition-colors text-sm">Careers</a></li>
                  <li><a href="/contact" className="text-gray-300 hover:text-white transition-colors text-sm">Contact</a></li>
                  <li><a href="/blog" className="text-gray-300 hover:text-white transition-colors text-sm">Blog</a></li>
                  <li><a href="/news" className="text-gray-300 hover:text-white transition-colors text-sm">News</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/20 py-8">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2025 Life Sciences Recruitment. All rights reserved.
              </p>
              <div className="flex gap-8">
                <a href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
                <a href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
                <a href="/cookies" className="text-gray-400 hover:text-white transition-colors text-sm">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Specialisms; 