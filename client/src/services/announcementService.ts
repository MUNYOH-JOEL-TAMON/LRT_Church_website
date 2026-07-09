import api from './api';
import type { ApiResponse, Announcement } from '../types';

const announcementService = {
  getAll: async (): Promise<ApiResponse<Announcement[]>> => {
    const { data } = await api.get<ApiResponse<Announcement[]>>('/announcements');
    return data;
  },

  getPublished: async (): Promise<ApiResponse<Announcement[]>> => {
    const { data } = await api.get<ApiResponse<Announcement[]>>('/announcements/public');
    return data;
  },

  create: async (payload: { title: string; content: string; status: string }): Promise<ApiResponse<Announcement>> => {
    const { data } = await api.post<ApiResponse<Announcement>>('/announcements', payload);
    return data;
  },

  update: async (id: string, payload: Partial<Announcement>): Promise<ApiResponse<Announcement>> => {
    const { data } = await api.put<ApiResponse<Announcement>>(`/announcements/${id}`, payload);
    return data;
  },

  remove: async (id: string): Promise<ApiResponse<null>> => {
    const { data } = await api.delete<ApiResponse<null>>(`/announcements/${id}`);
    return data;
  },
};

export default announcementService;
