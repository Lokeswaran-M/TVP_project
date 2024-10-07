
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, Image, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API_BASE_URL } from '../constants/Config';

const HomeScreen = () => {
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = `${API_BASE_URL}/getUpcomingEvents?userId=2002`;
  const ATTENDANCE_API_URL = `${API_BASE_URL}/api/attendance`;

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (response.ok) {
          setEventData(data.events[0]); // Assuming the first event for now
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
  }, []);

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
          UserId: 2002, // Assuming a static UserId for now, replace it with dynamic if necessary
          LocationID: eventData.LocationID || '100003', // Placeholder for LocationID
          EventId: eventData.EventId, // Dynamic EventId from the eventData
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
          <Image source={require('../../assets/images/Homepage_BMW.jpg')} style={styles.image} />
        </View>

        <View style={styles.cards}>
          <Text style={styles.dashboardTitle}>Dashboard</Text>

          {eventData && (
            <View style={styles.meetupCard}>
              <Text style={styles.meetupTitle}>Upcoming Business Meetup</Text>

              <View style={styles.row}>
                <Icon name="calendar" size={18} color="#6C757D" />
                <Text style={styles.meetupInfo}>
                  {new Date(eventData.DateTime).toLocaleDateString()}
                </Text>
                <Icon name="clock-o" size={18} color="#6C757D" />
                <Text style={styles.meetupInfo}>
                  {new Date(eventData.DateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} to 10:30 AM
                </Text>
              </View>

              <View style={styles.row}>
                <Icon name="map-marker" size={18} color="#6C757D" />
                <Text style={styles.locationText}>
                  {eventData.Place || 'Unknown Location'}
                </Text>
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmClick}>
                  <Icon name="check-circle" size={24} color="white" />
                  <Text style={styles.buttonText}>Click to Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Image source={require('../../assets/images/Homepage_BMW.jpg')} style={styles.image} />
        </View>

        <View style={styles.card}>
          <Image source={require('../../assets/images/Homepage_BMW.jpg')} style={styles.image} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  dashboardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cards: {
    paddingHorizontal: 20,
    width: '100%',
  },
  meetupCard: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  meetupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  meetupInfo: {
    marginLeft: 10,
    fontSize: 16,
    color: '#6C757D',
  },
  locationText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#6C757D',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});

export default HomeScreen;


















// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';

// const Dashboard = () => {
//   const [eventData, setEventData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Replace with your actual API URL
//   const API_URL = 'http://localhost:3000/getUpcomingEvents?userId=2002';

//   useEffect(() => {
//     const fetchEventData = async () => {
//       try {
//         const response = await fetch(API_URL);
//         const data = await response.json();

//         if (response.ok) {
//           setEventData(data.events[0]); // Assuming the API returns an array of events
//         } else {
//           setError(data.error);
//         }
//       } catch (err) {
//         setError('Failed to fetch data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEventData();
//   }, []);

//   if (loading) {
//     return <ActivityIndicator size="large" color="#0000ff" />;
//   }

//   if (error) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>Error: {error}</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.cards}>
//       <Text style={styles.dashboardTitle}>Dashboard</Text>

//       {eventData && (
//         <View style={styles.meetupCard}>
//           <Text style={styles.meetupTitle}>Upcoming Business Meetup</Text>

//           <View style={styles.row}>
//             <Icon name="calendar" size={18} color="#6C757D" />
//             <Text style={styles.meetupInfo}>{new Date(eventData.DateTime).toLocaleDateString()}</Text>
//             <Icon name="clock-o" size={18} color="#6C757D" />
//             <Text style={styles.meetupInfo}>
//               {new Date(eventData.DateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} to 10:30 AM
//             </Text>
//           </View>

//           <View style={styles.row}>
//             <Icon name="map-marker" size={18} color="#6C757D" />
//             <Text style={styles.locationText}>{eventData.Place || 'Unknown Location'}</Text>
//           </View>

//           <View style={styles.buttonRow}>
//             <TouchableOpacity style={styles.confirmButton}>
//               <Icon name="check-circle" size={24} color="white" />
//               <Text style={styles.buttonText}>Click to Confirm</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       )}
//     </View>
//   );
// };





// const styles = StyleSheet.create({
//   cards:{ 
//     padding: 16,
//      backgroundColor: '#f8f9fa'
//      },
//   dashboardTitle: { 
//     fontSize: 24,
//      fontWeight: 'bold', 
//      marginBottom: 16
//      },
//   meetupCard: {
//      padding: 16, 
//      backgroundColor: '#fff',
//       borderRadius: 8,
//       elevation: 2 },
//   meetupTitle: {
//      fontSize: 18, 
//      fontWeight: 'bold', 
//      marginBottom: 8 },
//   row: {
//      flexDirection: 'row', 
//      alignItems: 'center',
//       marginBottom: 8
//      },
//   meetupInfo: { 
//     marginLeft: 8, 
//     fontSize: 16, 
//     color: '#6C757D' 
//   },
//   locationText: { 
//     marginLeft: 8, 
//     fontSize: 16, 
//     color: '#6C757D' 
//   },
//   buttonRow: {
//      marginTop: 16, 
//      flexDirection: 'row', 
//      justifyContent: 'center' 
//     },
//   confirmButton: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     backgroundColor: '#28a745', 
//     padding: 10, 
//     borderRadius: 5
//    },
//   buttonText: { 
//     color: 'white', 
//     marginLeft: 8,
//      fontSize: 16 
//     },
//   errorContainer: { 
//     padding: 16, 
//     justifyContent: 'center',
//      alignItems: 'center' },
//      errorText: {
//      fontSize: 18, 
//      color: 'red' 
//     },
// });

// export default Dashboard;
