import { authService } from '../../auth/services/authService';

const API_URL = 'http://localhost:8000/api';

export const subscriptionService = {
  checkout: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return await response.json();
  },

  getSubscription: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/subscription`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return await response.json();
  },

  cancelSubscription: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/subscription/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return await response.json();
  },
};