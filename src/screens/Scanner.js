import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  PermissionsAndroid,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { RNCamera as BarCodeScanner } from 'react-native-camera';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API_BASE_URL } from '../constants/Config';
import { TabView, TabBar } from 'react-native-tab-view';
import { useSelector } from 'react-redux';

const Scanner = () => {
  const [isQRScannerVisible, setIsQRScannerVisible] = useState(false);
  const cameraRef = useRef(null);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const handleQRCodeScan = ({ data }) => {
    console.log('QR Code Scanned:', data);
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
      <Scanner
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