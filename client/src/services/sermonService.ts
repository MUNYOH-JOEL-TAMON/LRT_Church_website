import api from './api';
import type { ApiResponse, Sermon } from '../types';

const sermonService = {
  getAll: async (page = 1, limit = 9): Promise<ApiResponse<Sermon[]>> => {
    const { data } = await api.get<ApiResponse<Sermon[]>>(`/sermons?page=${page}&limit=${limit}`);
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
};

export default sermonService;
