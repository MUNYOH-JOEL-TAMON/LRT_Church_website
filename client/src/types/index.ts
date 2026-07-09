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
  date: string;            // matches backend field name
  location: string;
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
