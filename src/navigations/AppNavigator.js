import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../components/common/SplashScreen';
import AuthNavigator from '../navigations/AuthNavigator'; 
import Dashboard from '../screens/Dashboard';
const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen  name="Splash"  component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen  name="Auth" component={AuthNavigator} options={{ headerShown: false }}  />
      <Stack.Screen 
        name="Dashboard" 
        component={Dashboard} 
        options={{ 
          title: 'Dashboard', 
          headerStyle: { backgroundColor: '#a3238f' }, 
          headerTintColor: '#fff' 
        }} 
      />

 
    </Stack.Navigator>
  );
};

export default AppNavigator;
