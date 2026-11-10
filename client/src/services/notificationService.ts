import api from './api';
import type { ApiResponse, AppNotification, NotificationResponseData } from '../types';

const notificationService = {
  getAll: async (): Promise<ApiResponse<NotificationResponseData>> => {
    const { data } = await api.get<ApiResponse<NotificationResponseData>>('/notifications');
    return data;
  },

  markAsRead: async (id: string): Promise<ApiResponse<AppNotification>> => {
    const { data } = await api.patch<ApiResponse<AppNotification>>(`/notifications/${id}/read`);
    return data;
  },

  markAllAsRead: async (): Promise<ApiResponse<null>> => {
    const { data } = await api.patch<ApiResponse<null>>('/notifications/mark-all-read');
    return data;
  },

  remove: async (id: string): Promise<ApiResponse<null>> => {
    const { data } = await api.delete<ApiResponse<null>>(`/notifications/${id}`);
    return data;
  },

  clearAll: async (): Promise<ApiResponse<null>> => {
    const { data } = await api.delete<ApiResponse<null>>('/notifications');
    return data;
  },

  broadcast: async (payload: {
    title: string;
    message: string;
    type?: string;
    link?: string;
  }): Promise<ApiResponse<null>> => {
    const { data } = await api.post<ApiResponse<null>>('/notifications/broadcast', payload);
    return data;
  },
};

export default notificationService;

