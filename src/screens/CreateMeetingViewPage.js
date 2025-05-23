import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Modal,
  Pressable
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import RNFS from 'react-native-fs';
import ViewShot from 'react-native-view-shot';
import { PERMISSIONS, request, check, RESULTS, openSettings } from 'react-native-permissions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FAB } from 'react-native-paper';
import { API_BASE_URL } from '../constants/Config';

const CreateMeetingViewPage = ({ route, navigation }) => {
  const { userId, eventId, locationId, location, dateTime } = route.params;
  console.log("Location ID:==================", locationId);
  const viewShotRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingNotifications, setIsSendingNotifications] = useState(false);
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [downloadSuccessModalVisible, setDownloadSuccessModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    message: '',
    failedUsers: []
  });

  const sendNotifications = async () => {
    setIsSendingNotifications(true);
    setNotificationModalVisible(false);
    try {
      const response = await fetch(`${API_BASE_URL}/api/notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          LocationID: locationId
        }),
      });

      const data = await response.json();
      if (response.ok) {
        if (data.failedUsers && data.failedUsers.length > 0) {
          const failedUserNames = data.failedUsers.map(user => user.UserName).join('\n• ');
          setModalContent({
            title: 'Notifications Partially Sent',
            message: `Successfully sent to ${data.successCount} of ${data.totalUsers} users.\n\nFailed to send to:\n• ${failedUserNames}`,
            failedUsers: data.failedUsers
          });
        } else {
          setModalContent({
            title: 'Success',
            message: `All notifications (${data.totalUsers}) sent successfully!`,
            failedUsers: []
          });
        }
        setSuccessModalVisible(true);
      } else {
        throw new Error(data.error || 'Failed to send notifications');
      }
    } catch (error) {
      console.error('Error sending notifications:', error);
      setModalContent({
        title: 'Error',
        message: error.message || 'Failed to send notifications',
        failedUsers: []
      });
      setErrorModalVisible(true);
    } finally {
      setIsSendingNotifications(false);
    }
  };

  const handleSendNotifications = () => {
    setModalContent({
      title: 'Send Notifications',
      message: 'Are you sure you want to send notifications to all users at this location?',
      failedUsers: []
    });
    setNotificationModalVisible(true);
  };

  const formatDateTime = (dateTimeStr) => {
    const options = { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateTimeStr).toLocaleDateString(undefined, options);
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      const osVersion = Platform.Version;
      if (osVersion >= 30) {
        const status = await check(PERMISSIONS.ANDROID.MANAGE_EXTERNAL_STORAGE);
        if (status === RESULTS.GRANTED) return true;
        if (status === RESULTS.DENIED) return (await request(PERMISSIONS.ANDROID.MANAGE_EXTERNAL_STORAGE)) === RESULTS.GRANTED;
        if (status === RESULTS.BLOCKED) {
          setModalContent({
            title: 'Permission Required',
            message: 'Storage permission is needed to save the QR Code. Please enable it in settings.',
            failedUsers: []
          });
          setPermissionModalVisible(true);
          return false;
        }
      } else {
        const status = await check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
        if (status === RESULTS.GRANTED) return true;
        if (status === RESULTS.DENIED) return (await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)) === RESULTS.GRANTED;
        if (status === RESULTS.BLOCKED) {
          setModalContent({
            title: 'Permission Required',
            message: 'Storage permission is needed to save the QR Code. Please enable it in settings.',
            failedUsers: []
          });
          setPermissionModalVisible(true);
          return false;
        }
      }
    }
    return true;
  };

  const downloadPoster = async () => {
    setIsLoading(true);
    
    const hasPermission = await requestStoragePermission();
  
    if (!hasPermission) {
      setIsLoading(false);
      return;
    }
    const uniqueFileName = `event_poster_${Date.now()}.png`;
    try {
      const uri = await viewShotRef.current.capture();
      const filePath = `${RNFS.DownloadDirectoryPath}/${uniqueFileName}`;
      
      await RNFS.moveFile(uri.replace('file://', ''), filePath);
      
      console.log(`Poster saved at: ${filePath}`);
      setDownloadSuccessModalVisible(true);
    } catch (error) {
      console.error('Error saving poster:', error);
      setModalContent({
        title: 'Error',
        message: 'Failed to save poster',
        failedUsers: []
      });
      setErrorModalVisible(true);
    } finally {
      setIsLoading(false);
    }
  };
  const CustomModal = ({ visible, onClose, title, message, showCancel = false, onConfirm }) => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{title}</Text>
            <Text style={styles.modalMessage}>{message}</Text>
            
            <View style={styles.modalButtonContainer}>
              {showCancel && (
                <Pressable
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={onClose}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
              )}
              
              <Pressable
                style={[styles.modalButton, styles.confirmButton]}
                onPress={onConfirm || onClose}
              >
                <Text style={styles.confirmButtonText}>
                  {showCancel ? 'Confirm' : 'OK'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#4051B5" barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Details</Text>
        <View style={styles.headerRight} />
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.9 }}>
          <View style={styles.posterContainer}>
            <View style={styles.contentRow}>
              <View style={styles.iconContainer}>
                <Icon name="calendar-clock" size={24} color="#4051B5" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Date & Time</Text>
                <Text style={styles.value}>{formatDateTime(dateTime)}</Text>
              </View>
            </View>
            
            <View style={styles.contentRow}>
              <View style={styles.iconContainer}>
                <Icon name="map-marker" size={24} color="#4051B5" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Location</Text>
                <Text style={styles.value}>{location}</Text>
              </View>
            </View>
            
            <View style={styles.contentRow}>
              <View style={styles.iconContainer}>
                <Icon name="identifier" size={24} color="#4051B5" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Event ID</Text>
                <Text style={styles.value}>{eventId}</Text>
              </View>
            </View>
            
            <View style={styles.qrContainer}>
              <Text style={styles.scanText}>Scan to check in</Text>
              <View style={styles.qrCodeWrapper}>
                <QRCode value={`${eventId}_${locationId}`} size={200} backgroundColor="white" />
              </View>
            </View>
          </View>
        </ViewShot>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={downloadPoster}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Icon name="download" size={20} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Save Poster</Text>
              </>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.outlineButton} 
            onPress={() => navigation.navigate('PreAttendanceViewPage', { eventId })}
          >
            <Icon name="clipboard-check" size={20} color="#4051B5" style={styles.buttonIcon} />
            <Text style={styles.outlineButtonText}>Pre-Attendance</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={() => navigation.navigate('OneMinPresentation', { userId, eventId, locationId, dateTime })}
          >
            <Icon name="presentation" size={20} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Post-Attendance</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <FAB
        style={styles.fab}
        icon="bell"
        color="#EBB866"
        onPress={handleSendNotifications}
        loading={isSendingNotifications}
        disabled={isSendingNotifications}
      />
      <CustomModal
        visible={notificationModalVisible}
        onClose={() => setNotificationModalVisible(false)}
        title={modalContent.title}
        message={modalContent.message}
        showCancel={true}
        onConfirm={sendNotifications}
      />
      <CustomModal
        visible={successModalVisible}
        onClose={() => setSuccessModalVisible(false)}
        title={modalContent.title}
        message={modalContent.message}
      />
      <CustomModal
        visible={errorModalVisible}
        onClose={() => setErrorModalVisible(false)}
        title={modalContent.title}
        message={modalContent.message}
      />
      <CustomModal
        visible={permissionModalVisible}
        onClose={() => setPermissionModalVisible(false)}
        title={modalContent.title}
        message={modalContent.message}
        onConfirm={() => {
          setPermissionModalVisible(false);
          openSettings();
        }}
      />
      <CustomModal
        visible={downloadSuccessModalVisible}
        onClose={() => setDownloadSuccessModalVisible(false)}
        title="Success"
        message="Poster has been saved to your downloads folder."
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#4051B5',
    paddingVertical: 16,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  backButton: {
    padding: 4,
  },
  headerRight: {
    width: 24,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  posterContainer: {
    margin: 16,
    backgroundColor: '#f5f7ff',
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    overflow: 'hidden',
  },
  posterHeader: {
    backgroundColor: '#4051B5',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  posterTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  iconContainer: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  qrContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#f9f9f9',
  },
  scanText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  qrCodeWrapper: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  actionButtons: {
    paddingHorizontal: 16,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#4051B5',
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4051B5',
    borderRadius: 8,
    paddingVertical: 13,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  outlineButtonText: {
    color: '#4051B5',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcon: {
    marginRight: 8,
  },
    fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#fcf5e8',
  },
    modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4051B5',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#4051B5',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default CreateMeetingViewPage;