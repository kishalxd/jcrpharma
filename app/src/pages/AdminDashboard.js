import React, { useState, useEffect } from 'react';
import { useAdmin } from '../components/AdminContext';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import BlogManager from '../components/BlogManager';
import JobManager from '../components/JobManager';
import TestimonialsManager from '../components/TestimonialsManager';

// Simple page edit components
const SimplePageEdit = ({ pageName, onSave }) => {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPageContent();
  }, [pageName]);

  useEffect(() => {
    const handleSaveTrigger = () => {
      handleSave();
    };

    window.addEventListener('triggerSave', handleSaveTrigger);
    return () => {
      window.removeEventListener('triggerSave', handleSaveTrigger);
    };
  }, [content]);

  const fetchPageContent = async () => {
    try {
      const { data, error } = await supabase
        .from('page_contents')
        .select('content')
        .eq('pageName', pageName)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching content:', error);
        setContent(getDefaultContent(pageName));
      } else if (data) {
        setContent(data.content || getDefaultContent(pageName));
      } else {
        setContent(getDefaultContent(pageName));
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      setContent(getDefaultContent(pageName));
    } finally {
      setLoading(false);
    }
  };

  const getDefaultContent = (page) => {
    const defaults = {
      home: {
        hero: {
          title: "Life Sciences, Biometrics & Data Recruitment Specialists",
          subtitle: "We help biotech and pharmaceutical companies build world-class teams in biostatistics, clinical data management, and data science, connecting life-sciences professionals with employers across the UK, USA, and Europe."
        },
        specialisms: {
          title: "Our recruitment expertise",
          subtitle: "Targeted talent solutions across critical life-sciences domains"
        },
        excellence: {
          title: "Measuring our recruitment excellence",
          subtitle: "Quantifiable results that demonstrate our specialized approach",
          stat1: { number: "14", description: "Days average time-to-hire" },
          stat2: { number: "92%", description: "Interview to offer success rate" },
          stat3: { number: "150+", description: "Placements across global markets" }
        },
        cta: {
          title: "Ready to find your next life sciences talent?",
          subtitle: "Connect with our specialized recruitment team today."
        }
      },
      about: {
        mission: {
          title: "Our Mission",
          content: "JCR Pharma was founded to transform recruitment in the life-sciences sector. Moving away from outdated, transactional approaches, we operate as true partners to our clients and candidates."
        },
        team: {
          title: "Leadership Team",
          subtitle: "Industry veterans with deep expertise in life-sciences recruitment"
        },
        values: {
          title: "Our Values",
          subtitle: "The principles that guide our approach to life-sciences recruitment"
        }
      },
      specialisms: {
        hero: {
          title: "Biostatistics Recruitment",
          subtitle: "Connect with top statistical programming talent for clinical research and regulatory submissions."
        },
        capabilities: {
          title: "Our recruitment expertise",
          subtitle: "Delivering specialized talent solutions with unmatched speed, quality, compliance, and global reach"
        },
        process: {
          title: "Recruitment process timeline",
          subtitle: "A streamlined 5-step process designed to deliver exceptional candidates quickly and efficiently"
        }
      },
      jobs: {
        hero: {
          title: "Find Your Next Life Sciences Role",
          subtitle: "Discover cutting-edge opportunities in biostatistics, clinical data management, and bioinformatics"
        },
        featured: {
          title: "Featured Opportunities",
          subtitle: "Hand-picked roles from leading pharmaceutical and biotech companies"
        }
      },
      employers: {
        hero: {
          title: "Hire Specialized Life Sciences Talent",
          subtitle: "Access our network of pre-screened biostatistics, clinical data, and bioinformatics professionals"
        },
        services: {
          title: "Our Recruitment Services",
          subtitle: "Comprehensive talent solutions tailored to your specific needs"
        },
        process: {
          title: "Our Hiring Process",
          subtitle: "Streamlined recruitment designed to deliver exceptional candidates quickly"
        }
      },
      candidates: {
        hero: {
          title: "Advance Your Life Sciences Career",
          subtitle: "Connect with leading pharmaceutical and biotech companies seeking your expertise"
        },
        opportunities: {
          title: "Career Opportunities",
          subtitle: "Explore roles across biostatistics, clinical data management, and bioinformatics"
        },
        services: {
          title: "Candidate Services",
          subtitle: "Comprehensive career support to help you find your ideal role"
        }
      }
    };
    return defaults[page] || {};
  };

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

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(content);
    } catch (error) {
      console.error('Error saving content:', error);
      alert(`Error saving content: ${error.message}`);
    }
    setSaving(false);
  };

  const renderPageForm = () => {
    switch (pageName) {
      case 'home':
        return (
          <div className="space-y-6">
            {/* Hero Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Hero Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.hero?.title || ''}
                    onChange={(e) => updateContent('hero.title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <textarea
                    value={content.hero?.subtitle || ''}
                    onChange={(e) => updateContent('hero.subtitle', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Specialisms Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Specialisms Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.specialisms?.title || ''}
                    onChange={(e) => updateContent('specialisms.title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={content.specialisms?.subtitle || ''}
                    onChange={(e) => updateContent('specialisms.subtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Excellence Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Excellence Statistics</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.excellence?.title || ''}
                    onChange={(e) => updateContent('excellence.title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={content.excellence?.subtitle || ''}
                    onChange={(e) => updateContent('excellence.subtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stat 1 Number</label>
                    <input
                      type="text"
                      value={content.excellence?.stat1?.number || ''}
                      onChange={(e) => updateContent('excellence.stat1.number', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                    />
                    <label className="block text-sm font-medium text-gray-700 mb-2 mt-2">Description</label>
                    <input
                      type="text"
                      value={content.excellence?.stat1?.description || ''}
                      onChange={(e) => updateContent('excellence.stat1.description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stat 2 Number</label>
                    <input
                      type="text"
                      value={content.excellence?.stat2?.number || ''}
                      onChange={(e) => updateContent('excellence.stat2.number', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                    />
                    <label className="block text-sm font-medium text-gray-700 mb-2 mt-2">Description</label>
                    <input
                      type="text"
                      value={content.excellence?.stat2?.description || ''}
                      onChange={(e) => updateContent('excellence.stat2.description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stat 3 Number</label>
                    <input
                      type="text"
                      value={content.excellence?.stat3?.number || ''}
                      onChange={(e) => updateContent('excellence.stat3.number', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                    />
                    <label className="block text-sm font-medium text-gray-700 mb-2 mt-2">Description</label>
                    <input
                      type="text"
                      value={content.excellence?.stat3?.description || ''}
                      onChange={(e) => updateContent('excellence.stat3.description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Call to Action</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.cta?.title || ''}
                    onChange={(e) => updateContent('cta.title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <textarea
                    value={content.cta?.subtitle || ''}
                    onChange={(e) => updateContent('cta.subtitle', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-6">
            {/* Mission Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Mission Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.mission?.title || ''}
                    onChange={(e) => updateContent('mission.title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <textarea
                    value={content.mission?.content || ''}
                    onChange={(e) => updateContent('mission.content', e.target.value)}
                    rows="5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Team Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Team Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.team?.title || ''}
                    onChange={(e) => updateContent('team.title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={content.team?.subtitle || ''}
                    onChange={(e) => updateContent('team.subtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Values Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Values Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.values?.title || ''}
                    onChange={(e) => updateContent('values.title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={content.values?.subtitle || ''}
                    onChange={(e) => updateContent('values.subtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'specialisms':
        return (
          <div className="space-y-6">
            {/* Hero Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Hero Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.hero?.title || ''}
                    onChange={(e) => updateContent('hero.title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <textarea
                    value={content.hero?.subtitle || ''}
                    onChange={(e) => updateContent('hero.subtitle', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Capabilities Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Capabilities Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.capabilities?.title || ''}
                    onChange={(e) => updateContent('capabilities.title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={content.capabilities?.subtitle || ''}
                    onChange={(e) => updateContent('capabilities.subtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Process Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Process Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.process?.title || ''}
                    onChange={(e) => updateContent('process.title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={content.process?.subtitle || ''}
                    onChange={(e) => updateContent('process.subtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'jobs':
        return (
          <div className="space-y-6">
            {/* Hero Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Hero Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.hero?.title || ''}
                    onChange={(e) => updateContent('hero.title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <textarea
                    value={content.hero?.subtitle || ''}
                    onChange={(e) => updateContent('hero.subtitle', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Featured Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Featured Opportunities</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.featured?.title || ''}
                    onChange={(e) => updateContent('featured.title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={content.featured?.subtitle || ''}
                    onChange={(e) => updateContent('featured.subtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'employers':
        return (
          <div className="space-y-6">
            {/* Hero Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Hero Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.hero?.title || ''}
                    onChange={(e) => updateContent('hero.title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <textarea
                    value={content.hero?.subtitle || ''}
                    onChange={(e) => updateContent('hero.subtitle', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Services Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Services Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.services?.title || ''}
                    onChange={(e) => updateContent('services.title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={content.services?.subtitle || ''}
                    onChange={(e) => updateContent('services.subtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Process Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Process Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.process?.title || ''}
                    onChange={(e) => updateContent('process.title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={content.process?.subtitle || ''}
                    onChange={(e) => updateContent('process.subtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'candidates':
        return (
          <div className="space-y-6">
            {/* Hero Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Hero Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.hero?.title || ''}
                    onChange={(e) => updateContent('hero.title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <textarea
                    value={content.hero?.subtitle || ''}
                    onChange={(e) => updateContent('hero.subtitle', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Opportunities Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Opportunities Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.opportunities?.title || ''}
                    onChange={(e) => updateContent('opportunities.title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={content.opportunities?.subtitle || ''}
                    onChange={(e) => updateContent('opportunities.subtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Services Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Services Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.services?.title || ''}
                    onChange={(e) => updateContent('services.title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={content.services?.subtitle || ''}
                    onChange={(e) => updateContent('services.subtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">No form available for this page type.</p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading page content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm">
      {/* Form Content */}
      <div className="p-6">
        {renderPageForm()}
      </div>
    </div>
  );
};

const AdminDashboard = ({ activeTab: propActiveTab }) => {
  const { adminLogout } = useAdmin();
  const navigate = useNavigate();
  const { pageName } = useParams();
  const location = useLocation();
  const [editingPage, setEditingPage] = useState(null);
  
  // Determine active tab from props or URL
  const activeTab = propActiveTab || 'dashboard';
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [employeeApplications, setEmployeeApplications] = useState([]);
  const [hiringRequests, setHiringRequests] = useState([]);
  const [newsletterSubscriptions, setNewsletterSubscriptions] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [downloadingCvId, setDownloadingCvId] = useState(null);

  const handleLogout = () => {
    adminLogout();
  };

  // Fetch employee applications
  const fetchEmployeeApplications = async () => {
    setLoadingData(true);
    try {
      const { data, error } = await supabase
        .from('employee_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEmployeeApplications(data || []);
    } catch (error) {
      console.error('Error fetching employee applications:', error);
    } finally {
      setLoadingData(false);
    }
  };

  // Fetch hiring requests
  const fetchHiringRequests = async () => {
    setLoadingData(true);
    try {
      const { data, error } = await supabase
        .from('hiring_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHiringRequests(data || []);
    } catch (error) {
      console.error('Error fetching hiring requests:', error);
    } finally {
      setLoadingData(false);
    }
  };

  // Fetch newsletter subscriptions
  const fetchNewsletterSubscriptions = async () => {
    setLoadingData(true);
    try {
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNewsletterSubscriptions(data || []);
    } catch (error) {
      console.error('Error fetching newsletter subscriptions:', error);
    } finally {
      setLoadingData(false);
    }
  };

  // Download CV file
  const downloadCV = async (cvFileUrl, cvFileName, applicationId) => {
    try {
      setDownloadingCvId(applicationId || null);
      const { data, error } = await supabase.storage
        .from('cv-files')
        .download(cvFileUrl);

      if (error) throw error;

      // Create blob URL and trigger download
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = cvFileName || 'cv.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading CV:', error);
      alert('Error downloading CV file');
    } finally {
      setDownloadingCvId(null);
    }
  };

  // Update application status
  const updateApplicationStatus = async (id, status) => {
    try {
      const { error } = await supabase
        .from('employee_applications')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      fetchEmployeeApplications(); // Refresh data
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  // Update hiring request status
  const updateHiringStatus = async (id, status) => {
    try {
      const { error } = await supabase
        .from('hiring_requests')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      fetchHiringRequests(); // Refresh data
    } catch (error) {
      console.error('Error updating hiring request status:', error);
    }
  };

  // Update newsletter subscription status
  const updateNewsletterStatus = async (id, status) => {
    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      fetchNewsletterSubscriptions(); // Refresh data
    } catch (error) {
      console.error('Error updating newsletter subscription status:', error);
    }
  };

  // Get status color for hiring requests
  const getHiringStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      reviewed: 'bg-blue-100 text-blue-800 border-blue-200',
      contacted: 'bg-purple-100 text-purple-800 border-purple-200',
      in_progress: 'bg-orange-100 text-orange-800 border-orange-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Get status color for employee applications
  const getApplicationStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      reviewed: 'bg-blue-100 text-blue-800 border-blue-200',
      contacted: 'bg-purple-100 text-purple-800 border-purple-200',
      hired: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Get status color for newsletter subscriptions
  const getNewsletterStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800 border-green-200',
      unsubscribed: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Filter and sort employee applications
  const getFilteredAndSortedApplications = () => {
    let filtered = employeeApplications;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(app => app.status === filterStatus);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'created_at' || sortBy === 'updated_at') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  // Filter and sort hiring requests
  const getFilteredAndSortedRequests = () => {
    let filtered = hiringRequests;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(req => 
        req.person_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(req => req.status === filterStatus);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'created_at' || sortBy === 'updated_at') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  // Filter and sort newsletter subscriptions
  const getFilteredAndSortedSubscriptions = () => {
    let filtered = newsletterSubscriptions;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(sub => 
        sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sub.source && sub.source.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(sub => sub.status === filterStatus);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'created_at' || sortBy === 'updated_at') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  // Fetch data when tab changes
  useEffect(() => {
    if (activeTab === 'employee-applications') {
      fetchEmployeeApplications();
    } else if (activeTab === 'hiring-requests') {
      fetchHiringRequests();
    } else if (activeTab === 'newsletter-subscriptions') {
      fetchNewsletterSubscriptions();
    }
  }, [activeTab]);

  const handleEditPage = (pageName) => {
    navigate(`/admin/edit-pages/${pageName}`);
  };

  // Set editing page from URL params
  useEffect(() => {
    if (activeTab === 'edit-pages' && pageName) {
      setEditingPage(pageName);
    } else {
      setEditingPage(null);
    }
  }, [activeTab, pageName]);

  const handleSaveContent = async (content) => {
    setLoading(true);
    try {
      console.log('Attempting to save content:', { pageName: editingPage, content });
      
      // Use the correct table name
      const { data, error } = await supabase
        .from('page_contents')
        .upsert({
          pageName: editingPage,
          content: content,
          updatedAt: new Date().toISOString()
        })
        .select();

      console.log('Supabase response:', { data, error });

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }
      
      console.log('Content saved successfully:', data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving content:', error);
      console.error('Error details:', error.message, error.details, error.hint);
      
      if (error.message.includes('401') || error.message.includes('JWT')) {
        alert('Authentication error: Please check your Supabase RLS policies. You may need to disable RLS for the page-contents table or set up proper policies.');
      } else if (error.message.includes('relation') || error.message.includes('does not exist')) {
        alert('Table not found: Please ensure the "page-contents" or "page_contents" table exists in your Supabase database.');
      } else {
        alert(`Error saving content: ${error.message}. Please check the console for details.`);
      }
    }
    setLoading(false);
  };

  const TabButton = ({ id, label, icon, path }) => (
    <button
      onClick={() => navigate(path)}
      className={`w-full flex items-center px-6 py-4 text-sm font-medium transition-colors border-b border-gray-200 ${
        activeTab === id
          ? 'bg-brand-blue text-white'
          : 'text-black hover:bg-gray-50'
      }`}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </button>
  );

  const renderContent = () => {
    if (editingPage) {
      return <SimplePageEdit pageName={editingPage} onSave={handleSaveContent} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="bg-white flex items-center justify-center min-h-full">
            <div className="max-w-2xl mx-auto text-center">
              <img 
                src="/building.jpg" 
                alt="Under Construction" 
                className="w-full h-auto rounded-lg mb-6"
              />
              <h3 className="text-2xl font-bold text-black mb-2">Dashboard Coming Soon</h3>
              <p className="text-black">Analytics and overview dashboard is currently under development.</p>
            </div>
          </div>
        );

      case 'blogs':
        return <BlogManager />;

      case 'employee-applications':
        const filteredApplications = getFilteredAndSortedApplications();
        return (
          <div className="bg-white shadow-sm">
            {/* Search and Filter Bar */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search by name, email, or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="contacted">Contacted</option>
                    <option value="hired">Hired</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split('-');
                      setSortBy(field);
                      setSortOrder(order);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
                  >
                    <option value="created_at-desc">Newest First</option>
                    <option value="created_at-asc">Oldest First</option>
                    <option value="full_name-asc">Name A-Z</option>
                    <option value="full_name-desc">Name Z-A</option>
                    <option value="status-asc">Status A-Z</option>
                  </select>
                  <button
                    onClick={() => window.open('/find-jobs?redirect=/admin/employee-applications', '_blank')}
                    className="bg-brand-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add New</span>
                  </button>
                  <button
                    onClick={fetchEmployeeApplications}
                    disabled={loadingData}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                    title="Refresh"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0V9a8 8 0 1115.356 2M15 15v5h-.582M4.582 15A8.001 8.001 0 0019.418 9m0 0V9a8 8 0 10-15.356 2" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 text-black font-medium text-sm">Name</th>
                    <th className="text-left py-4 px-6 text-black font-medium text-sm">Email</th>
                    <th className="text-left py-4 px-6 text-black font-medium text-sm">Location</th>
                    <th className="text-left py-4 px-6 text-black font-medium text-sm">CV</th>
                    <th className="text-left py-4 px-6 text-black font-medium text-sm">Status</th>
                    <th className="text-left py-4 px-6 text-black font-medium text-sm">Applied</th>
                    <th className="text-left py-4 px-6 text-black font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-8 px-6 text-center text-gray-500">
                        {loadingData ? 'Loading applications...' : searchTerm || filterStatus !== 'all' ? 'No applications match your search criteria' : 'No applications found'}
                      </td>
                    </tr>
                  ) : (
                    filteredApplications.map((application) => (
                      <tr key={application.id} className="hover:bg-gray-50 transition-colors border-t border-gray-100">
                        <td className="py-4 px-6 text-black font-medium text-sm">{application.full_name}</td>
                        <td className="py-4 px-6 text-gray-600 text-sm">{application.email}</td>
                        <td className="py-4 px-6 text-gray-600 text-sm">{application.location}</td>
                        <td className="py-4 px-6">
                          {application.cv_file_url ? (
                            <button
                              onClick={() => downloadCV(application.cv_file_url, application.cv_file_name, application.id)}
                              disabled={downloadingCvId === application.id}
                              className={`text-sm font-medium flex items-center gap-2 ${downloadingCvId === application.id ? 'text-gray-400 cursor-not-allowed' : 'text-brand-blue hover:text-blue-700'}`}
                            >
                              {downloadingCvId === application.id ? (
                                <>
                                  <svg className="animate-spin h-4 w-4 text-gray-400" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                  </svg>
                                  <span>Downloading...</span>
                                </>
                              ) : (
                                <span>Download CV</span>
                              )}
                            </button>
                          ) : (
                            <span className="text-gray-400 text-sm">No CV</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <select
                            value={application.status}
                            onChange={(e) => updateApplicationStatus(application.id, e.target.value)}
                            className={`text-xs px-3 py-2 pr-8 rounded-full border font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue appearance-none cursor-pointer ${getApplicationStatusColor(application.status)}`}
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                              backgroundPosition: 'right 0.5rem center',
                              backgroundRepeat: 'no-repeat',
                              backgroundSize: '1rem 1rem'
                            }}
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="contacted">Contacted</option>
                            <option value="hired">Hired</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="py-4 px-6 text-gray-600 text-sm">
                          {new Date(application.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6">
                          <button
                            onClick={() => window.open(`/employee-application/${application.id}`, '_blank')}
                            className="text-brand-blue hover:text-blue-700 px-3 py-1 rounded text-sm font-medium"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'hiring-requests':
        const filteredRequests = getFilteredAndSortedRequests();
        return (
          <div className="bg-white shadow-sm">
            {/* Search and Filter Bar */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search by name, company, email, or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="contacted">Contacted</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split('-');
                      setSortBy(field);
                      setSortOrder(order);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
                  >
                    <option value="created_at-desc">Newest First</option>
                    <option value="created_at-asc">Oldest First</option>
                    <option value="person_name-asc">Name A-Z</option>
                    <option value="person_name-desc">Name Z-A</option>
                    <option value="business_name-asc">Company A-Z</option>
                    <option value="status-asc">Status A-Z</option>
                  </select>
                  <button
                    onClick={() => window.open('/hire-talent?redirect=/admin/hiring-requests', '_blank')}
                    className="bg-brand-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add New</span>
                  </button>
                  <button
                    onClick={fetchHiringRequests}
                    disabled={loadingData}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                    title="Refresh"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0V9a8 8 0 1115.356 2M15 15v5h-.582M4.582 15A8.001 8.001 0 0019.418 9m0 0V9a8 8 0 10-15.356 2" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 text-black font-medium text-sm">Contact</th>
                    <th className="text-left py-4 px-6 text-black font-medium text-sm">Company</th>
                    <th className="text-left py-4 px-6 text-black font-medium text-sm">Title</th>
                    <th className="text-left py-4 px-6 text-black font-medium text-sm">Location</th>
                    <th className="text-left py-4 px-6 text-black font-medium text-sm">Status</th>
                    <th className="text-left py-4 px-6 text-black font-medium text-sm">Submitted</th>
                    <th className="text-left py-4 px-6 text-black font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-8 px-6 text-center text-gray-500">
                        {loadingData ? 'Loading requests...' : searchTerm || filterStatus !== 'all' ? 'No requests match your search criteria' : 'No hiring requests found'}
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50 transition-colors border-t border-gray-100">
                        <td className="py-4 px-6">
                          <div>
                            <div className="text-black font-medium text-sm">{request.person_name}</div>
                            <div className="text-gray-600 text-xs">{request.email}</div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-600 text-sm">{request.business_name}</td>
                        <td className="py-4 px-6 text-gray-600 text-sm">{request.title}</td>
                        <td className="py-4 px-6 text-gray-600 text-sm">{request.location}</td>
                        <td className="py-4 px-6">
                          <select
                            value={request.status}
                            onChange={(e) => updateHiringStatus(request.id, e.target.value)}
                            className={`text-xs px-3 py-2 pr-8 rounded-full border font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue appearance-none cursor-pointer ${getHiringStatusColor(request.status)}`}
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                              backgroundPosition: 'right 0.5rem center',
                              backgroundRepeat: 'no-repeat',
                              backgroundSize: '1rem 1rem'
                            }}
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="contacted">Contacted</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-4 px-6 text-gray-600 text-sm">
                          {new Date(request.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6">
                          <button
                            onClick={() => window.open(`/hiring/${request.id}`, '_blank')}
                            className="text-brand-blue hover:text-blue-700 px-3 py-1 rounded text-sm font-medium"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'newsletter-subscriptions':
        const filteredSubscriptions = getFilteredAndSortedSubscriptions();
        return (
          <div className="bg-white shadow-sm">
            {/* Search and Filter Bar */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search by email or source..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="unsubscribed">Unsubscribed</option>
                  </select>
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split('-');
                      setSortBy(field);
                      setSortOrder(order);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
                  >
                    <option value="created_at-desc">Newest First</option>
                    <option value="created_at-asc">Oldest First</option>
                    <option value="email-asc">Email A-Z</option>
                    <option value="email-desc">Email Z-A</option>
                    <option value="status-asc">Status A-Z</option>
                  </select>
                  <button
                    onClick={fetchNewsletterSubscriptions}
                    disabled={loadingData}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                    title="Refresh"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0V9a8 8 0 1115.356 2M15 15v5h-.582M4.582 15A8.001 8.001 0 0019.418 9m0 0V9a8 8 0 10-15.356 2" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 text-black font-medium text-sm">Email</th>
                    <th className="text-left py-4 px-6 text-black font-medium text-sm">Source</th>
                    <th className="text-left py-4 px-6 text-black font-medium text-sm">Status</th>
                    <th className="text-left py-4 px-6 text-black font-medium text-sm">Subscribed</th>
                    <th className="text-left py-4 px-6 text-black font-medium text-sm">Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscriptions.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-8 px-6 text-center text-gray-500">
                        {loadingData ? 'Loading subscriptions...' : searchTerm || filterStatus !== 'all' ? 'No subscriptions match your search criteria' : 'No newsletter subscriptions found'}
                      </td>
                    </tr>
                  ) : (
                    filteredSubscriptions.map((subscription) => (
                      <tr key={subscription.id} className="hover:bg-gray-50 transition-colors border-t border-gray-100">
                        <td className="py-4 px-6 text-black font-medium text-sm">{subscription.email}</td>
                        <td className="py-4 px-6 text-gray-600 text-sm">{subscription.source || 'website'}</td>
                        <td className="py-4 px-6">
                          <select
                            value={subscription.status}
                            onChange={(e) => updateNewsletterStatus(subscription.id, e.target.value)}
                            className={`text-xs px-3 py-2 pr-8 rounded-full border font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue appearance-none cursor-pointer ${getNewsletterStatusColor(subscription.status)}`}
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                              backgroundPosition: 'right 0.5rem center',
                              backgroundRepeat: 'no-repeat',
                              backgroundSize: '1rem 1rem'
                            }}
                          >
                            <option value="active">Active</option>
                            <option value="unsubscribed">Unsubscribed</option>
                          </select>
                        </td>
                        <td className="py-4 px-6 text-gray-600 text-sm">
                          {new Date(subscription.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6 text-gray-600 text-sm">
                          {subscription.updated_at ? new Date(subscription.updated_at).toLocaleDateString() : '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      
      case 'job-board':
        return <JobManager />;
      
      case 'testimonials':
        return <TestimonialsManager />;
      
      case 'edit-pages':
        return (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 text-black font-medium text-sm first:rounded-tl-xl">Page</th>
                    <th className="text-left py-4 px-6 text-black font-medium text-sm">Path</th>
                    <th className="text-left py-4 px-6 text-black font-medium text-sm">Status</th>
                    <th className="text-left py-4 px-6 text-black font-medium text-sm">Last Modified</th>
                    <th className="text-left py-4 px-6 text-black font-medium text-sm last:rounded-tr-xl">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="py-5 px-6 text-black font-medium text-sm">Home</td>
                    <td className="py-5 px-6 text-gray-600 text-sm">/</td>
                    <td className="py-5 px-6">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                        Published
                      </span>
                    </td>
                    <td className="py-5 px-6 text-gray-600 text-sm">2 days ago</td>
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleEditPage('home')}
                          className="bg-brand-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => window.open('/', '_blank')}
                          className="text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors text-sm"
                        >
                          Preview
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors border-t border-gray-100">
                    <td className="py-5 px-6 text-black font-medium text-sm">Specialisms</td>
                    <td className="py-5 px-6 text-gray-600 text-sm">/specialisms</td>
                    <td className="py-5 px-6">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                        Published
                      </span>
                    </td>
                    <td className="py-5 px-6 text-gray-600 text-sm">1 week ago</td>
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleEditPage('specialisms')}
                          className="bg-brand-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => window.open('/specialisms', '_blank')}
                          className="text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors text-sm"
                        >
                          Preview
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors border-t border-gray-100">
                    <td className="py-5 px-6 text-black font-medium text-sm">Jobs</td>
                    <td className="py-5 px-6 text-gray-600 text-sm">/jobs</td>
                    <td className="py-5 px-6">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                        Published
                      </span>
                    </td>
                    <td className="py-5 px-6 text-gray-600 text-sm">3 days ago</td>
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleEditPage('jobs')}
                          className="bg-brand-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => window.open('/jobs', '_blank')}
                          className="text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors text-sm"
                        >
                          Preview
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors border-t border-gray-100">
                    <td className="py-5 px-6 text-black font-medium text-sm">Employers</td>
                    <td className="py-5 px-6 text-gray-600 text-sm">/employers</td>
                    <td className="py-5 px-6">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                        Published
                      </span>
                    </td>
                    <td className="py-5 px-6 text-gray-600 text-sm">5 days ago</td>
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleEditPage('employers')}
                          className="bg-brand-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => window.open('/employers', '_blank')}
                          className="text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors text-sm"
                        >
                          Preview
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors border-t border-gray-100">
                    <td className="py-5 px-6 text-black font-medium text-sm">Candidates</td>
                    <td className="py-5 px-6 text-gray-600 text-sm">/candidates</td>
                    <td className="py-5 px-6">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                        Published
                      </span>
                    </td>
                    <td className="py-5 px-6 text-gray-600 text-sm">1 week ago</td>
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleEditPage('candidates')}
                          className="bg-brand-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => window.open('/candidates', '_blank')}
                          className="text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors text-sm"
                        >
                          Preview
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors border-t border-gray-100">
                    <td className="py-5 px-6 text-black font-medium text-sm">About Us</td>
                    <td className="py-5 px-6 text-gray-600 text-sm">/about</td>
                    <td className="py-5 px-6">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                        Published
                      </span>
                    </td>
                    <td className="py-5 px-6 text-gray-600 text-sm">2 weeks ago</td>
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleEditPage('about')}
                          className="bg-brand-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => window.open('/about', '_blank')}
                          className="text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors text-sm"
                        >
                          Preview
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="bg-white flex items-center justify-center min-h-full">
            <div className="max-w-2xl mx-auto text-center">
              <img 
                src="/building.jpg" 
                alt="Under Construction" 
                className="w-full h-auto rounded-lg mb-6"
              />
              <h3 className="text-2xl font-bold text-black mb-2">Coming Soon</h3>
              <p className="text-black">This section is currently under development.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen bg-white flex">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        {/* Logo Section */}
        <div className="px-6 py-3 border-b border-gray-200 h-[57px] flex items-center flex-shrink-0">
          <img 
            src="/jcr_logo.jpg" 
            alt="JCR Logo" 
            className="h-8 w-auto"
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto">
          <TabButton
            id="dashboard"
            label="Dashboard"
            path="/admin/dashboard"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
          />
          <TabButton
            id="edit-pages"
            label="Edit Pages"
            path="/admin/edit-pages"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            }
          />
          <TabButton
            id="blogs"
            label="Blogs"
            path="/admin/blogs"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
          />
          <TabButton
            id="employee-applications"
            label="Employee Applications"
            path="/admin/employee-applications"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          />
          <TabButton
            id="hiring-requests"
            label="Hiring Requests"
            path="/admin/hiring-requests"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
          />
          <TabButton
            id="job-board"
            label="Job Board"
            path="/admin/job-board"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
            }
          />
          <TabButton
            id="testimonials"
            label="Testimonials"
            path="/admin/testimonials"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            }
          />
          <TabButton
            id="newsletter-subscriptions"
            label="Newsletter Subscriptions"
            path="/admin/newsletter-subscriptions"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          />
          <TabButton
            id="settings"
            label="Settings"
            path="/admin/settings"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
        </nav>
      </aside>

      {/* Right Section */}
      <main className="flex-1 flex flex-col bg-white">
        {/* Top Bar with User Info & Logout */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 h-[57px] flex items-center flex-shrink-0">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center space-x-4">
              {editingPage && (
                <button
                  onClick={() => navigate('/admin/edit-pages')}
                  className="text-black hover:bg-gray-100 p-2 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <h2 className="text-xl font-bold text-black">
                {editingPage ? `Edit ${editingPage} Page` : (activeTab === 'edit-pages' ? 'Edit Pages' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1))}
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              {editingPage ? (
                <>
                  {saved && <span className="text-green-600 text-sm">Saved!</span>}
                  <button
                    onClick={() => {
                      // Trigger save from the SimplePageEdit component
                      const saveEvent = new CustomEvent('triggerSave');
                      window.dispatchEvent(saveEvent);
                    }}
                    disabled={loading}
                    className="bg-brand-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors text-sm"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              ) : (
                <>
                  <div className="text-right">
                    <p className="text-sm font-medium text-black">Captain Price</p>
                    <p className="text-xs text-black">Administrator</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-brand-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className={activeTab === 'blogs' ? 'px-8 py-6' : ''}>
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard; 