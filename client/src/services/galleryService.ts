import api from './api';
import type { ApiResponse, GalleryImage } from '../types';

const galleryService = {
  getAll: async (): Promise<ApiResponse<GalleryImage[]>> => {
    const { data } = await api.get<ApiResponse<GalleryImage[]>>('/gallery');
    return data;
  },

  create: async (payload: { title: string; imageUrl: string }): Promise<ApiResponse<GalleryImage>> => {
    const { data } = await api.post<ApiResponse<GalleryImage>>('/gallery', payload);
    return data;
  },

  remove: async (id: string): Promise<ApiResponse<null>> => {
    const { data } = await api.delete<ApiResponse<null>>(`/gallery/${id}`);
    return data;
  },
};

export default galleryService;
