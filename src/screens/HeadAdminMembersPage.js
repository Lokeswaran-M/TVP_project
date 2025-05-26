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
import { Dropdown } from 'react-native-element-dropdown';

const HeadAdminMembersPage = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [isFilterPressed, setIsFilterPressed] = useState(false);
  const [locationOptions, setLocationOptions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedIcons, setSelectedIcons] = useState({ sunActive: false, moonActive: false });
  const [selectedOption, setSelectedOption] = useState(''); 
  const [refreshing, setRefreshing] = useState(false);
  const fetchMembersData = async () => {
    setRefreshing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/user-details-ratings`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
     console.log('----------------------------All data Headadmin MemberPage ',data);
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
        const imageResponse = await fetch(`${API_BASE_URL}/profile-image?userId=${member.UserId}`);
        const imageData = await imageResponse.json();
        const uniqueImageUrl = `${imageData.imageUrl}?t=${new Date().getTime()}`;
        member.profileImageUrl = uniqueImageUrl;

        return member;
      }));

      setMembers(updatedMembers);
      setFilteredMembers(updatedMembers);
      const locations = Array.from(new Set(data.map(member => member.LocationName)));
      setLocationOptions(locations);
    } catch (error) {
      console.error('Error fetching members location data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMembersData();
  }, [ ]);

  const applyFilters = () => {
    let filtered = members;
    if (selectedOption === 'members') {
      filtered = filtered.filter((member) => member.RollId === 3);
    } else if (selectedOption === 'admin') {
      filtered = filtered.filter((member) => member.RollId === 2);
    }
    if (selectedLocation) {
      filtered = filtered.filter((member) => member.LocationName === selectedLocation);
    }
    if (searchQuery) {
      filtered = filtered.filter((member) =>
        member.Username && member.Username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };
  useEffect(() => {
    const filtered = applyFilters();
    setFilteredMembers(filtered);
  }, [searchQuery, selectedLocation, selectedIcons, selectedOption, members]);
  const handleClearFilter = () => {
    setSelectedLocation('');
    setSelectedIcons({ sunActive: false, moonActive: false });
    setSelectedOption('');
    setSearchQuery('');
    setFilteredMembers(members);
  };
  const handleButtonPress = (option) => {
    setSelectedOption(option);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.searchContainer, isFilterPressed ? styles.searchContainerActive : null]}>
        <TextInput
          style={[styles.searchInput, isFilterPressed ? styles.searchInputActive : null]}
          placeholder="Search members"
          placeholderTextColor="black"
          value={searchQuery}
          onChangeText={setSearchQuery}
          color="#2e3192"
        />
        <View style={styles.searchIconContainer}>
          <Icon name="search" size={23} color="#100E09" />
        </View>
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: isFilterPressed ? '#e4e5fd' : '#2e3192' }]}
          onPress={() => setIsFilterPressed((prev) => !prev)}
        >
          <Ionicons name="filter" size={23} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {isFilterPressed && (
        <View style={styles.filterContainer}>
          <View style={styles.filterSearchInputContainer}>

            <View style={styles.filterSearchInput}>
<Dropdown
  style={styles.dropdown}
  data={locationOptions.map(location => ({ 
    label: location, 
    value: location 
  }))}
  labelField="label"
  valueField="value"
  placeholder="Select location..."
  value={selectedLocation}
  onChange={(item) => {
    setSelectedLocation(item.value);
  }}
  renderItem={(item, index) => (
    <View style={[
      styles.dropdownItem,
      { backgroundColor: index % 2 === 0 ? '#f5f7ff' : '#ffffff' }
    ]}>
      <Text style={styles.dropdownItemText}>{item.label}</Text>
    </View>
  )}
/>
              <View style={styles.searchIconContainer}>
                <Icon name="search" size={23} color="#100E09" />
              </View>
            </View>
          </View>
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
      <FlatList 
  
        data={filteredMembers.sort((a, b) => b.LocationID - a.LocationID)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.memberItem}
            onPress={() => navigation.navigate('MemberDetails', { userId: item.UserId, Profession: item.Profession })}
          >
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

        <View style={styles.textColumn}>
          <Text style={styles.memberName}>{item.Username}</Text>
          <Text style={styles.memberRole} numberOfLines={1}>
            {item.Profession}
          </Text>
        </View>
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
            onRefresh={fetchMembersData}
          />
        }
      />
      {filteredMembers.length > 0 && (
        <View style={styles.memberCountContainer}>
          <Text style={styles.memberCountText}>Count: {filteredMembers.length}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default HeadAdminMembersPage;