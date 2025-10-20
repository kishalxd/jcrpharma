import React, { useState, useEffect } from 'react';
import RichTextEditor from './RichTextEditor';
import { supabase } from '../supabaseClient';

const BlogEditor = ({ blog, onSave, onCancel, isEditing }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    author: 'Admin',
    is_archived: false,
    cover_image: '',
    is_featured: false,
    feature_type: null,
    feature_order: null,
    blog_group: ''
  });
  const [blogGroups, setBlogGroups] = useState([]);
  const [showNewGroupForm, setShowNewGroupForm] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', description: '', color: '#3B82F6' });
  const [saving, setSaving] = useState(false);
  const [saveType, setSaveType] = useState(''); // 'save' or 'publish'

  useEffect(() => {
    fetchBlogGroups();
    if (blog) {
      setFormData({
        title: blog.title || '',
        content: blog.content || '',
        excerpt: blog.excerpt || '',
        author: blog.author || 'Admin',
        is_archived: blog.is_archived || false,
        cover_image: blog.cover_image || '',
        is_featured: blog.is_featured || false,
        feature_type: blog.feature_type || null,
        feature_order: blog.feature_order || null,
        blog_group: blog.blog_group || ''
      });
    }
  }, [blog]);

  const fetchBlogGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_groups')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setBlogGroups(data || []);
    } catch (error) {
      console.error('Error fetching blog groups:', error);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async (type) => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in both title and content fields.');
      return;
    }

    setSaving(true);
    setSaveType(type);
    
    try {
      const dataToSave = {
        ...formData,
        is_archived: type === 'save' ? true : false // Save as draft = archived
      };
      await onSave(dataToSave);
    } catch (error) {
      console.error('Error saving blog:', error);
    } finally {
      setSaving(false);
      setSaveType('');
    }
  };

  const generateExcerpt = () => {
    if (formData.content.length > 0) {
      const excerpt = formData.content
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .substring(0, 150) + '...';
      handleChange('excerpt', excerpt);
    }
  };

  const handleCoverImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          handleChange('cover_image', e.target.result);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const removeCoverImage = () => {
    handleChange('cover_image', '');
  };

  const handleCreateGroup = async () => {
    if (!newGroup.name.trim()) {
      alert('Please enter a group name');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('blog_groups')
        .insert([newGroup])
        .select();

      if (error) throw error;
      
      setBlogGroups([...blogGroups, ...data]);
      setNewGroup({ name: '', description: '', color: '#3B82F6' });
      setShowNewGroupForm(false);
      handleChange('blog_group', data[0].name);
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Failed to create group. Please try again.');
    }
  };

  const handleFeatureChange = (isChecked) => {
    if (isChecked) {
      handleChange('is_featured', true);
      handleChange('feature_type', 'main'); // Default to main
      handleChange('feature_order', null);
    } else {
      handleChange('is_featured', false);
      handleChange('feature_type', null);
      handleChange('feature_order', null);
    }
  };

  const handleFeatureTypeChange = (type) => {
    handleChange('feature_type', type);
    if (type === 'main') {
      handleChange('feature_order', null);
    } else if (type === 'sub') {
      handleChange('feature_order', 1); // Default to first sub-featured
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-4">
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              {isEditing ? 'Edit Blog Post' : 'New Blog Post'}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleSave('save')}
            disabled={saving}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
          >
            {saving && saveType === 'save' ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                <span>Saving...</span>
              </div>
            ) : (
              'Save Draft'
            )}
          </button>
          <button
            onClick={() => handleSave('publish')}
            disabled={saving}
            className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
          >
            {saving && saveType === 'publish' ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Publishing...</span>
              </div>
            ) : (
              isEditing ? 'Update & Publish' : 'Publish'
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Blog Setup */}
        <div className="w-80 bg-gray-50 border-r border-gray-200 p-6 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Blog Setup</h3>
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image
              </label>
              {formData.cover_image ? (
                <div className="relative">
                  <img
                    src={formData.cover_image}
                    alt="Cover preview"
                    className="w-full h-32 object-cover rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={removeCoverImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    title="Remove cover image"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleCoverImageUpload}
                  className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-gray-400 transition-colors"
                >
                  <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="text-sm text-gray-500">Upload cover image</span>
                </button>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Recommended: 1200x630px for best results
              </p>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none text-sm"
                placeholder="Enter blog title..."
              />
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => handleChange('author', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none text-sm"
                placeholder="Author name..."
              />
            </div>

            {/* Excerpt */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Excerpt
                </label>
                <button
                  type="button"
                  onClick={generateExcerpt}
                  className="text-xs text-brand-blue hover:text-blue-700 font-medium"
                >
                  Auto-generate
                </button>
              </div>
              <textarea
                value={formData.excerpt}
                onChange={(e) => handleChange('excerpt', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none text-sm resize-none"
                rows="4"
                placeholder="Brief description..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Shown in previews and search results
              </p>
            </div>

            {/* Blog Group */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blog Group
              </label>
              <div className="space-y-2">
                <select
                  value={formData.blog_group}
                  onChange={(e) => handleChange('blog_group', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none text-sm"
                >
                  <option value="">No Group</option>
                  {blogGroups.map((group) => (
                    <option key={group.id} value={group.name}>
                      {group.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewGroupForm(!showNewGroupForm)}
                  className="text-xs text-brand-blue hover:text-blue-700 font-medium"
                >
                  + Create New Group
                </button>
              </div>

              {showNewGroupForm && (
                <div className="mt-3 p-3 border border-gray-200 rounded-lg bg-gray-50 space-y-2">
                  <input
                    type="text"
                    placeholder="Group name"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Description (optional)"
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={newGroup.color}
                      onChange={(e) => setNewGroup({...newGroup, color: e.target.value})}
                      className="w-8 h-6 border border-gray-300 rounded"
                    />
                    <span className="text-xs text-gray-600">Group color</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={handleCreateGroup}
                      className="px-2 py-1 bg-brand-blue text-white rounded text-xs hover:bg-blue-700"
                    >
                      Create
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewGroupForm(false)}
                      className="px-2 py-1 border border-gray-300 text-gray-600 rounded text-xs hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Featured Blog */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Featured Blog
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => handleFeatureChange(e.target.checked)}
                    className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                  />
                  <span className="ml-2 text-sm text-gray-600">Feature this blog</span>
                </label>

                {formData.is_featured && (
                  <div className="space-y-2">
                    <div>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="feature_type"
                          value="main"
                          checked={formData.feature_type === 'main'}
                          onChange={(e) => handleFeatureTypeChange(e.target.value)}
                          className="text-brand-blue focus:ring-brand-blue"
                        />
                        <span className="ml-2 text-sm text-gray-600">Main Featured</span>
                      </label>
                    </div>
                    <div>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="feature_type"
                          value="sub"
                          checked={formData.feature_type === 'sub'}
                          onChange={(e) => handleFeatureTypeChange(e.target.value)}
                          className="text-brand-blue focus:ring-brand-blue"
                        />
                        <span className="ml-2 text-sm text-gray-600">Sub Featured</span>
                      </label>
                    </div>

                    {formData.feature_type === 'sub' && (
                      <select
                        value={formData.feature_order || 1}
                        onChange={(e) => handleChange('feature_order', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none text-sm"
                      >
                        <option value={1}>Sub Featured #1</option>
                        <option value={2}>Sub Featured #2</option>
                      </select>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${formData.is_archived ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                <span className="text-sm text-gray-600">
                  {formData.is_archived ? 'Draft' : 'Published'}
                </span>
                {formData.is_featured && (
                  <>
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-sm text-blue-600 font-medium">
                      {formData.feature_type === 'main' ? 'Main Featured' : `Sub Featured #${formData.feature_order}`}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Word Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statistics
              </label>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Words: {formData.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length}</div>
                <div>Characters: {formData.content.replace(/<[^>]*>/g, '').length}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Content Editor */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <RichTextEditor
              value={formData.content}
              onChange={(value) => handleChange('content', value)}
              placeholder="Start writing your blog post..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;
