// src/hooks/useNearbyUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchNearbyUsers, uploadProfilePhoto, NearbyUser } from '@/src/api/users';
import { useAuth } from '@/src/context/AuthContext';
import * as Location from 'expo-location';

export const useNearbyUsers = (distanceKm: number = 10) => {
  const { userToken }:any = useAuth();
  let user = JSON.parse(userToken)

  const queryClient = useQueryClient();


  const {
    data: users = [],
    isLoading,
    error,
    refetch,
  } = useQuery<NearbyUser[]>({
    queryKey: ['nearbyUsers', userToken?.user?.id, distanceKm],
    queryFn: async () => {
      if (!user?.user?.id) return [];
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission not granted');
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      console.log('user location', latitude, longitude);
      console.log('distance', distanceKm);
      return fetchNearbyUsers(user?.user?.id, 22.6901316, 75.7882854, 100);
    },
    enabled: !!user?.user?.id,
  });

  // const uploadPhotoMutation = useMutation({
  //   mutationFn: async (file: File | Blob) => {
  //     if (!user?.id) throw new Error('User not authenticated');
  //     return uploadProfilePhoto(user.id, file, true);
  //   },
  //   onSuccess: () => {
  //       console.log('user uploaded images')
  //     // Invalidate and refetch nearby users after successful upload
  //     queryClient.invalidateQueries({ queryKey: ['nearbyUsers'] });
  //   },
  //   onError: (error) => {
  //     console.log('Failed to upload photo:', error);
  //   }
  // });

  return {
    users,
    isLoading,
    error,
    refetch,
    // uploadPhoto: uploadPhotoMutation.mutateAsync,
    // isUploading: uploadPhotoMutation.isPending,
  };
};