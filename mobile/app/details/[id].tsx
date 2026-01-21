import { useLocalSearchParams } from 'expo-router';

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  MoreVertical,
  MapPin,
  Heart,
  MessageCircle,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.7;
const CARD_SPACING = 16;


export default function DetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [data, setData] = useState<any>(null);


    const router = useRouter();
  const [profileData, setProfileData] = useState<any | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const translateX = useSharedValue(0);


  useEffect(() => {
    if (!id) return;

    // Example API call
    // fetch(`https://api.example.com/item/${id}`)
    //   .then(res => res.json())
    //   .then(setData)
    //   .catch(console.error);
  }, [id]);

  useEffect(() => {
    // Get the selected user from the store
        setProfileData( {
    id: "1",
    name: "Emma",
    age: 26,
    location: "New York",
    distance: "2 km away",
    bio: "Adventure seeker and coffee enthusiast ☕️ Love exploring new places and trying different cuisines. Looking for someone to share life's beautiful moments with!",
    interests: ["Travel", "Photography", "Coffee", "Hiking", "Music"],
    photos: [
      "https://images.unsplash.com/photo-1739133783212-e1c93795d9c7?w=900&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800",
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800",
    ],
    matchPercentage: 95,
    isNew: true,
  });

  }, [id]);
 

  const updatePhoto = (newIndex: number) => {
    setSelectedPhoto(newIndex);
  };

  
  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      const swipeThreshold = 50;

      if (event.translationX > swipeThreshold && selectedPhoto > 0) {
        // Swipe right - previous photo
        runOnJS(updatePhoto)(selectedPhoto - 1);
        translateX.value = withSpring(0);
      } else if (
        event.translationX < -swipeThreshold &&
        selectedPhoto < profileData.photos.length - 1
      ) {
        // Swipe left - next photo
        runOnJS(updatePhoto)(selectedPhoto + 1);
        translateX.value = withSpring(0);
      } else {
        // Reset position
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });
  if (!profileData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#EF5A6F" />
        </View>
      </SafeAreaView>
    );
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.headerButton}
            >
              <ArrowLeft size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Details</Text>
            <TouchableOpacity style={styles.headerButton}>
              <MoreVertical size={24} color="#1F2937" />
            </TouchableOpacity>
          </View>

          {/* Carousel Photo Section */}
          <View style={styles.carouselSection}>
            {/* Photo Counter */}
            <View style={styles.photoCounter}>
              <Text style={styles.photoCounterText}>
                {selectedPhoto + 1} / {profileData.photos.length}
              </Text>
            </View>

            {/* Carousel Container */}
            <View style={styles.carouselContainer}>
              <GestureDetector gesture={gesture}>
                <Animated.View style={[styles.carouselTrack, animatedStyle]}>
                  {profileData.photos.map((photo, index) => {
                    const offset = index - selectedPhoto;
                    const isCenter = offset === 0;
                    const isPrev = offset === -1;
                    const isNext = offset === 1;
                    const isVisible = isPrev || isCenter || isNext;

                    if (!isVisible) return null;

                    return (
                      <TouchableOpacity
                        key={index}
                        activeOpacity={0.9}
                        onPress={() => {
                          if (isPrev && selectedPhoto > 0) {
                            setSelectedPhoto(selectedPhoto - 1);
                          } else if (
                            isNext &&
                            selectedPhoto < profileData.photos.length - 1
                          ) {
                            setSelectedPhoto(selectedPhoto + 1);
                          }
                        }}
                        style={[
                          styles.carouselCard,
                          {
                            transform: [
                              {
                                translateX:
                                  offset * (CARD_WIDTH + CARD_SPACING),
                              },
                              { scale: isCenter ? 1 : 0.85 },
                            ],
                            opacity: isCenter ? 1 : 0.5,
                            zIndex: isCenter ? 10 : 1,
                          },
                        ]}
                      >
                        <Image
                          source={{ uri: photo }}
                          style={styles.carouselImage}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </Animated.View>
              </GestureDetector>
            </View>

            {/* Dot Indicators */}
            <View style={styles.dotContainer}>
              {profileData.photos.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedPhoto(index)}
                  style={[
                    styles.dot,
                    selectedPhoto === index && styles.dotActive,
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Profile Info Card */}
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <Image
                source={{ uri: profileData.photos[0] }}
                style={styles.avatar}
              />
              <View style={styles.profileInfo}>
                <Text style={styles.name}>
                  {profileData.name}, {profileData.age}
                </Text>
                <View style={styles.locationRow}>
                  <MapPin size={16} color="#6B7280" />
                  <Text style={styles.location}>{profileData.location}</Text>
                  <Text style={styles.separator}>|</Text>
                  <Text style={styles.distance}>{profileData.distance}</Text>
                </View>
              </View>
            </View>

            {/* Bio */}
            <Text style={styles.bio}>{profileData.bio}</Text>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.likeButton}>
                <Heart size={24} color="#EF5A6F" />
                <Text style={styles.likeButtonText}>Like</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.messageButton}>
                <MessageCircle size={24} color="#FFFFFF" />
                <Text style={styles.messageButtonText}>Message</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Interests Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <View style={styles.interestsContainer}>
              {profileData.interests.map((interest, index) => (
                <View key={index} style={styles.interestChip}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Photo Gallery Section */}
          <View style={styles.section}>
            <View style={styles.photoHeader}>
              <Text style={styles.sectionTitle}>Photo</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.photoGrid}>
              {profileData.photos.map((photo, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.gridPhoto}
                  onPress={() => setSelectedPhoto(index)}
                >
                  <Image
                    source={{ uri: photo }}
                    style={styles.gridPhotoImage}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Bottom Spacing */}
          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
  },
  carouselSection: {
    marginBottom: 24,
    paddingTop: 16,
  },
  photoCounter: {
    position: "absolute",
    top: 32,
    right: 32,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 100,
  },
  photoCounterText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  carouselContainer: {
    height: 420,
    justifyContent: "center",
    alignItems: "center",
    overflow: "visible",
  },
  carouselTrack: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  carouselCard: {
    position: "absolute",
    width: CARD_WIDTH,
    height: 400,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#F3F4F6",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D1D5DB",
  },
  dotActive: {
    width: 24,
    backgroundColor: "#EF5A6F",
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  location: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  separator: {
    fontSize: 14,
    color: "#D1D5DB",
    marginHorizontal: 4,
  },
  distance: {
    fontSize: 14,
    color: "#6B7280",
  },
  bio: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  likeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#EF5A6F",
    borderRadius: 30,
    paddingVertical: 14,
    gap: 8,
  },
  likeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#EF5A6F",
  },
  messageButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EF5A6F",
    borderRadius: 30,
    paddingVertical: 14,
    gap: 8,
  },
  messageButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  interestChip: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  interestText: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "500",
  },
  photoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: "#EF5A6F",
    fontWeight: "600",
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  gridPhoto: {
    width: (SCREEN_WIDTH - 64) / 3,
    height: 140,
    borderRadius: 16,
    overflow: "hidden",
  },
  gridPhotoImage: {
    width: "100%",
    height: "100%",
  },
});
