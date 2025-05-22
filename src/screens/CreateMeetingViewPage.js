import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  StatusBar
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import RNFS from 'react-native-fs';
import ViewShot from 'react-native-view-shot';
import { PERMISSIONS, request, check, RESULTS, openSettings } from 'react-native-permissions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CreateMeetingViewPage = ({ route, navigation }) => {
  const { userId, eventId, locationId, location, dateTime } = route.params;
  const viewShotRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
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
          Alert.alert(
            'Permission Required',
            'Storage permission is needed to save the QR Code. Please enable it in settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => openSettings() },
            ]
          );
          return false;
        }
      } else {
        const status = await check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
        if (status === RESULTS.GRANTED) return true;
        if (status === RESULTS.DENIED) return (await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)) === RESULTS.GRANTED;
        if (status === RESULTS.BLOCKED) {
          Alert.alert(
            'Permission Required',
            'Storage permission is needed to save the QR Code. Please enable it in settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => openSettings() },
            ]
          );
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
      Alert.alert(
        'Success', 
        'Poster has been saved to your downloads folder.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error saving poster:', error);
    } finally {
      setIsLoading(false);
    }
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
            {/* <View style={styles.posterHeader}>
              <Text style={styles.posterTitle}>Event Invitation</Text>
            </View> */}
            
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
});

export default CreateMeetingViewPage;