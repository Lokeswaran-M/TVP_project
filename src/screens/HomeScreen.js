import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Alert, 
  ActivityIndicator,
  Modal, 
  ScrollView,
  Image,
  Platform,
  RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { API_BASE_URL } from '../constants/Config';
import { TabView, TabBar } from 'react-native-tab-view';
import { useSelector } from 'react-redux';
import styles from '../components/layout/HomeStyles';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import Subscription from './Subscription';
import { showMessage } from 'react-native-flash-message'; 
import Stars from '../screens/Stars';
import profileImage from '../../assets/images/DefaultProfile.jpg';
import AsyncStorage from '@react-native-async-storage/async-storage';
const PRIMARY_COLOR = '#2e3091';
const HomeScreen = ({ route }) => {
  const userId = useSelector((state) => state.UserId);
  const navigation = useNavigation();
  const [isConfirmed, setIsConfirmed] = useState({});
  const [topFiveData, setTopFiveData] = useState([]);
  const [topFiveerror, settopFiveError] = useState(null);
  const [showAlltopFive, setShowAlltopFive] = useState(false);
  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [profileImages, setProfileImages] = useState({});
  const [requirementsData, setRequirementsData] = useState([]);
  const [requirementsLoading, setRequirementsLoading] = useState(true);
  const [requirementsError, setRequirementsError] = useState(null);
  const [showAllRequirements, setShowAllRequirements] = useState(false);
  const [reviewsData, setReviewsData] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [processedData, setProcessedData] = useState([]);
  const [processedReviewerData, setProcessedReviewerData] = useState([]);
  const [buttonClicked, setButtonClicked] = useState('given');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    Promise.all([
      fetchTopFiveData(),
      fetchEventData(),
      refreshRequirements(),
      fetchReviewsData()
    ]).finally(() => {
      setRefreshing(false);
    });
  }, [route.params.locationId, userId]);

  const refreshRequirements = async () => {
    setRequirementsLoading(true);
    try {
      const locationId = route.params.locationId;
      console.log("Requesting Requirements with params:", { locationId, userId });
      const response = await fetch(`${API_BASE_URL}/requirements?LocationID=${locationId}&UserId=${userId}`);
      const data = await response.json();
      if (response.ok) {
        console.log("Requirements Data received:", data);
        setRequirementsData(data);
      } else {
        console.error("Requirements Error:", data.error);
        setRequirementsError(data.error);
      }
    } catch (err) {
      console.error("Failed to refresh requirements:", err);
      setRequirementsError('Failed to refresh requirements');
    } finally {
      setRequirementsLoading(false);
    }
  };
