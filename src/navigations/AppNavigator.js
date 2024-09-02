import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Image, TouchableOpacity, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import SplashScreen from '../components/common/SplashScreen';
import AuthNavigator from '../navigations/AuthNavigator'; 
import DrawerContent from './DrawerContent';
import ProfileScreen from '../screens/ProfileScreen';
import TabNavigator from './TabNavigator';
import SubstituteLogin from '../screens/SubstituteLogin';
import Payment from '../screens/Payment';
import Subscription from '../screens/Subscription';
import LoginScreen from '../screens/LoginScreen';
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const HeaderImage = () => (
  <Image
    source={require('../../assets/images/BMW.png')} 
    style={styles.headerImage}
  />
);
const HeaderWithImage = () => ({
  headerBackground: () => (
    <LinearGradient
      colors={['#a3238f', '#ffbe4e']}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    />
  ),
  headerTintColor: '#fff',
  headerTitle: () => <HeaderImage />,
});
const HeaderWithoutImage = ({ navigation }) => ({
  headerBackground: () => (
    <LinearGradient
      colors={['#a3238f', '#ffbe4e']}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    />
  ),
  headerTintColor: '#fff',
  headerLeft: () => (
    <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
      <Icon name="arrow-left" size={20} color="#fff" style={{ marginLeft: 15 }} />
    </TouchableOpacity>
  ),
});
function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <DrawerContent {...props} />} 
      screenOptions={{
        drawerActiveTintColor: '#a3238f', 
        drawerInactiveTintColor: 'black', 
        drawerStyle: {
          backgroundColor: 'white', 
        },
      }}
    >
      <Drawer.Screen 
        name="Home" 
        component={TabNavigator} 
        options={{
          drawerLabel: 'Home',
          drawerIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
          ...HeaderWithImage(),
        }} 
      />
      <Drawer.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={({ navigation }) => ({
          drawerLabel: 'View Profile',
          drawerIcon: ({ color, size }) => (
            <Icon name="user-circle" color={color} size={size} />
          ),
          ...HeaderWithoutImage({ navigation }),
        })} 
      />
      <Drawer.Screen 
        name="Substitute Login" 
        component={SubstituteLogin} 
        options={({ navigation }) => ({
          drawerLabel: 'Substitute Login',
          drawerIcon: ({ color, size }) => (
            <Icon name="user-plus" color={color} size={size} />
          ),
          ...HeaderWithoutImage({ navigation }),
        })} 
      />
      <Drawer.Screen 
        name="Payment" 
        component={Payment} 
        options={({ navigation }) => ({
          drawerLabel: 'Payment',
          drawerIcon: ({ color, size }) => (
            <Icon name="money" color={color} size={size} />
          ),
          ...HeaderWithoutImage({ navigation }),
        })} 
      />
      <Drawer.Screen 
        name="Subscription" 
        component={Subscription} 
        options={({ navigation }) => ({
          drawerLabel: 'Subscription',
          drawerIcon: ({ color, size }) => (
            <Icon name="ticket" color={color} size={size} />
          ),
          ...HeaderWithoutImage({ navigation }),
        })} 
      />
      <Drawer.Screen 
  name="Logout" 
  component={LoginScreen} 
  options={({ navigation }) => ({
    drawerLabel: 'Logout',
    drawerIcon: ({ color, size }) => (
      <Icon name="sign-out" color={color} size={size} />
    ),
    headerShown: false, 
  })} 
/>
    </Drawer.Navigator>
  );
}
function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Auth"
        component={AuthNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DrawerNavigator"
        component={DrawerNavigator}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
const styles = StyleSheet.create({
  headerImage: {
    width: 300, 
    height: 50, 
    resizeMode: 'contain',
  },
});
export default AppNavigator;