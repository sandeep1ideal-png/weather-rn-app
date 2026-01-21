import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Discover() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Discover Screen</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18, color: '#1F2937' },
});