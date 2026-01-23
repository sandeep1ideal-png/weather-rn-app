// app/_layout.tsx
import { Redirect, Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '@/src/context/AuthContext';
import { ThemeProvider } from '@/components/ThemeProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '@/global.css';
import { supabase } from '@/lib/supabase';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from '@/components/Splash';

function RootLayoutNav() {
  const {  isLoading,setIsLoading,userToken } = useAuth();
  const segments = useSegments();
  const router = useRouter();
      const { signupUserData, signIn } = useAuth();
  const deepLinkProcessed = useRef(false);

  const processed = useRef(true);



  // ✅ Get splash state and initial route

   useEffect(() => {
    const handleDeepLink = async (url: string) => {
      // Prevent duplicate processing
      if (deepLinkProcessed.current && url.includes('auth-callback')) {
        return;
      }

      if (url.includes('auth-callback')) {
        deepLinkProcessed.current = true;
        setIsLoading(true)

        try {
          // Wait for Supabase to process the session from URL
          await new Promise(resolve => setTimeout(resolve, 1000));

          const hashParams = new URLSearchParams(url.split('#')[1]);
          
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          // const expiresIn = hashParams.get('expires_in');
          // const expiresAt = hashParams.get('expires_at');

        
          if (accessToken) {
            // ✅ Manually set the session in Supabase
            const { data: { session }, error: setSessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

           } 


            const { data: { session: verifySession }, error: verifyError } = await supabase.auth.getSession();

            if (verifySession?.user) {
              checkVerification()
            }else{
              setIsLoading(false)
            }

        } catch (error) {
                  setIsLoading(false)

          console.error('Deep link error:', error);
        }
      }
    };

    // Listen for incoming deep links (app already open)
    const unsubscribe = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    // Check for initial URL (app opened via deep link)
    Linking.getInitialURL()
      .then((url) => {
        if (url) {
          handleDeepLink(url);
        }
      })
      .catch(err => console.error('Error getting initial URL:', err));

    return () => unsubscribe.remove();
  }, [router,signupUserData,userToken]);

  const checkVerification = async () => {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: signupUserData.userId,
          username: signupUserData.username,
          fullname: signupUserData.fullname,
          gender: signupUserData.gender,
          bio: signupUserData.bio,
          dob: signupUserData.dob,
          interests: signupUserData?.selectedInterests,
          latitude: "22.6906",
          longitude: "75.7874",
          location: "sinhasa it park  indore, mp",
        });
  
        if (profileError) {
          alert(profileError.message);
          setIsLoading(false)
        }else{
          setIsLoading(false)
          await signIn(`${signupUserData}`);
        }
  
        if (profileError) {
          console.log(profileError);
          alert(profileError.message);
          setIsLoading(false)
          return;
        }
    };

  // ═════════════════════════════════════════════════════════════════════
  // 3️⃣ HANDLE ALL AUTH STATE CHANGES
  // ═════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth event:::', event);

        if (event === 'INITIAL_SESSION') {
          // Already handled by useSessionRestore
          return;
        }

        // ✅ SIGNED_IN - User logged in (login, signup, or deep link)
        if (event === 'SIGNED_IN') {
          console.log('✅ SIGNED_IN');

          if (session?.user?.email_confirmed_at) {
            console.log('✅ Email verified');

            // Create profile from signup data
            const signupData = await AsyncStorage.getItem('signupData');
            if (signupData) {
              const parsedData = JSON.parse(signupData);
              // await createProfileFromSignupData(session.user, parsedData);
              await AsyncStorage.removeItem('signupData');
            }

            router.replace('/(tabs)');
          } else {
            console.log('⏳ Email not verified');
            // router.replace('/');
          }
        }

        // ✅ USER_UPDATED - Email verified (deep link)
        if (event === 'USER_UPDATED') {
          console.log('🔄 USER_UPDATED');

          if (session?.user?.email_confirmed_at) {
            console.log('✅ Email verified');

            const signupData = await AsyncStorage.getItem('signupData');
            if (signupData) {
              const parsedData = JSON.parse(signupData);
              // await createProfileFromSignupData(session.user, parsedData);
              await AsyncStorage.removeItem('signupData');
            }

            router.replace('/(tabs)');
          }
        }

        // ✅ SIGNED_OUT - User logged out
        if (event === 'SIGNED_OUT') {
          console.log('❌ SIGNED_OUT');
          deepLinkProcessed.current = false;
          router.replace('/login');
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, []);


  
  
return (
    <>
      {/* {isCheckingAuth && <SplashScreen />} */}

      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </>
  );
// ═════════════════════════════════════════════════════════════════════
  // 1️⃣ SHOW SPLASH WHILE CHECKING AUTH
  // ═════════════════════════════════════════════════════════════════════
  // if (isCheckingAuth) {
  //   console.log('🎬 Showing splash screen');
  //   return <SplashScreen />;
  // }else{
   
    
  //   // ═════════════════════════════════════════════════════════════════════
  //   // 4️⃣ RENDER STACK WITH INITIAL ROUTE
  //   // ═════════════════════════════════════════════════════════════════════
  //   console.log('📱 Rendering stack with route:');
  
    return (
      <Stack
        screenOptions={{
          headerShown: false,
          // animationEnabled: false, // ✅ No animation from splash
        }}
      />
    );
  }




// ═════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═════════════════════════════════════════════════════════════════════

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SafeAreaProvider>
          <RootLayoutNav />
        </SafeAreaProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}