import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen">


      {/* Mission Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-gray-900">
                  Our Mission
                </h2>
                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                  JCR Pharma was founded to transform recruitment in the life-sciences sector. 
                  Moving away from outdated, transactional approaches, we operate as true partners 
                  to our clients and candidates. Our specialized focus on biometrics, biostatistics, 
                  and clinical data management is built on genuine consultation, integrity, and 
                  long-term relationship building.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  We believe recruitment should be honest and consultative, not pushy or disingenuous. 
                  Every client and candidate relationship is treated with respect, and we admit when 
                  we make mistakes — because we're human — while constantly striving to be better. 
                  JCR Pharma isn't just a business; it's a passion project dedicated to showing 
                  the market that recruitment can be done differently.
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
                    src="/mission.jpg" 
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
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-gray-900">
              Leadership Team
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Industry veterans with deep expertise in life-sciences recruitment and talent acquisition
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* James Carpenter */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
                  James Carpenter
                </h3>
                <p className="text-brand-blue font-medium mb-4">
                  Managing Director / Founder
                </p>
                <p className="text-gray-600 leading-relaxed mb-6">
                  At 30, James brings nine years of recruitment experience, including three specialized 
                  years in Biometrics. After graduating from the University of Hertfordshire with a 
                  degree in History, he began in graduate and Rec2Rec recruitment before transitioning 
                  to life sciences. James built Biometrics desks from scratch across multiple agencies, 
                  developing expertise in the European market. A former rugby player who retired to 
                  focus on his career, James founded JCR Pharma driven by a vision to transform 
                  recruitment through integrity, consultation, and genuine partnership rather than 
                  outdated transactional approaches.
                </p>
                <div className="flex justify-center space-x-4">
                  <a href="#" className="text-gray-400 hover:text-brand-blue transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-brand-blue transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Mathy Bekele */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-8 text-center">
                <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden relative">
                  {/* Loading skeleton */}
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
                  </div>
                  <img 
                    src="/mathy.png" 
                    alt="Mathy Bekele" 
                    className="w-full h-full object-cover relative z-10 opacity-0 transition-opacity duration-500"
                    loading="lazy"
                    decoding="async"
                    onLoad={(e) => {
                      e.target.style.opacity = '1';
                      e.target.previousElementSibling.style.display = 'none';
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.previousElementSibling.innerHTML = '<span class="text-3xl font-light text-brand-blue">MB</span>';
                      e.target.previousElementSibling.classList.remove('bg-gradient-to-r', 'from-gray-200', 'via-gray-100', 'to-gray-200', 'animate-pulse');
                      e.target.previousElementSibling.classList.add('bg-brand-blue/10');
                    }}
                  />
                </div>
                <h3 className="text-2xl font-medium text-gray-900 mb-2">
                  Mathy Bekele
                </h3>
                <p className="text-brand-blue font-medium mb-4">
                  Principal Consultant
                </p>
                <p className="text-gray-600 leading-relaxed mb-6">
                  With five years of specialized recruitment experience in the biometrics space within pharmaceuticals, 
                  Mathy began her career at Phaidon International before joining Veramed as an internal recruiter. 
                  During her three years at Veramed, she worked directly with statisticians and programmers, 
                  making numerous placements across biotech, pharmaceutical, and CRO organizations. Her deep 
                  understanding of the industry was further strengthened through attending key conferences like 
                  PhUSE in London. Mathy joined JCR in 2024, drawn by the company's people-first ethos and 
                  commitment to building long-term relationships. Based in Vienna, Austria, she focuses on 
                  providing exceptional service while supporting the biotech and pharmaceutical communities.
                </p>
                <div className="flex justify-center space-x-4">
                  <a href="#" className="text-gray-400 hover:text-brand-blue transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-brand-blue transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-gray-900">
              Our Values
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              The principles that guide our approach to life-sciences recruitment
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Excellence */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4 text-gray-900">Excellence</h3>
              <p className="text-gray-600 leading-relaxed">
                We maintain the highest standards in candidate assessment and client service, 
                ensuring exceptional quality in every placement.
              </p>
            </div>

            {/* Expertise */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4 text-gray-900">Expertise</h3>
              <p className="text-gray-600 leading-relaxed">
                Deep specialization in life-sciences domains enables us to understand 
                complex technical requirements and industry nuances.
              </p>
            </div>

            {/* Integrity */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4 text-gray-900">Integrity</h3>
              <p className="text-gray-600 leading-relaxed">
                Transparent communication and ethical practices build lasting relationships 
                with both candidates and clients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-gray-900">
              Our Impact
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Measurable results that demonstrate our commitment to excellence
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-light text-brand-blue mb-2">150+</div>
              <p className="text-gray-700 text-lg">Successful Placements</p>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-light text-brand-blue mb-2">14</div>
              <p className="text-gray-700 text-lg">Days Average Placement</p>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-light text-brand-blue mb-2">92%</div>
              <p className="text-gray-700 text-lg">Client Satisfaction Rate</p>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-light text-brand-blue mb-2">50+</div>
              <p className="text-gray-700 text-lg">Partner Organizations</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-blue py-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-white">
              Ready to work with us?
            </h2>
            <p className="text-gray-300 text-lg mb-12 max-w-3xl mx-auto leading-relaxed">
              Whether you're looking for exceptional talent or your next career opportunity, 
              we're here to help you succeed.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-brand-blue hover:bg-gray-100 px-8 py-3 rounded-full transition-all duration-300 font-medium text-lg">
                Hire Talent
              </button>
              <button className="text-white hover:bg-white/10 px-8 py-3 rounded-full transition-all duration-300 font-medium border border-white/30 text-lg">
                Find Jobs
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 