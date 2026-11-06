import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { StateStorage } from 'zustand/middleware';
import type { User } from '../types';
import authService from '../services/authService';

// Custom StateStorage that isolates sessions strictly per browser tab (sessionStorage).
// Public visitor tabs (like the homepage or events page) stay completely anonymous and
// never accidentally inherit or bleed member/admin logins across tabs.
const tabStorage: StateStorage = {
  getItem: (name: string): string | null => {
    try {
      return sessionStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      sessionStorage.setItem(name, value);
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
            try {
              localStorage.removeItem('lrt_token');
              localStorage.removeItem('lrt-auth-storage');
            } catch {}
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
            try {
              localStorage.removeItem('lrt_token');
              localStorage.removeItem('lrt-auth-storage');
            } catch {}
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
