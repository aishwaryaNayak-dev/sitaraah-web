const BASE = import.meta.env.VITE_API_URL || '';

const request = async (url, options = {}) => {
  const token = localStorage.getItem('adminToken');
  const headers = { 'Content-Type': 'application/json', ...(token && url.includes('/admin') && { Authorization: `Bearer ${token}` }) };
  const res = await fetch(BASE + url, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const getServices = () => request('/api/services');
export const createOrder = (body) => request('/api/bookings/order', { method: 'POST', body: JSON.stringify(body) });
export const verifyPayment = (body) => request('/api/bookings/verify', { method: 'POST', body: JSON.stringify(body) });
export const sendMessage = (body) => request('/api/contact', { method: 'POST', body: JSON.stringify(body) });

export const INSTAGRAM_URL = 'https://www.instagram.com/sitaraah_wellness';
export const EMAIL = 'sitaraahwellness@gmail.com';

export const adminLogin = (body) => request('/api/admin/login', { method: 'POST', body: JSON.stringify(body) });
export const getDashboard = () => request('/api/admin/dashboard');
export const updateService = (id, body) => request(`/api/admin/services/${id}`, { method: 'PUT', body: JSON.stringify(body) });
