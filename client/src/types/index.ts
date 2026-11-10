// All TypeScript interfaces for the LRT frontend.
// These mirror the backend Mongoose schemas.

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'Admin' | 'Pastor' | 'Editor' | 'Member' | 'Visitor';
  profilePhoto?: string;
  phone?: string;
  department?: string;
  createdAt: string;
}

export interface Sermon {
  _id: string;
  title: string;
  speaker: string;         // matches backend field name
  datePreached?: string;
  videoUrl?: string;
  audioUrl?: string;
  notes?: string;
  tags?: string[];
  uploadedBy: Partial<User>;
  createdAt: string;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  flierUrl?: string;
  department?: string;
  maxCapacity?: number;
  registeredAttendees: string[];
  createdAt: string;
}

export interface PrayerRequest {
  _id: string;
  request: string;         // matches backend field name
  user?: Partial<User>;
  isPrivate: boolean;
  status: 'Pending' | 'Praying' | 'Answered';
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  token?: string;
  message?: string;
}

export interface Announcement {
  _id: string;
  title: string;
  content: string;
  status: 'Draft' | 'Published';
  createdBy?: Partial<User>;
  createdAt: string;
}

export interface BlogPost {
  _id: string;
  title: string;
  content: string;
  author: string;
  status: 'Draft' | 'Published';
  views: number;
  createdBy?: Partial<User>;
  createdAt: string;
}

export interface GalleryImage {
  _id: string;
  title: string;
  imageUrl: string;
  uploadedBy?: Partial<User>;
  createdAt: string;
}

export interface AppNotification {
  _id: string;
  recipient: string;
  title: string;
  message: string;
  type: 'event' | 'blog' | 'announcement' | 'system';
  link?: string;
  isRead: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface NotificationResponseData {
  notifications: AppNotification[];
  unreadCount: number;
}

export type BroadcastStatus = 'offline' | 'scheduled' | 'live';
export type BroadcastSourceType = 'youtube' | 'facebook' | 'direct';
export type BroadcastAccessLevel = 'all' | 'registered_only';

export interface BroadcastSession {
  _id: string;
  title: string;
  preacher: string;
  description?: string;
  status: BroadcastStatus;
  sourceType: BroadcastSourceType;
  streamUrl: string;
  allowWebcams: boolean;
  accessLevel?: BroadcastAccessLevel;
  eventId?: string | null;
  spotlightedMemberId?: string | null;
  scheduledDate?: string;
  startedAt?: string;
  endedAt?: string;
  activeViewersCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BroadcastRestriction {
  isRestricted: boolean;
  accessLevel: BroadcastAccessLevel;
  isUserRegistered?: boolean;
  event?: {
    _id: string;
    title: string;
    date: string;
    location?: string;
    isRegistrationClosed: boolean;
  } | null;
  message?: string;
}

export interface VirtualParticipant {
  userId: string;
  name: string;
  email?: string;
  location: string;
  hasCamera: boolean;
  hasAudio: boolean;
  isMutedByAdmin: boolean;
  isSpotlighted: boolean;
  streamPeerId?: string;
  lastPing: string;
}

export interface LiveReaction {
  id: string;
  type: string;
  userName: string;
  createdAt: number;
}

export interface BroadcastCurrentData {
  broadcast: BroadcastSession;
  participants: VirtualParticipant[];
  reactions: LiveReaction[];
  activeViewersCount: number;
  restriction?: BroadcastRestriction;
}
