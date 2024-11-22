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
import styles from '../components/layout/MembersStyle';
import Stars from '../screens/Stars';
import { API_BASE_URL } from '../constants/Config';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';


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
     console.log('----------------------------All data Headadmin MemberPage ',data);
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
          <Icon name="search" size={23} color="#100E09" />
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
                <Icon name="search" size={23} color="#100E09" />
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
  
        data={filteredMembers.sort((a, b) => b.LocationID - a.LocationID)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.memberItem}
            onPress={() => navigation.navigate('MemberDetails', { userId: item.UserId, Profession: item.Profession })}
          >
           {/* Image and Icon Column */}
        <View style={styles.imageColumn}>
          {item.RollId === 2 && (
            <View style={styles.crownContainer}>
              <FontAwesome6 name="crown" size={18} color="#FFD700" />
            </View>
          )}
          <Image
            source={{ uri: item.profileImageUrl  }}
            style={[
              styles.profileImage,
              item.RollId === 2 && styles.profileImageWithBorder,
            ]}
          />
        </View>
  
        {/* Text Column */}
        <View style={styles.textColumn}>
          <Text style={styles.memberName}>{item.Username}</Text>
          <Text style={styles.memberRole} numberOfLines={1}>
            {item.Profession}
          </Text>
        </View>
  
        {/* Rating Column */}
        <View style={styles.ratingColumn}>
          <Stars averageRating={item.totalAverage} />
        </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.memberList}
        ListEmptyComponent={
          filteredMembers.length === 0 ? (
            <Text style={styles.emptyListText}>No members found.</Text>
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

export default HeadAdminMembersPage;


