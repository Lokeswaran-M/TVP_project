import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '../components/layout/MembersStyle';
import { API_BASE_URL } from '../constants/Config';

const OneMinPresentation = ({ route, navigation }) => {
  const { eventId } = route.params;

  const [searchQuery, setSearchQuery] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/attendance/${eventId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Fetch profile images for each member
        const updatedMembers = await Promise.all(data.map(async (member) => {
          try {
            const imageResponse = await fetch(`${API_BASE_URL}/profile-image?userId=${member.UserId}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
  
            if (imageResponse.ok) {
              const imageData = await imageResponse.json();
              const uniqueImageUrl = `${imageData.imageUrl}?t=${new Date().getTime()}`;
              member.profileImage = uniqueImageUrl; // Assign image URL to member
            } else {
              console.error('Failed to fetch profile image:', member.UserId);
              member.profileImage = null; // Set image to null if fetch fails
            }
          } catch (error) {
            console.error('Error fetching image:', error);
            member.profileImage = null; // Set image to null if there is an error
          }
          return member; // Return member with updated profile image
        }));

        setAttendanceData(updatedMembers); // Set attendance data with profile images
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [eventId]);

  const filteredMembers = attendanceData.filter(member =>
    member.Username && member.Username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderMember = ({ item }) => (
    <View style={styles.memberItem}>
      <View style={styles.memberDetails}>
        <ProfilePic image={item.profileImage} name={item.Username} />
        <View style={styles.memberText}>
          <Text style={styles.memberName}>{item.Username}</Text>
          <Text style={styles.memberRole}>{item.Profession}</Text>
        </View>
      </View>
      <View style={styles.alarmContainer}>
        <TouchableOpacity onPress={() => handleAlarmPress(item)}>
          <MaterialIcons name="alarm" size={28} color="#A3238F" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleAlarmPress = (member) => {
    navigation.navigate('StopWatch', { member });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#A3238F" />
      ) : (
        <>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by username..."
              placeholderTextColor="black"
              value={searchQuery}
              onChangeText={setSearchQuery}
              color="#A3238F"
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
            <Text style={styles.memberCountText}>Count: {filteredMembers.length}</Text>
          </View>
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
        <Text style={styles.profilePicText}>{initial}</Text>
      )}
    </View>
  );
};

export default OneMinPresentation;

