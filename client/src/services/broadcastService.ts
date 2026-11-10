import api from './api';
import type {
  ApiResponse,
  BroadcastSession,
  BroadcastCurrentData,
  VirtualParticipant,
  LiveReaction,
} from '../types';

const broadcastService = {
  getCurrent: async (): Promise<ApiResponse<BroadcastCurrentData>> => {
    const { data } = await api.get<ApiResponse<BroadcastCurrentData>>('/broadcast/current');
    return data;
  },

  getParticipants: async (): Promise<ApiResponse<VirtualParticipant[]>> => {
    const { data } = await api.get<ApiResponse<VirtualParticipant[]>>('/broadcast/participants');
    return data;
  },

  getReactions: async (): Promise<ApiResponse<LiveReaction[]>> => {
    const { data } = await api.get<ApiResponse<LiveReaction[]>>('/broadcast/reactions');
    return data;
  },

  startBroadcast: async (payload: Partial<BroadcastSession>): Promise<ApiResponse<BroadcastSession>> => {
    const { data } = await api.post<ApiResponse<BroadcastSession>>('/broadcast/start', payload);
    return data;
  },

  updateBroadcast: async (
    id: string,
    payload: Partial<BroadcastSession>
  ): Promise<ApiResponse<BroadcastSession>> => {
    const { data } = await api.put<ApiResponse<BroadcastSession>>(`/broadcast/${id}`, payload);
    return data;
  },

  endBroadcast: async (id: string): Promise<ApiResponse<BroadcastSession>> => {
    const { data } = await api.post<ApiResponse<BroadcastSession>>(`/broadcast/${id}/end`);
    return data;
  },

  joinPresence: async (payload: {
    location?: string;
    hasCamera: boolean;
    hasAudio: boolean;
    streamPeerId?: string;
  }): Promise<ApiResponse<VirtualParticipant>> => {
    const { data } = await api.post<ApiResponse<VirtualParticipant>>('/broadcast/presence/join', payload);
    return data;
  },

  pingPresence: async (): Promise<ApiResponse<null>> => {
    const { data } = await api.post<ApiResponse<null>>('/broadcast/presence/ping');
    return data;
  },

  leavePresence: async (): Promise<ApiResponse<null>> => {
    const { data } = await api.post<ApiResponse<null>>('/broadcast/presence/leave');
    return data;
  },

  setMemberAudio: async (
    memberId: string,
    isMutedByAdmin: boolean
  ): Promise<ApiResponse<VirtualParticipant>> => {
    const { data } = await api.post<ApiResponse<VirtualParticipant>>(
      `/broadcast/members/${memberId}/audio`,
      { isMutedByAdmin }
    );
    return data;
  },

  spotlightMember: async (
    broadcastId: string,
    memberId: string | null
  ): Promise<ApiResponse<any>> => {
    const { data } = await api.post<ApiResponse<any>>(
      `/broadcast/${broadcastId}/spotlight`,
      { memberId }
    );
    return data;
  },

  sendReaction: async (type: string): Promise<ApiResponse<LiveReaction>> => {
    const { data } = await api.post<ApiResponse<LiveReaction>>('/broadcast/reactions', { type });
    return data;
  },
};

export default broadcastService;

