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

const HeadAdminNewSubscribers = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState([]); // State to store the new members
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch members from the API
  const fetchMembers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/last-week`);
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
  const filteredMembers = members.filter((member) =>
    member.Username.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          color="#A3238F"
        />
        <View style={styles.searchIconContainer}>
          <Icon name="search" size={23} color="#A3238F" />
        </View>
      </View>

      {/* Loading or Members List */}
      {loading ? (
        <ActivityIndicator size="large" color="#A3238F" style={styles.loader} />
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
    color: '#A3238F',
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
    paddingVertical:15,
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
    backgroundColor: '#A3238F',
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

export default HeadAdminNewSubscribers;


// // Styles
// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#CCC',
//     flex: 1,
//   },
 

//   // Search Bar Styles
//   searchContainer: {
//     flexDirection: 'row',
//     padding: 0,
//     backgroundColor: '#FFFFFF',
//     position: 'relative',
//     color: '#A3238F',
//     borderRadius: 10,
//     margin: 10,
//     marginHorizontal: width * 0.1, // Use width as percentage
//   },
//   searchInput: {
//     flex: 1,
//     borderRadius: 25,
//     paddingLeft: 50,
//     fontSize: 16,
//     paddingVertical: 8,
//   },
//   searchIconContainer: {
//     position: 'absolute',
//     left: 21,
//     top: '50%',
//     transform: [{ translateY: -12 }],
//   },

//   // Member List Styles
//   memberList: {
//     flexGrow: 1,
//     paddingHorizontal: 10,
//     margin: 10,
//     paddingBottom: 20,
//   },
//   memberItem: {
//     backgroundColor: '#FFFFFF',
//     padding: 8,
//     borderRadius: 10,
//     marginBottom: 8,
//     elevation: 2,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   memberDetails: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   profilePicContainer: {
//     width: width * 0.12, // Relative width
//     height: width * 0.12, // Same height for circular shape
//     borderRadius: width * 0.06, // Half of the width
//     backgroundColor: '#A3238F',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 10,
//   },
//   profilePicText: {
//     color: '#FFFFFF',
//     fontSize: width * 0.08, // Scalable font size
//     fontWeight: 'bold',
//   },
//   memberText: {
//     flex: 1,
//   },
//   memberName: {
//     fontSize: width * 0.045, // Scalable font size
//     fontWeight: 'bold',
//     color: '#A3238F',
//   },

//    // Member Count
//    memberCountContainer: {
//     position: 'absolute',
//     backgroundColor: 'rgba(250, 250, 250, 0.8)',
//     padding: 10,
//     alignItems: 'center',
//     borderRadius: 20,
//     borderWidth: 2,
//     borderColor: '#A3238F',
//     left: width * 0.6, // Relative positioning
//     top: height * 0.8, // Relative positioning
//   },
//   memberCountText: {
//     fontSize: width * 0.04, // Scalable font size
//     fontWeight: 'bold',
//     color: '#A3238F',
//   },
//   loader: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 16,
//   },
// });

// export default HeadAdminNewSubscribers;
