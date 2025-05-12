const AdminPage = () => {
  const navigation = useNavigation();
  const [requirementsData, setRequirementsData] = useState([]);
  const [reviewData, setReviewData] = useState([]);
  const [profileImages, setProfileImages] = useState({});
  const [requirementsLoading, setRequirementsLoading] = useState(true);
  const [showAllRequirements, setShowAllRequirements] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [topFiveData, setTopFiveData] = useState([]); // State for Top Five data
  const [loadingTopFive, setLoadingTopFive] = useState(false);

  // Fetch Locations and Slots
  const fetchLocationData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/locations-and-slots`);
      const data = await response.json();
      setLocations(data.locations || []);
      setSlots(data.slots || []);

      // Set default selected values
      if (data.locations?.length > 0) {
        setSelectedLocation(data.locations[0].LocationID);
      }
      if (data.slots?.length > 0) {
        setSelectedSlot(data.slots[0].Id);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  // Fetch Top Five Data
  const fetchTopFiveData = async () => {
    if (!selectedLocation || !selectedSlot) {
      console.log('Location or Slot not selected yet.');
      return;
    }

    try {
      setLoadingTopFive(true);
      const response = await fetch(
        `${API_BASE_URL}/TopFive?locationId=${selectedLocation}&slot=${selectedSlot}`
      );
      const data = await response.json();
      console.log('Top Five Data:', data);
      setTopFiveData(data || []);
    } catch (error) {
      console.error('Error fetching Top Five data:', error);
    } finally {
      setLoadingTopFive(false);
    }
  };

  // Fetch Requirements and Reviews Data
  const fetchRequirementsData = async () => {
    try {
      setRequirementsLoading(true);
      const requirementsResponse = await fetch(`${API_BASE_URL}/admin/requirements`);
      const requirements = await requirementsResponse.json();

      const reviewsResponse = await fetch(`${API_BASE_URL}/admin/reviews`);
      const reviews = await reviewsResponse.json();

      const allUsers = [...requirements, ...reviews];

      const profiles = await Promise.all(
        allUsers.map(async (user) => {
          try {
            const profileResponse = await fetch(`${API_BASE_URL}/profile-image?userId=${user.UserId}`);
            const profileData = await profileResponse.json();
            return { userId: user.UserId, imageUrl: profileData.imageUrl || 'https://via.placeholder.com/50' };
          } catch (error) {
            return { userId: user.UserId, imageUrl: 'https://via.placeholder.com/50' };
          }
        })
      );

      const profileMap = profiles.reduce((map, profile) => {
        map[profile.userId] = profile.imageUrl;
        return map;
      }, {});

      setRequirementsData(requirements);
      setReviewData(reviews);
      setProfileImages(profileMap);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setRequirementsLoading(false);
    }
  };

  // Fetch location, requirements, and Top Five data on mount
  useEffect(() => {
    fetchLocationData();
    fetchRequirementsData();
  }, []);

  // Fetch Top Five data whenever location or slot changes
  useEffect(() => {
    fetchTopFiveData();
  }, [selectedLocation, selectedSlot]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.containermain}>
        {/* Header Image */}
        <View style={styles.cardimg}>
          <Image source={require('../../assets/images/Homepage_TPV.jpg')} style={styles.image} />
        </View>

        {/* Dropdown for Locations and Slots */}
        <View style={styles.dropdownContainer}>
          {/* Locations Dropdown */}
          <Picker
            selectedValue={selectedLocation}
            onValueChange={(itemValue) => setSelectedLocation(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Location" value="" />
            {locations.map((location) => (
              <Picker.Item key={location.LocationID} label={location.LocationName} value={location.LocationID} />
            ))}
          </Picker>

          {/* Slots Dropdown */}
          <Picker
            selectedValue={selectedSlot}
            onValueChange={(itemValue) => setSelectedSlot(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Slot" value="" />
            {slots.map((slot) => (
              <Picker.Item key={slot.Id} label={slot.Slots} value={slot.Id} />
            ))}
          </Picker>
        </View>

        {/* Display Top Five Data */}
        <View style={styles.cards}>
          <Text style={styles.headerText}>Top Five</Text>
          {loadingTopFive ? (
            <Text>Loading...</Text>
          ) : topFiveData.length > 0 ? (
            topFiveData.map((item, index) => (
              <View key={index} style={styles.card}>
                <Text>{item.name}</Text>
                {/* Add more details as needed */}
              </View>
            ))
          ) : (
            <Text>No data available</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};




import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/FontAwesome5';
import { API_BASE_URL } from '../constants/Config';

const { width } = Dimensions.get('window');

const AdminPage = () => {
  const [buttonClicked, setButtonClicked] = useState('given');
  const [processedData, setProcessedData] = useState([]); // Data for "OFFERED"
  const [processedReviewerData, setProcessedReviewerData] = useState([]); // Data for "RECEIVED"

  // Example fetch function to load processed data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseGiven = await fetch(`${API_BASE_URL}/weekly-top-offered`);
        const dataGiven = await responseGiven.json();
        setProcessedData(dataGiven);

        const responseReceived = await fetch(`${API_BASE_URL}/weekly-top-received`);
        const dataReceived = await responseReceived.json();
        setProcessedReviewerData(dataReceived);
      } catch (error) {
        console.error('Error fetching ranking data:', error);
      }
    };
    fetchData();
  }, []);

  const handleButtonClick = (type) => setButtonClicked(type);

  const renderData = (data) => {
    return data.map((item, index) => (
      <View key={index} style={styles.row}>
        <Text style={styles.cell}>{item.rank}</Text>
        <Text style={styles.cell}>{item.amount}</Text>
      </View>
    ));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.containermain}>
        {/* Existing Components */}

        {/* WEEKLY TOP RANKING MEMBERS */}
        <View style={styles.cards}>
          <Text style={styles.title}>WEEKLY TOP RANKING MEMBERS</Text>
          <View style={styles.home}>
            <TouchableOpacity
              style={[
                styles.addButton1,
                buttonClicked === 'taken' && styles.disabledButton,
              ]}
              onPress={() => handleButtonClick('given')}
            >
              <Text
                style={[
                  styles.buttonText1,
                  buttonClicked === 'taken' && styles.disabledButtonText,
                ]}
              >
                OFFERED
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.addButton2,
                buttonClicked === 'given' && styles.disabledButton,
              ]}
              onPress={() => handleButtonClick('taken')}
            >
              <Text
                style={[
                  styles.buttonText1,
                  buttonClicked === 'given' && styles.disabledButtonText,
                ]}
              >
                RECEIVED
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.rankingTable}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>#RANK</Text>
              <Text style={styles.tableHeaderText}>AMOUNT</Text>
            </View>
            <View style={styles.container1}>
              {buttonClicked === 'given' || buttonClicked === 'taken' ? (
                renderData(
                  buttonClicked === 'given' ? processedData : processedReviewerData
                )
              ) : (
                renderData(processedData)
              )}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccc',
    // padding: 5,
  },
  containermain: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#ccc',
  },
  cards: {
    width: '90%',
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e3192',
  },
  arrowIcon: {
    marginLeft: 10,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#2e3192',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconStyle: {
    marginRight: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },

  line: {
    marginVertical: 15,
    width: '100%', 
    height: 2, 
    backgroundColor: '#2e3192',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: 'red',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileName: {
    fontSize: 16,
    marginLeft: 10,
    color: '#2e3192',
    fontWeight:'bold',
  },
  requirementSection: {
    marginLeft: 15,
    flex: 1,
  },
  requirementText: {
    fontSize: 14,
    color: '#100E09',
    marginBottom: 5,
  },
  acknowledgeButton: {
    backgroundColor: '#2e3192',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#bbb',
  },
  buttonText1: {
    color: '#fff',
  },
  noMeetupCard: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  noMeetupText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
  },

  leftButtons: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  rightButtons: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
   buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderRadius: 8,
    width: '90%',
    backgroundColor: '#fff',
    padding: 10,
    marginTop: 15,
    marginBottom:10,
  },
  leftButtons: {
    flex: 1,
    justifyContent: 'space-around',
  },
  rightButtons: {
    flex: 1,
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#2e3192',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 3,
    marginVertical: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  icon: {
    marginRight: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  image: {
    width: width * 0.790, 
    height: 150,        
    resizeMode:'cover',
    borderRadius: 10,
  },

  cardimg: {
    backgroundColor: '#F6EDF7',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    margin:10,
    marginBottom:5,
  },
  // card: {
  //   backgroundColor: '#fff',
  //   borderRadius: 10,
  //   padding: 10,
  //   marginBottom: 20,
  //   shadowColor: '#000',
  //   shadowOpacity: 0.1,
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowRadius: 8,
  //   elevation: 5,
  // },
  cards: {
    width: '90%',
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e3192',
    marginBottom: 10,
  },
  home: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  addButton1: {
    backgroundColor: '#2e3192',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  addButton2: {
    backgroundColor: '#2e3192',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonText1: {
    color: '#fff',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  disabledButtonText: {
    color: '#666',
  },
  rankingTable: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableHeaderText: {
    fontWeight: 'bold',
    color: '#2e3192',
  },
  container1: {
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  cell: {
    fontSize: 16,
    color: '#333',
  },
});

export default AdminPage;

































































































import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '../constants/Config';

const { width, height } = Dimensions.get('window');

const AdminPage = () => {
  const navigation = useNavigation();
  const [requirementsData, setRequirementsData] = useState([]);
  const [reviewData, setReviewData] = useState([]);
  const [profileImages, setProfileImages] = useState({});
  const [requirementsLoading, setRequirementsLoading] = useState(true);
  const [showAllRequirements, setShowAllRequirements] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [topRankingMembers, setTopRankingMembers] = useState([]);
  const [topRankingError, setTopRankingError] = useState(null);

  // Fetch Requirements Data and Profile Images
  const fetchRequirementsData = async () => {
    try {
      setRequirementsLoading(true);

      const response = await fetch(`${API_BASE_URL}/admin/requirements`);
      const data = await response.json();
      console.log('Fetched Requirements Data:', data);

      const responsereview = await fetch(`${API_BASE_URL}/admin/reviews`);
      const review = await responsereview.json();
      console.log('Fetched Review Data:', review);

      const profiles = await Promise.all(
        data.map(async (requirement) => {
          try {
            const profileResponse = await fetch(`${API_BASE_URL}/profile-image?userId=${requirement.UserId}`);
            const profileData = await profileResponse.json();
            return { userId: requirement.UserId, imageUrl: profileData.imageUrl || 'https://via.placeholder.com/50' };
          } catch (error) {
            console.error(`Error fetching profile image for user ${requirement.UserId}:`, error);
            return { userId: requirement.UserId, imageUrl: 'https://via.placeholder.com/50' };
          }
        })
      );

      const profileMap = profiles.reduce((map, profile) => {
        map[profile.userId] = profile.imageUrl;
        return map;
      }, {});

      setRequirementsData(data);
      setReviewData(review);
      setProfileImages(profileMap);
    } catch (error) {
      console.error('Error fetching requirements data:', error);
    } finally {
      setRequirementsLoading(false);
    }
  };

  // Fetch Weekly Top Ranking Members
  const fetchTopRankingMembers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/TopFive`);
      const data = await response.json();
      console.log('Weekly Top Ranking Members:', data);

      if (response.ok) {
        setTopRankingMembers(data);
      } else {
        setTopRankingError(data.error || 'Failed to fetch top ranking members.');
      }
    } catch (error) {
      console.error('Error fetching top ranking members:', error);
      setTopRankingError('Failed to fetch top ranking members.');
    }
  };

  useEffect(() => {
    fetchRequirementsData();
    fetchTopRankingMembers();
  }, []);

  // Navigation Handlers
  const handleNavPress1 = () => navigation.navigate('AdminMemberstack');
  const handleNavPress2 = () => navigation.navigate('AdminLocationstack');
  const handleNavPress3 = () => navigation.navigate('HeadAdminNewSubscribers');
  const handleNavPress4 = () => navigation.navigate('HeadAdminPaymentsPage');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
      <View style={styles.containermain}>
        <View style={styles.cardimg}>
          <Image
            source={require('../../assets/images/Homepage_TPV.jpg')}
            style={styles.image}
          />
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.leftButtons}>
            <TouchableOpacity style={styles.button} onPress={handleNavPress1}>
              <Icon name="users" size={20} color="white" style={styles.icon} />
              <Text style={styles.buttonText}>Members</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleNavPress2}>
              <Feather name="map-pin" size={20} color="white" style={styles.icon} />
              <Text style={styles.buttonText}>Locations</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.rightButtons}>
            <TouchableOpacity style={styles.button} onPress={handleNavPress3}>
              <Feather name="users" size={20} color="white" style={styles.icon} />
              <Text style={styles.buttonText}>New Sub</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleNavPress4}>
              <Icon name="money" size={20} color="white" style={styles.icon} />
              <Text style={styles.buttonText}>Payments</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Requirements Section */}
        <View style={styles.cards}>
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <Text style={styles.headerText}>Requirements</Text>
              <TouchableOpacity onPress={() => setShowAllRequirements(!showAllRequirements)}>
                <Icons name={showAllRequirements ? "angle-up" : "angle-down"} size={24} color="#2e3192" style={styles.arrowIcon} />
              </TouchableOpacity>
            </View>
          </View>
          <View><Text style={styles.line}></Text></View>
          {requirementsData.length > 0 ? (
            requirementsData.slice(0, showAllRequirements ? requirementsData.length : 1).map((requirement, index) => (
              <View key={index} style={styles.card}>
                <View style={styles.profileSection}>
                  <Image
                    source={{ uri: profileImages[requirement.UserId] || 'https://via.placeholder.com/50' }}
                    style={styles.profileImage}
                  />
                </View>
                <View style={styles.requirementSection}>
                  <Text style={styles.profileName}>{requirement.Username}</Text>
                  <Text style={styles.requirementText}>{requirement.Description}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.noMeetupCard}>
              <Text style={styles.noMeetupText}>No Requirements Available</Text>
            </View>
          )}
        </View>

        {/* Weekly Top Ranking Members Section */}
        <View style={styles.cards}>
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <Text style={styles.headerText}>Weekly Top Ranking Members</Text>
            </View>
          </View>
          <View><Text style={styles.line}></Text></View>
          {topRankingMembers.length > 0 ? (
            topRankingMembers.map((member, index) => (
              <View key={index} style={styles.card}>
                <View style={styles.profileSection}>
                  <Image
                    source={{ uri: member.profileImage || 'https://via.placeholder.com/50' }}
                    style={styles.profileImage}
                  />
                </View>
                <View style={styles.requirementSection}>
                  <Text style={styles.profileName}>{member.username}</Text>
                  <Text style={styles.requirementText}>Points: {member.points}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.noMeetupCard}>
              <Text style={styles.noMeetupText}>
                {topRankingError || "No ranking data available this week."}
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccc',
    // padding: 5,
  },
  containermain: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#ccc',
  },
  cards: {
    width: '90%',
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e3192',
  },
  arrowIcon: {
    marginLeft: 10,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#2e3192',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconStyle: {
    marginRight: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },

  line: {
    marginVertical: 15,
    width: '100%', 
    height: 2, 
    backgroundColor: '#2e3192',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: 'red',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileName: {
    fontSize: 16,
    marginLeft: 10,
    color: '#2e3192',
    fontWeight:'bold',
  },
  requirementSection: {
    marginLeft: 15,
    flex: 1,
  },
  requirementText: {
    fontSize: 14,
    color: '#100E09',
    marginBottom: 5,
  },
  acknowledgeButton: {
    backgroundColor: '#2e3192',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#bbb',
  },
  buttonText1: {
    color: '#fff',
  },
  noMeetupCard: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  noMeetupText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
  },

  leftButtons: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  rightButtons: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
   buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderRadius: 8,
    width: '90%',
    backgroundColor: '#fff',
    padding: 10,
    marginTop: 15,
    marginBottom:10,
  },
  leftButtons: {
    flex: 1,
    justifyContent: 'space-around',
  },
  rightButtons: {
    flex: 1,
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#2e3192',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 3,
    marginVertical: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  icon: {
    marginRight: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  image: {
    width: width * 0.790, 
    height: 150,        
    resizeMode:'cover',
    borderRadius: 10,
  },

  cardimg: {
    backgroundColor: '#F6EDF7',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    margin:10,
    marginBottom:5,
  },
  // card: {
  //   backgroundColor: '#fff',
  //   borderRadius: 10,
  //   padding: 10,
  //   marginBottom: 20,
  //   shadowColor: '#000',
  //   shadowOpacity: 0.1,
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowRadius: 8,
  //   elevation: 5,
  // },
});

export default AdminPage;
















// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, Image, Dimensions, ScrollView, StyleSheet } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import Icons from 'react-native-vector-icons/FontAwesome5';
// import Feather from 'react-native-vector-icons/Feather';
// import { useNavigation } from '@react-navigation/native';
// import { API_BASE_URL } from '../constants/Config';

// const { width, height } = Dimensions.get('window');

// const AdminPage = () => {
//   const navigation = useNavigation();
//   const [requirementsData, setRequirementsData] = useState([]);
//   const [reviewData, setreviewData] = useState([]);
//   const [profileImages, setProfileImages] = useState({});
//   const [requirementsLoading, setRequirementsLoading] = useState(true);
//   const [showAllRequirements, setShowAllRequirements] = useState(false);
//   const [showAllReviews, setShowAllReviews] = useState(false);
  
//   // Fetch Requirements Data and Profile Images
//   const fetchRequirementsData = async () => {
//     try {
//       setRequirementsLoading(true);
  
//       const response = await fetch(${API_BASE_URL}/admin/requirements);
//       const data = await response.json();
      
//       console.log('Fetched Requirements Data:', data);
//       // if (!response.ok) throw new Error('Failed to fetch requirements data.');
  
//       const responsereviwe = await fetch(${API_BASE_URL}/admin/reviews);
//       const review = await responsereviwe.json();
//       console.log('Fetched review Data:', review);
  
//       const profiles = await Promise.all(
//         data.map(async (requirement) => {
//           try {
//             const profileResponse = await fetch(${API_BASE_URL}/profile-image?userId=${requirement.UserId});
//             const profileData = await profileResponse.json();
//             return { userId: requirement.UserId, imageUrl: profileData.imageUrl || 'https://via.placeholder.com/50' };
//           } catch (error) {
//             console.error(Error fetching profile image for user ${requirement.UserId}:, error);
//             return { userId: requirement.UserId, imageUrl: 'https://via.placeholder.com/50' };
//           }
//         })
//       );
  
//       const profileMap = profiles.reduce((map, profile) => {
//         map[profile.userId] = profile.imageUrl;
//         return map;
//       }, {});
  
//       setRequirementsData(data);
//       setreviewData(review);
//       setProfileImages(profileMap);
//     } catch (error) {
//       console.error('Error fetching requirements data:', error);
//     } finally {
//       setRequirementsLoading(false);
//     }
//   };
  

//   // Handle acknowledging a requirement


//   // Handle navigation actions
//   const handleNavPress1 = () => {
//     navigation.navigate('AdminMemberstack');
//   };
//   const handleNavPress2 = () => {
//     navigation.navigate('AdminLocationstack');
//   };
//   const handleNavPress3 = () => {
//     navigation.navigate('HeadAdminNewSubscribers');
//   };
//   const handleNavPress4 = () => {
//     navigation.navigate('HeadAdminPaymentsPage');
//   };

//   useEffect(() => {
//     fetchRequirementsData();
//   }, []);

//   return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
    
//       <View style={styles.containermain}>
//        <View style={styles.cardimg}>
//           <Image
//             source={require('../../assets/images/Homepage_TPV.jpg')}
//             style={styles.image}
//           />
//         </View>
//        <View style={styles.buttonContainer}>
//           <View style={styles.leftButtons}>
//             <TouchableOpacity style={styles.button} onPress={handleNavPress1}>
//               <Icon name="users" size={20} color="white" style={styles.icon} />
//               <Text style={styles.buttonText}>Members</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.button} onPress={handleNavPress2}>
//               <Feather name="map-pin" size={20} color="white" style={styles.icon} />
//               <Text style={styles.buttonText}>Locations</Text>
//             </TouchableOpacity>
//           </View>

//           <View style={styles.rightButtons}>
//             <TouchableOpacity style={styles.button} onPress={handleNavPress3}>
//               <Feather name="users" size={20} color="white" style={styles.icon} />
//               <Text style={styles.buttonText}>New Sub</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.button} onPress={handleNavPress4}>
//               <Icon name="money" size={20} color="white" style={styles.icon} />
//               <Text style={styles.buttonText}>Payments</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//         {/* ===============================Requirements=============================== */}
//         <View style={styles.cards}>
//   <View style={styles.header}>
//     <View style={styles.headerRow}>
//       <Text style={styles.headerText}>Requirements</Text>
//       <TouchableOpacity onPress={() => setShowAllRequirements(!showAllRequirements)}>
//         <Icons name={showAllRequirements ? "angle-up" : "angle-down"} size={24} color="#2e3192" style={styles.arrowIcon} />
//       </TouchableOpacity>
//     </View>
//   </View>
//   <View><Text style={styles.line}></Text></View>
//   {requirementsData.length > 0 ? (
//     <>
//       {requirementsData.slice(0, showAllRequirements ? requirementsData.length : 1).map((requirement, index) => (
//         <View key={index} style={styles.card}>
//           <View style={styles.profileSection}>
//             <Image
//               source={{ uri: profileImages[requirement.UserId] || 'https://via.placeholder.com/50' }}
//               style={styles.profileImage}
//             />
//           </View>
//           <View style={styles.requirementSection}>
//             <Text style={styles.profileName}>{requirement.Username}</Text>
//             <Text style={styles.requirementText}>{requirement.Description}</Text>
//           </View>
//         </View>
//       ))}
//     </>
//   ) : (
//     <View style={styles.noMeetupCard}>
//       <Text style={styles.noMeetupText}>No Requirements Available</Text>
//     </View>
//   )}
// </View>


//         {/* ===================================Reviews================================== */}

//         <View style={styles.cards}>
//   <View style={styles.header}>
//     <View style={styles.headerRow}>
//       <Text style={styles.headerText}>Reviews</Text>
//       <TouchableOpacity onPress={() => setShowAllReviews(!showAllReviews)}>
//         <Icons name={showAllReviews ? "angle-up" : "angle-down"} size={24} color="#2e3192" style={styles.arrowIcon} />
//       </TouchableOpacity>
//     </View>
//   </View>
//   <View><Text style={styles.line}></Text></View>
//   {reviewData.length > 0 ? (
//     <>
//       {reviewData.slice(0, showAllReviews ? reviewData.length : 1).map((review, index) => (
//         <View key={index} style={styles.card}>
//           <View style={styles.profileSection}>
//             <Image
//               source={{ uri: profileImages[review.UserId] || 'https://via.placeholder.com/50' }}
//               style={styles.profileImage}
//             />
//           </View>
//           <View style={styles.requirementSection}>
//             <Text style={styles.profileName}>{review.Username || "Unknown User"}</Text>
//             <Text style={styles.requirementText}>{review.Description || "No description provided."}</Text>
//           </View>
//         </View>
//       ))}
//     </>
//   ) : (
//     <View style={styles.noMeetupCard}>
//       <Text style={styles.noMeetupText}>No Reviews Available</Text>
//     </View>
//   )}
// </View>




//       </View>
//     </ScrollView>
//   );
// };


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#ccc',
//     // padding: 5,
//   },
//   containermain: {
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//     backgroundColor: '#ccc',
//   },
//   cards: {
//     width: '90%',
//     marginVertical: 10,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     padding: 10,
//     borderRadius: 10,
//   },
//   headerRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//     alignItems: 'center',
//   },
//   headerText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#2e3192',
//   },
//   arrowIcon: {
//     marginLeft: 10,
//   },
//   addButton: {
//     flexDirection: 'row',
//     backgroundColor: '#2e3192',
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 30,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   buttonContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   iconStyle: {
//     marginRight: 5,
//   },
//   addButtonText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },

//   line: {
//     marginVertical: 15,
//     width: '100%', 
//     height: 2, 
//     backgroundColor: '#2e3192',
//   },
//   card: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     padding: 10,
//     marginVertical: 5,
//     borderRadius: 10,
//     alignItems: 'center',
//     shadowColor: 'red',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//   },
//   profileSection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   profileImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//   },
//   profileName: {
//     fontSize: 16,
//     marginLeft: 10,
//     color: '#2e3192',
//     fontWeight:'bold',
//   },
//   requirementSection: {
//     marginLeft: 15,
//     flex: 1,
//   },
//   requirementText: {
//     fontSize: 14,
//     color: '#100E09',
//     marginBottom: 5,
//   },
//   acknowledgeButton: {
//     backgroundColor: '#2e3192',
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   disabledButton: {
//     backgroundColor: '#bbb',
//   },
//   buttonText1: {
//     color: '#fff',
//   },
//   noMeetupCard: {
//     padding: 20,
//     backgroundColor: '#f0f0f0',
//     borderRadius: 5,
//   },
//   noMeetupText: {
//     textAlign: 'center',
//     color: '#999',
//     fontSize: 16,
//   },

//   leftButtons: {
//     flexDirection: 'column',
//     alignItems: 'flex-start',
//   },
//   rightButtons: {
//     flexDirection: 'column',
//     alignItems: 'flex-end',
//   },
//    buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-evenly',
//     borderRadius: 8,
//     width: '90%',
//     backgroundColor: '#fff',
//     padding: 10,
//     marginTop: 15,
//     marginBottom:10,
//   },
//   leftButtons: {
//     flex: 1,
//     justifyContent: 'space-around',
//   },
//   rightButtons: {
//     flex: 1,
//     justifyContent: 'space-around',
//   },
//   button: {
//     backgroundColor: '#2e3192',
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     elevation: 3,
//     marginVertical: 5,
//     marginHorizontal: 5,
//     alignItems: 'center',
//   },
//   icon: {
//     marginRight: 5,
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//     textAlign: 'center',
//     fontWeight: 'bold',
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//   },
//   image: {
//     width: width * 0.790, 
//     height: 150,        
//     resizeMode:'cover',
//     borderRadius: 10,
//   },

//   cardimg: {
//     backgroundColor: '#F6EDF7',
//     borderRadius: 10,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     margin:10,
//     marginBottom:5,
//   },
//   // card: {
//   //   backgroundColor: '#fff',
//   //   borderRadius: 10,
//   //   padding: 10,
//   //   marginBottom: 20,
//   //   shadowColor: '#000',
//   //   shadowOpacity: 0.1,
//   //   shadowOffset: { width: 0, height: 2 },
//   //   shadowRadius: 8,
//   //   elevation: 5,
//   // },
// });

// export default AdminPage;                 



// i need to add the WEEKLY TOP RANKING MEMBERS  in ADMINPAGE     

// like this code: 

//  const fetchTopFiveData = async () => {
//       try {
//         const locationId = route.params.locationId;
//         const slots = chapterType;
//         console.log("LocationID for getUpcomingEvents-------------------", locationId);
//         console.log("Slots for getUpcomingEvents-------------------------", slots);
//         const response = await fetch(${API_BASE_URL}/TopFive?locationId=${locationId}&slot=${slots});
//         const data = await response.json();
//         console.log("Top Five Data--------------------------------------", data);
    
//         if (response.ok) {
//           setTopFiveData(data);
//         } else {
//           settopFiveError(data.error);
//         }
//       } catch (err) {
//         console.error("Error fetching data", err);
//         settopFiveError('Failed to fetch data');
//       } finally {
//         setLoading(false);
//       }
//     };    













        <View style={styles.cards}>
      <Text style={styles.title}>WEEKLY TOP RANKING MEMBERS</Text>
      <View style={styles.home}>
        <TouchableOpacity
          style={[
            styles.addButton1,
            buttonClicked === 'taken' && styles.disabledButton,
          ]}
          onPress={() => handleButtonClick('given')}
        >
          <Text
            style={[
              styles.buttonText1,
              buttonClicked === 'taken' && styles.disabledButtonText,
            ]}
          >
            OFFERED
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.addButton2,
            buttonClicked === 'given' && styles.disabledButton,
          ]}
          onPress={() => handleButtonClick('taken')}
        >
          <Text
            style={[
              styles.buttonText1,
              buttonClicked === 'given' && styles.disabledButtonText,
            ]}
          >
            RECEIVED
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.rankingTable}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>#RANK</Text>
          <Text style={styles.tableHeaderText}>AMOUNT</Text>
        </View>
        <View style={styles.container1}>
          {buttonClicked === 'given' || buttonClicked === 'taken' ? (
            renderData(
              buttonClicked === 'given' ? processedData : processedReviewerData
            )
          ) : (
            renderData(processedData)
          )}
        </View>
      </View>
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: '#F5F5F5',
      margin: 8,
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 10,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 8,
      elevation: 5,
    },
    starIcon: {
      marginLeft: 5,
    },    
    image: {
      width: '100%',
      height: 150, 
      borderRadius: 10,
    },
    cards: {
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 15,
      margin: 0,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    dashboardContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    dashboardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
      color: '#2e3192',
    },
    arrowIcon: {
      marginLeft: 10,
    },    
    meetupCard: {
      backgroundColor: '#F3ECF3',
      borderRadius: 10,
      padding: 15,
      marginBottom: 10,
    },
    meetupTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#6C757D',
      marginBottom: 10,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
    },
    downArrowIcon: {
      alignSelf: 'center',
      marginVertical: 10,
    },  
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center', 
      justifyContent: 'space-between',
    },    
    meetupInfo: {
      marginLeft: 5,
      marginRight: 15,
      color: '#6C757D',
      fontSize: 14,
    },
    locationText: {
      marginLeft: 5,
      color: '#6C757D',
      fontSize: 14,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 5,
    },
    confirmButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white',
      padding: 5,
      paddingHorizontal: 10,
      borderRadius: 50,
    },
    declineButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#DC3545',
      padding: 10,
      borderRadius: 5,
    },
    disabledButton: {
      backgroundColor: '#B0B0B0',
      opacity: 0.6,
    },
    buttonText: {
      color: '#2e3192',
      marginLeft: 5,
      fontSize: 14,
    },
    buttonText1: {
      color: 'white',
      marginLeft: 5,
      fontSize: 14,
      fontWeight: '600',
    },
    disabledButton: {
      backgroundColor: '#B0B0B0',
      opacity: 0.6,
    },    
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    headerText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
    },
    requirementCard: {
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 3,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    profileContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    profileImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 10,
    },
    profileName: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    requirementContent: {
      flex: 1,
      justifyContent: 'space-between',
    },
    requirementText: {
      fontSize: 14,
      color: '#666',
      marginBottom: 10,
    },
    line: {
        margin: 15,
        textAlign: 'center',
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      iconStyle: {
        marginRight: 8,
      },
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2e3192',
      },
      addButton: {
        backgroundColor: '#2e3192',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
      },
      addButtonText: {
        color: '#fff',
        fontWeight: '600',
      },
      card: {
        backgroundColor: '#F6EDF7',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        marginBottom: 20,
      },
      profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      },
      profileName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2e3192',
      },
      requirementSection: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
      },
      rating: {
        fontSize: 14,
        color: 'grey',
        lineHeight: 22,
      },
      requirementText: {
        fontSize: 14,
        color: '#2e3192',
        lineHeight: 22,
      },
      acknowledgeButton: {
        position: 'absolute',
        top: -50,
        right: 0,
        backgroundColor: '#2e3192',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 20,
      },
      acknowledgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
      },
    
    pagination: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    activeDot: {
      width: 8,
      height: 8,
      backgroundColor: '#A83893',
      borderRadius: 4,
      marginHorizontal: 4,
    },
    inactiveDot: {
      width: 8,
      height: 8,
      backgroundColor: '#D8D8D8',
      borderRadius: 4,
      marginHorizontal: 4,
    },
    noMeetupCard: {
      padding: 20,
      backgroundColor: '#f8f9fa',
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 20,
    },
    noMeetupText: {
      fontSize: 16,
      color: '#6C757D',
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      alignContent: 'center',
      color: '#2e3192',
    },
    buttonContainer: {
      flexDirection: 'row',  
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    home: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    addButton1: {
      backgroundColor: '#2e3192',
      padding: 10,
      paddingHorizontal: 40,
      borderRadius: 5,
      marginBottom: 20,
    },
    addButton2: {
      backgroundColor: '#2e3192',
      padding: 10,
      borderRadius: 5,
      marginBottom: 20,
      paddingHorizontal: 40,
    },
    buttonText1: {
      color: '#fff',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    disabledButtonText: {
      color: '#666',
    },
    rankingTable: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
    },
    tableHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    tableHeaderText: {
      fontWeight: 'bold',
      color: '#2e3192',
    },
    tableRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    usernameText: {
      fontSize: 16,
      fontWeight: 'bold',
      marginRight: 10,
    },
    container1: {
      flex: 1,
      padding: 10,
      backgroundColor: '#F3ECF3',
      margin: 8,
      borderRadius: 10,
    },
    userContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 15,
      padding: 10,
      backgroundColor: 'white',
      borderRadius: 10,
    },
    rankContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      margin: 5,
    },
    rankText: {
      marginRight: 10,
      fontWeight: 'bold',
      color: '#2e3192',
    },
    nameText: {
      fontWeight: 'bold',
      color: '#2e3192',
    },
    amountText: {
      fontWeight: 'bold',
      color: '#2e3192',
      textAlign: 'right', 
      width: 100,
    },
    dataContainer: {
      marginBottom: 10,
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
  });
  export default styles;



































