// app/index.tsx
import SplashScreen from '@/components/Splash';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/src/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, router, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';

export default function Index() {
         const [isCheckingAuth, setIsCheckingAuth] = useState(true);

   useEffect(() => {
    const init=async ()=>{
       await new Promise(resolve => setTimeout(resolve, 1000));

        const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {        
           router.replace('/(tabs)')
        } else {
          console.log('❌ No session');
          const signupData = await AsyncStorage.getItem('signupData');
          if (signupData) {
            console.log('⏳ Waiting for verification');
             router.replace('/login')


          } else {
            console.log('📱 Show login');
            router.replace('/login')

          }
        }
        setIsCheckingAuth(false)
    }
  init()   
  }, [])
  return <SplashScreen  />;  
}