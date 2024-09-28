import React, { useRef, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from '../screens/HomeScreen';
import Members from '../screens/Members';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Animated, Easing, Alert } from 'react-native';
import { API_BASE_URL } from '../constants/Config';
import { launchCamera } from 'react-native-image-picker';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { useSelector } from 'react-redux';

const CameraScreen = ({ navigation }) => {
  const user = useSelector((state) => state.user);
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
        console.log('User ID---------------------', userId); 
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
            console.log('Upload successful:', result.newFilePath);
            Alert.alert('Success', 'Photo uploaded successfully');
          } else {
            console.error('Upload failed:', result.error);
            Alert.alert('Error', 'Photo upload failed');
          }
        } catch (error) {
          console.error('Error uploading photo:', error);
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
const Tab = createBottomTabNavigator();
const TabNavigator = () => {
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
          } else if (route.name === 'Members') {
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
        tabBarStyle: {
          backgroundColor: '#fff',
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="Scanner"
        component={Members}
        options={{ title: 'Scanner' }}
      />
      <Tab.Screen
        name="Camera"
        component={CameraScreen}
        options={{ title: 'Camera' }}
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