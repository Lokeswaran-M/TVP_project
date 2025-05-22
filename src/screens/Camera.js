import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  TextInput,
  FlatList,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  StyleSheet,
  RefreshControl
} from 'react-native';
import { API_BASE_URL } from '../constants/Config';
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

const MembersList = ({ businesses, navigation, userId, businessInfo }) => {
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
      const allMembersPromises = businesses.map(async (business) => {
        const response = await fetch(`${API_BASE_URL}/list-memberscamera`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ LocationID: business.L, userId }),
        });
        
        if (!response.ok) {
          if (response.status === 404) {
            return [];
          }
          throw new Error(`Server responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.members || [];
      });

      const allMembersArrays = await Promise.all(allMembersPromises);
      const allMembers = allMembersArrays.flat();

      console.log('All members data:========================', allMembers);

      if (allMembers.length === 0) {
        setMembers([]);
        setError(true);
        setLoading(false);
        return;
      }

      setImageKey(Date.now());
      const groupedMembers = {};
      
      allMembers.forEach(member => {
        if (groupedMembers[member.UserId]) {
          const existingProfessions = groupedMembers[member.UserId].Profession.split(', ');
          if (!existingProfessions.includes(member.Profession)) {
            groupedMembers[member.UserId].Profession += `, ${member.Profession}`;
          }
          if (member.ratings && member.ratings.length > 0) {
            const currentRatings = groupedMembers[member.UserId].ratings || [];
            groupedMembers[member.UserId].ratings = [...currentRatings, ...member.ratings];
          }
          if (!groupedMembers[member.UserId].businessLocations) {
            groupedMembers[member.UserId].businessLocations = [];
          }
          const memberBusiness = businesses.find(b => 
            allMembers.some(m => m.UserId === member.UserId && m.LocationID === b.L)
          );
          
          if (memberBusiness && !groupedMembers[member.UserId].businessLocations.some(bl => bl.L === memberBusiness.L)) {
            groupedMembers[member.UserId].businessLocations.push(memberBusiness);
          }
        } else {
          groupedMembers[member.UserId] = { ...member };
          const memberBusiness = businesses.find(b => 
            allMembers.some(m => m.UserId === member.UserId && m.LocationID === b.L)
          );
          
          if (memberBusiness) {
            groupedMembers[member.UserId].businessLocations = [memberBusiness];
          }
        }
      });

      const uniqueMembers = Object.values(groupedMembers);
      const updatedMembers = await Promise.all(uniqueMembers.map(async (member) => {
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
  }, [businesses, userId]);

  useEffect(() => {
    if (businesses && businesses.length > 0) {
      fetchMembers();
    }
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
    openCamera(meetId, member);
  };

const openCamera = (meetId, member) => {
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
    await insertMeetingData(userId, meetId, member, photoUri);
  });
};
  const getAllProfessionsForLocation = (locationId) => {
    const businessesForLocation = businessInfo.filter(business => business.L === locationId);
    const professions = businessesForLocation.map(business => business.BD);
    return professions;
  };
const insertMeetingData = async (userId, meetId, member, photoUri) => {
  try {
    const businessLocations = member.businessLocations || [];
    let successCount = 0;
    let totalUploads = businessLocations.length;
    
    console.log(`Uploading to ${totalUploads} businesses for member:`, member.Username);
    
    for (const business of businessLocations) {
      try {
        // Get all professions for this business location
        // You can get this from your business info data or fetch it separately
        const allProfessionsForLocation = getAllProfessionsForLocation(business.L);
        
        const formData = new FormData();
        formData.append('image', {
          uri: photoUri,
          type: 'image/jpeg',
          name: `${userId}_${meetId}_${business.L}_${new Date().toISOString().replace(/[-:.]#/g, '').slice(0, 12)}.jpeg`,
        });
        formData.append('MeetId', meetId);  
        formData.append('LocationID', business.L);
        
        // Send all professions for this location as JSON string
        formData.append('Professions', JSON.stringify(allProfessionsForLocation));

        console.log(`Uploading to business: ${business.BD} (LocationID: ${business.L})`);
        console.log(`Professions for this location:`, allProfessionsForLocation);

        const uploadResponse = await fetch(`${API_BASE_URL}/upload-member-details?userId=${userId}`, {
          method: 'POST',
          body: formData,
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        
        const result = await uploadResponse.json();
        if (result.message === 'Member details and image uploaded successfully!') {
          successCount++;
          console.log(`✓ Successfully uploaded to ${business.BD} with ${result.processedProfessions} professions`);
        } else {
          console.error(`✗ Failed to upload to ${business.BD}:`, result);
        }
      } catch (businessError) {
        console.error(`Error uploading to business ${business.BD}:`, businessError);
      }
    }
    
    if (successCount === totalUploads) {
      setModalTitle('Success');
      setModalMessage(`Photo uploaded successfully!`);
    } else if (successCount > 0) {
      setModalTitle('Partial Success');
      setModalMessage(`Photo uploaded to ${successCount} out of ${totalUploads} businesses. Some uploads failed.`);
    } else {
      setModalTitle('Error');
      setModalMessage('Photo and data upload failed for all businesses');
    }
    
    setModalVisible(true);
    fetchMembers(); 
    
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
      {item.businessLocations && item.businessLocations.length > 1 && (
        <View style={styles.businessBadge}>
          <Text style={styles.businessBadgeText}>{item.businessLocations.length}</Text>
        </View>
      )}
    </View>
    <View style={styles.textColumn}>
      <Text style={styles.memberName}>{item.Username}</Text>
      <Text style={styles.memberRole} numberOfLines={2}>
        {item.Profession}
      </Text>
      {item.businessLocations && item.businessLocations.length > 1 && (
        <Text style={styles.businessCount}>
          Will upload to {item.businessLocations.length} businesses
        </Text>
      )}
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

export default function ProfessionView({ navigation }) {
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
      console.log('Business info data:==================', data);

      if (response.ok) {
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
  const hasPaidBusiness = businessInfo.some(business => business.IsPaid === 1);
  const paidBusinesses = businessInfo.filter(business => business.IsPaid === 1);

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2e3192" />
      </View>
    );
  }

  if (error && businessInfo.length === 0) {
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
      
      {businessInfo.length > 0 ? (
        hasPaidBusiness ? (
          <MembersList
            businesses={paidBusinesses}
            userId={userId}
            navigation={navigation}
            businessInfo={businessInfo}
          />
        ) : (
          <Subscription 
            navigation={navigation}
            route={{ 
              params: { 
                locationId: businessInfo[0].L, 
                Profession: businessInfo[0].BD 
              } 
            }} 
          />
        )
      ) : (
        !loading && !error && (
          <View style={styles.noBusinessContainer}>
            <Icon name="building" size={50} color="#cccccc" />
            <Text style={styles.noBusinessText}>No businesses found</Text>
            <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
              <Icon name="refresh" size={16} color="#ffffff" />
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        )
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
  businessSelectorContainer: {
    backgroundColor: 'white',
    paddingVertical: 10,
    elevation: 2,
  },
  businessSelectorItem: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  selectedBusinessItem: {
    backgroundColor: '#2e3192',
  },
  businessSelectorText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedBusinessText: {
    color: 'white',
  },
  professionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 2,
  },
  professionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e3192',
    marginLeft: 10,
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
  businessCount: {
    fontSize: 12,
    color: '#2e3192',
    fontStyle: 'italic',
    marginTop: 2,
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
    businessBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff6b6b',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  businessBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  businessCount: {
    fontSize: 12,
    color: '#ff6b6b',
    fontStyle: 'italic',
    marginTop: 2,
    fontWeight: '500',
  },
});