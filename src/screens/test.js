import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../components/layout/MembersStyle';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../constants/Config';
import { useNavigation } from '@react-navigation/native';

const Members = () => {
    const navigation = useNavigation();
    const userId = useSelector((state) => state.user?.userId);
    const [profileData, setProfileData] = useState({});
    const [members, setMembers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchData = async () => {
        try {
            const profileResponse = await fetch(${API_BASE_URL}/api/user/business-info/${userId});
            if (!profileResponse.ok) {
                throw new Error('Failed to fetch profile data');
            }
            const profileData = await profileResponse.json();
            console.log("PROFILE DATA IN MEMBERS LIST------------------------------------",profileData);
            setProfileData(profileData);
        } catch (error) {
            console.error('Error fetching profile data:', error);
        }
    };

    const fetchMembers = async () => {
        if (!profileData.LocationID || !profileData.ChapterType) {
            console.log("Profile data not available yet");
            return;
        }
        try {
            const membersResponse = await fetch(${API_BASE_URL}/list-members, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    LocationID: profileData.LocationID,
                    chapterType: profileData.ChapterType,
                }),
            });
            if (!membersResponse.ok) {
                throw new Error('Failed to fetch members');
            }
            const data = await membersResponse.json();
            console.log("MEMBERS DATA IN MEMBERS LIST SCREEN---------------------------------", data);
            const updatedMembers = await Promise.all(data.members.map(async member => {
                let totalStars = 0;
                if (member.ratings.length > 0) {
                    member.ratings.forEach(rating => {
                        totalStars += parseFloat(rating.average) || 0;
                    });
                    const totalAverage = totalStars / member.ratings.length;
                    member.totalAverage = Math.round(totalAverage) || 0;
                } else {
                    member.totalAverage = 0;
                }
                
                const imageResponse = await fetch(${API_BASE_URL}/profile-image?userId=${member.UserId});
                if (imageResponse.ok) {
                    const imageData = await imageResponse.json();
                    member.profileImage = imageData.imageUrl;
                } else {
                    console.error('Failed to fetch profile image:', member.UserId);
                    member.profileImage = null;
                }
                return member;
            }));
            
            setMembers(updatedMembers);
        } catch (error) {
            console.error('Error fetching members:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [userId])
    );

    useFocusEffect(
        useCallback(() => {
            if (profileData.LocationID && profileData.ChapterType) {
                fetchMembers();
            }
        }, [profileData])
    );

    const filteredMembers = members.filter(member =>
        member.Username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const renderMember = ({ item }) => (
        <View style={styles.memberItem}>
            <TouchableOpacity
                style={styles.memberDetails}
                onPress={() => navigation.navigate('MemberDetails', { userId: item.UserId })}
            >
                <ProfilePic imageUrl={item.profileImage} name={item.Username} />
                <View style={styles.memberText}>
                    <Text style={styles.memberName}>{item.Username}</Text>
                    <Text style={styles.memberRole}>{item.Profession}</Text>
                </View>
                <View style={styles.ratingContainer}>
    {[...Array(Math.max(0, item.totalAverage))].map((_, index) => (
        <Icon key={index} name="star" size={16} color="#FFD700" />
    ))}
</View>
            </TouchableOpacity>
        </View>
    );
    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search members..."
                    placeholderTextColor="black"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    color='#A3238F'
                />
                <View style={styles.searchIconContainer}>
                    <Icon name="search" size={23} color="#A3238F" />
                </View>
            </View>
            <FlatList
                data={filteredMembers}
                renderItem={renderMember}
                keyExtractor={(item) => item.UserId.toString()}
                contentContainerStyle={styles.memberList}
            />
            <View style={styles.memberCountContainer}>
                <Text style={styles.memberCountText}>
                    Count: {filteredMembers.length}
                </Text>
            </View>
        </View>
    );
};

const ProfilePic = ({ name, imageUrl }) => {
    if (imageUrl) {
        return (
            <Image
                source={{ uri: imageUrl }}
                style={styles.profilePicImage}
            />
        );
    }
    const initial = name.charAt(0).toUpperCase();
    return (
        <View style={styles.profilePicContainer}>
            <Text style={styles.profilePicText}>{initial}</Text>
        </View>
    );
};
export default Members;

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { useSelector } from 'react-redux';

const HomeScreen = () => {
  const userId = useSelector((state) => state.user?.userId);
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = `${API_BASE_URL}/getUpcomingEvents?userId=${userId}`;
  const ATTENDANCE_API_URL = `${API_BASE_URL}/api/attendance`;

  useEffect(() => { 
    const fetchEventData = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (response.ok) {
          setEventData(data.events[0]); 
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchEventData();
  },[]);

  const handleConfirmClick = async () => {
    if (!eventData) {
      Alert.alert('Error', 'No event data available');
      return;
    }
    try {
      const response = await fetch(ATTENDANCE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UserId: userId, 
          LocationID: eventData.LocationID || '100003', 
          EventId: eventData.EventId, 
        }),
      });  

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Attendance confirmed successfully');
      } else {
        Alert.alert('Error', data.error || 'Failed to confirm attendance');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Network or server issue');
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Requirements</Text>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Add Requirement</Text>
          </TouchableOpacity>
        </View>

        {/* Requirement Card */}
        <View style={styles.requirementCard}>
          <View style={styles.profileContainer}>
            <Image
              source={{ uri: 'https://example.com/profile-pic.jpg' }}  // Replace with actual image
              style={styles.profileImage}
            />
            <Text style={styles.profileName}>Chandru</Text>
          </View>
          
          <View style={styles.requirementContent}>
            <Text style={styles.requirementText}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque vel dapibus libero...
            </Text>
            <TouchableOpacity style={styles.acknowledgeButton}>
              <Text style={styles.acknowledgeButtonText}>Acknowledge</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#D81B60',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  requirementCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  requirementContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  requirementText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  acknowledgeButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#D81B60',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  acknowledgeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },



});

export default HomeScreen;


import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const RequirementCard = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Requirements</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add Requirement</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: 'https://via.placeholder.com/50' }} // Replace with actual image link
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>Chandru</Text>
        </View>

        <View style={styles.requirementSection}>
          <Text style={styles.requirementText}>
            XXXXX X XXXXX XXXXX XXXXX X X X XXXXX XXXXXXXXXXXX XXX XXXXXXXXXXXXXX XXXXX X XXXXX
          </Text>
          <TouchableOpacity style={styles.acknowledgeButton}>
            <Text style={styles.acknowledgeText}>Acknowledge</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.pagination}>
        <View style={styles.activeDot} />
        <View style={styles.inactiveDot} />
        <View style={styles.inactiveDot} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F8F8F8',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7E3F8F',
  },
  addButton: {
    backgroundColor: '#A83893',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#F6EDF7',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7E3F8F',
  },
  requirementSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    position: 'relative',
  },
  requirementText: {
    color: '#7E3F8F',
    lineHeight: 20,
  },
  acknowledgeButton: {
    position: 'absolute',
    top: -20,
    right: 0,
    backgroundColor: '#A83893',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  acknowledgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeDot: {
    width: 8,
    height: 8,
    backgroundColor: '#A83893',
    borderRadius: 4,
    marginHorizontal: 4,
  },
  inactiveDot: {
    width: 8,
    height: 8,
    backgroundColor: '#D8D8D8',
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default RequirementCard;




