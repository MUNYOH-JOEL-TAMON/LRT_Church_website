import api from './api';
import type { ApiResponse, Sermon } from '../types';

const sermonService = {
  getAll: async (): Promise<ApiResponse<Sermon[]>> => {
    const { data } = await api.get<ApiResponse<Sermon[]>>('/sermons');
    return data;
  },

  getById: async (id: string): Promise<ApiResponse<Sermon>> => {
    const { data } = await api.get<ApiResponse<Sermon>>(`/sermons/${id}`);
    return data;
  },

  create: async (sermonData: Partial<Sermon>): Promise<ApiResponse<Sermon>> => {
    const { data } = await api.post<ApiResponse<Sermon>>('/sermons', sermonData);
    return data;
  },

  update: async (id: string, sermonData: Partial<Sermon>): Promise<ApiResponse<Sermon>> => {
    const { data } = await api.put<ApiResponse<Sermon>>(`/sermons/${id}`, sermonData);
    return data;
  },

  remove: async (id: string): Promise<ApiResponse<null>> => {
    const { data } = await api.delete<ApiResponse<null>>(`/sermons/${id}`);
    return data;
  },
};

export default sermonService;
