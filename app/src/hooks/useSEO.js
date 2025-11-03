import { useEffect } from 'react';

/**
 * Custom hook for managing SEO metadata (title and meta description)
 * @param {string} title - Page title (will be appended with " | JCR Pharma")
 * @param {string} description - Meta description for SEO
 */
export const useSEO = (title, description) => {
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

    // Cleanup function to reset to default if needed
    return () => {
      // Optionally reset to default title on unmount
      // document.title = 'JCR Pharma';
    };
  }, [title, description]);
};

