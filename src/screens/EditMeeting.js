import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Calendar } from 'react-native-calendars';
import DatePicker from 'react-native-date-picker';
import { API_BASE_URL } from '../constants/Config';
// import sun from '../../assets/images/sun.png';
// import moon from '../../assets/images/moon.png';

const EditMeeting = ({ route }) => {
  const { eventId, date, time, location, locationId } = route.params;
  const navigation = useNavigation();
  const [showCalendar, setShowCalendar] = useState(false);
  const [dates, setDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [SlotID, setSlotID] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const userId = useSelector((state) => state.user?.userId);

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const onDaySelect = (day) => {
    setSelectedDate(day.dateString);
    setShowCalendar(false);
  };

  const showAlert = (message) => {
    setModalMessage(message);
    setModalVisible(true);
  };

  const hideAlert = () => {
    setModalVisible(false);
    // Navigate back if the message was a success message
    if (modalMessage === 'Meeting updated successfully!') {
      navigation.goBack();
    }
  };

  const updateMeeting = async () => {
    if (!selectedDate || !dates || !locationId || SlotID === null) {
      showAlert('Please select a date, time, location, and slot.');
      return;
    }

    const formattedDateTime = `${selectedDate} ${dates instanceof Date
      ? dates.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      : time}`;

    const meetingData = {
      EventId: eventId,
      LocationID: locationId,
      DateTime: formattedDateTime,
      SlotID,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/meetings/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(meetingData),
      });

      if (response.ok) {
        showAlert('Meeting updated successfully!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update meeting');
      }
    } catch (error) {
      showAlert(error.message || 'Failed to update meeting. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.iconContainer, SlotID === 1 && { backgroundColor: '#2e3192' }]}
          onPress={() => setSlotID(1)}
        >
          {/* <Image source={sun} style={{ width: 50, height: 50 }} /> */}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.iconContainer, SlotID === 2 && { backgroundColor: '#2e3192' }]}
          onPress={() => setSlotID(2)}
        >
          {/* <Image source={moon} style={{ width: 50, height: 50 }} /> */}
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={toggleCalendar}>
        <View style={styles.section}>
          <Text style={styles.label}>{selectedDate ? selectedDate : date}</Text>
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
      <TouchableOpacity onPress={() => setOpen(true)}>
        <View style={styles.section}>
          <Text style={styles.label}>
            {dates instanceof Date
              ? dates.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : time}
          </Text>
          <Icon name="clock-o" size={30} color="#2e3192" />
        </View>
      </TouchableOpacity>
      <DatePicker
        modal
        mode="time"
        open={open}
        date={date instanceof Date ? date : new Date()}
        onConfirm={(selectedTime) => {
          setOpen(false);
          setDate(selectedTime);
        }}
        onCancel={() => setOpen(false)}
      />
      <View style={styles.section}>
        <Text style={styles.label}>{location}</Text>
        <Icon name="map-marker" size={30} color="#2e3192" />
      </View>
      <TouchableOpacity style={styles.button} onPress={updateMeeting}>
        <Text style={styles.buttonText}>Update Meeting</Text>
      </TouchableOpacity>

      {/* Custom Modal for Alerts */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={hideAlert}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={hideAlert}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
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
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalMessage: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#2e3192',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default EditMeeting;
