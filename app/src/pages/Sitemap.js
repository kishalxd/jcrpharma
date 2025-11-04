import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const Sitemap = () => {
  const [sitemapContent, setSitemapContent] = useState('');
  const baseUrl = 'https://jcrpharma.co.uk';
  const lastMod = '2025-11-04';

  useEffect(() => {
    const generateSitemap = async () => {
      try {
        // Fetch blogs
        const { data: blogs, error: blogsError } = await supabase
          .from('blogs')
          .select('id, slug, created_at, updated_at')
          .eq('is_archived', false)
          .order('created_at', { ascending: false });

        if (blogsError) {
          console.error('Error fetching blogs:', blogsError);
        }

        // Fetch active jobs
        const { data: jobs, error: jobsError } = await supabase
          .from('jobs')
          .select('id, created_at, updated_at')
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (jobsError) {
          console.error('Error fetching jobs:', jobsError);
        }

        // Generate XML
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        // Static pages
        const staticPages = [
          { path: '/', priority: '1.0', changefreq: 'weekly' },
          { path: '/about', priority: '0.8', changefreq: 'monthly' },
          { path: '/specialisms', priority: '0.8', changefreq: 'monthly' },
          { path: '/jobs', priority: '0.9', changefreq: 'daily' },
          { path: '/blogs', priority: '0.8', changefreq: 'weekly' },
          { path: '/employers', priority: '0.8', changefreq: 'monthly' },
          { path: '/candidates', priority: '0.8', changefreq: 'monthly' },
          { path: '/find-jobs', priority: '0.7', changefreq: 'monthly' },
          { path: '/hire-talent', priority: '0.7', changefreq: 'monthly' },
          { path: '/login', priority: '0.5', changefreq: 'yearly' },
          { path: '/register', priority: '0.5', changefreq: 'yearly' },
          { path: '/forgot-password', priority: '0.3', changefreq: 'yearly' },
          { path: '/terms', priority: '0.4', changefreq: 'yearly' },
          { path: '/privacy', priority: '0.4', changefreq: 'yearly' },
          { path: '/cookies', priority: '0.3', changefreq: 'yearly' },
        ];

        // Add static pages
        staticPages.forEach(page => {
          xml += '  <url>\n';
          xml += `    <loc>${baseUrl}${page.path}</loc>\n`;
          xml += `    <lastmod>${lastMod}</lastmod>\n`;
          xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
          xml += `    <priority>${page.priority}</priority>\n`;
          xml += '  </url>\n';
        });

        // Add blog posts
        if (blogs && blogs.length > 0) {
          blogs.forEach(blog => {
            const blogSlug = blog.slug || blog.id;
            const blogLastMod = blog.updated_at 
              ? new Date(blog.updated_at).toISOString().split('T')[0]
              : blog.created_at 
                ? new Date(blog.created_at).toISOString().split('T')[0]
                : lastMod;
            
            xml += '  <url>\n';
            xml += `    <loc>${baseUrl}/blog/${encodeURIComponent(blogSlug)}</loc>\n`;
            xml += `    <lastmod>${blogLastMod}</lastmod>\n`;
            xml += '    <changefreq>monthly</changefreq>\n';
            xml += '    <priority>0.7</priority>\n';
            xml += '  </url>\n';
          });
        }

        // Add job listings
        if (jobs && jobs.length > 0) {
          jobs.forEach(job => {
            const jobLastMod = job.updated_at 
              ? new Date(job.updated_at).toISOString().split('T')[0]
              : job.created_at 
                ? new Date(job.created_at).toISOString().split('T')[0]
                : lastMod;
            
            xml += '  <url>\n';
            xml += `    <loc>${baseUrl}/jobs/view/${job.id}</loc>\n`;
            xml += `    <lastmod>${jobLastMod}</lastmod>\n`;
            xml += '    <changefreq>weekly</changefreq>\n';
            xml += '    <priority>0.8</priority>\n';
            xml += '  </url>\n';
          });
        }

        xml += '</urlset>';

        setSitemapContent(xml);
      } catch (error) {
        console.error('Error generating sitemap:', error);
        // Fallback to basic sitemap
        const fallback = generateFallbackSitemap();
        setSitemapContent(fallback);
      }
    };

    generateSitemap();
  }, []);

  const generateFallbackSitemap = () => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    const staticPages = [
      { path: '/', priority: '1.0', changefreq: 'weekly' },
      { path: '/about', priority: '0.8', changefreq: 'monthly' },
      { path: '/specialisms', priority: '0.8', changefreq: 'monthly' },
      { path: '/jobs', priority: '0.9', changefreq: 'daily' },
      { path: '/blogs', priority: '0.8', changefreq: 'weekly' },
      { path: '/employers', priority: '0.8', changefreq: 'monthly' },
      { path: '/candidates', priority: '0.8', changefreq: 'monthly' },
      { path: '/find-jobs', priority: '0.7', changefreq: 'monthly' },
      { path: '/hire-talent', priority: '0.7', changefreq: 'monthly' },
      { path: '/login', priority: '0.5', changefreq: 'yearly' },
      { path: '/register', priority: '0.5', changefreq: 'yearly' },
      { path: '/forgot-password', priority: '0.3', changefreq: 'yearly' },
      { path: '/terms', priority: '0.4', changefreq: 'yearly' },
      { path: '/privacy', priority: '0.4', changefreq: 'yearly' },
      { path: '/cookies', priority: '0.3', changefreq: 'yearly' },
    ];

    staticPages.forEach(page => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}${page.path}</loc>\n`;
      xml += `    <lastmod>${lastMod}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += '  </url>\n';
    });

    xml += '</urlset>';
    return xml;
  };

  // Return XML content
  // Note: For proper SEO, you may need to configure your server/hosting
  // to serve /sitemap.xml with Content-Type: application/xml header
  if (!sitemapContent) {
    return (
      <div style={{ padding: '20px', fontFamily: 'monospace' }}>
        Generating sitemap...
      </div>
    );
  }

  // Render XML as plain text (will be visible in browser)
  // For production, consider using a server-side solution or static generation
  return (
    <pre style={{ 
      whiteSpace: 'pre-wrap', 
      wordWrap: 'break-word', 
      margin: 0, 
      padding: '20px',
      fontFamily: 'monospace',
      fontSize: '12px',
      backgroundColor: '#f5f5f5'
    }}>
      {sitemapContent}
    </pre>
  );
};

export default Sitemap;
