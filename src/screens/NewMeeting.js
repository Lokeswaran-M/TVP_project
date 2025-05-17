import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Modal,
  ActivityIndicator,
  SafeAreaView,
  StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Calendar } from 'react-native-calendars';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { API_BASE_URL } from '../constants/Config';

const NewMeeting = () => {
  const navigation = useNavigation(); 
  const [showCalendar, setShowCalendar] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [date, setDate] = useState(null);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);

  const userId = useSelector((state) => state.UserId);

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const onDaySelect = (day) => {
    setSelectedDate(day.dateString);
    setShowCalendar(false);
  };

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/business-infos/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }
      const data = await response.json();
      setProfileData(data);
    } catch (error) {
      console.error('Error fetching profile data in New Meeting:', error);
      setModalMessage('Unable to load location data. Please try again later.');
      setShowMessageModal(true);
    } finally {
      setLoading(false);
    }
  };

  const createMeeting = async () => {
    if (!selectedDate || !date || !profileData.LocationID) {
      setModalMessage('Please select a date, time and location.');
      setShowMessageModal(true);
      return;
    }

    setSubmitting(true);
    
    const meetingData = {
      CreatedBy: userId,
      LocationID: profileData.LocationID,
      DateTime: `${selectedDate} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}`,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/meetings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(meetingData),
      });

      if (!response.ok) {
        throw new Error('Failed to create meeting');
      }

      setModalMessage('Meeting created successfully!');
    } catch (error) {
      console.error('Error creating meeting:', error);
      setModalMessage('Failed to create meeting. Please try again.');
    } finally {
      setSubmitting(false);
      setShowMessageModal(true);
      setShowConfirmationModal(false);
    }
  };

  const showTimePicker = () => setTimePickerVisibility(true);
  const hideTimePicker = () => setTimePickerVisibility(false);

  const handleTimeConfirm = (selectedTime) => {
    setDate(selectedTime);
    hideTimePicker();
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfileData();
    }, [userId])
  );

  const hideAlert = () => {
    setShowMessageModal(false);
    if (modalMessage === 'Meeting created successfully!') {
      navigation.goBack();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#f8f9fa" barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={20} color="#2e3192" />
        </TouchableOpacity>
        <Text style={styles.title}>Create Meeting</Text>
        <View style={styles.spacer} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2e3192" />
          <Text style={styles.loadingText}>Loading your details...</Text>
        </View>
      ) : (
        <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Meeting Details</Text>
            
            <TouchableOpacity 
              onPress={toggleCalendar} 
              style={[styles.inputField, selectedDate ? styles.filledField : null]}
            >
              <View style={styles.iconContainer}>
                <Icon name="calendar" size={20} color="#2e3192" />
              </View>
              <Text style={[styles.inputText, selectedDate ? styles.filledText : styles.placeholderText]}>
                {selectedDate ? formatDate(selectedDate) : 'Select date'}
              </Text>
            </TouchableOpacity>

            {showCalendar && (
              <View style={styles.calendarContainer}>
                <Calendar
                  onDayPress={onDaySelect}
                  markedDates={{
                    [selectedDate]: { selected: true, marked: true, selectedColor: '#2e3192' },
                  }}
                  theme={{
                    todayTextColor: '#2e3192',
                    arrowColor: '#2e3192',
                    dotColor: '#2e3192',
                    selectedDayBackgroundColor: '#2e3192',
                  }}
                  minDate={new Date().toISOString().split('T')[0]}
                />
              </View>
            )}
            
            <TouchableOpacity 
              onPress={showTimePicker} 
              style={[styles.inputField, date ? styles.filledField : null]}
            >
              <View style={styles.iconContainer}>
                <Icon name="clock-o" size={20} color="#2e3192" />
              </View>
              <Text style={[styles.inputText, date ? styles.filledText : styles.placeholderText]}>
                {date ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : 'Select time'}
              </Text>
            </TouchableOpacity>
            
            <View style={[styles.inputField, profileData?.Location ? styles.filledField : null]}>
              <View style={styles.iconContainer}>
                <Icon name="map-marker" size={20} color="#2e3192" />
              </View>
              <Text style={[styles.inputText, profileData?.Location ? styles.filledText : styles.placeholderText]}>
                {profileData?.Location || 'No location available'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.button}
            disabled={submitting}
            onPress={() => {
              if (!selectedDate || !date || !profileData.LocationID) {
                setModalMessage('Please select a date, time, and location to continue.');
                setShowMessageModal(true);
              } else {
                setShowConfirmationModal(true);
              }
            }}
          >
            {submitting ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Create Meeting</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Message Modal */}
      <Modal transparent={true} visible={showMessageModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {modalMessage.includes('success') ? 'Success' : 'Message'}
              </Text>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.modalMessage}>{modalMessage}</Text>
            </View>
            <TouchableOpacity style={styles.modalButton} onPress={hideAlert}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Confirmation Modal */}
      <Modal transparent={true} visible={showConfirmationModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Confirm Meeting</Text>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.modalMessage}>
                Are you sure you want to create a meeting on {formatDate(selectedDate)} at{' '}
                {date ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : ''}?
              </Text>
              {profileData?.Location && (
                <Text style={styles.modalLocation}>
                  Location: {profileData.Location}
                </Text>
              )}
            </View>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButtonSecondary} onPress={() => setShowConfirmationModal(false)}>
                <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
              </TouchableOpacity>
      <TouchableOpacity
  style={[
    styles.modalButtonPrimary,
    submitting && { opacity: 0.6 }  // Optional visual feedback
  ]}
  onPress={!submitting ? createMeeting : null}
  disabled={submitting}
>
  <Text style={styles.modalButtonText}>
    {submitting ? 'Please wait...' : 'Confirm'}
  </Text>
</TouchableOpacity>

            </View>
          </View>
        </View>
      </Modal>

      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleTimeConfirm}
        onCancel={hideTimePicker}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e4e8',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2e3192',
  },
  spacer: {
    width: 36,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e1e4e8',
  },
  filledField: {
    backgroundColor: '#f0f4ff',
    borderColor: '#c5d1f8',
  },
  iconContainer: {
    marginRight: 12,
  },
  inputText: {
    fontSize: 16,
    flex: 1,
  },
  placeholderText: {
    color: '#888',
  },
  filledText: {
    color: '#333',
  },
  calendarContainer: {
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e1e4e8',
  },
  button: {
    backgroundColor: '#2e3192',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e4e8',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2e3192',
    textAlign: 'center',
  },
  modalBody: {
    padding: 16,
  },
  modalMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 22,
  },
  modalLocation: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  modalButton: {
    backgroundColor: '#2e3192',
    padding: 16,
    alignItems: 'center',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e1e4e8',
  },
  modalButtonPrimary: {
    flex: 1,
    backgroundColor: '#2e3192',
    padding: 16,
    alignItems: 'center',
  },
  modalButtonSecondary: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#e1e4e8',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  modalButtonTextSecondary: {
    color: '#666',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default NewMeeting;