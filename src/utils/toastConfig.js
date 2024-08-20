import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const toastConfig = {
  success: ({ text1, text2 }) => (
    <View style={styles.successContainer}>
      <Text style={styles.successText}>{text1}</Text>
      <Text style={styles.successSubtitle}>{text2}</Text>
    </View>
  ),
  error: ({ text1, text2 }) => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{text1}</Text>
      <Text style={styles.errorSubtitle}>{text2}</Text>
    </View>
  ),
};

const styles = StyleSheet.create({
  successContainer: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 5,
    margin: 10,
  },
  successText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  successSubtitle: {
    fontSize: 16,
    color: '#fff',
  },
  errorContainer: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 5,
    margin: 10,
  },
  errorText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  errorSubtitle: {
    fontSize: 16,
    color: '#fff',
  },
});
