import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const BlogList = ({ blogs, onEdit, onDelete, onArchive, onUpdate, setBlogData }) => {
  const [filter, setFilter] = useState('all'); // 'all', 'published', 'archived'
  const [groupFilter, setGroupFilter] = useState('all'); // 'all' or specific group name
  const [sortBy, setSortBy] = useState('created_at'); // 'created_at', 'updated_at', 'title', 'author'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'
  const [blogGroups, setBlogGroups] = useState([]);
  const [showNewGroupForm, setShowNewGroupForm] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', description: '', color: '#3B82F6' });
  const [creatingGroupForBlog, setCreatingGroupForBlog] = useState(null);
  const [newRowGroup, setNewRowGroup] = useState({ name: '', color: '#3B82F6' });
  const [editingGroup, setEditingGroup] = useState(null);
  const [editGroupData, setEditGroupData] = useState({ name: '', color: '#3B82F6' });
  const [loadingFeature, setLoadingFeature] = useState(null);
  const [loadingGroup, setLoadingGroup] = useState(null);

  useEffect(() => {
    fetchBlogGroups();
  }, []);

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

  const filteredAndSortedBlogs = blogs
    .filter(blog => {
      // Status filter
      if (filter === 'archived') {
        if (!blog.is_archived) return false;
      } else if (filter === 'published') {
        if (blog.is_archived) return false;
      }
      
      // Group filter
      if (groupFilter !== 'all') {
        if (groupFilter === 'ungrouped') {
          if (blog.blog_group) return false;
        } else {
          if (blog.blog_group !== groupFilter) return false;
        }
      }
      
      return true;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title?.toLowerCase() || '';
          bValue = b.title?.toLowerCase() || '';
          break;
        case 'author':
          aValue = a.author?.toLowerCase() || 'admin';
          bValue = b.author?.toLowerCase() || 'admin';
          break;
        case 'updated_at':
          aValue = new Date(a.updated_at);
          bValue = new Date(b.updated_at);
          break;
        case 'created_at':
        default:
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    // Remove HTML tags completely to prevent any images or formatting from showing
    const cleanText = text.replace(/<[^>]*>/g, '');
    return cleanText.length > maxLength ? cleanText.substring(0, maxLength) + '...' : cleanText;
  };

  const handleFeatureChange = async (blogId, featureType) => {
    setLoadingFeature(blogId);
    try {
      let updateData = {};
      
      if (featureType === 'none') {
        updateData = {
          is_featured: false,
          feature_type: null,
          feature_order: null
        };
      } else if (featureType === 'main') {
        updateData = {
          is_featured: true,
          feature_type: 'main',
          feature_order: null
        };
      } else if (featureType === 'sub1') {
        updateData = {
          is_featured: true,
          feature_type: 'sub',
          feature_order: 1
        };
      } else if (featureType === 'sub2') {
        updateData = {
          is_featured: true,
          feature_type: 'sub',
          feature_order: 2
        };
      }

      const { error } = await supabase
        .from('blogs')
        .update(updateData)
        .eq('id', blogId);

      if (error) throw error;
      
      // Update local state instead of full reload
      if (setBlogData) {
        setBlogData(prevBlogs => 
          prevBlogs.map(blog => 
            blog.id === blogId 
              ? { ...blog, ...updateData, updated_at: new Date().toISOString() }
              : blog
          )
        );
      }
    } catch (error) {
      console.error('Error updating blog feature:', error);
      alert('Failed to update blog feature. Please try again.');
    } finally {
      setLoadingFeature(null);
    }
  };

  const handleGroupChange = async (blogId, groupName) => {
    setLoadingGroup(blogId);
    try {
      const { error } = await supabase
        .from('blogs')
        .update({ blog_group: groupName || null })
        .eq('id', blogId);

      if (error) throw error;
      
      // Update local state instead of full reload
      if (setBlogData) {
        setBlogData(prevBlogs => 
          prevBlogs.map(blog => 
            blog.id === blogId 
              ? { ...blog, blog_group: groupName || null, updated_at: new Date().toISOString() }
              : blog
          )
        );
      }
    } catch (error) {
      console.error('Error updating blog group:', error);
      alert('Failed to update blog group. Please try again.');
    } finally {
      setLoadingGroup(null);
    }
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
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Failed to create group. Please try again.');
    }
  };

  const handleCreateRowGroup = async (blogId) => {
    if (!newRowGroup.name.trim()) {
      alert('Please enter a group name');
      return;
    }

    try {
      // Create the group
      const { data: groupData, error: groupError } = await supabase
        .from('blog_groups')
        .insert([{ 
          name: newRowGroup.name, 
          color: newRowGroup.color,
          description: `Group created for blog management`
        }])
        .select();

      if (groupError) throw groupError;

      // Assign the blog to the new group
      const { error: blogError } = await supabase
        .from('blogs')
        .update({ blog_group: newRowGroup.name })
        .eq('id', blogId);

      if (blogError) throw blogError;

      // Update local state
      setBlogGroups([...blogGroups, ...groupData]);
      setNewRowGroup({ name: '', color: '#3B82F6' });
      setCreatingGroupForBlog(null);
      
      // Update blog data locally
      if (setBlogData) {
        setBlogData(prevBlogs => 
          prevBlogs.map(blog => 
            blog.id === blogId 
              ? { ...blog, blog_group: newRowGroup.name, updated_at: new Date().toISOString() }
              : blog
          )
        );
      }
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Failed to create group. Please try again.');
    }
  };

  const getGroupColor = (groupName) => {
    const group = blogGroups.find(g => g.name === groupName);
    return group?.color || '#3B82F6';
  };

  const handleEditGroup = (group) => {
    setEditingGroup(group.id);
    setEditGroupData({ name: group.name, color: group.color });
  };

  const handleUpdateGroup = async () => {
    if (!editGroupData.name.trim()) {
      alert('Please enter a group name');
      return;
    }

    try {
      const oldGroup = blogGroups.find(g => g.id === editingGroup);
      
      // Update the group
      const { error: groupError } = await supabase
        .from('blog_groups')
        .update({ 
          name: editGroupData.name, 
          color: editGroupData.color 
        })
        .eq('id', editingGroup);

      if (groupError) throw groupError;

      // If name changed, update all blogs with the old group name
      if (oldGroup.name !== editGroupData.name) {
        const { error: blogError } = await supabase
          .from('blogs')
          .update({ blog_group: editGroupData.name })
          .eq('blog_group', oldGroup.name);

        if (blogError) throw blogError;
      }

      // Update local state
      setBlogGroups(blogGroups.map(g => 
        g.id === editingGroup 
          ? { ...g, name: editGroupData.name, color: editGroupData.color }
          : g
      ));
      
      setEditingGroup(null);
      setEditGroupData({ name: '', color: '#3B82F6' });
      
      // Update blog data locally if group name changed
      if (setBlogData && oldGroup.name !== editGroupData.name) {
        setBlogData(prevBlogs => 
          prevBlogs.map(blog => 
            blog.blog_group === oldGroup.name 
              ? { ...blog, blog_group: editGroupData.name, updated_at: new Date().toISOString() }
              : blog
          )
        );
      }
    } catch (error) {
      console.error('Error updating group:', error);
      alert('Failed to update group. Please try again.');
    }
  };

  if (blogs.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts yet</h3>
        <p className="text-gray-600 mb-6">Get started by creating your first blog post.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <style dangerouslySetInnerHTML={{
        __html: `
        .blog-list-item img {
          max-width: 80px !important;
          max-height: 48px !important;
          width: auto !important;
          height: auto !important;
          object-fit: cover !important;
        }
        .blog-excerpt img {
          display: none !important;
        }
        `
      }} />
      
      {/* Blog Groups Management */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900">Blog Groups</h3>
          <button
            onClick={() => setShowNewGroupForm(!showNewGroupForm)}
            className="text-xs bg-brand-blue text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
          >
            {showNewGroupForm ? 'Cancel' : 'New Group'}
          </button>
        </div>
        
        {showNewGroupForm && (
          <div className="mb-3 p-3 bg-white rounded border border-gray-200 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Group name"
                value={newGroup.name}
                onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-brand-blue focus:border-brand-blue"
              />
              <input
                type="color"
                value={newGroup.color}
                onChange={(e) => setNewGroup({...newGroup, color: e.target.value})}
                className="w-full h-7 border border-gray-300 rounded cursor-pointer"
              />
            </div>
            <input
              type="text"
              placeholder="Description (optional)"
              value={newGroup.description}
              onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
              className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-brand-blue focus:border-brand-blue"
            />
            <button
              onClick={handleCreateGroup}
              className="text-xs bg-brand-blue text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
            >
              Create Group
            </button>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          {blogGroups.map((group) => (
            <div key={group.id} className="flex items-center">
              {editingGroup === group.id ? (
                <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-full px-3 py-1">
                  <input
                    type="text"
                    value={editGroupData.name}
                    onChange={(e) => setEditGroupData({...editGroupData, name: e.target.value})}
                    className="text-xs border-none outline-none bg-transparent w-20"
                    onKeyPress={(e) => e.key === 'Enter' && handleUpdateGroup()}
                  />
                  <input
                    type="color"
                    value={editGroupData.color}
                    onChange={(e) => setEditGroupData({...editGroupData, color: e.target.value})}
                    className="w-4 h-4 border-none rounded cursor-pointer"
                  />
                  <button
                    onClick={handleUpdateGroup}
                    className="text-xs text-brand-blue hover:text-blue-700"
                    title="Save changes"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => {
                      setEditingGroup(null);
                      setEditGroupData({ name: '', color: '#3B82F6' });
                    }}
                    className="text-xs text-gray-500 hover:text-gray-700"
                    title="Cancel"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="flex items-center">
                  <span
                    className="text-xs px-2 py-1 rounded-full text-white cursor-pointer"
                    style={{ backgroundColor: group.color }}
                    title={group.description}
                    onClick={() => handleEditGroup(group)}
                  >
                    {group.name} ({blogs.filter(b => b.blog_group === group.name).length})
                  </span>
                </div>
              )}
            </div>
          ))}
          {blogGroups.length === 0 && (
            <span className="text-xs text-gray-500">No groups created yet</span>
          )}
        </div>
      </div>
      
      {/* Status Filter Tabs - Original Design */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1">
        <div className="flex space-x-1">
          {[
            { key: 'all', label: 'All Posts', count: blogs.length },
            { key: 'published', label: 'Published', count: blogs.filter(b => !b.is_archived).length },
            { key: 'archived', label: 'Archived', count: blogs.filter(b => b.is_archived).length }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === tab.key
                  ? 'bg-brand-blue text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Additional Filter and Sort Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Group Filter */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Group:</label>
            <select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className="text-sm border border-gray-300 rounded px-3 py-1 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
            >
              <option value="all">All Groups</option>
              <option value="ungrouped">Ungrouped</option>
              {blogGroups.map((group) => (
                <option key={group.id} value={group.name}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-gray-300 rounded px-3 py-1 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
            >
              <option value="created_at">Created Date</option>
              <option value="updated_at">Updated Date</option>
              <option value="title">Title</option>
              <option value="author">Author</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              <svg className={`w-4 h-4 text-gray-600 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            </button>
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-500 ml-auto">
            Showing {filteredAndSortedBlogs.length} of {blogs.length} posts
          </div>
        </div>
      </div>

      {/* Blog List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredAndSortedBlogs.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No {filter} blog posts found.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredAndSortedBlogs.map((blog) => (
              <div
                key={blog.id}
                className={`blog-list-item p-6 hover:bg-gray-50 transition-colors relative ${
                  blog.is_archived ? 'opacity-60 bg-gray-25' : ''
                }`}
                style={{
                  borderLeft: blog.blog_group ? `4px solid ${getGroupColor(blog.blog_group)}` : 'none'
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1 min-w-0">
                    {/* Cover Image Thumbnail */}
                    {blog.cover_image ? (
                      <div className="flex-shrink-0">
                        <img
                          src={blog.cover_image}
                          alt={blog.title}
                          className="w-20 h-12 object-cover rounded border border-gray-200"
                          style={{ maxWidth: '80px', maxHeight: '48px', width: '80px', height: '48px' }}
                        />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-20 h-12 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className={`text-lg font-semibold ${
                          blog.is_archived ? 'text-gray-500' : 'text-gray-900'
                        }`}>
                          {blog.title}
                        </h3>
                        {blog.is_archived && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Archived
                          </span>
                        )}
                      </div>
                      
                      {blog.excerpt && (
                        <p className={`blog-excerpt text-sm mb-3 ${
                          blog.is_archived ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {truncateText(blog.excerpt, 150)}
                        </p>
                      )}
                      

                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 ml-4">
                    {/* Feature Control */}
                    <div className="flex items-center space-x-2">
                      {loadingFeature === blog.id ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500 font-medium">Featured:</span>
                          <div className="h-6 w-11 bg-gray-200 rounded-full animate-pulse"></div>
                          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-6 w-12 bg-gray-200 rounded-full animate-pulse"></div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500 font-medium">Featured:</span>
                            <button
                              onClick={() => {
                                if (blog.is_featured) {
                                  handleFeatureChange(blog.id, 'none');
                                } else {
                                  handleFeatureChange(blog.id, 'main');
                                }
                              }}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 ${
                                blog.is_featured ? 'bg-brand-blue' : 'bg-gray-200'
                              }`}
                              title="Toggle featured status"
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  blog.is_featured ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                          {blog.is_featured && (
                            <select
                              value={
                                blog.feature_type === 'main' ? 'main' :
                                blog.feature_type === 'sub' && blog.feature_order === 1 ? 'sub1' :
                                blog.feature_type === 'sub' && blog.feature_order === 2 ? 'sub2' : 'main'
                              }
                              onChange={(e) => handleFeatureChange(blog.id, e.target.value)}
                              className="text-xs border border-gray-300 rounded-md px-3 py-1.5 pr-8 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue appearance-none bg-white"
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                                backgroundPosition: 'right 0.5rem center',
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: '1.5em 1.5em'
                              }}
                            >
                              <option value="main">Main Featured</option>
                              <option value="sub1">Sub Featured #1</option>
                              <option value="sub2">Sub Featured #2</option>
                            </select>
                          )}
                          {blog.is_featured && (
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              blog.feature_type === 'main' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-purple-100 text-purple-800'
                            }`}>
                              {blog.feature_type === 'main' ? 'Main' : `Sub #${blog.feature_order}`}
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    {/* Group Control */}
                    <div className="flex items-center space-x-2">
                      {loadingGroup === blog.id ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500 font-medium">Group:</span>
                          <div className="h-6 w-11 bg-gray-200 rounded-full animate-pulse"></div>
                          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-6 w-7 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-6 w-12 bg-gray-200 rounded-full animate-pulse"></div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500 font-medium">Group:</span>
                            <button
                              onClick={() => {
                                if (blog.blog_group) {
                                  handleGroupChange(blog.id, '');
                                } else {
                                  // If no groups exist, show create form, otherwise assign to first group
                                  if (blogGroups.length === 0) {
                                    setCreatingGroupForBlog(blog.id);
                                  } else {
                                    handleGroupChange(blog.id, blogGroups[0].name);
                                  }
                                }
                              }}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 ${
                                blog.blog_group ? 'bg-brand-blue' : 'bg-gray-200'
                              }`}
                              title="Toggle group assignment"
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  blog.blog_group ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                          {(blog.blog_group || creatingGroupForBlog === blog.id) && (
                            <div className="flex items-center space-x-2">
                              {creatingGroupForBlog === blog.id ? (
                                <>
                                  <input
                                    type="text"
                                    placeholder="Group name"
                                    value={newRowGroup.name}
                                    onChange={(e) => setNewRowGroup({...newRowGroup, name: e.target.value})}
                                    className="text-xs border border-gray-300 rounded-md px-2 py-1.5 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue w-24"
                                    onKeyPress={(e) => e.key === 'Enter' && handleCreateRowGroup(blog.id)}
                                  />
                                  <input
                                    type="color"
                                    value={newRowGroup.color}
                                    onChange={(e) => setNewRowGroup({...newRowGroup, color: e.target.value})}
                                    className="w-7 h-7 border border-gray-300 rounded cursor-pointer"
                                  />
                                  <button
                                    onClick={() => handleCreateRowGroup(blog.id)}
                                    className="w-7 h-7 bg-brand-blue text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center"
                                    title="Create group"
                                  >
                                    ✓
                                  </button>
                                  <button
                                    onClick={() => {
                                      setCreatingGroupForBlog(null);
                                      setNewRowGroup({ name: '', color: '#3B82F6' });
                                    }}
                                    className="w-7 h-7 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors flex items-center justify-center"
                                    title="Cancel"
                                  >
                                    ✕
                                  </button>
                                </>
                              ) : (
                                <>
                                  <select
                                    value={blog.blog_group || ''}
                                    onChange={(e) => handleGroupChange(blog.id, e.target.value)}
                                    className="text-xs border border-gray-300 rounded-md px-3 py-1.5 pr-8 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue appearance-none bg-white"
                                    style={{
                                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                                      backgroundPosition: 'right 0.5rem center',
                                      backgroundRepeat: 'no-repeat',
                                      backgroundSize: '1.5em 1.5em'
                                    }}
                                  >
                                    {blogGroups.map((group) => (
                                      <option key={group.id} value={group.name}>
                                        {group.name}
                                      </option>
                                    ))}
                                  </select>
                                  <button
                                    onClick={() => setCreatingGroupForBlog(blog.id)}
                                    className="w-7 h-7 bg-brand-blue text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center text-sm font-bold"
                                    title="Create new group"
                                  >
                                    +
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                          {blog.blog_group && (
                            <span 
                              className="text-xs px-2 py-1 rounded-full text-white"
                              style={{ 
                                backgroundColor: getGroupColor(blog.blog_group)
                              }}
                            >
                              {blog.blog_group}
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <button
                      onClick={() => onEdit(blog)}
                      className="p-2 text-gray-400 hover:text-brand-blue hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit blog"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={() => onArchive(blog.id, blog.is_archived)}
                      className={`p-2 rounded-lg transition-colors ${
                        blog.is_archived
                          ? 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                          : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                      }`}
                      title={blog.is_archived ? 'Unarchive blog' : 'Archive blog'}
                    >
                      {blog.is_archived ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                      )}
                    </button>
                    
                    <button
                      onClick={() => onDelete(blog.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete blog"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Date and Author Info - Full Width Row */}
                <div className="px-6 pb-4">
                  <div className="flex items-center space-x-6 text-xs text-gray-500 border-t border-gray-100 pt-3">
                    <span className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>{blog.author || 'Admin'}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{formatDate(blog.created_at)}</span>
                    </span>
                    {blog.updated_at !== blog.created_at && (
                      <span className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Updated {formatDate(blog.updated_at)}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Summary */}
      <div className="text-sm text-gray-500 text-center">
        Showing {filteredAndSortedBlogs.length} of {blogs.length} blog posts
      </div>
    </div>
  );
};

export default BlogList;