const getUserInfo = async () => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    const rollId = await AsyncStorage.getItem('rollId');
    console.log('Retrieved User ID:', userId);
    console.log('Retrieved Roll ID:', rollId);
    return { userId, rollId };
  } catch (error) {
    console.error('Error retrieving user info from AsyncStorage:', error);
  }
};
useEffect(() => {
  const fetchUserInfo = async () => {
    const { userId, rollId } = await getUserInfo();
    console.log('User ID:', userId);
    console.log('Roll ID:', rollId);
  };

  fetchUserInfo();
}, []);
  const fetchProfileImage = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/profile-image?userId=${userId}`);
      const data = await response.json();
      const uniqueImageUrl = `${data.imageUrl}?t=${new Date().getTime()}`;
      if (response.ok) {
        setProfileImages((prevImages) => ({ ...prevImages, [userId]: uniqueImageUrl }));
      } else {
        console.error(`Failed to fetch profile image for UserId ${userId}`);
      }
    } catch (error) {
      console.error(`Error fetching profile image for UserId ${userId}:`, error);
    }
  };

  const requestNotificationPermissions = () => {
    messaging().requestPermission()
      .then(authStatus => {
        console.log('Permission status:', authStatus);
      })
      .catch(error => console.error('Permission request failed:', error));
  };

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', remoteMessage);
      if (Platform.OS === 'android') {
        PushNotification.localNotification({
          title: remoteMessage.notification?.title,
          message: remoteMessage.notification?.body,
          bigText: remoteMessage.notification?.body,
          channelId: 'default-channel',
          smallIcon: 'ic_notification',
          largeIcon: '',
          color: PRIMARY_COLOR,
        });
      } else {
        showMessage({
          message: remoteMessage.notification?.title,
          description: remoteMessage.notification?.body,
          type: 'info',
          backgroundColor: PRIMARY_COLOR,
          color: '#fff',
        });
      }
    });
    return unsubscribe;
  }, []);  

  useEffect(() => {
    requestNotificationPermissions();
    
    const dataArrays = [requirementsData, reviewsData, processedData, processedReviewerData];
    dataArrays.forEach((dataArray) => {
      if (dataArray.length > 0) {
        dataArray.forEach((data) => {
          if (data.UserId) {
            fetchProfileImage(data.UserId);
          }
          if (data.Reviewed_user_id) {
            fetchProfileImage(data.Reviewed_user_id);
          }
        });
      }
    });
  }, [requirementsData, reviewsData, processedData, processedReviewerData]);  

  const fetchTopFiveData = async () => {
    try {
      const locationId = route.params.locationId;
      const response = await fetch(`${API_BASE_URL}/TopFive?locationId=${locationId}`);
      const data = await response.json();
      console.log("Top Five Data received:=====================", data);
      if (response.ok) {
        setTopFiveData(data);
      } else {
        settopFiveError(data.error);
      }
    } catch (err) {
      console.error("Error fetching data", err);
      settopFiveError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };    

  const fetchEventData = async () => {
    try {
      const locationId = route.params.locationId;
      const response = await fetch(`${API_BASE_URL}/getUpcomingEvents?LocationID=${locationId}&UserId=${userId}`);
      const data = await response.json();
      if (response.ok) {
        setEventData(data.events || []);
      } else {
        setEventData([]);
      }
    } catch (err) {
      console.error("Error fetching data", err);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };   

  const fetchReviewsData = async () => {
    try {
      const locationId = route.params.locationId;
      const response = await fetch(`${API_BASE_URL}/reviewView?locationId=${locationId}&UserId=${userId}`);
      const data = await response.json();
      if (response.ok) {
        setReviewsData(data);
      } else {
        setReviewsError(data.error);
      }
    } catch (err) {
      setReviewsError('Failed to fetch reviews');
    } finally {
      setReviewsLoading(false);
    }
  };  

  useEffect(() => {
    fetchTopFiveData();
    fetchEventData();
    refreshRequirements();
    fetchReviewsData();
  }, [userId, route.params.locationId]);

  useEffect(() => {
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
    });
    const sortedData = totalAmounts.sort((a, b) => b.Amount - a.Amount);
    setProcessedData(sortedData);
  }, [topFiveData]);

  useEffect(() => {
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
    const totalAmounts = reviewerAmounts(topFiveData);
    totalAmounts.forEach(user => {
      user.formattedAmount = user.Amount.toLocaleString('en-IN');
    });
    const sortedAmounts = totalAmounts.sort((a, b) => b.Amount - a.Amount);
    setProcessedReviewerData(sortedAmounts);
  }, [topFiveData]);   
  const handleButtonClick = (buttonType) => {
    setButtonClicked(buttonType);
  };
  const handleConfirmClick = async (eventId, locationId) => {
        setIsConfirmed((prevState) => ({ ...prevState, [eventId]: true }));
        setModalVisible(false);
        try {
          const profession = route.title;
          console.log("Profession for pre attendence-----------------------",profession);
          const response = await fetch(`${API_BASE_URL}/api/Preattendance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              UserId: userId,
              LocationID: locationId,
              EventId: eventId,
              Profession: profession,
            }),
          });
          const data = await response.json();
          if (response.ok) {
            console.log("Attendance confirmed successfully");
          } else {
            Alert.alert('Error', data.error || 'Failed to confirm attendance');
          }
        } catch (error) {
          console.error("Network or server error:", error);
          Alert.alert('Error', 'Network or server issue. Please try again later.');
        }
      };  
      const hideModal = () => setModalVisible(false);
      const handleAcknowledgeClick = async (requirement) => {
        setShowModal(false);
        try {
          const profession = route.title;
          console.log("Profession for pre attendence-----------------------",profession);
          const response = await fetch(`${API_BASE_URL}/requirements`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              Id: requirement.Id,
              userId: userId,
              acknowledgedUserId: requirement.UserId,
              LocationID: route.params.locationId,
              Id: requirement.Id,
              Profession: profession,
            }),
          });
          const data = await response.json();
          console.log("Data in the requirement homescreen---------------------", data);
          if (response.ok) {
            Alert.alert('Success', 'Requirement acknowledged successfully');
            refreshRequirements();
            const acknowledgeResponse = await fetch(`${API_BASE_URL}/acknowledge`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                acknowledgedBy: userId,
                userId: requirement.UserId,
              }),
            });
            const acknowledgeData = await acknowledgeResponse.json();
            console.log("Acknowledge Data-----------------------------",acknowledgeData);
          } else {
            Alert.alert('Error', data.error || 'Failed to acknowledge requirement');
          }
        } catch (error) {
          console.error('Acknowledge Error:', error);
          Alert.alert('Error', 'Network or server issue');
        }
      };   
      const renderData = (data) => {
        return data.length > 0 ? (
          data.map((item) => (
            <View key={item.UserId} style={styles.userContainer}>
              <Image 
                source={profileImages[item.UserId] ? { uri: profileImages[item.UserId] } : profileImage} 
                style={styles.profileImage} 
              />
              <Text style={styles.usernameText}>{item.Username}</Text>
              <Text style={styles.amountText}>₹{item.formattedAmount}</Text>
            </View>
          ))
        ) : (
          <Text>No data found</Text>
        );
      };           
  if (loading || requirementsLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }
  if (requirementsError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Requirements Error: {requirementsError}</Text>
      </View>
    );
  }
  return (
       <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={PRIMARY_COLOR}
        />
      }
    >
      <View style={styles.container}>
         {/* <View style={styles.headerContainer}>
          <View style={styles.headerLeft} />
          <TouchableOpacity 
            style={styles.refreshButton} 
            onPress={onRefresh}
            disabled={refreshing}
          >
            <Icon 
              name="refresh" 
              size={20} 
              color={PRIMARY_COLOR} 
              style={styles.refreshIcon} 
            />
          </TouchableOpacity>
        </View> */}
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
        {/* =======================Meetings=========================== */}
        <View style={styles.cards}>
      <View style={styles.dashboardContainer}>
        <Text style={styles.dashboardTitle}>Dashboard</Text>
        <TouchableOpacity onPress={() => setShowAllEvents(!showAllEvents)}>
          <Icon name={showAllEvents ? "angle-up" : "angle-down"} size={24} color="#2e3091" style={styles.arrowIcon} />
        </TouchableOpacity>
      </View>

      {eventData.length > 0 ? (
        eventData.slice(0, showAllEvents ? eventData.length : 1).map((event) => {
          const eventTime = new Date(event.DateTime);
          const currentTime = new Date();
          const timeDifference = eventTime - currentTime; 
          const twelveHoursInMs = 12 * 60 * 60 * 1000; 
          const isWithin12Hours = timeDifference < twelveHoursInMs;

          return (
            <View key={event.EventId} style={styles.meetupCard}>
              <Text style={styles.meetupTitle}>Upcoming Business Meetup</Text>
              <View style={styles.row}>
                <Icon name="calendar" size={18} color="#6C757D" />
                <Text style={styles.meetupInfo}>
                  {eventTime.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </Text>
                <Icon name="clock-o" size={18} color="#6C757D" />
                <Text style={styles.meetupInfo}>
                  {eventTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
              <View style={styles.row}>
                <Icon name="map-marker" size={18} color="#6C757D" />
                <Text style={styles.locationText}>{event.Place || 'Unknown Location'}</Text>
              </View>
              <View>
                <Text style={styles.note}>Note: You cannot confirm the event if it is within 12 hours.</Text>
              </View>
              <View style={styles.buttonRow}>
                {event.TimeDifferenceGreaterThan12 === 1 && (
                  <TouchableOpacity
                    style={[
                      styles.confirmButton,
                      isConfirmed[event.EventId] || event.Isconfirm === 1 || isWithin12Hours ? styles.disabledButton : null,
                    ]}
                    onPress={() => {
                      if (!isConfirmed[event.EventId] && !event.Isconfirm && !isWithin12Hours) {
                        setSelectedEvent(event);
                        setModalVisible(true);
                      }
                    }}
                    disabled={isConfirmed[event.EventId] || event.Isconfirm === 1 || isWithin12Hours}
                  >
                    <Icon
                      name="check-circle"
                      size={24}
                      color={isConfirmed[event.EventId] || event.Isconfirm === 1 || isWithin12Hours ? "#B0B0B0" : "#28A745"} 
                    />
                    <Text style={styles.buttonText}>
                      {isConfirmed[event.EventId] || event.Isconfirm === 1 || isWithin12Hours
                        ? "Confirmed"
                        : "Click to Confirm"}
                    </Text>
                  </TouchableOpacity>
                )}
                {isWithin12Hours && (
                  <View style={styles.confirmButton}>
                    <Icon name="check-circle" size={24} color="#e86d6c" />
                    <Text style={styles.disabledText}>Disabled</Text>
                  </View>
                )}
              </View>
              <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={hideModal}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContainer}>
                    <Text style={styles.modalText}>Are you sure you want to confirm this event?</Text>
                    <View style={styles.modalButtonContainer}>
                      <TouchableOpacity
                        style={styles.modalButton}
                        onPress={hideModal}
                      >
                        <Text style={styles.modalButtonText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.modalButton}
                        onPress={() => handleConfirmClick(selectedEvent.EventId, selectedEvent.LocationID)}
                      >
                        <Text style={styles.modalButtonText}>OK</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            </View>
          );
        })
      ) : (
        <View style={styles.noMeetupCard}>
          <Text style={styles.noMeetupText}>No Upcoming Business Meetups</Text>
        </View>
      )}
    </View>
        {/* ===============================Requirements=============================== */}
        <View style={styles.cards}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerText}>Requirements</Text>
          <TouchableOpacity onPress={() => setShowAllRequirements(!showAllRequirements)}>
            <Icon
              name={showAllRequirements ? "angle-up" : "angle-down"}
              size={24}
              color="#2e3091"
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            navigation.navigate("Requirements", {
              Profession: route.title,
              locationId: route.params.locationId,
            })
          }
        >
          <View style={styles.buttonContent}>
            <Icon name="plus-square-o" size={20} color="#fff" style={styles.iconStyle} />
            <Text style={styles.addButtonText}>Add Requirement</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.line}>____________________________</Text>
      </View>
      {requirementsData.length > 0 ? (
        <>
          {requirementsData.slice(0, showAllRequirements ? requirementsData.length : 1).map((requirement, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.profileSection}>
                <Image
                  source={profileImages[requirement.UserId] ? { uri: profileImages[requirement.UserId] } : profileImage}
                  style={styles.profileImage}
                />
                <Text style={styles.profileName}>{requirement.Username}</Text>
              </View>
              <View style={styles.requirementSection}>
                <Text style={styles.requirementText}>{requirement.Description}</Text>
                <TouchableOpacity
                  style={[
                    styles.acknowledgeButton,
                    requirement.IsAcknowledged === 1 ? styles.disabledButton1 : null,
                  ]}
                  onPress={() => {
                    setSelectedRequirement(requirement);
                    setShowModal(true);
                  }}
                  disabled={requirement.IsAcknowledged === 1}
                >
                  <Text style={styles.buttonText1}>
                    {requirement.IsAcknowledged === 1 ? "Acknowledged" : "Acknowledge"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </>
      ) : (
        <View style={styles.noMeetupCard}>
          <Text style={styles.noMeetupText}>No Requirements Available</Text>
        </View>
      )}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer1}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to acknowledge this requirement?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonOK}
                onPress={() => handleAcknowledgeClick(selectedRequirement)}
              >
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    
  
        </View>
        {/* ===================================Reviews================================== */}
        <View style={styles.cards}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerText}>Reviews</Text>
          <TouchableOpacity onPress={() => setShowAllReviews(!showAllReviews)}>
            <Icon name={showAllReviews ? "angle-up" : "angle-down"} size={24} color="#2e3091" style={styles.arrowIcon} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('Review', {
            businessName: route.title,
            locationId: route.params.locationId,
          })}
        >
          <View style={styles.buttonContent}>
            <Icon name="pencil" size={16} color="#fff" style={styles.iconStyle} />
            <Text style={styles.addButtonText}>Business Offer / Review</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View>
        <Text style={styles.line}>____________________________</Text>
      </View>

      {reviewsLoading ? (
  <Text>Loading reviews...</Text>
) : reviewsError ? (
  <Text style={styles.errorText}>{reviewsError}</Text>
) : reviewsData.length > 0 ? (
  <>
    {reviewsData.slice(0, showAllReviews ? reviewsData.length : 1).map((review, index) => (
      <View key={index} style={styles.card}>
        <View style={styles.profileSection}>
          <Image
            source={profileImages[review.Reviewed_user_id] ? { uri: profileImages[review.Reviewed_user_id] } : profileImage}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.profileName}>{review.ReviewedUsername}</Text>
            <Stars averageRating={review.Stars} />
          </View>
        </View>
        <View style={styles.requirementSection}>
        <Text style={styles.requirementText}>
            {review.Description} 
          </Text>
          {review.Amount !== null && (
  <Text style={styles.requirementText}>
    {new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(review.Amount)}
  </Text>
)}
          <Text style={styles.rating}>Reviewed By {review.ReviewerUsername} for {review.RatingName}</Text>
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
        {/* ================================================ */}
      </View>
    </ScrollView>
  );
};
export default function TabViewExample({ navigation }) {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([]);
  const userId = useSelector((state) => state.UserId);
  const [businessInfo, setBusinessInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchBusinessInfo = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/user/business-infodrawer/${userId}`);
        const data = await response.json();
        console.log("Data in the Home Screen Drawer-----------------------------", data);
        if (response.ok) {
          const updatedRoutes = data.map((business, index) => ({
            key: `business${index + 1}`,
            title: business.BD,
            locationId: business.L,
            isPaid: business.IsPaid,
          }));
          setRoutes(updatedRoutes);
          setBusinessInfo(data);
        } else {
          console.error('Error fetching business info:', data.message);
        }
      } catch (error) {
        console.error('API call error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinessInfo();
  }, [userId]);
  const renderScene = ({ route }) => {
    const business = businessInfo.find((b) => b.BD === route.title);
    if (business?.IsPaid === 0) {
      return <Subscription 
      navigation={navigation}
      route={{ 
        ...route, 
        params: { 
          locationId: business?.L, 
          Profession: business?.BD 
        } 
      }} />;
    }
    return (
      <HomeScreen
        title={route.title}
        locationId={business?.L}
        userId={userId}
        navigation={navigation}
        route={{ 
          ...route, 
          params: { 
            locationId: business?.L, 
          } 
        }}
      />
    );
  };
  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: '#2e3091' }}
      style={{ backgroundColor: '#f5f7ff' }}
      activeColor="#2e3091"
      inactiveColor="gray"
      labelStyle={{ fontSize: 14 }}
    />
  );
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={renderTabBar}
    />
  );
}