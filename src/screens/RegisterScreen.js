import React, { useState, useEffect, useRef } from 'react';
import { View,Image, TextInput,Button, ActivityIndicator,Animated,TouchableOpacity,TouchableWithoutFeedback,StyleSheet,Keyboard,Text, Alert } from 'react-native';
import CustomInput from './Custom_input';
import { ScrollView } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import AnimatedTextInput from './AnimatedTextInput';
import Icon from 'react-native-vector-icons/FontAwesome';
import {API_BASE_URL} from '../constants/Config'
  const RegisterScreen = () => {
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [Mobileno, setMobileno] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [profession, setProfession] = useState([]); 
  const [selectedProfession, setSelectedProfession] = useState('');
  const [LocationID, setLocationID] = useState([]); 
  const [selectedLocation, setSelectedLocation] = useState('');
  const [referredBy, setReferredBy] = useState('');
  const [referLocationId, setReferLocationId] = useState('');
  const [referProfession, setreferProfession] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const navigation = useNavigation();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisible1, setPasswordVisible1] = useState(false);
  const scrollViewRef = useRef(null);
  const usernameInputRef = useRef(null);
 const [usernameError, setUsernameError] = useState('');
 const [passwordError, setPasswordError] = useState('');
 const [confirmPasswordError, setConfirmPasswordError] = useState('');
 const [MobilenoError, setMobilenoError] = useState('');
 const [emailError, setEmailError] = useState('');
 const [addressError, setAddressError] = useState('');
 const [businessNameError, setBusinessNameError] = useState('');
 const [selectedProfessionError, setSelectedProfessionError] = useState('');
 const [selectedLocationError, setSelectedLocationError] = useState('');
 const [dateError,setSelecteddateError]= useState('');
 const [referredByError, setReferredByError] = useState('');
 const [isUsernameValid, setIsUsernameValid] = useState(false);
 const [referMembers, setreferMembers] = useState([]);
 const togglePasswordVisibility = () => {
  setPasswordVisible(!passwordVisible);
};
const togglePasswordVisibility1 = () => {
  setPasswordVisible1(!passwordVisible1);
};
  useEffect(() => {
    fetch(`${API_BASE_URL}/execute-profession`)
      .then((response) => response.json())
      .then((data) => setProfession(data.executeprofession))
      .catch((error) => console.error(error));
  }, []);

const fetchLocationsByProfession = async (selectedProfession) => {
  console.log('🔍 Step 1: Selected profession received from component:', selectedProfession);

  try {
    const encodedProfession = encodeURIComponent(selectedProfession);
    console.log('🔍 Step 2: Encoded profession for URL:', encodedProfession);

    const url = `${API_BASE_URL}/available-location?profession=${encodedProfession}`;
    console.log('🔍 Step 3: Full API URL to be called:', url);

    const response = await fetch(url);
    console.log('🔍 Step 4: Raw fetch response:', response);

    const data = await response.json();
    console.log('🔍 Step 5: JSON-parsed API response:', data);

    if (response.ok) {
      console.log('✅ Step 6: Response status is OK (200)');

      if (data.availableLocations && Array.isArray(data.availableLocations) && data.availableLocations.length > 0) {
        console.log('✅ Step 7: Locations found:', data.availableLocations);
        
        // Map the locations to the required format for the Dropdown
        const formattedLocations = data.availableLocations.map((item, index) => ({
          label: item.LocationName,  // Correct field for the label
          value: item.LocationID,    // Correct field for the value
          backgroundColor: index % 2 === 0 ? 'white' : '#F3ECF3', // Alternating background color
        }));
        
        setLocationID(formattedLocations);  // Update the state with formatted data
        console.log('✅ Step 8: Locations state updated');
      } else {
        console.warn('⚠️ Step 7: No locations found for this profession');
        setLocationID([]);  // Clear locations if none are found
        console.log('⚠️ Step 8: Locations state cleared');
      }
    } else {
      console.error('❌ Step 6: API responded with an error:', data.ErrorMessage);
    }
  } catch (error) {
    console.error('❌ Step 9: Network or fetch error occurred:', error);
  }
};



  const fetchReferMembers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/ReferMembers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const responseText = await response.text();
      console.log("Raw response text:", responseText);
      const data = JSON.parse(responseText);
      console.log("Data for refer members--------------------", data);
      setreferMembers(data.members);
    } catch (error) {
      console.error('Error fetching refer members:', error);
    }
  };
  
  useEffect(() => {
    fetchReferMembers();
  }, []);
  const handleProfessionChange = (profession) => {
    setSelectedProfession(profession); 
    setSelectedLocation(null);
    fetchLocationsByProfession(profession);
  };

