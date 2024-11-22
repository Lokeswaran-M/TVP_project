import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  PermissionsAndroid,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { RNCamera as BarCodeScanner } from 'react-native-camera';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API_BASE_URL } from '../constants/Config';
import { useSelector } from 'react-redux';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const isPortrait = height > width;

const Scanner = ({ navigation }) => {
  const cameraRef = useRef(null);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const scanningRef = useRef(true);

  const userId = useSelector((state) => state.user?.userId);

  const handleFlashToggle = () => {
    setIsFlashOn((prev) => !prev);
  };

  const handleQRCodeScan = async ({ data }) => {
    if (!scanningRef.current || !isScanning) return;
    scanningRef.current = false;

    const [eventId, locationId, slotId] = data.split('_');

    if (!eventId || !locationId || !slotId) {
      Alert.alert('Error', 'Invalid QR Code format');
      setIsScanning(true);
      scanningRef.current = true;
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/Postattendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          eventId,
          locationId,
          slotId,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Attendance recorded successfully');
      } else {
        Alert.alert('Error', result.message || 'Failed to record attendance');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setIsScanning(false); // Disable scanning to stop the camera
      scanningRef.current = true;
    }
  };

  const openQRScanner = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs access to your camera to scan QR codes',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setIsScanning(true);
        } else {
          Alert.alert('Permission Denied', 'Camera access is required to scan QR codes.');
        }
      } catch (error) {
        console.log('Error requesting camera permission:', error);
      }
    } else {
      setIsScanning(true);
    }
  };

  useEffect(() => {
    openQRScanner(); // Ensure permission is asked when the component mounts
    return () => {
      setIsScanning(false); // Clean up when unmounting
    };
  }, []);

  return (
    <View style={styles.container}>
      {isScanning ? (
        <View style={styles.qrScannerContainer}>
          <BarCodeScanner
            ref={cameraRef}
            style={styles.qrScanner}
            onBarCodeRead={handleQRCodeScan}
            flashMode={isFlashOn ? 'torch' : 'off'}
          />
          <TouchableOpacity style={styles.flashButton} onPress={handleFlashToggle}>
            <Icon name="lightbulb-o" size={40} color={isFlashOn ? 'yellow' : 'gray'} />
            <Text style={styles.tourchtext}>{isFlashOn ? 'Torch On' : 'Torch Off'}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.scannedMessageContainer}>
          <Text style={styles.scannedMessageText}>Scan Complete!</Text>
          {/* <TouchableOpacity style={styles.restartButton} onPress={() => setIsScanning(true)}>
            <Text style={styles.restartButtonText}>Scan Again</Text>
          </TouchableOpacity> */}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrScannerContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: isPortrait ? 20 : 50, // Adjust padding based on orientation
  },
  qrScanner: {
    width: isPortrait ? width * 0.8 : width * 0.6, // 80% width in portrait, 60% in landscape
    height: isPortrait ? height * 0.5 : height * 0.6, // 50% height in portrait, 60% in landscape
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#A3238F',
  },

  flashButton: {
    flex:1,
    position: 'absolute',
    bottom: 30,

    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 5,
  },
  tourchtext: {
    textAlign: 'center',
  },

  scene: {
    flex: 1,
    padding: 10,
  },
  scannedDataContainer: {
    marginTop: 10,
    padding: 15,
    borderRadius: 5,

    alignItems: 'center',
    backgroundColor:'#A3238F',
  },
  scannedDataText: {
    fontSize: 16,
    fontWeight: 'bold',
    color:'#ffffff',
  },
  scannedDataValue: {
    fontSize: 18,
    marginTop: 5,
    color:'#ffffff',
  },
  scannedMessageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 70,
    backgroundColor: '#A3238F',
    borderRadius: 10,
  },
  scannedMessageText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    
  },
  restartButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  restartButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default Scanner;





















// import React, { useState, useRef } from 'react';
// import {
//   View,
//   TouchableOpacity,
//   Text,
//   PermissionsAndroid,
//   StyleSheet,
//   Alert,
//   Platform,
// } from 'react-native';
// import { RNCamera as BarCodeScanner } from 'react-native-camera';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import { API_BASE_URL } from '../constants/Config';
// import { useSelector } from 'react-redux';
// import { Dimensions } from 'react-native';

// const { width, height } = Dimensions.get('window');
// const isPortrait = height > width;

// const Scanner = ({ navigation }) => {
//   const cameraRef = useRef(null);
//   const [isFlashOn, setIsFlashOn] = useState(false);
//   const [isScanning, setIsScanning] = useState(true);
//   const scanningRef = useRef(true);

