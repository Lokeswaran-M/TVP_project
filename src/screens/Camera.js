import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, ActivityIndicator, Text, TouchableOpacity, Image, Alert, useWindowDimensions, ScrollView, Modal, StyleSheet } from 'react-native';
import { API_BASE_URL } from '../constants/Config';
import { TabView, TabBar } from 'react-native-tab-view';
import { useSelector } from 'react-redux';
import { launchCamera } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../components/layout/MembersStyle';
import Subscription from './Subscription';
import { SafeAreaView } from 'react-native-safe-area-context';

const CustomModal = ({ visible, onClose, message, title }) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const TabContent = ({ locationId, navigation }) => {
  const userId = useSelector((state) => state.UserId);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMeetId, setSelectedMeetId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
  const [modalMessage, setModalMessage] = useState(''); // Modal message state
  const [modalTitle, setModalTitle] = useState(''); // Modal title state

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/list-memberscamera`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ LocationID: locationId, userId }),
        });
        if (!response.ok) throw new Error('Failed to fetch members');
        const data = await response.json();
        const updatedMembers = await Promise.all(data.members.map(async (member) => {
          let totalStars = 0;
          if (member.ratings?.length > 0) {
            totalStars = member.ratings.reduce((acc, rating) => acc + parseFloat(rating.average), 0);
            member.totalAverage = totalStars / member.ratings.length;
          } else {
            member.totalAverage = 0;
          }
          const imageResponse = await fetch(`${API_BASE_URL}/profile-image?userId=${member.UserId}`);
          if (imageResponse.ok) {
            const imageData = await imageResponse.json();
            member.profileImage = `${imageData.imageUrl}?t=${new Date().getTime()}`;
          } else {
            member.profileImage = null;
          }

          return member;
        }));

        setMembers(updatedMembers);
      } catch (error) {
        console.error('Error fetching members:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, [locationId, userId]);

  const filteredMembers = members.filter((member) =>
    member.Username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMemberClick = (member) => {
    const meetId = member.UserId;
    setSelectedMeetId(meetId);
    openCamera(meetId);
  };

  const openCamera = (meetId) => {
    if (!meetId) {
      setModalTitle('Error');
      setModalMessage('Please select a member first.');
      setModalVisible(true);
      return;
    }
    const options = { mediaType: 'photo', cameraType: 'front' };
    launchCamera(options, async (response) => {
      if (response.didCancel || response.errorCode) return;
      const photoUri = response.assets[0].uri;
      console.log("Uploading photo for MeetId:", meetId);
      await insertMeetingData(userId, meetId, locationId, photoUri);
    });
  };

  const insertMeetingData = async (userId, meetId, locationId, photoUri) => {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: photoUri,
        type: 'image/jpeg',
        name: `${userId}_${new Date().toISOString().replace(/[-:.]#/g, '').slice(0, 12)}.jpeg`,
      });
      formData.append('MeetId', meetId);  
      formData.append('LocationID', locationId);

      const uploadResponse = await fetch(`${API_BASE_URL}/upload-member-details?userId=${userId}`, {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const result = await uploadResponse.json();
      if (result.message === 'Member details and image uploaded successfully!') {
        setModalTitle('Success');
        setModalMessage('Photo and data uploaded successfully!');
        setModalVisible(true);
      } else {
        setModalTitle('Error');
        setModalMessage('Photo and data upload failed');
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Error during upload:', error);
      setModalTitle('Error');
      setModalMessage('Something went wrong while uploading data');
      setModalVisible(true);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.memberItem} onPress={() => handleMemberClick(item)}>
      <View style={styles.imageColumn}>
        <Image
          source={{ uri: item.profileImage }}
          style={styles.profileImage}
        />
      </View>
      <View style={styles.textColumn}>
        <Text style={styles.memberName}>{item.Username}</Text>
        <Text style={styles.memberRole} numberOfLines={1}>
          {item.Profession}
        </Text>
      </View>
      <View style={styles.alarmContainer}>
        <Icon name="camera" size={24} color="#2e3192" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f7ff' }}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search members..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="black"
          color="#2e3192"
        />
        <View style={styles.searchIconContainer}>
          <Icon name="search" size={23} color="#2e3192" />
        </View>
      </View>

      <FlatList
        data={filteredMembers}
        keyExtractor={(item) => item.UserId.toString()}
        contentContainerStyle={styles.memberList}
        renderItem={renderItem}
      />

      {/* Custom Modal */}
      <CustomModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        message={modalMessage} 
        title={modalTitle} 
      />
    </View>
  );
};
export default function TabViewExample({ navigation }) {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([]);
  const userId = useSelector((state) => state.UserId);
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
    if (business?.IsPaid === 0) {
      return <Subscription 
      navigation={navigation}
      route={{ 
        ...route, 
        params: { 
          locationId: business?.L, 
          Profession: business?.BD 
        } 
      }} />;
    }
    return (
      <TabContent
        locationId={business?.L}
        userId={userId}
        navigation={navigation}
      />
    );
  };
  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: '#2e3192' }}
      style={{ backgroundColor: '#f5f7ff' }}
      activeColor="#2e3192"
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
