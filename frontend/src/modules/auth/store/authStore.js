import { create } from 'zustand';
import { subscriptionService } from '../../subscription/services/subscriptionService';

const useAuthStore = create((set, get) => ({
    // Estado
    user: null,
    token: localStorage.getItem('token'),
    subscription: null,
    isLoading: false,

    // Actions
    setUser: (user) => set({ user }),

    setToken: (token) => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
        set({ token });
    },

    setSubscription: (subscription) => set({ subscription }),

    setLoading: (isLoading) => set({ isLoading }),

    // Login action
    loginSuccess: (userData, token) => {
        localStorage.setItem('token', token);
        set({
            user: userData,
            token: token,
            isLoading: false
        });
    },

    // Logout action
    logout: () => {
        localStorage.removeItem('token');
        set({
            user: null,
            token: null,
            subscription: null,
            isLoading: false
        });
    },

    // Load subscription data
    loadSubscription: async () => {
        try {
            const token = get().token;
            if (!token) return null;

            const response = await subscriptionService.getSubscription();
            set({ subscription: response.subscription });
            return response.subscription;
        } catch (error) {
            console.error('Error loading subscription:', error);
            return null;
        }
    },

    // Update subscription after checkout or cancel
    updateSubscription: (subscriptionData) => {
        set({ subscription: subscriptionData });
    },

    // Check if user has active subscription
    hasActiveSubscription: () => {
        const subscription = get().subscription;
        return subscription?.status === 'active';
    },

    // Get subscription status
    getSubscriptionStatus: () => {
        const subscription = get().subscription;
        return subscription?.status || 'inactive';
    }
}));

export default useAuthStore;