import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Plus, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/src/context/AuthContext';
import { uploadProfilePhoto, uploadToSupabase } from '@/src/api/users';

type PhotoSlot = {
  id: number;
  uri: string | null;
};

export default function EditPhoto() {

   const { signOut, signUpData } = useAuth();
  
    const handleLogout = async () => {
          const { error } =  await supabase.auth.signOut();
  
      signUpData({})
      signOut();
    };
  const router = useRouter();

  const { userToken }:any = useAuth();
  const user = JSON.parse(userToken);
  
  
  
  // Initialize 6 photo slots (Tinder-style: 1 large + 5 smaller)
  const [photos, setPhotos] = useState<PhotoSlot[]>([
    { id: 1, uri: null },
    { id: 2, uri: null },
    { id: 3, uri: null },
    { id: 4, uri: null },
    { id: 5, uri: null },
    { id: 6, uri: null },
  ]);

  // Request permissions and pick image
  const pickImage = async (slotId: number) => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera roll permissions to upload photos.');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: slotId === 1 ? [3, 4] : [1, 1], // First image is larger
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newPhotos = photos.map(photo =>
          photo.id === slotId ? { ...photo, uri: result.assets[0].uri } : photo
        );
        setPhotos(newPhotos);

        // TODO: Upload to Supabase Storage
        const imageUri = result.assets[0].uri;
        console.log('imageUri', imageUri);
        await uploadToSupabase(imageUri, slotId, user?.user?.id);
        //  const response = await fetch(result.assets[0].uri);
      // const blob = await response.blob();
      // await uploadPhoto(blob);
      // await uploadProfilePhoto(user.id, blob, true);
        // await uploadPhoto(blob);

      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  // Remove image from slot
  const removeImage = (slotId: number) => {
    const newPhotos = photos.map(photo =>
      photo.id === slotId ? { ...photo, uri: null } : photo
    );
    setPhotos(newPhotos);

    // TODO: Delete from Supabase Storage
    // await deleteFromSupabase(slotId);
  };

  // Save and go back
  const handleDone = () => {
    const uploadedCount = photos.filter(p => p.uri !== null).length;
    
    if (uploadedCount === 0) {
      Alert.alert('No Photos', 'Please add at least one photo to continue.');
      return;
    }

    // TODO: Save photo URLs to Supabase database
    // await savePhotosToDatabase(photos);
    
    Alert.alert('Success', `${uploadedCount} photo(s) uploaded successfully!`, [
      { text: 'OK', onPress: () => router.replace('/(tabs)') }
    ]);
  };

//   async function uploadToSupabase(imageUri: string, slotId: number) {
//   try {
//     console.log('Starting upload for slot:', slotId);

//     // Get the user ID
//     const userId = user?.user?.id;
//     if (!userId) {
//       throw new Error('User not authenticated');
//     }

//     console.log('User ID:', userId);

//     // Generate unique filename
//     const storagePath = `${userId}/photo-${slotId}-${Date.now()}.jpg`;
//     console.log('Uploading file to path:', storagePath);

//     // For React Native: fetch the file and convert to blob
//     const response = await fetch(imageUri);
//     const blob = await response.blob();

//     // Upload directly with blob
//     const { data, error } = await supabase.storage
//       .from('profile-photosk')
//       .upload(storagePath, blob, {
//         contentType: 'image/jpeg',
//         upsert: true,
//       });

//     if (error) {
//       console.error('Supabase upload error:', error);
//       throw error;
//     }

//     console.log('Upload successful:', data);

//     // Get public URL
//     const { data: { publicUrl } } = supabase.storage
//       .from('profile-photosk')
//       .getPublicUrl(storagePath);

//     console.log('Public URL:', publicUrl);
//     return publicUrl;
//   } catch (error) {
//     console.error('Upload error details:', {
//       message: error.message,
//       code: error.code,
//       details: error.details,
//       hint: error.hint,
//       statusCode: error.statusCode,
//     });
//     throw error;
//   }
// }

async function uploadToSupabase1(imageUri: string, slotId: number) {
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
    const userId = user?.user?.id;
    const storagePath = `${userId}/photo-${slotId}-${Date.now()}.jpg`;

    console.log('Uploading file to path:',userId, storagePath);
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('profile-photosk')
      .upload(storagePath, formData, {
        contentType: fileType,
        upsert: true,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('profile-photosk')
      .getPublicUrl(storagePath);

    console.log('Upload successful, public URL:', publicUrl);
    return publicUrl;
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
async function olduploadToSupabase(imageUri: string, slotId: number) {
    try {
      // Convert image to blob/file
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      // Generate unique filename
      const userId = user?.user?.id; // Get from auth
      const fileName = `${userId}/photo-${slotId}-${Date.now()}.jpg`;
      
      // Upload to Supabase Storage bucket 'profile-photosk'
      const { data, error } = await supabase.storage
        .from('profile-photosk')
        .upload(fileName, blob, {
          contentType: 'image/jpeg',
          upsert: true
        });
      
      if (error) throw error;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-photosk')
        .getPublicUrl(fileName);
      
      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }
  
  // 2. Delete Image from Supabase Storage:
  
  async function deleteFromSupabase(slotId: number) {
    try {
      const userId = 'user-id';
      const fileName = `${userId}/photo-${slotId}`;
      
      const { error } = await supabase.storage
        .from('profile-photosk')
        .remove([fileName]);
      
      if (error) throw error;
    } catch (error) {
      console.error('Delete error:', error);
    }
  }


  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header */}
        <View className="px-6 py-4 flex-row items-center">
          <TouchableOpacity onPress={() => handleLogout()} className="mr-4">
            <ArrowLeft className="text-foreground" size={24} />
          </TouchableOpacity>
        </View>

        {/* Title & Description */}
        <View className="px-6 mb-6">
          <Text className="text-3xl font-bold text-foreground text-center mb-3">
            Add Photos
          </Text>
          <Text className="text-sm text-muted-foreground text-center">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          </Text>
        </View>

        {/* Photo Grid */}
        <View className="px-6">
          {/* First Large Photo */}
          <PhotoSlot
            photo={photos[0]}
            onPress={() => pickImage(1)}
            onRemove={() => removeImage(1)}
            large
          />

          {/* Row 1: 2 medium photos */}
          <View className="flex-row gap-3 mb-3">
            <PhotoSlot
              photo={photos[1]}
              onPress={() => pickImage(2)}
              onRemove={() => removeImage(2)}
              className="flex-1"
            />
            <PhotoSlot
              photo={photos[2]}
              onPress={() => pickImage(3)}
              onRemove={() => removeImage(3)}
              className="flex-1"
            />
          </View>

          {/* Row 2: 3 small photos */}
          <View className="flex-row gap-3 mb-3">
            <PhotoSlot
              photo={photos[3]}
              onPress={() => pickImage(4)}
              onRemove={() => removeImage(4)}
              className="flex-1"
            />
            <PhotoSlot
              photo={photos[4]}
              onPress={() => pickImage(5)}
              onRemove={() => removeImage(5)}
              className="flex-1"
            />
            <PhotoSlot
              photo={photos[5]}
              onPress={() => pickImage(6)}
              onRemove={() => removeImage(6)}
              className="flex-1"
            />
          </View>
        </View>
      </ScrollView>

      {/* Fixed Done Button */}
      <View className="absolute bottom-0 left-0 right-0 p-6 bg-background">
        <TouchableOpacity
          onPress={handleDone}
          className="bg-[#EF4765] py-4 rounded-full items-center"
          style={{ elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}
        >
          <Text className="text-white font-semibold text-lg">Done</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Photo Slot Component
type PhotoSlotProps = {
  photo: PhotoSlot;
  onPress: () => void;
  onRemove: () => void;
  large?: boolean;
  className?: string;
};

function PhotoSlot({ photo, onPress, onRemove, large = false, className = '' }: PhotoSlotProps) {
  const height = large ? 'h-96' : 'h-40';

  return (
    <View className={`${height} ${className} mb-3`}>
      {photo.uri ? (
        // Image Preview with Remove Button
        <View className="flex-1 relative rounded-2xl overflow-hidden bg-muted">
          <Image
            source={{ uri: photo.uri }}
            className="w-full h-full"
            resizeMode="cover"
          />
          {/* Remove Button */}
          <TouchableOpacity
            onPress={onRemove}
            className="absolute top-2 right-2 bg-black/50 rounded-full p-2"
          >
            <X className="text-white" size={20} />
          </TouchableOpacity>
        </View>
      ) : (
        // Empty Slot with Plus Button
        <TouchableOpacity
          onPress={onPress}
          className="flex-1 bg-muted rounded-2xl items-center justify-center border-2 border-dashed border-border"
        >
          <Plus className="text-muted-foreground" size={large ? 48 : 32} />
        </TouchableOpacity>
      )}
    </View>
  );
}

/* 
 * TODO: Supabase Integration Functions
 * 
 * 1. Upload Image to Supabase Storage:
 * 
 * import { supabase } from '@/lib/supabase';
 * 
  async function uploadToSupabase(imageUri: string, slotId: number) {
    try {
      // Convert image to blob/file
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      // Generate unique filename
      const userId = 'user-id'; // Get from auth
      const fileName = `${userId}/photo-${slotId}-${Date.now()}.jpg`;
      
      // Upload to Supabase Storage bucket 'profile-photosk'
      const { data, error } = await supabase.storage
        .from('profile-photosk')
        .upload(fileName, blob, {
          contentType: 'image/jpeg',
          upsert: true
        });
      
      if (error) throw error;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-photosk')
        .getPublicUrl(fileName);
      
      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }
  
  2. Delete Image from Supabase Storage:
  
  async function deleteFromSupabase(slotId: number) {
    try {
      const userId = 'user-id';
      const fileName = `${userId}/photo-${slotId}`;
      
      const { error } = await supabase.storage
        .from('profile-photosk')
        .remove([fileName]);
      
      if (error) throw error;
    } catch (error) {
      console.error('Delete error:', error);
    }
  }
  
 * 3. Save Photo URLs to Database:
 * 
 * async function savePhotosToDatabase(photos: PhotoSlot[]) {
 *   try {
 *     const userId = 'user-id';
 *     const photoUrls = photos
 *       .filter(p => p.uri !== null)
 *       .map(p => p.uri);
 *     
 *     const { error } = await supabase
 *       .from('user_profiles')
 *       .update({ photos: photoUrls })
 *       .eq('id', userId);
 *     
 *     if (error) throw error;
 *   } catch (error) {
 *     console.error('Save error:', error);
 *     throw error;
 *   }
 * }
 * 
 * 4. Load Existing Photos:
 * 
 * async function loadPhotos() {
 *   try {
 *     const userId = 'user-id';
 *     
 *     const { data, error } = await supabase
 *       .from('user_profiles')
 *       .select('photos')
 *       .eq('id', userId)
 *       .single();
 *     
 *     if (error) throw error;
 *     
 *     // Map to photo slots
 *     const loadedPhotos = data.photos.map((uri: string, index: number) => ({
 *       id: index + 1,
 *       uri
 *     }));
 *     
 *     setPhotos(loadedPhotos);
 *   } catch (error) {
 *     console.error('Load error:', error);
 *   }
 * }
 */