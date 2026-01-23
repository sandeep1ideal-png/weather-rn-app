// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';

type AuthContextType = {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  userToken: string | null;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUpData: (signupData: any) => Promise<void>;
  signupUserData: any | null;
};

export const AuthContext = createContext<AuthContextType>({
  isLoading: true,
  setIsLoading: () => {},
  userToken: null,
  signIn: async () => {},
  signOut: async () => {},
  signUpData: async () => {},
  signupUserData: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [signupUserData, setSignupUserData] = useState<SignupData | null>(null);


  // Load token from storage on mount
  const loadToken = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const user:any = await AsyncStorage.getItem('signupData');
      console.log('set load token can redirect tab', token, user)

      setUserToken(token);
      setSignupUserData(user)
      return token;
    } catch (e) {
      console.error('Failed to load token', e);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadToken();
  }, [loadToken]);

  const signIn = useCallback(async (token: string) => {
    try {
      await AsyncStorage.setItem('userToken', token);
      setUserToken(token);
    } catch (e) {
      console.error('Failed to save token', e);
      throw e;
    }
  }, []);
  type SignupData = {
  userId: string;
  email: string;
  password: string;
  id: string;
  username: string;
  fullname: string;
  gender: string;
  bio: string;
  dob: string;
  interests: string[];
  latitude: string;
  longitude: string;
  location: string;
};
  const signUpData = useCallback(async (data: SignupData) => {
  try {
    const jsonValue = JSON.stringify(data); // ✅ convert to string
    await AsyncStorage.setItem('signupData', jsonValue);
    setSignupUserData(data); // keep object in state
  } catch (e) {
    console.error('Failed to save signup data', e);
    throw e;
  }
}, []);

  const signOut = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      setUserToken(null);
    } catch (e) {
      console.error('Failed to remove token', e);
      throw e;
    }
  }, []);

  const authContextValue = useMemo(() => ({
    isLoading,
    setIsLoading,
    userToken,
    signIn,
    signOut,
    signUpData,
    signupUserData,
  }), [isLoading, setIsLoading, userToken, signIn, signOut, signUpData, signupUserData]);

  // Debug effect for auth state changes
  useEffect(() => {
  }, [userToken, isLoading]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useSessionRestore = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState(null);
      const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [initialRoute, setInitialRoute] = useState<string | null>(null);


  useEffect(() => {
    const restoreSession = async () => {
      try {
        // Wait for SecureStore to restore session
        await new Promise(resolve => setTimeout(resolve, 1000));

        const { data: { session } } = await supabase.auth.getSession();
        console.log('session use', session);
        setSession(session);
        setIsCheckingAuth(false)
          if (session?.user) {
          console.log('✅ User logged in - redirecting to tabs');
          setInitialRoute('(tabs)');
        } else {
          console.log('❌ No session');
          const signupData = await AsyncStorage.getItem('signupData');
          if (signupData) {
            console.log('⏳ Waiting for verification');
            setInitialRoute('login');
          } else {
            console.log('📱 Show login');
            setInitialRoute('login');
          }
        }
        setIsLoading(false);

        console.log('✅ Session restored on app launch:', !!session);
      } catch (error) {
        console.error('Restore error:', error);
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  return { session, isLoading,isCheckingAuth,initialRoute  };
};