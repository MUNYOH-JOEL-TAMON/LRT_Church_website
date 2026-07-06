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
  preacher: string;
  description?: string;
  videoUrl?: string;
  audioUrl?: string;
  thumbnailUrl?: string;
  scripture?: string;
  series?: string;
  tags?: string[];
  uploadedBy: Partial<User>;
  createdAt: string;
}

export interface Event {
  _id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  location?: string;
  coverImage?: string;
  maxCapacity?: number;
  attendees: string[];
  createdBy: Partial<User>;
  createdAt: string;
}

export interface PrayerRequest {
  _id: string;
  subject: string;
  details: string;
  requestedBy: Partial<User>;
  isAnonymous: boolean;
  status: 'Pending' | 'Praying' | 'Answered';
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  token?: string;
  message?: string;
}
