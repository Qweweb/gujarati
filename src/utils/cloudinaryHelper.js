/**
 * Cloudinary image upload helper
 * Uploads a raw File object to Cloudinary and returns the secure HTTPS URL.
 */
export const uploadToCloudinary = async (file) => {
  if (!file) return null;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'gujarati_app');

  try {
    const res = await fetch('https://api.cloudinary.com/v1_1/doyvfjcfg/auto/upload', {
      method: 'POST',
      body: formData
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error?.message || 'Cloudinary upload failed');
    }

    const data = await res.json();
    return data.secure_url || null;
  } catch (err) {
    console.error('Error in uploadToCloudinary:', err);
    throw err;
  }
};
