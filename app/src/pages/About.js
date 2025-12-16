import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import SEO from '../components/SEO';
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

// Animated Counter Component
const AnimatedCounter = ({ targetValue, className = "" }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const countRef = useRef(null);

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
          const target = parseFloat(targetValue);
          if (isNaN(target)) return;

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
  }, [hasAnimated]);

  // Display format based on target value
  const displayValue = () => {
    if (targetValue.includes('%')) {
      return `${Math.floor(count)}%`;
    } else if (targetValue.includes('+')) {
      return `${Math.floor(count)}+`;
    } else {
      return Math.floor(count).toString();
    }
  };

  return <span ref={countRef} className={className}>{displayValue()}</span>;
};

const About = () => {
  useScrollAnimation();
  const [content, setContent] = useState(null);


  // Default content (fallback)
  const defaultContent = {
    mission: {
      title: "Our Mission",
      paragraph1: "JCR Pharma was founded on a simple belief: recruitment in the life sciences industry can and should be done better. After years of working within agencies that chased numbers instead of people, we set out to build something different. We wanted a consultancy that leads with honesty, transparency, and partnership. Our team specialises in biometrics, biostatistics, and clinical data management recruitment, helping pharmaceutical, biotech, and CRO organisations across the UK and Europe find talent that truly fits. A candidate should not only meet the requirements on paper but also align with a company's culture, purpose, and long-term goals.",
      paragraph2: "We do not measure success by how many CVs we send. We measure it by the relationships we build and by the impact our candidates make. Every search begins with listening, every conversation with understanding, and every placement with trust. JCR Pharma is more than a business to us. It is a commitment to doing recruitment with integrity, empathy, and genuine care for the science that shapes lives."
    },
    team: {
      title: "Leadership",
      subtitle: "Led by industry veterans with deep expertise in life-sciences recruitment and talent acquisition",
      james: {
        name: "James Carpenter",
        title: "Managing Director / Founder",
        bio: "James brings 10 years of recruitment experience, including 5+ years specialised in Biometrics. After graduating from the University of Hertfordshire with a degree in History, he began in graduate and Rec2Rec recruitment before transitioning to life sciences. James built Biometrics desks from scratch across multiple agencies, developing expertise in the European market. A former rugby player who retired to focus on his career, James founded JCR Pharma driven by a vision to transform recruitment through integrity, consultation, and genuine partnership rather than outdated transactional approaches."
      }
    },
    values: {
      title: "Our Values",
      subtitle: "Our Recruitment Values in Life-Sciences & Biostatistics",
      excellence: {
        title: "Excellence",
        description: "We uphold the highest standards in biostatistics candidate assessment and life-science client service."
      },
      integrity: {
        title: "Integrity",
        description: "Transparent, data-driven communication builds long-term trust with our pharma and CRO partners."
      },
      expertise: {
        title: "Expertise",
        description: "Our recruiters' deep biometrics domain knowledge enables precise technical placements."
      }
    },
    stats: {
      title: "Our Impact",
      subtitle: "Measurable results that demonstrate our commitment to excellence",
      placements: {
        value: "90+",
        label: "Successful Placements"
      },
      timeToHire: {
        value: "3",
        label: "Weeks Average Time-to-Hire"
      },
      satisfaction: {
        value: "95%",
        label: "Client Satisfaction Rate"
      },
      partners: {
        value: "50+",
        label: "Partner Organisations"
      }
    }
  };

  // Fetch content from database
  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('page_contents')
        .select('content')
        .eq('page_name', 'about')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching content:', error);
        setContent(defaultContent);
      } else if (data) {
        // Merge with defaults to ensure all fields exist
        const mergedContent = {
          ...defaultContent,
          ...(data.content || {}),
          mission: { ...defaultContent.mission, ...(data.content?.mission || {}) },
          team: {
            ...defaultContent.team,
            ...(data.content?.team || {}),
            james: { ...defaultContent.team.james, ...(data.content?.team?.james || {}) }
          },
          values: {
            ...defaultContent.values,
            ...(data.content?.values || {}),
            excellence: { ...defaultContent.values.excellence, ...(data.content?.values?.excellence || {}) },
            integrity: { ...defaultContent.values.integrity, ...(data.content?.values?.integrity || {}) },
            expertise: { ...defaultContent.values.expertise, ...(data.content?.values?.expertise || {}) }
          },
          stats: {
            ...defaultContent.stats,
            ...(data.content?.stats || {}),
            placements: { ...defaultContent.stats.placements, ...(data.content?.stats?.placements || {}) },
            timeToHire: { ...defaultContent.stats.timeToHire, ...(data.content?.stats?.timeToHire || {}) },
            satisfaction: { ...defaultContent.stats.satisfaction, ...(data.content?.stats?.satisfaction || {}) },
            partners: { ...defaultContent.stats.partners, ...(data.content?.stats?.partners || {}) }
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

  return (
    <>
      <SEO 
        title="About Us"
        description="Learn about JCR Pharma's mission to transform life sciences recruitment. Meet our leadership team, discover our values of excellence, integrity, and expertise, and see how we connect top talent with pharmaceutical and biotech companies across the UK, USA, and Europe."
      />
      <div className="min-h-screen">


      {/* Mission Section */}
      <section className="bg-white py-20 opacity-0" data-animate>
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-gray-900">
                  {pageContent.mission.title}
                </h2>
                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                  {pageContent.mission.paragraph1}
                </p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {pageContent.mission.paragraph2}
                </p>
              </div>
              <div className="order-first lg:order-last lg:pt-16">
                <div className="bg-gray-100 rounded-lg aspect-[4/3] overflow-hidden relative">
                  {/* Loading skeleton */}
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-gray-400 text-sm">Loading...</p>
                      </div>
                    </div>
                  </div>
                  <img 
                    src="/about_us_our_mission.JPG" 
                    alt="JCR Mission" 
                    className="w-full h-full object-cover relative z-10 opacity-0 transition-opacity duration-500"
                    loading="lazy"
                    decoding="async"
                    onLoad={(e) => {
                      e.target.style.opacity = '1';
                      e.target.previousElementSibling.style.display = 'none';
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.previousElementSibling.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center">
                          <div class="text-center">
                            <div class="w-16 h-16 bg-brand-blue/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                              <svg class="w-8 h-8 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 8v10l4-2 4 2V8" />
                              </svg>
                            </div>
                            <p class="text-gray-600">Mission & Vision</p>
                          </div>
                        </div>
                      `;
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gray-50 py-20 opacity-0" data-animate>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-gray-900">
              {pageContent.team.title}
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              {pageContent.team.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-1 gap-12 max-w-2xl mx-auto">
            {/* James Carpenter */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden opacity-0" data-animate-delay="0">
              <div className="p-8 text-center">
                <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden relative">
                  {/* Loading skeleton */}
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
                  </div>
                  <img 
                    src="/j_carpenter.png" 
                    alt="James Carpenter" 
                    className="w-full h-full object-cover relative z-10 opacity-0 transition-opacity duration-500"
                    loading="lazy"
                    decoding="async"
                    onLoad={(e) => {
                      e.target.style.opacity = '1';
                      e.target.previousElementSibling.style.display = 'none';
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.previousElementSibling.innerHTML = '<span class="text-3xl font-light text-brand-blue">JC</span>';
                      e.target.previousElementSibling.classList.remove('bg-gradient-to-r', 'from-gray-200', 'via-gray-100', 'to-gray-200', 'animate-pulse');
                      e.target.previousElementSibling.classList.add('bg-brand-blue/10');
                    }}
                  />
                </div>
                <h3 className="text-2xl font-medium text-gray-900 mb-2">
                  {pageContent.team.james.name}
                </h3>
                <p className="text-brand-blue font-medium mb-4">
                  {pageContent.team.james.title}
                </p>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {pageContent.team.james.bio}
                </p>
                <div className="flex justify-center space-x-4">
                  <a href="https://www.linkedin.com/in/james-carpenter01/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-blue transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-white py-20 opacity-0" data-animate>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-gray-900">
              {pageContent.values.title}
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              {pageContent.values.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Excellence */}
            <div className="text-center opacity-0" data-animate-delay="0">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4 text-gray-900">{pageContent.values.excellence.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {pageContent.values.excellence.description}
              </p>
            </div>

            {/* Integrity */}
            <div className="text-center opacity-0" data-animate-delay="150">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4 text-gray-900">{pageContent.values.integrity.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {pageContent.values.integrity.description}
              </p>
            </div>

            {/* Expertise */}
            <div className="text-center opacity-0" data-animate-delay="300">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4 text-gray-900">{pageContent.values.expertise.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {pageContent.values.expertise.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-20 opacity-0" data-animate>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-gray-900">
              {pageContent.stats.title}
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              {pageContent.stats.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center opacity-0" data-animate-delay="0">
              <div className="text-5xl md:text-6xl font-light text-brand-blue mb-2">
                <AnimatedCounter
                  targetValue={pageContent.stats.placements.value}
                  className="text-5xl md:text-6xl font-light text-brand-blue"
                />
              </div>
              <p className="text-gray-700 text-lg">{pageContent.stats.placements.label}</p>
            </div>
            <div className="text-center opacity-0" data-animate-delay="100">
              <div className="text-5xl md:text-6xl font-light text-brand-blue mb-2">
                <AnimatedCounter
                  targetValue={pageContent.stats.timeToHire.value}
                  className="text-5xl md:text-6xl font-light text-brand-blue"
                />
              </div>
              <p className="text-gray-700 text-lg">{pageContent.stats.timeToHire.label}</p>
            </div>
            <div className="text-center opacity-0" data-animate-delay="200">
              <div className="text-5xl md:text-6xl font-light text-brand-blue mb-2">
                <AnimatedCounter
                  targetValue={pageContent.stats.satisfaction.value}
                  className="text-5xl md:text-6xl font-light text-brand-blue"
                />
              </div>
              <p className="text-gray-700 text-lg">{pageContent.stats.satisfaction.label}</p>
            </div>
            <div className="text-center opacity-0" data-animate-delay="300">
              <div className="text-5xl md:text-6xl font-light text-brand-blue mb-2">
                <AnimatedCounter
                  targetValue={pageContent.stats.partners.value}
                  className="text-5xl md:text-6xl font-light text-brand-blue"
                />
              </div>
              <p className="text-gray-700 text-lg">{pageContent.stats.partners.label}</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      </div>
    </>
  );
};

export default About; 