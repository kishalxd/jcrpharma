import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

// Custom hook for scroll animations
const useScrollAnimation = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute('data-animate-delay');
          if (delay) {
            const delayMs = parseInt(delay);
            entry.target.style.animationDelay = `${delayMs}ms`;
          }
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('[data-animate], [data-animate-delay]');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);
};

// Parallax Timeline Section Component
const ParallaxTimelineSection = ({ timeline }) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  const scrollingContentRef = useRef(null);
  const descriptionRefs = useRef([]);

  // Observer for active timeline step
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index, 10);
            setActiveIndex(index);
          }
        });
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    );

    const refs = descriptionRefs.current;
    refs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      refs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  // Scroll handler for animations
  useEffect(() => {
    const handleScroll = () => {
      if (!headerRef.current || !contentRef.current || !sectionRef.current || !scrollingContentRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Step 1: Section Entrance & Header Fade-in
      const entryProgress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight * 0.5)));
      headerRef.current.style.opacity = entryProgress;
      headerRef.current.style.transform = `translateY(${(1 - entryProgress) * 50}px)`;

      // Step 2 & 4: Header fade-out and content fade-in/out
      const headerFadeStart = windowHeight * 0.3;
      const headerFadeEnd = windowHeight * 0.1;
      const contentFadeStart = windowHeight * 0.15;
      
      // Header fade out
      const headerProgress = Math.max(0, Math.min(1, (headerFadeStart - rect.top) / (headerFadeStart - headerFadeEnd)));
      headerRef.current.style.opacity = 1 - headerProgress;
      
      // Content fade in
      const contentProgress = Math.max(0, Math.min(1, (contentFadeStart - rect.top) / contentFadeStart));
      const contentOpacity = contentProgress;
      contentRef.current.style.opacity = contentOpacity;
      scrollingContentRef.current.style.opacity = contentOpacity;

      // Outro fade
      const exitPoint = rect.height - windowHeight * 1.5;
      if (rect.top < -exitPoint && activeIndex !== timeline.length - 1) {
        const exitProgress = Math.max(0, Math.min(1, (-rect.top - exitPoint) / (windowHeight * 0.5)));
        const finalOpacity = Math.max(contentOpacity * (1 - exitProgress), contentOpacity);
        contentRef.current.style.opacity = finalOpacity;
        scrollingContentRef.current.style.opacity = finalOpacity;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeIndex, timeline.length]);

  return (
    <section ref={sectionRef} className="bg-gray-50 py-8 relative" style={{ minHeight: '400vh' }}>
      {/* Sticky container for the animations */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-start pt-16">
        
        {/* Header */}
        <div ref={headerRef} className="text-center transition-all duration-200" style={{ opacity: 0 }}>
          <p className="text-gray-600 text-sm uppercase tracking-wide mb-4">Our Process</p>
          <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-gray-900">
            How It Works
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Our comprehensive 9-step recruitment process ensures you find the perfect role with full support
          </p>
        </div>

        {/* Timeline Content */}
        <div ref={contentRef} className="grid md:grid-cols-2 gap-12 md:gap-20 items-center max-w-7xl mx-auto w-full px-6 absolute top-0 left-0 right-0 h-full transition-opacity duration-300" style={{ opacity: 0 }}>
          {/* Left side - Step Title (Fixed) */}
          <div className="relative h-48 flex items-center justify-center">
            
             {timeline.map((item, index) => (
               <div
                 key={index}
                 className={`transition-all duration-500 ease-in-out absolute inset-0 flex flex-col justify-center ${
                   activeIndex === index
                     ? 'opacity-100 translate-y-0'
                     : 'opacity-0 translate-y-8 pointer-events-none'
                 }`}
               >
                 <div className="relative z-10 flex flex-col items-center">
                   {/* Circle with vertical line through it */}
                   <div className="relative">
                     {/* Vertical line extending above and below circle */}
                     <div className="absolute left-1/2 top-0 w-1 bg-gray-300 transform -translate-x-1/2 z-0" style={{ height: '8rem' }}></div>
                     {/* Circle positioned in the middle of the line */}
                     <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center shadow-lg border-4 border-white mb-12 relative z-10 mt-8">
                       <span className="text-white font-bold text-lg">{item.step}</span>
                     </div>
                   </div>
                   {/* Text content below the line - centered */}
                   <div className="text-center">
                     <h3 className="text-3xl md:text-4xl font-light leading-tight text-gray-900">
                       {item.title}
                     </h3>
                     <span className="text-brand-blue text-sm font-semibold bg-brand-blue/10 px-4 py-2 rounded-full mt-4 inline-block">
                       {item.duration}
                     </span>
                   </div>
                 </div>
               </div>
             ))}
          </div>
          {/* Right side placeholder */}
          <div></div>
        </div>
      </div>

      {/* Right side - Scrolling descriptions */}
      <div ref={scrollingContentRef} style={{opacity: 0}} className="relative max-w-7xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 -mt-[100vh] pointer-events-none transition-opacity duration-300">
        {/* Left side placeholder */}
        <div></div>
        {/* Actual scrolling content */}
        <div className="space-y-[50vh] pt-[25vh] pb-[25vh] pointer-events-auto">
          {timeline.map((item, index) => (
            <div
              key={index}
              ref={(el) => (descriptionRefs.current[index] = el)}
              data-index={index}
              className="min-h-[50vh] flex items-center justify-center"
            >
              <div className="w-full bg-white rounded-lg p-8 shadow-lg border border-gray-200">
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  {item.description}
                </p>
                
                {/* Key Activities */}
                {item.details && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Key Activities:</h4>
                    <ul className="text-sm text-gray-600 space-y-2">
                      {item.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start">
                          <div className="w-2 h-2 bg-brand-blue rounded-full mr-3 mt-2 flex-shrink-0"></div>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Candidates = () => {
  const navigate = useNavigate();
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  
  // Newsletter subscription state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterMessage, setNewsletterMessage] = useState('');

  const fetchFeaturedJobs = async () => {
    setJobsLoading(true);
    try {
      console.log('Fetching featured jobs...');
      
      // Get all latest jobs (both featured and non-featured, max 5)
      const { data: allJobsData, error: allError } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(5);

      if (allError) {
        console.error('Supabase error:', allError);
        throw allError;
      }

      console.log('All jobs data:', allJobsData);

      if (!allJobsData || allJobsData.length === 0) {
        console.log('No jobs found in database');
        // Set some sample jobs for display if no real jobs exist
        const sampleJobs = [
          {
            id: 'sample-1',
      title: 'Senior Biostatistician - Oncology',
            company: 'Leading Pharma Company',
      location: 'London, UK',
            work_mode: 'Hybrid',
            contract: 'Permanent',
      salary: '£80,000 - £95,000',
            specialism: 'Biostatistics',
            description: 'Join our oncology team to support critical clinical trials and regulatory submissions.',
            featured: true,
            show_company: false
          },
          {
            id: 'sample-2',
      title: 'Principal Bioinformatics Scientist',
      company: 'Genomics Research Ltd',
      location: 'Oxford, UK',
            work_mode: 'Remote',
            contract: 'Permanent',
      salary: '£90,000 - £110,000',
            specialism: 'Bioinformatics',
            description: 'Lead bioinformatics analysis for precision medicine initiatives.',
            featured: false,
            show_company: true
          },
          {
            id: 'sample-3',
      title: 'Clinical Data Manager',
      company: 'BioTech Solutions',
      location: 'Cambridge, UK',
            work_mode: 'Onsite',
            contract: 'Contract',
      salary: '£450 - £550 per day',
            specialism: 'Clinical Data Management',
            description: 'Manage clinical trial data and ensure regulatory compliance.',
            featured: false,
            show_company: true
          }
        ];
        setFeaturedJobs(sampleJobs);
        setJobsLoading(false);
        return;
      }

      // Separate featured and non-featured
      const featuredJobs = allJobsData.filter(job => job.featured);
      const nonFeaturedJobs = allJobsData.filter(job => !job.featured);

      console.log('Featured jobs:', featuredJobs.length);
      console.log('Non-featured jobs:', nonFeaturedJobs.length);

      // Prioritize showing featured jobs, but also include non-featured to show variety
      let result = [];
      
      // Add up to 2 featured jobs
      if (featuredJobs.length > 0) {
        result.push(...featuredJobs.slice(0, 2));
      }
      
      // Add non-featured jobs to fill up to 3 total
      const remaining = 3 - result.length;
      if (remaining > 0 && nonFeaturedJobs.length > 0) {
        result.push(...nonFeaturedJobs.slice(0, remaining));
      }
      
      // If we have less than 3 and more featured jobs, add them
      const stillRemaining = 3 - result.length;
      if (stillRemaining > 0 && featuredJobs.length > result.filter(j => j.featured).length) {
        const additionalFeatured = featuredJobs.slice(result.length, result.length + stillRemaining);
        result = [...result, ...additionalFeatured];
      }

      console.log('Final result:', result);
      setFeaturedJobs(result);
      setJobsLoading(false);
    } catch (error) {
      console.error('Error fetching featured jobs:', error);
      
      // Fallback to sample jobs on error
      const fallbackJobs = [
        {
          id: 'fallback-1',
          title: 'Senior Biostatistician',
          company: 'Confidential Client',
          location: 'London, UK',
          work_mode: 'Hybrid',
          contract: 'Permanent',
          salary: '£75,000 - £90,000',
          specialism: 'Biostatistics',
          description: 'Exciting opportunity to join a leading pharmaceutical company.',
          featured: false,
          show_company: false
        }
      ];
      setFeaturedJobs(fallbackJobs);
    } finally {
      setJobsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedJobs();
  }, []);

  useScrollAnimation();


  const faqs = [
    {
      question: 'How does JCR find the right opportunities for me?',
      answer: 'We use our deep industry knowledge and extensive network to match your skills, experience, and career goals with the best opportunities in biometrics and life sciences.'
    },
    {
      question: 'What types of roles do you specialise in?',
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
      answer: 'Yes, we work with candidates from entry-level to C-suite positions across all experience levels in our specialised areas.'
    }
  ];

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  // Newsletter subscription handler
  const handleNewsletterSignup = async (e) => {
    e.preventDefault();
    
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setNewsletterMessage('Please enter a valid email address.');
      return;
    }

    setNewsletterLoading(true);
    setNewsletterMessage('');

    try {
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .insert([
          {
            email: newsletterEmail.toLowerCase().trim(),
            source: 'website'
          }
        ])
        .select();

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          setNewsletterMessage('This email is already subscribed to our newsletter.');
        } else {
          throw error;
        }
      } else {
        setNewsletterMessage('Thank you for subscribing! You\'ll receive our latest updates.');
        setNewsletterEmail('');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setNewsletterMessage('Something went wrong. Please try again later.');
    }

    setNewsletterLoading(false);
    
    // Clear message after 5 seconds
    setTimeout(() => {
      setNewsletterMessage('');
    }, 5000);
  };

  const timeline = [
    {
      step: 1,
      title: 'Submit Your Profile',
      description: 'Upload your CV to our site, alongside your contact information and a small blurb on what you\'re looking for.',
      duration: 'Instant',
      details: ['Upload CV and documents', 'Complete contact information', 'Share career preferences', 'Set job alerts']
    },
    {
      step: 2,
      title: 'Exploration Call',
      description: 'A 30-minute phone call with our consultant to understand your situation, desires, and aspirations in detail.',
      duration: '30 minutes',
      details: ['Discuss current situation', 'Understand career goals', 'Review experience and skills', 'Identify preferences']
    },
    {
      step: 3,
      title: 'Role Discussion',
      description: 'Our expert consultants will present one or two possible opportunities that you\'re very suitable for.',
      duration: '1-2 days',
      details: ['Present matched opportunities', 'Discuss role requirements', 'Share company information', 'Answer initial questions']
    },
    {
      step: 4,
      title: 'Go Away and Think',
      description: 'Take time to seriously consider the opportunity, review job descriptions and company information.',
      duration: '24 hours',
      details: ['Review job descriptions', 'Research company background', 'Consider career fit', 'Prepare questions']
    },
    {
      step: 5,
      title: 'Follow-Up Call',
      description: 'Arrange another call after consideration to go through questions, discuss next steps, and detail job requirements.',
      duration: '30 minutes',
      details: ['Address questions and concerns', 'Discuss next steps', 'Detail job requirements', 'Confirm interest level']
    },
    {
      step: 6,
      title: 'Application Submission',
      description: 'We will contact our client and arrange an interview on your behalf.',
      duration: '1-2 days',
      details: ['Submit application to client', 'Arrange interview schedule', 'Provide interview details', 'Share preparation materials']
    },
    {
      step: 7,
      title: 'Continuous Support',
      description: 'Interview prep calls, feedback collection, and detailed support throughout the entire process.',
      duration: 'Ongoing',
      details: ['Interview preparation calls', 'Collect and share feedback', 'Provide ongoing support', 'Guide through process']
    },
    {
      step: 8,
      title: 'Job Offer',
      description: 'We handle everything with the job offer - you accept, we sort out all contracts and details.',
      duration: '3-5 days',
      details: ['Negotiate offer terms', 'Handle contract details', 'Facilitate acceptance', 'Coordinate start date']
    },
    {
      step: 9,
      title: 'Ongoing Support',
      description: 'Stay in touch after you start to make sure you\'re happy, supported, and building a long-lasting relationship.',
      duration: 'Long-term',
      details: ['Check-in after starting', 'Ensure job satisfaction', 'Provide ongoing support', 'Maintain long-term relationship']
    }
  ];

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
              Connect with leading pharmaceutical and biotech organisations. 
              Find your perfect role with specialised recruitment experts who understand your field.
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

      {/* How It Works Section - Parallax Timeline */}
      <ParallaxTimelineSection timeline={timeline} />

      {/* Featured Jobs Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-gray-900">
              Featured opportunities
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Discover the latest roles from our partner organisations
            </p>
          </div>

          {/* Job Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto mb-12">
            {jobsLoading ? (
              // Loading skeleton
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 animate-pulse">
                    <div className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-3"></div>
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                      <div className="h-16 bg-gray-200 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : featuredJobs.length > 0 ? (
              featuredJobs.map((job, index) => (
                <div 
                  key={job.id} 
                  className={`bg-white rounded-lg shadow-lg overflow-hidden border hover:shadow-xl transition-shadow ${
                    job.featured ? 'border-yellow-400 ring-2 ring-yellow-400/20' : 'border-gray-200'
                  }`}
                >
                  {job.featured && (
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1 text-center">
                      ⭐ FEATURED JOB
                    </div>
                  )}
                  
                  {/* Job Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className="text-sm text-gray-600 bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                        {job.specialism}
                      </span>
                      {job.featured && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2 text-gray-900 leading-tight line-clamp-2">
                      {job.title}
                    </h3>
                    
                    {job.show_company !== false && (
                      <p className="text-gray-600 text-sm font-medium mb-2">{job.company}</p>
                    )}
                    
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">
                      {job.description}
                    </p>
                    
                    {job.salary && (
                      <p className="text-gray-900 font-semibold text-sm mb-4">{job.salary}</p>
                    )}
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-xs text-gray-500">{job.contract}</span>
                      <button 
                        onClick={() => navigate(`/jobs`)}
                        className="text-brand-blue hover:text-blue-700 transition-colors flex items-center gap-1 text-sm font-medium"
                      >
                        View details
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Placeholder when no jobs available
              <>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                  <div className="p-6">
                    <p className="text-gray-500 text-sm">No jobs available</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                  <div className="p-6">
                    <p className="text-gray-500 text-sm">Check back soon</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                  <div className="p-6">
                    <p className="text-gray-500 text-sm">New opportunities coming</p>
                  </div>
              </div>
              </>
            )}
          </div>

          {/* View All Jobs Button */}
          <div className="text-center">
            <button 
              onClick={() => navigate('/find-jobs')}
              className="bg-brand-blue/90 hover:bg-brand-blue/80 text-white px-8 py-3 rounded-full transition-all duration-300 backdrop-blur-md shadow-[0_2px_4px_rgba(0,0,0,0.2)] font-medium"
            >
              View all jobs
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Section - Salary Guides Teaser */}
      <section className="bg-white py-20 opacity-0" data-animate>
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
      <section className="bg-gray-50 py-20 opacity-0" data-animate>
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-gray-900">
              Get started today
            </h2>
            <p className="text-gray-600 text-lg mb-12 max-w-3xl mx-auto leading-relaxed">
              Submit your CV and preferences to receive personalised job alerts and opportunities from leading life sciences organisations.
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


      {/* FAQ Section */}
      <section className="bg-gray-50 py-20 opacity-0" data-animate>
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
                <div key={index} className="bg-white rounded-lg shadow-sm opacity-0" data-animate-delay={index * 100}>
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

      {/* Footer */}
      <footer className="bg-brand-blue text-white">
        {/* Main Footer Content */}
        <div className="pt-20 pb-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-light mb-6 leading-tight">
                Stay updated with life sciences opportunities
              </h2>
              <p className="text-gray-300 text-lg mb-10 max-w-3xl mx-auto leading-relaxed">
                Subscribe to our newsletter for the latest job openings, industry insights, and career development tips in biometrics and life sciences data.
              </p>
              
              {/* Email Signup */}
              <form onSubmit={handleNewsletterSignup} className="flex flex-col sm:flex-row gap-3 justify-center max-w-lg mx-auto mb-4">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={newsletterLoading}
                  className="flex-1 px-5 py-3 rounded-full bg-transparent border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:border-white/50 text-sm disabled:opacity-50"
                  required
                />
                <button 
                  type="submit"
                  disabled={newsletterLoading}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white px-8 py-3 rounded-full transition-all duration-300 font-medium text-sm disabled:cursor-not-allowed"
                >
                  {newsletterLoading ? 'Signing up...' : 'Sign up'}
                </button>
              </form>
              
              {/* Newsletter Message */}
              {newsletterMessage && (
                <div className={`text-sm mb-4 ${
                  newsletterMessage.includes('Thank you') ? 'text-green-400' : 'text-red-400'
                }`}>
                  {newsletterMessage}
                </div>
              )}
              
              <p className="text-gray-400 text-sm">
                By clicking Sign Up you're confirming that you agree with our Terms and Conditions.
              </p>
            </div>

            {/* Footer Links */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-6xl mx-auto">
              {/* Logo */}
              <div className="lg:col-span-1">
                <div className="mb-8">
                  <img 
                    src="jcr_white_transparent.png" 
                    alt="JCR Pharma" 
                    className="h-12 w-auto object-cover"
                    style={{
                      clipPath: 'inset(20% 0 20% 0)',
                      transform: 'scaleY(1.67)'
                    }}
                  />
                </div>
                <p className="text-gray-300 leading-relaxed text-sm">
                  Specialised recruitment for life sciences data and biometrics professionals across global markets.
                </p>
              </div>

              {/* Column One */}
              <div>
                <h4 className="text-white font-medium mb-6">For Employers</h4>
                <ul className="space-y-4">
                  <li><a href="/employers" className="text-gray-300 hover:text-white transition-colors text-sm">Post a Job</a></li>
                  <li><a href="/specialisms" className="text-gray-300 hover:text-white transition-colors text-sm">Specialisms</a></li>
                  <li><a href="/employers#pricing" className="text-gray-300 hover:text-white transition-colors text-sm">Pricing</a></li>
                  <li><a href="/about" className="text-gray-300 hover:text-white transition-colors text-sm">About Us</a></li>
                  <li><a href="/contact" className="text-gray-300 hover:text-white transition-colors text-sm">Contact</a></li>
                </ul>
              </div>

              {/* Column Two */}
              <div>
                <h4 className="text-white font-medium mb-6">For Candidates</h4>
                <ul className="space-y-4">
                  <li><a href="/jobs" className="text-gray-300 hover:text-white transition-colors text-sm">Browse Jobs</a></li>
                  <li><a href="/candidates" className="text-gray-300 hover:text-white transition-colors text-sm">Upload CV</a></li>
                  <li><a href="/jobs#biometrics" className="text-gray-300 hover:text-white transition-colors text-sm">Biometrics</a></li>
                  <li><a href="/jobs#bioinformatics" className="text-gray-300 hover:text-white transition-colors text-sm">Bioinformatics</a></li>
                  <li><a href="/jobs#data-science" className="text-gray-300 hover:text-white transition-colors text-sm">Data Science</a></li>
                </ul>
              </div>

              {/* Follow Us */}
              <div>
                <h4 className="text-white font-medium mb-6">Follow us</h4>
                <ul className="space-y-4">
                  <li>
                    <a href="https://www.facebook.com/share/16cRTXXnJq/?mibextid=wwXIfr" className="text-gray-300 hover:text-white transition-colors flex items-center gap-3 text-sm">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook
                    </a>
                  </li>
                  <li>
                    <a href="https://www.instagram.com/jcrpharmaltd/" className="text-gray-300 hover:text-white transition-colors flex items-center gap-3 text-sm">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.690 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.750-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.013C24.007 5.367 18.641.001 12.017.001z"/>
                      </svg>
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a href="https://x.com/JCRPharma" className="text-gray-300 hover:text-white transition-colors flex items-center gap-3 text-sm">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      X
                    </a>
                  </li>
                  <li>
                    <a href="https://www.youtube.com/@JCRPharma" className="text-gray-300 hover:text-white transition-colors flex items-center gap-3 text-sm">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                      Youtube
                    </a>
                  </li>
                  <li>
                    <a href="https://www.linkedin.com/company/jcr-pharma/" className="text-gray-300 hover:text-white transition-colors flex items-center gap-3 text-sm">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      LinkedIn
                    </a>
                  </li>
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
                © 2025 JCR Pharma. All rights reserved.
              </p>
              <div className="flex gap-8">
                <a href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
                <a href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
                <a href="/cookies" className="text-gray-400 hover:text-white transition-colors text-sm">Cookies Settings</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Candidates; 