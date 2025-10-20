import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import BlogEditor from './BlogEditor';
import BlogList from './BlogList';

const BlogManager = () => {
  const [activeView, setActiveView] = useState('list'); // 'list', 'create', 'edit'
  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blogs')
        .select('id, title, content, excerpt, author, cover_image, is_archived, is_featured, feature_type, feature_order, blog_group, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setError('Failed to fetch blogs. Please check if the blogs table exists in Supabase.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBlog = () => {
    setEditingBlog(null);
    setActiveView('create');
  };

  const handleEditBlog = (blog) => {
    setEditingBlog(blog);
    setActiveView('edit');
  };

  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', blogId);

      if (error) throw error;
      
      setBlogs(blogs.filter(blog => blog.id !== blogId));
      alert('Blog deleted successfully!');
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog. Please try again.');
    }
  };

  const handleArchiveBlog = async (blogId, isArchived) => {
    try {
      const { error } = await supabase
        .from('blogs')
        .update({ is_archived: !isArchived })
        .eq('id', blogId);

      if (error) throw error;
      
      setBlogs(blogs.map(blog => 
        blog.id === blogId 
          ? { ...blog, is_archived: !isArchived }
          : blog
      ));
    } catch (error) {
      console.error('Error archiving blog:', error);
      alert('Failed to archive blog. Please try again.');
    }
  };

  const handleSaveBlog = async (blogData) => {
    try {
      let result;
      
      if (editingBlog) {
        // Update existing blog
        result = await supabase
          .from('blogs')
          .update({
            ...blogData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingBlog.id)
          .select();
      } else {
        // Create new blog
        result = await supabase
          .from('blogs')
          .insert([{
            ...blogData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_archived: false
          }])
          .select();
      }

      if (result.error) throw result.error;

      await fetchBlogs(); // Refresh the list
      setActiveView('list');
      setEditingBlog(null);
      alert(`Blog ${editingBlog ? 'updated' : 'created'} successfully!`);
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Failed to save blog. Please try again.');
    }
  };

  const handleBackToList = () => {
    setActiveView('list');
    setEditingBlog(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blogs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-red-800 font-medium">Database Error</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <p className="text-red-600 text-sm mt-2">
              Please create a 'blogs' table in your Supabase database with the following columns:
              <br />• id (uuid, primary key)
              <br />• title (text)
              <br />• content (text)
              <br />• excerpt (text)
              <br />• author (text)
              <br />• is_archived (boolean, default false)
              <br />• created_at (timestamp)
              <br />• updated_at (timestamp)
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If we're in editor mode, render only the editor (it's full-page)
  if (activeView === 'create' || activeView === 'edit') {
    return (
      <BlogEditor
        blog={editingBlog}
        onSave={handleSaveBlog}
        onCancel={handleBackToList}
        isEditing={activeView === 'edit'}
      />
    );
  }

  // Otherwise render the blog list
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Blog Management</h2>
          <p className="text-gray-600 mt-1">Create, edit, and manage your blog posts</p>
        </div>
        <button
          onClick={handleCreateBlog}
          className="bg-brand-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>New Blog Post</span>
        </button>
      </div>
      
      <BlogList
        blogs={blogs}
        onEdit={handleEditBlog}
        onDelete={handleDeleteBlog}
        onArchive={handleArchiveBlog}
        onUpdate={fetchBlogs}
        setBlogData={setBlogs}
      />
    </div>
  );
};

export default BlogManager;
