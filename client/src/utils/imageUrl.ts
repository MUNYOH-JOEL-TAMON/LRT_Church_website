/**
 * Resolves a media URL (uploaded event flier, gallery photo, etc.) into a reachable URL.
 * Automatically handles:
 * - External image URLs (Unsplash, CDNs, etc.)
 * - Uploaded images with '/uploads/' paths, ensuring they point to the active backend host
 * - Automatic rewrite of legacy/remote URLs to localhost when running in local development
 */
export const getMediaUrl = (url?: string | null): string => {
  if (!url) return '';

  // Return external web images as-is
  if (
    url.startsWith('https://images.unsplash.com') ||
    url.startsWith('http://images.unsplash.com')
  ) {
    return url;
  }

  // Derive active backend origin from VITE_API_URL
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
  const backendOrigin = apiBase.replace(/\/api(\/v1)?\/?$/, '');

  // Handle uploaded files
  if (url.includes('/uploads/')) {
    const filename = url.split('/uploads/')[1];

    // If currently running against localhost and image URL has onrender.com, rewrite to local backend
    if (backendOrigin.includes('localhost') && url.includes('onrender.com')) {
      return `${backendOrigin}/uploads/${filename}`;
    }

    // If relative path
    if (url.startsWith('/uploads/') || url.startsWith('uploads/')) {
      return `${backendOrigin}/uploads/${filename}`;
    }

    return url;
  }

  return url;
};

export default getMediaUrl;
