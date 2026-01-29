// src/api/users.ts
import { supabase } from '@/lib/supabase';

export type NearbyUser = {
  id: string;
  username: string;
  fullname: string;
  gender: string;
  bio: string;
  age?: number;
  distance_km?: number;
  photo_url?: string;
  is_primary?: boolean;
  location?:any;
  interests?: string[];
};

export const fetchNearbyUsers = async (
  userId: string,
  latitude: number,
  longitude: number,
  distanceKm: number = 10
): Promise<NearbyUser[]> => {
  console.log('aaaabbb',{
      userId:'userId',
      latitude:'latitude',
      longitude:'longitude',
      distanceKm:'distanceKm'
    })
  // const { data, error } = await supabase.rpc('get_nearby_users', {
  //   user_id: userId,
  //   user_lat: latitude,
  //   user_lng: longitude,
  //   max_distance_km: distanceKm
  // });
  // console.log('data',data,'data')

  const { data, error } = await supabase.rpc('get_nearby_users_with_photos', {
  user_id: userId,
  user_lat: latitude,
  user_lng: longitude,
  max_distance_km: distanceKm || 10  // Ensure it's not 0
});

  if (error) {
    console.log('Error fetching nearby users:', error);
    
    throw error;
  }

  return data || [];
};

// Function to upload a profile photo
export const uploadProfilePhoto = async (
  userId: string,
  file: File | Blob,
  isPrimary: boolean = false,
  position: number = 0
) => {
  const fileName = `profile_gallary/${userId}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  
  // Upload to storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('profile-photos')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('profile-photos')
    .getPublicUrl(fileName);

  // Save to profile_gallary table
  const { data, error } = await supabase
    .from('profile_gallary')
    .insert({
      user_id: userId,
      photo_url: publicUrl,
      is_primary: isPrimary,
      position: position
    })
    .select()
    .single();

  if (error) {
    // Clean up the uploaded file if database insert fails
    await supabase.storage
      .from('profile-photos')
      .remove([fileName]);
    throw error;
  }

  return data;
};

export async function uploadToSupabase(imageUri: string, slotId: number, userId: any) {
  try {
    console.log('Starting upload for slot:', slotId);
    
    // For React Native, we need to handle the file differently
    const formData:any = new FormData();
    const fileName = imageUri.split('/').pop();
    const fileType = 'image/jpeg'; // or detect from file extension
    
    formData.append('file', {
      uri: imageUri,
      name: fileName,
      type: fileType,
    });

    // Generate unique filename with user ID
    const storagePath = `${userId}/photo-${slotId}-${Date.now()}.jpg`;

    console.log('Uploading file to path:', storagePath);
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('profile-photos')
      .upload(storagePath, formData, {
        contentType: fileType,
        upsert: true,
      });

    if (error) {
      console.log('Supabase upload error:', error);
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(storagePath);

    console.log('Upload successful, public URL:', publicUrl);
    // Save to profile_gallary table
  const { data:res, error:er } = await supabase
    .from('profile_gallary')
    .insert({
      user_id: userId,
      photo_url: publicUrl,
      is_primary: true,
      position: 0
    })
    .select()
    .single();

  if (er) {
    // Clean up the uploaded file if database insert fails
    await supabase.storage
      .from('profile-photosk')
      .remove([fileName]);
    throw error;
  }

  return data;
    // return publicUrl;
  } catch (error) {
    console.error('Upload error details:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
      statusCode: error.statusCode,
    });
    throw error;
  }
}

// Add this function to your users.ts file
export const fetchUserById = async (userId: string): Promise<NearbyUser | null> => {
  const { data, error } = await supabase
    .from('profiles')  // or whatever your users table is called
    .select(`
      id,
      username,
      fullname,
      gender,
      bio,
      interests,
      location,
      photos:profile_gallary(photo_url, is_primary)
    `)
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }

  // Format the data to match your NearbyUser type
  const primaryPhoto = data.photos?.find((p: any) => p.is_primary) || data.photos?.[0];
  
  return {
    ...data,
    photo_url: primaryPhoto?.photo_url,
    // distance_km: 0 // This might not be relevant for a single user view
  };
};