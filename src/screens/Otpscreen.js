import React from 'react';
import { View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';

const Otpscreen = () => {
  const route = useRoute();
  const { mobileNo } = route.params || {}; 

  return (
    <View>
      <Text>Mobile Number: {mobileNo}</Text>
      {/* Your OTP screen content here */}
    </View>
  );
};

export default Otpscreen;
