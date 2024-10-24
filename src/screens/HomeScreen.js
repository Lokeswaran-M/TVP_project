import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Alert,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API_BASE_URL } from '../constants/Config';
import { TabView, TabBar } from 'react-native-tab-view';
import { useSelector } from 'react-redux';
import styles from '../components/layout/HomeStyles';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = ({ route }) => {
  const userId = useSelector((state) => state.user?.userId);
  const navigation = useNavigation();
  const { chapterType } = route.params;
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requirementsData, setRequirementsData] = useState([]);
  const [requirementsLoading, setRequirementsLoading] = useState(true);
  const [requirementsError, setRequirementsError] = useState(null);
  const [showAllRequirements, setShowAllRequirements] = useState(false);

  const API_URL = `${API_BASE_URL}/getUpcomingEvents?userId=${userId}`;

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (response.ok) {
          setEventData(data.events[0]);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    const fetchRequirementsData = async () => {
      try {
        const locationId = route.params.locationId;
        const slots = chapterType;

        const response = await fetch(`${API_BASE_URL}/requirements?LocationID=${locationId}&Slots=${slots}&UserId=${userId}`);
        const data = await response.json();
        console.log("Requirements Details in the Home page----------------------------", data);

        if (response.ok) {
          setRequirementsData(data);
        } else {
          setRequirementsError(data.error);
        }
      } catch (err) {
        setRequirementsError('Failed to fetch requirements');
      } finally {
        setRequirementsLoading(false);
      }
    };
    fetchEventData();
    fetchRequirementsData();
  }, [userId, route.params.locationId]);

  const handleConfirmClick = async () => {
    if (!eventData) {
      Alert.alert('Error', 'No event data available');
      return;
    }
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UserId: userId,
          LocationID: eventData.LocationID || '100003',
          EventId: eventData.EventId,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Attendance confirmed successfully');
      } else {
        Alert.alert('Error', data.error || 'Failed to confirm attendance');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Network or server issue');
    }
  };
  const handleAcknowledgeClick = async (requirement) => {
    try {
      const response = await fetch(`${API_BASE_URL}/requirements`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          acknowledgedUserId: requirement.UserId,
          LocationID: route.params.locationId,
          Slots: chapterType,
        }),
      });
      const data = await response.json();
      console.log("Data for ack------------------------------", data);
  
      if (response.ok) {
        Alert.alert('Success', 'Requirement acknowledged successfully');
      } else {
        Alert.alert('Error', data.error || 'Failed to acknowledge requirement');
      }
    } catch (error) {
      console.error("Acknowledge Error:", error);
      Alert.alert('Error', 'Network or server issue');
    }
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
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.card}>
          <Image
            source={require('../../assets/images/Homepage_BMW.jpg')}
            style={styles.image}
          />
        </View>
        <View style={styles.cards}>
          <Text style={styles.dashboardTitle}>Dashboard</Text>

          {eventData ? (
            <View style={styles.meetupCard}>
              <Text style={styles.meetupTitle}>Upcoming Business Meetup</Text>
              <View style={styles.row}>
                <Icon name="calendar" size={18} color="#6C757D" />
                <Text style={styles.meetupInfo}>
                  {new Date(eventData.DateTime).toLocaleDateString()}
                </Text>
                <Icon name="clock-o" size={18} color="#6C757D" />
                <Text style={styles.meetupInfo}>
                  {new Date(eventData.DateTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>

              <View style={styles.row}>
                <Icon name="map-marker" size={18} color="#6C757D" />
                <Text style={styles.locationText}>{eventData.Place || 'Unknown Location'}</Text>
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmClick}>
                  <Icon name="check-circle" size={24} color="#28A745" />
                  <Text style={styles.buttonText}>Click to Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.noMeetupCard}>
              <Text style={styles.noMeetupText}>No Upcoming Business Meetups</Text>
            </View>
          )}
        </View>
        
        <View style={styles.cards}>
        <View style={styles.header}>
        <View style={styles.headerRow}>
  <Text style={styles.headerText}>Requirements</Text>
  <TouchableOpacity onPress={() => setShowAllRequirements(!showAllRequirements)}>
    <Icon name={showAllRequirements ? "angle-up" : "angle-down"} size={24} color="#a3238f" style={styles.arrowIcon} />
  </TouchableOpacity>
</View>
  <TouchableOpacity
    style={styles.addButton}
    onPress={() => navigation.navigate('Requirements', {
      businessName: route.title,
      locationId: route.params.locationId,
      chapterType: route.params.chapterType,
    })}
  >
    <View style={styles.buttonContent}>
      <Icon name="plus-square-o" size={20} color="#fff" style={styles.iconStyle} />
      <Text style={styles.addButtonText}>Add Requirement</Text>
    </View>
  </TouchableOpacity>
</View>
          
          <View>
            <Text style={styles.line}>
              ________________________________________________
            </Text>
          </View>
          {requirementsData.length > 0 ? (
  <>
    {requirementsData.slice(0, showAllRequirements ? requirementsData.length : 1).map((requirement, index) => (
      <View key={index} style={styles.card}>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: 'https://via.placeholder.com/50' }}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>{requirement.Username}</Text>
        </View>
        <View style={styles.requirementSection}>
          <Text style={styles.requirementText}>{requirement.Description}</Text>
          <TouchableOpacity 
            style={styles.acknowledgeButton} 
            onPress={() => handleAcknowledgeClick(requirement)}>
            <Text style={styles.acknowledgeText}>Acknowledge</Text>
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
        </View>
      </View>
    </ScrollView>
  );
};
export default function TabViewExample({ navigation }) {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([]);
  const userId = useSelector((state) => state.user?.userId);
  const [businessInfo, setBusinessInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchBusinessInfo = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/user/business-infodrawer/${userId}`);
        const data = await response.json();
        console.log("Data in the Home Screen Drawer-----------------------------",data);

        if (response.ok) {
          const updatedRoutes = data.map((business, index) => ({
            key: `business${index + 1}`,
            title: business.BD,
            chapterType: business.CT,
            locationId: business.L,
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
    return (
      <HomeScreen
        title={route.title}
        chapterType={business?.CT}
        locationId={business?.L}
        userId={userId}
        navigation={navigation}
        route={{ 
          ...route, 
          params: { 
            locationId: business?.L, 
            chapterType: business?.CT 
          } 
        }}
      />
    );
  };
  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: '#A3238F' }}
      style={{ backgroundColor: '#F3ECF3' }}
      activeColor="#A3238F"
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