// container: {
//   flex: 1,
//   backgroundColor: '#ccc',
//   padding: 5,
// }, scrollView: {
//   width: width, // Full width of the screen
// },
// innerText3: {
//   fontSize: 18,
//   fontWeight: 'bold',
//   color: '#000',
//   padding: 20,
// },
// containermain: {
//   justifyContent: 'flex-start',
//   alignItems: 'center',
//   backgroundColor: '#ccc',
// },
// iconImage: {

//   width: 300,
//   height: 50,
//   resizeMode: 'contain',
// },
// topNav: {
//   backgroundColor: '#FFFFFF',
//   paddingVertical: 10,
//   alignItems: 'center',
//   borderBottomEndRadius: 15,
//   borderBottomStartRadius: 15,
//   justifyContent: 'center',
// },


// topContainer1: {
//   width: '90%',
//   height: height * 0.25,
//   backgroundColor: '#fff',
//   marginBottom: 25,
//   borderRadius: 15,
//   marginTop: 25,
//   padding: 8,
// },
// topContainer2: {
//   width: '90%',
//   height: height * 0.25,
//   backgroundColor: '#fff',
//   borderRadius: 15,
//   padding: 8,
// },
// topText: {
//   color: '#2e3192',
//   fontSize: 15,
//   fontWeight: 'bold',
// },
// underline: {
//   height: 1,
//   backgroundColor: 'black',
//   width: '100%',
//   marginTop: 5,
// },
// innerContainer1: {
//   margin: 5,
//   backgroundColor: '#f0e1eb',
//   borderRadius: 8,
//   height: 150,
//   justifyContent: 'center',

