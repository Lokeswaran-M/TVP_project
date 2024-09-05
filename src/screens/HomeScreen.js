import React from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';

const HomeScreen = () => {
  const user = useSelector((state) => state.user);  

  return (
    <View>
      <Text>Welcome, {user?.username}!</Text>
      <Text>Profession: {user?.profession || 'Not provided'}</Text>
    </View>
  );
};

export default HomeScreen;
