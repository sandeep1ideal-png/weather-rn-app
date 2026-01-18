import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, MessageCircle, X } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

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
    id: '1',
    name: 'Emma',
    age: 26,
    image: 'https://images.unsplash.com/photo-1739133783212-e1c93795d9c7?w=900&auto=format&fit=crop&q=60',
    matchPercentage: 95,
    distance: '2 km away',
    isNew: true,
  },
  {
    id: '2',
    name: 'Sophia',
    age: 24,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&auto=format&fit=crop&q=60',
    matchPercentage: 89,
    distance: '5 km away',
    isNew: true,
  },
  {
    id: '3',
    name: 'Olivia',
    age: 28,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=900&auto=format&fit=crop&q=60',
    matchPercentage: 92,
    distance: '3 km away',
    isNew: false,
  },
];

const MatchesScreen = () => {
  const [matches, setMatches] = useState(matchesData);

  const newMatches = matches.filter(m => m.isNew);
  const allMatches = matches.filter(m => !m.isNew);

  const handleRemoveMatch = (id: string) => {
    setMatches(prev => prev.filter(m => m.id !== id));
  };

  const MatchCard = ({ match }: { match: Match }) => (
    <View style={{ width: CARD_WIDTH, marginBottom: 16 }}>
      <View className="bg-white rounded-2xl overflow-hidden shadow-sm">
        {/* Image */}
        <View className="relative">
          <Image
            source={{ uri: match.image }}
            style={{ width: '100%', height: 200 }}
            resizeMode="cover"
          />
          
          {/* Match Percentage Badge */}
          <View className="absolute top-3 right-3 bg-white/95 rounded-full px-3 py-1">
            <Text className="text-xs font-bold" style={{ color: '#EF5A6F' }}>
              {match.matchPercentage}% Match
            </Text>
          </View>

          {/* Gradient Overlay */}
          <View 
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 80,
              background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
            }}
          />

          {/* Name & Age */}
          <View className="absolute bottom-3 left-3">
            <Text className="text-white font-bold text-lg">
              {match.name}, {match.age}
            </Text>
            <Text className="text-white/90 text-xs mt-0.5">{match.distance}</Text>
          </View>
        </View>

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
            style={{ backgroundColor: '#EF5A6F' }}
          >
            <MessageCircle size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center"
          >
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
            {matches.length} {matches.length === 1 ? 'match' : 'matches'}
          </Text>
        </View>
        {/* <ThemeToggle /> */}
      </View>

      <ScrollView 
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* New Matches Section */}
        {newMatches.length > 0 && (
          <View className="mb-6">
            <View className="flex-row items-center mb-4">
              <View 
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: '#EF5A6F' }}
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
              style={{ backgroundColor: '#FEE2E2' }}
            >
              <Heart size={40} color="#EF5A6F" />
            </View>
            <Text className="text-xl font-bold text-gray-900 mb-2">No Matches Yet</Text>
            <Text className="text-gray-500 text-center px-8">
              Start swiping to find your perfect match!
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Matches</Text>
          <Text style={styles.headerSubtitle}>
            {matches.length} {matches.length === 1 ? 'match' : 'matches'}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {newMatches.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              New Matches ({newMatches.length})
            </Text>
            <View style={styles.grid}>
              {newMatches.map(m => (
                <MatchCard key={m.id} match={m} />
              ))}
            </View>
          </View>
        )}

        {allMatches.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              All Matches ({allMatches.length})
            </Text>
            <View style={styles.grid}>
              {allMatches.map(m => (
                <MatchCard key={m.id} match={m} />
              ))}
            </View>
          </View>
        )}

        {matches.length === 0 && (
          <View style={styles.empty}>
            <Heart size={40} color="#EF5A6F" />
            <Text style={styles.emptyTitle}>No Matches Yet</Text>
            <Text style={styles.emptyText}>
              Start swiping to find your perfect match!
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111827',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardWrapper: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  matchBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  matchBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EF5A6F',
  },
  nameContainer: {
    position: 'absolute',
    bottom: 12,
    left: 12,
  },
  nameText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  distanceText: {
    color: '#E5E7EB',
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#EF5A6F',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
});

export default MatchesScreen;