// },
// innerContainer2: {
//   margin: 5,
//   backgroundColor: '#f0e1eb',
//   borderRadius: 8,
//   height: 150,
//   flexDirection: 'row',
//   paddingRight: 10,
//   paddingLeft: 10,
// },
// innerTextcon1: {
//   color: '#2e3192',
//   fontSize: 15,
//   height: 85,
//   width: '93.5%',
//   backgroundColor: '#fff',
//   padding: 5,
//   borderRadius: 8,
//   marginHorizontal: 10,
// },
// innerpictexcon: {
//   flexDirection: 'row',
//   alignItems: 'center',
// },
// innerText3: {
//   color: 'black',
// },
// innerTextcon2: {
//   backgroundColor: '#fff',
//   height: 110,
//   width: '78%',
//   borderRadius: 8,
//   padding: 5,
//   marginLeft: 5,
//   alignItems: 'flex-start',
//   marginTop: 25,

// },
// profileImage1: {
//   height: 35,
//   width: 35,
//   borderRadius: 50,
//   margin: 10,
//   marginRight: 5,

// },
// profileImage2: {
//   height: 55,
//   width: 55,
//   borderRadius: 50,
//   marginRight: 5,
//   alignSelf: 'center',
//   marginTop: 15,
// },
// profileName1: {
//   color: '#2e3192',
//   fontSize: 15,
//   fontWeight: 'bold',
// },
// profileName2: {
//   position: 'absolute',
//   color: '#2e3192',
//   fontSize: 15,
//   marginLeft: 10,
//   paddingTop: 2,
//   fontWeight: 'bold',
// },
// buttonContainer: {
//   flexDirection: 'row',
//   justifyContent: 'space-evenly',
//   borderRadius: 8,
//   width: '90%',
//   backgroundColor: '#fff',
//   padding: 10,
//   marginTop: 25,
// },
// leftButtons: {
//   flex: 1,
//   justifyContent: 'space-around',
// },
// rightButtons: {
//   flex: 1,
//   justifyContent: 'space-around',
// },
// button: {
//   backgroundColor: '#2e3192',
//   paddingVertical: 15,
//   paddingHorizontal: 20,
//   borderRadius: 8,
//   elevation: 3,
//   marginVertical: 5,
//   marginHorizontal: 5,
//   alignItems: 'center',
// },
// icon: {
//   marginRight: 5,
// },
// buttonText: {
//   color: 'white',
//   fontSize: 16,
//   textAlign: 'center',
//   fontWeight: 'bold',
// },
// ratingContainer: {
//   flexDirection: 'row',
// },
// cards: {
//   backgroundColor: 'white',
//   borderRadius: 10,
//   padding: 15,
//   margin: 0,
//   marginBottom: 10,
//   shadowColor: '#000',
//   shadowOffset: { width: 0, height: 2 },
//   shadowOpacity: 0.1,
//   shadowRadius: 5,
//   elevation: 3,
// },
// headerRow: {
//   flexDirection: 'row',
//   alignItems: 'center', 
//   justifyContent: 'space-between',
// },    
// arrowIcon: {
//   marginLeft: 10,
// },    
// addButton: {
//   backgroundColor: '#2e3192',
//   paddingVertical: 8,
//   paddingHorizontal: 15,
//   borderRadius: 20,
// },
// buttonContent: {
//   flexDirection: 'row',
//   alignItems: 'center',
// },
// line: {
//   margin: 15,
//   textAlign: 'center',
// },
// card: {
// backgroundColor: '#F6EDF7',
// borderRadius: 10,
// padding: 20,
// shadowColor: '#000',
// shadowOffset: { width: 0, height: 2 },
// shadowOpacity: 0.1,
// shadowRadius: 5,
// marginBottom: 20,
// },
// profileSection: {
// flexDirection: 'row',
// alignItems: 'center',
// marginBottom: 10,
// },
// profileImage: {
// width: 50,
// height: 50,
// borderRadius: 25,
// marginRight: 10,
// },
// requirementSection: {
// backgroundColor: '#fff',
// borderRadius: 10,
// padding: 15,
// },
// requirementText: {
// fontSize: 14,
// color: '#7E3F8F',
// lineHeight: 22,
// },
// noMeetupCard: {
// padding: 20,
// backgroundColor: '#f8f9fa',
// borderRadius: 10,
// alignItems: 'center',
// marginTop: 20,
// },
// noMeetupText: {
// fontSize: 16,
// color: '#6C757D',
// },
// header: {
//   flexDirection: 'row',
//   justifyContent: 'space-between',
//   alignItems: 'center',
// },
// headerRow: {
//   flexDirection: 'row',
//   alignItems: 'center', 
//   justifyContent: 'space-between',
// },   
// });

