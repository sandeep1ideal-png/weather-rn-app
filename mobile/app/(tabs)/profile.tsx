import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/src/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Settings, Bell, Shield, HelpCircle, ImageIcon, UserX } from 'lucide-react-native';
import { useRouter } from "expo-router";


const ProfileScreen = () => {
  const { signOut, signUpData } = useAuth();

  const handleLogout = async () => {
        const { error } =  await supabase.auth.signOut();

    signUpData({})
    signOut();
  };
  const router = useRouter();

  const menuItems = [
    // { icon: Settings, label: "Settings", onPress: () => {} },
    // { icon: Bell, label: "Notifications", onPress: () => {} },
    // { icon: Shield, label: "Privacy", onPress: () => {} },
    // { icon: HelpCircle, label: "Help & Support", onPress: () => {} },
    {
      icon: ImageIcon,
      label: "Edit Photos",
      onPress: () => router.replace('/edit-photo')
      ,
    },
    {
      icon: UserX,
      label: "Blocked Users",
      // onPress: () => router.push("/blocked-users"),
    },
  ];
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle-outline" size={100} color="#FF6B6B" />
          </View>
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.location}>New York, USA</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Matches</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>156</Text>
            <Text style={styles.statLabel}>Likes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>89%</Text>
            <Text style={styles.statLabel}>Profile Score</Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="person-outline" size={24} color="#666" />
            <Text style={styles.menuText}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="settings-outline" size={24} color="#666" />
            <Text style={styles.menuText}>Settings</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="help-circle-outline" size={24} color="#666" />
            <Text style={styles.menuText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
 <TouchableOpacity onPress={() => router.push("/edit-photo")} style={styles.menuItem}>
            <Ionicons name="help-circle-outline" size={24} color="#666" />
            <Text style={styles.menuText}>Edit Photos</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
             {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={item.onPress}
              className="bg-card rounded-xl p-4 flex-row items-center justify-between border border-border"
            >
              <View className="flex-row items-center gap-3">
                <View className="bg-pink-50 rounded-full p-2">
                  <item.icon color="#EF4765" size={20} />
                </View>
                <Text className="text-foreground font-medium">
                  {item.label}
                </Text>
              </View>
              {/* <ChevronRight color="#9CA3AF" size={20} /> */}
            </TouchableOpacity>
          ))}
           {/* {
      icon: ImageIcon,
      label: "Edit Photos",
      onPress: () => router.push("/edit-photos"),
    }, */}
          
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#FF6B6B" />
            <Text style={[styles.menuText, { color: '#FF6B6B' }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  location: {
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  menuContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
});

export default ProfileScreen;