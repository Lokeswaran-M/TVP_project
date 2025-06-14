import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, ScrollView, StyleSheet,RefreshControl, } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/FontAwesome5';
import { Picker } from '@react-native-picker/picker'; // Import Picker
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '../constants/Config';
import Ionicons from 'react-native-vector-icons/Ionicons';



const { width, height } = Dimensions.get('window');
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
  const [loadingTopFive, setLoadingTopFive] = useState(false);
  const [topFiveData, setTopFiveData] = useState([]);
  const [buttonClicked, setButtonClicked] = useState(null);
  const [processedData, setProcessedData] = useState([]);
  const [processedReviewerData, setProcessedReviewerData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
const [showContainer, setShowContainer] = useState(false);







const fetchTotalAmount = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/total-amount/Admin`);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log("Total Amount Data received:=====================", data);
    setTotalAmount(data.totalAmount);
  } catch (err) {
    setError('Failed to load data');
    console.error(err);
  } finally {
    setLoading(false);
  }
};





const fetchAllData = async () => {
  setRefreshing(true);
  try {
    await Promise.all([
      fetchLocationData(),
      fetchRequirementsData(),
      fetchTotalAmount(),
    ]);
  } catch (error) {
    console.error("Error refreshing data", error);
  } finally {
    setRefreshing(false);
  }
};

  const fetchLocationData = async () => {
    setRefreshing(true);
    try {
      console.log("Fetching location data...");
      const locationsResponse = await fetch(`${API_BASE_URL}/api/locations`);

      if (!locationsResponse.ok) {
        throw new Error('Network response was not ok');
      }

      const locationsData = await locationsResponse.json();
      console.log("Fetched locations ", locationsData);

      setLocations(locationsData.locations || []);

      if (locationsData.locations?.length > 0) {
        setSelectedLocation(locationsData);
      }
      setRefreshing(false);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const fetchTopFiveData = async () => {
    if (!selectedLocation) {
      console.log('Location not selected yet.');
      return;
    }

    try {
      setLoadingTopFive(true);

      const response = await fetch(
        `${API_BASE_URL}/TopFive?locationId=${selectedLocation}`
      );
      const data = await response.json();
      console.log("----------------------------response data-----------------", selectedLocation)
      console.log("----------------------------top 5 data-----------------", data)

      if (Array.isArray(data)) {
        setTopFiveData(data); 
      } else {
        console.error('API returned non-array data:', data);
        setTopFiveData([]); 
      }
    } catch (error) {
      console.error('Error fetching Top Five data:', error);
      setTopFiveData([]); 
    } finally {
      setLoadingTopFive(false);
    }
  };

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
  const renderData = (data) => {
    return data.map((user, index) => (
      <View key={user.UserId} style={styles.userContainer}>
        {/* <Image 
            source={profileImages[user.UserId] ? { uri: profileImages[user.UserId] } : profileImages} 
            style={styles.profileImage} 
          /> */}
        <Image
          source={
            profileImages[user.UserId]
              ? { uri: profileImages[user.UserId] }
              : require('../../assets/images/DefaultProfile.jpg')
          }
          style={styles.profileImage}
        />


        <Text style={styles.usernameText}> No.{index + 1} </Text>
        <Text style={styles.usernameText}>{user.Username}</Text>
        <Text style={styles.amountText}>₹{user.formattedAmount}</Text>
      </View>
    ));
  };

  useEffect(() => {
    fetchLocationData();
    fetchRequirementsData();
    fetchTotalAmount();
  }, []);

  useEffect(() => {
    fetchTopFiveData();
  }, [selectedLocation]);

  const handleButtonClick = (buttonType) => {
    const groupAndSumAmounts = (data) => {
      const groupedData = data.reduce((acc, curr) => {
        const userId = curr.UserId;
        const amount = curr.Amount ? parseFloat(curr.Amount) : 0;
        const username = curr.Username;
        if (acc[userId]) {
          acc[userId].Amount += amount;
        } else {
          acc[userId] = { UserId: userId, Amount: amount, Username: username };
        }
        return acc;
      }, {});
      return Object.values(groupedData);
    };









    const totalAmounts = groupAndSumAmounts(topFiveData);
    totalAmounts.forEach(user => {
      user.formattedAmount = user.Amount.toLocaleString('en-IN');
      console.log(`User ${user.Username} (${user.UserId}): Total Amount: ₹${user.formattedAmount}`);
    });
    const sortedData = totalAmounts.sort((a, b) => b.Amount - a.Amount);
    setProcessedData(sortedData);

    const reviewerAmounts = (data) => {
      const groupedData = data.reduce((acc, curr) => {
        const userId = curr.Reviewed_user_id;
        const amount = curr.Amount ? parseFloat(curr.Amount) : 0;
        const username = curr.ReviewedUser;
        if (acc[userId]) {
          acc[userId].Amount += amount;
        } else {
          acc[userId] = { UserId: userId, Amount: amount, Username: username };
        }
        return acc;
      }, {});
      return Object.values(groupedData);
    };

    const totalReviewerAmounts = reviewerAmounts(topFiveData);
    totalReviewerAmounts.forEach(user => {
      user.formattedAmount = user.Amount.toLocaleString('en-IN');
      console.log(`ReviewedUser ${user.Username} (${user.UserId}): Total Amount: ₹${user.formattedAmount}`);
    });
    const sortedReviewerData = totalReviewerAmounts.sort((a, b) => b.Amount - a.Amount);
    setProcessedReviewerData(sortedReviewerData);
    setButtonClicked(buttonType);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}
     refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={fetchAllData}
      tintColor="#2e3192"
    />
  }>
    
      <View style={styles.containermain}>
        {/* <View style={styles.cardimg}>
          <Image source={require('../../assets/images/Homepage_TPV.jpg')} style={styles.image} />
        </View> */}

        <View style={styles.topcards}>

          <View style={styles.dropdownContainer}>

            <Picker
              selectedValue={selectedLocation}
              onValueChange={(itemValue) => {
                setSelectedLocation(itemValue); // Update location
                fetchTopFiveData(); // Fetch top 5 data after selecting location
              }}
              style={styles.picker}
            >
              <Picker.Item label="Select Location" value="" />
              {locations.map((location) => (
                <Picker.Item key={location.LocationID} label={location.LocationName} value={location.LocationID} />
              ))}
            </Picker>
          </View>

          <TouchableOpacity
  style={{ flexDirection: 'row', alignItems: 'center',justifyContent: 'center', marginBottom: 10, }}
  onPress={() => setShowContainer(!showContainer)}
>
  <Text style={styles.title}>WEEKLY TOP RANKING MEMBERS</Text>
  <Ionicons
    name={showContainer ? 'chevron-up' : 'chevron-down'}
    size={24}
    color="black"
    style={{ marginLeft: 8 }}
  />
</TouchableOpacity>

{showContainer && (
  <>
    <View style={styles.amtBox}>
      <Text style={styles.amtLabel}>
        Total Biz Txns:
        <Text style={styles.amtValue}> ₹ {Number(totalAmount).toLocaleString('en-IN')}</Text>
      </Text>
      <TouchableOpacity
        style={styles.viewBtn}
        onPress={() => navigation.navigate('AdminTotalOfferedReceivedPage')}
      >
        <Text style={styles.viewBtnText}>View</Text>
      </TouchableOpacity>
    </View>

    <View style={styles.home}>
      <TouchableOpacity
        style={[styles.addButton, buttonClicked === 'taken' && styles.disabledButton]}
        onPress={() => handleButtonClick('given')}
      >
        <Text style={[styles.buttonText1, buttonClicked === 'taken' && styles.disabledButtonText]}>
          OFFERED
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.addButton, buttonClicked === 'given' && styles.disabledButton]}
        onPress={() => handleButtonClick('taken')}
      >
        <Text style={[styles.buttonText1, buttonClicked === 'given' && styles.disabledButtonText]}>
          RECEIVED
        </Text>
      </TouchableOpacity>
    </View>

    <View style={styles.rankingTable}>
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>#RANK</Text>
        <Text style={styles.tableHeaderText}>#AMOUNT</Text>
      </View>
      <View style={styles.container1}>
        {buttonClicked === 'given' || buttonClicked === 'taken' ? (
          renderData(buttonClicked === 'given' ? processedData : processedReviewerData)
        ) : (
          renderData(processedData)
        )}
      </View>
    </View>
  </>
)}

        </View>


<View style={styles.buttonContainer}>
          <View style={styles.leftButtons}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AdminMemberstack')}>
              <Icon name="users" size={20} color="#2e3192" style={styles.icon} />
              <Text style={styles.buttonText}>Members</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AdminLocationstack')}>
              <Feather name="map-pin" size={20} color="#2e3192" style={styles.icon} />
              <Text style={styles.buttonText}>Locations</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AdminProfessionstack')}>
              <MaterialIcons name="business-center" size={20} color="#2e3192" style={styles.icon} />
              <Text style={styles.buttonText}>Profession</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rightButtons}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('HeadAdminNewSubscribers')}>
              <Feather name="users" size={20} color="#2e3192" style={styles.icon} />
              <Text style={styles.buttonText}>New Sub</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('HeadAdminPaymentsPage')}>
              <Icon name="money" size={20} color="#2e3192" style={styles.icon} />
              <Text style={styles.buttonText}>Payments</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('HeadAdminPostPage')}>
            <Ionicons name="chatbubble-ellipses" size={20} color="#2e3192" />
              <Text style={styles.buttonText}>Post</Text>
            </TouchableOpacity>
          </View>
        </View>


                {/* Requirements Section */}
        <View style={styles.cards}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Requirements</Text>
            <TouchableOpacity onPress={() => setShowAllRequirements(!showAllRequirements)}>
              <Icons name={showAllRequirements ? "angle-up" : "angle-down"} size={24} color="#fff" style={styles.arrowIcon} />
            </TouchableOpacity>
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

        {/* Reviews Section */}
        <View style={styles.cards}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Reviews</Text>
            <TouchableOpacity onPress={() => setShowAllReviews(!showAllReviews)}>
              <Icons name={showAllReviews ? "angle-up" : "angle-down"} size={24} color="#fff" style={styles.arrowIcon} />
            </TouchableOpacity>
          </View>
          <View><Text style={styles.line}></Text></View>
          {reviewData.length > 0 ? (
            reviewData.slice(0, showAllReviews ? reviewData.length : 1).map((review, index) => (
              <View key={index} style={styles.card}>
                <View style={styles.profileSection}>
                  <Image
                    source={{ uri: profileImages[review.UserId]}}
                    style={styles.profileImage}
                  />
                </View>
                <View style={styles.requirementSection}>
                  <Text style={styles.profileName}>{review.Username}</Text>
                  <Text style={styles.requirementText}>{review.Description}</Text>
                </View>
              </View>
            ))
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

  },

  topcards: {
    // backgroundColor: 'rgba(216, 217, 248, 0.2)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 5,
    // elevation: 3,
    width: '90%',
    borderWidth:2,
    borderColor:'#2e3192',
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#2e3192',
    marginBottom: 10,
    textAlign: 'center',
  },
  home: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addButton: {
    backgroundColor: '#2e3192',
    padding: 10,
    paddingHorizontal: 40,
    borderRadius: 15,
    marginBottom: 20,
  },
  
amtBox: {
  backgroundColor: '#f0fdf4',
  padding: 12,
  borderRadius: 10,
  marginVertical: 10,
  marginHorizontal: 16,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 3,
  elevation: 3,
  flexDirection: 'row',
  alignItems: 'center',
},

amtLabel: {
  flex: 0.8,          
  fontSize: 14,
  fontWeight: '600',
  color: '#333',
},

amtValue: {
  fontSize: 16,
  fontWeight: 'bold',
  color: 'green',
},

viewBtn: {
  flex: 0.2,      
  borderWidth: 2,
  paddingVertical: 4,
  paddingHorizontal: 5,
  borderRadius:25,
  justifyContent: 'center',
  alignItems: 'center',
  borderColor: 'green',
},

viewBtnText: {
  color: 'green',
  fontSize: 14,
  fontWeight: '600',
},
  disabledButton: {
    backgroundColor:'rgb(116, 134, 190)',
  },
  disabledButtonText: {
    color: '#fff',
  },
  usernameText: {

    color: 'black',
    fontWeight: 'bold',

  },
  rankingTable: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tableHeaderText: {
    fontWeight: 'bold',
    color: '#2e3192',
  },
  container1: {
    flex: 1,
    padding: 10,
    backgroundColor: '#e4e5fd',
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
  dropdownContainer: {
    marginBottom: 10,
    paddingHorizontal:5,
    flexDirection: "row",
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#e4e5fd',
    borderRadius: 15,
  },
  dropdownLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,

  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingLeft: 10, 
    color: '#2e3192',
    
  },
  containermain: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor:'#FFF',
  },
  cards: {
    width: '90%',
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor:'#2e3192',
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
    color: '#FFF',
  },
  arrowIcon: {
    marginLeft: 10,
  },
  // addButton: {
  //   flexDirection: 'row',
  //   backgroundColor: '#2e3192',
  //   paddingVertical: 10,
  //   paddingHorizontal: 15,
  //   borderRadius: 30,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  // buttonContent: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  // },
  // iconStyle: {
  //   marginRight: 5,
  // },
  // addButtonText: {
  //   color: '#fff',
  //   fontSize: 14,
  //   fontWeight: 'bold',
  // },

  line: {
    marginVertical: 15,
    width: '100%',
    height: 1,
    backgroundColor: '#2e3192',
  },
  card: {
    flexDirection: 'row',
    backgroundColor:'rgba(240, 244, 255, 0.93)',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 16,
    color: '#2e3192',
    fontWeight: 'bold',
  },
  requirementSection: {
    marginLeft: 15,
    flex: 1,
    justifyContent: 'center',
  },
  requirementText: {
    fontSize: 14,
    color: '#100E09',
    justifyContent: 'center',
    // marginBottom: 5,
  },
  // acknowledgeButton: {
  //   backgroundColor: '#2e3192',
  //   paddingVertical: 5,
  //   paddingHorizontal: 10,
  //   borderRadius: 5,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  buttonText1: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
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
    backgroundColor: '#rgb(220, 228, 250)',
    padding: 10,
    marginTop: 15,
    marginBottom: 10,
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
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
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
    color: '#2e3192',
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
    resizeMode: 'cover',
    borderRadius: 10,
  },

  cardimg: {
    backgroundColor: '#rgba(240, 244, 255, 0.93)',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    margin: 10,
    marginBottom: 5,
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