// export default AdminPage;
















































// import React, { useEffect, useState } from 'react';
// import { View, TextInput, FlatList, ActivityIndicator, Text, TouchableOpacity, Image, Alert, useWindowDimensions,ScrollView } from 'react-native';
// import { API_BASE_URL } from '../constants/Config';
// import { TabView, TabBar } from 'react-native-tab-view';
// import { useSelector } from 'react-redux';
// import { launchCamera } from 'react-native-image-picker';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import styles from '../components/layout/MembersStyle';
// import { SafeAreaView } from 'react-native-safe-area-context';

// // TabContent Component - Displays list of members, photo upload functionality
// const TabContent = ({ chapterType, locationId, navigation }) => {
//   const userId = useSelector((state) => state.user?.userId);
//   console.log('---------------data userid--------------', userId);

//   const [members, setMembers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedMeetId, setSelectedMeetId] = useState(null); // Store the MeetId of the selected member

//   // Fetching members data
//   useEffect(() => {
//     const fetchMembers = async () => {
//       try {
//         console.log('Fetching members...');
//         const response = await fetch(`${API_BASE_URL}/list-members`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ LocationID: locationId, chapterType, userId }),
//         });

//         if (!response.ok) throw new Error('Failed to fetch members');

//         const data = await response.json();
//         console.log('----------------------------------member data=------------------', data);

