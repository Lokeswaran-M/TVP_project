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
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { API_BASE_URL } from '../constants/Config';
const { width, height } = Dimensions.get('window');

const HeadAdminMembersPage = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [isFilterPressed, setIsFilterPressed] = useState(false);

  // Fetch members data from API using fetch
  const fetchMembersData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/user-details-ratings`); // Replace with your full API URL if necessary
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log("Data in HeadAdminMembersPage-----------------------",data);
      setMembers(data); // Set the members state with the fetched data
    } catch (error) {
      console.error('Error fetching members data:', error);
    }
  };

  useEffect(() => {
    fetchMembersData(); // Call the function to fetch members data
  }, []);

  const filteredMembers = members.filter((member) =>
    member.Username.toLowerCase().includes(searchQuery.toLowerCase())
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

  const renderMember = ({ item }) => (
    <TouchableOpacity
      style={styles.memberItem}
      onPress={() => navigation.navigate('HeadAdminMemberViewPage', { memberId: item.UserId })} // Pass user ID to MemberViewPage
    >
      <View style={styles.memberDetails}>
        <ProfilePic name={item.Username} />
        <View style={styles.memberText}>
          <Text style={styles.memberName}>{item.Username}</Text>
          <Text style={styles.memberRole}>{item.Profession}</Text>
        </View>
      </View>
      <View style={styles.ratingContainer}>
        {/* Render stars based on totalAverage */}
        {[...Array(Math.max(0, item.totalAverage))].map((_, index) => (
        <Icon key={index} name="star" size={16} color="#FFD700" />
    ))}
      </View>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Top Nav */}
      <View style={styles.topNav}>
        <TouchableOpacity style={styles.buttonNavtop}>
          <View style={styles.topNavlogo}>
            <MaterialIcons name="group" size={28} color="#FFFFFF" />
          </View>
          <Text style={styles.NavbuttonText}>MEMBERS</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
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
          <Icon name="search" size={23} color="black" />
        </View>
        <TouchableOpacity
          style={[
            styles.filterButton,
            { backgroundColor: isFilterPressed ? '#c452b3' : '#A3238F' },
          ]}
          onPress={() => {
            setShowFilter((prev) => !prev);
            setIsFilterPressed((prev) => !prev);
          }}
        >
          <Ionicons name="filter" size={23} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Filter Section */}
      {showFilter && (
        <View style={styles.filterContainer}>
          <View style={styles.filterSearchInputContainer}>
            <View style={styles.filterIconContainer}>
              <TouchableOpacity>
                <Icon
                  name="sun-o"
                  size={25}
                  color="#FFFFFF"
                  style={styles.sunIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Icon
                  name="moon-o"
                  size={25}
                  color="#FFFFFF"
                  style={styles.moonIcon}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.filterSearchInput}>
              <TextInput
                placeholder="Search in filters..."
                placeholderTextColor="black"
                color="#A3238F"
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <View style={styles.searchIconContainer}>
                <Icon name="search" size={23} color="black" />
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.filterOption}>
            <Text style={styles.filterOptionText}>Members</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterOption}>
            <Text style={styles.filterOptionText}>Admin</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Members List */}
      <FlatList
        data={filteredMembers}
        renderItem={renderMember}
        // keyExtractor={(item) => item.UserId()} // Use UserId as key
        contentContainerStyle={styles.memberList}
      />

      {/* Member Count */}
      <View style={styles.memberCountContainer}>
        <Text style={styles.memberCountText}>
          Count: {filteredMembers.length}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const ProfilePic = ({ name }) => {
  const initial = name.charAt(0).toUpperCase();

  return (
    <View style={styles.profilePicContainer}>
      <Text style={styles.profilePicText}>{initial}</Text>
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
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomEndRadius: 15,
    borderBottomStartRadius: 15,
    justifyContent: 'center',
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
    padding: 4,
    paddingHorizontal: 5,
    borderRadius: 50,
    justifyContent: 'center',
  },
  NavbuttonText: {
    color: '#A3238F',
    fontSize: 16,
    fontWeight: 'bold',
    margin: 7,
    paddingHorizontal: 20,
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
    borderRadius: 50,
    marginLeft:10,
  },
  filterOption: {
    paddingVertical: 3,
  },
  filterOptionText: {
    fontSize: 16,
    color: '#A3238F',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#A3238F',
    borderRadius: 20,
    padding: 10,
    alignSelf: 'flex-end',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
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
    marginTop: 5,
},
   // Members List Styles
   memberList: {
    flexGrow: 1,
    paddingHorizontal: 10,
    margin: 10,
    paddingBottom: 20,
  },
});

export default HeadAdminMembersPage;
