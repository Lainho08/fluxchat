export type ChatMode = 'TEXT' | 'VIDEO' | 'AUDIO';

export interface UserProfile {
  id: string;
  email: string | null;
  username: string;
  avatar?: string;
  isGuest: boolean;
  role: 'USER' | 'ADMIN';
  interests: string[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isSelf: boolean;
}

export interface MediaDeviceItem {
  deviceId: string;
  label: string;
}
