import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Dimensions,
  Image,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import { API_BASE_URL } from '../constants/Config';

const { width, height } = Dimensions.get('window');

const HeadAdminMembersPage = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState([]); // All fetched members
  const [filteredMembers, setFilteredMembers] = useState([]); // Filtered members after submit
  const [isFilterPressed, setIsFilterPressed] = useState(false);
  const [locationOptions, setLocationOptions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedIcons, setSelectedIcons] = useState({ sunActive: false, moonActive: false });
  const [selectedOption, setSelectedOption] = useState(''); // Tracks the selected filter option
  const [refreshing, setRefreshing] = useState(false);

  // Fetch members data and location names only once
  const fetchMembersData = async () => {
    setRefreshing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/user-details-ratings`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      // Calculate star ratings and add it to each member
      const updatedMembers = await Promise.all(data.map(async (member) => {
        let totalStars = 0;
        if (member.Ratings.length > 0) {
          member.Ratings.forEach((rating) => {
            totalStars += parseFloat(rating.average) || 0;
          });
          const totalAverage = totalStars / member.Ratings.length;
          member.totalAverage = Math.round(totalAverage) || 0;
        } else {
          member.totalAverage = 0;
        }

        // Fetch profile image
        const imageResponse = await fetch(`${API_BASE_URL}/profile-image?userId=${member.UserId}`);
        const imageData = await imageResponse.json();
        const uniqueImageUrl = `${imageData.imageUrl}?t=${new Date().getTime()}`;
        member.profileImageUrl = uniqueImageUrl;

        return member;
      }));

      setMembers(updatedMembers); // Store all members
      setFilteredMembers(updatedMembers); // Initially, set filtered members to all members

      // Extract and set unique locations
      const locations = Array.from(new Set(data.map(member => member.LocationName)));
      setLocationOptions(locations);
    } catch (error) {
      console.error('Error fetching members location data:', error);
    } finally {
      setRefreshing(false); // Set refreshing state to false
    }
  };

  useEffect(() => {
    fetchMembersData();
  }, []);

  // Filter members based on search query, location, and ChapterTypes (1 and/or 2)
  const applyFilters = () => {
    let filtered = members;

    // Filter based on RollId if selected
    if (selectedOption === 'members') {
      filtered = filtered.filter((member) => member.RollId === 3);
    } else if (selectedOption === 'admin') {
      filtered = filtered.filter((member) => member.RollId === 2);
    }

    // Filter based on location if selected
    if (selectedLocation) {
      filtered = filtered.filter((member) => member.LocationName === selectedLocation);
    }

    // Filter based on ChapterType (sun/moon active)
    if (selectedIcons.sunActive && selectedIcons.moonActive) {
      filtered = filtered.filter((member) => member.ChapterType === 1 || member.ChapterType === 2);
    } else if (selectedIcons.sunActive) {
      filtered = filtered.filter((member) => member.ChapterType === 1);
    } else if (selectedIcons.moonActive) {
      filtered = filtered.filter((member) => member.ChapterType === 2);
    }

    // Filter based on search query
    if (searchQuery) {
      filtered = filtered.filter((member) =>
        member.Username && member.Username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  // Automatically apply filters when the search query or selected options change
  useEffect(() => {
    const filtered = applyFilters();
    setFilteredMembers(filtered);
  }, [searchQuery, selectedLocation, selectedIcons, selectedOption, members]);

  // Handle clear filter
  const handleClearFilter = () => {
    setSelectedLocation('');
    setSelectedIcons({ sunActive: false, moonActive: false }); // Reset icon selection
    setSelectedOption(''); // Reset selected option
    setSearchQuery(''); // Clear search query
    setFilteredMembers(members); // Reset to show all members
  };

  // Handle Sun Icon Click
  const handleSunClick = () => {
    const newSunActiveState = !selectedIcons.sunActive;
    setSelectedIcons({ ...selectedIcons, sunActive: newSunActiveState });
  };

  // Handle Moon Icon Click
  const handleMoonClick = () => {
    const newMoonActiveState = !selectedIcons.moonActive;
    setSelectedIcons({ ...selectedIcons, moonActive: newMoonActiveState });
  };

  // Handle Button Click to select "members" or "admin"
  const handleButtonPress = (option) => {
    setSelectedOption(option); // Set the selected option
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={[styles.searchContainer, isFilterPressed ? styles.searchContainerActive : null]}>
        <TextInput
          style={[styles.searchInput, isFilterPressed ? styles.searchInputActive : null]}
          placeholder="Search members"
          placeholderTextColor="black"
          value={searchQuery}
          onChangeText={setSearchQuery}
          color="#A3238F"
        />
        <View style={styles.searchIconContainer}>
          <Icon name="search" size={23} color="black" />
        </View>
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: isFilterPressed ? '#c452b3' : '#A3238F' }]}
          onPress={() => setIsFilterPressed((prev) => !prev)}
        >
          <Ionicons name="filter" size={23} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Filter Section */}
      {isFilterPressed && (
        <View style={styles.filterContainer}>
          <View style={styles.filterSearchInputContainer}>
            <View style={styles.filterIconContainer}>
              {/* Sun icon */}
              <TouchableOpacity
                style={[styles.iconWrapper, { backgroundColor: selectedIcons.sunActive ? '#A3238F' : 'transparent' }]}
                onPress={handleSunClick}
              >
                <Icon
                  name="sun-o"
                  size={25}
                  color={selectedIcons.sunActive ? '#FFFFFF' : '#A3238F'}
                  style={styles.sunIcon}
                />
              </TouchableOpacity>

              {/* Moon icon */}
              <TouchableOpacity
                style={[styles.iconWrapper, { backgroundColor: selectedIcons.moonActive ? '#A3238F' : 'transparent' }]}
                onPress={handleMoonClick}
              >
                <Icon
                  name="moon-o"
                  size={25}
                  color={selectedIcons.moonActive ? '#FFFFFF' : '#A3238F'}
                  style={styles.moonIcon}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.filterSearchInput}>
              <Picker
                selectedValue={selectedLocation}
                onValueChange={(itemValue) => setSelectedLocation(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select location..." value="" />
                {locationOptions.map((location, index) => (
                  <Picker.Item key={index} label={location} value={location} />
                ))}
              </Picker>
              <View style={styles.searchIconContainer}>
                <Icon name="search" size={23} color="black" />
              </View>
            </View>
          </View>

          {/* Filter Options */}
          <TouchableOpacity
            style={[styles.filterOption, selectedOption === 'members' && styles.activeButton]}
            onPress={() => handleButtonPress('members')}
          >
            <Text
              style={[styles.filterOptionText, selectedOption === 'members' && styles.activeButtonText]}
            >
              Members
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterOption, selectedOption === 'admin' && styles.activeButton]}
            onPress={() => handleButtonPress('admin')}
          >
            <Text
              style={[styles.filterOptionText, selectedOption === 'admin' && styles.activeButtonText]}
            >
              Admin
            </Text>
          </TouchableOpacity>

          <View style={styles.Bottoncon}>
            <TouchableOpacity style={styles.clearButton} onPress={handleClearFilter}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Members List */}
      <FlatList
        data={filteredMembers}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.memberItem}
            onPress={() => navigation.navigate('MemberDetails', { userId: item.UserId, Profession: item.Profession })}
          >
            <View style={styles.memberDetails}>
              <Image source={{ uri: item.profileImageUrl }} style={styles.profileImage} />
              <View style={styles.memberText}>
                <Text style={styles.memberName}>{item.Username}</Text>
                <Text style={styles.memberRole}>{item.Profession}</Text>
              </View>
            </View>
            <View style={styles.ratingContainer}>
              {[...Array(Math.max(0, item.totalAverage))].map((_, index) => (
                <Icon key={index} name="star" size={16} color="#FFD700" />
              ))}
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.memberList}
        ListEmptyComponent={
          filteredMembers.length === 0 ? (
            <Text style={styles.emptyListText}>No members found in this location and ChapterType.</Text>
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchMembersData} // Call fetchMembersData when refreshed
          />
        }
      />

      {/* Member Count */}
      {filteredMembers.length > 0 && (
        <View style={styles.memberCountContainer}>
          <Text style={styles.memberCountText}>Count: {filteredMembers.length}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};
// Styles omitted for brevity

// Styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#CCC',
    flex: 1,
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  profileImage: {
    width: 40, // Adjust size as needed
    height: 40, // Adjust size as needed
    borderRadius: 20, // Make it circular
    marginRight: 10, // Space between image and text
  },
  memberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginVertical: 5,
    elevation: 2,
  },
  
  searchContainer: {
    flexDirection: 'row',
    padding: 0,
    backgroundColor: '#FFFFFF',
    position: 'relative',
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    borderRadius: 25,
    paddingHorizontal: 50,
    fontSize: 16,
  },
  searchIconContainer: {
    position: 'absolute',
    left: 15,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  filterButton: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 50,
    marginRight: 8,
  },
  filterContainer: {
    backgroundColor: '#f0e1eb',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 15,
    elevation: 5,
    marginTop: 0,
    marginBottom: 10,
  },
  filterSearchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  filterSearchInput: {
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 38,
 
    fontSize: 15,
    flex: 1,
  },
  filterSearchIconContainer: {
    position: 'absolute',
    left: 90,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  filterIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  sunIcon: {
    backgroundColor: '#FDB813',
    padding: 5,
    borderRadius: 50,
  },
  moonIcon: {
    backgroundColor: '#07435E',
    padding: 5,
    paddingLeft:6.5,
    paddingRight:6.5,
    borderRadius: 50,

  },
  filterOption: {
    width:100,
    borderRadius:5,
    marginVertical:4,
    borderWidth:2,
    borderColor:'#A3238F',
  },

filterOptionText: {
    fontSize: 16,
    color: '#A3238F',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  activeButton:{
    backgroundColor: '#A3238F',
    width:100,
    borderRadius:5,
    marginVertical:4,
  },
  activeButtonText:{
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',

  },
  Bottoncon:{
  alignItems:'flex-end',
  },
  clearButton: {
    backgroundColor: '#A3238F',
    borderRadius: 20,
    padding:9,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize:16,
    textAlign: 'center',
    paddingHorizontal:10,
  },

  memberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginVertical: 5,
    elevation: 2,
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
  memberRole: {
    fontSize: 14,
    color: 'gray',
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  ratingDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
 // Member Count
 memberCountContainer: {
  position: 'absolute',
  backgroundColor: 'rgba(250, 250, 250, 0.8)',
  padding: 10,
  alignItems: 'center',
  borderRadius: 20,
  borderWidth: 2,
  borderColor: '#A3238F',
  left: width * 0.6, // Relative positioning
  top: height * 0.8, // Relative positioning
},
memberCountText: {
  fontSize: width * 0.04, // Scalable font size
  fontWeight: 'bold',
  color: '#A3238F',
},
  profilePicContainer: {
    backgroundColor: '#A3238F',
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePicText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems:'center',
},
   // Members List Styles
   memberList: {
    flexGrow: 1,
    paddingHorizontal: 10,
    margin: 10,
    paddingBottom: 20,
  },
  iconWrapper: {
    width: 40, // Adjust the width as needed
    height: 40, // Adjust the height as needed
    borderRadius: 25, // This makes it round
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10, // Space between icons
    elevation: 5, // Add shadow for elevation on Android
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
});

export default HeadAdminMembersPage;











































// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   FlatList,
//   SafeAreaView,
//   Dimensions,
//   Image,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { Picker } from '@react-native-picker/picker';
// import { API_BASE_URL } from '../constants/Config';

// const { width, height } = Dimensions.get('window');

// const HeadAdminMembersPage = ({ navigation }) => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [members, setMembers] = useState([]); // All fetched members
//   const [filteredMembers, setFilteredMembers] = useState([]); // Filtered members after submit
//   const [isFilterPressed, setIsFilterPressed] = useState(false);
//   const [locationOptions, setLocationOptions] = useState([]);
//   const [selectedLocation, setSelectedLocation] = useState('');
//   const [filterSubmitted, setFilterSubmitted] = useState(false);
//   const [selectedIcons, setSelectedIcons] = useState({ sunActive: false, moonActive: false });
//   const [selectedChapterTypes, setSelectedChapterTypes] = useState([]); // Changed to array
//   const [selectedOption, setSelectedOption] = useState(''); // Tracks the selected filter option

//   // Fetch members data and location names only once
//   const fetchMembersData = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/admin/user-details-ratings`);
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       const data = await response.json();

