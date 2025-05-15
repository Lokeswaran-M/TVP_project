import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import styles from '../components/layout/MembersStyle';
import { API_BASE_URL } from '../constants/Config';

const OneMinPresentation = ({ route, navigation }) => {
  const { eventId, locationId } = route.params;

  const [searchQuery, setSearchQuery] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/attendance/${eventId}/${locationId}`);
        const data = await response.json();
        console.log("-------------------data---------------------", data);
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
              member.profileImage = uniqueImageUrl;
            } else {
              console.error('Failed to fetch profile image:', member.UserId);
              member.profileImage = null;
            }
          } catch (error) {
            console.error('Error fetching image:', error);
            member.profileImage = null;
          }
          const inTime = new Date(member.InTime);
          const formattedTime = inTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          member.formattedInTime = formattedTime;

          return member;
        }));

        setAttendanceData(updatedMembers);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendanceData();
  }, [eventId, locationId]);
  const filteredMembers = attendanceData.filter(member =>
    member.Username && member.Username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const renderMember = ({ item }) => (
    <TouchableOpacity style={styles.memberItem} onPress={() => handleAlarmPress(item)} >
      <View style={styles.imageColumn}>
        <Image
          source={{ uri: item.profileImage }} 
          style={[styles.profileImage]}
        />
      </View>
      <View style={styles.textColumn}>
        <Text style={styles.memberName}>{item.Username}</Text>
        <Text style={styles.memberRole} numberOfLines={1}>
          {item.Profession} 
        </Text>
      </View>
      <View style={styles.alarmContainer}>
        <TouchableOpacity onPress={() => handleAlarmPress(item)}>
          <MaterialIcons name="alarm" size={28} right={-10} color="#2e3091" />
          <Text style={styles.memberTime}  >{item.formattedInTime}</Text> 
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
  const handleAlarmPress = (member) => {
    navigation.navigate('StopWatch', { member });
  };
  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#2e3192" />
      ) : (
        <>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by username..."
              placeholderTextColor="black"
              value={searchQuery}
              onChangeText={setSearchQuery}
              color="#2e3192"
            />
            <View style={styles.searchIconContainer}>
              <Icon name="search" size={23} color="#2e3192" />
            </View>
          </View>
          {filteredMembers.length === 0 ? (
            <View style={styles.noResultsTextcon}>
              <Text style={styles.noResultsText}>No users found</Text>
            </View>
          ) : (
            <FlatList
              data={filteredMembers}
              renderItem={renderMember}
              keyExtractor={(item) => item.UserId.toString()}
              contentContainerStyle={styles.memberList}
            />
          )}
          <View style={styles.memberCountContainer}>
            <Text style={styles.memberCountText}>Count: {filteredMembers.length}</Text>
          </View>
        </>
      )}
    </View>
  );
};

export default OneMinPresentation;