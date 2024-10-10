import React, { useState ,useEffect} from 'react';
import { View, Text, TouchableOpacity, Alert,ActivityIndicator,ScrollView,Image, StyleSheet ,Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { API_BASE_URL } from '../constants/Config';
import { useSelector } from 'react-redux';


const HomeScreen = () => {
  const userId = useSelector((state) => state.user?.userId);
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

            {eventData && (
        <View style={styles.meetupCard}>
          <Text style={styles.meetupTitle}>Upcoming Business Meetup</Text>

          <View style={styles.row}>
            <Icon name="calendar" size={18} color="#6C757D" />
            <Text style={styles.meetupInfo}>{new Date(eventData.DateTime).toLocaleDateString()}</Text>
            <Icon name="clock-o" size={18} color="#6C757D" />
            <Text style={styles.meetupInfo}>
              {new Date(eventData.DateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
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
      )}
    </View>

      <View style={styles.header}>
        <Text style={styles.headerText}>Requirements</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add Requirement</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: 'https://via.placeholder.com/50' }} // Replace with actual image link
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>Chandru</Text>
        </View>

        <View style={styles.requirementSection}>
          <Text style={styles.requirementText}>
            X XXXXX XXX X XXXXX XXXXXXXXXXXX XXX XXXXXXXXXXXXXX XXXXX X XXXXX
          </Text>
          <TouchableOpacity style={styles.acknowledgeButton}>
            <Text style={styles.acknowledgeText}>Acknowledge</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* <View style={styles.pagination}>
        <View style={styles.activeDot} />
        <View style={styles.inactiveDot} />
        <View style={styles.inactiveDot} />
      </View> */}
    </View>

        <View style={styles.card}>
          <Image
            source={require('../../assets/images/Homepage_BMW.jpg')}
            style={styles.image}
          />
        </View>
      

    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F5F5F5',
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
  image: {
    width: '100%',
    height: 130, 
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
  dashboardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  meetupCard: {
    backgroundColor: '#f0e1eb',
    borderRadius: 10,
    padding: 15,
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
    marginTop: 15,
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
  buttonText: {
    color: '#a3238f',
    marginLeft: 5,
    fontSize: 14,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7E3F8F',
  },
  card: {
    backgroundColor: '#F6EDF7',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#A83893',
    top: 5,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },

  acknowledgeButton: {
    position: 'absolute',
    top: -30,
    right: 0,
    backgroundColor: '#A83893',
    paddingVertical: 5,
    paddingHorizontal: 12,
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















});

export default HomeScreen;















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