//       // Calculate star ratings and add it to each member
//       const updatedMembers = await Promise.all(data.map(async (member) => {
//         let totalStars = 0;
//         if (member.Ratings.length > 0) {
//           member.Ratings.forEach((rating) => {
//             totalStars += parseFloat(rating.average) || 0;
//           });
//           const totalAverage = totalStars / member.Ratings.length;
//           member.totalAverage = Math.round(totalAverage) || 0;
//         } else {
//           member.totalAverage = 0;
//         }

//         // Fetch profile image
//         const imageResponse = await fetch(`${API_BASE_URL}/profile-image?userId=${member.UserId}`);
//         const imageData = await imageResponse.json();
//         member.profileImageUrl = imageData.imageUrl;

//         return member;
//       }));

//       setMembers(updatedMembers); // Store all members
//       setFilteredMembers(updatedMembers); // Initially, set filtered members to all members

//       // Extract and set unique locations
//       const locations = Array.from(new Set(data.map(member => member.LocationName)));
//       setLocationOptions(locations);
//     } catch (error) {
//       console.error('Error fetching members location data:', error);
//     }
//   };

//   useEffect(() => {
//     fetchMembersData();
//   }, []);

//   // Filter members based on search query, location, and ChapterTypes (1 and/or 2)
//   const applyFilters = () => {
//     let filtered = members; // Start with all members

