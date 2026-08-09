import { Request } from 'express';
import { Socket } from 'socket.io';

export interface UserPayload {
  userId: string;
  email?: string | null;
  username: string;
  role: 'USER' | 'ADMIN';
  isGuest: boolean;
}

export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

export type ChatMode = 'TEXT' | 'VIDEO' | 'AUDIO';

export type Gender = 'MALE' | 'FEMALE' | 'UNSPECIFIED';
export type PartnerGenderPreference = 'MALE' | 'FEMALE' | 'BOTH';

export interface MatchmakingCandidate {
  socketId: string;
  userId: string;
  username: string;
  mode: ChatMode;
  interests: string[];
  gender?: Gender;
  genderPreference?: PartnerGenderPreference;
  country?: string;           // ex: "Brazil"
  countryCode?: string;       // ex: "BR"
  countryPreference?: string; // código ISO do país preferido, ex: "BR"
  joinedAt: number;
}

export interface AuthenticatedSocket extends Socket {
  user?: UserPayload;
  roomId?: string;
  mode?: ChatMode;
  interests?: string[];
  gender?: Gender;
  genderPreference?: PartnerGenderPreference;
  country?: string;
  countryCode?: string;
  countryPreference?: string;
}
