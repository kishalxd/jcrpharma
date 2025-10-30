import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

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
            {currentTestimonial.image_url ? (
              <img 
                src={currentTestimonial.image_url} 
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

const Employers = () => {
  const navigate = useNavigate();
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [testimonials, setTestimonials] = useState([]);

  // Animation refs
  const [heroRef, heroVisible] = useScrollAnimation(0.2);
  const [uspRef, uspVisible] = useScrollAnimation(0.2);
  const [processRef, processVisible] = useScrollAnimation(0.2);
  const [locationsRef, locationsVisible] = useScrollAnimation(0.2);
  const [testimonialRef, testimonialVisible] = useScrollAnimation(0.2);
  const [ctaRef, ctaVisible] = useScrollAnimation(0.2);
  const [faqRef, faqVisible] = useScrollAnimation(0.2);

  // Timeline step animation states
  const [timelineSteps, setTimelineSteps] = useState({
    line: false,
    step1: false,
    step2: false,
    step3: false,
    step4: false,
    step5: false,
    step6: false,
    step7: false
  });

  // Trigger sequential timeline animations
  useEffect(() => {
    if (processVisible) {
      // Start the line animation
      setTimeout(() => setTimelineSteps(prev => ({ ...prev, line: true })), 200);
      
      // Sequential step animations (faster timing)
      setTimeout(() => setTimelineSteps(prev => ({ ...prev, step1: true })), 600);
      setTimeout(() => setTimelineSteps(prev => ({ ...prev, step2: true })), 1000);
      setTimeout(() => setTimelineSteps(prev => ({ ...prev, step3: true })), 1400);
      setTimeout(() => setTimelineSteps(prev => ({ ...prev, step4: true })), 1800);
      setTimeout(() => setTimelineSteps(prev => ({ ...prev, step5: true })), 2200);
      setTimeout(() => setTimelineSteps(prev => ({ ...prev, step6: true })), 2600);
      setTimeout(() => setTimelineSteps(prev => ({ ...prev, step7: true })), 3000);
    }
  }, [processVisible]);

  const toggleQuestion = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  const faqData = [
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
  ];

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
        position: '', // We don't have position in the database
        company: '', // We don't have company in the database
        avatar: testimonial.name.split(' ').map(n => n[0]).join('').toUpperCase(), // Generate initials
        image_url: testimonial.image_url // Add image URL for display
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
              Hire Biometrics & Data Talent, Fast
            </h1>
            <p className={`text-gray-300 text-xl mb-12 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-400 ${
              heroVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}>
              Access pre-vetted specialists in biostatistics, clinical data management, and bioinformatics. <br></br>
              <AnimatedCounter end={21} className="font-semibold" />-days average placement with <AnimatedCounter end={95} suffix="%" className="font-semibold" /> success rate.
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
              Why Leading Companies Choose Us
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Specialised recruitment that delivers speed, quality, compliance, and global reach
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
              How We Deliver Exceptional Results
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Detailed process with guaranteed SLAs and transparent communication
            </p>
          </div>

          {/* Horizontal Timeline */}
          <div className="max-w-7xl mx-auto">
            {/* Timeline Line with Circles */}
            <div className={`relative mb-20 transition-all duration-1000 delay-200 ${
              processVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}>
              {/* Horizontal connecting line */}
              <div className={`absolute top-6 left-0 right-0 h-0.5 bg-gray-300 z-0 transition-all duration-1000 ${
                timelineSteps.line ? 'scale-x-100' : 'scale-x-0'
              }`} style={{ transformOrigin: 'left' }}></div>
              
              {/* Timeline circles */}
              <div className="relative flex justify-between items-center z-10">
                {/* Step 1 Circle */}
                <div className={`relative transition-all duration-300 ${
                  timelineSteps.step1 
                    ? 'opacity-100 scale-100' 
                    : 'opacity-0 scale-0'
                }`}>
                  <div className="w-12 h-12 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg border-4 border-white hover:scale-110 transition-transform duration-300">
                    1
                  </div>
                  {/* Vertical line down */}
                  <div className={`absolute left-1/2 top-12 w-0.5 h-16 bg-gray-300 transform -translate-x-1/2 transition-all duration-250 delay-100 ${
                    timelineSteps.step1 ? 'scale-y-100' : 'scale-y-0'
                  }`} style={{ transformOrigin: 'top' }}></div>
                </div>

                {/* Step 2 Circle */}
                <div className={`relative transition-all duration-300 ${
                  timelineSteps.step2 
                    ? 'opacity-100 scale-100' 
                    : 'opacity-0 scale-0'
                }`}>
                  <div className="w-12 h-12 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg border-4 border-white hover:scale-110 transition-transform duration-300">
                    2
                  </div>
                  {/* Vertical line down */}
                  <div className={`absolute left-1/2 top-12 w-0.5 h-32 bg-gray-300 transform -translate-x-1/2 transition-all duration-250 delay-100 ${
                    timelineSteps.step2 ? 'scale-y-100' : 'scale-y-0'
                  }`} style={{ transformOrigin: 'top' }}></div>
                </div>

                {/* Step 3 Circle */}
                <div className={`relative transition-all duration-300 ${
                  timelineSteps.step3 
                    ? 'opacity-100 scale-100' 
                    : 'opacity-0 scale-0'
                }`}>
                  <div className="w-12 h-12 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg border-4 border-white hover:scale-110 transition-transform duration-300">
                    3
                  </div>
                  {/* Vertical line down */}
                  <div className={`absolute left-1/2 top-12 w-0.5 h-48 bg-gray-300 transform -translate-x-1/2 transition-all duration-250 delay-100 ${
                    timelineSteps.step3 ? 'scale-y-100' : 'scale-y-0'
                  }`} style={{ transformOrigin: 'top' }}></div>
                </div>

                {/* Step 4 Circle */}
                <div className={`relative transition-all duration-300 ${
                  timelineSteps.step4 
                    ? 'opacity-100 scale-100' 
                    : 'opacity-0 scale-0'
                }`}>
                  <div className="w-12 h-12 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg border-4 border-white hover:scale-110 transition-transform duration-300">
                    4
                  </div>
                  {/* Vertical line down */}
                  <div className={`absolute left-1/2 top-12 w-0.5 h-52 bg-gray-300 transform -translate-x-1/2 transition-all duration-250 delay-100 ${
                    timelineSteps.step4 ? 'scale-y-100' : 'scale-y-0'
                  }`} style={{ transformOrigin: 'top' }}></div>
                </div>

                {/* Step 5 Circle */}
                <div className={`relative transition-all duration-300 ${
                  timelineSteps.step5 
                    ? 'opacity-100 scale-100' 
                    : 'opacity-0 scale-0'
                }`}>
                  <div className="w-12 h-12 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg border-4 border-white hover:scale-110 transition-transform duration-300">
                    5
                  </div>
                  {/* Vertical line down */}
                  <div className={`absolute left-1/2 top-12 w-0.5 h-48 bg-gray-300 transform -translate-x-1/2 transition-all duration-250 delay-100 ${
                    timelineSteps.step5 ? 'scale-y-100' : 'scale-y-0'
                  }`} style={{ transformOrigin: 'top' }}></div>
                </div>

                {/* Step 6 Circle */}
                <div className={`relative transition-all duration-300 ${
                  timelineSteps.step6 
                    ? 'opacity-100 scale-100' 
                    : 'opacity-0 scale-0'
                }`}>
                  <div className="w-12 h-12 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg border-4 border-white hover:scale-110 transition-transform duration-300">
                    6
                  </div>
                  {/* Vertical line down */}
                  <div className={`absolute left-1/2 top-12 w-0.5 h-32 bg-gray-300 transform -translate-x-1/2 transition-all duration-250 delay-100 ${
                    timelineSteps.step6 ? 'scale-y-100' : 'scale-y-0'
                  }`} style={{ transformOrigin: 'top' }}></div>
                </div>

                {/* Step 7 Circle */}
                <div className={`relative transition-all duration-300 ${
                  timelineSteps.step7 
                    ? 'opacity-100 scale-100' 
                    : 'opacity-0 scale-0'
                }`}>
                  <div className="w-12 h-12 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg border-4 border-white hover:scale-110 transition-transform duration-300">
                    7
                  </div>
                  {/* Vertical line down */}
                  <div className={`absolute left-1/2 top-12 w-0.5 h-16 bg-gray-300 transform -translate-x-1/2 transition-all duration-250 delay-100 ${
                    timelineSteps.step7 ? 'scale-y-100' : 'scale-y-0'
                  }`} style={{ transformOrigin: 'top' }}></div>
                </div>
              </div>
            </div>

            {/* Content Cards at Different Levels */}
            <div className="relative">
              {/* Step 1 Content - Level 1 */}
              <div 
                className={`absolute transition-all duration-400 delay-200 ${
                  timelineSteps.step1 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ left: '0%', top: '0px', width: '13%' }}
              >
                <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">Understand You First</h3>
                  <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                    We build a deep understanding of your business culture, goals, values, and growth objectives.
                  </p>
                  <div className="text-xs text-brand-blue font-medium">
                    Duration: 1-2 days
                  </div>
                </div>
              </div>

              {/* Step 2 Content - Level 2 */}
              <div 
                className={`absolute transition-all duration-400 delay-200 ${
                  timelineSteps.step2 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ left: '14.5%', top: '80px', width: '13%' }}
              >
                <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">Define Your Ideal Candidate</h3>
                  <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                    We identify the perfect candidate profile including skills, personality traits, and target companies.
                  </p>
                  <div className="text-xs text-brand-blue font-medium">
                    Duration: 1 day
                  </div>
                </div>
              </div>

              {/* Step 3 Content - Level 3 */}
              <div 
                className={`absolute transition-all duration-400 delay-200 ${
                  timelineSteps.step3 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ left: '29%', top: '160px', width: '13%' }}
              >
                <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">The Search</h3>
                  <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                    Dual approach: searching our 10+ year database and proactive headhunting through multiple channels.
                  </p>
                  <div className="text-xs text-brand-blue font-medium">
                    Duration: 3-5 days
                  </div>
                </div>
              </div>

              {/* Step 4 Content - Level 4 (Deepest) */}
              <div 
                className={`absolute transition-all duration-400 delay-200 ${
                  timelineSteps.step4 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ left: '43.5%', top: '200px', width: '13%' }}
              >
                <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">Candidate Shortlisting</h3>
                  <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                    Rigorous screening process including initial calls, role presentation, and detailed information sharing.
                  </p>
                  <div className="text-xs text-brand-blue font-medium">
                    Duration: 2-3 days
                  </div>
                </div>
              </div>

              {/* Step 5 Content - Level 3 */}
              <div 
                className={`absolute transition-all duration-400 delay-200 ${
                  timelineSteps.step5 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ left: '58%', top: '160px', width: '13%' }}
              >
                <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">Deep Pre-screening</h3>
                  <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                    Comprehensive follow-up calls covering financial expectations, skills assessment, and detailed profiling.
                  </p>
                  <div className="text-xs text-brand-blue font-medium">
                    Duration: 1-2 days
                  </div>
                </div>
              </div>

              {/* Step 6 Content - Level 2 */}
              <div 
                className={`absolute transition-all duration-400 delay-200 ${
                  timelineSteps.step6 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ left: '72.5%', top: '80px', width: '13%' }}
              >
                <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">Ongoing Collaboration</h3>
                  <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                    Continuous support through weekly updates, interview coordination, and candidate preparation.
                  </p>
                  <div className="text-xs text-brand-blue font-medium">
                    Duration: 1-2 weeks
                  </div>
                </div>
              </div>

              {/* Step 7 Content - Level 1 */}
              <div 
                className={`absolute transition-all duration-400 delay-200 ${
                  timelineSteps.step7 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ left: '87%', top: '0px', width: '13%' }}
              >
                <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">Closing the Offer</h3>
                  <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                    Proactive management of obstacles, understanding candidate motivations, and strategic positioning.
                  </p>
                  <div className="text-xs text-brand-blue font-medium">
                    Duration: 3-5 days
                  </div>
                </div>
              </div>
            </div>

            {/* Spacer to ensure content doesn't overlap */}
            <div style={{ height: '320px' }}></div>
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-gray-600 text-sm uppercase tracking-wide mb-4">Global presence</p>
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-gray-900">
              Coverage Across Key Markets
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Strategic presence in major life-sciences hubs with local market expertise
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
                What our clients say
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
              Tell us about your hiring needs
            </h2>
            <p className="text-gray-600 text-lg mb-12 max-w-3xl mx-auto leading-relaxed">
              Submit your requirements and we'll provide a tailored recruitment strategy within 24 hours. Connect with specialised talent across biostatistics, clinical data management, and bioinformatics.
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
              Frequently asked questions
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Everything you need to know about our hiring process
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqData.map((item, index) => (
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
              Ready to hire exceptional talent?
            </h2>
            <p className={`text-gray-300 text-lg mb-12 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-400 ${
              ctaVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}>
              Join leading pharmaceutical and biotech companies who trust us to deliver specialised talent fast
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
                <h4 className="text-white font-medium mb-6">Specialisations</h4>
                <ul className="space-y-4">
                  <li><a href="/specialisms?focus=biostatistics" className="text-gray-300 hover:text-white transition-colors text-sm">Biostatistics</a></li>
                  <li><a href="/specialisms?focus=clinical" className="text-gray-300 hover:text-white transition-colors text-sm">Clinical Data Management</a></li>
                  <li><a href="/specialisms?focus=statistical-programming" className="text-gray-300 hover:text-white transition-colors text-sm">Statistical Programming</a></li>
                  <li><a href="/specialisms?focus=data-science" className="text-gray-300 hover:text-white transition-colors text-sm">Data Science</a></li>
                  <li><a href="/specialisms?focus=bioinformatics" className="text-gray-300 hover:text-white transition-colors text-sm">Bioinformatics</a></li>
                </ul>
              </div>

              {/* Services */}
              <div>
                <h4 className="text-white font-medium mb-6">Services</h4>
                <ul className="space-y-4">
                  <li><a href="/employers" className="text-gray-300 hover:text-white transition-colors text-sm">Permanent Placement</a></li>
                  <li><a href="/employers" className="text-gray-300 hover:text-white transition-colors text-sm">Contract Staffing</a></li>
                  <li><a href="/employers" className="text-gray-300 hover:text-white transition-colors text-sm">Executive Search</a></li>
                  <li><a href="/employers" className="text-gray-300 hover:text-white transition-colors text-sm">Recruitment Consulting</a></li>
                  <li><a href="/blog" className="text-gray-300 hover:text-white transition-colors text-sm">Market Insights</a></li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="text-white font-medium mb-6">Company</h4>
                <ul className="space-y-4">
                  <li><a href="/about" className="text-gray-300 hover:text-white transition-colors text-sm">About Us</a></li>
                  <li><a href="/candidates" className="text-gray-300 hover:text-white transition-colors text-sm">Careers</a></li>
                  <li><a href="/hire-talent" className="text-gray-300 hover:text-white transition-colors text-sm">Contact</a></li>
                  <li><a href="/blog" className="text-gray-300 hover:text-white transition-colors text-sm">Blog</a></li>
                  <li><a href="/blog" className="text-gray-300 hover:text-white transition-colors text-sm">News</a></li>
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

export default Employers; 