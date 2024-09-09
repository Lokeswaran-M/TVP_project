import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

const HomeScreen = () => {
  const user = useSelector((state) => state.user);

  return (
    <View>
      <Text style={styles.textBold}>ID {user?.userId}</Text>
      <Text style={styles.textLargeBold}>Welcome, {user?.username}!</Text>
      <Text style={styles.textNormal}>Profession: {user?.profession || 'Not provided'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  textBold: {
    fontWeight: 'bold',
    fontSize: 16, 
  },
  textLargeBold: {
    fontWeight: 'bold',
    fontSize: 24, 
  },
  textNormal: {
    fontSize: 18,
  },
});

export default HomeScreen;