import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  PermissionsAndroid,
  StyleSheet,
} from 'react-native';
import { RNCamera as BarCodeScanner } from 'react-native-camera';
import Icon from 'react-native-vector-icons/FontAwesome';

const Scanner = () => {
  const [isQRScannerVisible, setIsQRScannerVisible] = useState(false);
  const cameraRef = useRef(null);
  const [isFlashOn, setIsFlashOn] = useState(false);

  // Handle QR code scan
  const handleQRCodeScan = ({ data }) => {
    console.log('QR Code Scanned:', data);
    // Add your logic for what to do with the scanned data
    setIsQRScannerVisible(false); 
  };

  // Toggle flash mode
  const handleFlashToggle = () => {
    setIsFlashOn((prev) => !prev);
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
        setIsQRScannerVisible(true);
      } else {
        console.log('Camera permission denied');
      }
    } catch (error) {
      console.log('Error requesting camera permission:', error);
    }
  };

  return (
    <View style={styles.container}>
      {isQRScannerVisible && (
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
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrScanner: {
    width: '100%',
    height: '100%',
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
    marginTop: 20,
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
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