import React from 'react';
import { useSEO } from '../hooks/useSEO';

const Terms = () => {
  // Set SEO metadata
  useSEO(
    'Terms and Conditions',
    'Terms and conditions for JCR Pharma Ltd. Learn about our recruitment services, candidate and client responsibilities, and legal terms governing the use of our website and services.'
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-brand-blue text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-light mb-6 leading-tight">
              Terms and Conditions
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
                  Welcome to JCR Pharma Ltd ("we," "our," or "us").
                </p>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  These Terms and Conditions ("Terms") govern your use of our website and the services we provide as a recruitment agency.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  By using our website or engaging with our recruitment services, you agree to these Terms. If you do not agree, please do not use our website or services.
                </p>
              </div>

              {/* Section 1: About Us */}
              <div className="mb-12">
                <h2 className="text-3xl font-light text-gray-900 mb-6">1. About Us</h2>
                <div className="text-gray-600 text-lg leading-relaxed space-y-4">
                  <p>
                    <strong>JCR Pharma Ltd</strong>
                  </p>
                  <p>Registered in England and Wales</p>
                  <p>Company Number: 14557994</p>
                  <p>Registered Office: 210 Shrub End Road, Colchester/ Essex, CO3 4RZ</p>
                  <p>Email: general@jcrpharma.co.uk</p>
                  <p>Website: www.jcrpharma.co.uk</p>
                  <p>
                    We operate as a recruitment and staffing agency providing services to candidates and employers worldwide.
                  </p>
                </div>
              </div>

              {/* Section 2: Our Services */}
              <div className="mb-12">
                <h2 className="text-3xl font-light text-gray-900 mb-6">2. Our Services</h2>
                <div className="text-gray-600 text-lg leading-relaxed space-y-4">
                  <p>We provide:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Candidate sourcing, screening, and placement</li>
                    <li>Recruitment consulting and talent acquisition services</li>
                    <li>Employment-related advice and support for clients and candidates</li>
                  </ul>
                  <p>
                    We act as an employment agency or employment business (as defined by the Employment Agencies Act 1973 and the Conduct of Employment Agencies and Employment Businesses Regulations 2003).
                  </p>
                  <p>
                    We do not guarantee employment to candidates or hiring success to clients. All placements are subject to separate agreements or contracts.
                  </p>
                </div>
              </div>

              {/* Section 3: Use of the Website */}
              <div className="mb-12">
                <h2 className="text-3xl font-light text-gray-900 mb-6">3. Use of the Website</h2>
                <div className="text-gray-600 text-lg leading-relaxed space-y-4">
                  <p>By accessing our website, you agree to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Use the website lawfully and not for any fraudulent or malicious activity</li>
                    <li>Provide accurate and truthful information when submitting forms or applications</li>
                    <li>Not attempt to gain unauthorised access to the website, its servers, or databases</li>
                    <li>Not reproduce, duplicate, copy, or resell any part of the website without permission</li>
                  </ul>
                  <p>
                    We reserve the right to suspend or terminate your access to the website if you breach these Terms.
                  </p>
                </div>
              </div>

              {/* Section 4: Candidate Responsibilities */}
              <div className="mb-12">
                <h2 className="text-3xl font-light text-gray-900 mb-6">4. Candidate Responsibilities</h2>
                <div className="text-gray-600 text-lg leading-relaxed space-y-4">
                  <p>Candidates who submit personal data, CVs, or applications confirm that:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>All information provided is accurate, current, and complete</li>
                    <li>They are legally entitled to work in the relevant jurisdictions</li>
                    <li>They understand their information may be shared with potential employers for recruitment purposes</li>
                  </ul>
                  <p>
                    We process candidate data in accordance with our Privacy Policy.
                  </p>
                  <p>
                    We are not responsible for the final hiring decisions made by clients.
                  </p>
                </div>
              </div>

              {/* Section 5: Client Responsibilities */}
              <div className="mb-12">
                <h2 className="text-3xl font-light text-gray-900 mb-6">5. Client Responsibilities</h2>
                <div className="text-gray-600 text-lg leading-relaxed space-y-4">
                  <p>Clients agree to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide accurate and lawful information regarding vacancies and hiring needs</li>
                    <li>Not unlawfully discriminate against candidates</li>
                    <li>Comply with all employment and data protection laws applicable in their jurisdiction</li>
                  </ul>
                  <p>
                    Separate terms may apply to clients through a Recruitment Services Agreement, which shall take precedence over these general Terms.
                  </p>
                </div>
              </div>

              {/* Section 6: Intellectual Property */}
              <div className="mb-12">
                <h2 className="text-3xl font-light text-gray-900 mb-6">6. Intellectual Property</h2>
                <div className="text-gray-600 text-lg leading-relaxed space-y-4">
                  <p>
                    All content on this website — including text, graphics, logos, images, and software — is owned or licensed by JCR Pharma Ltd
                  </p>
                  <p>
                    You may not copy, reproduce, distribute, or create derivative works from any part of this website without our express written consent.
                  </p>
                  <p>
                    Our name and logo may not be used in any way that implies endorsement without prior written approval.
                  </p>
                </div>
              </div>

              {/* Section 7: Confidentiality */}
              <div className="mb-12">
                <h2 className="text-3xl font-light text-gray-900 mb-6">7. Confidentiality</h2>
                <div className="text-gray-600 text-lg leading-relaxed space-y-4">
                  <p>
                    We treat all candidate and client information as confidential and will only share it where necessary to provide recruitment services or comply with legal obligations.
                  </p>
                  <p>
                    Both parties (us and the client/candidate) agree to maintain confidentiality of all non-public information obtained through our engagement.
                  </p>
                </div>
              </div>

              {/* Section 8: Liability */}
              <div className="mb-12">
                <h2 className="text-3xl font-light text-gray-900 mb-6">8. Liability</h2>
                <div className="text-gray-600 text-lg leading-relaxed space-y-4">
                  <p>We strive to ensure all information on our website is accurate and up to date; however:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>We make no warranties or representations about the accuracy, reliability, or completeness of information provided.</li>
                    <li>We are not liable for any loss, damage, or claim arising from use of our website or services, except where required by law.</li>
                    <li>Our total liability, in any case, shall not exceed the total amount paid by the client for our services (if applicable).</li>
                  </ul>
                  <p>
                    Nothing in these Terms limits liability for death or personal injury caused by negligence, fraud, or fraudulent misrepresentation.
                  </p>
                </div>
              </div>

              {/* Section 9: Third-Party Links */}
              <div className="mb-12">
                <h2 className="text-3xl font-light text-gray-900 mb-6">9. Third-Party Links</h2>
                <div className="text-gray-600 text-lg leading-relaxed space-y-4">
                  <p>
                    Our website may contain links to external sites operated by third parties.
                  </p>
                  <p>
                    We are not responsible for the content, privacy practices, or terms of use of those sites.
                  </p>
                  <p>
                    Visiting external links is at your own risk.
                  </p>
                </div>
              </div>

              {/* Section 10: Data Protection */}
              <div className="mb-12">
                <h2 className="text-3xl font-light text-gray-900 mb-6">10. Data Protection</h2>
                <div className="text-gray-600 text-lg leading-relaxed space-y-4">
                  <p>
                    We comply with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
                  </p>
                  <p>
                    For details on how we collect and use your personal information, please refer to our Privacy Policy.
                  </p>
                </div>
              </div>

              {/* Section 11: Termination */}
              <div className="mb-12">
                <h2 className="text-3xl font-light text-gray-900 mb-6">11. Termination</h2>
                <div className="text-gray-600 text-lg leading-relaxed space-y-4">
                  <p>
                    We may suspend or terminate your access to our website or services at any time, without notice, if we reasonably believe you have breached these Terms.
                  </p>
                </div>
              </div>

              {/* Section 12: Changes to These Terms */}
              <div className="mb-12">
                <h2 className="text-3xl font-light text-gray-900 mb-6">12. Changes to These Terms</h2>
                <div className="text-gray-600 text-lg leading-relaxed space-y-4">
                  <p>
                    We may update these Terms from time to time.
                  </p>
                  <p>
                    Any updates will take effect immediately upon being posted on our website, with an updated "Last Updated" date.
                  </p>
                </div>
              </div>

              {/* Section 13: Governing Law */}
              <div className="mb-12">
                <h2 className="text-3xl font-light text-gray-900 mb-6">13. Governing Law</h2>
                <div className="text-gray-600 text-lg leading-relaxed space-y-4">
                  <p>
                    These Terms are governed by and construed in accordance with the laws of England and Wales.
                  </p>
                  <p>
                    Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.
                  </p>
                </div>
              </div>

              {/* Section 14: Contact Us */}
              <div className="mb-12">
                <h2 className="text-3xl font-light text-gray-900 mb-6">14. Contact Us</h2>
                <div className="text-gray-600 text-lg leading-relaxed space-y-4">
                  <p>If you have any questions about these Terms, please contact us at:</p>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <p className="font-medium text-gray-900 mb-2">JCR Pharma Ltd</p>
                    <p>Email: <a href="mailto:general@jcrpharma.co.uk" className="text-brand-blue hover:underline">general@jcrpharma.co.uk</a></p>
                    <p>Address: 210 Shrub End Road, Colchester/ Essex, CO3 4RZ</p>
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

export default Terms;

