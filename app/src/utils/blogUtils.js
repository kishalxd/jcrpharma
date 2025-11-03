/**
 * Generate a URL-friendly slug from a title
 * @param {string} title - The blog title
 * @returns {string} - URL-friendly slug
 */
export const generateSlug = (title) => {
  if (!title) return '';
  
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and multiple dashes with single dash
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
};

/**
 * Compress image to WebP format
 * @param {File} file - Image file
 * @param {number} maxWidth - Maximum width (default: 1200)
 * @param {number} maxHeight - Maximum height (default: 800)
 * @param {number} quality - Quality 0-1 (default: 0.85)
 * @returns {Promise<string>} - Base64 WebP string
 */
export const compressImageToWebP = (file, maxWidth = 1200, maxHeight = 800, quality = 0.85) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP format
        try {
          const webpBase64 = canvas.toDataURL('image/webp', quality);
          resolve(webpBase64);
        } catch (error) {
          // Fallback to JPEG if WebP not supported
          const jpegBase64 = canvas.toDataURL('image/jpeg', quality);
          resolve(jpegBase64);
        }
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Generate descriptive alt text for blog images
 * @param {string} blogTitle - The blog post title
 * @param {string} imageContext - Optional context about the image
 * @returns {string} - Descriptive alt text
 */
export const generateImageAltText = (blogTitle, imageContext = '') => {
  if (imageContext) {
    return imageContext;
  }
  
  // Generate descriptive alt text based on blog title
  const titleLower = blogTitle.toLowerCase();
  
  // Common patterns for life sciences blog titles
  if (titleLower.includes('clinical') || titleLower.includes('trial')) {
    return 'Clinical data team analyzing trial results';
  } else if (titleLower.includes('biostatistics') || titleLower.includes('statistical')) {
    return 'Biostatistician working on data analysis';
  } else if (titleLower.includes('data science') || titleLower.includes('data science')) {
    return 'Data scientist analyzing life sciences data';
  } else if (titleLower.includes('pharmaceutical') || titleLower.includes('pharma')) {
    return 'Pharmaceutical research and development team';
  } else if (titleLower.includes('recruitment') || titleLower.includes('hiring')) {
    return 'Life sciences recruitment and talent acquisition';
  } else if (titleLower.includes('bioinformatics')) {
    return 'Bioinformatics researcher working with genomic data';
  } else if (titleLower.includes('regulatory')) {
    return 'Regulatory affairs professional reviewing documentation';
  }
  
  // Default descriptive alt text
  return `${blogTitle} - Life sciences industry insights`;
};

