import React from 'react';
import { useSEO } from '../hooks/useSEO';

const Privacy = () => {
  // Set SEO metadata
  useSEO(
    'Privacy Policy',
    'Privacy Policy for JCR Pharma Ltd. Learn how we collect, use, and protect your personal information in compliance with UK GDPR and data protection laws.'
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-brand-blue text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-light mb-6 leading-tight">
              Privacy Policy
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
                  This Privacy Policy describes how JCR Pharma Ltd ("we," "our," or "us") collects, uses, and protects the personal information of candidates, clients, and website visitors.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  We are committed to protecting your privacy and complying with the UK General Data Protection Regulation (UK GDPR), the Data Protection Act 2018, and other applicable privacy laws.
                </p>
              </div>

              {/* Section 1: Who We Are */}
              <div className="mb-12">
                <h2 className="text-3xl font-light text-gray-900 mb-6">1. Who We Are</h2>
                <div className="text-gray-600 text-lg leading-relaxed space-y-4">
                  <p>
                    JCR Pharma Ltd is a recruitment and staffing agency based in the United Kingdom that provides recruitment services to clients and candidates globally.
                  </p>
                  <p>Registered office: 210 Shrub End Road, Colchester/ Essex, CO3 4RZ</p>
                  <p>Email: general@jcrpharma.co.uk</p>
                  <p>Website: www.jcrpharma.co.uk</p>
                  <p>
                    We act as a data controller when collecting and processing personal information about candidates, clients, and users of our website.
                  </p>
                </div>
              </div>

              {/* Section 2: Information We Collect */}
              <div className="mb-12">
                <h2 className="text-3xl font-light text-gray-900 mb-6">2. Information We Collect</h2>
                <div className="text-gray-600 text-lg leading-relaxed space-y-4">
                  <p>
                    We collect, store, and use the following categories of personal data, depending on your relationship with us:
                  </p>
                  
                  <div className="mt-6">
                    <h3 className="text-xl font-medium text-gray-900 mb-4">Candidates</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Full name, address, contact details (email, phone number)</li>
                      <li>Curriculum Vitae (CV), employment history, education, and qualifications</li>
                      <li>Identification documents (e.g., passport, right-to-work documents)</li>
                      <li>Professional references</li>
                      <li>Salary expectations, notice period, and job preferences</li>
                      <li>Sensitive personal data (e.g., health or diversity information) — only where relevant and with your explicit consent</li>
                    </ul>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-xl font-medium text-gray-900 mb-4">Clients / Business Contacts</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Name, job title, and contact details</li>
                      <li>Company information and communication history</li>
                      <li>Billing and payment information</li>
                    </ul>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-xl font-medium text-gray-900 mb-4">Website Users</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Information collected automatically through cookies and analytics tools (e.g., IP address, browser type, pages visited)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Section 3: How We Use Your Information */}
              <div className="mb-12">
                <h2 className="text-3xl font-light text-gray-900 mb-6">3. How We Use Your Information</h2>
                <div className="text-gray-600 text-lg leading-relaxed space-y-4">
                  <p>We process your personal data for the following purposes:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>To provide recruitment and staffing services</li>
                    <li>To assess suitability for roles and match candidates with opportunities</li>
                    <li>To contact you about potential roles, assignments, or services</li>
                    <li>To communicate with clients and manage business relationships</li>
                    <li>To comply with legal and regulatory obligations</li>
                    <li>To improve our website and services</li>
                    <li>To send relevant updates or marketing communications (with your consent)</li>
                  </ul>
                </div>
              </div>

              {/* Section 4: Lawful Basis for Processing */}
              <div className="mb-12">
                <h2 className="text-3xl font-light text-gray-900 mb-6">4. Lawful Basis for Processing</h2>
                <div className="text-gray-600 text-lg leading-relaxed space-y-4">
                  <p>
                    Under the UK GDPR, we rely on one or more of the following lawful bases to process personal data:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Consent</strong> – where you have agreed to us processing your data (e.g., when submitting your CV).</li>
                    <li><strong>Contract</strong> – to perform our contractual obligations or take steps prior to entering a contract.</li>
                    <li><strong>Legal obligation</strong> – to comply with laws (e.g., right-to-work checks).</li>
                    <li><strong>Legitimate interests</strong> – to provide our recruitment services and maintain business relationships.</li>
                  </ul>
                </div>
              </div>

              {/* Section 5: Sharing of Information */}
              <div className="mb-12">
                <h2 className="text-3xl font-light text-gray-900 mb-6">5. Sharing of Information</h2>
                <div className="text-gray-600 text-lg leading-relaxed space-y-4">
                  <p>We may share your information with:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Clients and prospective employers (for job placement purposes)</li>
                    <li>Third-party service providers (e.g., IT support, payroll, cloud storage, background checks)</li>
                    <li>Legal or regulatory authorities when required by law</li>
                    <li>Business partners or subcontractors assisting with recruitment services</li>
                  </ul>
                  <p>
                    We do not sell or rent your personal data to third parties.
                  </p>
                </div>
              </div>

              {/* Section 6: International Data Transfers */}
              <div className="mb-12">
                <h2 className="text-3xl font-light text-gray-900 mb-6">6. International Data Transfers</h2>
                <div className="text-gray-600 text-lg leading-relaxed space-y-4">
                  <p>
                    As we recruit globally, your information may be transferred to and processed in countries outside the UK.
                  </p>
                  <p>
                    Where this occurs, we ensure appropriate safeguards (such as Standard Contractual Clauses) are in place to protect your data in line with UK GDPR requirements.
                  </p>
                </div>
              </div>

              {/* Section 7: Data Retention */}
              <div className="mb-12">
                <h2 className="text-3xl font-light text-gray-900 mb-6">7. Data Retention</h2>
                <div className="text-gray-600 text-lg leading-relaxed space-y-4">
                  <p>
                    We keep personal data only as long as necessary to fulfil the purposes outlined above or to comply with legal obligations.
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Candidate data:</strong> typically retained for up to 2 years after our last contact, unless you request deletion sooner.</li>
                    <li><strong>Client and business contact data:</strong> retained as long as the business relationship remains active.</li>
                  </ul>
                  <p>
                    You may request deletion of your data at any time (see Section 10).
                  </p>
                </div>
              </div>

              {/* Section 8: Security of Your Information */}
              <div className="mb-12">
                <h2 className="text-3xl font-light text-gray-900 mb-6">8. Security of Your Information</h2>
                <div className="text-gray-600 text-lg leading-relaxed space-y-4">
                  <p>
                    We use appropriate technical and organisational measures to safeguard your personal information against unauthorised access, alteration, or loss.
                  </p>
                  <p>
                    Despite our efforts, no method of online transmission or storage is 100% secure.
                  </p>
                </div>
              </div>

              {/* Section 9: Your Rights */}
              <div className="mb-12">
                <h2 className="text-3xl font-light text-gray-900 mb-6">9. Your Rights</h2>
                <div className="text-gray-600 text-lg leading-relaxed space-y-4">
                  <p>
                    Under the UK GDPR, you have the following rights:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Access</strong> – to request a copy of the personal data we hold about you.</li>
                    <li><strong>Rectification</strong> – to correct inaccurate or incomplete data.</li>
                    <li><strong>Erasure</strong> – to request deletion of your data ("right to be forgotten").</li>
                    <li><strong>Restriction</strong> – to limit processing in certain circumstances.</li>
                    <li><strong>Data portability</strong> – to request transfer of your data to another controller.</li>
                    <li><strong>Objection</strong> – to object to processing based on legitimate interests or for marketing purposes.</li>
                    <li><strong>Withdraw consent</strong> – where processing is based on consent.</li>
                  </ul>
                  <p>
                    To exercise these rights, contact us at <a href="mailto:general@jcrpharma.co.uk" className="text-brand-blue hover:underline">general@jcrpharma.co.uk</a>.
                  </p>
                </div>
              </div>

              {/* Section 10: Cookies and Tracking Technologies */}
              <div className="mb-12">
                <h2 className="text-3xl font-light text-gray-900 mb-6">10. Cookies and Tracking Technologies</h2>
                <div className="text-gray-600 text-lg leading-relaxed space-y-4">
                  <p>
                    We use cookies and similar technologies to improve your browsing experience and analyse website traffic.
                  </p>
                  <p>
                    You can manage or disable cookies through your browser settings.
                  </p>
                  <p>
                    For more information, please refer to our Cookie Policy (if available).
                  </p>
                </div>
              </div>

              {/* Section 11: Marketing Communications */}
              <div className="mb-12">
                <h2 className="text-3xl font-light text-gray-900 mb-6">11. Marketing Communications</h2>
                <div className="text-gray-600 text-lg leading-relaxed space-y-4">
                  <p>
                    We may send you information about job opportunities, events, or news related to our services.
                  </p>
                  <p>
                    You can opt out of marketing communications at any time by clicking "unsubscribe" or contacting us directly.
                  </p>
                </div>
              </div>

              {/* Section 12: Changes to This Policy */}
              <div className="mb-12">
                <h2 className="text-3xl font-light text-gray-900 mb-6">12. Changes to This Policy</h2>
                <div className="text-gray-600 text-lg leading-relaxed space-y-4">
                  <p>
                    We may update this Privacy Policy periodically.
                  </p>
                  <p>
                    Any changes will be posted on this page with an updated "Last Updated" date.
                  </p>
                </div>
              </div>

              {/* Section 13: Contact Us */}
              <div className="mb-12">
                <h2 className="text-3xl font-light text-gray-900 mb-6">13. Contact Us</h2>
                <div className="text-gray-600 text-lg leading-relaxed space-y-4">
                  <p>If you have questions about this Privacy Policy or wish to exercise your data rights, please contact us at:</p>
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

export default Privacy;