//     // Filter based on RollId if selected
//     if (selectedOption === 'members') {
//       filtered = filtered.filter((member) => member.RollId === 3); // Only members
//     } else if (selectedOption === 'admin') {
//       filtered = filtered.filter((member) => member.RollId === 2); // Only admin
//     }

//     // Filter based on location if selected
//     if (selectedLocation) {
//       filtered = filtered.filter((member) => member.LocationName === selectedLocation);
//     }

//     // Filter based on ChapterType (sun/moon active)
//     if (selectedIcons.sunActive && selectedIcons.moonActive) {
//       filtered = filtered.filter((member) => member.ChapterType === 1 || member.ChapterType === 2);
//     } else if (selectedIcons.sunActive) {
//       filtered = filtered.filter((member) => member.ChapterType === 1);
//     } else if (selectedIcons.moonActive) {
//       filtered = filtered.filter((member) => member.ChapterType === 2);
//     }

//     // Filter based on ChapterType array (if any are selected)
//     if (selectedChapterTypes.length > 0) {
//       filtered = filtered.filter((member) => selectedChapterTypes.includes(member.ChapterType));
//     }

//     // Filter based on search query
//     if (searchQuery) {
//       filtered = filtered.filter((member) =>
//         member.Username.toLowerCase().includes(searchQuery.toLowerCase())
  
//       );
//     }

//     return filtered;
//   };

//   // Handle "Submit" button click to apply filter
//   const handleSubmit = () => {
//     setFilterSubmitted(true);
//     const filtered = applyFilters();
//     setFilteredMembers(filtered); // Set filtered data
//   };

//   // Handle clear filter
//   const handleClearFilter = () => {
//     setFilterSubmitted(false);
//     setSelectedLocation('');
//     setSelectedChapterTypes([]); // Clear ChapterTypes
//     setSelectedIcons({ sunActive: false, moonActive: false }); // Reset icon selection
//     setSelectedOption(''); // Reset selected option
//     setSearchQuery(''); // Clear search query
//     setFilteredMembers(members); // Reset to show all members
//   };

//   // Handle Sun Icon Click
//   const handleSunClick = () => {
//     const newSunActiveState = !selectedIcons.sunActive;
//     setSelectedIcons({ ...selectedIcons, sunActive: newSunActiveState });

//     if (newSunActiveState) {
//       setSelectedChapterTypes(prev => [...prev, 1]); // Add ChapterType 1 if Sun is active
//     } else {
//       setSelectedChapterTypes(prev => prev.filter(type => type !== 1)); // Remove ChapterType 1 if Sun is deactivated
//     }
//   };

//   // Handle Moon Icon Click
//   const handleMoonClick = () => {
//     const newMoonActiveState = !selectedIcons.moonActive;
//     setSelectedIcons({ ...selectedIcons, moonActive: newMoonActiveState });

//     if (newMoonActiveState) {
//       setSelectedChapterTypes(prev => [...prev, 2]); // Add ChapterType 2 if Moon is active
//     } else {
//       setSelectedChapterTypes(prev => prev.filter(type => type !== 2)); // Remove ChapterType 2 if Moon is deactivated
//     }
//   };

//   // Handle Button Click to select "members" or "admin"
//   const handleButtonPress = (option) => {
//     setSelectedOption(option); // Set the selected option
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Search Bar */}
//       <View style={styles.searchContainer}>
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search members"
//           placeholderTextColor="black"
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//           color="#A3238F"
//         />
//         <View style={styles.searchIconContainer}>
//           <Icon name="search" size={23} color="black" />
//         </View>
//         <TouchableOpacity
//           style={[styles.filterButton, { backgroundColor: isFilterPressed ? '#c452b3' : '#A3238F' }]}
//           onPress={() => setIsFilterPressed((prev) => !prev)}
//         >
//           <Ionicons name="filter" size={23} color="#FFFFFF" />
//         </TouchableOpacity>
//       </View>

//       {/* Filter Section */}
//       {isFilterPressed && (
//         <View style={styles.filterContainer}>
//           <View style={styles.filterSearchInputContainer}>
//             <View style={styles.filterIconContainer}>
//               {/* Sun icon - active when selectedIcons.sunActive is true */}
//               <TouchableOpacity
//                 style={[styles.iconWrapper, { backgroundColor: selectedIcons.sunActive ? '#A3238F' : 'transparent' }]}
//                 onPress={handleSunClick}
//               >
//                 <Icon
//                   name="sun-o"
//                   size={25}
//                   color={selectedIcons.sunActive ? '#FFFFFF' : '#A3238F'}
//                   style={styles.sunIcon}
//                 />
//               </TouchableOpacity>

//               {/* Moon icon - active when selectedIcons.moonActive is true */}
//               <TouchableOpacity
//                 style={[styles.iconWrapper, { backgroundColor: selectedIcons.moonActive ? '#A3238F' : 'transparent' }]}
//                 onPress={handleMoonClick}
//               >
//                 <Icon
//                   name="moon-o"
//                   size={25}
//                   color={selectedIcons.moonActive ? '#FFFFFF' : '#A3238F'}
//                   style={styles.moonIcon}
//                 />
//               </TouchableOpacity>
//             </View>

//             <View style={styles.filterSearchInput}>
//               <Picker
//                 selectedValue={selectedLocation}
//                 onValueChange={(itemValue) => setSelectedLocation(itemValue)}
//                 style={styles.picker}
//               >
//                 <Picker.Item label="Select location..." value="" />
//                 {locationOptions.map((location, index) => (
//                   <Picker.Item key={index} label={location} value={location} />
//                 ))}
//               </Picker>
//               <View style={styles.searchIconContainer}>
//                 <Icon name="search" size={23} color="black" />
//               </View>
//             </View>
//           </View>
          
