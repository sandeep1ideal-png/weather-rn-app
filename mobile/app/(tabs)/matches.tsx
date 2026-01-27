import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Heart, MessageCircle, X } from "lucide-react-native";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useRouter } from "expo-router";
import { useNearbyUsers } from "@/src/hooks/useNearbyUsers";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2; // 2 columns with padding

type Match = {
  id: string;
  name: string;
  age: number;
  image: string;
  matchPercentage: number;
  distance: string;
  isNew: boolean;
};

const matchesData: Match[] = [
  {
    id: "1",
    name: "Emma",
    age: 26,
    image:
      "https://vhgfggyimfjnywwaieoa.supabase.co/storage/v1/object/public/profile-photos/2ff2fe3b-c7c0-4d2f-a4c0-df7868338223/photo-1-1769165633211.jpg",
    matchPercentage: 95,
    distance: "2 km away",
    isNew: true,
  },
  {
    id: "2",
    name: "Sophia",
    age: 24,
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&auto=format&fit=crop&q=60",
    matchPercentage: 89,
    distance: "5 km away",
    isNew: true,
  },
  {
    id: "3",
    name: "Olivia",
    age: 28,
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=900&auto=format&fit=crop&q=60",
    matchPercentage: 92,
    distance: "3 km away",
    isNew: false,
  },
  {
    id: "4",
    name: "Isabella",
    age: 25,
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=60",
    matchPercentage: 88,
    distance: "4 km away",
    isNew: false,
  },
  {
    id: "5",
    name: "Mia",
    age: 27,
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop&q=60",
    matchPercentage: 90,
    distance: "6 km away",
    isNew: false,
  },
  {
    id: "6",
    name: "Charlotte",
    age: 26,
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&auto=format&fit=crop&q=60",
    matchPercentage: 87,
    distance: "7 km away",
    isNew: false,
  },
];

export default function MatchesScreen() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>(matchesData);

  const newMatches = matches.filter((m) => m.isNew);
  const allMatches = matches.filter((m) => !m.isNew);

  const handleRemoveMatch = (id: string) => {
    setMatches(matches.filter((m) => m.id !== id));
  };
  // const { users, isLoading, error} = useNearbyUsers(10);
  // console.log('users', users);

  const MatchCard = ({ match }: { match: Match }) => (
    <View style={{ width: CARD_WIDTH, marginBottom: 16 }}>
      <View className="bg-white rounded-2xl overflow-hidden shadow-sm">
        {/* Image */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push(`/details/${2}`)}
          
        >
          <View className="relative">
            <Image
              source={{ uri: match.image }}
              style={{ width: "100%", height: 200 }}
              resizeMode="cover"
            />

            {/* Match Percentage Badge */}
            <View className="absolute top-3 right-3 bg-white/95 rounded-full px-3 py-1">
              <Text className="text-xs font-bold" style={{ color: "#EF5A6F" }}>
                {match.matchPercentage}% Match
              </Text>
            </View>

            {/* Gradient Overlay */}
            <View
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 80,
                backgroundImage:
                  "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
              }}
            />

            {/* Name & Age */}
            <TouchableOpacity
              className="absolute bottom-3 left-3"
              onPress={() => router.push(`/details/${2}`)}
            >
              <Text className="text-white font-bold text-lg">
                {match.name}, {match.age}
              </Text>
              <Text className="text-white/90 text-xs mt-0.5">
                {match.distance}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Action Buttons */}
        <View className="flex-row items-center justify-around py-3 px-2">
          <TouchableOpacity
            onPress={() => handleRemoveMatch(match.id)}
            className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center"
          >
            <X size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            className="w-12 h-12 rounded-full items-center justify-center"
            style={{ backgroundColor: "#EF5A6F" }}
          >
            <MessageCircle size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center">
            <Heart size={20} color="#EF5A6F" fill="#EF5A6F" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 flex-row items-center justify-between border-b border-gray-100">
        <View>
          <Text className="text-2xl font-bold text-gray-900">Matches</Text>
          <Text className="text-sm text-gray-500 mt-0.5">
            {matches.length} {matches.length === 1 ? "match" : "matches"}
          </Text>
        </View>
        <ThemeToggle />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* New Matches Section */}
        {newMatches.length > 0 && (
          <View className="mb-6">
            <View className="flex-row items-center mb-4">
              <View
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: "#EF5A6F" }}
              />
              <Text className="text-lg font-bold text-gray-900">
                New Matches ({newMatches.length})
              </Text>
            </View>

            <View className="flex-row flex-wrap justify-between">
              {newMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </View>
          </View>
        )}

        {/* All Matches Section */}
        {allMatches.length > 0 && (
          <View>
            <Text className="text-lg font-bold text-gray-900 mb-4">
              All Matches ({allMatches.length})
            </Text>

            <View className="flex-row flex-wrap justify-between">
              {allMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </View>
          </View>
        )}

        {/* Empty State */}
        {matches.length === 0 && (
          <View className="flex-1 items-center justify-center py-20">
            <View
              className="w-20 h-20 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: "#FEE2E2" }}
            >
              <Heart size={40} color="#EF5A6F" />
            </View>
            <Text className="text-xl font-bold text-gray-900 mb-2">
              No Matches Yet
            </Text>
            <Text className="text-gray-500 text-center px-8">
              Start swiping to find your perfect match!
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
