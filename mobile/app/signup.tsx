import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Calendar,
  ChevronDown,
  ChevronLeft,
  X,
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { Link } from "expo-router";
import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/lib/supabase";
import * as Location from 'expo-location';

export default function SignUpScreen() {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    username: "sandeep",
    fullName: "sandeep r",
    email: "sandeep.raghuwanshi.ideal@gmail.com",
    password: "123456",
    confirmPassword: "123456",
    dob: "23-03-1993",
    gender: "Male",
    bio: "lorem",
    interests: [
    "Hip-Hop",
    "Rap",
    "Rock",
    "Pop",
    "Jazz",
    ],
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    "Hip-Hop",
    "Rap",
    "Rock",
    "Pop"]);
  const [showInterestSheet, setShowInterestSheet] = useState(false);

  const interests = [
    "Hip-Hop",
    "Rap",
    "Rock",
    "Pop",
    "Jazz",
    "Classical",
    "Country",
    "Electronic",
    "R&B",
    "Indie",
    "Metal",
    "Blues",
    "Reggae",
    "Folk",
    "Soul",
    "Punk",
    "Dance",
    "Alternative",
    "Latin",
    "K-Pop",
  ];
  const [userId, setUserId] = useState<string | null>(null);
  const [userPassword, setUserPassword] = useState<any>(null);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const removeInterest = (interest: string) => {
    setSelectedInterests(selectedInterests.filter((i) => i !== interest));
  };
  const [error, setError] = useState<string>("");
  const { signIn, signUpData, isLoading, setIsLoading } = useAuth();
  const [location, setLocation] = useState<any>({latitude:null,longitude:null });
  useEffect(() => {
    const init = async ()=>{
       const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
              throw new Error('Location permission not granted');
            }
      
            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
            console.log('user location', latitude, longitude);
            setLocation({latitude:latitude, longitude:longitude})
    }
    init()
  
    return () => {
      
    }
  }, [])
  
  const checkVerification = async () => {
    // const { data } = await supabase.auth.getSession();
    // const { data } = await supabase.auth.getUser();
    return
    const { data, error } = await supabase.auth.signInWithPassword({
      email: userPassword.email,
      password: userPassword.password,
    });
    if (data.user?.email_confirmed_at) {
    }
    if (data.session) {
      // go to profile / home

      const { error: profileError } = await supabase.from("profiles").insert({
        id: userId,
        username: formData.username,
        fullname: formData.fullName,
        gender: formData.gender,
        bio: formData.bio,
        dob: formData.dob,
        interests: selectedInterests,
        latitude: "22.6906",
        longitude: "75.7874",
        location: "sinhasa it park  indore, mp",
      });

      if (profileError) {
        alert(profileError.message);
      }

          // await signIn1(`${JSON.stringify(data)}`)
      if (profileError) {
        console.log(profileError);
        alert(profileError.message);
        return;
      }
    } else {
      alert("Not verified yet. Please login.");
    }
  };

  const handleSignup = async () => {
    // signUpData({
    //     userId : '12',
    //     email: formData.email,
    //     password: formData.password,
    //     id: userId,
    //     username: formData.username,
    //     fullname: formData.fullName,
    //     gender: formData.gender,
    //     bio: formData.bio,
    //     dob: formData.dob,
    //     interests: selectedInterests,
    //     latitude: "22.6906",
    //     longitude: "75.7874",
    //     location: "sinhasa it park  indore, mp",
    //   });
    //   return
    setIsLoading(true);
    setError("");
    try {

      const { data: user, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: "exponativewind://auth-callback",
        },
      });

      console.log(user);

      // const userId = user.user.id;
      setUserId(user.user.id);
      setUserPassword({
        email: formData.email,
        password: formData.password,
      });
      signUpData({
        userId : user.user.id,
        email: formData.email,
        password: formData.password,
        id: userId,
        username: formData.username,
        fullname: formData.fullName,
        gender: formData.gender,
        bio: formData.bio,
        dob: formData.dob,
        interests: selectedInterests,
        latitude: "22.6906",
        longitude: "75.7874",
        location: "sinhasa it park  indore, mp",
      });

    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 32,
          backgroundColor: "#FFFFFF",
        }}
      >
        {/* Header */}
        <View className="px-6 pt-4 pb-6 flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-4"
          >
            <ChevronLeft className="text-foreground" size={24} />
          </TouchableOpacity>
          <Text className="text-foreground text-xl font-semibold">
            Let's Create Your Identity
          </Text>
        </View>

        {/* Profile Photo Upload */}
        <View className="items-center mb-8">
          <View className="w-32 h-32 rounded-full bg-muted items-center justify-center">
            <User className="text-muted-foreground" size={48} />
            <View className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-background border-2 border-border items-center justify-center">
              <View className="w-6 h-6 rounded-full bg-muted items-center justify-center">
                <Text className="text-foreground text-xs">📷</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Form Fields */}
        <View className="px-6 gap-4">
          {/* Username */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#FFFFFF",
              borderWidth: 1,
              borderColor: "#E5E7EB",
              borderRadius: 9999,
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
          >
            <User className="text-muted-foreground mr-3" size={20} />
            <TextInput
              placeholder="@Username"
              placeholderTextColor="#9CA3AF"
              value={formData.username}
              onChangeText={(text) =>
                setFormData({ ...formData, username: text })
              }
              className="flex-1"
            />
          </View>

          {/* Full Name */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#FFFFFF",
              borderWidth: 1,
              borderColor: "#E5E7EB",
              borderRadius: 9999,
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
          >
            <User className="text-muted-foreground mr-3" size={20} />
            <TextInput
              placeholder="Full Name"
              placeholderTextColor="#9CA3AF"
              value={formData.fullName}
              onChangeText={(text) =>
                setFormData({ ...formData, fullName: text })
              }
              className="flex-1"
            />
          </View>

          {/* Email */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#FFFFFF",
              borderWidth: 1,
              borderColor: "#E5E7EB",
              borderRadius: 9999,
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
          >
            <Mail className="text-muted-foreground mr-3" size={20} />
            <TextInput
              placeholder="Email address"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              className="flex-1"
            />
          </View>

          {/* Password */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#FFFFFF",
              borderWidth: 1,
              borderColor: "#E5E7EB",
              borderRadius: 9999,
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
          >
            <Lock className="text-muted-foreground mr-3" size={20} />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showPassword}
              value={formData.password}
              onChangeText={(text) =>
                setFormData({ ...formData, password: text })
              }
              className="flex-1"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOff className="text-muted-foreground" size={20} />
              ) : (
                <Eye className="text-muted-foreground" size={20} />
              )}
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#FFFFFF",
              borderWidth: 1,
              borderColor: "#E5E7EB",
              borderRadius: 9999,
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
          >
            <Lock className="text-muted-foreground mr-3" size={20} />
            <TextInput
              placeholder="Confirm password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showConfirmPassword}
              value={formData.confirmPassword}
              onChangeText={(text) =>
                setFormData({ ...formData, confirmPassword: text })
              }
              className="flex-1"
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="text-muted-foreground" size={20} />
              ) : (
                <Eye className="text-muted-foreground" size={20} />
              )}
            </TouchableOpacity>
          </View>

          {/* Date of Birth */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#FFFFFF",
              borderWidth: 1,
              borderColor: "#E5E7EB",
              borderRadius: 9999,
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
          >
            <Calendar className="text-muted-foreground mr-3" size={20} />
            <TextInput
              placeholder="DOB"
              placeholderTextColor="#9CA3AF"
              value={formData.dob}
              onChangeText={(text) => setFormData({ ...formData, dob: text })}
              className="flex-1 text-foreground"
            />
            <Calendar className="text-muted-foreground" size={20} />
          </View>

          {/* Select Interests */}
          <TouchableOpacity
            onPress={() => setShowInterestSheet(true)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#FFFFFF",
              borderWidth: 1,
              borderColor: "#E5E7EB",
              borderRadius: 9999,
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
          >
            <Text style={{ color: "#9CA3AF" }}>Select Interests</Text>
            <ChevronDown style={{ color: "#9CA3AF" }} size={20} />
          </TouchableOpacity>

          {/* Selected Interests Tags */}
          {selectedInterests.length > 0 && (
            <View className="flex-row flex-wrap gap-2">
              {selectedInterests.map((interest) => (
                <View
                  key={interest}
                  className="flex-row items-center bg-background border border-[#EF5A6F] rounded-full px-4 py-2"
                >
                  <Text className="text-[#EF5A6F] mr-2">{interest}</Text>
                  <TouchableOpacity onPress={() => removeInterest(interest)}>
                    <X className="text-[#EF5A6F]" size={16} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Gender */}
          <View className="mt-2">
            <Text className="text-foreground font-semibold mb-3">Gender</Text>
            <View className="flex-row gap-4">
              <TouchableOpacity
                onPress={() => setFormData({ ...formData, gender: "Male" })}
                className={`flex-1 flex-row items-center justify-center border rounded-full px-4 py-3 ${
                  formData.gender === "Male"
                    ? "border-[#EF5A6F] bg-[#EF5A6F]/5"
                    : "border-border"
                }`}
              >
                <View
                  className={`w-5 h-5 rounded-full border-2 mr-2 items-center justify-center ${
                    formData.gender === "Male"
                      ? "border-[#EF5A6F]"
                      : "border-muted-foreground"
                  }`}
                >
                  {formData.gender === "Male" && (
                    <View className="w-3 h-3 rounded-full bg-[#EF5A6F]" />
                  )}
                </View>
                <Text
                  className={
                    formData.gender === "Male"
                      ? "text-[#EF5A6F] font-medium"
                      : "text-foreground"
                  }
                >
                  Male
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setFormData({ ...formData, gender: "Female" })}
                className={`flex-1 flex-row items-center justify-center border rounded-full px-4 py-3 ${
                  formData.gender === "Female"
                    ? "border-[#EF5A6F] bg-[#EF5A6F]/5"
                    : "border-border"
                }`}
              >
                <View
                  className={`w-5 h-5 rounded-full border-2 mr-2 items-center justify-center ${
                    formData.gender === "Female"
                      ? "border-[#EF5A6F]"
                      : "border-muted-foreground"
                  }`}
                >
                  {formData.gender === "Female" && (
                    <View className="w-3 h-3 rounded-full bg-[#EF5A6F]" />
                  )}
                </View>
                <Text
                  className={
                    formData.gender === "Female"
                      ? "text-[#EF5A6F] font-medium"
                      : "text-foreground"
                  }
                >
                  Female
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setFormData({ ...formData, gender: "Other" })}
                className={`flex-1 flex-row items-center justify-center border rounded-full px-4 py-3 ${
                  formData.gender === "Other"
                    ? "border-[#EF5A6F] bg-[#EF5A6F]/5"
                    : "border-border"
                }`}
              >
                <View
                  className={`w-5 h-5 rounded-full border-2 mr-2 items-center justify-center ${
                    formData.gender === "Other"
                      ? "border-[#EF5A6F]"
                      : "border-muted-foreground"
                  }`}
                >
                  {formData.gender === "Other" && (
                    <View className="w-3 h-3 rounded-full bg-[#EF5A6F]" />
                  )}
                </View>
                <Text
                  className={
                    formData.gender === "Other"
                      ? "text-[#EF5A6F] font-medium"
                      : "text-foreground"
                  }
                >
                  Other
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bio */}
          <View
            style={{
              borderWidth: 1,
              borderColor: "#E5E7EB",
              borderRadius: 24,
              paddingHorizontal: 16,
              paddingVertical: 12,
              backgroundColor: "#FFFFFF",
            }}
          >
            <TextInput
              placeholder="Bio"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              maxLength={250}
              value={formData.bio}
              onChangeText={(text) => setFormData({ ...formData, bio: text })}
              className="text-foreground min-h-[100px]"
              textAlignVertical="top"
            />
            <Text className="text-muted-foreground text-xs text-right mt-2">
              {formData.bio.length}/250
            </Text>
          </View>

          {/* Sign Up Button */}
          {/* <TouchableOpacity
            className="bg-[#EF5A6F] rounded-full py-4 items-center mt-4"
            onPress={handleSignup}
          >
            <Text className="text-white font-semibold text-base">Sign Up</Text>
          </TouchableOpacity> */}

           <TouchableOpacity
                      style={[
                        styles.loginButton,
                        (isLoading) && styles.disabledButton,
                      ]}
                      onPress={handleSignup}
                      disabled={isLoading }
                      activeOpacity={0.8}
                    >
                      {isLoading ? (
                        <View style={styles.buttonContent}>
                          <ActivityIndicator color="#fff" size="small" style={styles.loader} />
                          <Text style={styles.loginButtonText}>Sign Up...</Text>
                        </View>
                      ) : (
                        <Text style={styles.loginButtonText}>Sign Up</Text>
                      )}
                    </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center my-4">
            <View className="flex-1 h-px bg-border" />
            <Text className="text-muted-foreground mx-4">Or</Text>
            <View className="flex-1 h-px bg-border" />
          </View>

          {/* Social Sign Up */}
          <View style={styles.socialLoginContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <View style={styles.facebookIcon}>
                <Text style={styles.facebookText}>f</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton}>
              <View style={styles.googleIcon}>
                <Text style={styles.googleText}>G</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton}>
              <View style={styles.appleIcon}>
                <Text style={styles.appleText}></Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Sign In Link */}
          <View className="flex-row justify-center items-center mb-8">
            <Text style={{ fontSize: 15, color: "#6B7280", fontWeight: "400" }}>
              You already have an account?{" "}
            </Text>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text
                  style={{ fontSize: 15, color: "#EF5A6F", fontWeight: "600" }}
                >
                  Sign In
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
          {userId && (
            <View>
              <TouchableOpacity onPress={checkVerification}>
                <Text
                  style={{ fontSize: 15, color: "#EF5A6F", fontWeight: "600" }}
                  className="text-center"
                >
                  I Verified
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Interest Selection Bottom Sheet */}
      <Modal
        visible={showInterestSheet}
        transparent
        animationType="slide"
        onRequestClose={() => setShowInterestSheet(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setShowInterestSheet(false)}
          />
          <View style={styles.bottomSheet}>
            {/* Handle Bar */}
            <View style={styles.handleBar} />

            {/* Header */}
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Select Your Interests</Text>
              <TouchableOpacity onPress={() => setShowInterestSheet(false)}>
                <X color="#1F2937" size={24} />
              </TouchableOpacity>
            </View>

            {/* Interest Grid */}
            <ScrollView
              style={styles.interestScrollView}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.interestGrid}>
                {interests.map((interest) => (
                  <TouchableOpacity
                    key={interest}
                    onPress={() => toggleInterest(interest)}
                    style={[
                      styles.interestChip,
                      selectedInterests.includes(interest) &&
                        styles.interestChipSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.interestChipText,
                        selectedInterests.includes(interest) &&
                          styles.interestChipTextSelected,
                      ]}
                    >
                      {interest}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Done Button */}
            <View style={styles.sheetFooter}>
              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => setShowInterestSheet(false)}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
   loader: {
    marginRight: 8,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: "#9CA3AF",
    opacity: 0.7,
  },
  loginButton: {
    backgroundColor: "#EF5A6F",
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    elevation: 2,
    shadowColor: "#EF5A6F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  socialLoginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
    marginBottom: 32,
  },
  socialButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  facebookIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1877F2",
    justifyContent: "center",
    alignItems: "center",
  },
  facebookText: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
  },
  googleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  googleText: {
    color: "#4285F4",
    fontSize: 24,
    fontWeight: "700",
  },
  appleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  appleText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  bottomSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: 32,
    maxHeight: "80%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
  },
  interestScrollView: {
    maxHeight: 400,
  },
  interestGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 24,
    gap: 12,
  },
  interestChip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  interestChipSelected: {
    backgroundColor: "#EF5A6F",
    borderColor: "#EF5A6F",
  },
  interestChipText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
  },
  interestChipTextSelected: {
    color: "#FFFFFF",
  },
  sheetFooter: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  doneButton: {
    backgroundColor: "#EF5A6F",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#EF5A6F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  doneButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
