import { create } from 'zustand';
import { api } from './api';
import { User } from './types';

interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;

    // Actions
    setUser: (user: User | null) => void;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: true,
    isAuthenticated: false,

    setUser: (user) => set({
        user,
        isAuthenticated: !!user,
        isLoading: false
    }),

    logout: () => {
        api.logout();
        set({ user: null, isAuthenticated: false });
    },

    checkAuth: async () => {
        if (!api.isAuthenticated()) {
            set({ isLoading: false, isAuthenticated: false, user: null });
            return;
        }

        try {
            const user = await api.getCurrentUser();
            set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
            console.error('Auth check failed:', error);
            api.logout();
            set({ user: null, isAuthenticated: false, isLoading: false });
        }
    },
}));
