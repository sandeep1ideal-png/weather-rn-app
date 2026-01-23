import { supabase } from "@/lib/supabase";
import { useRef } from "react";
import { Text, View } from "react-native";
import * as Linking from 'expo-linking';

export default function AuthCallback() {
  // console.log('jjjj')
  //   const deepLinkProcessed = useRef(false);
  
  //  const handleDeepLink = async (url: string) => {
  //   console.log('url in auth-callback', url,url.includes('auth-callback'))
  //       // Prevent duplicate processing
  //       if (deepLinkProcessed.current && url.includes('auth-callback')) {
  //         return;
  //       }
  
  //       if (url.includes('auth-callback')) {
  //         deepLinkProcessed.current = true;
  //         // setIsLoading(true)
  
  //         try {
  //           // Wait for Supabase to process the session from URL
  //           await new Promise(resolve => setTimeout(resolve, 1000));
  
  //           const hashParams = new URLSearchParams(url.split('#')[1]);
            
  //           const accessToken = hashParams.get('access_token');
  //           const refreshToken = hashParams.get('refresh_token');
  //           // const expiresIn = hashParams.get('expires_in');
  //           // const expiresAt = hashParams.get('expires_at');
  
          
  //           if (accessToken) {
  //             // ✅ Manually set the session in Supabase
  //             const { data: { session }, error: setSessionError } = await supabase.auth.setSession({
  //               access_token: accessToken,
  //               refresh_token: refreshToken,
  //             });
  
  //            } 
  
  
  //             const { data: { session: verifySession }, error: verifyError } = await supabase.auth.getSession();
  //             console.log(verifySession,'auth check in callback url')
  //             console.log(hashParams,'hashParams url')
  //             console.log('accessToken url',accessToken)
  //             console.log('refreshToken url',refreshToken)
  
  //             if (verifySession?.user) {
  //               // checkVerification()
  //             }else{
  //               // setIsLoading(false)
  //             }
  
  //         } catch (error) {
  //                   // setIsLoading(false)
  
  //           console.error('Deep link error:', error);
  //         }
  //       }
  //     };
  //  const unsubscribe = Linking.addEventListener('url', ({ url }) => {
  //       // handleDeepLink(url);
  //     });
  return <View className="flex-1 items-center justify-center bg-[#EF5A6F]">
    <Text>Authentication in progress...</Text>
    </View>
}
