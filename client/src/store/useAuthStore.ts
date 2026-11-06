import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { StateStorage } from 'zustand/middleware';
import type { User } from '../types';
import authService from '../services/authService';

// Custom StateStorage that isolates sessions per browser tab (sessionStorage),
// while allowing seamless initial hydration from localStorage for newly opened tabs.
const tabStorage: StateStorage = {
  getItem: (name: string): string | null => {
    try {
      // 1. Prioritize tab-isolated sessionStorage
      const sessionVal = sessionStorage.getItem(name);
      if (sessionVal) return sessionVal;

      // 2. Fallback to localStorage on fresh tab launch
      const localVal = localStorage.getItem(name);
      if (localVal) {
        // Copy to sessionStorage so this tab is isolated from now on
        sessionStorage.setItem(name, localVal);
        return localVal;
      }
      return null;
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      sessionStorage.setItem(name, value);
      localStorage.setItem(name, value);
    } catch {}
  },
  removeItem: (name: string): void => {
    try {
      sessionStorage.removeItem(name);
      localStorage.removeItem(name);
    } catch {}
  },
};

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
  updateUser: (updatedUser: User) => void;
}

// The `persist` middleware saves session to tab-isolated storage so multiple
// tabs (e.g. Admin in Tab 1, Member in Tab 2) never collide or overwrite each other.
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
            sessionStorage.setItem('lrt_token', response.token);
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
            sessionStorage.setItem('lrt_token', response.token);
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
        sessionStorage.removeItem('lrt_token');
        sessionStorage.removeItem('lrt-auth-storage');
        localStorage.removeItem('lrt_token');
        localStorage.removeItem('lrt-auth-storage');
        set({ user: null, token: null, isAuthenticated: false, error: null });
      },

      clearError: () => set({ error: null }),

      updateUser: (updatedUser: User) => {
        set({ user: updatedUser });
      },
    }),
    {
      name: 'lrt-auth-storage',
      storage: createJSONStorage(() => tabStorage),
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useAuthStore;
