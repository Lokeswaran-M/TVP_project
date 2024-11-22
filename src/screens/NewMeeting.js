import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Calendar } from 'react-native-calendars';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { API_BASE_URL } from '../constants/Config';
import sun from '../../assets/images/sun.png';
import moon from '../../assets/images/moon.png';

const NewMeeting = () => {
  const navigation = useNavigation();
  const [showCalendar, setShowCalendar] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [SlotIDs, setSlotIDs] = useState([]);
  const [date, setDate] = useState(null);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [loading, setLoading] = useState(true);
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
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createMeeting = async (slotIDs) => {
    if (!selectedDate || !date || !profileData.LocationID || slotIDs.length === 0) {
      Alert.alert('Error', 'Please select a date, time, location, and at least one slot.');
      return;
    }

    const promises = slotIDs.map(async (SlotID) => {
      const meetingData = {
        CreatedBy: userId,
        LocationID: profileData.LocationID,
        DateTime: `${selectedDate} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' , hour12: false})}`,
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
      Alert.alert('Success', 'Meetings created successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to create one or more meetings. Please try again.');
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

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create :</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.iconContainer, SlotIDs.includes(1) && { backgroundColor: '#C23A8A' }]}
          onPress={() => handleSlotClick(1)}
        >
          <Image source={sun} style={{ width: 50, height: 50 }} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.iconContainer, SlotIDs.includes(2) && { backgroundColor: '#C23A8A' }]}
          onPress={() => handleSlotClick(2)}
        >
          <Image source={moon} style={{ width: 50, height: 50 }} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={toggleCalendar}>
        <View style={styles.section}>
          <Text style={styles.label}>{selectedDate ? selectedDate : 'Date'}</Text>
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
      <TouchableOpacity onPress={showTimePicker}>
        <View style={styles.section}>
          <Text style={styles.label}>
            {date ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true  }) : 'Time'}
          </Text>
          <Icon name="clock-o" size={30} color="#C23A8A" />
        </View>
      </TouchableOpacity>
      <DateTimePickerModal
      
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleTimeConfirm}
        onCancel={hideTimePicker}
      />
      <View style={styles.section}>
        <Text style={styles.label}>
          {profileData?.Location ? `${profileData.Location}` : 'Location'}
        </Text>
        <Icon name="map-marker" size={30} color="#C23A8A" />
      </View>
      <TouchableOpacity style={styles.button} onPress={() => createMeeting(SlotIDs)}>
        <Text style={styles.buttonText}>Create Meeting</Text>
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

export default NewMeeting;