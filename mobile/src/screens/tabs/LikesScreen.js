import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

const LikesScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.text}>Likes</Text>
        <Text style={styles.comingSoon}>Who liked you will appear here</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  comingSoon: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default LikesScreen;
