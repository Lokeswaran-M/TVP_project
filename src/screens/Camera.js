import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, useWindowDimensions, ActivityIndicator, Text, TouchableOpacity, Image, Button, Alert } from 'react-native';
import { API_BASE_URL } from '../constants/Config';
import { useSelector } from 'react-redux';
import { TabView, TabBar } from 'react-native-tab-view';
import Stars from './Stars';
import styles from '../components/layout/MembersStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { launchCamera } from 'react-native-image-picker';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
const MultiBusinessCamera = ({ navigation, chapterType, locationId }) => {
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
    console.log("chapterType::::::::::::::::::::::::::::::::::::::::", chapterType);
    console.log("locationId::::::::::::::::::::::::::::::::::::::", locationId);
    const options = {
      mediaType: 'photo',
      cameraType: 'front',
    };
    launchCamera(options, async (response) => {
      if (response.didCancel) {
        navigation.navigate('Dashboard');
      } else if (response.errorCode) {
        navigation.navigate('Dashboard');
      } else if (response.assets && response.assets.length > 0) {
        const photoUri = response.assets[0].uri;
        const fileName = `${userId}_${chapterType}_${locationId}.jpeg`;
  
        try {
          const formData = new FormData();
          formData.append('image', {
            uri: photoUri,
            type: 'image/jpeg',
            name: fileName,
          });
          const uploadResponse = await fetch(`${API_BASE_URL}/upload-meeting-photo?userId=${userId}&chapterType=${chapterType}&locationId=${locationId}`, {
            method: 'POST',
            body: formData,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          const result = await uploadResponse.json();
console.log("Result on the Camera Screen:", result);
if (result.success) {
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
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={requestCameraPermission}>
        <Icon name="camera" size={24} color="#FFF" style={styles.icon} />
        <Text style={styles.buttonText}>Camera</Text>
      </TouchableOpacity>
      <Text style={styles.noteText}>*you are scanning for Boutique Business</Text>
    </View>
  );
};
export default function TabViewExample({ navigation }) {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([]);
  const userId = useSelector((state) => state.user?.userId);
  const [businessInfo, setBusinessInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinessInfo = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/user/business-infodrawer/${userId}`);
        const data = await response.json();

        if (response.ok) {
          const updatedRoutes = data.map((business, index) => ({
            key: `business${index + 1}`,
            title: business.BD,
            chapterType: business.CT,
            locationId: business.L,
          }));
          setRoutes(updatedRoutes);
          setBusinessInfo(data);
        } else {
          console.error('Error fetching business info:', data.message);
        }
      } catch (error) {
        console.error('API call error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessInfo();
  }, [userId]);

  const renderScene = ({ route }) => {
    const business = businessInfo.find((b) => b.BD === route.title);
    return (
      <MultiBusinessCamera
        title={route.title}
        chapterType={business?.CT}
        locationId={business?.L}
        userId={userId}
        navigation={navigation}
      />
    );
  };
  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: '#A3238F' }}
      style={{ backgroundColor: '#F3ECF3' }}
      activeColor="#A3238F"
      inactiveColor="gray"
      labelStyle={{ fontSize: 14 }}
    />
  );
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={renderTabBar}
    />
  );
}