import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useSEO } from '../hooks/useSEO';
import Footer from '../components/Footer';

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
const ParallaxTimelineSection = ({ timeline, pageContent }) => {
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
            {pageContent.process.title}
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            {pageContent.process.subtitle}
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
  const [content, setContent] = useState(null);

  // Set SEO metadata
  useSEO(
    'For Candidates',
    'Discover exciting career opportunities in life sciences and biometrics with JCR Pharma. Browse biostatistics, clinical data management, data science, and bioinformatics jobs at leading pharmaceutical and biotech companies across UK, USA, and Europe. Upload your CV and get matched with your next role.'
  );
  
  
  // Download guide state
  const [showDownloadForm, setShowDownloadForm] = useState(false);
  const [downloadEmail, setDownloadEmail] = useState('');
  const [downloadingGuide, setDownloadingGuide] = useState(false);

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


  // Default content (fallback)
  const defaultContent = {
    hero: {
      title: "Your next role in\nbiometrics",
      subtitle: "Connect with leading pharmaceutical and biotech organisations. Find your perfect role with specialised recruitment experts who understand your field."
    },
    process: {
      title: "How It Works",
      subtitle: "Our comprehensive 9-step recruitment process ensures you find the perfect role with full support"
    },
    opportunities: {
      title: "Featured opportunities",
      subtitle: "Discover the latest roles from our partner organisations"
    },
    salaryGuide: {
      title: "Know your worth",
      subtitle: "Access our comprehensive salary guides for life sciences professionals. Stay informed about market rates across different specialisms and experience levels.",
      cardTitle: "2025 Life Sciences Salary Guide",
      cardDescription: "Comprehensive data on salaries across biostatistics, clinical data management, and bioinformatics roles in the UK and EU markets.",
      filePath: null
    },
    getStartedCta: {
      title: "Get started today",
      subtitle: "Submit your CV and preferences to receive personalised job alerts and opportunities from leading life sciences organisations."
    },
    faq: {
      title: "Frequently asked questions",
      subtitle: "Common questions from candidates about our recruitment process",
      items: [
        {
          question: "How does JCR find the right opportunities for me?",
          answer: "We use our deep industry knowledge and extensive network to match your skills, experience, and career goals with the best opportunities in biometrics and life sciences."
        },
        {
          question: "What types of roles do you specialise in?",
          answer: "We focus on biostatistics, clinical data management, bioinformatics, statistical programming, and related life sciences roles across pharmaceutical, biotech, and CRO sectors."
        },
        {
          question: "Is there a fee for candidates?",
          answer: "No, our services are completely free for candidates. We are paid by our client companies when we successfully place candidates."
        },
        {
          question: "How long does the placement process typically take?",
          answer: "Our average placement time is 14 days, though this can vary depending on role complexity and your specific requirements."
        },
        {
          question: "Do you work with candidates at all experience levels?",
          answer: "Yes, we work with candidates from entry-level to C-suite positions across all experience levels in our specialised areas."
        }
      ]
    }
  };

  // Fetch content from database
  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('page_contents')
        .select('content')
        .eq('page_name', 'candidates')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching content:', error);
        setContent(defaultContent);
      } else if (data) {
        // Merge with defaults to ensure all fields exist
        const mergedContent = {
          ...defaultContent,
          ...(data.content || {}),
          hero: { ...defaultContent.hero, ...(data.content?.hero || {}) },
          process: { ...defaultContent.process, ...(data.content?.process || {}) },
          opportunities: { ...defaultContent.opportunities, ...(data.content?.opportunities || {}) },
          salaryGuide: { 
            ...defaultContent.salaryGuide, 
            ...(data.content?.salaryGuide || {}),
            filePath: data.content?.salaryGuide?.filePath || defaultContent.salaryGuide.filePath
          },
          getStartedCta: { ...defaultContent.getStartedCta, ...(data.content?.getStartedCta || {}) },
          faq: { 
            ...defaultContent.faq, 
            ...(data.content?.faq || {}),
            items: data.content?.faq?.items && data.content.faq.items.length > 0 
              ? data.content.faq.items 
              : defaultContent.faq.items
          }
        };
        setContent(mergedContent);
      } else {
        setContent(defaultContent);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      setContent(defaultContent);
    }
  };

  useEffect(() => {
    fetchContent();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pageContent = content || defaultContent;

  // Show download form when button is clicked
  const handleDownloadGuideClick = () => {
    setShowDownloadForm(true);
  };

  // Download salary guide file with email subscription
  const handleDownloadGuide = async () => {
    if (!downloadEmail || !downloadEmail.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }

    setDownloadingGuide(true);
    try {
      // Subscribe to newsletter first
      try {
        const { error: subscribeError } = await supabase
          .from('newsletter_subscriptions')
          .insert([
            {
              email: downloadEmail.toLowerCase().trim(),
              source: 'salary_guide_download'
            }
          ])
          .select();

        if (subscribeError) {
          // If email already exists, that's okay - proceed with download
          if (subscribeError.code !== '23505') {
            throw subscribeError;
          }
        }
      } catch (subscribeError) {
        console.log('Subscription note:', subscribeError);
        // Continue with download even if subscription fails
      }

      // Subscription successful (or already subscribed), proceed with download
      let filePath = pageContent.salaryGuide?.filePath;
      let fileToDownload = null;

      // If file path exists in content, try that first
      if (filePath) {
        const { data, error } = await supabase.storage
          .from('cv-files')
          .download(filePath);

        if (!error && data) {
          fileToDownload = { data, name: filePath };
        }
      }

      // If not found, search for any employee_doc file
      if (!fileToDownload) {
        const { data: allFiles } = await supabase.storage
          .from('cv-files')
          .list('');

        if (allFiles) {
          const employeeDocFile = allFiles.find(f => f.name.startsWith('employee_doc'));
          if (employeeDocFile) {
            const { data, error } = await supabase.storage
              .from('cv-files')
              .download(employeeDocFile.name);

            if (!error && data) {
              fileToDownload = { data, name: employeeDocFile.name };
            }
          }
        }
      }

      if (fileToDownload) {
        // Create blob URL and trigger download
        const url = URL.createObjectURL(fileToDownload.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileToDownload.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Reset form after successful download
        setTimeout(() => {
          setShowDownloadForm(false);
          setDownloadEmail('');
        }, 500);
      } else {
        alert('Salary guide file not found. Please contact support.');
      }
    } catch (error) {
      console.error('Error subscribing or downloading:', error);
      alert('Something went wrong. Please try again later.');
    } finally {
      setDownloadingGuide(false);
    }
  };

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
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
              {pageContent.hero.title.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  {index < pageContent.hero.title.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </h1>
            <p className="text-gray-300 text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
              {pageContent.hero.subtitle}
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
      <ParallaxTimelineSection timeline={timeline} pageContent={pageContent} />

      {/* Featured Jobs Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-gray-900">
              {pageContent.opportunities.title}
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              {pageContent.opportunities.subtitle}
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
              {pageContent.salaryGuide.title}
            </h2>
            <p className="text-gray-600 text-lg mb-12 max-w-3xl mx-auto leading-relaxed">
              {pageContent.salaryGuide.subtitle}
            </p>
            
            <div className="bg-gradient-to-br from-brand-blue to-blue-700 text-white rounded-lg p-8 mb-8">
              <div className="flex items-center justify-center mb-6">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-medium mb-4">{pageContent.salaryGuide.cardTitle}</h3>
              <p className="text-blue-100 mb-6">
                {pageContent.salaryGuide.cardDescription}
              </p>
              
              {/* Download Button or Email Form */}
              <div className="flex items-center justify-center min-h-[48px] relative">
                <div className={`w-full max-w-md mx-auto transition-all duration-500 ease-in-out ${
                  !showDownloadForm 
                    ? 'opacity-100 transform translate-y-0 scale-100' 
                    : 'opacity-0 transform translate-y-2 scale-95 absolute pointer-events-none'
                }`}>
                  <button 
                    onClick={handleDownloadGuideClick}
                    className="bg-white text-brand-blue hover:bg-gray-100 px-6 py-3 rounded-full transition-all duration-300 font-medium w-full"
                  >
                Download Free Guide
              </button>
                </div>
                <div className={`flex items-center gap-3 w-full max-w-md mx-auto transition-all duration-500 ease-in-out ${
                  showDownloadForm 
                    ? 'opacity-100 transform translate-y-0 scale-100' 
                    : 'opacity-0 transform translate-y-2 scale-95 absolute pointer-events-none'
                }`}>
                  <input
                    type="email"
                    value={downloadEmail}
                    onChange={(e) => setDownloadEmail(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && downloadEmail && downloadEmail.includes('@')) {
                        handleDownloadGuide();
                      }
                    }}
                    placeholder="Enter your email"
                    disabled={downloadingGuide}
                    className="flex-1 px-4 py-3 rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    autoFocus
                  />
                  <button 
                    onClick={handleDownloadGuide}
                    disabled={downloadingGuide || !downloadEmail || !downloadEmail.includes('@')}
                    className="bg-white text-brand-blue hover:bg-gray-100 disabled:bg-gray-300 disabled:cursor-not-allowed p-3 rounded-full font-medium flex items-center justify-center min-w-[48px] min-h-[48px] transition-all"
                  >
                    {downloadingGuide ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-brand-blue border-t-transparent"></div>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Get Started CTA Section */}
      <section className="bg-gray-50 py-20 opacity-0" data-animate>
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-gray-900">
              {pageContent.getStartedCta.title}
            </h2>
            <p className="text-gray-600 text-lg mb-12 max-w-3xl mx-auto leading-relaxed">
              {pageContent.getStartedCta.subtitle}
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
                {pageContent.faq.title}
              </h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                {pageContent.faq.subtitle}
              </p>
            </div>

            <div className="space-y-4">
              {(pageContent.faq.items || []).map((faq, index) => (
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

      <Footer />
    </div>
  );
};

export default Candidates; 