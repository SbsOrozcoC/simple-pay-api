import { loadStripe } from '@stripe/stripe-js';

const API_URL = 'http://localhost:8000/api';
const stripePromise = loadStripe('pk_test_51SRx4TBss6pChZdyRTSE4SGYq8Ky5lQvKwbxeZZp1CuAX8gRP6FydvouKrIj1TAUhaKbNZCfFipj6IBaw433iKzJ00uhVgCKw6');

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

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error del servidor: ${response.status}`);
    }

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

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error del servidor: ${response.status}`);
    }

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

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error del servidor: ${response.status}`);
    }

    return await response.json();
  },

  // STRIPE METHODS - MEJORADOS
  createStripeCheckoutSession: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/stripe/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.message || `Error del servidor: ${response.status}`);
    }

    return await response.json();
  },

  redirectToStripeCheckout: async (sessionId) => {
    try {
      const stripe = await stripePromise;

      if (!sessionId) {
        throw new Error('No se proporcionó sessionId');
      }

      console.log('Redirigiendo a Stripe con sessionId:', sessionId);

      const result = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('Stripe checkout error:', error);
      throw error;
    }
  }
};