//         const updatedMembers = await Promise.all(data.members.map(async (member) => {
//           let totalStars = 0;
//           if (member.ratings?.length > 0) {
//             totalStars = member.ratings.reduce((acc, rating) => acc + parseFloat(rating.average), 0);
//             member.totalAverage = totalStars / member.ratings.length;
//           } else {
//             member.totalAverage = 0;
//           }

//           const imageResponse = await fetch(`${API_BASE_URL}/profile-image?userId=${member.UserId}`);
//           if (imageResponse.ok) {
//             const imageData = await imageResponse.json();
//             member.profileImage = `${imageData.imageUrl}?t=${new Date().getTime()}`;
//           } else {
//             member.profileImage = null;
//           }

//           return member;
//         }));

//         setMembers(updatedMembers);
//       } catch (error) {
//         console.error('Error fetching members:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMembers();
//   }, [chapterType, locationId, userId]);

//   const filteredMembers = members.filter((member) =>
//     member.Username.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // Handle selecting a member and setting their MeetId
//   const handleMemberClick = (member) => {
//     const meetId = member.UserId; // Using the member's UserId as MeetId
//     setSelectedMeetId(meetId);
//     console.log('Selected MeetId:', meetId);
//     // You can also navigate to a new screen or show details here
//   };

//   // Insert meeting data
//   const insertMeetingData = async (userId, meetId, chapterType, locationId, photoUri) => {
//     try {
//       const formData = new FormData();
//       formData.append('image', {
//         uri: photoUri,
//         type: 'image/jpeg',
//         // name: `${userId}_${new Date().toISOString().replace(/[-:.]#/g, '').slice(0, 12)}.jpeg`,
//       });
//       // formData.append('UserId', userId);
//       formData.append('MeetId', meetId); 
//       formData.append('SlotID', chapterType);  
//       formData.append('LocationID', locationId);

