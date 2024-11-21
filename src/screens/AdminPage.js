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
  const [reviewData, setreviewData] = useState([]);
  const [profileImages, setProfileImages] = useState({});
  const [requirementsLoading, setRequirementsLoading] = useState(true);
  const [showAllRequirements, setShowAllRequirements] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  
  // Fetch Requirements Data and Profile Images
  const fetchRequirementsData = async () => {
    try {
      setRequirementsLoading(true);
  
      const response = await fetch(`${API_BASE_URL}/admin/requirements`);
      const data = await response.json();
      
      console.log('Fetched Requirements Data:', data);
      // if (!response.ok) throw new Error('Failed to fetch requirements data.');
  
      const responsereviwe = await fetch(`${API_BASE_URL}/admin/reviews`);
      const review = await responsereviwe.json();
      console.log('Fetched review Data:', review);
  
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
      setreviewData(review);
      setProfileImages(profileMap);
    } catch (error) {
      console.error('Error fetching requirements data:', error);
    } finally {
      setRequirementsLoading(false);
    }
  };
  

  // Handle acknowledging a requirement


  // Handle navigation actions
  const handleNavPress1 = () => {
    navigation.navigate('AdminMemberstack');
  };
  const handleNavPress2 = () => {
    navigation.navigate('AdminLocationstack');
  };
  const handleNavPress3 = () => {
    navigation.navigate('HeadAdminNewSubscribers');
  };
  const handleNavPress4 = () => {
    navigation.navigate('HeadAdminPaymentsPage');
  };

  useEffect(() => {
    fetchRequirementsData();
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
    
      <View style={styles.containermain}>
       <View style={styles.cardimg}>
          <Image
            source={require('../../assets/images/Homepage_BMW.jpg')}
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
        {/* ===============================Requirements=============================== */}
        <View style={styles.cards}>
  <View style={styles.header}>
    <View style={styles.headerRow}>
      <Text style={styles.headerText}>Requirements</Text>
      <TouchableOpacity onPress={() => setShowAllRequirements(!showAllRequirements)}>
        <Icons name={showAllRequirements ? "angle-up" : "angle-down"} size={24} color="#a3238f" style={styles.arrowIcon} />
      </TouchableOpacity>
    </View>
  </View>
  <View><Text style={styles.line}></Text></View>
  {requirementsData.length > 0 ? (
    <>
      {requirementsData.slice(0, showAllRequirements ? requirementsData.length : 1).map((requirement, index) => (
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
      ))}
    </>
  ) : (
    <View style={styles.noMeetupCard}>
      <Text style={styles.noMeetupText}>No Requirements Available</Text>
    </View>
  )}
</View>


        {/* ===================================Reviews================================== */}

        <View style={styles.cards}>
  <View style={styles.header}>
    <View style={styles.headerRow}>
      <Text style={styles.headerText}>Reviews</Text>
      <TouchableOpacity onPress={() => setShowAllReviews(!showAllReviews)}>
        <Icons name={showAllReviews ? "angle-up" : "angle-down"} size={24} color="#a3238f" style={styles.arrowIcon} />
      </TouchableOpacity>
    </View>
  </View>
  <View><Text style={styles.line}></Text></View>
  {reviewData.length > 0 ? (
    <>
      {reviewData.slice(0, showAllReviews ? reviewData.length : 1).map((review, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.profileSection}>
            <Image
              source={{ uri: profileImages[review.UserId] || 'https://via.placeholder.com/50' }}
              style={styles.profileImage}
            />
          </View>
          <View style={styles.requirementSection}>
            <Text style={styles.profileName}>{review.Username || "Unknown User"}</Text>
            <Text style={styles.requirementText}>{review.Description || "No description provided."}</Text>
          </View>
        </View>
      ))}
    </>
  ) : (
    <View style={styles.noMeetupCard}>
      <Text style={styles.noMeetupText}>No Reviews Available</Text>
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
    color: '#A3238F',
  },
  arrowIcon: {
    marginLeft: 10,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#A3238F',
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
    backgroundColor: '#A3238F',
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
    color: '#a3238f',
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
    backgroundColor: '#A3238f',
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
    backgroundColor: '#A3238F',
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
