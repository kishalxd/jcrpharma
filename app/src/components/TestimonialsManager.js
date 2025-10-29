import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const TestimonialsManager = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('display_order');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterStatus, setFilterStatus] = useState('all');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    text: '',
    status: 'active',
    display_order: 0
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      alert('Error fetching testimonials: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file) => {
    if (!file) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = fileName;

    const { data, error } = await supabase.storage
      .from('testimonial-images')
      .upload(filePath, file);

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('testimonial-images')
      .getPublicUrl(filePath);

    return {
      url: publicUrl,
      name: file.name,
      path: filePath
    };
  };

  const deleteImage = async (imagePath) => {
    if (!imagePath) return;

    try {
      const { error } = await supabase.storage
        .from('testimonial-images')
        .remove([imagePath]);

      if (error) {
        console.error('Error deleting image:', error);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageData = null;
      
      // Upload new image if provided
      if (imageFile) {
        imageData = await uploadImage(imageFile);
      }

      const testimonialData = {
        ...formData,
        display_order: parseInt(formData.display_order) || 0
      };

      // Add image data if uploaded
      if (imageData) {
        testimonialData.image_url = imageData.url;
        testimonialData.image_name = imageData.name;
      }

      if (editingTestimonial) {
        // Update existing testimonial
        const { error } = await supabase
          .from('testimonials')
          .update(testimonialData)
          .eq('id', editingTestimonial.id);

        if (error) throw error;

        // Delete old image if a new one was uploaded
        if (imageData && editingTestimonial.image_url) {
          const oldImagePath = editingTestimonial.image_url.split('/').pop();
          await deleteImage(oldImagePath);
        }
      } else {
        // Create new testimonial
        const { error } = await supabase
          .from('testimonials')
          .insert([testimonialData]);

        if (error) throw error;
      }

      // Reset form and refresh data
      resetForm();
      fetchTestimonials();
      alert(editingTestimonial ? 'Testimonial updated successfully!' : 'Testimonial created successfully!');
    } catch (error) {
      console.error('Error saving testimonial:', error);
      alert('Error saving testimonial: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      text: testimonial.text,
      status: testimonial.status,
      display_order: testimonial.display_order
    });
    setImagePreview(testimonial.image_url);
    setShowForm(true);
  };

  const handleDelete = async (testimonial) => {
    if (!window.confirm(`Are you sure you want to delete the testimonial by ${testimonial.name}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', testimonial.id);

      if (error) throw error;

      // Delete associated image
      if (testimonial.image_url) {
        const imagePath = testimonial.image_url.split('/').pop();
        await deleteImage(imagePath);
      }

      fetchTestimonials();
      alert('Testimonial deleted successfully!');
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      alert('Error deleting testimonial: ' + error.message);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      fetchTestimonials();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      text: '',
      status: 'active',
      display_order: 0
    });
    setImageFile(null);
    setImagePreview(null);
    setEditingTestimonial(null);
    setShowForm(false);
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Filter and sort testimonials
  const getFilteredAndSortedTestimonials = () => {
    let filtered = testimonials;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(testimonial => 
        testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(testimonial => testimonial.status === filterStatus);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'created_at' || sortBy === 'updated_at') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  const filteredTestimonials = getFilteredAndSortedTestimonials();

  if (showForm) {
    return (
      <div className="bg-white shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                placeholder="Enter person's name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Order
              </label>
              <input
                type="number"
                name="display_order"
                value={formData.display_order}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Testimonial Text *
            </label>
            <textarea
              name="text"
              value={formData.text}
              onChange={handleInputChange}
              required
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              placeholder="Enter the testimonial text..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo
            </label>
            <div className="space-y-4">
              {imagePreview && (
                <div className="flex items-center space-x-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setImageFile(null);
                    }}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Remove Image
                  </button>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              />
              <p className="text-sm text-gray-500">
                Supported formats: JPG, PNG, GIF, WebP. Max size: 5MB.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-6 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Saving...' : (editingTestimonial ? 'Update Testimonial' : 'Create Testimonial')}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search testimonials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
            >
              <option value="display_order-asc">Display Order</option>
              <option value="created_at-desc">Newest First</option>
              <option value="created_at-asc">Oldest First</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
            </select>
            <button
              onClick={() => setShowForm(true)}
              className="bg-brand-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add Testimonial</span>
            </button>
            <button
              onClick={fetchTestimonials}
              disabled={loading}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0V9a8 8 0 1115.356 2M15 15v5h-.582M4.582 15A8.001 8.001 0 0019.418 9m0 0V9a8 8 0 10-15.356 2" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Testimonials Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-4 px-6 text-black font-medium text-sm">Photo</th>
              <th className="text-left py-4 px-6 text-black font-medium text-sm">Name</th>
              <th className="text-left py-4 px-6 text-black font-medium text-sm">Testimonial</th>
              <th className="text-left py-4 px-6 text-black font-medium text-sm">Status</th>
              <th className="text-left py-4 px-6 text-black font-medium text-sm">Order</th>
              <th className="text-left py-4 px-6 text-black font-medium text-sm">Created</th>
              <th className="text-left py-4 px-6 text-black font-medium text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTestimonials.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-8 px-6 text-center text-gray-500">
                  {loading ? 'Loading testimonials...' : searchTerm || filterStatus !== 'all' ? 'No testimonials match your search criteria' : 'No testimonials found'}
                </td>
              </tr>
            ) : (
              filteredTestimonials.map((testimonial) => (
                <tr key={testimonial.id} className="hover:bg-gray-50 transition-colors border-t border-gray-100">
                  <td className="py-4 px-6">
                    {testimonial.image_url ? (
                      <img
                        src={testimonial.image_url}
                        alt={testimonial.name}
                        className="w-12 h-12 object-cover rounded-full border border-gray-300"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6 text-black font-medium text-sm">{testimonial.name}</td>
                  <td className="py-4 px-6 text-gray-600 text-sm max-w-xs">
                    <div className="truncate" title={testimonial.text}>
                      {testimonial.text.length > 100 ? testimonial.text.substring(0, 100) + '...' : testimonial.text}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <select
                      value={testimonial.status}
                      onChange={(e) => updateStatus(testimonial.id, e.target.value)}
                      className={`text-xs px-3 py-2 pr-8 rounded-full border font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue appearance-none cursor-pointer ${getStatusColor(testimonial.status)}`}
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 0.5rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1rem 1rem'
                      }}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </td>
                  <td className="py-4 px-6 text-gray-600 text-sm">{testimonial.display_order}</td>
                  <td className="py-4 px-6 text-gray-600 text-sm">
                    {new Date(testimonial.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(testimonial)}
                        className="text-brand-blue hover:text-blue-700 px-3 py-1 rounded text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(testimonial)}
                        className="text-red-600 hover:text-red-700 px-3 py-1 rounded text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TestimonialsManager;
