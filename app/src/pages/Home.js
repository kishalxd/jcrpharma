import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAdmin } from '../components/AdminContext';
import { useSEO } from '../hooks/useSEO';

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

// Animated Counter Component
const AnimatedCounter = ({ targetValue, className = "" }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const countRef = useRef(null);

  // Extract numeric value and suffix from targetValue string
  const parseValue = (value) => {
    if (!value || typeof value !== 'string') {
      value = String(value || '0');
    }
    
    // Extract number and any suffix (e.g., "3 Weeks" -> { number: 3, suffix: " Weeks" })
    const match = value.match(/^([\d.]+)(.*)$/);
    if (match) {
      return {
        number: parseFloat(match[1]),
        suffix: match[2] || ''
      };
    }
    return { number: 0, suffix: '' };
  };

  useEffect(() => {
    if (hasAnimated) return;

    const currentRef = countRef.current;
    if (!currentRef) return;

    const observerOptions = {
      threshold: 0.3,
      rootMargin: '0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const { number: target } = parseValue(targetValue);
          
          if (isNaN(target) || target === 0) {
            setCount(0);
            return;
          }

          const duration = 2000; // 2 seconds
          const steps = 60;
          const increment = target / steps;
          const stepDuration = duration / steps;

          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            setCount(current);
          }, stepDuration);
        }
      });
    }, observerOptions);

    observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasAnimated, targetValue]);

  // Display format preserving the original suffix
  const displayValue = () => {
    const { suffix } = parseValue(targetValue);
    const numValue = Math.floor(count);
    
    // Return the number with the preserved suffix
    return `${numValue}${suffix}`;
  };

  return <span ref={countRef} className={className}>{displayValue()}</span>;
};

