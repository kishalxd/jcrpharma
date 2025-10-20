import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Blog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchSingleBlog(id);
    } else {
      fetchBlogs();
    }
  }, [id]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blogs')
        .select('id, title, excerpt, author, cover_image, created_at, is_featured, feature_type, feature_order')
        .eq('is_archived', false) // Only show published blogs
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setError('Failed to load blog posts.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSingleBlog = async (blogId) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blogs')
        .select('id, title, content, excerpt, author, cover_image, created_at')
        .eq('id', blogId)
        .eq('is_archived', false)
        .single();

      if (error) throw error;
      setSelectedBlog(data);
    } catch (error) {
      console.error('Error fetching blog:', error);
      setError('Failed to load blog post.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleBlogClick = (blogId) => {
    navigate(`/blogs/${blogId}`);
  };

  const handleBackToBlogs = () => {
    navigate('/blogs');
  };

  // Helper functions for featured blogs
  const getFeaturedBlogs = () => {
    return blogs.filter(blog => blog.is_featured && blog.feature_type);
  };

  const getRegularBlogs = () => {
    return blogs.filter(blog => !blog.is_featured || !blog.feature_type);
  };

  const getMainFeaturedBlog = (featuredBlogs) => {
    return featuredBlogs
      .filter(blog => blog.feature_type === 'main')
      .sort((a, b) => (a.feature_order || 0) - (b.feature_order || 0))[0];
  };

  const getSubFeaturedBlogs = (featuredBlogs) => {
    return featuredBlogs
      .filter(blog => blog.feature_type === 'sub')
      .sort((a, b) => (a.feature_order || 0) - (b.feature_order || 0));
  };

  // Featured Blog Section Component
  const FeaturedBlogSection = ({ mainBlog, subBlogs }) => (
    <div className="mb-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Featured Blog */}
        {mainBlog && (
          <div className="lg:col-span-2">
            <article
              onClick={() => handleBlogClick(mainBlog.id)}
              className="cursor-pointer group bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full"
            >
              {/* Cover Image */}
              {mainBlog.cover_image ? (
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={mainBlog.cover_image}
                    alt={mainBlog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="aspect-video w-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              )}

              {/* Blog Info */}
              <div className="p-8 space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 group-hover:text-brand-blue transition-colors line-clamp-2">
                  {mainBlog.title}
                </h2>
                
                {mainBlog.excerpt && (
                  <p className="text-gray-600 leading-relaxed line-clamp-3">
                    {mainBlog.excerpt}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="font-medium">{mainBlog.author || 'Admin'}</span>
                  <span>{formatDate(mainBlog.created_at)}</span>
                </div>
              </div>
            </article>
          </div>
        )}

        {/* Sub Featured Blogs */}
        {subBlogs.length > 0 && (
          <div className="lg:col-span-1 space-y-6">
            {subBlogs.slice(0, 3).map((blog) => (
              <article
                key={blog.id}
                onClick={() => handleBlogClick(blog.id)}
                className="cursor-pointer group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                {/* Cover Image */}
                {blog.cover_image ? (
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={blog.cover_image}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="aspect-video w-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                )}

                {/* Blog Info */}
                <div className="p-4 space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-brand-blue transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{blog.author || 'Admin'}</span>
                    <span>{formatDate(blog.created_at)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Skeleton loader for blog list
  const BlogCardSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Cover Image Skeleton */}
      <div className="aspect-video w-full bg-gray-200 animate-pulse"></div>
      
      {/* Content Skeleton */}
      <div className="p-6 space-y-3">
        {/* Title Skeleton */}
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        </div>
        
        {/* Excerpt Skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
        </div>
        
        {/* Author and Date Skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  // Skeleton loader for single blog
  const SingleBlogSkeleton = () => (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back button skeleton */}
        <div className="h-6 bg-gray-200 rounded w-32 mb-8 animate-pulse"></div>

        {/* Cover Image Skeleton */}
        <div className="aspect-video w-full bg-gray-200 rounded-lg mb-8 animate-pulse"></div>

        {/* Blog Header Skeleton */}
        <div className="mb-8 space-y-4">
          <div className="space-y-3">
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
        </div>

        {/* Blog Content Skeleton */}
        <div className="space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    // Show skeleton for single blog if we have an ID
    if (id) {
      return <SingleBlogSkeleton />;
    }
    
    // Show skeleton for blog list
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Skeleton */}
          <div className="text-center mb-16">
            <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-48 mx-auto animate-pulse"></div>
          </div>

          {/* Blog Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Single blog view
  if (selectedBlog) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back button */}
          <button
            onClick={handleBackToBlogs}
            className="flex items-center text-gray-600 hover:text-brand-blue mb-8 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blogs
          </button>

          {/* Cover Image */}
          {selectedBlog.cover_image && (
            <div className="aspect-video w-full overflow-hidden rounded-lg mb-8">
              <img
                src={selectedBlog.cover_image}
                alt={selectedBlog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Blog Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{selectedBlog.title}</h1>
            <div className="flex items-center space-x-4 text-gray-600">
              <span>By {selectedBlog.author || 'Admin'}</span>
              <span>•</span>
              <span>{formatDate(selectedBlog.created_at)}</span>
            </div>
          </div>

          {/* Blog Content */}
          <div 
            className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
          />
        </div>
      </div>
    );
  }

  // Blog list view
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Insights & Perspectives
          </h1>
          <p className="text-lg text-gray-600">
            Life sciences recruitment expertise
          </p>
        </div>

        {/* Blog Content */}
        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts yet</h3>
            <p className="text-gray-600">Check back soon for new content!</p>
          </div>
        ) : (
          <>
            {/* Featured Blogs Section */}
            {(() => {
              const featuredBlogs = getFeaturedBlogs();
              const mainFeaturedBlog = getMainFeaturedBlog(featuredBlogs);
              const subFeaturedBlogs = getSubFeaturedBlogs(featuredBlogs);
              
              return (mainFeaturedBlog || subFeaturedBlogs.length > 0) ? (
                <FeaturedBlogSection 
                  mainBlog={mainFeaturedBlog} 
                  subBlogs={subFeaturedBlogs} 
                />
              ) : null;
            })()}

            {/* Regular Blog Cards */}
            {(() => {
              const regularBlogs = getRegularBlogs();
              return regularBlogs.length > 0 ? (
                <>
                  {/* Section divider if we have featured blogs */}
                  {(getMainFeaturedBlog(getFeaturedBlogs()) || getSubFeaturedBlogs(getFeaturedBlogs()).length > 0) && (
                    <div className="mb-12">
                      <h2 className="text-2xl font-bold text-gray-900 mb-8">More Articles</h2>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {regularBlogs.map((blog) => (
                      <article
                        key={blog.id}
                        onClick={() => handleBlogClick(blog.id)}
                        className="cursor-pointer group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                      >
                        {/* Cover Image */}
                        {blog.cover_image ? (
                          <div className="aspect-video w-full overflow-hidden">
                            <img
                              src={blog.cover_image}
                              alt={blog.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ) : (
                          <div className="aspect-video w-full bg-gray-100 flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                        )}

                        {/* Blog Info */}
                        <div className="p-6 space-y-3">
                          <h2 className="text-xl font-semibold text-gray-900 group-hover:text-brand-blue transition-colors line-clamp-2">
                            {blog.title}
                          </h2>
                          
                          {blog.excerpt && (
                            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                              {blog.excerpt}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>{blog.author || 'Admin'}</span>
                            <span>{formatDate(blog.created_at)}</span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </>
              ) : null;
            })()}
          </>
        )}
      </div>
    </div>
  );
};

export default Blog;
