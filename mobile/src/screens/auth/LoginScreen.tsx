// mobile/src/screens/auth/LoginScreen.tsx
import React, { useState } from "react";
import {
 
  ActivityIndicator,
  Alert,
} from "react-native";
import { useAuth } from "../../context/AuthContext";


import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { User, Lock, Eye, EyeOff } from "lucide-react-native";
// import { Link, router } from "expo-router";
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { signIn } = useAuth();
  const navigation = useNavigation();


  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const coupleImages = [
    "https://images.unsplash.com/photo-1625178268165-6fd9e3e9ec84?w=900&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1625178268165-6fd9e3e9ec84?w=900&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1625178268165-6fd9e3e9ec84?w=900&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1625178268165-6fd9e3e9ec84?w=900&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1625178268165-6fd9e3e9ec84?w=900&auto=format&fit=crop&q=60",
  ];

//   const handleLogin = () => {
//     // Navigate to main app after login
//     router.replace("/(tabs)");
//   };

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Replace this with your actual login API call
      await signIn(`data.token`);
      return;
      const response = await fetch("http://192.168.1.207:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await signIn(data.token);
        // Navigation will be handled by the RootNavigator based on userToken
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
     <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section with Circular Images */}
        <View style={styles.heroSection}>
          <View style={styles.circleContainer}>
            {/* Top Left */}
            <View style={[styles.imageCircle, styles.topLeft]}>
              <Image
                source={{ uri: coupleImages[0] }}
                style={styles.coupleImage}
              />
            </View>

            {/* Top Right */}
            <View style={[styles.imageCircle, styles.topRight]}>
              <Image
                source={{ uri: coupleImages[1] }}
                style={styles.coupleImage}
              />
            </View>

            {/* Center Logo */}
            <View style={styles.centerLogo}>
              <View style={styles.dottedCircle} />
              <View style={styles.logoIcon}>
                {/* Heart with Couple Icon */}
                <View style={styles.heartIcon}>
                  <View style={styles.personLeft} />
                  <View style={styles.personRight} />
                  <View style={styles.heartShape} />
                </View>
              </View>
            </View>

            {/* Bottom Left */}
            <View style={[styles.imageCircle, styles.bottomLeft]}>
              <Image
                source={{ uri: coupleImages[2] }}
                style={styles.coupleImage}
              />
            </View>

            {/* Bottom Center */}
            <View style={[styles.imageCircleSmall, styles.bottomCenter]}>
              <Image
                source={{ uri: coupleImages[3] }}
                style={styles.coupleImage}
              />
            </View>

            {/* Bottom Right */}
            <View style={[styles.imageCircleSmall, styles.bottomRight]}>
              <Image
                source={{ uri: coupleImages[4] }}
                style={styles.coupleImage}
              />
            </View>
          </View>
        </View>

        {/* Login Form */}
        <View style={styles.formSection}>
          {/* Username Input */}
          <View style={styles.inputContainer}>
            <User size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="username"
              placeholderTextColor="#9CA3AF"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Lock size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              {showPassword ? (
                <EyeOff size={20} color="#9CA3AF" />
              ) : (
                <Eye size={20} color="#9CA3AF" />
              )}
            </TouchableOpacity>
          </View>

          {/* Remember Me & Forgot Password */}
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={styles.rememberMeContainer}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View
                style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
              />
              <Text style={styles.rememberMeText}>Remember me</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Login Buttons */}
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

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
    // <View style={styles.container}>
    //   <View style={styles.formContainer}>
    //     <Text style={styles.title}>Welcome Back</Text>

    //     {error ? <Text style={styles.error}>{error}</Text> : null}

    //     <View style={styles.inputContainer}>
    //       <Ionicons
    //         name="person-outline"
    //         size={20}
    //         color="#666"
    //         style={styles.inputIcon}
    //       />
    //       <TextInput
    //         style={styles.input}
    //         placeholder="Username"
    //         value={username}
    //         onChangeText={setUsername}
    //         autoCapitalize="none"
    //       />
    //     </View>

    //     <View style={styles.inputContainer}>
    //       <Ionicons
    //         name="lock-closed-outline"
    //         size={20}
    //         color="#666"
    //         style={styles.inputIcon}
    //       />
    //       <TextInput
    //         style={styles.input}
    //         placeholder="Password"
    //         value={password}
    //         onChangeText={setPassword}
    //         secureTextEntry
    //       />
    //     </View>

    //     <TouchableOpacity
    //       style={styles.loginButton}
    //       onPress={handleLogin}
    //       disabled={isLoading}
    //     >
    //       {isLoading ? (
    //         <ActivityIndicator color="#fff" />
    //       ) : (
    //         <Text style={styles.loginButtonText}>Login</Text>
    //       )}
    //     </TouchableOpacity>
    //   </View>
    // </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     justifyContent: "center",
//     padding: 20,
//   },
//   formContainer: {
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     padding: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//     textAlign: "center",
//     color: "#FF6B6B",
//   },
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 8,
//     marginBottom: 15,
//     paddingHorizontal: 10,
//   },
//   inputIcon: {
//     marginRight: 10,
//   },
//   input: {
//     flex: 1,
//     height: 50,
//     fontSize: 16,
//   },
//   loginButton: {
//     backgroundColor: "#FF6B6B",
//     padding: 15,
//     borderRadius: 8,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   loginButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   error: {
//     color: "red",
//     textAlign: "center",
//     marginBottom: 15,
//   },
// });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  heroSection: {
    height: 380,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },
  circleContainer: {
    width: 360,
    height: 360,
    position: "relative",
  },
  imageCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    position: "absolute",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageCircleSmall: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: "hidden",
    position: "absolute",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  topLeft: {
    top: 0,
    left: 30,
  },
  topRight: {
    top: 0,
    right: 30,
  },
  bottomLeft: {
    bottom: 60,
    left: 0,
  },
  bottomCenter: {
    bottom: 30,
    left: "50%",
    marginLeft: -35,
  },
  bottomRight: {
    bottom: 80,
    right: 20,
  },
  coupleImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  centerLogo: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -80,
    marginLeft: -80,
    width: 160,
    height: 160,
    justifyContent: "center",
    alignItems: "center",
  },
  dottedCircle: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
  },
  logoIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  heartIcon: {
    width: 60,
    height: 60,
    position: "relative",
  },
  personLeft: {
    position: "absolute",
    top: 8,
    left: 12,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#EF5A6F",
  },
  personRight: {
    position: "absolute",
    top: 8,
    right: 12,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#EF5A6F",
  },
  heartShape: {
    position: "absolute",
    bottom: 8,
    left: "50%",
    marginLeft: -18,
    width: 36,
    height: 32,
    backgroundColor: "#EF5A6F",
    borderRadius: 18,
    transform: [{ rotate: "45deg" }],
  },
  formSection: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#1F2937",
    fontWeight: "400",
  },
  eyeIcon: {
    padding: 4,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    marginRight: 8,
    backgroundColor: "#FFFFFF",
  },
  checkboxChecked: {
    backgroundColor: "#EF5A6F",
    borderColor: "#EF5A6F",
  },
  rememberMeText: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "400",
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "400",
  },
  loginButton: {
    backgroundColor: "#EF5A6F",
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 32,
    elevation: 2,
    shadowColor: "#EF5A6F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "400",
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
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signUpText: {
    fontSize: 15,
    color: "#6B7280",
    fontWeight: "400",
  },
  signUpLink: {
    fontSize: 15,
    color: "#EF5A6F",
    fontWeight: "600",
  },
});

export default LoginScreen;
