import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useSEO } from '../hooks/useSEO';
import Footer from '../components/Footer';

// Add custom CSS for animations
const customStyles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }
  
  @keyframes pulse-glow {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
    }
    50% {
      box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
    }
  }
  
  .animate-pulse-glow {
    animation: pulse-glow 2s infinite;
  }
`;

// Custom hook for scroll animations
const useScrollAnimation = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  return [ref, isVisible];
};

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2000, suffix = '', className = '' }) => {
  const [count, setCount] = useState(0);
  const [ref, isVisible] = useScrollAnimation(0.3);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isVisible && !hasAnimated) {
      setHasAnimated(true);
      let startTime;
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        setCount(Math.floor(progress * end));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [isVisible, hasAnimated, end, duration]);

  return (
    <span ref={ref} className={className}>
      {count}{suffix}
    </span>
  );
};

const TestimonialsCarousel = ({ testimonials = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Safety check for empty testimonials
  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="max-w-6xl mx-auto text-center">
        <div className="text-white/60 text-lg">
          <p>No testimonials available at the moment.</p>
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

  return (
    <div className="max-w-6xl mx-auto relative">
      {/* Testimonial Card */}
      <div className="text-center">
        {/* Testimonial Text with Navigation */}
        <div className="relative">
          {/* Left Arrow - Positioned relative to testimonial text */}
          <button 
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-16 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:bg-white/30 transition-shadow"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right Arrow - Positioned relative to testimonial text */}
          <button 
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-16 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:bg-white/30 transition-shadow"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <blockquote className="text-2xl md:text-3xl font-light text-white mb-12 max-w-4xl mx-auto leading-relaxed">
            "
            {currentTestimonial.quote}
            "
          </blockquote>
        </div>

        {/* Author Info */}
        <div className="flex flex-col items-center">
          {/* Avatar */}
          <div className="w-16 h-16 bg-brand-blue/20 rounded-full mb-4 flex items-center justify-center overflow-hidden">
            {currentTestimonial.image_base64 ? (
              <img 
                src={currentTestimonial.image_base64} 
                alt={currentTestimonial.author}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-brand-blue font-semibold text-lg">
                {currentTestimonial.avatar}
              </span>
            )}
          </div>

          {/* Name and Position */}
          <h4 className="text-lg font-medium text-white mb-1">
            {currentTestimonial.author}
          </h4>
          {(currentTestimonial.position || currentTestimonial.company) && (
            <p className="text-gray-300">
              {currentTestimonial.position}
              {currentTestimonial.position && currentTestimonial.company && ', '}
              {currentTestimonial.company}
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

// Process Steps Carousel Component
const ProcessCarousel = ({ steps = [], isVisible = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const carouselRef = useRef(null);

  // Auto-slide functionality
  useEffect(() => {
    if (steps.length === 0 || isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % steps.length);
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [steps.length, isPaused]);

  // Resume auto-slide after user interaction
  useEffect(() => {
    if (isPaused) {
      const timer = setTimeout(() => {
        setIsPaused(false);
      }, 5000); // Resume after 5 seconds of no interaction
      return () => clearTimeout(timer);
    }
  }, [isPaused, currentIndex]);

  if (!steps || steps.length === 0) {
    return null;
  }

  const nextStep = () => {
    setIsPaused(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % steps.length);
  };

  const prevStep = () => {
    setIsPaused(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + steps.length) % steps.length);
  };

  const goToStep = (index) => {
    setIsPaused(true);
    setCurrentIndex(index);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextStep();
    } else if (isRightSwipe) {
      prevStep();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  // Mouse handlers for desktop drag
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart(e.clientX);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !dragStart) return;
    // Prevent text selection while dragging
    e.preventDefault();
  };

  const handleMouseUp = (e) => {
    if (!isDragging || !dragStart) return;

    const distance = dragStart - e.clientX;
    const isLeftDrag = distance > 50;
    const isRightDrag = distance < -50;

    if (isLeftDrag) {
      nextStep();
    } else if (isRightDrag) {
      prevStep();
    }

    setIsDragging(false);
    setDragStart(null);
  };

  // Prevent default drag behavior
  const handleDragStart = (e) => {
    e.preventDefault();
  };

  const currentStep = steps[currentIndex] || steps[0];

  return (
    <div 
      ref={carouselRef}
      className={`max-w-4xl mx-auto relative transition-all duration-1000 delay-300 ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDragStart={handleDragStart}
    >
      <div className="text-center">
        {/* Step Card */}
        <div className="relative select-none">
          {/* Left Arrow */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              prevStep();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 md:-translate-x-16 w-10 h-10 md:w-12 md:h-12 bg-gray-200 hover:bg-gray-300 rounded-full shadow-md flex items-center justify-center transition-all duration-300 z-10"
            aria-label="Previous step"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right Arrow */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              nextStep();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 md:translate-x-16 w-10 h-10 md:w-12 md:h-12 bg-gray-200 hover:bg-gray-300 rounded-full shadow-md flex items-center justify-center transition-all duration-300 z-10"
            aria-label="Next step"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Step Content */}
          <div className="p-6 md:p-8 mx-4 md:mx-16">
            {/* Step Number */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold text-2xl md:text-3xl">
                {currentStep.number}
              </div>
            </div>

            {/* Step Title */}
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
              {currentStep.title}
            </h3>

            {/* Step Description */}
            <p className="text-gray-600 mb-4 leading-relaxed text-base md:text-lg">
              {currentStep.description}
            </p>

            {/* Duration */}
            <div className="text-brand-blue font-medium text-sm md:text-base">
              Duration: {currentStep.duration}
            </div>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center space-x-2 mt-8">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                goToStep(index);
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-brand-blue' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const Employers = () => {
  const navigate = useNavigate();
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [content, setContent] = useState(null);

  // Set SEO metadata
  useSEO(
    'For Employers',
    'Partner with JCR Pharma for expert life sciences recruitment. We help pharmaceutical, biotech, and CRO companies find top talent in biostatistics, clinical data management, data science, and biometrics. Quality over quantity approach with consultative recruitment services across UK, USA, and Europe.'
  );

  // Animation refs
  const [heroRef, heroVisible] = useScrollAnimation(0.2);
  const [uspRef, uspVisible] = useScrollAnimation(0.2);
  const [processRef, processVisible] = useScrollAnimation(0.2);
  const [locationsRef, locationsVisible] = useScrollAnimation(0.2);
  const [testimonialRef, testimonialVisible] = useScrollAnimation(0.2);
  const [ctaRef, ctaVisible] = useScrollAnimation(0.2);
  const [faqRef, faqVisible] = useScrollAnimation(0.2);

  // Process steps data
  const processSteps = [
    {
      number: 1,
      title: 'Understand You First',
      description: 'We build a deep understanding of your business culture, goals, values, and growth objectives.',
      duration: '1-2 days'
    },
    {
      number: 2,
      title: 'Define Your Ideal Candidate',
      description: 'We identify the perfect candidate profile including skills, personality traits, and target companies.',
      duration: '1 day'
    },
    {
      number: 3,
      title: 'The Search',
      description: 'Dual approach: searching our 10+ year database and proactive headhunting through multiple channels.',
      duration: '3-5 days'
    },
    {
      number: 4,
      title: 'Candidate Shortlisting',
      description: 'Rigorous screening process including initial calls, role presentation, and detailed information sharing.',
      duration: '2-3 days'
    },
    {
      number: 5,
      title: 'Deep Pre-screening',
      description: 'Comprehensive follow-up calls covering financial expectations, skills assessment, and detailed profiling.',
      duration: '1-2 days'
    },
    {
      number: 6,
      title: 'Ongoing Collaboration',
      description: 'Continuous support through weekly updates, interview coordination, and candidate preparation.',
      duration: '1-2 weeks'
    },
    {
      number: 7,
      title: 'Closing the Offer',
      description: 'Proactive management of obstacles, understanding candidate motivations, and strategic positioning.',
      duration: '3-5 days'
    }
  ];

  const toggleQuestion = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  // Default content (fallback)
  const defaultContent = {
    hero: {
      title: "Hire Biometrics & Data Talent, Fast",
      subtitle: "Access pre-vetted specialists in biostatistics, clinical data management, and bioinformatics. 21-days average placement with 95% success rate."
    },
    services: {
      title: "Why Leading Companies Choose Us",
      subtitle: "Specialised recruitment that delivers speed, quality, compliance, and global reach"
    },
    process: {
      title: "How We Deliver Exceptional Results",
      subtitle: "Detailed process with guaranteed SLAs and transparent communication"
    },
    locations: {
      title: "Coverage Across Key Markets",
      subtitle: "Strategic presence in major life-sciences hubs with local market expertise"
    },
    testimonials: {
      title: "What our clients say"
    },
    getStartedCta: {
      title: "Tell us about your hiring needs",
      subtitle: "Submit your requirements and we'll provide a tailored recruitment strategy within 24 hours. Connect with specialised talent across biostatistics, clinical data management, and bioinformatics."
    },
    faq: {
      title: "Frequently asked questions",
      subtitle: "Everything you need to know about our hiring process",
      items: [
        {
          question: "What is your average time-to-hire for specialised roles?",
          answer: "Our average time-to-hire is 21 days for most specialised biometrics and data science roles. For senior positions, we typically deliver qualified candidates within 21 days."
        },
        {
          question: "Do you provide candidates with regulatory compliance experience?",
          answer: "Yes, all our candidates are pre-screened for regulatory compliance knowledge including FDA, EMA, and ICH guidelines relevant to their specialisation."
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
          answer: "Yes, we provide both contract and permanent placement solutions, tailored to your specific project needs and organisational requirements."
        }
      ]
    },
    finalCta: {
      title: "Ready to hire exceptional talent?",
      subtitle: "Join leading pharmaceutical and biotech companies who trust us to deliver specialised talent fast"
    }
  };

  // Fetch content from database
  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('page_contents')
        .select('content')
        .eq('page_name', 'employers')
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
          services: { ...defaultContent.services, ...(data.content?.services || {}) },
          process: { ...defaultContent.process, ...(data.content?.process || {}) },
          locations: { ...defaultContent.locations, ...(data.content?.locations || {}) },
          testimonials: { ...defaultContent.testimonials, ...(data.content?.testimonials || {}) },
          getStartedCta: { ...defaultContent.getStartedCta, ...(data.content?.getStartedCta || {}) },
          faq: { 
            ...defaultContent.faq, 
            ...(data.content?.faq || {}),
            items: data.content?.faq?.items && data.content.faq.items.length > 0 
              ? data.content.faq.items 
              : defaultContent.faq.items
          },
          finalCta: { ...defaultContent.finalCta, ...(data.content?.finalCta || {}) }
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
        position: testimonial.position || '', // Use position from database if available
        company: testimonial.company || '', // Use company from database if available
        avatar: testimonial.name.split(' ').map(n => n[0]).join('').toUpperCase(), // Generate initials
        image_base64: testimonial.image_base64 || null
      }));

      setTestimonials(transformedTestimonials);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      // Fall back to empty array if database fetch fails
      setTestimonials([]);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Inject custom styles */}
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      {/* Hero Section */}
      <section className="bg-brand-blue text-white py-20">
        <div className="container mx-auto px-6">
          <div 
            ref={heroRef}
            className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${
              heroVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            <h1 className={`text-5xl md:text-6xl font-light mb-8 leading-tight transition-all duration-1000 delay-200 ${
              heroVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}>
              {pageContent.hero.title}
            </h1>
            <p className={`text-gray-300 text-xl mb-12 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-400 ${
              heroVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}>
              {pageContent.hero.subtitle}
            </p>
            
            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-16 transition-all duration-1000 delay-600 ${
              heroVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}>
              <button 
                onClick={() => navigate('/hire-talent')}
                className="bg-white text-brand-blue hover:bg-gray-100 px-8 py-3 rounded-full transition-all duration-300 font-medium hover:scale-105 hover:shadow-lg"
              >
                Post a role
              </button>
              <button 
                onClick={() => {
                  const processSection = document.querySelector('[data-section="process"]');
                  if (processSection) {
                    processSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full transition-all duration-300 backdrop-blur-md font-medium border border-white/30 hover:scale-105 hover:shadow-lg"
              >
                View our process
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features List Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div 
            ref={uspRef}
            className={`text-center mb-16 transition-all duration-1000 ${
              uspVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            <p className="text-gray-600 text-sm uppercase tracking-wide mb-4">Our USPs</p>
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-gray-900">
              {pageContent.services.title}
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              {pageContent.services.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {/* Speed */}
            <div className={`text-center transition-all duration-1000 delay-100 ${
              uspVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-12'
            }`}>
              <div className="w-16 h-16 bg-brand-blue/10 rounded-lg flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4 text-gray-900">Speed</h3>
              <p className="text-gray-600 leading-relaxed">
                <AnimatedCounter end={21} className="font-semibold" />-days average placement with streamlined processes and pre-qualified talent pools
              </p>
            </div>

            {/* Quality */}
            <div className={`text-center transition-all duration-1000 delay-200 ${
              uspVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-12'
            }`}>
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-transform duration-300">
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
            <div className={`text-center transition-all duration-1000 delay-300 ${
              uspVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-12'
            }`}>
              <div className="w-16 h-16 bg-brand-blue/10 rounded-lg flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-transform duration-300">
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
            <div className={`text-center transition-all duration-1000 delay-400 ${
              uspVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-12'
            }`}>
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-transform duration-300">
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
      <section data-section="process" className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div 
            ref={processRef}
            className={`text-center mb-16 transition-all duration-1000 ${
              processVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            <p className="text-gray-600 text-sm uppercase tracking-wide mb-4">Our process</p>
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-gray-900">
              {pageContent.process.title}
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              {pageContent.process.subtitle}
            </p>
          </div>

          {/* Process Carousel */}
          <ProcessCarousel steps={processSteps} isVisible={processVisible} />
        </div>
      </section>

      {/* Locations Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-gray-600 text-sm uppercase tracking-wide mb-4">Global presence</p>
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-gray-900">
              {pageContent.locations.title}
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              {pageContent.locations.subtitle}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
            {/* Map Image */}
            <div className="order-2 lg:order-1">
              <div className="rounded-lg overflow-hidden aspect-[4/3]">
                <img 
                  src="/employer_global.JPG" 
                  alt="Global Coverage Map" 
                  className="w-full h-full object-cover"
                />
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

      {/* Testimonial Section */}
      <section className="bg-brand-blue py-20">
        <div className="container mx-auto px-6">
          <div 
            ref={testimonialRef}
            className={`transition-all duration-1000 ${
              testimonialVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-light text-white mb-8 leading-tight">
                {pageContent.testimonials.title}
              </h2>
            </div>
            <TestimonialsCarousel testimonials={testimonials} />
          </div>
        </div>
      </section>

      {/* Get Started CTA Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-gray-900">
              {pageContent.getStartedCta.title}
            </h2>
            <p className="text-gray-600 text-lg mb-12 max-w-3xl mx-auto leading-relaxed">
              {pageContent.getStartedCta.subtitle}
            </p>
            
            <div className="flex justify-center">
              <button 
                onClick={() => navigate('/hire-talent')}
                className="bg-brand-blue text-white hover:bg-blue-700 px-8 py-3 rounded-full transition-all duration-300 font-medium"
              >
                Submit Your Requirements
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div 
            ref={faqRef}
            className={`text-center mb-16 transition-all duration-1000 ${
              faqVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-gray-900">
              {pageContent.faq.title}
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              {pageContent.faq.subtitle}
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {(pageContent.faq.items || []).map((item, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-lg shadow-sm transition-all duration-700 hover:shadow-md ${
                  faqVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${200 + index * 100}ms` }}
              >
                <button
                  className="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => toggleQuestion(index)}
                >
                  <span className="text-lg font-medium text-gray-900">{item.question}</span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${
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
                  <div className="px-6 pb-4 animate-fadeIn">
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
          <div 
            ref={ctaRef}
            className={`text-center max-w-4xl mx-auto transition-all duration-1000 ${
              ctaVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className={`text-4xl md:text-5xl font-light mb-8 leading-tight text-white transition-all duration-1000 delay-200 ${
              ctaVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}>
              {pageContent.finalCta.title}
            </h2>
            <p className={`text-gray-300 text-lg mb-12 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-400 ${
              ctaVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}>
              {pageContent.finalCta.subtitle}
            </p>
            
            {/* CTA Button */}
            <div className={`flex justify-center transition-all duration-1000 delay-600 ${
              ctaVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}>
              <button 
                onClick={() => navigate('/hire-talent')}
                className="bg-white text-brand-blue hover:bg-gray-100 px-8 py-3 rounded-full transition-all duration-300 font-medium hover:scale-105 hover:shadow-lg"
              >
                Post your first role
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Employers; 