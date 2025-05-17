import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  StatusBar,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Calendar } from 'react-native-calendars';
import DatePicker from 'react-native-date-picker';
import { API_BASE_URL } from '../constants/Config';

const { width, height } = Dimensions.get('window');
const isLargeScreen = width > 600;

const COLORS = {
  primary: '#2e3192',
  secondary: '#4a4de7',
  background: '#f5f7ff',
  white: '#ffffff',
  text: '#333333',
  lightText: '#666666',
  success: '#4CAF50',
  error: '#F44336',
  border: '#e0e0e0'
};
const EditMeeting = ({ route }) => {
  const { eventId, date, time, location, locationId , dateTime} = route.params;
  console.log('EditMeeting route params:', route.params, dateTime);
  const navigation = useNavigation();
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('success');
  const userId = useSelector((state) => state.UserId);
  useEffect(() => {
    if (date) {
      setSelectedDate(date);
    }
    if (time) {
      try {
        const timeStr = time.trim();
        let hours, minutes, isAM;
        if (timeStr.includes('AM') || timeStr.includes('PM')) {
          const timeParts = timeStr.replace(/ /g, '').match(/(\d+):(\d+):?(\d+)?(?:\s*)([APap][Mm])?/);
          if (timeParts && timeParts.length >= 3) {
            hours = parseInt(timeParts[1], 10);
            minutes = parseInt(timeParts[2], 10);
            isAM = (timeParts[4] || '').toLowerCase() === 'am';
            if (!isAM && hours < 12) {
              hours += 12;
            }
            if (isAM && hours === 12) {
              hours = 0;
            }
          }
        } else {
          const timeParts = timeStr.split(':');
          hours = parseInt(timeParts[0], 10);
          minutes = parseInt(timeParts[1], 10);
        }
        const timeDate = new Date();
        timeDate.setHours(hours);
        timeDate.setMinutes(minutes);
        timeDate.setSeconds(0);
        setSelectedTime(timeDate);
      } catch (error) {
        console.error('Error parsing time:', error, time);
      }
    }
  }, [date, time]);

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const onDaySelect = (day) => {
    setSelectedDate(day.dateString);
    setShowCalendar(false);
  };
  
  const showAlert = (message, type = 'success') => {
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);
  };
  
  const hideAlert = () => {
    setModalVisible(false);
    if (modalType === 'success') {
      navigation.goBack();
    }
  };
  
  const formatTime = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
  };
  const formatDateTimeForMySQL = (date, time) => {
    if (!date || !time) return null;
    const dateStr = date;
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');
    const timeStr = `${hours}:${minutes}:${seconds}`;
    return `${dateStr} ${timeStr}`;
  };

  const updateMeeting = async () => {
    if (!selectedDate || !selectedTime || !locationId) {
      showAlert('Please select a date, time, and location.', 'error');
      return;
    }

    setLoading(true);
    
    const formattedDateTime = formatDateTimeForMySQL(selectedDate, selectedTime);
    console.log('Formatted DateTime for MySQL:', formattedDateTime);
    
    const meetingData = {
      EventId: eventId,
      LocationID: locationId,
      DateTime: formattedDateTime,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/meetings/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(meetingData),
      });

      setLoading(false);

      if (response.ok) {
        showAlert('Meeting updated successfully!', 'success');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update meeting');
      }
    } catch (error) {
      setLoading(false);
      showAlert(error.message || 'Failed to update meeting. Please try again.', 'error');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back-ios" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Meeting</Text>
        <View style={styles.headerRight} />
      </View>
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={[styles.content, isLargeScreen && styles.contentLarge]}>
          <Text style={styles.sectionTitle}>Meeting Details</Text>
          
          <View style={styles.card}>
            <TouchableOpacity onPress={toggleCalendar} style={styles.section}>
              <View style={styles.sectionIconContainer}>
                <Icon name="calendar" size={isLargeScreen ? 24 : 20} color={COLORS.white} />
              </View>
              <View style={styles.sectionContent}>
                <Text style={styles.sectionLabel}>Date</Text>
                <Text style={styles.sectionValue}>{selectedDate || 'Select date'}</Text>
              </View>
              <MaterialIcons name="keyboard-arrow-right" size={24} color={COLORS.lightText} />
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity onPress={() => setOpen(true)} style={styles.section}>
              <View style={[styles.sectionIconContainer, {backgroundColor: COLORS.secondary}]}>
                <Icon name="clock-o" size={isLargeScreen ? 24 : 20} color={COLORS.white} />
              </View>
              <View style={styles.sectionContent}>
                <Text style={styles.sectionLabel}>Time</Text>
                <Text style={styles.sectionValue}>
                  {selectedTime ? formatTime(selectedTime) : 'Select time'}
                </Text>
              </View>
              <MaterialIcons name="keyboard-arrow-right" size={24} color={COLORS.lightText} />
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <View style={styles.section}>
              <View style={[styles.sectionIconContainer, {backgroundColor: '#4a6fe7'}]}>
                <Icon name="map-marker" size={isLargeScreen ? 24 : 20} color={COLORS.white} />
              </View>
              <View style={styles.sectionContent}>
                <Text style={styles.sectionLabel}>Location</Text>
                <Text style={styles.sectionValue}>{location}</Text>
              </View>
            </View>
          </View>
          
          {showCalendar && (
            <View style={[styles.calendarCard, isLargeScreen && styles.calendarCardLarge]}>
              <Calendar
                onDayPress={onDaySelect}
                markedDates={{
                  [selectedDate]: { selected: true, marked: true, selectedColor: COLORS.primary },
                }}
                theme={{
                  calendarBackground: COLORS.white,
                  textSectionTitleColor: COLORS.primary,
                  selectedDayBackgroundColor: COLORS.primary,
                  selectedDayTextColor: COLORS.white,
                  todayTextColor: COLORS.secondary,
                  dayTextColor: COLORS.text,
                  textDisabledColor: COLORS.border,
                  arrowColor: COLORS.primary,
                  textDayFontSize: isLargeScreen ? 16 : 14,
                  textMonthFontSize: isLargeScreen ? 18 : 16,
                  textDayHeaderFontSize: isLargeScreen ? 16 : 14,
                }}
                minDate={new Date().toISOString().split('T')[0]}
              />
            </View>
          )}
          
          <TouchableOpacity 
            style={[
              styles.button, 
              !selectedDate || !selectedTime ? styles.buttonDisabled : {},
              isLargeScreen && styles.buttonLarge
            ]}
            onPress={updateMeeting}
            disabled={!selectedDate || !selectedTime || loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} size={isLargeScreen ? "large" : "small"} />
            ) : (
              <Text style={[styles.buttonText, isLargeScreen && styles.buttonTextLarge]}>Update Meeting</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <DatePicker
        modal
        mode="time"
        open={open}
        date={selectedTime || new Date()}
        onConfirm={(time) => {
          setOpen(false);
          setSelectedTime(time);
        }}
        onCancel={() => setOpen(false)}
        theme="light"
      />

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={hideAlert}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, isLargeScreen && styles.modalContainerLarge]}>
            <View style={[
              styles.modalIconContainer, 
              { backgroundColor: modalType === 'success' ? COLORS.success : COLORS.error },
              isLargeScreen && styles.modalIconContainerLarge
            ]}>
              <MaterialIcons 
                name={modalType === 'success' ? 'check-circle' : 'error'} 
                size={isLargeScreen ? 40 : 30} 
                color={COLORS.white} 
              />
            </View>
            <Text style={[styles.modalTitle, isLargeScreen && styles.modalTitleLarge]}>
              {modalType === 'success' ? 'Success' : 'Error'}
            </Text>
            <Text style={[styles.modalMessage, isLargeScreen && styles.modalMessageLarge]}>{modalMessage}</Text>
            <TouchableOpacity 
              style={[
                styles.modalButton,
                { backgroundColor: modalType === 'success' ? COLORS.success : COLORS.error },
                isLargeScreen && styles.modalButtonLarge
              ]} 
              onPress={hideAlert}
            >
              <Text style={[styles.modalButtonText, isLargeScreen && styles.modalButtonTextLarge]}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  headerRight: {
    width: 40,
  },
  content: {
    padding: 16,
  },
  contentLarge: {
    padding: 24,
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 8,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  sectionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionContent: {
    flex: 1,
  },
  sectionLabel: {
    fontSize: 12,
    color: COLORS.lightText,
    marginBottom: 4,
  },
  sectionValue: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: 64,
  },
  calendarCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  calendarCardLarge: {
    padding: 8,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonLarge: {
    paddingVertical: 20,
    borderRadius: 16,
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%'
  },
  buttonDisabled: {
    backgroundColor: '#9e9eb5',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextLarge: {
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  modalContainerLarge: {
    width: '60%',
    maxWidth: 500,
    padding: 32,
  },
  modalIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalIconContainerLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  modalTitleLarge: {
    fontSize: 24,
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    color: COLORS.lightText,
    marginBottom: 24,
    textAlign: 'center',
  },
  modalMessageLarge: {
    fontSize: 18,
    marginBottom: 32,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonLarge: {
    paddingVertical: 16,
    borderRadius: 12,
  },
  modalButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonTextLarge: {
    fontSize: 18,
  },
});

export default EditMeeting;