import React from 'react';
import { useSEO } from '../hooks/useSEO';

const Cookies = () => {
  // Set SEO metadata
  useSEO(
    'Cookie Policy',
    'Cookie Policy for JCR Pharma Ltd. Learn how we use cookies and similar technologies on our website to improve your browsing experience and analyse website traffic.'
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-brand-blue text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-light mb-6 leading-tight">
              Cookie Policy
            </h1>
            <p className="text-gray-300 text-lg">
              Last updated: 03/11/2025
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              {/* Introduction */}
              <div className="mb-12">
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  This Cookie Policy explains how JCR Pharma Ltd ("we," "our," or "us") uses cookies and similar technologies when you visit our website at www.jcrpharma.co.uk ("Site").
                </p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  By using our Site, you consent to our use of cookies in accordance with this policy.
                </p>
              </div>

              {/* Section 1: What Are Cookies? */}
              <div className="mb-12">
                <h2 className="text-3xl font-light text-gray-900 mb-6">1. What Are Cookies?</h2>
                <div className="text-gray-600 text-lg leading-relaxed space-y-4">
                  <p>
                    Cookies are small text files stored on your device when you visit a website. They help improve your browsing experience, analyse website traffic, and enable certain site functionality.
                  </p>
                </div>
              </div>

              {/* Section 2: Types of Cookies We Use */}
              <div className="mb-12">
                <h2 className="text-3xl font-light text-gray-900 mb-6">2. Types of Cookies We Use</h2>
                <div className="text-gray-600 text-lg leading-relaxed space-y-4">
                  <p>We use the following types of cookies on our Site:</p>
                  
                  <div className="mt-6">
                    <h3 className="text-xl font-medium text-gray-900 mb-4">Essential Cookies</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Necessary for the website to function correctly.</li>
                      <li>Enable features like secure logins, form submissions, and session management.</li>
                    </ul>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-xl font-medium text-gray-900 mb-4">Performance & Analytics Cookies</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Collect anonymous information about how visitors use the Site.</li>
                      <li>Help us understand which pages are most popular and improve website performance.</li>
                      <li>May be provided by third-party analytics tools such as Google Analytics.</li>
                    </ul>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-xl font-medium text-gray-900 mb-4">Functional Cookies</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Remember your preferences (e.g., language or region).</li>
                      <li>Enhance usability and user experience.</li>
                    </ul>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-xl font-medium text-gray-900 mb-4">Advertising & Targeting Cookies</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Help deliver relevant ads and track advertising effectiveness.</li>
                      <li>May be placed by third-party advertising partners.</li>
                      <li>Only used with your consent.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Section 3: Third-Party Cookies */}
              <div className="mb-12">
                <h2 className="text-3xl font-light text-gray-900 mb-6">3. Third-Party Cookies</h2>
                <div className="text-gray-600 text-lg leading-relaxed space-y-4">
                  <p>
                    We may allow third-party providers to place cookies on our Site for analytics, social media integration, or advertising purposes.
                  </p>
                  <p>
                    We do not control these cookies. Please refer to the privacy policies of third-party providers for further information.
                  </p>
                </div>
              </div>

              {/* Section 4: Managing Cookies */}
              <div className="mb-12">
                <h2 className="text-3xl font-light text-gray-900 mb-6">4. Managing Cookies</h2>
                <div className="text-gray-600 text-lg leading-relaxed space-y-4">
                  <p>You can manage or disable cookies through your browser settings. Options include:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Viewing cookies stored on your device</li>
                    <li>Deleting specific cookies or all cookies</li>
                    <li>Blocking cookies from specific sites or all websites</li>
                  </ul>
                  <p>
                    <strong>Please note:</strong> disabling certain cookies may affect website functionality and user experience.
                  </p>
                </div>
              </div>

              {/* Section 5: Consent and Preferences */}
              <div className="mb-12">
                <h2 className="text-3xl font-light text-gray-900 mb-6">5. Consent and Preferences</h2>
                <div className="text-gray-600 text-lg leading-relaxed space-y-4">
                  <p>
                    Where required by law, we will request your consent to use cookies when you first visit our Site. You can update or withdraw your consent at any time by adjusting your browser settings or through our cookie management tools (if available).
                  </p>
                </div>
              </div>

              {/* Section 6: Updates to This Policy */}
              <div className="mb-12">
                <h2 className="text-3xl font-light text-gray-900 mb-6">6. Updates to This Policy</h2>
                <div className="text-gray-600 text-lg leading-relaxed space-y-4">
                  <p>
                    We may update this Cookie Policy from time to time. Any changes will be posted on this page with the updated "Last Updated" date.
                  </p>
                </div>
              </div>

              {/* Section 7: Contact Us */}
              <div className="mb-12">
                <h2 className="text-3xl font-light text-gray-900 mb-6">7. Contact Us</h2>
                <div className="text-gray-600 text-lg leading-relaxed space-y-4">
                  <p>If you have any questions about our use of cookies, please contact us:</p>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <p className="font-medium text-gray-900 mb-2">JCR Pharma Ltd</p>
                    <p>Email: <a href="mailto:general@jcrpharma.co.uk" className="text-brand-blue hover:underline">general@jcrpharma.co.uk</a></p>
                    <p>Website: <a href="https://www.jcrpharma.co.uk" className="text-brand-blue hover:underline">www.jcrpharma.co.uk</a></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cookies;

