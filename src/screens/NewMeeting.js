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

const NewMeeting = () => {
  const navigation = useNavigation();
  const [showCalendar, setShowCalendar] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [date, setDate] = useState(null);
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

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/business-info/${userId}`);
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

  const createMeeting = async () => {
    if (!selectedDate || !date || !profileData?.LocationID) {
      Alert.alert('Error', 'Please select a date, time, and location.');
      return;
    }

    const meetingData = {
      EventId: '3001',
      UserId: userId,
      LocationID: profileData.LocationID,
      DateTime: `${selectedDate} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      ConfirmationStatus: 1,
      SlotID: 1
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/meetings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(meetingData),
      });

      if (response.ok) {
        Alert.alert('Success', 'Meeting created successfully!');
        navigation.goBack();
      } else {
        throw new Error('Failed to create meeting');
      }
    } catch (error) {
      console.error('Error creating meeting:', error);
      Alert.alert('Error', 'Failed to create meeting. Please try again.');
    }
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
        <TouchableOpacity style={styles.iconContainer}>
          <Image source={sun} style={{ width: 50, height: 50 }} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer}>
          <Image source={moon} style={{ width: 50, height: 50 }} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={toggleCalendar}>
        <View style={styles.section}>
          <Text style={styles.label}>{selectedDate ? selectedDate : "Date"}</Text>
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
            {date ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Time"}
          </Text>
          <Icon name="clock-o" size={30} color="#C23A8A" />
        </View>
      </TouchableOpacity>
      <DatePicker
        modal
        mode="time"
        open={open}
        date={date || new Date()}
        onConfirm={(selectedTime) => {
          setOpen(false);
          setDate(selectedTime); 
        }}
        onCancel={() => setOpen(false)}
      />
      <View style={styles.section}>
        <Text style={styles.label}>
          {profileData?.LocationID ? profileData.LocationID : "Location"}
        </Text>
        <Icon name="map-marker" size={30} color="#C23A8A" />
      </View>
      <TouchableOpacity style={styles.button} onPress={createMeeting}>
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