// mobile/src/context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  userToken: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrapAsync = async () => {
      let token;
      try {
        token = await AsyncStorage.getItem('userToken');
      } catch (e) {
        console.error('Failed to load token', e);
      }
      setUserToken(token);
      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  const authContext = {
    signIn: async (token: string) => {
      try {
        await AsyncStorage.setItem('userToken', token);
        setUserToken(token);
      } catch (e) {
        console.error('Failed to save token', e);
        throw e;
      }
    },
    signOut: async () => {
      try {
        await AsyncStorage.removeItem('userToken');
        setUserToken(null);
      } catch (e) {
        console.error('Failed to remove token', e);
        throw e;
      }
    },
    isLoading,
    userToken,
  };

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};