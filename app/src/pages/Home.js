import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAdmin } from '../components/AdminContext';

const TestimonialsCarousel = ({ testimonials = [], editMode, updateTestimonial, addTestimonial, deleteTestimonial }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Safety check for empty testimonials
  if (!testimonials || testimonials.length === 0) {
    return null;
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
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-16 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center hover:shadow-lg transition-shadow"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right Arrow - Positioned relative to testimonial text */}
          <button 
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-16 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center hover:shadow-lg transition-shadow"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <blockquote className="text-xl md:text-2xl font-light text-gray-900 mb-12 max-w-4xl mx-auto leading-relaxed">
            "
            <EditableTestimonialText
              value={currentTestimonial.quote}
              onChange={(value) => updateTestimonial(currentTestimonial.id, 'quote', value)}
              multiline={true}
              placeholder="Enter testimonial quote..."
              className="text-xl md:text-2xl font-light text-gray-900 leading-relaxed inline-block w-full"
            />
            "
          </blockquote>
        </div>

        {/* Author Info */}
        <div className="flex flex-col items-center">
          {/* Avatar */}
          <div className="w-16 h-16 bg-blue-200 rounded-full mb-4 flex items-center justify-center">
            <span className="text-blue-800 font-semibold text-lg">
              <EditableTestimonialText
                value={currentTestimonial.avatar}
                onChange={(value) => updateTestimonial(currentTestimonial.id, 'avatar', value)}
                placeholder="Avatar..."
                className="text-blue-800 font-semibold text-lg text-center"
              />
            </span>
          </div>

          {/* Name and Position */}
          <h4 className="text-lg font-medium text-gray-900 mb-1">
            <EditableTestimonialText
              value={currentTestimonial.author}
              onChange={(value) => updateTestimonial(currentTestimonial.id, 'author', value)}
              placeholder="Author name..."
              className="text-lg font-medium text-gray-900 text-center block w-full"
            />
          </h4>
          <p className="text-gray-600">
            <EditableTestimonialText
              value={currentTestimonial.position}
              onChange={(value) => updateTestimonial(currentTestimonial.id, 'position', value)}
              placeholder="Position..."
              className="text-gray-600 text-center inline-block"
            />
            , 
            <EditableTestimonialText
              value={currentTestimonial.company}
              onChange={(value) => updateTestimonial(currentTestimonial.id, 'company', value)}
              placeholder="Company..."
              className="text-gray-600 text-center inline-block ml-1"
            />
          </p>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center space-x-2 mt-12">
          {testimonials && testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-gray-900' : 'bg-gray-300 hover:bg-gray-400'
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
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedNotification, setSavedNotification] = useState(false);

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
      title: "Life-sciences data &\nbiometrics recruitment",
      subtitle: "Specialized talent solutions for biotech and pharmaceutical industries across UK, EU, and\nUS markets."
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
      subtitle: "Quantifiable results that demonstrate our specialized approach",
      stat1: {
        number: "14",
        description: "Days average time-to-hire"
      },
      stat2: {
        number: "92%",
        description: "Interview to offer success rate"
      },
      stat3: {
        number: "150+",
        description: "Placements across global markets"
      }
    },
    cta: {
      title: "Ready to find your next\nlife sciences talent?",
      subtitle: "Connect with our specialized recruitment team today and discover how we can accelerate your hiring process with qualified, pre-screened candidates."
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
          quote: "JCR's specialized approach to bioinformatics recruitment is unmatched. They placed three senior data scientists with us last year, all of whom have exceeded our expectations and are still with the company.",
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

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('page_contents')
        .select('content')
        .eq('pageName', 'home')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching content:', error);
        setContent(defaultContent);
      } else if (data) {
        setContent(data.content);
      } else {
        setContent(defaultContent);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      setContent(defaultContent);
    } finally {
      setLoading(false);
    }
  };

  const pageContent = content || defaultContent;

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
      const { data, error } = await supabase
        .from('page_contents')
        .upsert({
          pageName: 'home',
          content: content,
          updatedAt: new Date().toISOString()
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
          value={value}
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
          <div className="text-center text-white mb-16">
            <h1 className="text-5xl md:text-6xl font-light mb-8 leading-tight">
              <EditableText
                value={pageContent.hero.title}
                onChange={(value) => updateContent('hero.title', value)}
                multiline={true}
                rows={2}
                placeholder="Enter hero title..."
                className="text-5xl md:text-6xl font-light leading-tight text-center block w-full"
              />
            </h1>
            <p className="text-gray-300 text-lg md:text-xl mb-12 max-w-4xl mx-auto leading-relaxed">
              <EditableText
                value={pageContent.hero.subtitle}
                onChange={(value) => updateContent('hero.subtitle', value)}
                multiline={true}
                rows={3}
                placeholder="Enter hero subtitle..."
                className="text-gray-300 text-lg md:text-xl leading-relaxed text-center block w-full"
              />
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
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
          
          {/* Image/Video Placeholder */}
          <div className="max-w-6xl mx-auto mb-20">
            <div className="bg-slate-700 rounded-lg overflow-hidden shadow-2xl">
              <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-slate-600 to-slate-700">
                <div className="bg-slate-500 bg-opacity-50 rounded-lg p-8">
                  <div className="w-24 h-24 bg-slate-400 rounded-lg flex items-center justify-center">
                    <svg className="w-12 h-12 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                    </svg>
                  </div>
                </div>
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

          {/* Expertise Cards */}
          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Biostatistics Card - Takes 2 columns (wider) */}
            <div className="md:col-span-2 bg-slate-800 bg-opacity-60 rounded-lg p-8 backdrop-blur-sm relative shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
              <div className="mb-6">
                <span className="text-gray-400 text-sm">Biostatistics</span>
              </div>
              <h3 className="text-white text-2xl font-light mb-6 leading-tight">
                <EditableText
                  value={pageContent.specialisms.biostatistics.title}
                  onChange={(value) => updateContent('specialisms.biostatistics.title', value)}
                  multiline={true}
                  rows={2}
                  placeholder="Enter biostatistics title..."
                  className="text-white text-2xl font-light leading-tight block w-full"
                />
              </h3>
              <div className="flex items-center justify-between">
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
                  <EditableText
                    value={pageContent.specialisms.biostatistics.tag}
                    onChange={(value) => updateContent('specialisms.biostatistics.tag', value)}
                    placeholder="Tag..."
                    className="text-white text-xs"
                  />
                </span>
              </div>
              <div className="absolute bottom-8 left-8">
                <span className="text-white text-sm flex items-center gap-1">
                  Explore
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Clinical Data Management Card - Takes 1 column */}
            <div className="md:col-span-1 bg-slate-800 bg-opacity-60 rounded-lg p-8 backdrop-blur-sm relative shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
              <div className="mb-6">
                <div className="w-12 h-12 bg-white bg-opacity-10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
              <h3 className="text-white text-2xl font-light mb-4 leading-tight">
                <EditableText
                  value={pageContent.specialisms.clinicalData.title}
                  onChange={(value) => updateContent('specialisms.clinicalData.title', value)}
                  placeholder="Enter clinical data title..."
                  className="text-white text-2xl font-light leading-tight block w-full"
                />
              </h3>
              <p className="text-gray-400 text-sm mb-8">
                <EditableText
                  value={pageContent.specialisms.clinicalData.description}
                  onChange={(value) => updateContent('specialisms.clinicalData.description', value)}
                  placeholder="Enter clinical data description..."
                  className="text-gray-400 text-sm block w-full"
                />
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

            {/* Bioinformatics Card - Takes 1 column */}
            <div className="md:col-span-1 bg-slate-800 bg-opacity-60 rounded-lg p-8 backdrop-blur-sm relative shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
              <div className="mb-6">
                <div className="w-12 h-12 bg-white bg-opacity-10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
              <h3 className="text-white text-2xl font-light mb-4 leading-tight">
                <EditableText
                  value={pageContent.specialisms.bioinformatics.title}
                  onChange={(value) => updateContent('specialisms.bioinformatics.title', value)}
                  placeholder="Enter bioinformatics title..."
                  className="text-white text-2xl font-light leading-tight block w-full"
                />
              </h3>
              <p className="text-gray-400 text-sm mb-8">
                <EditableText
                  value={pageContent.specialisms.bioinformatics.description}
                  onChange={(value) => updateContent('specialisms.bioinformatics.description', value)}
                  placeholder="Enter bioinformatics description..."
                  className="text-gray-400 text-sm block w-full"
                />
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
      <section className="bg-white py-20">
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
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
            {/* Principal Biostatistician Job */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
              {/* Job Image Placeholder */}
              <div className="h-48 bg-gray-300 flex items-center justify-center">
                <div className="w-16 h-16 bg-gray-400 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                  </svg>
                </div>
              </div>
              
              {/* Job Content */}
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">Biostatistics</span>
                  <span className="text-sm text-gray-500">5 min read</span>
                </div>
                
                <h3 className="text-xl font-medium mb-3 text-gray-900 leading-tight">
                  Principal biostatistician role in oncology research
                </h3>
                
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  Innovative research opportunity with leading pharmaceutical company
                </p>
                
                <button className="text-brand-blue hover:text-blue-700 transition-colors flex items-center gap-1 text-sm font-medium">
                  Read more
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Senior Data Scientist Job */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
              {/* Job Image Placeholder */}
              <div className="h-48 bg-gray-300 flex items-center justify-center">
                <div className="w-16 h-16 bg-gray-400 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                  </svg>
                </div>
              </div>
              
              {/* Job Content */}
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.15)]">Data science</span>
                  <span className="text-sm text-gray-500">5 min read</span>
                </div>
                
                <h3 className="text-xl font-medium mb-3 text-gray-900 leading-tight">
                  Senior data scientist position in clinical trials
                </h3>
                
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  Advanced analytics role supporting global healthcare innovations
                </p>
                
                <button className="text-brand-blue hover:text-blue-700 transition-colors flex items-center gap-1 text-sm font-medium">
                  Read more
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
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

      {/* Trusted by Section */}
      <section className="bg-green-100 py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-xl font-light text-gray-900 mb-8">
              Trusted by leading life-sciences organizations
            </h2>
          </div>

          {/* Logo Carousel */}
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-8 md:space-x-12 lg:space-x-16 overflow-hidden">
              {/* BioNTech Logo */}
              <div className="flex items-center justify-center h-12">
                <img 
                  src="/partner_companies/BioNTech.png" 
                  alt="BioNTech" 
                  className="h-8 md:h-10 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>

              {/* Immatics Logo */}
              <div className="flex items-center justify-center h-12">
                <img 
                  src="/partner_companies/Immatics.png" 
                  alt="Immatics" 
                  className="h-8 md:h-10 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>

              {/* Debiopharm Logo */}
              <div className="flex items-center justify-center h-12">
                <img 
                  src="/partner_companies/Debiopharm.png" 
                  alt="Debiopharm" 
                  className="h-8 md:h-10 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>

              {/* Klifo Logo */}
              <div className="flex items-center justify-center h-12">
                <img 
                  src="/partner_companies/Klifo-logo.png" 
                  alt="Klifo" 
                  className="h-8 md:h-10 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>

              {/* BET Logo */}
              <div className="flex items-center justify-center h-12">
                <img 
                  src="/partner_companies/BET.webp" 
                  alt="BET" 
                  className="h-8 md:h-10 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>

              {/* Repeat some logos for carousel effect */}
              <div className="flex items-center justify-center h-12">
                <img 
                  src="/partner_companies/BioNTech.png" 
                  alt="BioNTech" 
                  className="h-8 md:h-10 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>

              <div className="flex items-center justify-center h-12">
                <img 
                  src="/partner_companies/Immatics.png" 
                  alt="Immatics" 
                  className="h-6 md:h-8 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Measuring Excellence Section */}
      <section className="bg-gray-50 py-20">
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
            {/* Video Section */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <div className="bg-gray-400 rounded-lg overflow-hidden shadow-lg aspect-video flex items-center justify-center">
                <div className="bg-gray-500 bg-opacity-70 rounded-lg p-6">
                  <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics Section */}
            <div className="lg:col-span-1 order-1 lg:order-2 space-y-12">
              {/* Stat 1 */}
              <div>
                <div className="text-6xl md:text-7xl font-light text-gray-900 mb-2">
                  <EditableText
                    value={pageContent.excellence.stat1.number}
                    onChange={(value) => updateContent('excellence.stat1.number', value)}
                    placeholder="Number..."
                    className="text-6xl md:text-7xl font-light text-gray-900 text-center block w-full"
                  />
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
                <div className="text-6xl md:text-7xl font-light text-gray-900 mb-2">
                  <EditableText
                    value={pageContent.excellence.stat2.number}
                    onChange={(value) => updateContent('excellence.stat2.number', value)}
                    placeholder="Number..."
                    className="text-6xl md:text-7xl font-light text-gray-900 text-center block w-full"
                  />
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
                <div className="text-6xl md:text-7xl font-light text-gray-900 mb-2">
                  <EditableText
                    value={pageContent.excellence.stat3.number}
                    onChange={(value) => updateContent('excellence.stat3.number', value)}
                    placeholder="Number..."
                    className="text-6xl md:text-7xl font-light text-gray-900 text-center block w-full"
                  />
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

      {/* Value Proposition Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-gray-600 text-sm uppercase tracking-wide mb-4">Why choose us</p>
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-gray-900">
              Our unique value proposition
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Specialized recruitment strategies that deliver exceptional results
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {/* Speed Card - Takes full width on medium screens, spans 2 columns */}
            <div className="md:col-span-2 lg:col-span-1 bg-gray-700 rounded-lg p-8 text-white relative overflow-hidden">
              <div className="mb-6">
                <span className="text-gray-300 text-sm uppercase tracking-wide">Speed</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-light mb-8 leading-tight">
                Rapid talent acquisition with precision and efficiency
              </h3>
              <div className="mb-8">
                <span className="text-gray-300 text-sm">Hire talent</span>
              </div>
              <div className="absolute bottom-8 left-8">
                <span className="text-white text-sm flex items-center gap-1">
                  Explore
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
              {/* Background decoration */}
              <div className="absolute bottom-4 right-4 w-16 h-16 bg-gray-600 rounded-lg opacity-30"></div>
            </div>

            {/* Rigorous Screening Card */}
            <div className="bg-gray-700 rounded-lg p-8 text-white relative">
              <div className="mb-6">
                <div className="w-12 h-12 bg-white bg-opacity-10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-light mb-8 leading-tight">
                Rigorous candidate screening and assessment
              </h3>
              <div className="absolute bottom-8 left-8">
                <span className="text-white text-sm flex items-center gap-1">
                  Explore
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Industry Standards Card */}
            <div className="bg-gray-700 rounded-lg p-8 text-white relative">
              <div className="mb-6">
                <div className="w-12 h-12 bg-white bg-opacity-10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-light mb-8 leading-tight">
                Strict adherence to industry regulations and standards
              </h3>
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
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20" style={{backgroundColor: '#d7e5fd'}}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-xl md:text-2xl font-light text-gray-900 leading-relaxed">
              <EditableText
                value={pageContent.testimonials.title}
                onChange={(value) => updateContent('testimonials.title', value)}
                placeholder="Enter testimonials title..."
                className="text-xl md:text-2xl font-light text-gray-900 leading-relaxed text-center block w-full"
              />
            </h2>
          </div>
          <TestimonialsCarousel 
            testimonials={pageContent.testimonials?.items || []}
            editMode={editMode}
            updateTestimonial={updateTestimonial}
            addTestimonial={addTestimonial}
            deleteTestimonial={deleteTestimonial}
          />
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20" style={{backgroundColor: '#d7e5fd'}}>
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
            {/* Image Section */}
            <div className="order-2 lg:order-1">
              <div className="bg-blue-300 rounded-lg overflow-hidden shadow-lg aspect-[4/3] flex items-center justify-center relative">
                <div className="bg-blue-400 bg-opacity-70 rounded-lg p-8 absolute bottom-8 left-8 right-8">
                  <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="order-1 lg:order-2">
              <div className="mb-4">
                <span className="text-gray-700 text-sm uppercase tracking-wide">Our Process</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-gray-900">
                Streamlined recruitment for specialized roles
              </h2>
              
              <p className="text-gray-700 text-lg mb-12 leading-relaxed">
                Our proven methodology combines deep industry expertise with cutting-edge recruitment technology to deliver exceptional candidates who drive innovation in life sciences and biometrics.
              </p>

              {/* Subheadings Grid */}
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div>
                  <h3 className="text-xl font-medium mb-4 text-gray-900">Expert Screening</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Every candidate undergoes rigorous technical and regulatory compliance assessment by our team of life sciences professionals.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-4 text-gray-900">Cultural Fit</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We ensure candidates align with your organization's values and working style for long-term success and retention.
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate('/hire-talent')}
                  className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded transition-all duration-300 shadow-[0_2px_4px_rgba(0,0,0,0.15)] font-medium"
                >
                  Start Hiring
                </button>
                <button 
                  onClick={() => navigate('/find-jobs')}
                  className="text-gray-900 hover:bg-gray-900/10 px-6 py-3 rounded transition-all duration-300 shadow-[0_2px_4px_rgba(0,0,0,0.15)] flex items-center gap-1 font-medium"
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
      <section className="bg-gray-50 py-20">
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
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full transition-all duration-300 shadow-[0_2px_4px_rgba(0,0,0,0.15)] font-medium"
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
              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-lg mx-auto mb-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-5 py-3 rounded-full bg-transparent border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:border-white/50 text-sm"
                />
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full transition-all duration-300 font-medium text-sm">
                  Sign up
                </button>
              </div>
              
              <p className="text-gray-400 text-sm">
                By clicking Sign Up you're confirming that you agree with our Terms and Conditions.
              </p>
            </div>

            {/* Footer Links */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-6xl mx-auto">
              {/* Logo */}
              <div className="lg:col-span-1">
                <div className="mb-8">
                  <span className="text-2xl font-light italic">JCR</span>
                </div>
                <p className="text-gray-300 leading-relaxed text-sm">
                  Specialized recruitment for life sciences data and biometrics professionals across global markets.
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
                  <li><a href="/jobs#biostatistics" className="text-gray-300 hover:text-white transition-colors text-sm">Biostatistics</a></li>
                  <li><a href="/jobs#bioinformatics" className="text-gray-300 hover:text-white transition-colors text-sm">Bioinformatics</a></li>
                  <li><a href="/jobs#clinical-data" className="text-gray-300 hover:text-white transition-colors text-sm">Clinical Data</a></li>
                </ul>
              </div>

              {/* Follow Us */}
              <div>
                <h4 className="text-white font-medium mb-6">Follow us</h4>
                                                 <ul className="space-y-4">
                  <li>
                    <a href="https://facebook.com" className="text-gray-300 hover:text-white transition-colors flex items-center gap-3 text-sm">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                      Facebook
                    </a>
                  </li>
                  <li>
                    <a href="https://instagram.com" className="text-gray-300 hover:text-white transition-colors flex items-center gap-3 text-sm">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.219-.359-1.219c0-1.142.662-1.995 1.488-1.995.703 0 1.042.527 1.042 1.16 0 .706-.449 1.763-.681 2.739-.194.825.413 1.497 1.227 1.497 1.473 0 2.604-1.553 2.604-3.799 0-1.983-1.426-3.37-3.459-3.37-2.357 0-3.743 1.769-3.743 3.598 0 .712.274 1.476.617 1.890.068.082.077.154.057.238-.061.26-.196.837-.223.953-.035.146-.116.177-.268.107-1.001-.465-1.624-1.926-1.624-3.1 0-2.523 1.834-4.84 5.287-4.84 2.781 0 4.943 1.981 4.943 4.628 0 2.757-1.739 4.976-4.151 4.976-.811 0-1.573-.421-1.834-.922l-.498 1.902c-.181.695-.669 1.566-.995 2.097A12.013 12.013 0 0 0 12.017 24c6.624 0 11.99-5.367 11.99-11.013C24.007 5.367 18.641.001.017 0z"/>
                      </svg>
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a href="https://x.com" className="text-gray-300 hover:text-white transition-colors flex items-center gap-3 text-sm">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                      X
                    </a>
                  </li>
                  <li>
                    <a href="https://linkedin.com" className="text-gray-300 hover:text-white transition-colors flex items-center gap-3 text-sm">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      LinkedIn
                    </a>
                  </li>
                  <li>
                    <a href="https://youtube.com" className="text-gray-300 hover:text-white transition-colors flex items-center gap-3 text-sm">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                      Youtube
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
                © 2025 Relume. All rights reserved.
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