//   const userId = useSelector((state) => state.user?.userId);

//   const handleFlashToggle = () => {
//     setIsFlashOn((prev) => !prev);
//   };

//   const handleQRCodeScan = async ({ data }) => {
//     if (!scanningRef.current || !isScanning) return;
//     scanningRef.current = false;

//     const [eventId, locationId, slotId] = data.split('_');

//     if (!eventId || !locationId || !slotId) {
//       Alert.alert('Error', 'Invalid QR Code format');
//       setIsScanning(true);
//       scanningRef.current = true;
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/Postattendance`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           userId,
//           eventId,
//           locationId,
//           slotId,
//         }),
//       });

//       const rawResponse = await response.text();
//       console.log('Raw Response:', rawResponse);
//       const result = JSON.parse(rawResponse);

//       if (response.ok) {
//         Alert.alert('Success', 'Attendance recorded successfully');
//       } else {
//         Alert.alert('Error', result.message || 'Failed to record attendance');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       Alert.alert('Error', 'Something went wrong');
//     } finally {
//       setIsScanning(false); // Set to false to stop camera
//       scanningRef.current = true;
//     }
//   };

//   const openQRScanner = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.CAMERA,
//           {
//             title: 'Camera Permission',
//             message: 'App needs access to your camera to scan QR codes',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//           }
//         );
//         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//           setIsScanning(true);
//         } else {
//           Alert.alert('Permission Denied', 'Camera access is required to scan QR codes.');
//         }
//       } catch (error) {
//         console.log('Error requesting camera permission:', error);
//       }
//     } else {
//       setIsScanning(true);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {isScanning ? (
//         <View style={styles.qrScannerContainer}>
//           <BarCodeScanner
//             ref={cameraRef}
//             style={styles.qrScanner}
//             onBarCodeRead={handleQRCodeScan}
//             flashMode={isFlashOn ? 'torch' : 'off'}
//           />
//           <TouchableOpacity style={styles.flashButton} onPress={handleFlashToggle}>
//             <Icon name="lightbulb-o" size={40} color={isFlashOn ? 'yellow' : 'gray'} />
//             <Text style={styles.tourchtext}>{isFlashOn ? 'Torch On' : 'Torch Off'}</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <View style={styles.scannedMessageContainer}>
//           <Text style={styles.scannedMessageText}>Scan Complete!</Text>
//           <TouchableOpacity style={styles.restartButton} onPress={() => setIsScanning(true)}>
//             <Text style={styles.restartButtonText}>Scan Again</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   qrScannerContainer: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: isPortrait ? 20 : 50, // Adjust padding based on orientation
//   },
//   qrScanner: {
//     width: isPortrait ? width * 0.8 : width * 0.6, // 80% width in portrait, 60% in landscape
//     height: isPortrait ? height * 0.5 : height * 0.6, // 50% height in portrait, 60% in landscape
//     borderRadius: 15,
//     overflow: 'hidden',
//     borderWidth: 2,
//     borderColor: '#A3238F',
//   },

//   flashButton: {
//     flex:1,
//     position: 'absolute',
//     bottom: 30,

//     backgroundColor: 'rgba(255, 255, 255, 0.8)',
//     padding: 10,
//     borderRadius: 5,
//   },
//   tourchtext: {
//     textAlign: 'center',
//   },

//   scene: {
//     flex: 1,
//     padding: 10,
//   },
//   scannedDataContainer: {
//     marginTop: 10,
//     padding: 15,
//     borderRadius: 5,

//     alignItems: 'center',
//     backgroundColor:'#A3238F',
//   },
//   scannedDataText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color:'#ffffff',
//   },
//   scannedDataValue: {
//     fontSize: 18,
//     marginTop: 5,
//     color:'#ffffff',
//   },
//   scannedMessageContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 70,
//     backgroundColor: '#A3238F',
//     borderRadius: 10,
//   },
//   scannedMessageText: {
//     color: '#FFFFFF',
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginBottom: 30,
    
//   },
//   restartButton: {
//     backgroundColor: '#007BFF',
//     padding: 10,
//     borderRadius: 5,
//   },
//   restartButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//   },
// });

// export default Scanner;














// import React from 'react'
// import { View, Text } from 'react-native'

// const Scanner = () => {
//   return (
//     <View>
//         <Text>
// Scanner
//         </Text>
//     </View>
//   )
// }

// export default Scanner