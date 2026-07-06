import api from './api';
import type { ApiResponse, User } from '../types';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials extends LoginCredentials {
  firstName: string;
  lastName: string;
}

// authService: All HTTP calls related to authentication.
// Controllers do NOT call the api directly — they call these functions.
const authService = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<User>> => {
    const { data } = await api.post<ApiResponse<User>>('/auth/login', credentials);
    return data;
  },

  register: async (credentials: RegisterCredentials): Promise<ApiResponse<User>> => {
    const { data } = await api.post<ApiResponse<User>>('/auth/register', credentials);
    return data;
  },

  getMe: async (): Promise<ApiResponse<User>> => {
    const { data } = await api.get<ApiResponse<User>>('/auth/me');
    return data;
  },
};

export default authService;
