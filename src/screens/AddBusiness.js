import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { API_BASE_URL } from '../constants/Config';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import AnimatedTextInput from './AnimatedTextInput';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from '../components/layout/AddBusiness';
const AddBusiness = () => {
    const user = useSelector((state) => state.user?.Id);
    console.log("User in Add Business-----------",user);
  const userId = useSelector((state) => state.user?.userId);
  console.log("UserID in ADD BUSINESS------------",userId);
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [profession, setProfession] = useState([]); 
  const [selectedProfession, setSelectedProfession] = useState('');
  const [chapterType, setChapterType] = useState([]); 
  const [selectedChapterType, setSelectedChapterType] = useState('');
  const [LocationID, setLocationID] = useState([]); 
  const [selectedLocation, setSelectedLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [addressError, setAddressError] = useState('');
 const [businessNameError, setBusinessNameError] = useState('');
 const [selectedProfessionError, setSelectedProfessionError] = useState('');
 const [selectedLocationError, setSelectedLocationError] = useState('');
 const [selectedSlotError,setSelectedslotError] =useState('');
 const [dateError,setSelecteddateError]= useState('');
 useEffect(() => {
    fetch(`${API_BASE_URL}/execute-profession`)
      .then((response) => response.json())
      .then((data) => setProfession(data.executeprofession))
      .catch((error) => console.error(error));
  }, []);
 const fetchLocationsByProfession = async (selectedProfession) => {
    console.log('Selected Profession:', selectedProfession);

    try {
      const response = await fetch(`${API_BASE_URL}/available-location?profession=${selectedProfession}`);
      const data = await response.json();
    
      setLocationID(data.availableLocations); 
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
};
 const handleProfessionChange = (profession) => {
    setSelectedProfession(profession); 
    setSelectedLocation(null);
    setSelectedChapterType(null);
    fetchLocationsByProfession(profession);
  };
 const handleRegister = async () => { 
    setEmailError('');
    setAddressError('');
    setBusinessNameError('');
    setSelectedProfessionError('');
    setSelectedLocationError('');
    setSelecteddateError('');

    let isValid = true;    
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Invalid email format');
      isValid = false;
    }
    if (!address) {
      setAddressError('Address is required');
      isValid = false;
    }
    if (!businessName) {
      setBusinessNameError('Business Name is required');
      isValid = false;
    }
    if (!selectedProfession) {
      setSelectedProfessionError('Profession is required');
      isValid = false;
    }
    if (!selectedLocation) {
      setSelectedLocationError('Location is required');
      isValid = false;
    }
    if (!chapterType) {
      setSelectedslotError('Slot is required');
      isValid = false;
    }
    if (!startDate) {
      setSelecteddateError('Date is required');
      isValid = false;
    }
    if (isValid) {
        try {
            const response = await fetch(`${API_BASE_URL}/AddBusiness/${userId}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email,
                address,
                businessName,
                profession: selectedProfession,
                chapterType: selectedChapterType,
                LocationID: selectedLocation,
                startDate,
                endDate
              }),
            });
            const data = await response.json();
            console.log('Registration successful:', data);
            navigation.goBack();
          } catch (error) {
            console.error('Error registering data:', error);
          }          
    }
};
const fetchChapterTypes = async (selectedLocation, selectedProfession) => {
  console.log("Location and Profession---------------",selectedLocation,selectedProfession);
    try {
        const response = await fetch(`${API_BASE_URL}/getSlotByBusiness?userId=${userId}&locationId=${selectedLocation}&profession=${selectedProfession}`);
        const data = await response.json();
        console.log("Data of Chapter types----------------",data);
        setChapterType(data.getslot);
        
        if (response.ok) {
          console.log('Available Slots:', data);
        } else {
          console.error('Error:', data.message);
        }
      } catch (error) {
        console.error('Error fetching available slots:', error);
      }
  };
const handlelocationChange = (selectedLocation) => {
    setSelectedLocation(selectedLocation);
    if(selectedProfession && selectedLocation){
      fetchChapterTypes(selectedLocation, selectedProfession);
    }
  };
const onChangeStartDate = (event, selectedDate) => {
    setShowStartPicker(false);
    if (selectedDate) {
      const formattedStartDate = selectedDate.toISOString().split('T')[0];
      setStartDate(formattedStartDate);

      const oneYearLater = new Date(selectedDate);
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
      const formattedEndDate = oneYearLater.toISOString().split('T')[0];
      setEndDate(formattedEndDate);
    }
  };
  const onChangeEndDate = (event, selectedDate) => {
    setShowEndPicker(false);
    if (selectedDate) {
      const formattedEndDate = selectedDate.toISOString().split('T')[0];
      setEndDate(formattedEndDate);
    }
  };
  return (
    <ScrollView>
        <View style={styles.container}>
    <View>
    <Icon name="envelope" size={24} color="gray" style={styles.iconStyle} />
    <AnimatedTextInput
      placeholder="Email"
      value={email}
      onChangeText={setEmail}
    />
  </View>
  {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
  <View style={styles.inputContainer}>
    <Icon name="home" size={24} color="gray" style={styles.iconStyle} />
    <AnimatedTextInput
      placeholder="Address"
      value={address}
      onChangeText={setAddress}
    />
  </View>
  {addressError ? <Text style={styles.errorText}>{addressError}</Text> : null}
  <View style={styles.inputContainer}>
  <Icon name="briefcase" size={24} color="gray" style={styles.iconStyle} />
 <AnimatedTextInput
    placeholder="Business Name"
    value={businessName}
    onChangeText={setBusinessName}
  />
  </View>
  {businessNameError ? <Text style={styles.errorText}>{businessNameError}</Text> : null}
  {selectedProfessionError ? <Text style={styles.errorText}>{selectedProfessionError}</Text> : null}
 <View style={styles.selectList}>
      <Picker
        selectedValue={selectedProfession}
        onValueChange={(itemValue) =>handleProfessionChange(itemValue)}
         >
        <Picker.Item label="Select Profession" value="" />
        {profession.map((item) => (
          <Picker.Item key={item.Id} label={item.ProfessionName} value={item.ProfessionName} />
        ))}
      </Picker>
      {selectedProfessionError && <Text style={styles.errorText}>{selectedProfessionError}</Text>}
    </View>
    {selectedLocationError ? <Text style={styles.errorText}>{selectedLocationError}</Text> : null}
    <View style={styles.selectList}>
      <Picker borderBottomWidth='1'
        selectedValue={selectedLocation}
        onValueChange={(itemValue) => handlelocationChange(itemValue)}
      >
        <Picker.Item label="Select Location" value="" />
        {LocationID.map((item,index) => (
          <Picker.Item  key={index} label={item.location} value={item.value} />
        ))}
      </Picker>
      {selectedLocationError && <Text style={styles.errorText}>{selectedLocationError}</Text>}
    </View>
    {selectedSlotError ? <Text style={styles.errorText}>{selectedSlotError}</Text> : null}
    {/* <View style={styles.selectList}>
    
      <Picker label="Select slot" value=""
        selectedValue={selectedChapterType}
        onValueChange={(itemValue) => setSelectedChapterType(itemValue)}
        style={styles.picker}
        >
        {chapterType.map((slot) => (
          <Picker.Item key={slot.id} label={slot.id} value={slot.id} />
        ))}
      </Picker>
    </View>  */}
    <View style={styles.selectList}>
  <Picker
    selectedValue={selectedChapterType}
    onValueChange={(itemValue) => setSelectedChapterType(itemValue)}
    style={styles.picker}
  >
    <Picker.Item label="Select Slot" value="" />
    {chapterType.map((slot) => (
      <Picker.Item key={slot.Id} label={`Slot ${slot.Id}`} value={slot.Id} />
    ))}
  </Picker>
</View>

    {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}
  <Text style={styles.label}>Start Date</Text>
  <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.datePickerButton}>
    <Text style={styles.datePickerText}>{startDate ? startDate : 'Select Start Date'}</Text>
  </TouchableOpacity>
  {showStartPicker && (
    <DateTimePicker
      value={startDate ? new Date(startDate) : new Date()}
      mode="date"
      display="default"
      onChange={onChangeStartDate}
    />
  )}
  <Text style={styles.label}>End Date</Text>
  <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.datePickerButton}>
    <Text style={styles.datePickerText}>{endDate ? endDate : 'Select End Date'}</Text>
  </TouchableOpacity>

  {showEndPicker && (
    <DateTimePicker
      value={endDate ? new Date(endDate) : new Date()}
      mode="date"
      display="default"
      onChange={onChangeEndDate}
    />
  )}
    <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
    <Text style={styles.registerButtonText}>Add Business</Text>
  </TouchableOpacity>
  </View>
</ScrollView>
  );
};
export default AddBusiness