import React from 'react';

/**
 * Component to inject JSON-LD structured data into the page
 * @param {Object} data - The structured data object to convert to JSON-LD
 */
export const StructuredData = ({ data }) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

/**
 * Generates Organization schema
 */
export const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "JCR Pharma",
    "legalName": "JCR Pharma Ltd",
    "url": "https://jcrpharma.co.uk",
    "logo": "https://jcrpharma.co.uk/jcr_logo.jpg",
    "description": "Specialised recruitment for life sciences, biometrics & data professionals. Connect top talent with biotech and pharmaceutical companies across UK, USA, and Europe.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "210 Shrub End Road",
      "addressLocality": "Colchester",
      "addressRegion": "Essex",
      "postalCode": "CO3 4RZ",
      "addressCountry": "GB"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "general@jcrpharma.co.uk",
      "contactType": "Customer Service"
    },
    "sameAs": [
      "https://www.linkedin.com/company/jcr-pharma/",
      "https://www.youtube.com/@JCRPharma",
      "https://twitter.com/JCRPharma"
    ],
    "foundingDate": "2020",
    "numberOfEmployees": {
      "@type": "QuantitativeValue",
      "value": "10-50"
    }
  };
};

/**
 * Generates Article schema for blog posts
 */
export const generateArticleSchema = (blog) => {
  const baseUrl = 'https://jcrpharma.co.uk';
  const blogSlug = blog.slug || blog.id;
  const blogUrl = `${baseUrl}/blog/${blogSlug}`;
  
  // Strip HTML from content for description
  const stripHTML = (html) => {
    if (!html) return '';
    // Client-side only - check if document exists
    if (typeof document !== 'undefined') {
      const tmp = document.createElement('DIV');
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || '';
    }
    // Fallback: simple regex-based stripping (for SSR)
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  };

  const description = blog.excerpt || stripHTML(blog.content || '').substring(0, 200);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": blog.title,
    "description": description,
    "image": blog.cover_image ? blog.cover_image : `${baseUrl}/jcr_logo.jpg`,
    "datePublished": blog.created_at,
    "dateModified": blog.updated_at || blog.created_at,
    "author": {
      "@type": "Person",
      "name": blog.author || "JCR Pharma",
      "url": baseUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "JCR Pharma",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/jcr_logo.jpg`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": blogUrl
    },
    "url": blogUrl
  };
};

/**
 * Generates BreadcrumbList schema
 * @param {Array} items - Array of {name, url} objects representing breadcrumb items
 */
export const generateBreadcrumbSchema = (items) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
};

/**
 * Helper function to generate breadcrumbs for a given path
 */
export const getBreadcrumbsForPath = (pathname) => {
  const baseUrl = 'https://jcrpharma.co.uk';
  const breadcrumbs = [
    { name: "Home", url: `${baseUrl}/` }
  ];

  const pathMap = {
    '/about': 'About Us',
    '/specialisms': 'Specialisms',
    '/jobs': 'Jobs',
    '/blogs': 'Blogs',
    '/blog': 'Blog',
    '/employers': 'Employers',
    '/candidates': 'Candidates',
    '/find-jobs': 'Find Jobs',
    '/hire-talent': 'Hire Talent',
    '/terms': 'Terms',
    '/privacy': 'Privacy',
    '/cookies': 'Cookies'
  };

  // Handle dynamic routes like /blog/:slug or /jobs/view/:id
  if (pathname.startsWith('/blog/')) {
    breadcrumbs.push(
      { name: 'Blogs', url: `${baseUrl}/blogs` },
      { name: 'Article', url: `${baseUrl}${pathname}` }
    );
  } else if (pathname.startsWith('/jobs/view/')) {
    breadcrumbs.push(
      { name: 'Jobs', url: `${baseUrl}/jobs` },
      { name: 'Job Details', url: `${baseUrl}${pathname}` }
    );
  } else if (pathname.startsWith('/jobs/apply/')) {
    breadcrumbs.push(
      { name: 'Jobs', url: `${baseUrl}/jobs` },
      { name: 'Apply', url: `${baseUrl}${pathname}` }
    );
  } else if (pathMap[pathname]) {
    breadcrumbs.push({
      name: pathMap[pathname],
      url: `${baseUrl}${pathname}`
    });
  }

  return breadcrumbs;
};

export default StructuredData;
