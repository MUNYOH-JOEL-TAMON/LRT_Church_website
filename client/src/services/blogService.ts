import api from './api';
import type { ApiResponse, BlogPost } from '../types';

const blogService = {
  getAll: async (): Promise<ApiResponse<BlogPost[]>> => {
    const { data } = await api.get<ApiResponse<BlogPost[]>>('/blog');
    return data;
  },

  getPublished: async (): Promise<ApiResponse<BlogPost[]>> => {
    const { data } = await api.get<ApiResponse<BlogPost[]>>('/blog/public');
    return data;
  },

  create: async (payload: { title: string; content: string; author: string; status: string }): Promise<ApiResponse<BlogPost>> => {
    const { data } = await api.post<ApiResponse<BlogPost>>('/blog', payload);
    return data;
  },

  update: async (id: string, payload: Partial<BlogPost>): Promise<ApiResponse<BlogPost>> => {
    const { data } = await api.put<ApiResponse<BlogPost>>(`/blog/${id}`, payload);
    return data;
  },

  remove: async (id: string): Promise<ApiResponse<null>> => {
    const { data } = await api.delete<ApiResponse<null>>(`/blog/${id}`);
    return data;
  },
};

export default blogService;
