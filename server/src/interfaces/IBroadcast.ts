import { Document, Types } from 'mongoose';

export type BroadcastStatus = 'offline' | 'scheduled' | 'live';
export type BroadcastSourceType = 'youtube' | 'facebook' | 'direct';
export type BroadcastAccessLevel = 'all' | 'registered_only';

export interface IBroadcast extends Document {
  _id: Types.ObjectId;
  title: string;
  preacher: string;
  description?: string;
  status: BroadcastStatus;
  sourceType: BroadcastSourceType;
  streamUrl: string; // YouTube Video ID/URL or Facebook embed or direct HLS URL
  allowWebcams: boolean;
  accessLevel: BroadcastAccessLevel;
  eventId?: Types.ObjectId | null;
  spotlightedMemberId?: string | null;
  scheduledDate?: Date;
  startedAt?: Date;
  endedAt?: Date;
  activeViewersCount: number;
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IVirtualParticipant {
  userId: string;
  name: string;
  email?: string;
  location: string;
  hasCamera: boolean;
  hasAudio: boolean;
  isMutedByAdmin: boolean;
  isSpotlighted: boolean;
  streamPeerId?: string;
  lastPing: Date;
}

