import api from './api';
import type { ApiResponse, User } from '../types';

const userService = {
  getAll: async (): Promise<ApiResponse<User[]>> => {
    const { data } = await api.get<ApiResponse<User[]>>('/users');
    return data;
  },

  updateRole: async (id: string, role: string): Promise<ApiResponse<User>> => {
    const { data } = await api.put<ApiResponse<User>>(`/users/${id}/role`, { role });
    return data;
  },

  remove: async (id: string): Promise<ApiResponse<null>> => {
    const { data } = await api.delete<ApiResponse<null>>(`/users/${id}`);
    return data;
  },
};

export default userService;