//           {/* Button to toggle between "members" and "admin" */}
//           <TouchableOpacity
//             style={[styles.filterOption, selectedOption === 'members' && styles.activeButton]}
//             onPress={() => handleButtonPress('members')}
//           >
//             <Text
//               style={[
//                 styles.filterOptionText,
//                 selectedOption === 'members' && styles.activeButtonText,
//               ]}
//             >
//               Members
//             </Text>
//           </TouchableOpacity>

//           {/* Admin Button */}
//           <TouchableOpacity
//             style={[styles.filterOption, selectedOption === 'admin' && styles.activeButton]}
//             onPress={() => handleButtonPress('admin')}
//           >
//             <Text
//               style={[
//                 styles.filterOptionText,
//                 selectedOption === 'admin' && styles.activeButtonText,
//               ]}
//             >
//               Admin
//             </Text>
//           </TouchableOpacity>

//           <View style={styles.Bottoncon}>
//             <TouchableOpacity style={styles.clearButton} onPress={handleClearFilter}>
//               <Text style={styles.clearButtonText}>Clear</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
//               <Text style={styles.submitButtonText}>Submit</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       )}

//       {/* Members List */}
//       <FlatList
//         data={filteredMembers}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.memberItem}
//             onPress={() => navigation.navigate('HeadAdminMemberViewPage', { memberId: item.UserId })}
//           >
//             <View style={styles.memberDetails}>
//               <Image source={{ uri: item.profileImageUrl }} style={styles.profileImage} />
//               <View style={styles.memberText}>
//                 <Text style={styles.memberName}>{item.Username}</Text>
//                 <Text style={styles.memberRole}>{item.Profession}</Text>
//               </View>
//             </View>
//             <View style={styles.ratingContainer}>
//               {[...Array(Math.max(0, item.totalAverage))].map((_, index) => (
//                 <Icon key={index} name="star" size={16} color="#FFD700" />
//               ))}
//             </View>
//           </TouchableOpacity>
//         )}
//         contentContainerStyle={styles.memberList}
//         ListEmptyComponent={
//           filterSubmitted && filteredMembers.length === 0 ? (
//             <Text style={styles.emptyListText}>No members found in this location and ChapterType.</Text>
//           ) : null
//         }
//       />

//       {/* Member Count */}
//       {filterSubmitted && (
//         <View style={styles.memberCountContainer}>
//           <Text style={styles.memberCountText}>Count: {filteredMembers.length}</Text>
//         </View>
//       )}
//     </SafeAreaView>
//   );
// };

// // Styles omitted for brevity

// // Styles
// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#CCC',
//     flex: 1,
//   },
//   profileImage: {
//     width: 40, // Adjust size as needed
//     height: 40, // Adjust size as needed
//     borderRadius: 20, // Make it circular
//     marginRight: 10, // Space between image and text
//   },
//   memberItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 15,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 10,
//     marginVertical: 5,
//     elevation: 2,
//   },
  
//   searchContainer: {
//     flexDirection: 'row',
//     padding: 0,
//     backgroundColor: '#FFFFFF',
//     position: 'relative',
//     borderRadius: 10,
//     marginHorizontal: 20,
//     marginBottom: 10,
//     marginTop: 10,
//     alignItems: 'center',
//   },
//   searchInput: {
//     flex: 1,
//     borderRadius: 25,
//     paddingHorizontal: 50,
//     fontSize: 16,
//   },
//   searchIconContainer: {
//     position: 'absolute',
//     left: 15,
//     top: '50%',
//     transform: [{ translateY: -12 }],
//   },
//   filterButton: {
//     paddingVertical: 5,
//     paddingHorizontal: 8,
//     borderRadius: 50,
//     marginRight: 8,
//   },
//   filterContainer: {
//     backgroundColor: '#f0e1eb',
//     borderRadius: 10,
//     padding: 10,
//     marginHorizontal: 15,
//     elevation: 5,
//     marginTop: 0,
//     marginBottom: 10,
//   },
//   filterSearchInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 0,
//   },
//   filterSearchInput: {
//     backgroundColor: '#fff',
//     borderRadius: 25,
//     paddingHorizontal: 38,
 
//     fontSize: 15,
//     flex: 1,
//   },
//   filterSearchIconContainer: {
//     position: 'absolute',
//     left: 90,
//     top: '50%',
//     transform: [{ translateY: -10 }],
//   },
//   filterIconContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 15,
//   },
//   sunIcon: {
//     backgroundColor: '#FDB813',
//     padding: 5,
//     borderRadius: 50,
//   },
//   moonIcon: {
//     backgroundColor: '#07435E',
//     padding: 5,
//     paddingLeft:6.5,
//     paddingRight:6.5,
//     borderRadius: 50,

//   },
//   filterOption: {
//     width:100,
//     borderRadius:5,
//     marginVertical:4,
//     borderWidth:2,
//     borderColor:'#A3238F',
//   },

