import api from './api';
import type { ApiResponse, Event } from '../types';

const eventService = {
  getAll: async (): Promise<ApiResponse<Event[]>> => {
    const { data } = await api.get<ApiResponse<Event[]>>('/events');
    return data;
  },

  getById: async (id: string): Promise<ApiResponse<Event>> => {
    const { data } = await api.get<ApiResponse<Event>>(`/events/${id}`);
    return data;
  },

  create: async (eventData: Partial<Event>): Promise<ApiResponse<Event>> => {
    const { data } = await api.post<ApiResponse<Event>>('/events', eventData);
    return data;
  },

  update: async (id: string, eventData: Partial<Event>): Promise<ApiResponse<Event>> => {
    const { data } = await api.put<ApiResponse<Event>>(`/events/${id}`, eventData);
    return data;
  },

  remove: async (id: string): Promise<ApiResponse<null>> => {
    const { data } = await api.delete<ApiResponse<null>>(`/events/${id}`);
    return data;
  },

  register: async (id: string): Promise<ApiResponse<Event>> => {
    const { data } = await api.post<ApiResponse<Event>>(`/events/${id}/register`);
    return data;
  },
};

export default eventService;
