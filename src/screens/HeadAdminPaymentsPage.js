import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  BackHandler,
  ActivityIndicator,Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API_BASE_URL } from '../constants/Config';

const { width, height } = Dimensions.get('window'); // Get screen dimensions

const HeadAdminPaymentsPage = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState([]); // State to store the new members
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch members from the API
  const fetchMembers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/last-month`);
      const data = await response.json();
      console.log("Data for new sub----------------------",data);
    //   data.members.forEach(member => {
    //     console.log("ROLLID IN MEMBERS LIST SCREEN---------------------------------", member.UserId);
    // });
  
      if (response.ok) {
        // Fetch profile images for each member
        const updatedMembers = await Promise.all(data.map(async (member) => {
          try {
            // Fetch profile image for each member
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
              
              // Print the image URL to the console
              console.log(`Profile Image URL for ${member.Username}: ${member.profileImage}`); // Log image URL
            } else {
              console.error('Failed to fetch profile image:', member.UserId);
              member.profileImage = null; // Set image to null if fetch fails
            }
          } catch (error) {
            console.error('Error fetching image:', error); // Log image fetch errors
            member.profileImage = null; // Set image to null if there is an error
          }
          return member; // Return member with updated profile image
        }));
  
        setMembers(updatedMembers); // Set members data with profile images
      } else {
        throw new Error(data.message || 'Failed to fetch members.');
      }
    } catch (err) {
      setError(err.message); // Set error if something goes wrong
    } finally {
      setLoading(false); // Set loading to false once the API call is done
    }
  };
  

  // Fetch data when the component mounts
  useEffect(() => {
    fetchMembers(); // Fetch new members when the component mounts

    // Set the tabBar to be shown when the screen is focused
    const unsubscribe = navigation.addListener('focus', () => {
      navigation.setOptions({ tabBarStyle: { display: 'flex' } });
    });

    // Handle back button press to manage the tab bar and search field visibility
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (searchQuery) {
        // If searchQuery is not empty, clear the search and show the tab bar
        setSearchQuery(''); // Clear search query
        navigation.setOptions({ tabBarStyle: { display: 'flex' } });
        return true; // Prevent default back button behavior
      }
      return false; // Allow default back button behavior if no search query
    });

    return () => {
      unsubscribe(); // Cleanup the navigation listener
      backHandler.remove(); // Cleanup the back button listener
    };
  }, [navigation, searchQuery]);

  // Filter members based on the search query
  const filteredMembers = members
  .filter((member) =>
    member.Username.toLowerCase().includes(searchQuery.toLowerCase())
  )
  .sort((a, b) => b.UserId - a.UserId);

  // Render member item
  const renderMember = ({ item }) => (
    <View style={styles.memberItem}>
      <View style={styles.memberDetails}>
        <ProfilePic image={item.profileImage} name={item.Username} />
        <View style={styles.memberText}>
          <Text style={styles.memberName}>{item.Username}</Text>
        </View>
      </View>
    </View>
  );

  const handleFocus = () => {
    navigation.setOptions({ tabBarStyle: { display: 'none' } });
  };

  const handleBlur = () => {
    navigation.setOptions({ tabBarStyle: { display: 'flex' } });
  };

  return (
    <View style={styles.container}>

      {/* Search Input */}
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

      {/* Loading or Members List */}
      {loading ? (
        <ActivityIndicator size="large" color="#2e3192" style={styles.loader} />
      ) : (
        <>
          {/* Error Handling */}
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : (
            <>
              {/* Members List */}
              <FlatList
                data={filteredMembers}
                renderItem={renderMember}
               
                contentContainerStyle={styles.memberList}
              />

              {/* Member Count */}
              <View style={styles.memberCountContainer}>
                <Text style={styles.memberCountText}>Count: {filteredMembers.length}</Text>
              </View>
            </>
          )}
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
    color: '#2e3192',
    borderRadius: 10,
    margin: 10,
    marginHorizontal: width * 0.1, // Use width as percentage
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
    paddingVertical:20,
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
    color:'black',
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
});

export default HeadAdminPaymentsPage;


