// Parallax USP Section Component
const ParallaxUSPSection = () => {
  const [activeIndex, setActiveIndex] = useState(-1); // Start with -1 to handle initial state
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  const scrollingContentRef = useRef(null);
  const descriptionRefs = useRef([]);

  const uspItems = [
    {
      title: "Quality Over Quantity",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: "We believe hiring in life sciences should never be about numbers. Our recruiters focus on precision, not volume. We shortlist only the five to seven candidates who genuinely match your technical needs, team culture, and long-term goals. Whether you are hiring a biostatistician, a data scientist, or a clinical programmer, we make sure every recommendation is the right fit from the start.",
    },
    {
      title: "Consultative Approach",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      description: "We work alongside you as a partner, not a supplier. Every search begins with a conversation. We take time to understand your team, your data systems, and your upcoming projects. With years of experience in biometrics and pharmaceutical recruitment, our consultative approach helps you plan ahead and hire with confidence.",
    },
    {
      title: "Specialised Experts",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      description: "Our focus is intentionally narrow. We recruit within biometrics, biostatistics, data science, and clinical data management. These are the areas where we know the people, the challenges, and the opportunities. Our deep specialisation across the UK, EU, and US life sciences markets helps us stay ahead of change and deliver lasting results for every client.",
    },
  ];

  // Observer for active USP
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
      const headerFadeStart = windowHeight * 0.3; // Start fading header later
      const headerFadeEnd = windowHeight * 0.1; // Complete header fade
      const contentFadeStart = windowHeight * 0.15; // Start content fade after header is mostly gone
      
      // Header fade out
      const headerProgress = Math.max(0, Math.min(1, (headerFadeStart - rect.top) / (headerFadeStart - headerFadeEnd)));
      headerRef.current.style.opacity = 1 - headerProgress;
      
      // Content fade in (delayed until header is mostly faded)
      const contentProgress = Math.max(0, Math.min(1, (contentFadeStart - rect.top) / contentFadeStart));
      const contentOpacity = contentProgress;
      contentRef.current.style.opacity = contentOpacity;
      scrollingContentRef.current.style.opacity = contentOpacity;

      // Outro fade - only fade out if not at the last USP
      const exitPoint = rect.height - windowHeight * 1.5;
      if (rect.top < -exitPoint && activeIndex !== uspItems.length - 1) {
        const exitProgress = Math.max(0, Math.min(1, (-rect.top - exitPoint) / (windowHeight * 0.5)));
        const finalOpacity = Math.max(contentOpacity * (1 - exitProgress), contentOpacity);
        contentRef.current.style.opacity = finalOpacity;
        scrollingContentRef.current.style.opacity = finalOpacity;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="bg-brand-blue py-8 relative" style={{ minHeight: '300vh' }}>
      {/* Sticky container for the animations */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-start pt-16">
        
        {/* Step 1: Header */}
        <div ref={headerRef} className="text-center transition-all duration-200" style={{ opacity: 0 }}>
          <p className="text-gray-300 text-sm uppercase tracking-wide mb-4">Why choose us</p>
          <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-white">
            Our unique value proposition
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Specialised recruitment strategies that deliver exceptional results
          </p>
        </div>

        {/* Step 2-4: USP Content */}
        <div ref={contentRef} className="grid md:grid-cols-2 gap-12 md:gap-20 items-center max-w-7xl mx-auto w-full px-6 absolute top-0 left-0 right-0 h-full transition-opacity duration-300" style={{ opacity: 0 }}>
          {/* Left side - Title (Fixed) */}
          <div className="relative h-48 flex items-center justify-center">
            {uspItems.map((item, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ease-in-out absolute top-0 left-0 w-full h-full flex items-center ${
                  activeIndex === index
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8 pointer-events-none'
                }`}
              >
                <h3 className="text-4xl md:text-5xl font-light leading-tight text-white">
                  {item.title}
                </h3>
              </div>
            ))}
          </div>
          {/* Right side placeholder - this column is just for grid layout, the actual content is below */}
          <div></div>
        </div>
      </div>

      {/* Right side - Scrolling descriptions (non-sticky part) */}
      <div ref={scrollingContentRef} style={{opacity: 0}} className="relative max-w-7xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 -mt-[100vh] pointer-events-none transition-opacity duration-300">
        {/* Left side placeholder */}
        <div></div>
        {/* Actual scrolling content */}
        <div className="space-y-[50vh] pt-[25vh] pb-[25vh] pointer-events-auto">
          {uspItems.map((item, index) => (
            <div
              key={index}
              ref={(el) => (descriptionRefs.current[index] = el)}
              data-index={index}
              className="min-h-[50vh] flex items-center justify-center"
            >
              <div className="w-full">
                <p className="text-gray-300 text-lg leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialsCarousel = ({ testimonials = [], editMode, updateTestimonial, addTestimonial, deleteTestimonial }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Safety check for empty testimonials
  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="max-w-6xl mx-auto text-center">
        <div className="text-white/60 text-lg">
          {editMode ? (
            <div>
              <p className="mb-4">No testimonials found. Add your first testimonial to get started.</p>
              <button
                onClick={addTestimonial}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors mx-auto"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add First Testimonial</span>
              </button>
            </div>
          ) : (
            <p>No testimonials available at the moment.</p>
          )}
        </div>
      </div>
    );
  }

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index) => {
    setCurrentIndex(index);
  };

  const currentTestimonial = testimonials[currentIndex] || testimonials[0];

  const EditableTestimonialText = ({ value, onChange, multiline = false, placeholder, className = "" }) => {
    if (!editMode) {
      return <span className={className}>{value}</span>;
    }

    const Component = multiline ? 'textarea' : 'input';
    
    return (
      <div className="relative group">
        <Component
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={multiline ? 4 : undefined}
          className={`${className} bg-white/80 backdrop-blur-sm border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-brand-blue focus:bg-white outline-none transition-all duration-200 hover:border-gray-400 resize-none`}
        />
        <div className="absolute -top-2 -left-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto relative">
      {editMode && (
        <div className="mb-6 flex justify-center space-x-4">
          <button
            onClick={addTestimonial}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Testimonial</span>
          </button>
          {testimonials.length > 1 && (
            <button
              onClick={() => deleteTestimonial(currentTestimonial.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Delete Current</span>
            </button>
          )}
        </div>
      )}

      {/* Testimonial Card */}
      <div className="text-center">
        {/* Testimonial Text with Navigation */}
        <div className="relative">
          {/* Left Arrow - Positioned relative to testimonial text */}
          <button 
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-16 w-12 h-12 bg-brand-blue/10 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:bg-brand-blue/20 transition-shadow"
          >
            <svg className="w-5 h-5 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right Arrow - Positioned relative to testimonial text */}
          <button 
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-16 w-12 h-12 bg-brand-blue/10 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:bg-brand-blue/20 transition-shadow"
          >
            <svg className="w-5 h-5 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <blockquote className="text-xl md:text-2xl font-light text-brand-blue mb-12 max-w-4xl mx-auto leading-relaxed">
            "
            {editMode ? (
              <EditableTestimonialText
                value={currentTestimonial.quote}
                onChange={(value) => updateTestimonial(currentTestimonial.id, 'quote', value)}
                multiline={true}
                placeholder="Enter testimonial quote..."
                className="text-xl md:text-2xl font-light text-brand-blue leading-relaxed inline-block w-full"
              />
            ) : (
              currentTestimonial.quote
            )}
            "
          </blockquote>
        </div>

        {/* Author Info */}
        <div className="flex flex-col items-center">
          {/* Avatar - only show if image_base64 exists */}
          {currentTestimonial.image_base64 && (
            <div className="w-16 h-16 bg-white rounded-full mb-4 flex items-center justify-center overflow-hidden">
              <img 
                src={currentTestimonial.image_base64} 
                alt={currentTestimonial.author}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Name and Position */}
          <h4 className="text-lg font-medium text-brand-blue mb-1">
            <EditableTestimonialText
              value={currentTestimonial.author}
              onChange={(value) => updateTestimonial(currentTestimonial.id, 'author', value)}
              placeholder="Author name..."
              className="text-lg font-medium text-brand-blue text-center block w-full"
            />
          </h4>
          {(currentTestimonial.position || currentTestimonial.company || editMode) && (
            <p className="text-brand-blue">
              {(currentTestimonial.position || editMode) && (
                <EditableTestimonialText
                  value={currentTestimonial.position}
                  onChange={(value) => updateTestimonial(currentTestimonial.id, 'position', value)}
                  placeholder="Position..."
                  className="text-brand-blue text-center inline-block"
                />
              )}
              {currentTestimonial.position && currentTestimonial.company && ', '}
              {(currentTestimonial.company || editMode) && (
                <EditableTestimonialText
                  value={currentTestimonial.company}
                  onChange={(value) => updateTestimonial(currentTestimonial.id, 'company', value)}
                  placeholder="Company..."
                  className="text-brand-blue text-center inline-block ml-1"
                />
              )}
            </p>
          )}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center space-x-2 mt-12">
          {testimonials && testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-white' : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAdminAuthenticated } = useAdmin();
  const [content, setContent] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedNotification, setSavedNotification] = useState(false);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  
  // Newsletter subscription state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterMessage, setNewsletterMessage] = useState('');

  // Check if we're in edit mode from URL params and if admin is logged in
  useEffect(() => {
    const isEdit = searchParams.get('edit') === 'true';
    if (isEdit) {
      if (isAdminAuthenticated) {
        // Admin is logged in, enable edit mode
        setEditMode(true);
      } else {
        // Admin not logged in, redirect to login with return URL
        navigate('/admin-login?redirect=' + encodeURIComponent('/?edit=true'));
        return;
      }
    } else {
      // Not in edit mode
      setEditMode(false);
    }
  }, [searchParams, isAdminAuthenticated, navigate]);

  // Default content (fallback)
  const defaultContent = {
    hero: {
      title: "Life Sciences, Biometrics & Data Recruitment Specialists",
      subtitle: "We help biotech and pharmaceutical companies build world-class teams in biostatistics, clinical data management, and data science, connecting life-sciences professionals with employers across the UK, USA, and Europe."
    },
    specialisms: {
      title: "Our recruitment expertise",
      subtitle: "Targeted talent solutions across critical life-sciences domains",
      biostatistics: {
        title: "Advanced statistical analysis for clinical research",
        tag: "Statistical programming"
      },
      clinicalData: {
        title: "Clinical data management",
        description: "Precise data handling and regulatory compliance"
      },
      bioinformatics: {
        title: "Bioinformatics",
        description: "Computational solutions for biological data"
      }
    },
    excellence: {
      title: "Measuring our recruitment\nexcellence",
      subtitle: "Quantifiable results that demonstrate our specialised approach",
      stat1: {
        number: "3",
        description: "Average time-to-hire"
      },
      stat2: {
        number: "95%",
        description: "Interview to offer success rate"
      },
      stat3: {
        number: "90%+",
        description: "Candidate retention after 1 year"
      }
    },
    cta: {
      title: "Ready to find your next\nlife sciences talent?",
      subtitle: "Connect with our specialised recruitment team today and discover how we can accelerate your hiring process with qualified, pre-screened candidates."
    },
    process: {
      label: "Our Process",
      title: "Recruitment Built for Life Sciences Excellence",
      description: "We combine industry expertise with a people-first approach to connect biotech and pharma companies with top talent in biometrics, data science, and clinical data management.",
      expertScreening: {
        title: "Expert Screening",
        description: "Each candidate is thoroughly evaluated for technical accuracy, regulatory compliance, and domain expertise before reaching you."
      },
      culturalFit: {
        title: "Cultural Fit",
        description: "We match candidates who align with your values and working style to support long-term success and retention."
      }
    },
    testimonials: {
      title: "What our clients say",
      items: [
        {
          id: 1,
          quote: "The team at JCR found us the perfect biostatistician within just 10 days. Their deep understanding of our industry requirements and their extensive network of qualified candidates made all the difference in our critical oncology trial.",
          author: "Dr. Sarah Mitchell",
          position: "Head of Clinical Development",
          company: "BioNTech",
          avatar: "SM"
        },
        {
          id: 2,
          quote: "We've worked with several recruitment agencies, but none have matched JCR's expertise in life sciences data roles. They consistently deliver candidates who not only have the technical skills but also understand regulatory compliance.",
          author: "Marcus Weber",
          position: "VP of Data Science",
          company: "Immatics",
          avatar: "MW"
        },
        {
          id: 3,
          quote: "JCR's specialised approach to bioinformatics recruitment is unmatched. They placed three senior data scientists with us last year, all of whom have exceeded our expectations and are still with the company.",
          author: "Elena Rodriguez",
          position: "Chief Scientific Officer",
          company: "Debiopharm",
          avatar: "ER"
        },
        {
          id: 4,
          quote: "The quality of candidates JCR presents is exceptional. They truly understand the nuances of clinical data management and consistently find professionals who can hit the ground running in complex pharmaceutical environments.",
          author: "James Thompson",
          position: "Director of Clinical Operations",
          company: "Klifo",
          avatar: "JT"
        },
        {
          id: 5,
          quote: "JCR has been instrumental in scaling our biostatistics team. Their rapid turnaround time and thorough screening process have saved us countless hours while ensuring we get top-tier talent for our precision medicine initiatives.",
          author: "Dr. Lisa Chen",
          position: "VP of Biostatistics",
          company: "BET Pharma",
          avatar: "LC"
        }
      ]
    }
  };

  const fetchContent = async () => {
    // Always use default content, don't read from database
    setContent(defaultContent);
  };

  const fetchFeaturedJobs = async () => {
    try {
      // Get all latest jobs (both featured and non-featured, max 5)
      const { data: allJobsData, error: allError } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(5);

      if (allError) throw allError;

      // Separate featured and non-featured
      const featuredJobs = allJobsData.filter(job => job.featured);
      const nonFeaturedJobs = allJobsData.filter(job => !job.featured);

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

      setFeaturedJobs(result);
    } catch (error) {
      console.error('Error fetching featured jobs:', error);
      setFeaturedJobs([]);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('status', 'active')
        .order('display_order', { ascending: true });

      if (error) throw error;

      // Transform database testimonials to match the expected format
      const transformedTestimonials = data.map(testimonial => ({
        id: testimonial.id,
        quote: testimonial.text,
        author: testimonial.name,
        position: testimonial.position || '',
        company: testimonial.company || '',
        avatar: testimonial.name.split(' ').map(n => n[0]).join('').toUpperCase(), // Generate initials
        image_base64: testimonial.image_base64 || null
      }));

      setTestimonials(transformedTestimonials);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      // Fall back to default testimonials if database fetch fails
      setTestimonials([]);
    }
  };

  useEffect(() => {
    fetchContent();
    fetchFeaturedJobs();
    fetchTestimonials();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useScrollAnimation();

  const pageContent = content || defaultContent;

  // Set SEO metadata
  useSEO(
    'Home',
    'Specialised recruitment for life sciences, biometrics & data professionals. Connect top talent with biotech and pharmaceutical companies across UK, USA, and Europe in biostatistics, clinical data management, and data science.',
    {
      image: '/jcr_logo.jpg',
      twitterSite: '@JCRPharma'
    }
  );

  const updateTestimonial = (id, field, value) => {
    setContent(prev => {
      const newContent = { ...prev };
      const testimonialIndex = newContent.testimonials.items.findIndex(t => t.id === id);
      if (testimonialIndex !== -1) {
        newContent.testimonials.items[testimonialIndex] = {
          ...newContent.testimonials.items[testimonialIndex],
          [field]: value
        };
      }
      return newContent;
    });
  };

  const addTestimonial = () => {
    const newId = Math.max(...pageContent.testimonials.items.map(t => t.id), 0) + 1;
    const newTestimonial = {
      id: newId,
      quote: "Enter your testimonial quote here...",
      author: "Author Name",
      position: "Job Title",
      company: "Company Name",
      avatar: "AN"
    };

    setContent(prev => {
      const newContent = { ...prev };
      newContent.testimonials.items.push(newTestimonial);
      return newContent;
    });
  };

  const deleteTestimonial = (id) => {
    if (pageContent.testimonials.items.length <= 1) {
      alert("You must have at least one testimonial.");
      return;
    }

    setContent(prev => {
      const newContent = { ...prev };
      newContent.testimonials.items = newContent.testimonials.items.filter(t => t.id !== id);
      return newContent;
    });
  };

  const updateContent = (path, value) => {
    setContent(prev => {
      const newContent = { ...prev };
      const keys = path.split('.');
      let current = newContent;
      
      for (let i = 0; i < keys.length - 1; i++) {
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
          page_name: 'home',
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
    navigate('/');
    setEditMode(false);
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

  const EditableText = ({ value, onChange, multiline = false, placeholder, className = "", rows = 1 }) => {
    if (!editMode) {
      return (
        <span className={className}>
          {value.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {index < value.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </span>
      );
    }

    const Component = multiline ? 'textarea' : 'input';
    
    return (
      <div className="relative group">
        <Component

          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={multiline ? rows : undefined}
          className={`${className} bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-lg px-4 py-2 focus:border-white focus:bg-white/20 outline-none transition-all duration-200 hover:border-white/50 resize-none`}
          style={editMode ? { minHeight: multiline ? '80px' : '40px' } : {}}
        />
        <div className="absolute -top-2 -left-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  };

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
      
      <div className={`bg-brand-blue ${editMode ? 'pt-20' : ''}`}>
        
        {/* Hero Section */}
        <main className="container mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Left side - Text and Buttons (50%) */}
            <div className="text-white">
              <h1 className="text-5xl md:text-6xl font-light mb-8 leading-tight text-left">
                <EditableText
                  value={pageContent.hero.title}
                  onChange={(value) => updateContent('hero.title', value)}
                  multiline={true}
                  rows={2}
                  placeholder="Enter hero title..."
                  className="text-5xl md:text-6xl font-light leading-tight text-left block w-full"
                />
              </h1>
              <p className="text-gray-300 text-lg md:text-xl mb-12 leading-relaxed text-left">
                <EditableText
                  value={pageContent.hero.subtitle}
                  onChange={(value) => updateContent('hero.subtitle', value)}
                  multiline={true}
                  rows={3}
                  placeholder="Enter hero subtitle..."
                  className="text-gray-300 text-lg md:text-xl leading-relaxed text-left block w-full"
                />
              </p>
              
              {/* Action Buttons - Left Aligned */}
              <div className="flex flex-col sm:flex-row gap-4 justify-start">
                <button 
                  onClick={() => navigate('/hire-talent')}
                  className="bg-white/10 hover:bg-white/20 text-white hover:text-white px-8 py-3 rounded-full transition-all duration-300 backdrop-blur-md shadow-[0_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.2)] hover:backdrop-blur-lg font-medium"
                >
                  Hire talent
                </button>
                <button 
                  onClick={() => navigate('/find-jobs')}
                  className="bg-white/10 text-white hover:bg-white/15 px-8 py-3 rounded-full transition-all duration-300 backdrop-blur-sm hover:backdrop-blur-lg shadow-[0_2px_4px_rgba(0,0,0,0.15)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.15)] font-medium"
                >
                  Find jobs
                </button>
              </div>
            </div>
            
            {/* Right side - Image (50%) */}
            <div>
              <div className="rounded-lg overflow-hidden shadow-2xl">
                <img 
                  src="/home_hero.JPG" 
                  alt="Life Sciences Recruitment" 
                  className="w-full h-full object-cover aspect-square"
                />
              </div>
            </div>
          </div>

          {/* Specialisms Section */}
          <div className="text-center text-white mb-16">
            <p className="text-gray-300 text-sm uppercase tracking-wide mb-4">Specialisms</p>
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight">
              <EditableText
                value={pageContent.specialisms.title}
                onChange={(value) => updateContent('specialisms.title', value)}
                placeholder="Enter specialisms title..."
                className="text-4xl md:text-5xl font-light leading-tight text-center block w-full"
              />
            </h2>
            <p className="text-gray-300 text-lg mb-16 max-w-3xl mx-auto">
              <EditableText
                value={pageContent.specialisms.subtitle}
                onChange={(value) => updateContent('specialisms.subtitle', value)}
                placeholder="Enter specialisms subtitle..."
                className="text-gray-300 text-lg text-center block w-full"
              />
            </p>
          </div>

          {/* Expertise Cards - Lego Style */}
          <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* Card 1: Biostatistics - 2x width */}
            <div 
              className="md:col-span-2 bg-slate-800 bg-opacity-60 rounded-lg p-8 backdrop-blur-sm relative shadow-[0_2px_4px_rgba(0,0,0,0.15)] cursor-pointer hover:bg-slate-700 hover:bg-opacity-60 transition-all duration-300"
              onClick={() => navigate('/specialisms?focus=biostatistics')}
            >
              <h3 className="text-white text-2xl font-light mb-4 leading-tight">
                Biostatistics
              </h3>
              <p className="text-gray-300 text-sm mb-8 leading-relaxed">
                Advanced statistical analysis and methodology for clinical trials and research studies.
              </p>
              <div className="absolute bottom-8 left-8">
                <span className="text-white text-sm flex items-center gap-1">
                  Explore
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Card 2: Clinical Data Management - 1x width */}
            <div 
              className="bg-slate-800 bg-opacity-60 rounded-lg p-8 backdrop-blur-sm relative shadow-[0_2px_4px_rgba(0,0,0,0.15)] cursor-pointer hover:bg-slate-700 hover:bg-opacity-60 transition-all duration-300"
              onClick={() => navigate('/specialisms?focus=clinical')}
            >
              <h3 className="text-white text-2xl font-light mb-4 leading-tight">
                Clinical Data<br />Management
              </h3>
              <p className="text-gray-300 text-sm mb-8 leading-relaxed">
                Comprehensive data handling and regulatory compliance.
              </p>
              <div className="absolute bottom-8 left-8">
                <span className="text-white text-sm flex items-center gap-1">
                  Explore
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Card 3: Statistical Programming - 1x width */}
            <div 
              className="bg-slate-800 bg-opacity-60 rounded-lg p-8 backdrop-blur-sm relative shadow-[0_2px_4px_rgba(0,0,0,0.15)] cursor-pointer hover:bg-slate-700 hover:bg-opacity-60 transition-all duration-300"
              onClick={() => navigate('/specialisms?focus=statistical-programming')}
            >
              <h3 className="text-white text-2xl font-light mb-4 leading-tight">
                Statistical<br />Programming
              </h3>
              <p className="text-gray-300 text-sm mb-8 leading-relaxed">
                SAS, R, and Python programming for clinical research.
              </p>
              <div className="absolute bottom-8 left-8">
                <span className="text-white text-sm flex items-center gap-1">
                  Explore
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Card 4: Data Science - 2x width (second row) */}
            <div 
              className="md:col-span-2 bg-slate-800 bg-opacity-60 rounded-lg p-8 backdrop-blur-sm relative shadow-[0_2px_4px_rgba(0,0,0,0.15)] cursor-pointer hover:bg-slate-700 hover:bg-opacity-60 transition-all duration-300"
              onClick={() => navigate('/specialisms?focus=data-science')}
            >
              <h3 className="text-white text-2xl font-light mb-4 leading-tight">
                Data Science
              </h3>
              <p className="text-gray-300 text-sm mb-8 leading-relaxed">
                Machine learning and AI-driven insights for pharmaceutical innovation and biomarker discovery.
              </p>
              <div className="absolute bottom-8 left-8">
                <span className="text-white text-sm flex items-center gap-1">
                  Explore
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Card 5: Bioinformatics - 2x width (second row) */}
            <div 
              className="md:col-span-2 bg-slate-800 bg-opacity-60 rounded-lg p-8 backdrop-blur-sm relative shadow-[0_2px_4px_rgba(0,0,0,0.15)] cursor-pointer hover:bg-slate-700 hover:bg-opacity-60 transition-all duration-300"
              onClick={() => navigate('/specialisms?focus=bioinformatics')}
            >
              <h3 className="text-white text-2xl font-light mb-4 leading-tight">
                Bioinformatics
              </h3>
              <p className="text-gray-300 text-sm mb-8 leading-relaxed">
                Computational biology and genomics expertise for precision medicine and biomarker development.
              </p>
              <div className="absolute bottom-8 left-8">
                <span className="text-white text-sm flex items-center gap-1">
                  Explore
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Featured Opportunities Section */}
      <section className="bg-white py-20 opacity-0" data-animate>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-gray-600 text-sm uppercase tracking-wide mb-4">Jobs</p>
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-gray-900">
              Featured opportunities
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Discover cutting-edge roles in life-sciences data and biometrics
            </p>
          </div>

          {/* Job Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto mb-12">
            {featuredJobs.length > 0 ? (
              featuredJobs.map((job) => (
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
              onClick={() => navigate('/jobs')}
              className="bg-brand-blue/90 hover:bg-brand-blue/80 text-white px-8 py-3 rounded-full transition-all duration-300 backdrop-blur-md shadow-[0_2px_4px_rgba(0,0,0,0.2)] font-medium"
            >
              View all jobs
            </button>
          </div>
        </div>
      </section>

      {/* Trusted by Section */}
      <section className="bg-brand-blue py-16 opacity-0" data-animate>
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-xl font-light text-white mb-8">
              Trusted by leading life-sciences organisations
            </h2>
          </div>

          {/* Logo Carousel */}
          <div className="flex items-center justify-center overflow-hidden relative w-full">
            <div className="flex items-center animate-scroll whitespace-nowrap" style={{ width: 'fit-content' }}>
              {/* BioNTech Logo */}
              <div className="flex items-center justify-center h-12 mx-4 md:mx-6 lg:mx-8 flex-shrink-0">
                <img 
                  src="/partner_companies/BioNTech.png" 
                  alt="BioNTech" 
                  className="h-8 md:h-10 object-contain brightness-0 invert"
                />
              </div>

              {/* Immatics Logo */}
              <div className="flex items-center justify-center h-12 mx-4 md:mx-6 lg:mx-8 flex-shrink-0">
                <img 
                  src="/partner_companies/Immatics.png" 
                  alt="Immatics" 
                  className="h-8 md:h-10 object-contain brightness-0 invert"
                />
              </div>

              {/* Debiopharm Logo */}
              <div className="flex items-center justify-center h-12 mx-4 md:mx-6 lg:mx-8 flex-shrink-0">
                <img 
                  src="/partner_companies/Debiopharm.png" 
                  alt="Debiopharm" 
                  className="h-8 md:h-10 object-contain brightness-0 invert"
                />
              </div>

              {/* Klifo Logo */}
              <div className="flex items-center justify-center h-12 mx-4 md:mx-6 lg:mx-8 flex-shrink-0">
                <img 
                  src="/partner_companies/Klifo-logo.png" 
                  alt="Klifo" 
                  className="h-8 md:h-10 object-contain brightness-0 invert"
                />
              </div>

              {/* BET Logo */}
              <div className="flex items-center justify-center h-12 mx-4 md:mx-6 lg:mx-8 flex-shrink-0">
                <img 
                  src="/partner_companies/BET.webp" 
                  alt="BET" 
                  className="h-8 md:h-10 object-contain brightness-0 invert"
                />
              </div>

              {/* Duplicate logos for seamless loop */}
              <div className="flex items-center justify-center h-12 mx-4 md:mx-6 lg:mx-8 flex-shrink-0">
                <img 
                  src="/partner_companies/BioNTech.png" 
                  alt="BioNTech" 
                  className="h-8 md:h-10 object-contain brightness-0 invert"
                />
              </div>

              <div className="flex items-center justify-center h-12 mx-4 md:mx-6 lg:mx-8 flex-shrink-0">
                <img 
                  src="/partner_companies/Immatics.png" 
                  alt="Immatics" 
                  className="h-8 md:h-10 object-contain brightness-0 invert"
                />
              </div>

              <div className="flex items-center justify-center h-12 mx-4 md:mx-6 lg:mx-8 flex-shrink-0">
                <img 
                  src="/partner_companies/Debiopharm.png" 
                  alt="Debiopharm" 
                  className="h-8 md:h-10 object-contain brightness-0 invert"
                />
              </div>

              <div className="flex items-center justify-center h-12 mx-4 md:mx-6 lg:mx-8 flex-shrink-0">
                <img 
                  src="/partner_companies/Klifo-logo.png" 
                  alt="Klifo" 
                  className="h-8 md:h-10 object-contain brightness-0 invert"
                />
              </div>

              <div className="flex items-center justify-center h-12 mx-4 md:mx-6 lg:mx-8 flex-shrink-0">
                <img 
                  src="/partner_companies/BET.webp" 
                  alt="BET" 
                  className="h-8 md:h-10 object-contain brightness-0 invert"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Measuring Excellence Section */}
      <section className="bg-gray-50 py-20 opacity-0" data-animate>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-gray-600 text-sm uppercase tracking-wide mb-4">Our impact</p>
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-gray-900">
              <EditableText
                value={pageContent.excellence.title}
                onChange={(value) => updateContent('excellence.title', value)}
                multiline={true}
                rows={2}
                placeholder="Enter excellence title..."
                className="text-4xl md:text-5xl font-light leading-tight text-gray-900 text-center block w-full"
              />
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              <EditableText
                value={pageContent.excellence.subtitle}
                onChange={(value) => updateContent('excellence.subtitle', value)}
                placeholder="Enter excellence subtitle..."
                className="text-gray-600 text-lg text-center block w-full"
              />
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto items-center">
            {/* Image Section */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <div className="rounded-lg overflow-hidden shadow-lg aspect-video">
                <img 
                  src="/home_our_impact.JPG" 
                  alt="Our Impact in Life Sciences Recruitment" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Statistics Section */}
            <div className="lg:col-span-1 order-1 lg:order-2 space-y-12">
              {/* Stat 1 */}
              <div>
                <div className="text-6xl md:text-7xl font-light text-gray-900 mb-2 text-center">
                  {!editMode ? (
                    <AnimatedCounter
                      targetValue={pageContent.excellence.stat1.number}
                      className="text-6xl md:text-7xl font-light text-gray-900 block"
                    />
                  ) : (
                    <EditableText
                      value={pageContent.excellence.stat1.number}
                      onChange={(value) => updateContent('excellence.stat1.number', value)}
                      placeholder="Number..."
                      className="text-6xl md:text-7xl font-light text-gray-900 text-center block w-full"
                    />
                  )}
                </div>
                <p className="text-gray-700 text-lg">
                  <EditableText
                    value={pageContent.excellence.stat1.description}
                    onChange={(value) => updateContent('excellence.stat1.description', value)}
                    placeholder="Description..."
                    className="text-gray-700 text-lg text-center block w-full"
                  />
                </p>
              </div>

              {/* Stat 2 */}
              <div>
                <div className="text-6xl md:text-7xl font-light text-gray-900 mb-2 text-center">
                  {!editMode ? (
                    <AnimatedCounter
                      targetValue={pageContent.excellence.stat2.number}
                      className="text-6xl md:text-7xl font-light text-gray-900 block"
                    />
                  ) : (
                    <EditableText
                      value={pageContent.excellence.stat2.number}
                      onChange={(value) => updateContent('excellence.stat2.number', value)}
                      placeholder="Number..."
                      className="text-6xl md:text-7xl font-light text-gray-900 text-center block w-full"
                    />
                  )}
                </div>
                <p className="text-gray-700 text-lg">
                  <EditableText
                    value={pageContent.excellence.stat2.description}
                    onChange={(value) => updateContent('excellence.stat2.description', value)}
                    placeholder="Description..."
                    className="text-gray-700 text-lg text-center block w-full"
                  />
                </p>
              </div>

              {/* Stat 3 */}
              <div>
                <div className="text-6xl md:text-7xl font-light text-gray-900 mb-2 text-center">
                  {!editMode ? (
                    <AnimatedCounter
                      targetValue={pageContent.excellence.stat3.number}
                      className="text-6xl md:text-7xl font-light text-gray-900 block"
                    />
                  ) : (
                    <EditableText
                      value={pageContent.excellence.stat3.number}
                      onChange={(value) => updateContent('excellence.stat3.number', value)}
                      placeholder="Number..."
                      className="text-6xl md:text-7xl font-light text-gray-900 text-center block w-full"
                    />
                  )}
                </div>
                <p className="text-gray-700 text-lg">
                  <EditableText
                    value={pageContent.excellence.stat3.description}
                    onChange={(value) => updateContent('excellence.stat3.description', value)}
                    placeholder="Description..."
                    className="text-gray-700 text-lg text-center block w-full"
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section - Parallax */}
      <ParallaxUSPSection />

      {/* Testimonials Section */}
      <section className="bg-white py-20 opacity-0" data-animate>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-xl md:text-2xl font-bold text-brand-blue leading-relaxed">
              <EditableText
                value={pageContent.testimonials.title}
                onChange={(value) => updateContent('testimonials.title', value)}
                placeholder="Enter testimonials title..."
                className="text-xl md:text-2xl font-bold text-brand-blue leading-relaxed text-center block w-full"
              />
            </h2>
          </div>
          <TestimonialsCarousel 
            testimonials={testimonials.length > 0 ? testimonials : (pageContent.testimonials?.items || [])}
            editMode={editMode}
            updateTestimonial={updateTestimonial}
            addTestimonial={addTestimonial}
            deleteTestimonial={deleteTestimonial}
          />
        </div>
      </section>

      {/* Content Section */}
      <section className="bg-brand-blue py-20 opacity-0" data-animate>
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
            {/* Image Section */}
            <div className="order-2 lg:order-1">
              <div className="rounded-lg overflow-hidden shadow-lg aspect-[4/3] relative">
                <img 
                  src="/home_our_process.JPG" 
                  alt="Our Recruitment Process" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Content Section */}
            <div className="order-1 lg:order-2">
              <div className="mb-4">
                <span className="text-gray-300 text-sm uppercase tracking-wide">
                  {pageContent.process?.label || "Our Process"}
                </span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-white">
                <EditableText
                  value={pageContent.process?.title || ""}
                  onChange={(value) => updateContent('process.title', value)}
                  placeholder="Enter process title..."
                  className="text-4xl md:text-5xl font-light leading-tight text-white block w-full"
                />
              </h2>
                  
              <p className="text-gray-300 text-lg mb-12 leading-relaxed">
                <EditableText
                  value={pageContent.process?.description || ""}
                  onChange={(value) => updateContent('process.description', value)}
                  multiline={true}
                  rows={3}
                  placeholder="Enter process description..."
                  className="text-gray-300 text-lg leading-relaxed block w-full"
                />
              </p>

              {/* Subheadings Grid */}
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div>
                  <h3 className="text-xl font-medium mb-4 text-white">
                    <EditableText
                      value={pageContent.process?.expertScreening?.title || ""}
                      onChange={(value) => updateContent('process.expertScreening.title', value)}
                      placeholder="Expert Screening title..."
                      className="text-xl font-medium text-white block w-full"
                    />
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    <EditableText
                      value={pageContent.process?.expertScreening?.description || ""}
                      onChange={(value) => updateContent('process.expertScreening.description', value)}
                      multiline={true}
                      rows={3}
                      placeholder="Expert Screening description..."
                      className="text-gray-300 leading-relaxed block w-full"
                    />
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-4 text-white">
                    <EditableText
                      value={pageContent.process?.culturalFit?.title || ""}
                      onChange={(value) => updateContent('process.culturalFit.title', value)}
                      placeholder="Cultural Fit title..."
                      className="text-xl font-medium text-white block w-full"
                    />
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    <EditableText
                      value={pageContent.process?.culturalFit?.description || ""}
                      onChange={(value) => updateContent('process.culturalFit.description', value)}
                      multiline={true}
                      rows={3}
                      placeholder="Cultural Fit description..."
                      className="text-gray-300 leading-relaxed block w-full"
                    />
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate('/hire-talent')}
                  className="bg-white hover:bg-gray-100 text-brand-blue px-6 py-3 rounded transition-all duration-300 shadow-[0_2px_4px_rgba(0,0,0,0.15)] font-medium"
                >
                  Start Hiring
                </button>
                <button 
                  onClick={() => navigate('/find-jobs')}
                  className="text-white hover:bg-white/10 border border-white/30 hover:border-white/50 px-6 py-3 rounded transition-all duration-300 flex items-center gap-1 font-medium"
                >
                  Find Jobs
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-20 opacity-0" data-animate>
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-gray-900">
              <EditableText
                value={pageContent.cta.title}
                onChange={(value) => updateContent('cta.title', value)}
                multiline={true}
                rows={2}
                placeholder="Enter CTA title..."
                className="text-4xl md:text-5xl font-light leading-tight text-gray-900 text-center block w-full"
              />
            </h2>
            <p className="text-gray-600 text-lg mb-12 max-w-3xl mx-auto leading-relaxed">
              <EditableText
                value={pageContent.cta.subtitle}
                onChange={(value) => updateContent('cta.subtitle', value)}
                multiline={true}
                rows={3}
                placeholder="Enter CTA subtitle..."
                className="text-gray-600 text-lg leading-relaxed text-center block w-full"
              />
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/hire-talent')}
                className="bg-brand-blue hover:bg-blue-700 text-white px-8 py-3 rounded-full transition-all duration-300 shadow-[0_2px_4px_rgba(0,0,0,0.15)] font-medium"
              >
                Post a Job
              </button>
              <button 
                onClick={() => navigate('/find-jobs')}
                className="text-gray-900 hover:bg-gray-900/10 px-8 py-3 rounded-full transition-all duration-300 shadow-[0_2px_4px_rgba(0,0,0,0.15)] font-medium border border-gray-300 hover:border-gray-400"
              >
                Find Jobs
              </button>
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
                    src="/jcr_white_transparent.png" 
                    alt="JCR Pharma" 
                    className="h-12 w-auto object-contain"
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

export default Home; 