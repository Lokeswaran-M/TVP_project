import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Calendar } from 'react-native-calendars';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { API_BASE_URL } from '../constants/Config';
// import sun from '../../assets/images/sun.png';
// import moon from '../../assets/images/moon.png';

const NewMeeting = () => {
  const navigation = useNavigation(); 
  const [showCalendar, setShowCalendar] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [SlotIDs, setSlotIDs] = useState([]);
  const [date, setDate] = useState(null);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false); // Modal for confirmation
  const [modalMessage, setModalMessage] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false); // Modal for error/success messages

  const userId = useSelector((state) => state.user?.userId);

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
    } finally {
      setLoading(false);
    }
  };

  const createMeeting = async () => {
    if (!selectedDate || !date || !profileData.LocationID || SlotIDs.length === 0) {
      setModalMessage('Please select a date, time, location, and at least one slot.');
      setShowMessageModal(true);
      return;
    }

    const promises = SlotIDs.map(async (SlotID) => {
      const meetingData = {
        CreatedBy: userId,
        LocationID: profileData.LocationID,
        DateTime: `${selectedDate} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}`,
        SlotID,
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
      } catch (error) {
        console.error(`Error creating meeting for SlotID ${SlotID}:`, error);
        throw error;
      }
    });

    try {
      await Promise.all(promises);
      setModalMessage('Meetings created successfully!');
    } catch (error) {
      setModalMessage('Failed to create one or more meetings. Please try again.');
    } finally {
      setShowMessageModal(true);
      setShowConfirmationModal(false); // Close confirmation modal
    }
  };

  const handleSlotClick = (id) => {
    if (SlotIDs.includes(id)) {
      setSlotIDs((prev) => prev.filter((slotID) => slotID !== id));
    } else {
      setSlotIDs((prev) => [...prev, id]);
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
    if (modalMessage === 'Meetings created successfully!') {
      navigation.goBack();
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create Meeting</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.iconContainer, SlotIDs.includes(1) && { backgroundColor: '#2e3192' }]}
          onPress={() => handleSlotClick(1)}
        >
          {/* <Image source={sun} style={{ width: 50, height: 50 }} /> */}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.iconContainer, SlotIDs.includes(2) && { backgroundColor: '#2e3192' }]}
          onPress={() => handleSlotClick(2)}
        >
          {/* <Image source={moon} style={{ width: 50, height: 50 }} /> */}
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={toggleCalendar}>
        <View style={styles.section}>
          <Text style={styles.label}>{selectedDate ? selectedDate : 'Date'}</Text>
          <Icon name="calendar" size={30} color="#2e3192" />
        </View>
      </TouchableOpacity>
      {showCalendar && (
        <Calendar
          onDayPress={onDaySelect}
          markedDates={{
            [selectedDate]: { selected: true, marked: true, selectedColor: '#2e3192' },
          }}
        />
      )}
      <TouchableOpacity onPress={showTimePicker}>
        <View style={styles.section}>
          <Text style={styles.label}>
            {date ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : 'Time'}
          </Text>
          <Icon name="clock-o" size={30} color="#2e3192" />
        </View>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleTimeConfirm}
        onCancel={hideTimePicker}
      />
      <View style={styles.section}>
        <Text style={styles.label}>{profileData?.Location ? `${profileData.Location}` : 'Location'}</Text>
        <Icon name="map-marker" size={30} color="#2e3192" />
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (!selectedDate || !date || !profileData.LocationID || SlotIDs.length === 0) {
            setModalMessage('Please select a date, time, location, and at least one slot.');
            setShowMessageModal(true); // Show message modal for missing inputs
          } else {
            setShowConfirmationModal(true); // Show confirmation modal if all inputs are valid
          }
        }}
      >
        <Text style={styles.buttonText}>Create Meeting</Text>
      </TouchableOpacity>

      {/* Message Modal */}
      <Modal transparent={true} visible={showMessageModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainerok}>
            <Text style={styles.modalTitle}>Message</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity style={styles.modalButtonNo} onPress={hideAlert}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Confirmation Modal */}
      <Modal transparent={true} visible={showConfirmationModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Meeting</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to create a meeting on {selectedDate} at{' '}
              {date ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : 'time not set'}?
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButtonNo} onPress={() => setShowConfirmationModal(false)}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButtonYes} onPress={createMeeting}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    paddingTop: 80,
  },
  title: {
    fontSize: 28,
    color: '#2e3192',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  iconContainer: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 100,
    elevation: 10,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: '#2e3192',
  },
  button: {
    backgroundColor: '#2e3192',
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: 'center',
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
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  
  },
  modalContainerok: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  alignItems:"center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#2e3192',
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent:'space-between',
  },
  modalButtonYes: {
    backgroundColor: '#2e3192',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    width:50,
    
  },
  modalButtonNo:{
    backgroundColor: '#2e3192',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    width:50,
  },
  modalButtonNo: {
    backgroundColor: '#2e3192',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    width:50,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },

});

export default NewMeeting;
