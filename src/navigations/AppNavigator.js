import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../components/common/SplashScreen';
import AuthNavigator from '../navigations/AuthNavigator'; 

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen  name="Splash"  component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen  name="Auth" component={AuthNavigator} options={{ headerShown: false }}  />
 

 
    </Stack.Navigator>
  );
};

export default AppNavigator;
