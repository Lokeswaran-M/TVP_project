import React, { useState ,useEffect} from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions, Alert,ActivityIndicator,ScrollView,Image, StyleSheet ,Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { API_BASE_URL } from '../constants/Config';
import { TabView, TabBar } from 'react-native-tab-view';
import { useSelector } from 'react-redux';
import styles from '../components/layout/HomeStyles';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const userId = useSelector((state) => state.user?.userId);
  const navigation = useNavigation();
  console.log('userId================dfgdfgf===================',userId);
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const API_URL = `${API_BASE_URL}/getUpcomingEvents?userId=2002`;

  const API_URL = `${API_BASE_URL}/getUpcomingEvents?userId=${userId}`;
  console.log('API_URL----------------------------',API_URL)
  const ATTENDANCE_API_URL = `${API_BASE_URL}/api/attendance`;

  console.log(API_URL)

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
    fetchEventData();
  },[]);

  const handleConfirmClick = async () => {
    if (!eventData) {
      Alert.alert('Error', 'No event data available');
      return;
    }
    try {
      const response = await fetch(ATTENDANCE_API_URL, {
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



  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
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
        <Text style={styles.headerText}>Requirements</Text>
        <TouchableOpacity
      style={styles.addButton}
      onPress={() => navigation.navigate('Requirements')}
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
      <View style={styles.card}>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: 'https://via.placeholder.com/50' }}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>Chandru</Text>
        </View>
        <View style={styles.requirementSection}>
          <Text style={styles.requirementText}>
            XXXXX x xxxx xxxxx xxxxx xxxxx x xx x xxxx xxxxxxxxx xxxxxx xx xxxx
          </Text>
          <TouchableOpacity style={styles.acknowledgeButton}>
            <Text style={styles.acknowledgeText}>Acknowledge</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
      <View style={styles.card}>
          <Image
            source={require('../../assets/images/Homepage_BMW.jpg')}
            style={styles.image}
          />
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















// import React from 'react';
// import { View, Text, StyleSheet, Button } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome'; // You can use other icon libraries

// const UpcomingMeetupCard = () => {
//   return (
//     <View style={styles.card}>
//       <Text style={styles.cardTitle}>Upcoming Business Meetup</Text>
//       <Text style={styles.meetupTime}>
//         <Icon name="calendar" size={16} color="#6A1B9A" /> 07/09/2024, 8:30 AM to 10:30 AM
//       </Text>
//       <Text style={styles.meetupLocation}>
//         <Icon name="map-marker" size={16} color="#6A1B9A" /> Urapakkam, Chennai
//       </Text>
//       <View style={styles.buttonContainer}>
//         <Button title="Click to Confirm" color="#28A745" />
//         <Button title="Click to Decline" color="#DC3545" />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: '#f3e5f5',
//     padding: 15,
//     borderRadius: 10,
//     margin: 10,
//   },
//   cardTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   meetupTime: {
//     fontSize: 14,
//     marginVertical: 5,
//     color: '#6A1B9A',
//   },
//   meetupLocation: {
//     fontSize: 14,
//     marginVertical: 5,
//     color: '#6A1B9A',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginTop: 10,
//   },
// });

// export default UpcomingMeetupCard;


















// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { useSelector } from 'react-redux';
// import { useNavigation } from '@react-navigation/native';
// const HomeScreen = () => {
//   const user = useSelector((state) => state.user);
//   const navigation = useNavigation();
  

//   return (
//     <View>
//       <Text style={styles.textBold}>ID {user?.userId}</Text>
//       <Text style={styles.textLargeBold}>Welcome, {user?.username}!</Text>
//       <Text style={styles.textNormal}>Profession: {user?.profession || 'Not provided'}</Text>
//     </View>
//   );
// };


// const styles = StyleSheet.create({
//   textBold: {
//     fontWeight: 'bold',
//     fontSize: 16, 
//   },
//   textLargeBold: {
//     fontWeight: 'bold',
//     fontSize: 24, 
//   },
//   textNormal: {
//     fontSize: 18,
//   },
// });
// export default HomeScreen;
// // export default HomeScreen;