import React, { useRef, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from '../screens/HomeScreen';
import Members from '../screens/Members';
import Icon from 'react-native-vector-icons/FontAwesome';
import { launchCamera } from 'react-native-image-picker';
import { Animated, Easing } from 'react-native';
const Tab = createBottomTabNavigator();
const CameraScreen = ({ navigation }) => {
  const openCamera = () => {
    const options = {
      mediaType: 'photo',
      cameraType: 'front',
    };
    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
        navigation.navigate('Dashboard');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorCode);
        navigation.navigate('Dashboard');
      } else if (response.assets && response.assets.length > 0) {
        console.log('Photo taken: ', response.assets[0].uri);
        navigation.navigate('Dashboard');
      }
    });
  };
  useEffect(() => {
    openCamera();
  }, []);
  return null;
};
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