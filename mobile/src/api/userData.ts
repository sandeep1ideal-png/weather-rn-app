// Shared user data store for the app
export type UserProfile = {
  id: string;
  name: string;
  age: number;
  location: string;
  distance: string;
  bio: string;
  interests: string[];
  photos: string[];
  matchPercentage?: number;
  isNew?: boolean;
};

// Mock user profiles database
export const userProfiles: UserProfile[] = [
  {
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
  },
  {
    id: "2",
    name: "Sophia",
    age: 24,
    location: "Brooklyn",
    distance: "5 km away",
    bio: "Artist and yoga instructor 🧘‍♀️ Passionate about wellness, creativity, and meaningful connections. Let's create beautiful memories together!",
    interests: ["Yoga", "Art", "Meditation", "Dance", "Cooking"],
    photos: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800",
    ],
    matchPercentage: 89,
    isNew: true,
  },
  {
    id: "3",
    name: "Olivia",
    age: 28,
    location: "Manhattan",
    distance: "3 km away",
    bio: "Marketing professional by day, foodie by night 🍕 Love trying new restaurants and weekend getaways. Looking for my partner in crime!",
    interests: ["Food", "Travel", "Wine", "Reading", "Movies"],
    photos: [
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=900&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800",
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800",
    ],
    matchPercentage: 92,
    isNew: false,
  },
  {
    id: "4",
    name: "Isabella",
    age: 25,
    location: "Queens",
    distance: "4 km away",
    bio: "Fitness trainer and outdoor enthusiast 🏃‍♀️ Living an active lifestyle and looking for someone who shares my passion for health and adventure!",
    interests: ["Fitness", "Running", "Cycling", "Nutrition", "Beach"],
    photos: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800",
    ],
    matchPercentage: 88,
    isNew: false,
  },
  {
    id: "5",
    name: "Mia",
    age: 27,
    location: "Bronx",
    distance: "6 km away",
    bio: "Software engineer who loves tech and gaming 🎮 Also enjoy hiking and stargazing. Seeking someone intelligent and fun to share adventures with!",
    interests: ["Gaming", "Tech", "Hiking", "Astronomy", "Coding"],
    photos: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800",
    ],
    matchPercentage: 90,
    isNew: false,
  },
  {
    id: "6",
    name: "Charlotte",
    age: 26,
    location: "Staten Island",
    distance: "7 km away",
    bio: "Fashion designer with a love for vintage finds 👗 Passionate about sustainable fashion and creative expression. Let's make the world more beautiful!",
    interests: ["Fashion", "Design", "Vintage", "Art", "Shopping"],
    photos: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800",
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800",
    ],
    matchPercentage: 87,
    isNew: false,
  },
];

// Simple in-memory store for selected user
let selectedUserId: string | null = null;

export const setSelectedUser = (id: string) => {
  selectedUserId = id;
};

export const getSelectedUser = (): UserProfile | null => {
  if (!selectedUserId) return null;
  return userProfiles.find((user) => user.id === selectedUserId) || null;
};

export const getUserById = (id: string): UserProfile | null => {
  return userProfiles.find((user) => user.id === id) || null;
};