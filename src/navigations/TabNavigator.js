import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Dashboard from '../screens/HomeScreen';
import Members from '../screens/MembersList';
import MemberDetails from '../screens/MemberDetails';
import MultiBusinessMembers from '../screens/MultiBusinessMembers';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Animated, Easing, Alert } from 'react-native';
import { API_BASE_URL } from '../constants/Config';
import { launchCamera } from 'react-native-image-picker';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { useSelector } from 'react-redux';
import Scanner from '../screens/Scanner';
import { TabView, SceneMap } from 'react-native-tab-view';
const CameraScreen = ({ navigation, profileData }) => {
  const userId = useSelector((state) => state.user?.userId);
  const requestCameraPermission = async () => {
    const result = await request(PERMISSIONS.ANDROID.CAMERA);
    if (result === RESULTS.GRANTED) {
      openCamera();
    } else {
      Alert.alert('Permission Denied', 'Camera access is required to take photos.');
      navigation.navigate('Dashboard');
    }
  };
  const openCamera = () => {
    const options = {
      mediaType: 'photo',
      cameraType: 'front',
    };
    launchCamera(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
        navigation.navigate('Dashboard');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorCode);
        navigation.navigate('Dashboard');
      } else if (response.assets && response.assets.length > 0) {
        const photoUri = response.assets[0].uri;
        const userId = user?.userId;
        const currentDateTime = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 12);
        const fileName = `${userId}_${currentDateTime}.jpeg`;
        try {
          const formData = new FormData();
          formData.append('image', {
            uri: photoUri,
            type: 'image/jpeg',
            name: fileName,
          });
          const uploadResponse = await fetch(`${API_BASE_URL}/upload-meeting-photo?userId=${userId}`, {
            method: 'POST',
            body: formData,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          const result = await uploadResponse.json();
          if (uploadResponse.ok) {
            Alert.alert('Success', 'Photo uploaded successfully');
          } else {
            Alert.alert('Error', 'Photo upload failed');
          }
        } catch (error) {
          Alert.alert('Error', 'Something went wrong during the upload');
        }
        navigation.navigate('Dashboard');
      }
    });
  };
  useEffect(() => {
    requestCameraPermission();
  }, []);
  return null;
};
const Stack = createNativeStackNavigator();
const Memberstack = () => (
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
      console.error('Error fetching profile data:', error);
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
          const rotate = rotation.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
          });
          let iconName;
          if (route.name === 'Dashboard') {
            iconName = 'home';
          } else if (route.name === 'Member') {
            iconName = 'users';
          } else if (route.name === 'MultiBusinessMembers') {
            iconName = 'users';
          } else if (route.name === 'Scanner') {
            iconName = 'qrcode';
          } else if (route.name === 'Camera') {
            iconName = 'camera';
          }
          const iconSize = focused ? size + 5 : size;
          return (
            <Animated.View style={{ transform: [{ rotate }] }}>
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
      <Tab.Screen
        name="Camera"
        component={CameraScreen}
        options={{ title: 'Camera' }}
      />
      {profileData?.CategoryId === 1 && (
      <Tab.Screen name="Member" component={Memberstack} options={{ title: 'Members' }} />
    )}
      {profileData?.CategoryId === 2 && (
        <Tab.Screen
          name="MultiBusinessMembers"
          component={MultiBusinessMembers}
          options={{ title: 'MultiBusinessMembers' }}
        />
      )}
    </Tab.Navigator>
  );
};
export default TabNavigator;