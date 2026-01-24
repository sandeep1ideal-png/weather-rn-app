// src/types/user.ts
export interface UserProfile {
  id: string;
  username: string;
  fullname: string;
  gender: string;
  bio?: string;
  dob: string; // ISO date string
  location: string;
  latitude: number;
  longitude: number;
  created_at: string;
}

export interface ProfilePhoto {
  id: string;
  user_id: string;
  photo_url: string;
  is_primary: boolean;
  position: number;
  created_at: string;
}

export interface NearbyUser extends Omit<UserProfile, 'dob'> {
  age?: number;
  distance_km: number;
  photo_url?: string;
  is_primary?: boolean;
}