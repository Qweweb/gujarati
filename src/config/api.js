/**
 * API Configuration
 * 
 * By default, this uses your VPS n8n domain: https://n8n.gujaratiapp.in
 * If you need to override it during local development, you can set VITE_API_BASE_URL in your .env file.
 */
const getBaseUrl = () => {
  if (import.meta.env && import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  return 'http://n8n.gujaratiapp.in';
};

export const API_BASE_URL = getBaseUrl();

export const API_ENDPOINTS = {
  PANCHANG: `${API_BASE_URL}/webhook/panchang`,
};
