import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgetPassword from '../screens/ForgetPassword';
import ResetPassword from '../screens/ResetPassword';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen  name="Login"   component={LoginScreen} options={{ headerShown: false }}  />
      <Stack.Screen  name="Register"  component={RegisterScreen}  options={{ headerShown: false }}   />
      <Stack.Screen  name="ForgetPassword"  component={ForgetPassword}  options={{ title: 'Forget Password',   headerStyle: { backgroundColor: '#a3238f' },   headerTintColor: '#fff'}} />
      <Stack.Screen  name="ResetPassword"  component={ResetPassword}    options={{ title: 'Reset Password',   headerStyle: { backgroundColor: '#a3238f' },   headerTintColor: '#fff'}} />








    </Stack.Navigator>
    
  );
};

export default AuthNavigator;
