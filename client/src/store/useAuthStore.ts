import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import authService from '../services/authService';

// Defines the shape of our global auth state
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// The `persist` middleware automatically saves the token to localStorage
// so the user stays logged in across page refreshes.
const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login({ email, password });
          if (response.token) {
            localStorage.setItem('lrt_token', response.token);
          }
          set({
            user: response.data ?? null,
            token: response.token ?? null,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err: any) {
          set({
            error: err.response?.data?.message || 'Login failed. Please try again.',
            isLoading: false,
          });
        }
      },

      register: async (firstName, lastName, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register({ firstName, lastName, email, password });
          if (response.token) {
            localStorage.setItem('lrt_token', response.token);
          }
          set({
            user: response.data ?? null,
            token: response.token ?? null,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err: any) {
          set({
            error: err.response?.data?.message || 'Registration failed. Please try again.',
            isLoading: false,
          });
        }
      },

      logout: () => {
        localStorage.removeItem('lrt_token');
        set({ user: null, token: null, isAuthenticated: false, error: null });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'lrt-auth-storage', // Key used in localStorage
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useAuthStore;
