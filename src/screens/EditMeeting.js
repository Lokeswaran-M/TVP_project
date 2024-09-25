import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Calendar } from 'react-native-calendars';
import DatePicker from 'react-native-date-picker';
import { API_BASE_URL } from '../constants/Config';
import sun from '../../assets/images/sun.png';
import moon from '../../assets/images/moon.png';
const EditMeeting = ({ route }) => {
    const { eventId, date, time, location, locationId } = route.params;
    console.log("Event Details--------------",eventId, date, time, location, locationId);
  const navigation = useNavigation();
  const [showCalendar, setShowCalendar] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [dates, setDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [SlotID, setSlotID] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user?.userId);
  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };
  const onDaySelect = (day) => {
    setSelectedDate(day.dateString);
    setShowCalendar(false);
  };
  const updateMeeting = async () => {
    console.log("LocationID--------------", locationId, selectedDate, dates, SlotID);
    if (!selectedDate || !dates || !locationId || SlotID === null) {
        Alert.alert('Error', 'Please select a date, time, location, and slot.');
        return;
    }
    const formattedDateTime = `${selectedDate} ${dates instanceof Date 
      ? dates.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) 
      : time}`;

    const meetingData = {
        EventId: eventId,
        LocationID: locationId,
        DateTime: formattedDateTime,
        ConfirmationStatus: 1,
        SlotID,
    };
    console.log("meetingData----------------", meetingData);

    try {
        const response = await fetch(`${API_BASE_URL}/api/meetings/${userId}`, { 
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(meetingData),
        });

        if (response.ok) {
            Alert.alert('Success', 'Meeting updated successfully!');
            navigation.goBack();
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update meeting');
        }
    } catch (error) {
        console.error('Error updating meeting:', error);
        Alert.alert('Error', error.message || 'Failed to update meeting. Please try again.');
    }
};
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.iconContainer, SlotID === 1 && { backgroundColor: '#C23A8A' }]}
          onPress={() => setSlotID(1)}
        >
          <Image source={sun} style={{ width: 50, height: 50 }} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.iconContainer, SlotID === 2 && { backgroundColor: '#C23A8A' }]}
          onPress={() => setSlotID(2)}
        >
          <Image source={moon} style={{ width: 50, height: 50 }} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={toggleCalendar}>
        <View style={styles.section}>
          <Text style={styles.label}>{selectedDate ? selectedDate : date}</Text>
          <Icon name="calendar" size={30} color="#C23A8A" />
        </View>
      </TouchableOpacity>
      {showCalendar && (
        <Calendar
          onDayPress={onDaySelect}
          markedDates={{
            [selectedDate]: { selected: true, marked: true, selectedColor: '#C23A8A' },
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
          <Icon name="clock-o" size={30} color="#C23A8A" />
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
        <Text style={styles.label}>
          {profileData?.Location ? `${profileData.Location}` : location}
        </Text>
        <Icon name="map-marker" size={30} color="#C23A8A" />
      </View>
      <TouchableOpacity style={styles.button} onPress={updateMeeting}>
        <Text style={styles.buttonText}>Update Meeting</Text>
      </TouchableOpacity>
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
    color: '#C23A8A',
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
    color: '#C23A8A',
  },
  button: {
    backgroundColor: '#a3238f',
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
export default EditMeeting;