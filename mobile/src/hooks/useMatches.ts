// src/hooks/useMatches.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';

interface Profile {
  id: string;
  username: string;
  fullname: string;
  gender: string;
  dob: string;
  bio: string;
  gallery?: Array<{ photo_url: string }>;
}

interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
  user1: Profile;
  user2: Profile;
  user: Profile & {
    photo_url?: string;
    gallery?: Array<{ photo_url: string }>;
  };
}

export const useMatches = () => {
  return useQuery<Match[]>({
    queryKey: ['matches'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          user1:profiles!matches_user1_id_fkey(
            id, 
            username,
            fullname, 
            gender, 
            dob, 
            bio,
            gallery:profile_gallary!inner(photo_url)
          ),
          user2:profiles!matches_user2_id_fkey(
            id, 
            username,
            fullname, 
            gender, 
            dob, 
            bio,
            gallery:profile_gallary!inner(photo_url)
          )
        `)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

      if (error) throw error;

      return data.map(match => {
        const matchedUser = match.user1_id === user.id ? match.user2 : match.user1;
        return {
          ...match,
          user: {
            ...matchedUser,
            // Use the first image from gallery as avatar if available
            photo_url: matchedUser.gallery?.[0]?.photo_url || null
          },
          id: match.id
        };
      });
    }
  });
};