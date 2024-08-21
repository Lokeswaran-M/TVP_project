import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from '../screens/HomeScreen';
import Members from '../screens/Members';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'react-native-linear-gradient';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'home';
          } else if (route.name === 'Members') {
            iconName = 'users';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#ffbe4e',
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="Members"
        component={Members}
        options={{ title: 'Members' }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;