//       console.log('==================fromdat===============', formData);
//       const uploadResponse = await fetch(`${API_BASE_URL}/upload-member-details?userId=${userId}`, {
//         method: 'POST',
//         body: formData,
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
  
//       const result = await uploadResponse.json();
//       // console.log("Data in the frontend:", result);

//       if (result.message === 'Member details and image uploaded successfully!') {
//         Alert.alert('Success', 'Photo and data uploaded successfully');
//         console.log('Data Inserted:', result);
//         // Handle successful upload here (e.g., update UI or navigate)
//       } else {
//         Alert.alert('Error', 'Photo and data upload failed');
//       }
//     } catch (error) {
//       console.error('Error during upload:', error);
//       Alert.alert('Error', 'Something went wrong while uploading data');
//     }
//   };

//   // Open camera to take a photo
//   const openCamera = () => {
//     const options = { mediaType: 'photo', cameraType: 'front' };
//     launchCamera(options, async (response) => {
//       if (response.didCancel || response.errorCode) return;
//       const photoUri = response.assets[0].uri; // Get the URI of the taken photo
//       if (selectedMeetId) {
//         await insertMeetingData(userId, selectedMeetId, chapterType, locationId, photoUri);
//       } else {
//         Alert.alert('Error', 'Please select a member first.');
//       }
//     });
//   };

//   const renderItem = ({ item }) => (
//   <View>
//     <TouchableOpacity style={styles.memberItem} onPress={() => handleMemberClick(item)}>
//       <View style={styles.memberDetails}>
//         <Image source={{ uri: item.profileImage }} style={styles.profileImage} />
//         <View style={styles.memberText}>
//           <Text style={styles.memberName}>{item.Username}</Text>
//           <Text style={styles.memberRole}>{item.Profession}</Text>
//         </View>
//       </View>
//       <View style={styles.alarmContainer}>
//         <TouchableOpacity onPress={openCamera}>
//           <Icon name="camera" size={24} color="#2e3192" />
//         </TouchableOpacity>
//       </View>
//     </TouchableOpacity>
//   </View>
  
    

//   );

//   return (
//     <View style={{ flex: 1 }}>
//       {/* Search Bar */}
//       <View style={styles.searchContainer}>
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search members..."
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//           placeholderTextColor="black"
//           color="#2e3192"
//         />
//         <View style={styles.searchIconContainer}>
//           <Icon name="search" size={23} color="#2e3192" />
//         </View>
//       </View>
  
//       {/* FlatList - Scrollable List of Members */}
//       <ScrollView style={{ flex: 1 }}>
//         <FlatList
//           data={filteredMembers}
//           keyExtractor={(item) => item.UserId.toString()}
//           contentContainerStyle={styles.memberList}
//           renderItem={renderItem}
//         />
//       </ScrollView>
//     </View>
//   );
  
