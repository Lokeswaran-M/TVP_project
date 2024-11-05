import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  PermissionsAndroid,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
  Alert, // Import Alert from react-native
} from 'react-native';
import { RNCamera as BarCodeScanner } from 'react-native-camera';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API_BASE_URL } from '../constants/Config';
import { TabView, TabBar } from 'react-native-tab-view';
import { useSelector } from 'react-redux';
const Scanner = ({ onScan }) => {
  const cameraRef = useRef(null);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [isScanning, setIsScanning] = useState(true); // State to manage scanning status

  // Toggle flash mode
  const handleFlashToggle = () => {
    setIsFlashOn((prev) => !prev);
  };

  // Handle QR code scan
  const handleQRCodeScan = ({ data }) => {
    if (!isScanning) return; // Prevent further scans if already scanned
    console.log('QR Code Scanned:', data);
    Alert.alert('Scan Successful', `Scanned Data: ${data}`); // Show alert message

    // Check if onScan is a function
    if (typeof onScan === 'function') {
      onScan(data); // Pass the scanned data to the parent component
    } else {
      console.warn('onScan is not a function:', onScan);
    }

    setIsScanning(false); // Stop further scans
  };

  // Request camera permission
  const openQRScanner = async () => {
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
        setIsScanning(true); // Allow scanning
      } else {
        console.log('Camera permission denied');
      }
    } catch (error) {
      console.log('Error requesting camera permission:', error);
    }
  };

  return (
    <View style={styles.container}>
      {isScanning ? ( // Conditionally render scanner based on scanning state
        <View style={styles.qrScannerContainer}>
          <BarCodeScanner
            ref={cameraRef}
            style={styles.qrScanner}
            onBarCodeRead={handleQRCodeScan}
            flashMode={isFlashOn ? 'torch' : 'off'}
            barCodeScannerSettings={{
              cameraProps: {
                ratio: '16:9',
                autoFocus: 'on',
              },
            }}
          />
          <TouchableOpacity
            style={styles.flashButton}
            onPress={handleFlashToggle}
          >
            <Icon name="lightbulb-o" size={40} color={isFlashOn ? 'yellow' : 'gray'} />
            <Text style={styles.tourchtext}>{isFlashOn ? 'Torch On' : 'Torch Off'}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.scannedMessageContainer}>
          <Text style={styles.scannedMessageText}>Scan Complete!</Text>
          <TouchableOpacity style={styles.restartButton} onPress={() => setIsScanning(true)}>
            <Text style={styles.restartButtonText}>Scan Again</Text>
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity style={styles.addButton} onPress={openQRScanner}>
        <Text style={styles.addButtonText}>Scan QR code</Text>
      </TouchableOpacity>
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
    width: '80%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // Ensure children are positioned relative to this container
  },
  qrScanner: {
    width: '100%',
    height: '100%',
    borderRadius: 15, // Add rounded corners
    overflow: 'hidden', // Ensure corners stay rounded
    borderWidth: 2, // Add border
    borderColor: '#A3238F', // Color of the border
  },
  flashButton: {
    position: 'absolute',
    bottom: 30,
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 5,
  },
  tourchtext: {
    textAlign: 'center',
  },
  addButton: {
    marginTop: 80,
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
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