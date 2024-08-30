import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../components/common/SplashScreen';
import AuthNavigator from '../navigations/AuthNavigator'; 
import DrawerContent from './DrawerContent';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TouchableOpacity } from 'react-native';
// import Dashboard from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TabNavigator from './TabNavigator';
import LinearGradient from 'react-native-linear-gradient';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigator () {
  return (
    <Drawer.Navigator initialRouteName="Dashboard" drawerContent={(props) => <DrawerContent {...props} />}  >
      <Drawer.Screen name="Home"  component={TabNavigator}  options={{  drawerLabel: 'Home', drawerIcon: ({ color, size }) => (
      <Icon name="home" color={color} size={size} />
    ),
    headerBackground: () => (
      <LinearGradient
        colors={['#a3238f', '#ffbe4e']} 
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />
    ),
    headerTintColor: '#fff',
  }} 
/>

      <Drawer.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={({ navigation }) => ({
          drawerLabel: 'View Profile',
          drawerIcon: ({ color, size }) => (
            <Icon name="user" color={color} size={size} />
          ),
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
        })} 
      />

    </Drawer.Navigator>
  );
};

function AppNavigator () {
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
};

export default AppNavigator;