// filterOptionText: {
//     fontSize: 16,
//     color: '#A3238F',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   activeButton:{
//     backgroundColor: '#A3238F',
//     width:100,
//     borderRadius:5,
//     marginVertical:4,
//   },
//   activeButtonText:{
//     fontSize: 16,
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   Bottoncon:{
//   flexDirection:'row',
//   justifyContent:'space-between',
//   paddingTop:10,
//   },
//   submitButton: {
//     backgroundColor: '#A3238F',
//     borderRadius: 20,
//     padding:9,
//   },
//   submitButtonText: {
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   clearButton:{  
//     backgroundColor: '#b658af',
//     borderRadius: 20,
//     padding:9
//   },
//   clearButtonText: {
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   memberItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 15,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 10,
//     marginVertical: 5,
//     elevation: 2,
//   },
//   memberDetails: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   memberText: {
//     marginLeft: 10,
//   },
//   memberName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   memberRole: {
//     fontSize: 14,
//     color: 'gray',
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//   },
//   ratingDetail: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginLeft: 10,
//   },
//  // Member Count
//  memberCountContainer: {
//   position: 'absolute',
//   backgroundColor: 'rgba(250, 250, 250, 0.8)',
//   padding: 10,
//   alignItems: 'center',
//   borderRadius: 20,
//   borderWidth: 2,
//   borderColor: '#A3238F',
//   left: width * 0.6, // Relative positioning
//   top: height * 0.8, // Relative positioning
// },
// memberCountText: {
//   fontSize: width * 0.04, // Scalable font size
//   fontWeight: 'bold',
//   color: '#A3238F',
// },
//   profilePicContainer: {
//     backgroundColor: '#A3238F',
//     height: 40,
//     width: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   profilePicText: {
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     fontSize: 18,
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     alignItems:'center',
// },
//    // Members List Styles
//    memberList: {
//     flexGrow: 1,
//     paddingHorizontal: 10,
//     margin: 10,
//     paddingBottom: 20,
//   },
//   iconWrapper: {
//     width: 40, // Adjust the width as needed
//     height: 40, // Adjust the height as needed
//     borderRadius: 25, // This makes it round
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginHorizontal: 10, // Space between icons
//     elevation: 5, // Add shadow for elevation on Android
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//   },
// });

// export default HeadAdminMembersPage;









































// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   FlatList,
//   SafeAreaView,
//   Dimensions,
//   Image,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { Picker } from '@react-native-picker/picker';
// import { API_BASE_URL } from '../constants/Config';

// const { width, height } = Dimensions.get('window');

// const HeadAdminMembersPage = ({ navigation }) => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [members, setMembers] = useState([]);
//   const [isFilterPressed, setIsFilterPressed] = useState(false);
//   const [locationOptions, setLocationOptions] = useState([]);
//   const [selectedLocation, setSelectedLocation] = useState('');
//   const [filterSubmitted, setFilterSubmitted] = useState(false);
//   const [selectedIcons, setSelectedIcons] = useState({
//     sunActive: false,
//     moonActive: false,
//   });
//   const [selectedChapterTypes, setSelectedChapterTypes] = useState([]); // Changed to array

//   // Fetch members data and location names
//   const fetchMembersData = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/admin/user-details-ratings`);
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       const data = await response.json();
//       console.log("Data in the Filter---------------------------------", data);
//       // Calculate star ratings and add it to each member
//       const updatedMembers = await Promise.all(data.map(async (member) => {
//         let totalStars = 0;
//         if (member.Ratings.length > 0) {
//           member.Ratings.forEach((rating) => {
//             totalStars += parseFloat(rating.average) || 0;
//           });
//           const totalAverage = totalStars / member.Ratings.length;
//           member.totalAverage = Math.round(totalAverage) || 0;
//         } else {
//           member.totalAverage = 0;
//         }

//         // Fetch profile image
//         const imageResponse = await fetch(`${API_BASE_URL}/profile-image?userId=${member.UserId}`);
//         const imageData = await imageResponse.json();
//         member.profileImageUrl = imageData.imageUrl;

//         return member;
//       }));

//       setMembers(updatedMembers);

//       // Extract and set unique locations
//       const locations = Array.from(new Set(data.map(member => member.LocationName)));
//       setLocationOptions(locations);
//     } catch (error) {
//       console.error('Error fetching members location data:', error);
//     }
//   };

//   useEffect(() => {
//     fetchMembersData();
//   }, []);

//   // Filter members based on the search query, location, and ChapterTypes (1 and/or 2)
//   const filteredMembers = members.filter((member) => {
//     // Check if both Sun and Moon icons are active
//     if (selectedIcons.sunActive && selectedIcons.moonActive) {
//       return member.ChapterType == 1 || member.ChapterType == 2;
//     }
//     // If only Sun icon is active, filter by ChapterType 1
//     else if (selectedIcons.sunActive) {
//       return member.ChapterType == 1;
//     }
//     // If only Moon icon is active, filter by ChapterType 2
//     else if (selectedIcons.moonActive) {
//       return member.ChapterType == 2;
//     }
//     // If no icons are active, apply location and ChapterType filter when filterSubmitted is true
//     else if (filterSubmitted) {
//       return (
//         member.LocationName == selectedLocation &&
//         (selectedChapterTypes.length == 0 || selectedChapterTypes.includes(member.ChapterType))
//       );
//     }
//     // If no filter is applied, return all members
//     else {
//       return (
//         (member.Username && member.Username.toLowerCase().includes(searchQuery.toLowerCase())) ||
//         (member.LocationName && member.LocationName.toLowerCase().includes(searchQuery.toLowerCase()))
//       );
//     }
//   });

//   // Handle "Submit" button click to apply filter
//   const handleSubmit = () => {
//     setFilterSubmitted(true); // Apply the filter on submit
//   };

//   // Handle clear filter
//   const handleClearFilter = () => {
//     setFilterSubmitted(false);
//     setSelectedLocation('');
//     setSelectedChapterTypes([]); // Clear ChapterTypes
//     setSelectedIcons({ sunActive: false, moonActive: false }); // Reset icon selection
//   };

//   // Handle Sun Icon Click
//   const handleSunClick = () => {
//     const newSunActiveState = !selectedIcons.sunActive;
//     setSelectedIcons({ ...selectedIcons, sunActive: newSunActiveState });

//     if (newSunActiveState) {
//       setSelectedChapterTypes(prev => [...prev, 1]); // Add ChapterType 1 if Sun is active
//     } else {
//       setSelectedChapterTypes(prev => prev.filter(type => type !== 1)); // Remove ChapterType 1 if Sun is deactivated
//     }
//   };

//   // Handle Moon Icon Click
//   const handleMoonClick = () => {
//     const newMoonActiveState = !selectedIcons.moonActive;
//     setSelectedIcons({ ...selectedIcons, moonActive: newMoonActiveState });

//     if (newMoonActiveState) {
//       setSelectedChapterTypes(prev => [...prev, 2]); // Add ChapterType 2 if Moon is active
//     } else {
//       setSelectedChapterTypes(prev => prev.filter(type => type !== 2)); // Remove ChapterType 2 if Moon is deactivated
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Search Bar */}
//       <View style={styles.searchContainer}>
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search members"
//           placeholderTextColor="black"
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//           color="#A3238F"
//         />
//         <View style={styles.searchIconContainer}>
//           <Icon name="search" size={23} color="black" />
//         </View>
//         <TouchableOpacity
//           style={[styles.filterButton, { backgroundColor: isFilterPressed ? '#c452b3' : '#A3238F' }]}
//           onPress={() => setIsFilterPressed((prev) => !prev)}
//         >
//           <Ionicons name="filter" size={23} color="#FFFFFF" />
//         </TouchableOpacity>
//       </View>

//       {/* Filter Section */}
//       {isFilterPressed && (
//         <View style={styles.filterContainer}>
//           <View style={styles.filterSearchInputContainer}>
//             <View style={styles.filterIconContainer}>
//               {/* Sun icon - active when selectedIcons.sunActive is true */}
//               <TouchableOpacity
//                 style={[
//                   styles.iconWrapper,
//                   { backgroundColor: selectedIcons.sunActive ? '#A3238F' : 'transparent' },
//                 ]}
//                 onPress={handleSunClick}
//               >
//                 <Icon
//                   name="sun-o"
//                   size={25}
//                   color={selectedIcons.sunActive ? '#FFFFFF' : '#A3238F'}
//                   style={styles.sunIcon}
//                 />
//               </TouchableOpacity>

//               {/* Moon icon - active when selectedIcons.moonActive is true */}
//               <TouchableOpacity
//                 style={[
//                   styles.iconWrapper,
//                   { backgroundColor: selectedIcons.moonActive ? '#A3238F' : 'transparent' },
//                 ]}
//                 onPress={handleMoonClick}
//               >
//                 <Icon
//                   name="moon-o"
//                   size={25}
//                   color={selectedIcons.moonActive ? '#FFFFFF' : '#A3238F'}
//                   style={styles.moonIcon}
//                 />
//               </TouchableOpacity>
//             </View>

//             <View style={styles.filterSearchInput}>
//               <Picker
//                 selectedValue={selectedLocation}
//                 onValueChange={(itemValue) => setSelectedLocation(itemValue)}
//                 style={styles.picker}
//               >
//                 <Picker.Item label="Select location..." value="" />
//                 {locationOptions.map((location, index) => (
//                   <Picker.Item key={index} label={location} value={location} />
//                 ))}
//               </Picker>
//               <View style={styles.searchIconContainer}>
//                 <Icon name="search" size={23} color="black" />
//               </View>
//             </View>
//           </View>

//           <TouchableOpacity style={styles.filterOptionMembers}>
//             <Text style={styles.filterOptionMembersText}>Members</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.filterOptionAdmin}>
//             <Text style={styles.filterOptionAdminText}>Admin</Text>
//           </TouchableOpacity>

//           <View style={styles.Bottoncon}>
//             <TouchableOpacity style={styles.clearButton} onPress={handleClearFilter}>
//               <Text style={styles.clearButtonText}>Clear</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
//               <Text style={styles.submitButtonText}>Submit</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       )}

//       {/* Members List */}
//       <FlatList
//         data={filteredMembers}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.memberItem}
//             onPress={() => navigation.navigate('HeadAdminMemberViewPage', { memberId: item.UserId })}
//           >
//             <View style={styles.memberDetails}>
//               <Image source={{ uri: item.profileImageUrl }} style={styles.profileImage} />
//               <View style={styles.memberText}>
//                 <Text style={styles.memberName}>{item.Username}</Text>
//                 <Text style={styles.memberRole}>{item.Profession}</Text>
//               </View>
//             </View>
//             <View style={styles.ratingContainer}>
//               {[...Array(Math.max(0, item.totalAverage))].map((_, index) => (
//                 <Icon key={index} name="star" size={16} color="#FFD700" />
//               ))}
//             </View>
//           </TouchableOpacity>
//         )}
//         contentContainerStyle={styles.memberList}
//         ListEmptyComponent={
//           filterSubmitted && filteredMembers.length === 0 ? (
//             <Text style={styles.emptyListText}>No members found in this location and ChapterType.</Text>
//           ) : null
//         }
//       />

//       {/* Member Count */}
//       {filterSubmitted && (
//         <View style={styles.memberCountContainer}>
//           <Text style={styles.memberCountText}>Count: {filteredMembers.length}</Text>
//         </View>
//       )}
//     </SafeAreaView>
//   );
// };

// // Styles omitted for brevity

// // Styles
// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#CCC',
//     flex: 1,
//   },
//   profileImage: {
//     width: 40, // Adjust size as needed
//     height: 40, // Adjust size as needed
//     borderRadius: 20, // Make it circular
//     marginRight: 10, // Space between image and text
//   },
//   memberItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 15,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 10,
//     marginVertical: 5,
//     elevation: 2,
//   },
  
//   searchContainer: {
//     flexDirection: 'row',
//     padding: 0,
//     backgroundColor: '#FFFFFF',
//     position: 'relative',
//     borderRadius: 10,
//     marginHorizontal: 20,
//     marginBottom: 10,
//     marginTop: 10,
//     alignItems: 'center',
//   },
//   searchInput: {
//     flex: 1,
//     borderRadius: 25,
//     paddingHorizontal: 50,
//     fontSize: 16,
//   },
//   searchIconContainer: {
//     position: 'absolute',
//     left: 15,
//     top: '50%',
//     transform: [{ translateY: -12 }],
//   },
//   filterButton: {
//     paddingVertical: 5,
//     paddingHorizontal: 8,
//     borderRadius: 50,
//     marginRight: 8,
//   },
//   filterContainer: {
//     backgroundColor: '#f0e1eb',
//     borderRadius: 10,
//     padding: 10,
//     marginHorizontal: 15,
//     elevation: 5,
//     marginTop: 0,
//     marginBottom: 10,
//   },
//   filterSearchInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 0,
//   },
//   filterSearchInput: {
//     backgroundColor: '#fff',
//     borderRadius: 25,
//     paddingHorizontal: 38,
 
//     fontSize: 15,
//     flex: 1,
//   },
//   filterSearchIconContainer: {
//     position: 'absolute',
//     left: 90,
//     top: '50%',
//     transform: [{ translateY: -10 }],
//   },
//   filterIconContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 15,
//   },
//   sunIcon: {
//     backgroundColor: '#FDB813',
//     padding: 5,
//     borderRadius: 50,
//   },
//   moonIcon: {
//     backgroundColor: '#07435E',
//     padding: 5,
//     paddingLeft:6.5,
//     paddingRight:6.5,
//     borderRadius: 50,

//   },
//   filterOptionMembers: {
//     borderWidth:2,
//     width:100,
//     borderRadius:5,
//     marginVertical:4,
//   },
//   filterOptionAdmin: {
//    borderRadius:5,
//     marginVertical:4,
//     width:100,
//     borderWidth:2,
//   },
// filterOptionAdminText: {
//     fontSize: 16,
//     color: '#A3238F',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   filterOptionMembersText: {
//     fontSize: 16,
//     color: '#A3238F',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   Bottoncon:{
//   flexDirection:'row',
//   justifyContent:'space-between',
//   paddingTop:10,
//   },
//   submitButton: {
//     backgroundColor: '#A3238F',
//     borderRadius: 20,
//     padding:9,
//   },
//   submitButtonText: {
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   clearButton:{  
//     backgroundColor: '#b658af',
//     borderRadius: 20,
//     padding:9
//   },
//   clearButtonText: {
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   memberItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 15,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 10,
//     marginVertical: 5,
//     elevation: 2,
//   },
//   memberDetails: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   memberText: {
//     marginLeft: 10,
//   },
//   memberName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   memberRole: {
//     fontSize: 14,
//     color: 'gray',
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//   },
//   ratingDetail: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginLeft: 10,
//   },
//  // Member Count
//  memberCountContainer: {
//   position: 'absolute',
//   backgroundColor: 'rgba(250, 250, 250, 0.8)',
//   padding: 10,
//   alignItems: 'center',
//   borderRadius: 20,
//   borderWidth: 2,
//   borderColor: '#A3238F',
//   left: width * 0.6, // Relative positioning
//   top: height * 0.8, // Relative positioning
// },
// memberCountText: {
//   fontSize: width * 0.04, // Scalable font size
//   fontWeight: 'bold',
//   color: '#A3238F',
// },
//   profilePicContainer: {
//     backgroundColor: '#A3238F',
//     height: 40,
//     width: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   profilePicText: {
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     fontSize: 18,
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     alignItems:'center',
// },
//    // Members List Styles
//    memberList: {
//     flexGrow: 1,
//     paddingHorizontal: 10,
//     margin: 10,
//     paddingBottom: 20,
//   },
//   iconWrapper: {
//     width: 40, // Adjust the width as needed
//     height: 40, // Adjust the height as needed
//     borderRadius: 25, // This makes it round
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginHorizontal: 10, // Space between icons
//     elevation: 5, // Add shadow for elevation on Android
//     shadowColor: '#000', // Shadow on iOS
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//   },
// });

// export default HeadAdminMembersPage;































// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   FlatList,
//   SafeAreaView,
//   Dimensions,
//   Image,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { Picker } from '@react-native-picker/picker';
// import { API_BASE_URL } from '../constants/Config';

// const { width, height } = Dimensions.get('window');

// const HeadAdminMembersPage = ({ navigation }) => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [members, setMembers] = useState([]);
//   const [isFilterPressed, setIsFilterPressed] = useState(false);
//   const [locationOptions, setLocationOptions] = useState([]); // Store locations here
//   const [selectedLocation, setSelectedLocation] = useState(''); // Store selected location
//   const [filterSubmitted, setFilterSubmitted] = useState(false); // Track if the filter has been applied

//   // Fetch members data and location names
//   const fetchMembersData = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/admin/user-details-ratings`);
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       const data = await response.json(); // Assumed API returns an array of members

//       // Calculate star ratings and add it to each member
//       const updatedMembers = await Promise.all(data.map(async (member) => {
//         let totalStars = 0;
//         if (member.Ratings.length > 0) {
//           member.Ratings.forEach((rating) => {
//             totalStars += parseFloat(rating.average) || 0;
//           });
//           const totalAverage = totalStars / member.Ratings.length;
//           member.totalAverage = Math.round(totalAverage) || 0;
//         } else {
//           member.totalAverage = 0;
//         }

//         // Fetch profile image
//         const imageResponse = await fetch(`${API_BASE_URL}/profile-image?userId=${member.UserId}`);
//         const imageData = await imageResponse.json();
//         member.profileImageUrl = imageData.imageUrl; // Add image URL to the member

//         return member;
//       }));

//       setMembers(updatedMembers); // Set updated members state with ratings and images

//       // Extract and set unique locations
//       const locations = Array.from(new Set(data.map(member => member.LocationName))); // Get unique locations
//       setLocationOptions(locations); // Set locations in the state
//     } catch (error) {
//       console.error('Error fetching members location data:', error);
//     }
//    };
   
//   // Fetch members when the component is mounted
//   useEffect(() => {
//     fetchMembersData();
//   }, []);

//   // Filter members based on the search query and location selection
//   const filteredMembers = filterSubmitted ? 
//     members.filter((member) => {
//       return (
//         member.LocationName === selectedLocation // Filter by location after submit
//       );
//     }) :
//     members.filter((member) => {
//       return (
//         (member.Username && member.Username.toLowerCase().includes(searchQuery.toLowerCase())) ||
//         (member.LocationName && member.LocationName.toLowerCase().includes(searchQuery.toLowerCase()))
//       );
//     });

//   const handleFocus = () => {
//     navigation.setOptions({ tabBarStyle: { display: 'none' } });
//   };

//   const handleBlur = () => {
//     navigation.setOptions({ tabBarStyle: { display: 'flex' } });
//   };

//   // Add listener to handle tab bar visibility
//   useEffect(() => {
//     const unsubscribe = navigation.addListener('focus', () => {
//       navigation.setOptions({ tabBarStyle: { display: 'flex' } });
//     });

//     return () => {
//       unsubscribe();
//     };
//   }, [navigation]);

//   // Render a single member item
//   const renderMember = ({ item }) => (
//     <TouchableOpacity
//       style={styles.memberItem}
//       onPress={() => navigation.navigate('HeadAdminMemberViewPage', { memberId: item.UserId })}
//     >
//       <View style={styles.memberDetails}>
//         {/* Render Profile Picture */}
//         <Image source={{ uri: item.profileImageUrl }} style={styles.profileImage} />
//         <View style={styles.memberText}>
//           <Text style={styles.memberName}>{item.Username}</Text>
//           <Text style={styles.memberRole}>{item.Profession}</Text>
//         </View>
//       </View>
//       <View style={styles.ratingContainer}>
//         {/* Render stars based on totalAverage */}
//         {[...Array(Math.max(0, item.totalAverage))].map((_, index) => (
//           <Icon key={index} name="star" size={16} color="#FFD700" />
//         ))}
//       </View>
//     </TouchableOpacity>
//   );

//   // Handle "Submit" button click to apply filter
//   const handleSubmit = () => {
//     setFilterSubmitted(true); // Apply the filter on submit
//   };

//   // Handle clear filter
//   const handleClearFilter = () => {
//     setFilterSubmitted(false);
//     setSelectedLocation('');
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Search Bar */}
//       <View style={styles.searchContainer}>
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search members"
//           placeholderTextColor="black"
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//           onFocus={handleFocus}
//           onBlur={handleBlur}
//           color="#A3238F"
//         />
//         <View style={styles.searchIconContainer}>
//           <Icon name="search" size={23} color="black" />
//         </View>
//         <TouchableOpacity
//           style={[styles.filterButton, { backgroundColor: isFilterPressed ? '#c452b3' : '#A3238F' }]}
//           onPress={() => {
//             setIsFilterPressed((prev) => !prev);
//           }}
//         >
//           <Ionicons name="filter" size={23} color="#FFFFFF" />
//         </TouchableOpacity>
//       </View>

//       {/* Filter Section */}
//       {isFilterPressed && (
//         <View style={styles.filterContainer}>
//           <View style={styles.filterSearchInputContainer}>
//             <View style={styles.filterIconContainer}>
//               <TouchableOpacity>
//                 <Icon name="sun-o" size={25} color="#FFFFFF" style={styles.sunIcon} />
//               </TouchableOpacity>
//               <TouchableOpacity>
//                 <Icon name="moon-o" size={25} color="#FFFFFF" style={styles.moonIcon} />
//               </TouchableOpacity>
//             </View>
//             <View style={styles.filterSearchInput}>
//               {/* Picker for Location Selection */}
//               <Picker
//                 selectedValue={selectedLocation}
//                 onValueChange={(itemValue) => setSelectedLocation(itemValue)}
//                 style={styles.picker}
//               >
//                 <Picker.Item label="Select location..." value="" />
//                 {locationOptions.map((location, index) => (
//                   <Picker.Item key={index} label={location} value={location} />
//                 ))}
//               </Picker>
//               <View style={styles.searchIconContainer}>
//                 <Icon name="search" size={23} color="black" />
//               </View>
//             </View>
//           </View>
//           <TouchableOpacity style={styles.filterOption}>
//             <Text style={styles.filterOptionText}>Members</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.filterOption}>
//             <Text style={styles.filterOptionText}>Admin</Text>
//           </TouchableOpacity>
//           <View style={styles.Bottoncon}>
//                  {/* Clear filter button */}
//                  <TouchableOpacity style={styles.clearButton} onPress={handleClearFilter}>
//             <Text style={styles.clearButtonText}>   Clear   </Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
//             <Text style={styles.submitButtonText}>Submit</Text>
//           </TouchableOpacity>
   
//          </View>
//         </View>
//       )}

//       {/* Members List */}
//       <FlatList
//         data={filteredMembers}
//         renderItem={renderMember}
//         contentContainerStyle={styles.memberList}
//         ListEmptyComponent={
//           filterSubmitted && filteredMembers.length === 0 ? (
//             <Text style={styles.emptyListText}>No members found in this location.</Text>
//           ) : null
//         }
//       />

//       {/* Member Count */}
//       {filterSubmitted && (
//         <View style={styles.memberCountContainer}>
//           <Text style={styles.memberCountText}>
//             Count: {filteredMembers.length}
//           </Text>
//         </View>
//       )}
//     </SafeAreaView>
//   );
// };


// // Styles
// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#CCC',
//     flex: 1,
//   },
//   profileImage: {
//     width: 40, // Adjust size as needed
//     height: 40, // Adjust size as needed
//     borderRadius: 20, // Make it circular
//     marginRight: 10, // Space between image and text
//   },
//   memberItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 15,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 10,
//     marginVertical: 5,
//     elevation: 2,
//   },
  
//   searchContainer: {
//     flexDirection: 'row',
//     padding: 0,
//     backgroundColor: '#FFFFFF',
//     position: 'relative',
//     borderRadius: 10,
//     marginHorizontal: 20,
//     marginBottom: 10,
//     marginTop: 10,
//     alignItems: 'center',
//   },
//   searchInput: {
//     flex: 1,
//     borderRadius: 25,
//     paddingHorizontal: 50,
//     fontSize: 16,
//   },
//   searchIconContainer: {
//     position: 'absolute',
//     left: 15,
//     top: '50%',
//     transform: [{ translateY: -12 }],
//   },
//   filterButton: {
//     paddingVertical: 5,
//     paddingHorizontal: 8,
//     borderRadius: 50,
//     marginRight: 8,
//   },
//   filterContainer: {
//     backgroundColor: '#f0e1eb',
//     borderRadius: 10,
//     padding: 10,
//     marginHorizontal: 15,
//     elevation: 5,
//     marginTop: 0,
//     marginBottom: 10,
//   },
//   filterSearchInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 0,
//   },
//   filterSearchInput: {
//     backgroundColor: '#fff',
//     borderRadius: 25,
//     paddingHorizontal: 38,
 
//     fontSize: 15,
//     flex: 1,
//   },
//   filterSearchIconContainer: {
//     position: 'absolute',
//     left: 90,
//     top: '50%',
//     transform: [{ translateY: -10 }],
//   },
//   filterIconContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 15,
//   },
//   sunIcon: {
//     backgroundColor: '#FDB813',
//     padding: 5,
//     borderRadius: 50,
//   },
//   moonIcon: {
//     backgroundColor: '#07435E',
//     padding: 5,
//     borderRadius: 50,
//     marginLeft:10,
//   },
//   filterOption: {
//     paddingVertical: 3,
//   },
//   filterOptionText: {
//     fontSize: 16,
//     color: '#A3238F',
//     fontWeight: 'bold',
//   },
//   Bottoncon:{
//   flexDirection:'row',
//   justifyContent:'space-between',
//   paddingTop:10,
//   },
//   submitButton: {
//     backgroundColor: '#A3238F',
//     borderRadius: 20,
//     padding:9,
//   },
//   submitButtonText: {
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   clearButton:{  
//     backgroundColor: '#b658af',
//     borderRadius: 20,
//     padding:9
//   },
//   clearButtonText: {
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   memberItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 15,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 10,
//     marginVertical: 5,
//     elevation: 2,
//   },
//   memberDetails: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   memberText: {
//     marginLeft: 10,
//   },
//   memberName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   memberRole: {
//     fontSize: 14,
//     color: 'gray',
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//   },
//   ratingDetail: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginLeft: 10,
//   },
//  // Member Count
//  memberCountContainer: {
//   position: 'absolute',
//   backgroundColor: 'rgba(250, 250, 250, 0.8)',
//   padding: 10,
//   alignItems: 'center',
//   borderRadius: 20,
//   borderWidth: 2,
//   borderColor: '#A3238F',
//   left: width * 0.6, // Relative positioning
//   top: height * 0.8, // Relative positioning
// },
// memberCountText: {
//   fontSize: width * 0.04, // Scalable font size
//   fontWeight: 'bold',
//   color: '#A3238F',
// },
//   profilePicContainer: {
//     backgroundColor: '#A3238F',
//     height: 40,
//     width: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   profilePicText: {
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     fontSize: 18,
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     alignItems:'center',
// },
//    // Members List Styles
//    memberList: {
//     flexGrow: 1,
//     paddingHorizontal: 10,
//     margin: 10,
//     paddingBottom: 20,
//   },
// });

// export default HeadAdminMembersPage;

























