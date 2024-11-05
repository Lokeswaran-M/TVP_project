import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import RNFS from 'react-native-fs';
import { PERMISSIONS, request, check, RESULTS, openSettings } from 'react-native-permissions';

const CreateMeetingViewPage = ({ route, navigation }) => {
  const { userId, eventId, location, slotId, dateTime } = route.params;
  const qrCodeRef = useRef(null);

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      const status = await check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
      
      if (status === RESULTS.GRANTED) {
        return true; // Permission granted
      } else if (status === RESULTS.DENIED) {
        const result = await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
        return result === RESULTS.GRANTED; // Check if permission granted after request
      } else if (status === RESULTS.BLOCKED) {
        Alert.alert(
          'Permission Denied',
          'Storage permission is required to save the QR Code. Please enable it in settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => openSettings() },
          ],
        );
        return false; // Permission blocked
      }
    }
    return true; // iOS doesn’t need explicit storage permission
  };

  const downloadQRCode = async () => {
    const hasPermission = await requestStoragePermission();

    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Storage permission is required to save the QR Code.');
      return;
    }

    if (qrCodeRef.current) {
      qrCodeRef.current.toDataURL((data) => {
        if (!data) {
          Alert.alert('Error', 'Failed to generate QR Code data.');
          return;
        }

        const filePath = `${RNFS.ExternalStorageDirectoryPath}/event_qrcode.png`;
        RNFS.writeFile(filePath, data, 'base64')
          .then(() => {
            Alert.alert('Success', `QR Code saved to: ${filePath}`);
            console.log(`QR code saved at: ${filePath}`);
          })
          .catch((error) => {
            Alert.alert('Error', 'Failed to save QR Code');
            console.error('Error saving QR code:', error);
          });
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>Date and Time:</Text>
        <Text style={styles.value}>{new Date(dateTime).toLocaleString()}</Text>
        <Text style={styles.label}>Location:</Text>
        <Text style={styles.value}>{location}</Text>
        <Text style={styles.label}>Event ID:</Text>
        <Text style={styles.value}>{eventId}</Text>
        
        <View style={styles.qrContainer}>
          <QRCode value={String(eventId)} size={150} getRef={qrCodeRef} />
        </View>

        <TouchableOpacity style={styles.downloadButton} onPress={downloadQRCode}>
          <Text style={styles.downloadButtonText}>Download QR Code</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity style={styles.oneminButton} onPress={() => navigation.navigate('OneMinPresentation', { userId, eventId, location, slotId, dateTime })}>
          <Text style={styles.downloadButtonText}>One Min Presentation</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  content: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    width: '80%',
    alignItems: 'center',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#a3238f',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    marginBottom: 15,
    color: '#555',
  },
  qrContainer: {
    marginVertical: 20,
  },
  downloadButton: {
    backgroundColor: '#a3238f',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },

  oneminButton:{
    backgroundColor: '#a3238f',
    padding: 10,
    borderRadius: 5,
    marginTop: 50,
  },
  downloadButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CreateMeetingViewPage;



// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';

// const CreateMeetingViewPage = ({ route }) => {
//   const { userId, eventId, location, slotId, dateTime } = route.params;

//   return (
//     <View style={styles.container}>
//       <View style={styles.content}>
//         {/* <Text style={styles.label}>User ID:</Text>
//         <Text style={styles.value}>{userId}</Text> */}
//         <Text style={styles.label}>Date and Time:</Text>
//         <Text style={styles.value}>{new Date(dateTime).toLocaleString()}</Text>
   

//         <Text style={styles.label}>Location:</Text>
//         <Text style={styles.value}>{location}</Text>

//         {/* <Text style={styles.label}>Slot ID:</Text>
//         <Text style={styles.value}>{slotId}</Text> */}
//      <Text style={styles.label}>Event ID:</Text>
//         <Text style={styles.value}>{eventId}</Text>
    
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center', // Centers vertically
//     alignItems: 'center',      // Centers horizontally
//     backgroundColor: '#f2f2f2', // Background color (optional)
//   },
//   content: {
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 10,
//     elevation: 5,  // Shadow on Android
//     shadowColor: '#000', // Shadow on iOS
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.8,
//     shadowRadius: 3,
//     width: '80%', // Optional: set a fixed width
//   },
//   label: {
//     fontWeight: 'bold',
//     fontSize: 16,
//     color: '#333',
//     marginBottom: 5,
//   },
//   value: {
//     fontSize: 16,
//     marginBottom: 15,
//     color: '#555',
//   },
// });

// export default CreateMeetingViewPage;
