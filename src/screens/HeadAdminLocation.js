import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import { API_BASE_URL } from '../constants/Config';

const { width } = Dimensions.get('window');

const HeadAdminLocation = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch location data from the API
  const fetchLocations = async () => {
    setRefreshing(true); // Start refreshing
    try {
      const response = await fetch(`${API_BASE_URL}/Locations`);
      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }
      const data = await response.json();
      setLocations(data); // Set the fetched data
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setRefreshing(false); // Stop refreshing
      setLoading(false); // Stop loading indicator
    }
  };

  useEffect(() => {
    fetchLocations(); // Fetch locations when the component mounts
  }, []);

  const filteredLocations = locations.filter(location =>
    location.LocationName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewPress = (location, place, IsActive) => {
    navigation.navigate('HeadAdminLocationView', { location, place, IsActive });
  };

  const handleEditPress = (item) => {
    navigation.navigate('HeadAdminLocationEdit', {
      LocationID: item.LocationID,
      Place: item.Place,
      LocationName: item.LocationName,
    });
  };

  const handleNavPress2 = () => {
    navigation.navigate('HeadAdminLocationCreate');
  };

  const handleMorePress = item => {
    setSelectedItem(selectedItem === item.LocationID ? null : item.LocationID);
  };

  const handleUpdatePress = async (item) => {
    try {
      const response = await fetch(`${API_BASE_URL}/locations/${item.LocationID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          LocationName: item.LocationName,
          Place: item.Place,
          IsActive: 0,
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Location deleted successfully!');
        fetchLocations(); // Refresh the list
      } else {
        Alert.alert('Error', 'Failed to update location.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const handleOutsidePress = () => {
    setSelectedItem(null);
    
  };

  // Render function for FlatList
  const renderLocationItem = ({ item }) => (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
    <View style={styles.locationCon}>
      <View style={styles.locationDetails}>
        <View style={styles.locationIcon}>
          <Ionicons name="location-outline" size={30} color="#A3238F" />
        </View>
        <View style={styles.memberText}>
          <Text style={styles.locationName}>{item.LocationName}</Text>
        </View>
      </View>
      <View style={styles.locationIconLeft}>
        <TouchableOpacity
          style={styles.locationIconLeftEye}
          onPress={() => handleViewPress(item)}
        >
          <Ionicons name="eye-outline" size={28} color="#A3238F" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleViewPress(item)}>
          <Text style={styles.locationIconLeftText}>View</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.locationIconLeft}>
        <TouchableOpacity onPress={() => handleMorePress(item)}>
          <MaterialIcons name="more-vert" size={38} color="#A3238F" />
        </TouchableOpacity>
        {selectedItem === item.LocationID && (
          <View style={styles.moreOptions}>
            <TouchableOpacity onPress={() => handleEditPress(item)}>
              <Text style={styles.optionText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleUpdatePress(item)}>
              <Text style={styles.optionText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
    </TouchableWithoutFeedback>
  );

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search locations"
          placeholderTextColor="black"
          value={searchQuery}
          onChangeText={setSearchQuery}
          color="#A3238F"
        />
        <View style={styles.searchIconContainer}>
          <Icon name="search" size={23} color="#A3238F" />
        </View>
      </View>

      <TouchableOpacity style={styles.locationCreateCon} onPress={handleNavPress2}>
        <Octicons name="plus-circle" size={28} color="#FFFFFF" />
        <Text style={styles.locationCreateConName}>Create New Location</Text>
      </TouchableOpacity>

      {filteredLocations.length === 0 && !loading && (
        <View style={styles.noLocationContainer}>
          <Text style={styles.noLocationText}>No locations found.</Text>
        </View>
      )}

     
        <FlatList
          data={filteredLocations.sort((a, b) => b.LocationID - a.LocationID)}
          renderItem={renderLocationItem}
          keyExtractor={(item) => item.LocationID.toString()}
          contentContainerStyle={styles.LocationList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={fetchLocations}
              tintColor="#A3238F"
            />
          }
        />
    
    </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#CCC',
    flex: 1,
  },
 
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginHorizontal: width * 0.1,
    marginVertical: 20,
    position: 'relative',
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 50,
    fontSize: 16,
    borderRadius: 25,

  },
  searchIconContainer: {
    position: 'absolute',
    left: 21,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  locationCreateCon: {
    backgroundColor: '#A3238F',
    height: 65,
    padding: 18,
    borderRadius: 10,
    marginVertical: 10,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    
  },
  locationCreateConName: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#FFFFFF',
    paddingLeft: 20,
  },
  locationCon: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal:15,
  },
  locationDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationIcon: {
    padding: 4,
  },
  memberText: {
    flex: 1,
  },
  locationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#A3238F',
  },
  locationIconLeft: {
    margin: 6,
  },
  locationIconLeftEye: {
    transform: [{ translateY: 3 }],
  },
  locationIconLeftText: {
    fontSize: 13,
    color: '#A3238F',
    fontWeight: '600',
  },
  LocationList: {
    flexGrow: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
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
    zIndex: 1,
  },
  memberCountText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#A3238F',
  },
  moreOptions: {
    position: 'absolute',
    transform: [{ translateX: -70 }],
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  optionText: {
    padding: 3,
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 15,
    backgroundColor: '#A3238F',
    width: 70,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 8,
  },
  noLocationContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 20,
},
noLocationText: {
  fontSize: 18,
  fontWeight: 'bold',
},
retryButton: {
  marginTop: 20,
  padding: 10,
  // backgroundColor: '#A3238F',
  borderRadius: 5,
  alignItems: 'center',
},
retryButtonText: {
  color: '#FFFFFF',
  fontSize: 16,
  fontWeight: 'bold',
},


});

export default HeadAdminLocation;

































// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   Dimensions,
//   ActivityIndicator,
//   Alert,
//   FlatList,
//   RefreshControl,
//   TouchableWithoutFeedback,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import Octicons from 'react-native-vector-icons/Octicons';
// import { API_BASE_URL } from '../constants/Config';

// const { width } = Dimensions.get('window');

// const HeadAdminLocation = ({ navigation }) => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [locations, setLocations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [refreshing, setRefreshing] = useState(false);

//   // Fetch location data from the API
//   const fetchLocations = async () => {
//     setRefreshing(true); // Start refreshing
//     try {
//       const response = await fetch(`${API_BASE_URL}/Locations`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch locations');
//       }
//       const data = await response.json();
//       setLocations(data); // Set the fetched data
//       setError(null);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setRefreshing(false); // Stop refreshing
//       setLoading(false); // Stop loading indicator
//     }
//   };

//   useEffect(() => {
//     fetchLocations(); // Fetch locations when the component mounts
//   }, []);

//   const filteredLocations = locations.filter(location =>
//     location.LocationName.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const handleViewPress = (location, place, IsActive) => {
//     navigation.navigate('HeadAdminLocationView', { location, place, IsActive });
//   };

//   const handleEditPress = (item) => {
//     navigation.navigate('HeadAdminLocationEdit', {
//       LocationID: item.LocationID,
//       Place: item.Place,
//       LocationName: item.LocationName,
//     });
//   };

//   const handleNavPress2 = () => {
//     navigation.navigate('HeadAdminLocationCreate');
//   };

//   const handleMorePress = item => {
//     setSelectedItem(selectedItem === item.LocationID ? null : item.LocationID);
//   };

//   const handleUpdatePress = async (item) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/locations/${item.LocationID}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           LocationName: item.LocationName,
//           Place: item.Place,
//           IsActive: 0,
//         }),
//       });

//       if (response.ok) {
//         Alert.alert('Success', 'Location deleted successfully!');
//         fetchLocations(); // Refresh the list
//       } else {
//         Alert.alert('Error', 'Failed to update location.');
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Something went wrong. Please try again.');
//     }
//   };

//   const handleOutsidePress = () => {
//     setSelectedItem(null);
//   };

//   // Render function for FlatList
//   const renderLocationItem = ({ item }) => (
//     <View style={styles.locationCon}>
//       <View style={styles.locationDetails}>
//         <View style={styles.locationIcon}>
//           <Ionicons name="location-outline" size={30} color="#A3238F" />
//         </View>
//         <View style={styles.memberText}>
//           <Text style={styles.locationName}>{item.LocationName}</Text>
//         </View>
//       </View>
//       <View style={styles.locationIconLeft}>
//         <TouchableOpacity
//           style={styles.locationIconLeftEye}
//           onPress={() => handleViewPress(item)}
//         >
//           <Ionicons name="eye-outline" size={28} color="#A3238F" />
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => handleViewPress(item)}>
//           <Text style={styles.locationIconLeftText}>View</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.locationIconLeft}>
//         <TouchableOpacity onPress={() => handleMorePress(item)}>
//           <MaterialIcons name="more-vert" size={38} color="#A3238F" />
//         </TouchableOpacity>
//         {selectedItem === item.LocationID && (
//           <View style={styles.moreOptions}>
//             <TouchableOpacity onPress={() => handleEditPress(item)}>
//               <Text style={styles.optionText}>Edit</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => handleUpdatePress(item)}>
//               <Text style={styles.optionText}>Delete</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.searchContainer}>
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search locations"
//           placeholderTextColor="black"
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//           color="#A3238F"
//         />
//         <View style={styles.searchIconContainer}>
//           <Icon name="search" size={23} color="#A3238F" />
//         </View>
//       </View>

//       <TouchableOpacity style={styles.locationCreateCon} onPress={handleNavPress2}>
//         <Octicons name="plus-circle" size={28} color="#FFFFFF" />
//         <Text style={styles.locationCreateConName}>Create New Location</Text>
//       </TouchableOpacity>

//       {filteredLocations.length === 0 && !loading && (
//         <View style={styles.noLocationContainer}>
//           <Text style={styles.noLocationText}>No locations found.</Text>
//         </View>
//       )}

//       <TouchableWithoutFeedback onPress={handleOutsidePress}>
//         <FlatList
//           data={filteredLocations.sort((a, b) => b.LocationID - a.LocationID)}
//           renderItem={renderLocationItem}
//           keyExtractor={(item) => item.LocationID.toString()}
//           contentContainerStyle={styles.LocationList}
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={fetchLocations}
//               tintColor="#A3238F"
//             />
//           }
//         />
//       </TouchableWithoutFeedback>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#CCC',
//     flex: 1,
//   },
 
//   searchContainer: {
//     flexDirection: 'row',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 10,
//     marginHorizontal: width * 0.1,
//     marginVertical: 20,
//     position: 'relative',
//   },
//   searchInput: {
//     flex: 1,
//     paddingHorizontal: 50,
//     fontSize: 16,
//     borderRadius: 25,

//   },
//   searchIconContainer: {
//     position: 'absolute',
//     left: 21,
//     top: '50%',
//     transform: [{ translateY: -12 }],
//   },
//   locationCreateCon: {
//     backgroundColor: '#A3238F',
//     height: 65,
//     padding: 18,
//     borderRadius: 10,
//     marginVertical: 10,
//     elevation: 2,
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginHorizontal: 20,
    
//   },
//   locationCreateConName: {
//     fontSize: 19,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     paddingLeft: 20,
//   },
//   locationCon: {
//     backgroundColor: '#FFFFFF',
//     padding: 10,
//     borderRadius: 10,
//     marginBottom: 8,
//     elevation: 2,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginHorizontal:15,
//   },
//   locationDetails: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   locationIcon: {
//     padding: 4,
//   },
//   memberText: {
//     flex: 1,
//   },
//   locationName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#A3238F',
//   },
//   locationIconLeft: {
//     margin: 6,
//   },
//   locationIconLeftEye: {
//     transform: [{ translateY: 3 }],
//   },
//   locationIconLeftText: {
//     fontSize: 13,
//     color: '#A3238F',
//     fontWeight: '600',
//   },
//   LocationList: {
//     flexGrow: 1,
//     paddingHorizontal: 10,
//     marginBottom: 20,
//   },
//   memberCountContainer: {
//     position: 'absolute',
//     bottom: 40,
//     left: width * 0.75,
//     backgroundColor: 'rgba(250, 250, 250, 0.8)',
//     padding: 10,
//     borderRadius: 20,
//     borderColor: '#A3238F',
//     borderWidth: 2,
//     zIndex: 1,
//   },
//   memberCountText: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#A3238F',
//   },
//   moreOptions: {
//     position: 'absolute',
//     transform: [{ translateX: -70 }],
//     backgroundColor: '#FFFFFF',
//     borderRadius: 8,
//   },
//   optionText: {
//     padding: 3,
//     color: '#FFFFFF',
//     textAlign: 'center',
//     fontSize: 15,
//     backgroundColor: '#A3238F',
//     width: 70,
//     borderWidth: 1,
//     borderColor: '#FFFFFF',
//     borderRadius: 8,
//   },
//   noLocationContainer: {
//   flex: 1,
//   justifyContent: 'center',
//   alignItems: 'center',
//   marginTop: 20,
// },
// noLocationText: {
//   fontSize: 18,
//   fontWeight: 'bold',
// },
// retryButton: {
//   marginTop: 20,
//   padding: 10,
//   // backgroundColor: '#A3238F',
//   borderRadius: 5,
//   alignItems: 'center',
// },
// retryButtonText: {
//   color: '#FFFFFF',
//   fontSize: 16,
//   fontWeight: 'bold',
// },


// });

// export default HeadAdminLocation;

