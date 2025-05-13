import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,TextInput, Alert} from 'react-native';
import { API_BASE_URL } from '../constants/Config';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import AnimatedTextInput from './AnimatedTextInput';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from '../components/layout/AddBusiness';
import { Dropdown } from 'react-native-element-dropdown';
const AddBusiness = () => {
  const [profileData, setProfileData] = useState({});
  console.log("Profile data in Add Business--------------",profileData);
  const user = useSelector((state) => state.user?.Id);
  console.log("User in Add Business-----------",user);
  const userId = useSelector((state) => state.user?.userId);
  console.log("UserID in ADD BUSINESS------------",userId);
  console.log("User Roll in ADD BUSINESS------------",profileData);
  console.log("User location in Add Business------------",profileData.LocationID);
  console.log("User Roll Id in Add Business---------------",profileData.RollId);
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [profession, setProfession] = useState([]);
  const [selectedProfession, setSelectedProfession] = useState('');
  const [chapterType, setChapterType] = useState([]); 
  const [selectedChapterType, setSelectedChapterType] = useState('');
  const [LocationID, setLocationID] = useState([]); 
  const [selectedLocation, setSelectedLocation] = useState(profileData.LocationID);
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
 const fetchData = async () => {
  try {
    const profileResponse = await fetch(`${API_BASE_URL}/api/user/business-info/${userId}`);
    if (!profileResponse.ok) {
      throw new Error('Failed to fetch profile data');
    }
    const profileData = await profileResponse.json();
    console.log("Fetched profile data:", profileData);
    if (profileResponse.status === 404) {
      setProfileData({});
    } else {
      setProfileData(profileData);
    }
    if (profileData.RollId === 2) {
      const { LocationID: locationId, ChapterType: chapterType } = profileData;
      // chapterType = chapterType === '1' ? '2' : '1';
      if (locationId && chapterType) {
        console.log(`LocationID: ${locationId}, ChapterType: ${chapterType}`);
        const excludeResponse = await fetch(`${API_BASE_URL}/api/professions/exclude-business-location/${locationId}/${chapterType}`);
        if (!excludeResponse.ok) {
          throw new Error(`HTTP error! status: ${excludeResponse.status}`);
        }
        const excludeData = await excludeResponse.json();
        console.log('Exclude professions data:', excludeData);
        setProfession(excludeData);
      } else {
        console.error('LocationID or ChapterType is missing');
      }
    } else {
      console.log('Fetching execute professions for RollId 3');
      const executeResponse = await fetch(`${API_BASE_URL}/execute-profession`);
      if (!executeResponse.ok) {
        throw new Error(`HTTP error! status: ${executeResponse.status}`);
      }
      const executeData = await executeResponse.json();
      console.log('Execute professions data:', executeData.executeprofession);
      setProfession(executeData.executeprofession);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
useFocusEffect(
  useCallback(() => {
    console.log('Fetching profile data for userId:', userId);
    fetchData();
  }, [userId])
);  
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
      } else if (email !== email.toLowerCase()) {
        setEmailError('Email should be in lowercase');
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
    if (profileData.RollId === 2) {
        if (!profileData.LocationID) {
            setSelectedLocationError('Location is required');
            isValid = false;
        }
    } else if (profileData.RollId === 3) {
        if (!selectedLocation) {
            setSelectedLocationError('Location is required');
            isValid = false;
        }
    }
    if (profileData.RollId === 2) {
        if (selectedChapterType === '') {
            setSelectedslotError('Slot is required');
            isValid = false;
        }
    }
    if (!startDate) {
        setSelecteddateError('Date is required');
        isValid = false;
    }

    if (isValid) {
        try {
            const LocationID = profileData.RollId === 2 ? profileData.LocationID : selectedLocation;
            const adjustedChapterType = profileData.ChapterType === 1 ? 2 : 1;
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
                    chapterType: adjustedChapterType,
                    LocationID,
                    startDate,
                    endDate
                }),
            });
            const data = await response.json();
            console.log('Registration successful:', data);
            Alert.alert('Success', 'Registration successful!', [{ text: 'OK' }]);
            setTimeout(() => {
              navigation.pop(2);
            }, 3000);
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
 <View>
 <Dropdown
  style={styles.dropdown}
  placeholderStyle={styles.placeholderStyle}
  selectedTextStyle={styles.selectedTextStyle}
  placeholder="Select Profession"
  data={profession.map((item, index) => ({
    label: item.ProfessionName,
    value: item.ProfessionName,
    backgroundColor: index % 2 === 0 ? 'white' : '#f5f7ff',
  }))}
  value={selectedProfession}
  onChange={(item) => handleProfessionChange(item.value)}
  search
  searchPlaceholder="Search Profession"
  labelField="label"
  valueField="value"
  inputSearchStyle={styles.inputSearchStyle}
  renderItem={(item) => (
    <View style={[styles.item, { backgroundColor: item.backgroundColor }]}>
      <Text style={styles.itemText}>{item.label}</Text>
    </View>
  )}
/>
      {selectedProfessionError && <Text style={styles.errorText}>{selectedProfessionError}</Text>}
    </View>
    {profileData.RollId === 2 && (
        <>
    <View style={styles.selectList}>
  <TextInput
    style={styles.textInput}
    value={profileData.LocationName || 'None'}
    editable={false}
  />
  {selectedLocationError && <Text style={styles.errorText}>{selectedLocationError}</Text>}
</View>
{selectedSlotError ? <Text style={styles.errorText}>{selectedSlotError}</Text> : null}
<View style={styles.selectList}>
      <TextInput
        style={styles.textInput}
        value={profileData.ChapterType === '2' ? '1' : '2'}
        editable={false}
      />
    </View>
</>
      )}
      {profileData.RollId === 3 && (
        <>
<View>
<Dropdown
  style={styles.dropdown}
  placeholderStyle={styles.placeholderStyle}
  selectedTextStyle={styles.selectedTextStyle}
  placeholder="Select Location"
  data={LocationID.map((item, index) => ({
    label: item.location,
    value: item.value,
    backgroundColor: index % 2 === 0 ? 'white' : '#f5f7ff',
  }))}
  value={selectedLocation}
  onChange={(item) => handlelocationChange(item.value)}
  search
  searchPlaceholder="Search Location"
  labelField="label"
  valueField="value"
  inputSearchStyle={styles.inputSearchStyle}
  renderItem={(item) => (
    <View style={[styles.item, { backgroundColor: item.backgroundColor }]}>
      <Text style={styles.itemText}>{item.label}</Text>
    </View>
  )}
/>
      {selectedLocationError && <Text style={styles.errorText}>{selectedLocationError}</Text>}
    </View>
    {selectedSlotError ? <Text style={styles.errorText}>{selectedSlotError}</Text> : null}
    <View>
    <Dropdown
        data={chapterType}
        labelField="Slots"
        valueField="Id"
        placeholder="Select Slot"
        value={selectedChapterType}
        onChange={(item) => {
          setSelectedChapterType(item.Id);
        }}
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
      />
</View>
</>
      )}
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
  <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.datePickerButton} disabled={true}>
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
export default AddBusiness;