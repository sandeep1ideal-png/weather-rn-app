import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  PanResponder,
  Modal,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bell, Search, Sliders, MapPin, X } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { setSelectedUser } from "@/src/api/userData";
// import { setSelectedUser } from "../userData";
import { useNearbyUsers } from "@/src/hooks/useNearbyUsers";
import { likeUser } from "@/src/api/likes";
import { useAuth } from "@/src/context/AuthContext";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const SWIPE_THRESHOLD = 120;

type Profile1 = {
  id: number;
  name: string;
  age: number;
  distance: string;
  location: string;
  images: string[];
  bio: string;
  interests: string[];
};
type Photo = {
  url: string;
};

type Profile = {
  id: number;
  name: string;
  age: number;
  distance: string;
  location: string;
  photos: Photo[];
  images: string[];

  bio: string;
  interests: string[];
};

const profiles2: Profile[] = [
  {
    id: 1,
    name: "Sephia",
    age: 26,
    distance: "3.2 km away",
    location: "New York",
    photos: [
      {
        url: "https://photos.unsplash.com/photo-1494790108377-be9c29b29330?w=800",
      },
      {
        url: "https://photos.unsplash.com/photo-1524504388940-b1c1722653e1?w=800",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800",
    ],
    bio: "Adventure seeker | Coffee lover ☕ | Love to travel and explore new places 🌍",
    interests: ["Music", "Dance", "Cooking", "Kids"],
  },
  {
    id: 2,
    name: "Emma",
    age: 24,
    distance: "5.1 km away",
    location: "Brooklyn",
    photos: [
      {
        url: "https://photos.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800",
      },
      {
        url: "https://photos.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800",
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800",
    ],
    bio: "Yoga instructor 🧘‍♀️ | Nature lover | Looking for genuine connections",
    interests: ["Yoga", "Travel", "Photography", "Cooking"],
  },
  {
    id: 3,
    name: "Olivia",
    age: 28,
    distance: "2.8 km away",
    location: "Manhattan",
    photos: [
      {
        url: "https://photos.unsplash.com/photo-1534528741775-53994a69daeb?w=800",
      },
      {
        url: "https://photos.unsplash.com/photo-1517841905240-472988babdf9?w=800",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800",
    ],
    bio: "Artist & Designer | Dog mom 🐕 | Wine enthusiast 🍷",
    interests: ["Art", "Design", "Wine", "Dogs"],
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showProfile, setShowProfile] = useState(false);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedProfile, setMatchedProfile]: any = useState<Profile | null>(
    null,
  );

  const position = useRef(new Animated.ValueXY()).current;
  const { users: profiles, isLoading, error } = useNearbyUsers(10);
  const {  userToken } = useAuth();
  const {user} = JSON.parse(userToken)

  // const profiles:any  = users.filter((m:any) => m.photos?.length>0);

  const rotation = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ["-10deg", "0deg", "10deg"],
    extrapolate: "clamp",
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: position.x, dy: position.y }],
        {
          useNativeDriver: false,
        },
      ),
      // onPanResponderRelease: (_, gesture) => {
      //   if (gesture.dx > SWIPE_THRESHOLD) {
      //       console.log('if kkkkkkkkkkkkkkkkkkkkkk')
      //     swipeRight();
      //   } else if (gesture.dx < -SWIPE_THRESHOLD) {
      //               console.log('else kkkkkkkkkkkkkkkkkkkkkk')

      //     swipeLeft();
      //   } else {
      //     Animated.spring(position, {
      //       toValue: { x: 0, y: 0 },
      //       useNativeDriver: false,
      //     }).start();
      //   }
      // },
      onPanResponderRelease: async (_, gesture) => {
  if (gesture.dx > SWIPE_THRESHOLD) {
    console.log('Swiping right - Liking user');
    await swipeRight();
  } else if (gesture.dx < -SWIPE_THRESHOLD) {
    console.log('Swiping left');
    swipeLeft();
  } else {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 4,
      useNativeDriver: false,
    }).start();
  }
}
    }),
  ).current;

  const swipeRight1 = () => {
    Animated.timing(position, {
      toValue: { x: SCREEN_WIDTH + 100, y: 0 },
      duration: 300,
      useNativeDriver: false,
    }).start(async () => {
      const success = await likeUser(user.id,currentProfile.id);
      if (success) {
        // Show some feedback for like
        console.log('Liked user:', currentProfile.name);
      }

      setMatchedProfile(profiles[currentIndex]);
      setShowMatch(true);
      nextCard();
    });
  };
    const currentProfile: any = profiles[currentIndex];

