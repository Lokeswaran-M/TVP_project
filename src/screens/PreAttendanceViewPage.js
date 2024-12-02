import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API_BASE_URL } from '../constants/Config';

const { width } = Dimensions.get('window'); // Get screen dimensions

const PreAttendanceViewPage = ({ route, navigation }) => {
  const { eventId } = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch members from the API
  const fetchMembers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/Pre-attendanceView?eventId=${eventId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch members.');
      }
      const data = await response.json();

      console.log('---------------------------Pre data--------------',data);

      const updatedMembers = await Promise.all(
        data.map(async (member) => {
          try {
            const imageResponse = await fetch(`${API_BASE_URL}/profile-image?userId=${member.UserId}`);
            if (imageResponse.ok) {
              const imageData = await imageResponse.json();
              member.profileImage = `${imageData.imageUrl}?t=${Date.now()}`;
            } else {
              member.profileImage = null; // Default to null if image fetch fails
            }
          } catch {
            member.profileImage = null; // Default to null on error
          }
          return member;
        })
      );

      setMembers(updatedMembers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [eventId]);

  const filteredMembers = members.filter((member) =>
    member.Username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search members"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Icon name="search" size={20} color="#A3238F" style={styles.searchIcon} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#A3238F" style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : filteredMembers.length === 0 ? (
        <Text style={styles.emptyText}>No members found.</Text>
      ) : (
        <>
          <FlatList
            data={filteredMembers}
            renderItem={({ item }) => (
              <View style={styles.memberItem}>
                <ProfilePic image={item.profileImage} name={item.Username} />
                
       
                <View style={styles.memberText}>
          <Text style={styles.memberName}>{item.Username}</Text>
          <Text style={styles.memberRole}>{item.Profession}</Text>
        </View>
              </View>
            )}
            keyExtractor={(item) => item.UserId.toString()}
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

// Profile Pic Component
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

// Styles
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
    color: '#A3238F',
    borderRadius: 10,
    margin: 20,
    marginHorizontal: width * 0.1,
  },
  searchInput: {
    flex: 1,
    borderRadius: 25,
    paddingLeft: 50,
    fontSize: 16,
    paddingVertical: 8,
  },
  searchIcon: {
    position: 'absolute',
    left: 20,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  memberList: {
    flexGrow: 1,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  memberItem: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    paddingVertical: 19,
    borderRadius: 10,
    marginBottom: 8,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
  },

  memberText: {
    marginLeft: 10,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
    color: 'black',
  },
  memberRole: {
    fontSize: 14,
    color: 'gray',
  },
  memberCountContainer: {
    position: 'absolute',
    bottom: 40,
    left: width * 0.75,
    backgroundColor: 'rgba(250, 250, 250, 0.8)',
    padding: 10,
    borderRadius: 20,
    borderColor: '#A3238F',
    borderWidth: 2,
  },
  memberCountText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#A3238F',
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
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
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#A3238F',
    marginTop: 20,
  },
});

export default PreAttendanceViewPage;