// }; 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 const handleRegister = async () => { 
    // Resetting validation errors
    setUsernameError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setMobilenoError('');
    setEmailError('');
    setAddressError('');
    setBusinessNameError('');
    setSelectedProfessionError('');
    setSelectedLocationError('');
    setReferredByError('');
    setSelecteddateError('');

    let isValid = true;

    // Validation checks
    if (!username) {
      setUsernameError('Username is required');
      isValid = false;
    }
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }
    if (!Mobileno) {
      setMobilenoError('Mobile number is required');
      isValid = false;
    } else if (Mobileno.length !== 10) {
      setMobilenoError('Mobile number must be 10 digits');
      isValid = false;
    }
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Invalid email format');
      isValid = false;
    }
    if (!address) {
      setAddressError('Address is required');
      isValid = false;
    }
    if (!businessName) {
      setBusinessNameError('Business Name is required');
      isValid = false;
    }
    if (!selectedProfession) {
      setSelectedProfessionError('Profession is required');
      isValid = false;
    }
    if (!selectedLocation) {
      setSelectedLocationError('Location is required');
      isValid = false;
    }
    if (!chapterType) {
      setSelectedslotError('Slot is required');
      isValid = false;
    }
    if (!referredBy) {
      setReferredByError('Referred By is required');
      isValid = false;
    }
    if (!startDate) {
      setSelecteddateError('Date is required');
      isValid = false;
    }

    // Proceed if all validations are passed
    if (isValid) {
      try {
        // Step 1: Fetch userId when the Register button is clicked
        const userIdResponse = await fetch(`${API_BASE_URL}/execute-getuserid`);
        const userIdData = await userIdResponse.json();
        
        if (userIdData.NextuserId && userIdData.NextuserId.length > 0) {
          const generatedUserId = userIdData.NextuserId[0].UserId;
          console.log('Extracted UserId:', generatedUserId);
          setUserId(generatedUserId); // Set userId in state

          // Step 2: Register user with the generated userId
          const response = await fetch(`${API_BASE_URL}/RegisterAlldata`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user: {
                userId: generatedUserId,  // Use the generated userId here
                username,
                Password: password,
                Mobileno,
              },
              business: {
                email,
                address,
                businessName,
                profession: selectedProfession,
                chapterType: selectedChapterType,
                LocationID: selectedLocation,
                referredBy,
                startDate,
                endDate
              }
            }),
          });

          const data = await response.json();
          console.log('Registration successful:', data);

          // Navigate to the OTP screen with the mobile number
          navigation.navigate('Otpscreen', { Mobileno });

        } else {
          console.error('No UserId found in the response!');
        }
      } catch (error) {
        console.error('Error registering user:', error);
      }
    }
};


// // CCavenue Payment customer.js file 

// import React, { useContext, useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity,TextInput,Platform, StyleSheet,Button ,Linking, Alert} from 'react-native';
// import { API_ENDPOINTNODE } from './config';
// import AuthContext from './Authcontext';
// import { Buffer } from 'buffer';
// import sha256 from 'js-sha256';
// // import { encode, decode } from 'base-64';
// import { encode } from 'base-64';
// import { useNavigation } from '@react-navigation/native';
// import { ScrollView } from 'react-native-gesture-handler';
// import { WebView } from 'react-native-webview';

// const Paymentcustomer = () => {
//   const navigation = useNavigation();
//   const { userID } = useContext(AuthContext);
//   const [invoiceNumbers, setInvoiceNumbers] = useState([]);
//   const [paymentList, setPaymentList] = useState([]);     
//   const [isLoading, setIsLoading] = useState(false);
//   const [isError, setIsError] = useState(false);
 
//   const [paymentAmount, setPaymentAmount] = useState('');
//   const [webViewVisible, setWebViewVisible] = useState(false);

//   const [refreshPage, setRefreshPage] = useState(false);//to refresh the page 

//   // differentiate the invoice list 
//   const [previousOutstandingInvoices, setPreviousOutstandingInvoices] = useState([]);
//   const [currentInvoices, setCurrentInvoices] = useState([]);

//   const handlePayment = async () => {
//     try {
//       // Replace with your actual payment amount and other details
//       // const paymentAmount = 11; // Use your desired payment amount
//       const paymentDetails1 = {
//         amount: parseFloat(paymentAmount),
//         userid: userID

//       };
//       console.log('Payment Details:', paymentDetails1);
  
//       console.log('paymentDetails1=======================',paymentDetails1.amount)
//       // Construct the payment URL with the specified amount
//       const paymentUrl = `https://www.smartzensolutions.com/Payments/dataFrom.php?amount=${paymentDetails1.amount}&userid=${paymentDetails1.userid}&source=0`;
//       // const paymentUrl = `https://www.smartzensolutions.com/`;

//       console.log('Payment URL:===================', paymentUrl);
//       // Navigate to the PaymentWebView screen with the constructed payment URL 
//       navigation.navigate('PaymentWebView', { paymentUrl });
//     } catch (error) {
//       console.error('Error during payment initiation:', error);
//       // Handle error as needed
//       Alert.alert('Payment Error', 'An error occurred during the payment initiation. Please try again.');
//     }
//   };
  

// useEffect(() => {
//   const fetchData = async () => {
//     setIsLoading(true);
//     setIsError(false);
//     try {
//       // Fetch invoice numbers
//       const invoiceResponse = await fetch(
//         `${API_ENDPOINTNODE}/customer/GettotalInvoice?USER_ID=${userID}`
//       );

//       if (invoiceResponse.ok) {
//         const invoiceData = await invoiceResponse.json();

//         // Separate invoices into current and previous
//         const currentInvoices = [];
//         const previousOutstandingInvoices = [];

//         // Find the maximum two-digit number between hyphens
//         const maxTwoDigitNumber = Math.max(
//           ...invoiceData.GettotalInvoice.map((invoice) => {
//             const match = invoice.INVOICE_NO.match(/-(\d+)-/);
//             return match ? parseInt(match[1], 10) : 0;
//           })
//         );

//         // Categorize invoices based on the two-digit number
//         invoiceData.GettotalInvoice.forEach((invoice) => {
//           const match = invoice.INVOICE_NO.match(/-(\d+)-/);
//           const twoDigitNumber = match ? parseInt(match[1], 10) : 0;

//           if (twoDigitNumber === maxTwoDigitNumber) {
//             currentInvoices.push(invoice);
//           } else {
//             previousOutstandingInvoices.push(invoice);
//           }
//         });

//         setInvoiceNumbers(invoiceData.GettotalInvoice);                        
//         setCurrentInvoices(currentInvoices);
//         setPreviousOutstandingInvoices(previousOutstandingInvoices);

//         // Fetch payment details for each invoice
//         const paymentPromises = invoiceData.GettotalInvoice.map(async (invoice) => {
//           const paymentResponse = await fetch(
//             `${API_ENDPOINTNODE}/Payments/PaymentListCustomer?INVOICE_NO=${invoice.INVOICE_NO}`
//           );

//           if (paymentResponse.ok) {
//             const paymentData = await paymentResponse.json();
//             return { invoiceNo: invoice.INVOICE_NO, paymentList: paymentData.paymentList };
//           } else {
//             setIsError(true);
//             return { invoiceNo: invoice.INVOICE_NO, paymentList: [] };
//           }
//         });

//         // Wait for all payment details to be fetched
//         const allPayments = await Promise.all(paymentPromises);

//         // Flatten the array and set the paymentList state
//         const flattenedPayments = allPayments.flatMap((item) => item.paymentList);
//         setPaymentList(flattenedPayments);
//         if (refreshPage) {
//           setRefreshPage(false);
//         }
//       } else {
//         setIsError(true);
//       }

//       setIsLoading(false);
//     } catch (error) {
//       setIsError(true);
//       setIsLoading(false);
//     }
//   };

//   fetchData();


// // Subscribe to the navigation focus event to reload the page
// const unsubscribe = navigation.addListener('focus', () => {
//   setRefreshPage(true);
// });

// // Cleanup function
// return () => {
//   unsubscribe();
// };


// }, [userID, refreshPage]);


