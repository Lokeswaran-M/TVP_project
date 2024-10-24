import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '../components/layout/MembersStyle';
import { API_BASE_URL } from '../constants/Config';

const OneMinPresentation = ({ route, navigation }) => {
  // Get the passed data from route.params
  const { userId, eventId, location, slotId, dateTime } = route.params;

  // State for member search and list
  const [searchQuery, setSearchQuery] = useState('');
  const [attendanceData, setAttendanceData] = useState([]); // State for attendance data
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/attendance/${eventId}`);
  
        // Check if the response is not OK (e.g., 404, 500, etc.)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        // Try to parse the response as JSON
        const data = await response.json();
        setAttendanceData(data); // Set attendance data if JSON is valid
  
      } catch (error) {
        // Catch any errors and log them
        console.error('Error fetching attendance data:', error);
        if (error.message.includes('Unexpected character')) {
          console.error('It seems like the response is not in JSON format');
        }
      } finally {
        setLoading(false); // End the loading state
      }
    };
  
    fetchAttendanceData();
  }, [eventId]);
  

  // Filter members based on search query (searching by username)
  const filteredMembers = attendanceData.filter(member =>
    member.username && member.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to render each member in the list, displaying userId and username
  const renderMember = ({ item }) => (
    <View style={styles.memberItem}>
      <View style={styles.memberDetails}>
        <ProfilePic name={item.username} />
        <View style={styles.memberText}>
          <Text style={styles.memberName}>ID: {item.userId}</Text> {/* Display userId */}
          <Text style={styles.memberRole}>Username: {item.username}</Text> {/* Display username */}
        </View>
      </View>
      <View style={styles.alarmContainer}>
        <TouchableOpacity onPress={() => handleAlarmPress(item)}>
          <MaterialIcons name="alarm" size={28} color="#A3238F" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Handle the alarm button press (navigate to stopwatch with user data)
  const handleAlarmPress = (member) => {
    navigation.navigate('StopWatch', { member });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading attendance data...</Text> // Display loading indicator
      ) : (
        <>
          {/* Member Search Section */}
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

          {/* Member List */}
          <FlatList
            data={filteredMembers}
            renderItem={renderMember}
            keyExtractor={(item) => item.userId.toString()} // Use userId as the key
            contentContainerStyle={styles.memberList}
          />

          {/* Member Count */}
          <View style={styles.memberCountContainer}>
            <Text style={styles.memberCountText}>Count: {filteredMembers.length}</Text>
          </View>
        </>
      )}
    </View>
  );
};

// ProfilePic Component for member initials
const ProfilePic = ({ name }) => {
  const initial = name.charAt(0).toUpperCase();
  return (
    <View style={styles.profilePicContainer}>
      <Text style={styles.profilePicText}>{initial}</Text>
    </View>
  );
};

export default OneMinPresentation;
