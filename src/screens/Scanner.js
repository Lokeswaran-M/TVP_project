import React, { useState, useRef, useEffect } from 'react'; 
import {
  View,
  TouchableOpacity,
  Text,
  PermissionsAndroid,
  StyleSheet,
  Platform,
  Modal,
} from 'react-native';
import { RNCamera as BarCodeScanner } from 'react-native-camera';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { API_BASE_URL } from '../constants/Config';
import { useSelector } from 'react-redux';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const isPortrait = height > width;

const PRIMARY_COLOR = '#2e3091';
const SECONDARY_COLOR = '#3d3fa3';
const LIGHT_PRIMARY = '#eaebf7';
const ACCENT_COLOR = '#ff6b6b';
const BACKGROUND_COLOR = '#f5f7ff';
const WHITE = '#ffffff';
const DARK_TEXT = '#333333';
const LIGHT_TEXT = '#6c7293';

const Scanner = ({ navigation }) => {
  const cameraRef = useRef(null);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const scanningRef = useRef(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('info');

  const userId = useSelector((state) => state.UserId);
  const Profession = useSelector((state) => state.Profession);
  console.log('User ID in scanner screen-----------', userId);
  console.log('Profession in scanner screen-----------', Profession);
  
  const [businessInfo, setBusinessInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinessInfo = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/user/business-infodrawer/${userId}`);
        const data = await response.json();
        console.log("Data in the Scanner Screen-----------------------------", data);
        if (response.ok) {
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

  const showModal = (title, message, type = 'info') => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalTitle('');
    setModalMessage('');
    setModalType('info');
  };

  const handleFlashToggle = () => {
    setIsFlashOn((prev) => !prev);
  };

const postAttendanceForProfession = async (eventId, locationId) => {
  if (!businessInfo || businessInfo.length === 0) {
    showModal('Error', 'No professions found for user.');
    return;
  }

  try {
    const postAttendanceResponse = await fetch(`${API_BASE_URL}/Postattendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: userId,
        eventId: eventId,
        locationId: locationId,
        Profession: businessInfo[0].BD,
      }),
    });

    const result = await postAttendanceResponse.json();
    console.log('Attendance response:', result);

    if (postAttendanceResponse.ok) {
      showModal('Success', result.message || 'Attendance marked!');
    } else {
      showModal('Error', result.message || 'Failed to mark attendance.');
    }
    for (const item of businessInfo) {
      const ratingResponse = await fetch(`${API_BASE_URL}/Postattendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          eventId: eventId,
          locationId: locationId,
          Profession: item.BD,
        }),
      });

      const ratingResult = await ratingResponse.json();
      console.log(`Rating result for profession ${item.BD}:`, ratingResult);
    }
  } catch (error) {
    console.error('Error in postAttendanceForProfession:', error);
    showModal('Error', 'Something went wrong.');
  }
};

// Updated handleQRCodeScan function in your Scanner component

const handleQRCodeScan = async ({ data }) => {
  if (!scanningRef.current || !isScanning || isProcessing) return;
  
  scanningRef.current = false;
  setIsProcessing(true);

  const [eventId, locationId] = data.split('_');

  if (!eventId || !locationId) {
    setIsScanning(true);
    setIsProcessing(false);
    scanningRef.current = true;
    return;
  }

  try {
    const professions = businessInfo.map(business => business.BD);
    console.log('Professions to post attendance for:', professions);

    if (professions.length === 0) {
      showModal('Error', 'No professions found. Please try again.', 'error');
      setIsScanning(true);
      setIsProcessing(false);
      scanningRef.current = true;
      return;
    }

    const response = await fetch(`${API_BASE_URL}/Postattendance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        eventId,
        locationId,
        professions: professions
      }),
    });

    const result = await response.json();
    console.log('Response from server:', result);
    
    if (response.ok) {
      const successMessage = result.details 
        ? `Attendance recorded successfully!\n\nRating details created for ${result.details.ratingDetailsInserted} professions:\n${result.details.professions.join(', ')}\n\nStars earned: ${result.details.stars}`
        : result.message;
      
      showModal('Success', successMessage, 'success');
      console.log('Attendance posted successfully for all professions:', result);
    } else {
      console.error('Error posting attendance:', result);
      showModal('Error', result.message || 'Failed to post attendance. Please try again.', 'error');
    }

  } catch (error) {
    console.error('Error in handleQRCodeScan:', error);
    showModal('Error', 'Network error occurred. Please check your connection and try again.', 'error');
  } finally {
    setIsScanning(false);
    setIsProcessing(false);
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
          showModal('Permission Denied', 'Camera permission is required to scan QR codes.', 'error');
        }
      } catch (error) {
        console.log('Error requesting camera permission:', error);
      }
    } else {
      setIsScanning(true);
    }
  };

  useEffect(() => {
    openQRScanner();
    return () => {
      setIsScanning(false);
    };
  }, []);

  const getModalBackgroundColor = () => {
    switch (modalType) {
      case 'success':
        return '#4CAF50';
      case 'error':
        return '#f44336';
      default:
        return PRIMARY_COLOR;
    }
  };

  const getModalIcon = () => {
    switch (modalType) {
      case 'success':
        return 'check-circle';
      case 'error':
        return 'alert-circle';
      default:
        return 'information';
    }
  };

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
            <Icon name="lightbulb-on" size={40} left={10} color={isFlashOn ? 'yellow' : 'gray'} />
            <Text style={styles.tourchtext}>{isFlashOn ? 'Torch On' : 'Torch Off'}</Text>
          </TouchableOpacity>
          {isProcessing && (
            <View style={styles.processingOverlay}>
              <Text style={styles.processingText}>Processing attendance...</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.scannedMessageContainer}>
          <Text style={styles.scannedMessageText}>Scan Complete!</Text>
          <TouchableOpacity 
            style={styles.restartButton} 
            onPress={() => {
              setIsScanning(true);
              setIsProcessing(false);
              scanningRef.current = true;
            }}
          >
            <Text style={styles.restartButtonText}>Scan Again</Text>
          </TouchableOpacity>
        </View>
      )}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={[styles.modalHeader, { backgroundColor: getModalBackgroundColor() }]}>
              <Icon 
                name={getModalIcon()} 
                size={40} 
                color={WHITE} 
                style={styles.modalIcon}
              />
              <Text style={styles.modalTitle}>{modalTitle}</Text>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.modalMessage}>{modalMessage}</Text>
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: getModalBackgroundColor() }]}
                onPress={closeModal}
              >
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BACKGROUND_COLOR,
  },
  qrScannerContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: isPortrait ? 20 : 50,
  },
  qrScanner: {
    width: isPortrait ? width * 0.8 : width * 0.6,
    height: isPortrait ? height * 0.5 : height * 0.6,
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: PRIMARY_COLOR,
  },
  flashButton: {
    position: 'absolute',
    bottom: 30,
    backgroundColor: '#DDDDDD',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'column',
    alignItems: 'center',
  },
  tourchtext: {
    textAlign: 'center',
    color: 'black',
    marginTop: 5,
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    color: WHITE,
    fontSize: 18,
    fontWeight: 'bold',
  },
  scannedMessageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 70,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 10,
  },
  scannedMessageText: {
    color: WHITE,
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
    color: WHITE,
    fontSize: 16,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: WHITE,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalIcon: {
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: WHITE,
    textAlign: 'center',
  },
  modalBody: {
    padding: 20,
  },
  modalMessage: {
    fontSize: 16,
    color: DARK_TEXT,
    textAlign: 'center',
    lineHeight: 24,
  },
  modalFooter: {
    padding: 20,
    paddingTop: 0,
  },
  modalButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
export default Scanner;