// // Rest of your code remains the same
// let totalCurrentAmount = 0;
// let totalPreviousAmount = 0;
//   return (
//   <View style={styles.container}>
// <ScrollView>
    
// {previousOutstandingInvoices.length > 0 && (
//   <>
//     <Text style={styles.heading}>Previous Outstanding </Text>
//     {previousOutstandingInvoices.map((invoice, index) => {
//       const correspondingPayment = paymentList.find((payment) => payment.INVOICE_NO === invoice.INVOICE_NO);
//       if (correspondingPayment) {
//         totalPreviousAmount += parseFloat(correspondingPayment.Total_NetAmount);
//       }
//       return (
//         <View key={index} style={styles.invoiceItem}>
//           <View key={index} style={styles.paymentItem}>
//         <View style={styles.cardRow}>
//          <Text style={styles.cardLabel}>INVOICE NO</Text>
//          <Text style={styles.cardLabelTextinvoice}>{invoice.INVOICE_NO}</Text>
//          </View>
//           {correspondingPayment && (
//             <>
//                <View style={styles.cardRow}>
//          <Text style={styles.cardLabel}>USER ID</Text>
//              <Text style={styles.cardLabelText}>{correspondingPayment.USER_ID}</Text>
//          </View>            
//               <View style={styles.cardRow}>
//          <Text style={styles.cardLabel}>LOGIN NAME</Text>
//          <Text style={styles.cardLabelText}>{correspondingPayment.LOGIN_NAME}</Text>
//          </View>
//               <View style={styles.cardRow}>
//                 <Text style={styles.cardLabel}>Total Amount</Text>
//                 <Text style={styles.cardLabelText}>{parseFloat(correspondingPayment.Total_NetAmount).toFixed(2)}</Text>
//               </View>
//             </>
//           )}
//         </View>
//         </View>
//       );
//     })}
//   </>
// )}

// {currentInvoices.length > 0 && (
//   <>
//     <Text style={styles.heading}>Current invoice</Text>
//     {currentInvoices.map((invoice, index) => {
//       const correspondingPayment = paymentList.find((payment) => payment.INVOICE_NO === invoice.INVOICE_NO);
//       if (correspondingPayment) {
//         totalCurrentAmount += parseFloat(correspondingPayment.Total_NetAmount);
//       }
//       return (
//         <View key={index} style={styles.paymentItem}>
//            <View style={styles.cardRow}>
//          <Text style={styles.cardLabel}>INVOICE NO</Text>
//          <Text style={styles.cardLabelTextinvoice}>{invoice.INVOICE_NO}</Text>
//          </View>
//           {correspondingPayment && (
//             <>
//          <View style={styles.cardRow}>
//          <Text style={styles.cardLabel}>USER ID</Text>
//              <Text style={styles.cardLabelText}>{correspondingPayment.USER_ID}</Text>
//          </View>            
//               <View style={styles.cardRow}>
//          <Text style={styles.cardLabel}>LOGIN NAME</Text>
//          <Text style={styles.cardLabelText}>{correspondingPayment.LOGIN_NAME}</Text>
//          </View>
//               <View style={styles.cardRow}>
//                 <Text style={styles.cardLabel}>Total Amount</Text>
//                 <Text style={styles.cardLabelText}>{parseFloat(correspondingPayment.Total_NetAmount).toFixed(2)}</Text>
//               </View>
             
//             </>
//           )}
//         </View>
//       );
//     })}
//   </>
// )}


//         {/* Display the total amount for all invoices */}
//         <View style={styles.cardRow}>
//       <Text style={styles.cardLabeltotal}>Total Outstanding</Text>
//       <Text style={styles.cardLabelTexttotal}>{(totalCurrentAmount + totalPreviousAmount).toFixed(2)}</Text>
//     </View>

//         <TextInput
//           style={styles.textInput}
//           placeholder="Enter the Payment Amount to Pay"
//           placeholderTextColor="#999"
//           keyboardType="numeric"
//           value={paymentAmount}
//           onChangeText={(text) => setPaymentAmount(text)}
//         />
//         {/* <TouchableOpacity
//           style={styles.payButton}
//           onPress={() => handlePayment(paymentAmount, 'UPI_INTENT')}
//         > */}
//          <TouchableOpacity
//           style={styles.payButton}
//           onPress={() => {
//             if (paymentAmount !== '') {
//               handlePayment(paymentAmount, 'UPI_INTENT');
//             } else {
//               // Optionally, you can show an alert or perform some other action to notify the user that the amount is required.
//               Alert.alert('Please enter the payment amount.');
//             }
//           }}
// >
//           <Text style={styles.payButtonText}>Pay with UPI</Text>
//         </TouchableOpacity>

//         </ScrollView>
//   </View>
 
// );

// };



// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   heading: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginTop: 10,
//     color:'#7c9663'
//   },
//   paymentItem: {
//     marginTop: 10,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 10,
//     borderRadius: 5,
//   },
//   paymentText: {
//     color: 'grey',
//     fontSize:20,
//   },
//   invoiceNumberText: {
//     color: 'grey',
//     fontSize:20,
//     textAlign:'center'
//   },
//   // invoiceButton: {
//   //   backgroundColor: '#f2f0f0',
//   //   padding: 10,
//   //   borderRadius: 5,
//   //   marginVertical: 5,
//   //   ...Platform.select({
//   //     ios: {
//   //       shadowColor: 'black',
//   //       shadowOffset: { width: 0, height: 2 },
//   //       shadowOpacity: 0.2,
//   //       shadowRadius: 4,
//   //     },
//   //     android: {
//   //       elevation: 2,
//   //     },
//   //   }),
//   // },
//   // invoiceButtonText: {
//   //   color: 'white',
//   //   textAlign: 'center',
//   // },
//   textInput: {
//     marginTop:10,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     padding: 8,
//     marginBottom: 10,
//     color: 'black',
//     fontSize: 16,
    
//   },
//   payButton: {
//     backgroundColor: '#7c9663',
//     padding: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   cardRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//   },
//   cardLabelText: {
//     color:'black',
//     fontSize:16
//   },
//   cardLabelTexttotal:{
//     marginTop:15,
//     color:'red',
//     fontSize:16
//   },
//   cardLabelTextinvoice:{
//     color:'red',
//     fontSize:16
//   },
//   payButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize:16
//   },
//   cardLabel: {
//     fontWeight: 'bold',
//     color:'grey',
//     fontSize:16
    
//   },

//   cardLabeltotal:{
//     marginTop:15,
//     fontWeight: 'bold',
//     color:'grey',
//     fontSize:16
//   },


//   cardtext:{
//     marginTop:100,
//     textAlign:'center',
//     fontWeight: 'bold',
//     color:'red',
//     fontSize:16
    
//   }
// });

// export default Paymentcustomer;








// <View style={styles.cards}>
// <Text style={styles.dashboardTitle}>Dashboard</Text>

// {eventData && (
// <View style={styles.meetupCard}>
// <Text style={styles.meetupTitle}>Upcoming Business Meetup</Text>

// <View style={styles.row}>
// <Icon name="calendar" size={18} color="#6C757D" />
// <Text style={styles.meetupInfo}>{new Date(eventData.DateTime).toLocaleDateString()}</Text>
// <Icon name="clock-o" size={18} color="#6C757D" />
// <Text style={styles.meetupInfo}>
//   {new Date(eventData.DateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
// </Text>
// </View>

// <View style={styles.row}>
// <Icon name="map-marker" size={18} color="#6C757D" />
// <Text style={styles.locationText}>{eventData.Place || 'Unknown Location'}</Text>
// </View>

// <View style={styles.buttonRow}>
// <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmClick}>
//   <Icon name="check-circle" size={24} color="#28A745" />
//   <Text style={styles.buttonText}>Click to Confirm</Text>
// </TouchableOpacity>
// </View>
// </View>
// )}
// </View>