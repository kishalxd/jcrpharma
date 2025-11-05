import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

/**
 * SEO Component using React Helmet
 * Provides Open Graph and Twitter Card meta tags for social sharing
 * 
 * @param {string} title - Page title (will be appended with " | JCR Pharma")
 * @param {string} description - Meta description for SEO and social sharing
 * @param {object} options - Optional SEO configuration
 * @param {string} options.image - Image URL for social sharing (defaults to twitter_card.png)
 * @param {string} options.url - Canonical URL (defaults to current location)
 * @param {string} options.type - OG type (defaults to 'website')
 */
const SEO = ({ 
  title, 
  description, 
  options = {} 
}) => {
  const location = useLocation();
  
  // Base URL for absolute paths
  const baseUrl = process.env.REACT_APP_SITE_URL || 'https://jcrpharma.co.uk';
  
  // Default values
  const defaultImage = '/twitter_card.png';
  const defaultTitle = 'JCR Pharma | Life Sciences Recruitment Specialists';
  const defaultDescription = 'Specialised recruitment for life sciences, biometrics & data professionals. Connect top talent with biotech and pharmaceutical companies across UK, USA, and Europe.';
  
  // Build absolute URLs
  const getAbsoluteUrl = (path) => {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
  };
  
  // Use provided values or defaults
  const pageTitle = title ? `${title} | JCR Pharma` : defaultTitle;
  const pageDescription = description || defaultDescription;
  const imageUrl = getAbsoluteUrl(options.image || defaultImage);
  const pageUrl = getAbsoluteUrl(options.url || location.pathname);
  const ogType = options.type || 'website';
  
  // Debug: Log SEO data (remove in production)
  React.useEffect(() => {
    console.log('SEO Component Rendered:', {
      pageTitle,
      pageDescription: pageDescription.substring(0, 50) + '...',
      imageUrl,
      pageUrl,
      ogType
    });
  }, [pageTitle, pageDescription, imageUrl, pageUrl, ogType]);
  
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={pageDescription} />
      <link rel="canonical" href={pageUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:secure_url" content={imageUrl} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={pageTitle} />
      <meta property="og:site_name" content="JCR Pharma" />
      <meta property="og:locale" content="en_GB" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@JCRPharma" />
      <meta name="twitter:creator" content="@JCRPharma" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={pageTitle} />
    </Helmet>
  );
};

export default SEO;

