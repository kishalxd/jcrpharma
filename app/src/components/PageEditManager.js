import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const PageEditManager = ({ pageName, onSave }) => {
  const navigate = useNavigate();
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [filePreview, setFilePreview] = useState(null);

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

  // Deep merge function to combine default content with database content
  const deepMerge = (defaults, database) => {
    if (!database || typeof database !== 'object') return defaults;
    if (defaults === null || typeof defaults !== 'object') return database || defaults;
    
    const merged = { ...defaults };
    
    for (const key in database) {
      if (database.hasOwnProperty(key)) {
        if (Array.isArray(database[key])) {
          // For arrays, use database value if it exists, otherwise use default
          merged[key] = database[key].length > 0 ? database[key] : (defaults[key] || []);
        } else if (typeof database[key] === 'object' && database[key] !== null) {
          // Recursively merge nested objects
          merged[key] = deepMerge(defaults[key] || {}, database[key]);
        } else {
          // Use database value if it exists and is not null/undefined, otherwise keep default
          merged[key] = database[key] !== undefined && database[key] !== null ? database[key] : (defaults[key] !== undefined ? defaults[key] : database[key]);
        }
      }
    }
    
    // Ensure all default keys are present
    for (const key in defaults) {
      if (defaults.hasOwnProperty(key) && !(key in merged)) {
        merged[key] = defaults[key];
      }
    }
    
    return merged;
  };

  const fetchPageContent = async () => {
    try {
      const defaultContent = getDefaultContent(pageName);
      
      const { data, error } = await supabase
        .from('page_contents')
        .select('content')
        .eq('page_name', pageName)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching content:', error);
        setContent(defaultContent);
      } else if (data && data.content) {
        // Merge database content with defaults to ensure all sections exist
        const mergedContent = deepMerge(defaultContent, data.content);
        setContent(mergedContent);
      } else {
        setContent(defaultContent);
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
          stat1: { number: "3", description: "Average time-to-hire" },
          stat2: { number: "95%", description: "Interview to offer success rate" },
          stat3: { number: "90%+", description: "Candidate retention after 1 year" }
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
      },
      about: {
        mission: {
          title: "Our Mission",
          paragraph1: "JCR Pharma was founded on a simple belief: recruitment in the life sciences industry can and should be done better. After years of working within agencies that chased numbers instead of people, we set out to build something different. We wanted a consultancy that leads with honesty, transparency, and partnership. Our team specialises in biometrics, biostatistics, and clinical data management recruitment, helping pharmaceutical, biotech, and CRO organisations across the UK and Europe find talent that truly fits. A candidate should not only meet the requirements on paper but also align with a company's culture, purpose, and long-term goals.",
          paragraph2: "We do not measure success by how many CVs we send. We measure it by the relationships we build and by the impact our candidates make. Every search begins with listening, every conversation with understanding, and every placement with trust. JCR Pharma is more than a business to us. It is a commitment to doing recruitment with integrity, empathy, and genuine care for the science that shapes lives."
        },
        team: {
          title: "Leadership Team",
          subtitle: "Industry veterans with deep expertise in life-sciences recruitment and talent acquisition",
          james: {
            name: "James Carpenter",
            title: "Managing Director / Founder",
            bio: "James brings 10 years of recruitment experience, including 5+ years specialised in Biometrics. After graduating from the University of Hertfordshire with a degree in History, he began in graduate and Rec2Rec recruitment before transitioning to life sciences. James built Biometrics desks from scratch across multiple agencies, developing expertise in the European market. A former rugby player who retired to focus on his career, James founded JCR Pharma driven by a vision to transform recruitment through integrity, consultation, and genuine partnership rather than outdated transactional approaches."
          },
          mathy: {
            name: "Mathy Bekele",
            title: "Principal Consultant",
            bio: "With five years of specialised recruitment experience in the biometrics space within pharmaceuticals, Mathy began her career at Phaidon International before joining Veramed as an internal recruiter. During her three years at Veramed, she worked directly with statisticians and programmers, making numerous placements across biotech, pharmaceutical, and CRO organisations. Her deep understanding of the industry was further strengthened through attending key conferences like PhUSE in London. Mathy joined JCR in 2024, drawn by the company's people-first ethos and commitment to building long-term relationships. Based in Vienna, Austria, she focuses on providing exceptional service while supporting the biotech and pharmaceutical communities."
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
      },
      specialisms: {
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
              question: "What specialisations do you cover in life sciences recruitment?",
              answer: "We specialise in biostatistics, clinical data management, statistical programming, data science, and bioinformatics. Our focus is on data-driven roles within pharmaceutical, biotechnology, and medical device companies."
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
      },
      candidates: {
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
      }
    };
    return defaults[page] || {};
  };

  // Handle file upload for salary guide
  const handleFileUpload = async (file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const isValidType = allowedTypes.includes(file.type) || ['pdf', 'doc', 'docx'].includes(fileExt);
    
    if (!isValidType) {
      alert('Please upload a PDF, DOC, or DOCX file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setUploadingFile(true);
    try {
      const fileName = 'employee_doc';
      const finalExt = fileExt || 'pdf';
      const filePath = `${fileName}.${finalExt}`;

      // List all files to find existing employee_doc files
      const { data: allFiles } = await supabase.storage
        .from('cv-files')
        .list('');

      if (allFiles) {
        // Find and delete all files that start with employee_doc
        const filesToDelete = allFiles
          .filter(f => f.name.startsWith('employee_doc'))
          .map(f => f.name);
        
        if (filesToDelete.length > 0) {
          await supabase.storage
            .from('cv-files')
            .remove(filesToDelete);
        }
      }

      // Upload new file
      const { error } = await supabase.storage
        .from('cv-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        // If upsert fails, try to remove and upload again
        await supabase.storage.from('cv-files').remove([filePath]);
        const { error: retryError } = await supabase.storage
          .from('cv-files')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });
        if (retryError) throw retryError;
      }

      // Update content with file path
      updateContent('salaryGuide.filePath', filePath);
      setFilePreview(file.name);
      
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    } finally {
      setUploadingFile(false);
    }
  };

  // Check for existing file on component mount or when content changes
  useEffect(() => {
    if (pageName === 'candidates') {
      const checkExistingFile = async () => {
        try {
          // Check if file path is in content
          if (content.salaryGuide?.filePath) {
            setFilePreview('File uploaded');
            return;
          }

          // Check if file exists in storage
          const { data: allFiles } = await supabase.storage
            .from('cv-files')
            .list('');
          
          if (allFiles) {
            const employeeDocFile = allFiles.find(f => f.name.startsWith('employee_doc'));
            if (employeeDocFile) {
              updateContent('salaryGuide.filePath', employeeDocFile.name);
              setFilePreview('File uploaded');
            }
          }
        } catch (error) {
          console.error('Error checking existing file:', error);
        }
      };
      checkExistingFile();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageName]);

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
            <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Hero Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.hero?.title || ''}
                    onChange={(e) => updateContent('hero.title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <textarea
                    value={content.hero?.subtitle || ''}
                    onChange={(e) => updateContent('hero.subtitle', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Specialisms Section */}
            <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Specialisms Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.specialisms?.title || ''}
                    onChange={(e) => updateContent('specialisms.title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={content.specialisms?.subtitle || ''}
                    onChange={(e) => updateContent('specialisms.subtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                  />
                </div>
                <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Biostatistics</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={content.specialisms?.biostatistics?.title || ''}
                        onChange={(e) => updateContent('specialisms.biostatistics.title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tag</label>
                      <input
                        type="text"
                        value={content.specialisms?.biostatistics?.tag || ''}
                        onChange={(e) => updateContent('specialisms.biostatistics.tag', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                      />
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Clinical Data</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={content.specialisms?.clinicalData?.title || ''}
                        onChange={(e) => updateContent('specialisms.clinicalData.title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <input
                        type="text"
                        value={content.specialisms?.clinicalData?.description || ''}
                        onChange={(e) => updateContent('specialisms.clinicalData.description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                      />
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Bioinformatics</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={content.specialisms?.bioinformatics?.title || ''}
                        onChange={(e) => updateContent('specialisms.bioinformatics.title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <input
                        type="text"
                        value={content.specialisms?.bioinformatics?.description || ''}
                        onChange={(e) => updateContent('specialisms.bioinformatics.description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Excellence Section */}
            <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Excellence Statistics</h3>
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Section Content</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title (use \n for line breaks)</label>
                      <textarea
                        value={content.excellence?.title || ''}
                        onChange={(e) => updateContent('excellence.title', e.target.value)}
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                      <input
                        type="text"
                        value={content.excellence?.subtitle || ''}
                        onChange={(e) => updateContent('excellence.subtitle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                      />
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Note:</strong> The statistics numbers (3 Weeks, 95%, 90%+) are hardcoded and not editable. Only the title and subtitle can be modified.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Call to Action</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title (use \n for line breaks)</label>
                  <textarea
                    value={content.cta?.title || ''}
                    onChange={(e) => updateContent('cta.title', e.target.value)}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <textarea
                    value={content.cta?.subtitle || ''}
                    onChange={(e) => updateContent('cta.subtitle', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Our Process Section */}
            <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Our Process Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Label</label>
                  <input
                    type="text"
                    value={content.process?.label || ''}
                    onChange={(e) => updateContent('process.label', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.process?.title || ''}
                    onChange={(e) => updateContent('process.title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={content.process?.description || ''}
                    onChange={(e) => updateContent('process.description', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                  />
                </div>
                <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Expert Screening</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={content.process?.expertScreening?.title || ''}
                        onChange={(e) => updateContent('process.expertScreening.title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={content.process?.expertScreening?.description || ''}
                        onChange={(e) => updateContent('process.expertScreening.description', e.target.value)}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                      />
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Cultural Fit</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={content.process?.culturalFit?.title || ''}
                        onChange={(e) => updateContent('process.culturalFit.title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={content.process?.culturalFit?.description || ''}
                        onChange={(e) => updateContent('process.culturalFit.description', e.target.value)}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonials Section */}
            <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Testimonials Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.testimonials?.title || ''}
                    onChange={(e) => updateContent('testimonials.title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                  />
                </div>
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-gray-700 mb-3">
                    To add, edit, or manage testimonials, use the dedicated Testimonials tab in the sidebar.
                  </p>
                  <button
                    onClick={() => navigate('/admin/testimonials')}
                    className="bg-brand-blue hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                  >
                    <span>Go to Testimonials Manager</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-6">
            {/* Mission Section */}
            <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Mission Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.mission?.title || ''}
                    onChange={(e) => updateContent('mission.title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="Our Mission"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Paragraph 1</label>
                  <textarea
                    value={content.mission?.paragraph1 || ''}
                    onChange={(e) => updateContent('mission.paragraph1', e.target.value)}
                    rows="5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="JCR Pharma was founded on a simple belief..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Paragraph 2</label>
                  <textarea
                    value={content.mission?.paragraph2 || ''}
                    onChange={(e) => updateContent('mission.paragraph2', e.target.value)}
                    rows="5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="We do not measure success..."
                  />
                </div>
              </div>
            </div>

            {/* Team Section */}
            <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Team Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.team?.title || ''}
                    onChange={(e) => updateContent('team.title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="Leadership Team"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <textarea
                    value={content.team?.subtitle || ''}
                    onChange={(e) => updateContent('team.subtitle', e.target.value)}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="Industry veterans with deep expertise..."
                  />
                </div>
                
                {/* James Carpenter */}
                <div className="mt-6 pt-6 border-t border-gray-300">
                  <h4 className="text-md font-medium text-gray-900 mb-4">James Carpenter</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        value={content.team?.james?.name || ''}
                        onChange={(e) => updateContent('team.james.name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                        placeholder="James Carpenter"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={content.team?.james?.title || ''}
                        onChange={(e) => updateContent('team.james.title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                        placeholder="Managing Director / Founder"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                      <textarea
                        value={content.team?.james?.bio || ''}
                        onChange={(e) => updateContent('team.james.bio', e.target.value)}
                        rows="6"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                        placeholder="James brings 10 years of recruitment experience..."
                      />
                    </div>
              </div>
            </div>

                {/* Mathy Bekele */}
                <div className="mt-6 pt-6 border-t border-gray-300">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Mathy Bekele</h4>
                  <div className="space-y-4">
            <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        value={content.team?.mathy?.name || ''}
                        onChange={(e) => updateContent('team.mathy.name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                        placeholder="Mathy Bekele"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={content.team?.mathy?.title || ''}
                        onChange={(e) => updateContent('team.mathy.title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                        placeholder="Principal Consultant"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                      <textarea
                        value={content.team?.mathy?.bio || ''}
                        onChange={(e) => updateContent('team.mathy.bio', e.target.value)}
                        rows="6"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                        placeholder="With five years of specialised recruitment experience..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Values Section */}
            <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Values Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.values?.title || ''}
                    onChange={(e) => updateContent('values.title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="Our Values"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <textarea
                    value={content.values?.subtitle || ''}
                    onChange={(e) => updateContent('values.subtitle', e.target.value)}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="Our Recruitment Values in Life-Sciences & Biostatistics"
                  />
                </div>
                
                {/* Excellence */}
                <div className="mt-6 pt-6 border-t border-gray-300">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Excellence</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={content.values?.excellence?.title || ''}
                        onChange={(e) => updateContent('values.excellence.title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                        placeholder="Excellence"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={content.values?.excellence?.description || ''}
                        onChange={(e) => updateContent('values.excellence.description', e.target.value)}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                        placeholder="We uphold the highest standards..."
                      />
                    </div>
                  </div>
                </div>

                {/* Integrity */}
                <div className="mt-6 pt-6 border-t border-gray-300">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Integrity</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={content.values?.integrity?.title || ''}
                        onChange={(e) => updateContent('values.integrity.title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                        placeholder="Integrity"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={content.values?.integrity?.description || ''}
                        onChange={(e) => updateContent('values.integrity.description', e.target.value)}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                        placeholder="Transparent, data-driven communication..."
                      />
                    </div>
                  </div>
                </div>

                {/* Expertise */}
                <div className="mt-6 pt-6 border-t border-gray-300">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Expertise</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={content.values?.expertise?.title || ''}
                        onChange={(e) => updateContent('values.expertise.title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                        placeholder="Expertise"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={content.values?.expertise?.description || ''}
                        onChange={(e) => updateContent('values.expertise.description', e.target.value)}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                        placeholder="Our recruiters' deep biometrics domain knowledge..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Stats Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.stats?.title || ''}
                    onChange={(e) => updateContent('stats.title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="Our Impact"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <textarea
                    value={content.stats?.subtitle || ''}
                    onChange={(e) => updateContent('stats.subtitle', e.target.value)}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="Measurable results that demonstrate..."
                  />
                </div>
                
                {/* Placements */}
                <div className="mt-6 pt-6 border-t border-gray-300">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Successful Placements</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Value</label>
                      <input
                        type="text"
                        value={content.stats?.placements?.value || ''}
                        onChange={(e) => updateContent('stats.placements.value', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                        placeholder="90+"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Label</label>
                      <input
                        type="text"
                        value={content.stats?.placements?.label || ''}
                        onChange={(e) => updateContent('stats.placements.label', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                        placeholder="Successful Placements"
                      />
                    </div>
                  </div>
                </div>

                {/* Time to Hire */}
                <div className="mt-6 pt-6 border-t border-gray-300">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Average Time-to-Hire</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Value</label>
                      <input
                        type="text"
                        value={content.stats?.timeToHire?.value || ''}
                        onChange={(e) => updateContent('stats.timeToHire.value', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                        placeholder="3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Label</label>
                      <input
                        type="text"
                        value={content.stats?.timeToHire?.label || ''}
                        onChange={(e) => updateContent('stats.timeToHire.label', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                        placeholder="Weeks Average Time-to-Hire"
                      />
                    </div>
                  </div>
                </div>

                {/* Satisfaction */}
                <div className="mt-6 pt-6 border-t border-gray-300">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Client Satisfaction Rate</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Value</label>
                      <input
                        type="text"
                        value={content.stats?.satisfaction?.value || ''}
                        onChange={(e) => updateContent('stats.satisfaction.value', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                        placeholder="95%"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Label</label>
                      <input
                        type="text"
                        value={content.stats?.satisfaction?.label || ''}
                        onChange={(e) => updateContent('stats.satisfaction.label', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                        placeholder="Client Satisfaction Rate"
                      />
                    </div>
                  </div>
                </div>

                {/* Partners */}
                <div className="mt-6 pt-6 border-t border-gray-300">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Partner Organisations</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Value</label>
                      <input
                        type="text"
                        value={content.stats?.partners?.value || ''}
                        onChange={(e) => updateContent('stats.partners.value', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                        placeholder="50+"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Label</label>
                      <input
                        type="text"
                        value={content.stats?.partners?.label || ''}
                        onChange={(e) => updateContent('stats.partners.label', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                        placeholder="Partner Organisations"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'specialisms':
        return (
          <div className="space-y-6">
            {/* Hero Section */}
            <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Hero Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.hero?.title || ''}
                    onChange={(e) => updateContent('hero.title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="Life Sciences Specialisations"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <textarea
                    value={content.hero?.subtitle || ''}
                    onChange={(e) => updateContent('hero.subtitle', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="Discover Our Specialised Recruitment Expertise..."
                  />
                </div>
              </div>
            </div>

            {/* Capabilities Section */}
            <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Capabilities Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.capabilities?.title || ''}
                    onChange={(e) => updateContent('capabilities.title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="Our recruitment expertise"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <textarea
                    value={content.capabilities?.subtitle || ''}
                    onChange={(e) => updateContent('capabilities.subtitle', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="Delivering specialised talent solutions..."
                  />
                </div>
              </div>
            </div>

            {/* Process Section */}
            <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Process/Timeline Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.process?.title || ''}
                    onChange={(e) => updateContent('process.title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="Recruitment process timeline"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <textarea
                    value={content.process?.subtitle || ''}
                    onChange={(e) => updateContent('process.subtitle', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="A structured 7-step methodology..."
                  />
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">FAQ Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.faq?.title || ''}
                    onChange={(e) => updateContent('faq.title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="Frequently asked questions"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <textarea
                    value={content.faq?.subtitle || ''}
                    onChange={(e) => updateContent('faq.subtitle', e.target.value)}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="Common questions about our specialised recruitment process..."
                  />
                </div>
                
                {/* FAQ Items */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">FAQ Items</label>
                  <div className="space-y-4">
                    {(content.faq?.items || []).map((faq, index) => (
                      <div key={index} className="p-4 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-medium text-gray-900">FAQ #{index + 1}</h4>
                          {content.faq?.items?.length > 1 && (
                            <button
                              onClick={() => {
                                const newItems = [...(content.faq?.items || [])];
                                newItems.splice(index, 1);
                                updateContent('faq.items', newItems);
                              }}
                              className="text-red-600 hover:text-red-700 text-xs"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Question</label>
                            <input
                              type="text"
                              value={faq.question || ''}
                              onChange={(e) => {
                                const newItems = [...(content.faq?.items || [])];
                                newItems[index] = { ...newItems[index], question: e.target.value };
                                updateContent('faq.items', newItems);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent text-sm"
                              placeholder="Enter question..."
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Answer</label>
                            <textarea
                              value={faq.answer || ''}
                              onChange={(e) => {
                                const newItems = [...(content.faq?.items || [])];
                                newItems[index] = { ...newItems[index], answer: e.target.value };
                                updateContent('faq.items', newItems);
                              }}
                    rows="3"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent text-sm"
                              placeholder="Enter answer..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newItems = [...(content.faq?.items || []), { question: '', answer: '' }];
                        updateContent('faq.items', newItems);
                      }}
                      className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      + Add FAQ Item
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Call to Action Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title (use \n for line breaks)</label>
                  <textarea
                    value={content.cta?.title || ''}
                    onChange={(e) => updateContent('cta.title', e.target.value)}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="Start your recruitment journey today"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <textarea
                    value={content.cta?.subtitle || ''}
                    onChange={(e) => updateContent('cta.subtitle', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="Get in touch with our specialised recruitment team..."
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'jobs':
        return (
          <div className="bg-white rounded-lg p-8 text-center">
            <div className="max-w-md mx-auto">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Jobs Page Content is Read-Only</h3>
              <p className="text-gray-600">
                The Jobs page content is managed through the Job Board section. You can add, edit, and manage job listings there.
              </p>
            </div>
          </div>
        );

      case 'employers':
        return (
          <div className="space-y-6">
            {/* Hero Section */}
            <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Hero Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.hero?.title || ''}
                    onChange={(e) => updateContent('hero.title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="Hire Biometrics & Data Talent, Fast"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <textarea
                    value={content.hero?.subtitle || ''}
                    onChange={(e) => updateContent('hero.subtitle', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="Access pre-vetted specialists..."
                  />
                </div>
              </div>
            </div>

            {/* Services/USP Section */}
            <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Services/USP Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.services?.title || ''}
                    onChange={(e) => updateContent('services.title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="Why Leading Companies Choose Us"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <textarea
                    value={content.services?.subtitle || ''}
                    onChange={(e) => updateContent('services.subtitle', e.target.value)}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="Specialised recruitment that delivers..."
                  />
                </div>
              </div>
            </div>

            {/* Process Section */}
            <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Process Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.process?.title || ''}
                    onChange={(e) => updateContent('process.title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="How We Deliver Exceptional Results"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <textarea
                    value={content.process?.subtitle || ''}
                    onChange={(e) => updateContent('process.subtitle', e.target.value)}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="Detailed process with guaranteed SLAs..."
                  />
                </div>
              </div>
            </div>

            {/* Locations Section */}
            <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Locations Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.locations?.title || ''}
                    onChange={(e) => updateContent('locations.title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="Coverage Across Key Markets"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <textarea
                    value={content.locations?.subtitle || ''}
                    onChange={(e) => updateContent('locations.subtitle', e.target.value)}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="Strategic presence in major life-sciences hubs..."
                  />
                </div>
              </div>
            </div>

            {/* Testimonials Section */}
            <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Testimonials Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.testimonials?.title || ''}
                    onChange={(e) => updateContent('testimonials.title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="What our clients say"
                  />
                </div>
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-gray-700 mb-3">
                    <strong>Note:</strong> Testimonials are managed through the dedicated Testimonials tab in the sidebar.
                  </p>
                  <button
                    onClick={() => navigate('/admin/testimonials')}
                    className="bg-brand-blue hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                  >
                    <span>Go to Testimonials Manager</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Get Started CTA Section */}
            <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Get Started CTA Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.getStartedCta?.title || ''}
                    onChange={(e) => updateContent('getStartedCta.title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="Tell us about your hiring needs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <textarea
                    value={content.getStartedCta?.subtitle || ''}
                    onChange={(e) => updateContent('getStartedCta.subtitle', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="Submit your requirements and we'll provide..."
                  />
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">FAQ Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.faq?.title || ''}
                    onChange={(e) => updateContent('faq.title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="Frequently asked questions"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <textarea
                    value={content.faq?.subtitle || ''}
                    onChange={(e) => updateContent('faq.subtitle', e.target.value)}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="Everything you need to know..."
                  />
                </div>
                
                {/* FAQ Items */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">FAQ Items</label>
                  <div className="space-y-4">
                    {(content.faq?.items || []).map((faq, index) => (
                      <div key={index} className="p-4 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-medium text-gray-900">FAQ #{index + 1}</h4>
                          {content.faq?.items?.length > 1 && (
                            <button
                              onClick={() => {
                                const newItems = [...(content.faq?.items || [])];
                                newItems.splice(index, 1);
                                updateContent('faq.items', newItems);
                              }}
                              className="text-red-600 hover:text-red-700 text-xs"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Question</label>
                            <input
                              type="text"
                              value={faq.question || ''}
                              onChange={(e) => {
                                const newItems = [...(content.faq?.items || [])];
                                newItems[index] = { ...newItems[index], question: e.target.value };
                                updateContent('faq.items', newItems);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent text-sm"
                              placeholder="Enter question..."
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Answer</label>
                            <textarea
                              value={faq.answer || ''}
                              onChange={(e) => {
                                const newItems = [...(content.faq?.items || [])];
                                newItems[index] = { ...newItems[index], answer: e.target.value };
                                updateContent('faq.items', newItems);
                              }}
                              rows="3"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent text-sm"
                              placeholder="Enter answer..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newItems = [...(content.faq?.items || []), { question: '', answer: '' }];
                        updateContent('faq.items', newItems);
                      }}
                      className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      + Add FAQ Item
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Final CTA Section */}
            <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Final CTA Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.finalCta?.title || ''}
                    onChange={(e) => updateContent('finalCta.title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="Ready to hire exceptional talent?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <textarea
                    value={content.finalCta?.subtitle || ''}
                    onChange={(e) => updateContent('finalCta.subtitle', e.target.value)}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="Join leading pharmaceutical and biotech companies..."
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
            <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Hero Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <textarea
                    value={content.hero?.title || ''}
                    onChange={(e) => updateContent('hero.title', e.target.value)}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="Your next role in\nbiometrics"
                  />
                  <p className="text-xs text-gray-500 mt-1">Use \n for line breaks</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <textarea
                    value={content.hero?.subtitle || ''}
                    onChange={(e) => updateContent('hero.subtitle', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="Connect with leading pharmaceutical..."
                  />
                </div>
              </div>
            </div>

            {/* Process Section */}
            <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Process Section (How It Works)</h3>
              <div className="space-y-4">
            <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.process?.title || ''}
                    onChange={(e) => updateContent('process.title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="How It Works"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <textarea
                    value={content.process?.subtitle || ''}
                    onChange={(e) => updateContent('process.subtitle', e.target.value)}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="Our comprehensive 9-step recruitment process..."
                  />
                </div>
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Note:</strong> The timeline steps are hardcoded in the component. To edit the process steps, please modify the code directly.
                  </p>
                </div>
              </div>
            </div>

            {/* Opportunities Section */}
            <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Featured Opportunities Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.opportunities?.title || ''}
                    onChange={(e) => updateContent('opportunities.title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="Featured opportunities"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <textarea
                    value={content.opportunities?.subtitle || ''}
                    onChange={(e) => updateContent('opportunities.subtitle', e.target.value)}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="Discover the latest roles from our partner organisations"
                  />
                </div>
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Note:</strong> Jobs are fetched dynamically from the database. To manage jobs, use the Job Board section.
                  </p>
                </div>
              </div>
            </div>

            {/* Salary Guide Section */}
            <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Salary Guide Section</h3>
              <div className="space-y-4">
            <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                  <input
                    type="text"
                    value={content.salaryGuide?.title || ''}
                    onChange={(e) => updateContent('salaryGuide.title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="Know your worth"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Section Subtitle</label>
                  <textarea
                    value={content.salaryGuide?.subtitle || ''}
                    onChange={(e) => updateContent('salaryGuide.subtitle', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="Access our comprehensive salary guides..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Card Title</label>
                  <input
                    type="text"
                    value={content.salaryGuide?.cardTitle || ''}
                    onChange={(e) => updateContent('salaryGuide.cardTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="2025 Life Sciences Salary Guide"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Card Description</label>
                  <textarea
                    value={content.salaryGuide?.cardDescription || ''}
                    onChange={(e) => updateContent('salaryGuide.cardDescription', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="Comprehensive data on salaries..."
                  />
                </div>
                
                {/* File Upload Section */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salary Guide Document (PDF/DOC/DOCX)
                  </label>
                  <div className="space-y-3">
                    {filePreview && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm text-green-800 font-medium">{filePreview}</span>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center space-x-3">
                      <label className="flex-1 cursor-pointer">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              handleFileUpload(file);
                            }
                          }}
                          disabled={uploadingFile}
                          className="hidden"
                        />
                        <div className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2">
                          {uploadingFile ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-blue"></div>
                              <span className="text-sm text-gray-700">Uploading...</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              <span className="text-sm text-gray-700 font-medium">
                                {filePreview ? 'Replace File' : 'Upload File'}
                              </span>
                            </>
                          )}
                        </div>
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">
                      Upload a PDF, DOC, or DOCX file. The file will be stored as "employee_doc" and will be downloadable from the "Download Free Guide" button.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Get Started CTA Section */}
            <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Get Started CTA Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.getStartedCta?.title || ''}
                    onChange={(e) => updateContent('getStartedCta.title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="Get started today"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <textarea
                    value={content.getStartedCta?.subtitle || ''}
                    onChange={(e) => updateContent('getStartedCta.subtitle', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="Submit your CV and preferences..."
                  />
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">FAQ Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.faq?.title || ''}
                    onChange={(e) => updateContent('faq.title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="Frequently asked questions"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <textarea
                    value={content.faq?.subtitle || ''}
                    onChange={(e) => updateContent('faq.subtitle', e.target.value)}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-white"
                    placeholder="Common questions from candidates..."
                  />
              </div>
                
                {/* FAQ Items */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">FAQ Items</label>
                  <div className="space-y-4">
                    {(content.faq?.items || []).map((faq, index) => (
                      <div key={index} className="p-4 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-medium text-gray-900">FAQ #{index + 1}</h4>
                          {content.faq?.items?.length > 1 && (
                            <button
                              onClick={() => {
                                const newItems = [...(content.faq?.items || [])];
                                newItems.splice(index, 1);
                                updateContent('faq.items', newItems);
                              }}
                              className="text-red-600 hover:text-red-700 text-xs"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Question</label>
                            <input
                              type="text"
                              value={faq.question || ''}
                              onChange={(e) => {
                                const newItems = [...(content.faq?.items || [])];
                                newItems[index] = { ...newItems[index], question: e.target.value };
                                updateContent('faq.items', newItems);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent text-sm"
                              placeholder="Enter question..."
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Answer</label>
                            <textarea
                              value={faq.answer || ''}
                              onChange={(e) => {
                                const newItems = [...(content.faq?.items || [])];
                                newItems[index] = { ...newItems[index], answer: e.target.value };
                                updateContent('faq.items', newItems);
                              }}
                              rows="3"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent text-sm"
                              placeholder="Enter answer..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newItems = [...(content.faq?.items || []), { question: '', answer: '' }];
                        updateContent('faq.items', newItems);
                      }}
                      className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      + Add FAQ Item
                    </button>
                  </div>
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

export default PageEditManager;

