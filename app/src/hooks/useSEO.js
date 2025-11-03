import { useEffect } from 'react';

/**
 * Custom hook for managing SEO metadata (title, meta description, and Twitter cards)
 * @param {string} title - Page title (will be appended with " | JCR Pharma")
 * @param {string} description - Meta description for SEO
 * @param {object} options - Optional Twitter card and Open Graph data
 * @param {string} options.image - Twitter card image URL (defaults to logo)
 * @param {string} options.twitterSite - Twitter handle (e.g., "@JCRPharma")
 */
export const useSEO = (title, description, options = {}) => {
  useEffect(() => {
    // Set document title
    if (title) {
      document.title = `${title} | JCR Pharma`;
    }

    // Update or create meta description tag
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    if (description) {
      metaDescription.setAttribute('content', description);
    }

    // Twitter Card Meta Tags
    const setTwitterMeta = (property, content) => {
      let meta = document.querySelector(`meta[name="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Twitter card type
    setTwitterMeta('twitter:card', 'summary_large_image');
    
    // Twitter site handle
    if (options.twitterSite) {
      setTwitterMeta('twitter:site', options.twitterSite);
    } else {
      setTwitterMeta('twitter:site', '@JCRPharma');
    }
    
    // Twitter title
    if (title) {
      setTwitterMeta('twitter:title', `${title} | JCR Pharma`);
    }
    
    // Twitter description
    if (description) {
      setTwitterMeta('twitter:description', description);
    }
    
    // Twitter image - use provided image or default to logo
    const imageUrl = options.image || `${window.location.origin}/jcr_logo.jpg`;
    setTwitterMeta('twitter:image', imageUrl);
    setTwitterMeta('twitter:image:alt', title ? `${title} - JCR Pharma` : 'JCR Pharma - Life Sciences Recruitment');

    // Open Graph Meta Tags (for better social sharing)
    const setOGMeta = (property, content) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    setOGMeta('og:type', 'website');
    setOGMeta('og:url', window.location.href);
    if (title) {
      setOGMeta('og:title', `${title} | JCR Pharma`);
    }
    if (description) {
      setOGMeta('og:description', description);
    }
    setOGMeta('og:image', imageUrl);
    setOGMeta('og:site_name', 'JCR Pharma');

    // Cleanup function to reset to default if needed
    return () => {
      // Optionally reset to default title on unmount
      // document.title = 'JCR Pharma';
    };
  }, [title, description, options.image, options.twitterSite]);
};

