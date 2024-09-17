// UnauthorizedScreen.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const UnauthorizedScreen = () => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Sorry!!! You are not authorized to view this page.</Text>
      <TouchableOpacity onPress={handleGoBack}>
        <Text style={{ color: 'blue', marginTop: 10 }}>Click here to go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UnauthorizedScreen;
