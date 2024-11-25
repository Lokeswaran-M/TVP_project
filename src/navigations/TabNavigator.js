import React, { useRef, useEffect, useState, useCallback } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Dashboard from '../screens/HomeScreen';
import Post from '../screens/Post';
import MemberDetails from '../screens/MemberDetails';
import Members from '../screens/MembersList';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Animated, Easing, Alert } from 'react-native';
import { API_BASE_URL } from '../constants/Config';
import { useSelector } from 'react-redux';
import Scanner from '../screens/Scanner';
import MultiBusinessCamera from '../screens/Camera';
const Stack = createNativeStackNavigator();
const MultiMemberstack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Members" component={Members} options={{ headerShown: false }} />
    <Stack.Screen name="MemberDetails" component={MemberDetails} options={{ headerShown: false }} />
  </Stack.Navigator>
);
const Tab = createBottomTabNavigator();
const TabNavigator = () => {
  const [profileData, setProfileData] = useState({});
  const userId = useSelector((state) => state.user?.userId);
  const fetchData = async () => {
    try {
      const profileResponse = await fetch(`${API_BASE_URL}/api/user/business-info/${userId}`);
      if (!profileResponse.ok) {
        throw new Error('Failed to fetch profile data');
      }
      const profileData = await profileResponse.json();
      setProfileData(profileData);
    } catch (error) {
      console.error('Error fetching profile data in TabNavigator:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [userId]);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size, focused }) => {
          const rotation = useRef(new Animated.Value(0)).current;
          useEffect(() => {
            if (focused) {
              Animated.timing(rotation, {
                toValue: 1,
                duration: 500,
                easing: Easing.linear,
                useNativeDriver: true,
              }).start(() => {
                rotation.setValue(0);
              });
            }
          }, [focused]);
          let iconName;
          if (route.name === 'Dashboard') {
            iconName = 'home';
          } else if (route.name === 'MultiBusinessMembers') {
            iconName = 'users';
          } else if (route.name === 'Post') {
            iconName = 'picture-o';
          } else if (route.name === 'Scanner') {
            iconName = 'qrcode';
          } else if (route.name === 'Camera') {
            iconName = 'camera';
          } else if (route.name === 'MultiBusinessCamera') {
            iconName = 'meetup';
          }
          const iconSize = focused ? size + 5 : size;
          return (
            <Animated.View>
              <Icon name={iconName} size={iconSize} color={color} />
            </Animated.View>
          );
        },
        tabBarActiveTintColor: '#a3238f',
        tabBarInactiveTintColor: 'black',
        tabBarStyle: { backgroundColor: '#fff' },
      })}
    >
       <Tab.Screen name="Dashboard" component={Dashboard} options={{ title: 'Home' }} />
       <Tab.Screen name="Scanner" component={Scanner} options={{ title: 'Scanner' }} />
       <Tab.Screen name="Post" component={Post}    options={{ title: 'Post' }} />
        <Tab.Screen
          name="MultiBusinessCamera"
          component={MultiBusinessCamera}
          options={{ title: 'Meet' }}
        />
      <Tab.Screen
          name="MultiBusinessMembers"
          component={MultiMemberstack}
          options={{ title: 'Members' }}
        />
    </Tab.Navigator>
  );
};
export default TabNavigator;