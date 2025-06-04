import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  BackHandler,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API_BASE_URL } from '../constants/Config';
import { useSelector } from 'react-redux';

const { width, height } = Dimensions.get('window'); 

const NewMember = ({ navigation }) => {
  const userId = useSelector((state) => state.UserId);
  console.log('User ID from Redux:-------------------', userId);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approvingId, setApprovingId] = useState(null);
  const [businessInfo, setBusinessInfo] = useState([]);
  const [LocationID, setLocationID] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  console.log('Business Info:=========', businessInfo[0]?.L);
  console.log('LocationID:=========', LocationID);
  
  const fetchBusinessInfo = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/user/business-infodrawer/${userId}`);
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Business Info:=========', data);
      
      if (!Array.isArray(data) || data.length === 0) {
        setBusinessInfo([]);
        setLocationID(null);
        return;
      }
      
      setBusinessInfo(data);
      setLocationID(data[0].L);
    } catch (error) {
      console.error('API call error:', error);
      setError('Failed to load business information');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  const decodeIsApproved = (buffer) => {
    if (!buffer || !buffer.data) return 0;
    return buffer.data[0];
  };

  const handleAccept = async (userId,Mobileno) => {
  try {
    setApprovingId(userId);

    // Step 1: Approve the user
    const response = await fetch(`${API_BASE_URL}/api/approve/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    // Step 2: Update UI
    setMembers(prevMembers =>
      prevMembers.map(member =>
        member.UserId === userId
          ? { ...member, IsApproved: { data: [1] } }
          : member
      )
    );

    // Step 3: Send WhatsApp message
    const whatsappResponse = await fetch(`${API_BASE_URL}/api/send-whatsapp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
  body: JSON.stringify({
    mobileno: Mobileno,
    message: "🎉 Congratulations! Your registration has been successfully approved. 🌟Welcome aboard!",
  }),
    });

    if (!whatsappResponse.ok) {
      console.warn('WhatsApp message failed to send');
    }
  } catch (error) {
    console.error('Error approving user or sending WhatsApp message:', error);
  } finally {
    setApprovingId(null);
  }
};




  const fetchMembers = useCallback(async () => {
    if (!LocationID) {
      console.log('LocationID not available yet');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/users/last-month/${LocationID}`);
      const data = await response.json();
      console.log('Members data:', data);
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch members.');
      }
      const updatedMembers = await Promise.all(data.map(async (member) => {
        try {
          const imageResponse = await fetch(`${API_BASE_URL}/profile-image?userId=${member.UserId}`);
          
          if (imageResponse.ok) {
            const imageData = await imageResponse.json();
            const uniqueImageUrl = `${imageData.imageUrl}?t=${new Date().getTime()}`;
            return { ...member, profileImage: uniqueImageUrl };
          }
          return { ...member, profileImage: null };
        } catch (error) {
          console.error('Error fetching image:', error); 
          return { ...member, profileImage: null };
        }
      }));

      setMembers(updatedMembers);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [LocationID]);






  useEffect(() => {
    fetchBusinessInfo();
  }, [fetchBusinessInfo]);
  useEffect(() => {
    if (LocationID) {
      fetchMembers();
    }
  }, [LocationID, fetchMembers]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      navigation.setOptions({ tabBarStyle: { display: 'flex' } });
      if (LocationID) {
        fetchMembers();
      }
    });
    
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (searchQuery) {
        setSearchQuery('');
        navigation.setOptions({ tabBarStyle: { display: 'flex' } });
        return true; 
      }
      return false;
    });

    return () => {
      unsubscribe();
      backHandler.remove();
    };
  }, [navigation, LocationID, fetchMembers]);

  const filteredMembers = members
    .filter((member) =>
      member.Username.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => b.UserId - a.UserId);

  const renderMember = ({ item }) => {
    const isApproved = decodeIsApproved(item.IsApproved);
    
    return (
      <View style={styles.memberItem}>
        <View style={styles.memberDetails}>
          <ProfilePic image={item.profileImage} name={item.Username} />
          <View style={styles.memberText}>
            <Text style={styles.memberName}>{item.Username}</Text>
          </View>
        </View>
        {isApproved === 0 ? (
          <TouchableOpacity 
            style={styles.acceptButton}
            onPress={() => handleAccept(item.UserId, item.Mobileno)}
            disabled={approvingId === item.UserId}
          >
            {approvingId === item.UserId ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.buttonText}>Approve</Text>
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.approvedButton}>
            <Text style={styles.buttonText}>Approved</Text>
          </View>
        )}
      </View>
    );
  };

  const handleFocus = () => {
    navigation.setOptions({ tabBarStyle: { display: 'none' } });
  };

  const handleBlur = () => {
    navigation.setOptions({ tabBarStyle: { display: 'flex' } });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search members"
          placeholderTextColor="black"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={handleFocus}
          onBlur={handleBlur}
          color="#2e3192"
        />
        <View style={styles.searchIconContainer}>
          <Icon name="search" size={23} color="#2e3192" />
        </View>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#2e3192" style={styles.loader} />
      ) : (
        <>
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : (
            <>
              {!LocationID ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>Location information not available</Text>
                </View>
              ) : (
                <>
                  <FlatList
                    data={filteredMembers}
                    renderItem={renderMember}
                    contentContainerStyle={styles.memberList}
                    keyExtractor={(item) => item.UserId.toString()}
                  />
                  <View style={styles.memberCountContainer}>
                    <Text style={styles.memberCountText}>Count: {filteredMembers.length}</Text>
                  </View>
                </>
              )}
            </>
          )}
        </>
      )}
    </View>
  );
};

const ProfilePic = ({ image, name }) => {
  const initial = name.charAt(0).toUpperCase();

  return (
    <View style={styles.profilePicContainer}>
      {image ? (
        <Image source={{ uri: image }} style={styles.profileImage} />
      ) : (
        <View style={[styles.profilePicContainer, { backgroundColor: '#2e3192' }]}>
          <Text style={styles.profilePicText}>{initial}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#CCC',
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 0,
    backgroundColor: '#FFFFFF',
    position: 'relative',
    color: '#2e3192',
    borderRadius: 10,
    margin: 10,
    marginHorizontal: width * 0.1,
  },
  searchInput: {
    flex: 1,
    borderRadius: 25,
    paddingLeft: 50,
    fontSize: 16,
    paddingVertical: 8,
  },
  searchIconContainer: {
    position: 'absolute',
    left: 21,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  memberList: {
    flexGrow: 1,
    paddingHorizontal: 10,
    margin: 10,
    paddingBottom: 20,
  },
  memberItem: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    paddingVertical: 20,
    borderRadius: 10,
    marginBottom: 8,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  memberDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberText: {
    marginLeft: 10,
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  memberCountContainer: {
    position: 'absolute',
    bottom: 40,
    left: width * 0.75,
    backgroundColor: 'rgba(250, 250, 250, 0.8)',
    padding: 10,
    borderRadius: 19,
    borderColor: '#2e3192',
    borderWidth: 2,
  },
  memberCountText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2e3192',
  },
  errorContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePicContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePicText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 5,
    marginLeft: 10,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  approvedButton: {
    backgroundColor: 'gray',
    padding: 8,
    borderRadius: 5,
    marginLeft: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default NewMember;