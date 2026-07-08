import api from './api';
import type { ApiResponse, PrayerRequest } from '../types';

const prayerService = {
  getAll: async (): Promise<ApiResponse<PrayerRequest[]>> => {
    const { data } = await api.get<ApiResponse<PrayerRequest[]>>('/prayer-requests');
    return data;
  },

  getPublic: async (): Promise<ApiResponse<PrayerRequest[]>> => {
    const { data } = await api.get<ApiResponse<PrayerRequest[]>>('/prayer-requests/public');
    return data;
  },

  create: async (requestData: { subject: string; details: string; isAnonymous: boolean; isPrivate: boolean }): Promise<ApiResponse<PrayerRequest>> => {
    const { data } = await api.post<ApiResponse<PrayerRequest>>('/prayer-requests', requestData);
    return data;
  },

  updateStatus: async (id: string, status: string): Promise<ApiResponse<PrayerRequest>> => {
    const { data } = await api.put<ApiResponse<PrayerRequest>>(`/prayer-requests/${id}/status`, { status });
    return data;
  },
};

export default prayerService;
