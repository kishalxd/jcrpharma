import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAdmin } from '../components/AdminContext';

// EditableText Component for inline editing
const EditableText = ({ value, onChange, multiline = false, placeholder, className = "", rows = 1, editMode = false, variant = 'dark' }) => {
  if (!editMode) {
    return (
      <span className={className}>
        {multiline && value ? value.split('\n').map((line, index) => (
          <React.Fragment key={index}>
            {line}
            {index < value.split('\n').length - 1 && <br />}
          </React.Fragment>
        )) : value}
      </span>
    );
  }

  const Component = multiline ? 'textarea' : 'input';
  
  // Determine styling based on variant (dark = white text on dark bg, light = dark text on light bg)
  const inputStyles = variant === 'dark' 
    ? 'bg-white/10 backdrop-blur-sm border-2 border-white/30 focus:border-white focus:bg-white/20 hover:border-white/50 text-white placeholder-gray-300'
    : 'bg-white border-2 border-gray-300 focus:border-brand-blue focus:bg-white outline-none hover:border-gray-400 text-gray-900 placeholder-gray-500';
  
  return (
    <div className="relative group">
      <Component
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={multiline ? rows : undefined}
        className={`${className} ${inputStyles} rounded-lg px-4 py-2 transition-all duration-200 resize-none`}
        style={editMode ? { minHeight: multiline ? '80px' : '40px' } : {}}
      />
      <div className="absolute -top-2 -left-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

// Parallax Timeline Section Component
const ParallaxTimelineSection = ({ timeline, editMode, pageContent, updateContent }) => {
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
            {editMode ? (
              <EditableText
                value={pageContent?.process?.title || 'Recruitment process timeline'}
                onChange={(value) => updateContent('process.title', value)}
                placeholder="Recruitment process timeline"
                className="text-4xl md:text-5xl font-light leading-tight text-gray-900 text-center block w-full"
                editMode={editMode}
                variant="light"
              />
            ) : (
              pageContent?.process?.title || 'Recruitment process timeline'
            )}
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            {editMode ? (
              <EditableText
                value={pageContent?.process?.subtitle || 'A structured 7-step methodology built on 10+ years of biometric and bioinformatic recruitment expertise'}
                onChange={(value) => updateContent('process.subtitle', value)}
                placeholder="A structured 7-step methodology..."
                className="text-gray-600 text-lg text-center block w-full"
                multiline={true}
                rows={2}
                editMode={editMode}
                variant="light"
              />
            ) : (
              pageContent?.process?.subtitle || 'A structured 7-step methodology built on 10+ years of biometric and bioinformatic recruitment expertise'
            )}
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

const Specializations = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAdminAuthenticated } = useAdmin();
  const [activeSpecialism, setActiveSpecialism] = useState('biostatistics');
  const [openFaq, setOpenFaq] = useState(null);
  
  // Edit mode state
  const [editMode, setEditMode] = useState(false);
  const [content, setContent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedNotification, setSavedNotification] = useState(false);

  // Form state
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

  const specializations = {
    biostatistics: {
      title: 'Biostatistics',
      fullTitle: 'Biostatistics Recruitment',
      description: 'Advanced statistical analysis and methodology for clinical trials and research studies.',
      longDescription: 'Connect with top statistical programming talent for clinical research and regulatory submissions.',
      features: ['Statistical Programming', 'Clinical Data Analysis', 'Regulatory Compliance', 'SAS/R Programming'],
      roles: ['Senior Biostatistician', 'Statistical Programmer', 'Principal Biostatistician', 'Statistics Director']
    },
    clinical: {
      title: 'Clinical Data Management',
      fullTitle: 'Clinical Data Management',
      description: 'Comprehensive data handling and regulatory compliance.',
      longDescription: 'Find experts in clinical data handling, database design, and regulatory compliance.',
      features: ['Database Design', 'Data Quality', 'EDC Systems', 'Regulatory Standards'],
      roles: ['CDM Manager', 'Data Manager', 'CDM Director', 'Database Developer']
    },
    'statistical-programming': {
      title: 'Statistical Programming',
      fullTitle: 'Statistical Programming',
      description: 'SAS, R, and Python programming for clinical research.',
      longDescription: 'Specialised SAS, R, and Python programming talent for clinical research and regulatory submissions.',
      features: ['SAS Programming', 'R Programming', 'Python Programming', 'CDISC Standards'],
      roles: ['Senior Statistical Programmer', 'Principal Statistical Programmer', 'Statistical Programming Manager', 'Lead SAS Programmer']
    },
    'data-science': {
      title: 'Data Science',
      fullTitle: 'Data Science',
      description: 'Machine learning and AI-driven insights for pharmaceutical innovation and biomarker discovery.',
      longDescription: 'Machine learning and AI-driven insights for pharmaceutical innovation and biomarker discovery.',
      features: ['Machine Learning', 'AI Development', 'Biomarker Discovery', 'Predictive Analytics'],
      roles: ['Senior Data Scientist', 'Principal Data Scientist', 'Data Science Manager', 'AI/ML Engineer']
    },
    bioinformatics: {
      title: 'Bioinformatics',
      fullTitle: 'Bioinformatics',
      description: 'Computational biology and genomics expertise for precision medicine and biomarker development.',
      longDescription: 'Recruit computational biologists and bioinformatics specialists for cutting-edge research.',
      features: ['Genomic Analysis', 'NGS Data Processing', 'Pipeline Development', 'Machine Learning'],
      roles: ['Bioinformatics Scientist', 'Computational Biologist', 'NGS Analyst', 'Bioinformatics Director']
    }
  };

  // Default content (fallback)
  const defaultContent = {
    hero: {
      title: "Life Sciences Specialisations",
      subtitle: "Discover Our Specialised Recruitment Expertise Across Key Areas of Life Sciences, Biotechnology, and Pharmaceutical Research."
    },
    capabilities: {
      title: "Our recruitment expertise",
      subtitle: "Delivering specialised talent solutions with unmatched reliability, quality, consultative approach, and expert knowledge"
    },
    process: {
      title: "Recruitment process timeline",
      subtitle: "A structured 7-step methodology built on 10+ years of biometric and bioinformatic recruitment expertise"
    },
    faq: {
      title: "Frequently asked questions",
      subtitle: "Common questions about our specialised recruitment process and services",
      items: [
        {
          question: "What specializations do you cover in life sciences recruitment?",
          answer: "We specialize in biostatistics, clinical data management, statistical programming, data science, and bioinformatics. Our focus is on data-driven roles within pharmaceutical, biotechnology, and medical device companies."
        },
        {
          question: "How long does the typical recruitment process take?",
          answer: "Our average time-to-hire is 14 days for most positions. However, this can vary depending on the seniority level and specific technical requirements. Senior and director-level positions may take 3-4 weeks."
        },
        {
          question: "Do you work with both permanent and contract positions?",
          answer: "Yes, we handle both permanent placements and contract assignments. We also offer contract-to-permanent options for clients who want to evaluate candidates before making permanent offers."
        },
        {
          question: "What geographic regions do you cover?",
          answer: "We operate across the UK, EU, and US markets. Our consultants have deep knowledge of local regulations, salary benchmarks, and market conditions in each region."
        },
        {
          question: "How do you ensure candidate quality and technical competency?",
          answer: "All candidates undergo rigorous technical screening including skills assessments, portfolio reviews, and reference checks. We verify certifications, experience with specific tools/platforms, and domain expertise."
        },
        {
          question: "What is your fee structure?",
          answer: "Our fees are competitive and based on successful placements. We offer different pricing models including retained search for senior positions and contingency-based recruitment for mid-level roles. Contact us for a detailed quote."
        }
      ]
    },
    cta: {
      title: "Start your recruitment\njourney today",
      subtitle: "Get in touch with our specialised recruitment team to discuss your hiring needs and learn how we can help you find the perfect candidates."
    }
  };

  // Check if we're in edit mode from URL params and if admin is logged in
  useEffect(() => {
    const isEdit = searchParams.get('edit') === 'true';
    if (isEdit) {
      if (isAdminAuthenticated) {
        setEditMode(true);
      } else {
        navigate('/admin-login?redirect=' + encodeURIComponent('/specialisms?edit=true'));
        return;
      }
    } else {
      setEditMode(false);
    }
  }, [searchParams, isAdminAuthenticated, navigate]);

  // Fetch content from database
  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('page_contents')
        .select('content')
        .eq('page_name', 'specialisms')
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
          capabilities: { ...defaultContent.capabilities, ...(data.content?.capabilities || {}) },
          process: { ...defaultContent.process, ...(data.content?.process || {}) },
          faq: { 
            ...defaultContent.faq, 
            ...(data.content?.faq || {}),
            items: data.content?.faq?.items && data.content.faq.items.length > 0 
              ? data.content.faq.items 
              : defaultContent.faq.items
          },
          cta: { ...defaultContent.cta, ...(data.content?.cta || {}) }
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

  const updateContent = (path, value) => {
    setContent(prev => {
      const newContent = { ...prev };
      const keys = path.split('.');
      let current = newContent;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newContent;
    });
  };

  const saveContent = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('page_contents')
        .upsert({
          page_name: 'specialisms',
          content: content,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'page_name'
        })
        .select();

      if (error) throw error;
      
      setSavedNotification(true);
      setTimeout(() => setSavedNotification(false), 3000);
    } catch (error) {
      console.error('Error saving content:', error);
      alert(`Error saving content: ${error.message}`);
    }
    setSaving(false);
  };

  const exitEditMode = () => {
    navigate('/specialisms');
    setEditMode(false);
  };

  // Handle URL parameters to set the active specialization
  useEffect(() => {
    const focusParam = searchParams.get('focus');
    if (focusParam && specializations[focusParam]) {
      setActiveSpecialism(focusParam);
    }
  }, [searchParams, specializations]);

  // Form handlers
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

    } catch (error) {
      console.error('Error submitting hiring request:', error);
      setSubmitMessage(`Error submitting request: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

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
      question: 'What specializations do you cover in life sciences recruitment?',
      answer: 'We specialize in biostatistics, clinical data management, statistical programming, data science, and bioinformatics. Our focus is on data-driven roles within pharmaceutical, biotechnology, and medical device companies.'
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
      {/* Edit Mode Header */}
      {editMode && (
        <div className="fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-sm z-50 px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-white font-medium">Edit Mode</span>
              <span className="text-gray-300 text-sm">Click on any text to edit</span>
            </div>
            <div className="flex items-center space-x-3">
              {savedNotification && (
                <span className="text-green-400 text-sm flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Saved!
                </span>
              )}
              <button
                onClick={saveContent}
                disabled={saving}
                className="bg-brand-blue hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={exitEditMode}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Exit Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className={`bg-brand-blue ${editMode ? 'pt-20' : ''}`}>
        <div className="container mx-auto px-6 py-20">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-light mb-6 leading-tight">
              {editMode ? (
                <EditableText
                  value={pageContent.hero.title}
                  onChange={(value) => updateContent('hero.title', value)}
                  placeholder="Enter hero title..."
                  className="text-4xl md:text-5xl font-light leading-tight text-white text-center block w-full"
                  editMode={editMode}
                  variant="dark"
                />
              ) : (
                pageContent.hero.title
              )}
            </h1>
            <p className="text-gray-300 text-lg mb-12 max-w-3xl mx-auto leading-relaxed">
              {editMode ? (
                <EditableText
                  value={pageContent.hero.subtitle}
                  onChange={(value) => updateContent('hero.subtitle', value)}
                  multiline={true}
                  rows={2}
                  placeholder="Enter hero subtitle..."
                  className="text-gray-300 text-lg leading-relaxed text-center block w-full"
                  editMode={editMode}
                  variant="dark"
                />
              ) : (
                pageContent.hero.subtitle
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Specializations Section - Full Width */}
      <section className="bg-white">
        <div className="w-full">
          <div className="bg-white shadow-xl">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <div className="container mx-auto px-6">
                <div className="flex overflow-x-auto">
                {Object.entries(specializations).map(([key, specialization]) => (
                <button
                  key={key}
                  onClick={() => setActiveSpecialism(key)}
                    className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-all duration-300 border-b-2 ${
                    activeSpecialism === key 
                        ? 'text-brand-blue border-brand-blue bg-gray-50' 
                        : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
                    }`}
                  >
                    {specialization.title}
                  </button>
                ))}
                </div>
              </div>
            </div>
            
            {/* Tab Content - Full Width */}
            <div className="w-full">
              <div className="grid lg:grid-cols-2 gap-0">
                {/* Left side - Main Content */}
                <div className="p-8 lg:p-12">
                  {activeSpecialism === 'biostatistics' && (
                    <>
                      <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6 leading-tight">
                        Specialists in connecting leading biostatistics professionals with the teams who need them most.
                      </h2>
                      <div className="space-y-6 text-gray-700 leading-relaxed">
                        <p className="text-lg">
                        At JCR Pharma, we understand that precision in biostatistics drives every sound clinical decision. We partner with leading pharmaceutical, biotech, and CRO organisations to connect them with analytical minds who bring structure to uncertainty. Our recruitment approach is grounded in partnership, transparency, and an understanding that behind every dataset lies a decision that can change lives.
                        </p>
                        <p>
                        Our consultants specialise in recruiting across statistical programming, study design, and trial analysis. We stay close to market shifts in biometrics and adaptive trial modelling, ensuring every placement adds measurable value to both data quality and regulatory success. Whether the role is operational or strategic, we focus on precision, communication, and cultural fit.
                        </p>
                      </div>
                      <div className="mt-8">
                        <h3 className="text-2xl font-light text-gray-900 mb-4">Our approach</h3>
                        <p className="text-gray-700 leading-relaxed">
                        We help you build teams that transform raw data into clear insight. From senior biostatisticians to emerging analysts, our network brings the right balance of technical rigour and collaborative mindset. When accuracy matters most, JCR Pharma delivers recruitment that’s as exacting as the science itself.
                        </p>
                      </div>
                    </>
                  )}

                  {activeSpecialism === 'clinical' && (
                    <>
                      <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6 leading-tight">
                        Trusted partners in recruiting clinical data management talent for global studies.
                      </h2>
                      <div className="space-y-6 text-gray-700 leading-relaxed">
                        <p className="text-lg">
                        In clinical data management, structure and reliability define success. JCR Pharma partners with life sciences organisations that value integrity in every data point. Our consultative recruitment model ensures that each professional we place strengthens your study’s accuracy, compliance, and operational efficiency.
                        </p>
                        <p>
                        Our team understands the nuances of CDM roles, from clinical data managers and data coordinators to data standards specialists and tailors search strategies around therapeutic area and study phase. We know the systems, workflows, and regulatory standards that drive modern data integrity.
                        </p>
                      </div>
                      <div className="mt-8">
                        <h3 className="text-2xl font-light text-gray-900 mb-4">Our approach</h3>
                        <p className="text-gray-700 leading-relaxed">
                        The best data management professionals don’t just maintain datasets; they anticipate problems before they occur. That’s the difference our recruitment approach delivers. JCR Pharma helps you secure professionals who ensure that every trial, every record, and every submission stands up to the highest scientific and ethical standards.
                        </p>
                      </div>
                    </>
                  )}

                  {activeSpecialism === 'statistical-programming' && (
                    <>
                      <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6 leading-tight">
                      Focused on hiring the statistical programmers who keep research moving and submissions on track.
                      </h2>
                      <div className="space-y-6 text-gray-700 leading-relaxed">
                        <p className="text-lg">
                        Behind every successful clinical study is a team of statistical programmers translating data into results that regulators can trust. At JCR Pharma, we connect pharmaceutical and CRO partners with experts who blend technical excellence with a problem-solving mindset. We value collaboration as much as code, ensuring every match supports long-term project outcomes.
                        </p>
                        <p>
                        Our recruitment covers SAS, R, and Python programmers with experience across various submission-ready deliverables. We understand the fast-moving landscape of automation, reproducibility, and traceability in programming, and we adapt quickly to evolving standards. Each search is guided by your project’s timeline, team structure, and data complexity.
                        </p>
                      </div>
                      <div className="mt-8">
                        <h3 className="text-2xl font-light text-gray-900 mb-4">Our approach</h3>
                        <p className="text-gray-700 leading-relaxed">
                        When deadlines are tight and precision is non-negotiable, the right programmer can make all the difference. JCR Pharma helps you build programming teams that are not only technically capable but strategically aligned.
                        </p>
                      </div>
                    </>
                  )}

                  {activeSpecialism === 'data-science' && (
                    <>
                      <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6 leading-tight">
                        Recruiting data science talent that drives smarter decisions and faster discovery
                      </h2>
                      <div className="space-y-6 text-gray-700 leading-relaxed">
                        <p className="text-lg">
                        Data science is reshaping the future of medicine: from predictive analytics to AI-driven discovery. JCR Pharma partners with forward-thinking pharmaceutical and biotech organisations to recruit data scientists who can turn complex data into meaningful insight. We believe recruitment should fuel innovation, not slow it down.
                        </p>
                        <p>
                        Our network includes professionals skilled in machine learning, real-world evidence, and advanced statistical modelling across drug development and commercial analytics. We stay ahead of trends in data governance, FAIR principles, and the integration of AI into regulated environments. Every placement is designed to enhance capability in research, development, and decision intelligence.
                        </p>
                      </div>
                      <div className="mt-8">
                        <h3 className="text-2xl font-light text-gray-900 mb-4">Our approach</h3>
                        <p className="text-gray-700 leading-relaxed">
                        We help employers hire thinkers who build the future of data. From predictive modelers to AI engineers, JCR Pharma delivers professionals who combine scientific understanding with creative application.
                        </p>
                      </div>
                    </>
                  )}

                  {activeSpecialism === 'bioinformatics' && (
                    <>
                      <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6 leading-tight">
                        Connecting bioinformatics specialists with organisations pushing the boundaries of precision medicine
                      </h2>
                      <div className="space-y-6 text-gray-700 leading-relaxed">
                        <p className="text-lg">
                        In bioinformatics, discovery depends on the perfect balance of biology, data, and computation. JCR Pharma supports life sciences companies in building teams that push the boundaries of genomics, proteomics, and systems biology. We understand that innovation starts with people who see patterns others can’t.
                        </p>
                        <p>
                        We recruit across next-generation sequencing, multi-omics data analysis, and computational biology, supporting research in biomarker discovery, target validation, and precision medicine. Our consultants speak the same language as your scientists, from RNA-seq to machine learning pipelines, and focus on aligning technical depth with scientific curiosity.
                        </p>
                      </div>
                      <div className="mt-8">
                        <h3 className="text-2xl font-light text-gray-900 mb-4">Our approach</h3>
                        <p className="text-gray-700 leading-relaxed">
                        Every bioinformatics hire you make shapes the pace of innovation. JCR Pharma helps you find computational biologists and bioinformatics experts who don’t just interpret data but uncover the insights that lead to new breakthroughs in human health.
                        </p>
                      </div>
                    </>
                  )}
                </div>
                
                {/* Right side - What we offer */}
                <div className="bg-gray-50 p-8 lg:p-12">
                <h3 className="text-2xl font-light text-gray-900 mb-6">
                  What we offer
                </h3>
                
                <p className="text-gray-700 mb-8 leading-relaxed">
                  We specialise in recruiting for a range of areas within {specializations[activeSpecialism].title.toLowerCase()}, such as:
                </p>
                
                {/* Key Areas List */}
                <div className="space-y-4">
                  {specializations[activeSpecialism].features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-brand-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                
                {/* Key Roles */}
                <div className="mt-8">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Key roles we recruit for:</h4>
                  <div className="space-y-3">
                    {specializations[activeSpecialism].roles.slice(0, 4).map((role, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-600 text-sm">{role}</span>
                      </div>
                    ))}
                    </div>
                  </div>
                  
                <div className="mt-8">
                  <button 
                    onClick={() => navigate('/hire-talent')}
                    className="bg-brand-blue hover:bg-brand-blue/90 text-white px-6 py-3 rounded-lg transition-all duration-300 font-medium"
                  >
                    Get in touch
                </button>
                </div>
              </div>
              </div>
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
              {editMode ? (
                <EditableText
                  value={pageContent.capabilities.title}
                  onChange={(value) => updateContent('capabilities.title', value)}
                  placeholder="Enter capabilities title..."
                  className="text-4xl md:text-5xl font-light leading-tight text-gray-900 text-center block w-full"
                  editMode={editMode}
                  variant="light"
                />
              ) : (
                pageContent.capabilities.title
              )}
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              {editMode ? (
                <EditableText
                  value={pageContent.capabilities.subtitle}
                  onChange={(value) => updateContent('capabilities.subtitle', value)}
                  placeholder="Enter capabilities subtitle..."
                  className="text-gray-600 text-lg text-center block w-full"
                  editMode={editMode}
                  variant="light"
                />
              ) : (
                pageContent.capabilities.subtitle
              )}
            </p>
          </div>

          {/* USPs Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-16">
            {/* Reliability */}
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-blue/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4 text-gray-900">Reliability</h3>
              <p className="text-gray-600 leading-relaxed">
                Consistent delivery of exceptional candidates with proven track records and long-term success
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
                For every role, we provide 5 perfectly matched CV candidates through rigorous screening and assessment
              </p>
            </div>

            {/* Consultative */}
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-blue/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4 text-gray-900">Consultative</h3>
              <p className="text-gray-600 leading-relaxed">
                Strategic partnership approach, providing market insights and tailored recruitment solutions for your specific needs
              </p>
            </div>

            {/* Experts */}
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-blue/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4 text-gray-900">Experts</h3>
              <p className="text-gray-600 leading-relaxed">
                Deep specialisation in life sciences with 10+ years of sector expertise and extensive industry knowledge
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Timeline Section - Parallax */}
      <ParallaxTimelineSection 
        timeline={timeline} 
        editMode={editMode}
        pageContent={pageContent}
        updateContent={updateContent}
      />


      {/* FAQ Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-gray-600 text-sm uppercase tracking-wide mb-4">FAQ</p>
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-gray-900">
              {pageContent.faq?.title || 'Frequently asked questions'}
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              {pageContent.faq?.subtitle || 'Common questions about our specialised recruitment process and services'}
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {(pageContent.faq?.items || faqs).map((faq, index) => (
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
              {(pageContent.cta?.title || 'Start your recruitment\njourney today').split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  {index < (pageContent.cta?.title || 'Start your recruitment\njourney today').split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </h2>
            <p className="text-gray-300 text-lg mb-12 max-w-3xl mx-auto leading-relaxed">
              {pageContent.cta?.subtitle || 'Get in touch with our specialised recruitment team to discuss your hiring needs and learn how we can help you find the perfect candidates.'}
            </p>
            
            {/* Submit Message */}
            {submitMessage && (
              <div className={`p-4 rounded-lg text-center mb-8 max-w-2xl mx-auto ${
                submitMessage.includes('Error') 
                  ? 'bg-red-100 text-red-800 border border-red-300' 
                  : 'bg-green-100 text-green-800 border border-green-300'
              }`}>
                {submitMessage}
              </div>
            )}
            
            {/* Contact Form */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 max-w-2xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <input
                      type="text"
                      name="personName"
                      value={formData.personName}
                      onChange={handleInputChange}
                      required
                      placeholder="Full Name"
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:border-white/50 focus:bg-white/30 transition-all"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      placeholder="Job Title"
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:border-white/50 focus:bg-white/30 transition-all"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="Email Address"
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:border-white/50 focus:bg-white/30 transition-all"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      required
                      placeholder="Company"
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:border-white/50 focus:bg-white/30 transition-all"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="Phone Number"
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:border-white/50 focus:bg-white/30 transition-all"
                    />
                  </div>
                <div>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      placeholder="Company Location"
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:border-white/50 focus:bg-white/30 transition-all"
                    />
                  </div>
                </div>
                
                <div>
                  <textarea
                    name="roleOverview"
                    value={formData.roleOverview}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    placeholder="Tell us about your recruitment needs..."
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:border-white/50 focus:bg-white/30 transition-all resize-none"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white hover:bg-gray-100 text-brand-blue px-8 py-3 rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Get Started'}
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

              {/* Specializations */}
              <div>
                <h4 className="text-white font-medium mb-6">Specializations</h4>
                <ul className="space-y-4">
                  <li><a href="/specialisms/biostatistics" className="text-gray-300 hover:text-white transition-colors text-sm">Biostatistics</a></li>
                  <li><a href="/specialisms/clinical" className="text-gray-300 hover:text-white transition-colors text-sm">Clinical Data Management</a></li>
                  <li><a href="/specialisms/statistical-programming" className="text-gray-300 hover:text-white transition-colors text-sm">Statistical Programming</a></li>
                  <li><a href="/specialisms/data-science" className="text-gray-300 hover:text-white transition-colors text-sm">Data Science</a></li>
                  <li><a href="/specialisms/bioinformatics" className="text-gray-300 hover:text-white transition-colors text-sm">Bioinformatics</a></li>
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

export default Specializations; 