const swipeRight = useCallback(async () => {
  // if (!currentProfile || !user?.id) return;

  try {
    console.log('Liked user:profiles1[currentIndex]', currentIndex);
   console.log(JSON.stringify(profiles))
    // const success =  likeUser(user.id, currentProfile.id);
    // if (success) {
    // } else {
    //   console.error('Failed to like user');
    //   return;
    // }

    Animated.timing(position, {
      toValue: { x: SCREEN_WIDTH + 100, y: 0 },
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setMatchedProfile(profiles[currentIndex]);
      setShowMatch(true);
      nextCard();
    });
  } catch (error) {
    console.error('Error in swipeRight:', error);
  }
}, []);
// currentProfile, currentIndex, profiles1, user?.id
  const swipeLeft = () => {
    Animated.timing(position, {
      toValue: { x: -SCREEN_WIDTH - 100, y: 0 },
      duration: 300,
      useNativeDriver: false,
    }).start(() => nextCard());
  };

  const nextCard = () => {
    position.setValue({ x: 0, y: 0 });
    setCurrentIndex((prev) => (prev + 1) % profiles.length);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.matchInfo}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
            }}
            style={styles.matchAvatar}
          />
          <View>
            <Text style={styles.matchText}>Your 5 Matches</Text>
            <Text style={styles.timer}>04 : 45 : 05</Text>
          </View>
        </View>
        <View style={styles.notificationBadge}>
          <Text style={styles.badgeText}>3</Text>
        </View>
        <TouchableOpacity>
          <Bell size={28} color="#1F2937" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={24} color="#6B7280" />
          <Text style={styles.searchText}>Search People</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Sliders size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      {/* Profile Cards */}
      <View style={styles.cardContainer}>
        {profiles
          .slice(currentIndex)
          .reverse()
          .map((profile: any, reversedIndex) => {
            const index = profiles.length - 1 - reversedIndex + currentIndex;
            const actualIndex =
              currentIndex +
              (profiles.slice(currentIndex).length - 1 - reversedIndex);
            const isTopCard = actualIndex === currentIndex;

            if (actualIndex > currentIndex + 1) return null; // Only show current and next card

            return (
              <Animated.View
                key={profile.id}
                style={[
                  styles.card,
                  {
                    zIndex: isTopCard ? 10 : 1,
                    transform: isTopCard
                      ? [
                          { translateX: position.x },
                          { translateY: position.y },
                          { rotate: rotation },
                        ]
                      : [{ scale: 0.95 }],
                    opacity: isTopCard ? 1 : 0.8,
                  },
                ]}
                pointerEvents={isTopCard ? "auto" : "none"}
                {...(isTopCard ? panResponder.panHandlers : {})}
              >
                {/* <Image
                  source={{ uri: profile.photos[0]?.url }}
                  style={styles.cardImage}
                /> */}
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    // setSelectedUser(profile); // Set the selected user data
                    // router.push(`/details/${profile.id}`); // Navigate to details page
                  }}
                >
                  <Image
                    source={{ uri: profile.photos[0]?.url }}
                    style={styles.cardImage}
                  />
                </TouchableOpacity>

                {isTopCard && (
                  <>
                    {/* NOPE Overlay */}
                    <Animated.View
                      style={[styles.nopeOverlay, { opacity: nopeOpacity }]}
                    >
                      <View style={styles.nopeLabel}>
                        <Text style={styles.nopeLabelText}>NOPE</Text>
                      </View>
                    </Animated.View>

                    {/* LIKE Overlay */}
                    <Animated.View
                      style={[styles.likeOverlay, { opacity: likeOpacity }]}
                    >
                      <View style={styles.likeLabel}>
                        <Text style={styles.likeLabelText}>LIKE</Text>
                      </View>
                    </Animated.View>
                  </>
                )}

                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.8)"]}
                  style={styles.gradient}
                >
                  <View style={styles.cardInfo}>
                    <View style={styles.profileHeader}>
                      <Image
                        source={{ uri: profile.photos[0]?.url }}
                        style={styles.smallAvatar}
                      />
                      {/* <View style={styles.nameContainer}> */}
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                          setSelectedUser(profile); // Set the selected user data
                          router.push(`/details/${profile.id}`); // Navigate to details page
                        }}
                        style={styles.nameContainer}
                      >
                        <Text style={styles.name}>
                          {profile.username}, {profile.age}
                        </Text>
                        <View style={styles.locationRow}>
                          <MapPin size={16} color="#FFFFFF" />
                          <Text style={styles.location}>{profile.gender}</Text>
                          <Text style={styles.distance}>
                            {profile.distance_km}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    {/* </View> */}

                    <View style={styles.interestsRow}>
                      {/* {profile?.interests?.map((interest, idx) => (
                        <View key={idx} style={styles.interestChip}>
                          <Text style={styles.interestText}>{interest}</Text>
                        </View>
                      ))} */}
                      <View style={styles.interestChip}>
                        <Text style={styles.interestText}>{`interest`}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.moreButton}
                        onPress={() => setShowProfile(true)}
                      >
                        <Text style={styles.moreText}>•••</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </LinearGradient>
              </Animated.View>
            );
          })}
      </View>

      {/* Profile Detail Modal */}
      <Modal visible={showProfile} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.profileModal}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowProfile(false)}
            >
              <X size={28} color="#1F2937" />
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Image
                source={{ uri: currentProfile?.photos[0]?.url }}
                style={styles.modalImage}
              />

              <View style={styles.modalContent}>
                <Text style={styles.modalName}>
                  {currentProfile?.name}, {currentProfile?.age}
                </Text>

                <View style={styles.modalLocationRow}>
                  <MapPin size={20} color="#6B7280" />
                  <Text style={styles.modalLocation}>
                    {currentProfile?.location} • {currentProfile?.distance}
                  </Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>About</Text>
                  <Text style={styles.bioText}>{currentProfile?.bio}</Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Interests</Text>
                  <View style={styles.modalInterests}>
                    {/* {currentProfile?.interests.map((interest, idx) => (
                      <View key={idx} style={styles.modalInterestChip}>
                        <Text style={styles.modalInterestText}>{interest}</Text>
                      </View>
                    ))} */}
                    <View style={styles.modalInterestChip}>
                      <Text style={styles.modalInterestText}>interest</Text>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Match Modal */}
      <Modal visible={showMatch} animationType="fade" transparent>
        <View style={styles.matchModalOverlay}>
          <View style={styles.matchModal}>
            <Text style={styles.matchTitle}>It's a Match!</Text>
            <Text style={styles.matchSubtitle}>
              You and {matchedProfile?.name} have liked each other
            </Text>

            <View style={styles.matchAvatars}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
                }}
                style={styles.matchAvatar1}
              />
              <View style={styles.heartIcon}>
                <Text style={styles.heartEmoji}>💕</Text>
              </View>
              <Image
                source={{ uri: matchedProfile?.photos[0]?.url }}
                style={styles.matchAvatar2}
              />
            </View>

            <TouchableOpacity
              style={styles.sendMessageButton}
              onPress={() => setShowMatch(false)}
            >
              <Text style={styles.sendMessageText}>Send Message</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.keepSwipingButton}
              onPress={() => setShowMatch(false)}
            >
              <Text style={styles.keepSwipingText}>Keep Swiping</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  matchInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  matchAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  matchText: {
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "400",
  },
  timer: {
    fontSize: 16,
    color: "#EF5A6F",
    fontWeight: "600",
  },
  notificationBadge: {
    position: "absolute",
    right: 60,
    top: 16,
    backgroundColor: "#EF5A6F",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchText: {
    fontSize: 16,
    color: "#6B7280",
  },
  filterButton: {
    width: 50,
    height: 50,
    backgroundColor: "#F9FAFB",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    position: "absolute",
    width: SCREEN_WIDTH - 40,
    height: SCREEN_HEIGHT * 0.65,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 250,
    justifyContent: "flex-end",
    padding: 20,
  },
  cardInfo: {
    gap: 16,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  smallAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  location: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  distance: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "400",
  },
  interestsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  interestChip: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  interestText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  moreButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  moreText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  nopeOverlay: {
    position: "absolute",
    top: 50,
    right: 30,
    zIndex: 10,
  },
  nopeLabel: {
    borderWidth: 4,
    borderColor: "#EF4444",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    transform: [{ rotate: "20deg" }],
  },
  nopeLabelText: {
    fontSize: 32,
    fontWeight: "800",
    color: "#EF4444",
  },
  likeOverlay: {
    position: "absolute",
    top: 50,
    left: 30,
    zIndex: 10,
  },
  likeLabel: {
    borderWidth: 4,
    borderColor: "#10B981",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    transform: [{ rotate: "-20deg" }],
  },
  likeLabelText: {
    fontSize: 32,
    fontWeight: "800",
    color: "#10B981",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  profileModal: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.9,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: "#FFFFFF",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  modalImage: {
    width: "100%",
    height: 400,
  },
  modalContent: {
    padding: 24,
  },
  modalName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
  },
  modalLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 24,
  },
  modalLocation: {
    fontSize: 16,
    color: "#6B7280",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
  },
  bioText: {
    fontSize: 16,
    color: "#4B5563",
    lineHeight: 24,
  },
  modalInterests: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  modalInterestChip: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#EF5A6F",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  modalInterestText: {
    color: "#EF5A6F",
    fontSize: 14,
    fontWeight: "500",
  },
  matchModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(239, 90, 111, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  matchModal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    width: "100%",
  },
  matchTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#EF5A6F",
    marginBottom: 8,
  },
  matchSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
  },
  matchAvatars: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  matchAvatar1: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  matchAvatar2: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  heartIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: -20,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  heartEmoji: {
    fontSize: 32,
  },
  sendMessageButton: {
    backgroundColor: "#EF5A6F",
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 30,
    width: "100%",
    marginBottom: 12,
  },
  sendMessageText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  keepSwipingButton: {
    paddingVertical: 12,
  },
  keepSwipingText: {
    color: "#6B7280",
    fontSize: 16,
    fontWeight: "500",
  },
});
