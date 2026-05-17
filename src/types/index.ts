
export type SocialNetwork = 'X' | 'LinkedIn' | 'YouTube' | 'TikTok' | 'Instagram' | 'Facebook';
export type PostStatus = 'draft' | 'approved' | 'scheduled' | 'published';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'admin' | 'editor' | 'viewer';
}

export interface SocialPost {
  id: string;
  calendarId: string;
  network: SocialNetwork;
  day: number;
  content: string;
  title: string;
  hashtags: string[];
  status: PostStatus;
  scheduledAt?: Date;
}

export interface ContentCalendar {
  id: string;
  userId: string;
  month: string;
  year: number;
  status: 'draft' | 'published';
}

export interface MetricData {
  views: number;
  reach: number;
  likes: number;
  shares: number;
  ctr: number;
  roi: number;
  timestamp: string;
}
