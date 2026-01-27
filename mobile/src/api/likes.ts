// src/api/likes.ts
import { supabase } from '@/lib/supabase';

// Like a user
export const likeUser = async (likerId: string, likedUserId: string): Promise<boolean> => {
    console.log('likeUser', likedUserId)
  const { error } = await supabase
    .from('likes')
    .insert([{ 
      liker_id: likerId,  // Add the current user's ID as the liker
      liked_id: likedUserId,
    }]);

  if (error) {
    console.error('Error liking user:', error);
    return false;
  }
  return true;
};

// Unlike a user
export const unlikeUser = async (likerId: string, likedUserId: string): Promise<boolean> => {
  console.log('Attempting to unlike:', { likerId, likedUserId });
  
  const { data, error } = await supabase
    .from('likes')
    .delete()
    .match({ 
      liker_id: likerId,
      liked_id: likedUserId 
    })
    .select(); // Add this to see what was deleted

  console.log('Delete response:', { data, error });

  if (error) {
    console.error('Error unliking user:', {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint
    });
    return false;
  }
  
  console.log('Successfully unliked user. Rows affected:', data?.length);
  return true;
};
// export const unlikeUser = async (likerId:string, likedUserId: string): Promise<boolean> => {
//   const { error,data } = await supabase
//     .from('likes')
//     .delete()
//      .match({ 
//       liker_id: likerId,
//       liked_id: likedUserId 
//     });
    
// console.log(likerId,'ddd', likedUserId)
//   if (error) {
//     console.error('Error unliking user:', error);
//     return false;
//   }
//   return true;
// };

// Check if current user has liked another user
export const hasLikedUser = async (likerId: string, targetUserId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('likes')
    .select('id')
    .match({ 
      liker_id: likerId,
      liked_id: targetUserId 
    })
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    console.error('Error checking like status:', error);
    return false;
  }

  return !!data;
};

// Get all likes for current user
export const getUserLikes = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from('likes')
    .select('liked_id')
    .eq('liker_id', (await supabase.auth.getUser()).data.user?.id);

  if (error) {
    console.error('Error getting user likes:', error);
    return [];
  }

  return data.map(like => like.liked_id);
};