import React from 'react'
import { View, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'; 

const HomeScreen = () => {

  const navigation = useNavigation(); 
  return (
    <View>
        <Text>
            Home Screen
        </Text>
    </View>
  )
}

export default HomeScreen