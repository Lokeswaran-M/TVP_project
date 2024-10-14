import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';

const { width, height } = Dimensions.get('window'); // Get screen dimensions

const HeadAdminLocation = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [Location, setLocation] = useState([
    { id: '1', Location: 'T Nagar', Place: 'Taj Hotel' },
    { id: '2', Location: 'Chrompet', Place: 'Loki Hotel' },
    { id: '3', Location: 'Tambaram', Place: 'Ajay Hotel' },
    { id: '4', Location: 'Pallavaram', Place: 'PPPPPP' },
    { id: '5', Location: 'T Nagar', Place: 'TNTNTNTTN' },
    { id: '6', Location: 'Chrompet', Place: 'TNTNTNTTN' },
    { id: '7', Location: 'Tambaram', Place: 'TNTNTNTTN' },
    { id: '8', Location: 'Pallavaram', Place: 'TNTNTNTTN' },
  ]);
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredLocation = Location.filter(Location =>
    Location.Location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewPress = (Location, Place) => {
    navigation.navigate('HeadAdminLocationView', { Location, Place });
  };
  const handleEditPress = (Location, Place) => {
    navigation.navigate('HeadAdminLocationEdit', { Location, Place });
  };
  const handleNavPress2 = () => {
    navigation.navigate('HeadAdminLocationCreate');
  };

  const handleMorePress = item => {
    setSelectedItem(selectedItem === item.id ? null : item.id);
  };

  const handleDeletePress = () => {
    setLocation(prev => prev.filter(loc => loc.id !== selectedItem));
    setSelectedItem(null);
  };

  const renderLocation = ({ item }) => (
    <View style={styles.locationCon}>
      <View style={styles.locationDetails}>
        <View style={styles.locationIcon}>
          <Ionicons name="location-outline" size={30} color="#A3238F" />
        </View>
        <View style={styles.memberText}>
          <Text style={styles.locationName}>{item.Location}</Text>
        </View>
      </View>
      <View style={styles.locationIconLeft}>
        <TouchableOpacity
          style={styles.locationIconLeftEye}
          onPress={() => handleViewPress(item)}>
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
        {selectedItem === item.id && (
          <View style={styles.moreOptions}>
            <TouchableOpacity onPress={() => handleEditPress(item)}>
              <Text style={styles.optionText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDeletePress}>
              <Text style={styles.optionText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  const handleFocus = () => {
    navigation.setOptions({ tabBarStyle: { display: 'none' } });
  };

  const handleBlur = () => {
    navigation.setOptions({ tabBarStyle: { display: 'flex' } });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      navigation.setOptions({ tabBarStyle: { display: 'flex' } });
    });

    return () => {
      unsubscribe();
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Top Navigation Bar */}
      <View style={styles.topNav}>
        <TouchableOpacity style={styles.buttonNavtop}>
          <View style={styles.topNavlogo}>
            <Ionicons name="location-outline" size={28} color="#FFFFFF" />
          </View>
          <Text style={styles.NavbuttonText}>LOCATION</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search locations"
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

      {/* Create New Location Button */}
      <View style={styles.locationCreateCon}>
        <TouchableOpacity onPress={handleNavPress2}>
          <Octicons name="plus-circle" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.locationCreateConName}>Create New Location</Text>
      </View>

      {/* Location List */}
      <FlatList
        data={filteredLocation}
        renderItem={renderLocation}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.LocationList}
      />

      {/* Location Count */}
      <View style={styles.memberCountContainer}>
        <Text style={styles.memberCountText}>Count: {filteredLocation.length}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#CCC',
    flex: 1,
  },
  topNav: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomEndRadius: 15,
    borderBottomStartRadius: 15,
  },
  buttonNavtop: {
    borderRadius: 25,
    alignItems: 'center',
    borderColor: '#A3238F',
    borderWidth: 2,
    flexDirection: 'row',
  },
  topNavlogo: {
    backgroundColor: '#A3238F',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 50,
  },
  NavbuttonText: {
    color: '#A3238F',
    fontSize: 15,
    fontWeight: 'bold',
    margin: 7,
    paddingHorizontal: 10,
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
    marginHorizontal:10,
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
});

export default HeadAdminLocation;

