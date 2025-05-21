import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  TextInput,
  FlatList,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  useWindowDimensions,
  ScrollView,
  Modal,
  StyleSheet,
  RefreshControl
} from 'react-native';
import { API_BASE_URL } from '../constants/Config';
import { TabView, TabBar } from 'react-native-tab-view';
import { useSelector } from 'react-redux';
import { launchCamera } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
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

const TabContent = ({ locationId, navigation, Profession }) => {
  const userId = useSelector((state) => state.UserId);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMeetId, setSelectedMeetId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [imageKey, setImageKey] = useState(Date.now());

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch(`${API_BASE_URL}/list-memberscamera`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ LocationID: locationId, userId }),
      });
      if (!response.ok) {
        if (response.status === 404) {
          setMembers([]);
          return;
        }
        throw new Error(`Server responded with status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Members data:========================', data); 
      if (!data.members || data.members.length === 0) {
        setMembers([]);
        setError(true);
        setLoading(false);
        return;
      }
      setImageKey(Date.now());
      
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
          member.profileImage = imageData.imageUrl;
        } else {
          member.profileImage = null;
        }

        return member;
      }));

      setMembers(updatedMembers);
    } catch (error) {
      console.error('Error fetching members:', error);
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [locationId, userId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMembers();
  }, [fetchMembers]);

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
      formData.append('Profession', Profession);

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
        fetchMembers();
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
        {item.profileImage ? (
          <Image
            source={{ uri: `${item.profileImage}?t=${imageKey}` }}
            style={styles.profileImage}
            key={`${item.UserId}-${imageKey}`}
          />
        ) : (
          <View style={[styles.profileImage, { backgroundColor: '#e1e1e1', justifyContent: 'center', alignItems: 'center' }]}>
            <Icon name="user" size={24} color="#999999" />
          </View>
        )}
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

  const renderEmptyComponent = () => {
    if (loading) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <Icon name="users" size={50} color="#cccccc" />
        <Text style={styles.emptyText}>
          {error ? "No members found" : "No members found"}
        </Text>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Icon name="refresh" size={16} color="#ffffff" />
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  };

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
        keyExtractor={(item) => `${item.UserId}-${imageKey}`}
        contentContainerStyle={[
          styles.memberList,
          filteredMembers.length === 0 && { flex: 1, justifyContent: 'center' }
        ]}
        renderItem={renderItem}
        ListEmptyComponent={renderEmptyComponent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#2e3192']} 
          />
        }
        extraData={imageKey}
      />

      {loading && !refreshing && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#2e3192" />
        </View>
      )}
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
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  const fetchBusinessInfo = useCallback(async () => {
    setLoading(true);
    setError(false);
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
        setError(true);
      }
    } catch (error) {
      console.error('API call error:', error);
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchBusinessInfo();
  }, [fetchBusinessInfo]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBusinessInfo();
  }, [fetchBusinessInfo]);

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
        Profession={business?.BD}
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

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2e3192" />
      </View>
    );
  }

  if (error && routes.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="exclamation-triangle" size={50} color="#ff6b6b" />
        <Text style={styles.errorText}>Unable to load businesses</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Icon name="refresh" size={16} color="#ffffff" />
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f7ff' }}>
      {refreshing && (
        <View style={styles.refreshingIndicator}>
          <ActivityIndicator size="small" color="#2e3192" />
        </View>
      )}
      
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
      />
      
      {routes.length === 0 && !loading && !error && (
        <View style={styles.noBusinessContainer}>
          <Icon name="building" size={50} color="#cccccc" />
          <Text style={styles.noBusinessText}>No businesses found</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
            <Icon name="refresh" size={16} color="#ffffff" />
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2e3192',
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  button: {
    backgroundColor: '#2e3192',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 10,
    elevation: 2,
    alignItems: 'center',
    paddingRight: 10,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  searchIconContainer: {
    padding: 5,
  },
  memberList: {
    padding: 10,
  },
  memberItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 2,
  },
  imageColumn: {
    marginRight: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
  },
  textColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e3192',
  },
  memberRole: {
    fontSize: 14,
    color: 'gray',
  },
  alarmContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: '#2e3192',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  refreshButtonText: {
    color: '#ffffff',
    marginLeft: 5,
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7ff',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 247, 255, 0.7)',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7ff',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  noBusinessContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7ff',
  },
  noBusinessText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    marginBottom: 20,
  },
  refreshingIndicator: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7ff',
  },
});