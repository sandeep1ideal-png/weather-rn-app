// app/_layout.tsx
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useRef } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '@/src/context/AuthContext';
import { ThemeProvider } from '@/components/ThemeProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '@/global.css';
import { supabase } from '@/lib/supabase';
import * as Linking from 'expo-linking';

function RootLayoutNav() {
  const { userToken, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
      const { signupUserData, signIn } = useAuth();
  const deepLinkProcessed = useRef(false);


  useEffect(() => {
    const handleDeepLink = async (url: string) => {
      // Prevent duplicate processing
      if (deepLinkProcessed.current && url.includes('auth-callback')) {
        return;
      }

      if (url.includes('auth-callback')) {
        deepLinkProcessed.current = true;

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
            }

        } catch (error) {
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
  }, [router,signupUserData]);

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
        }else{

          await signIn(`${signupUserData}`);
        }
  
        if (profileError) {
          console.log(profileError);
          alert(profileError.message);
          return;
        }
    };
useEffect(() => {
  supabase.auth.getSession().then(({ data }) => {
    if (data.session) {
    }
  });

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN") {
    }
  });
}, []);

  useEffect(() => {
    if (isLoading) return;
    const inAuthGroup = segments[0] === 'login' || segments[0] === 'signup';
    const inTabsGroup = segments[0] === '(tabs)';
    

    if (!userToken && !inAuthGroup) {
      // If not logged in and not in auth group, redirect to login
      router.replace('/login');
    } else if (userToken && inAuthGroup) {
      // If logged in and in auth group, redirect to tabs
      router.replace('/(tabs)');
    }
  }, [userToken, isLoading, segments, router]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}

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