const handleReferredByChange = (itemValue) => {
  setReferredBy(itemValue);
  const selectedMember = referMembers.find((member) => member.UserId === itemValue);
  if (selectedMember) {
    setReferLocationId(selectedMember.LocationID);
    setreferProfession(selectedMember.Profession);
  }
};
const handlelocationChange = (selectedLocation) => {
  setSelectedLocation(selectedLocation);
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
  const handleRegister = async () => { 
    setUsernameError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setMobilenoError('');
    setEmailError('');
    setAddressError('');
    setBusinessNameError('');
    setSelectedProfessionError('');
    setSelectedLocationError('');
    setReferredByError('');
    setSelecteddateError('');
    let isValid = true;
    if (!username) {
      setUsernameError('Username is required');
      isValid = false;
    }
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/user-count?username=${username}`);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json();
      console.log("Full Response:", data);
    
      if (data.count !== undefined) {
        console.log("Count----------", data.count);
        if (data.count > 0) {
          setUsernameError('Username already taken');
          Alert.alert("Error", "Username already taken");
          setIsUsernameValid(false);
          usernameInputRef.current?.focus();
          scrollViewRef.current?.scrollTo({ y: 0, animated: true });
          isValid = false;
        } else {
          setUsernameError('');
          setIsUsernameValid(true);
        }
      } else {
        setUsernameError('Invalid response from server');
      }
    } catch (err) {
      setUsernameError('Username is required');
      isValid = false;
    }          
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }
    if (!Mobileno) {
      setMobilenoError('Mobile number is required');
      isValid = false;
    } else if (Mobileno.length !== 10) {
      setMobilenoError('Mobile number must be 10 digits');
      isValid = false;
    }
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

    if (!startDate) {
      setSelecteddateError('Date is required');
      isValid = false;
    }
    if (isValid) {
      try {
        const userIdResponse = await fetch(`${API_BASE_URL}/execute-getuserid`);
        const userIdData = await userIdResponse.json();
        
      if (userIdData.NextuserId) {
  const generatedUserId = userIdData.NextuserId;
  console.log('Extracted UserId:', generatedUserId);
  setUserId(generatedUserId);

          const response = await fetch(`${API_BASE_URL}/RegisterAlldata`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user: {
                userId: generatedUserId,
                username,
                Password: password,
                Mobileno,
              },
              business: {
                email,
                address,
                businessName,
                profession: selectedProfession,
                LocationID: selectedLocation,
                referredBy, 
        referLocationId,
        referProfession,
                startDate,
                endDate
              }
            }),
          });
          const data = await response.json();
          console.log('Registration successful:', data);
          navigation.navigate('Otpscreen', { Mobileno });
        } else {
          console.error('No UserId found in the response!');
        }
      } catch (error) {
        console.error('Error registering user:', error);
      }
    }
};
  return (
    <ScrollView>
    <View style={styles.container}>
      <View>
        <Icon name="user" size={24} color="gray" style={styles.iconStyle} />
        <AnimatedTextInput
        ref={usernameInputRef}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
      </View>
      {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
      <View>
    </View>
      <View>
      <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconStyle}>
              <Icon name={passwordVisible ? "eye" : "eye-slash"} size={24} color="black" />
            </TouchableOpacity>
        <AnimatedTextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!passwordVisible}
        />
      </View>
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
      <View>
      <TouchableOpacity onPress={togglePasswordVisibility1} style={styles.iconStyle}>
              <Icon name={passwordVisible1 ? "eye" : "eye-slash"} size={24} color="black" />
            </TouchableOpacity>
        <AnimatedTextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!passwordVisible1}
        />
      </View>
      {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
      <View>
        <Icon name="phone" size={24} color="gray" style={styles.iconStyle} />
        <AnimatedTextInput
          placeholder="Mobile Number"
          value={Mobileno}
          keyboardType="phone-pad"
          onChangeText={setMobileno}
        />
      </View>
      {MobilenoError ? <Text style={styles.errorText}>{MobilenoError}</Text> : null}
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
<Dropdown
  style={styles.dropdown}
  placeholderStyle={styles.placeholderStyle}
  selectedTextStyle={styles.selectedTextStyle}
  placeholder="Select Location"
  data={Array.isArray(LocationID) && LocationID.length > 0 ? LocationID.map((item, index) => ({
    label: item.label,  
    value: item.value,  
    backgroundColor: item.backgroundColor,  
  })) : []} 
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

          <Dropdown
  style={styles.dropdown}
  placeholderStyle={styles.placeholderStyle}
  selectedTextStyle={styles.selectedTextStyle}
  placeholder="Select Referred By"
  data={referMembers.map((member, index) => ({
    label: member.UserInfo,
    value: member.UserId,
    backgroundColor: index % 2 === 0 ? 'white' : '#f5f7ff',
  }))}
  value={referredBy}
  onChange={(item) => handleReferredByChange(item.value)}
  search
  searchPlaceholder="Search Referred By"
  labelField="label"
  valueField="value"
  inputSearchStyle={styles.inputSearchStyle}
  renderItem={(item) => (
    <View style={[styles.item, { backgroundColor: item.backgroundColor }]}>
      <Text style={styles.itemText}>{item.label}</Text>
    </View>
  )}
/>
      {referredByError ? <Text style={styles.errorText}>{referredByError}</Text> : null}
      
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
      <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.datePickerButton} disabled={true} >
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
      {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  container1: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  label: {
    marginVertical: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4b5059',
  },
    selectList: {
      borderWidth: 2,
      borderColor: '#2e3192',
      borderRadius:10,
      overflow: 'hidden',
      marginVertical: 10,
    },
    datePickerButton: {
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      padding: 15,
      width: '100%',
      alignItems: 'center',
    },
    datePickerText: {
      fontSize: 16,
      color: '#333',
    },
    
    errorText: {
      color: 'red',
      marginBottom: 10,
    },
    registerButton: {
      backgroundColor: '#2e3192', 
      padding: 15,
      borderRadius: 5,
      alignItems: 'center',
      marginTop:10,
      marginBottom: 10,
    },
    registerButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
iconStyle: {
  color: 'black',
  position: 'absolute',
  right: 10, 
  top: 25,  
  zIndex: 1,
},
dropdown: {
  height: 55,
  borderWidth: 2,
  borderColor: '#2e3192',
  borderRadius: 10,
  paddingHorizontal: 20,
  overflow: 'hidden',
  marginVertical: 10,

},
readOnlyText: {
  height: 50,
  lineHeight: 50,
  borderColor: '#ccc',
  borderWidth: 1,
  borderRadius: 5,
  paddingHorizontal: 10,
  color: '#666',
  backgroundColor: '#f5f5f5',
},
placeholderStyle: {
  color: '#888',
  fontSize: 18,
  // paddingLeft: 10,
},
selectedTextStyle: {
  color: '#000',
  fontSize: 18,
},
inputSearchStyle: {
  // borderWidth: 1,
  borderColor: '#2e3192',
  borderRadius: 8, 
  // paddingHorizontal: -10,
  height: 40, 
  color: 'black',
},
item: {
  height: 50,
  justifyContent: 'center',
  paddingLeft: 20,
},
itemText: {
  fontSize: 15,
  color: '#000',
},          

});
export default RegisterScreen;

