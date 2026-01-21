// src/providers/Providers.tsx
import { PropsWithChildren } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@/components/ThemeProvider';
import { View } from 'react-native';

export function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <View style={{ flex: 1 }}>{children}</View>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
