import React, { useState, useEffect, useRef } from 'react';
import { View,Image, TextInput,Button, ActivityIndicator,Animated,TouchableOpacity,TouchableWithoutFeedback,StyleSheet,Keyboard,Text, Alert } from 'react-native';
import CustomInput from './Custom_input';
import { ScrollView } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import AnimatedTextInput from './AnimatedTextInput';
import Icon from 'react-native-vector-icons/FontAwesome';
import {API_BASE_URL} from '../constants/Config'
// import Newteam from '../../assets/images/Newteam.png'; 

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

  const [chapterType, setChapterType] = useState([]); 
  const [selectedChapterType, setSelectedChapterType] = useState('');

  const [LocationID, setLocationID] = useState([]); 
  const [selectedLocation, setSelectedLocation] = useState('');

  // const [availabledata, setAvailableData] = useState([]);
  // const [availableLocation, setAvailableLocation] = useState(['']);

  const [referredBy, setReferredBy] = useState('');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // const [loading, setLoading] = useState(true);

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
 const [selectedSlotError,setSelectedslotError] =useState('');
 const [dateError,setSelecteddateError]= useState('');
 const [referredByError, setReferredByError] = useState('');
 const [isUsernameValid, setIsUsernameValid] = useState(false);
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
const fetchChapterTypes = async (selectedLocation, selectedProfession) => {
  try {
    const response = await fetch(`${API_BASE_URL}/execute-getslot?Location=${selectedLocation}&Profession=${selectedProfession}`, {
    });
    const data = await response.json();
    setChapterType(data.getslot); 
    console.log('Fetched slot details:=========', data);
  } catch (error) {
    console.error('Error fetching slots:', error);
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

    // Validation checks
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
      if (data.length > 0 && data[0].count !== undefined) {
        console.log("Data----------", data[0].count);
        if (data[0].count > 1) {
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
      console.error('Error:', err);
      setUsernameError('Error validating username');
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
    if (!chapterType) {
      setSelectedslotError('Slot is required');
      isValid = false;
    }
    if (!referredBy) {
      setReferredByError('Referred By is required');
      isValid = false;
    }
    if (!startDate) {
      setSelecteddateError('Date is required');
      isValid = false;
    }
    if (isValid) {
      try {
        // Step 1: Fetch userId when the Register button is clicked
        const userIdResponse = await fetch(`${API_BASE_URL}/execute-getuserid`);
        const userIdData = await userIdResponse.json();
        
        if (userIdData.NextuserId && userIdData.NextuserId.length > 0) {
          const generatedUserId = userIdData.NextuserId[0].UserId;
          console.log('Extracted UserId:', generatedUserId);
          setUserId(generatedUserId); // Set userId in state

          // Step 2: Register user with the generated userId
          const response = await fetch(`${API_BASE_URL}/RegisterAlldata`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user: {
                userId: generatedUserId,  // Use the generated userId here
                username,
                Password: password,
                Mobileno,
              },
              business: {
                email,
                address,
                businessName,
                profession: selectedProfession,
                chapterType: selectedChapterType,
                LocationID: selectedLocation,
                referredBy,
                startDate,
                endDate
              }
            }),
          });

          const data = await response.json();
          console.log('Registration successful:', data);

          // Navigate to the OTP screen with the mobile number
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
              <Icon name={passwordVisible ? "eye" : "eye-slash"} size={24} color="#888" />
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
              <Icon name={passwordVisible1 ? "eye" : "eye-slash"} size={24} color="#888" />
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

        {/* <Text style={styles.label}>Select Slot</Text> */}
        <View style={styles.selectList}>
        
          <Picker label="Select slot" value=""
            selectedValue={selectedChapterType}
            onValueChange={(itemValue) => setSelectedChapterType(itemValue)}
            style={styles.picker}
            >
            {chapterType.map((slot) => (
              <Picker.Item key={slot.id} label={slot.id} value={slot.id} />
            ))}
          </Picker>

        </View>
        
        <View style={styles.inputContainer}>
        <Icon name="user-plus" size={24} color="gray" style={styles.iconStyle} />
          <AnimatedTextInput
        placeholder="Referred By"
        value={referredBy}
        onChangeText={setReferredBy}
      />
      </View>
      {referredByError ? <Text style={styles.errorText}>{referredByError}</Text> : null}
       
        {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}
       {/* Start Date */}
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

      {/* End Date */}
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

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>
   
        {/* <Button title="Register" onPress={handleRegister} /> */}
      </View>
    </ScrollView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    // justifyContent: 'center',
    // alignItems: 'center',
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
    // marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    color: 'black',
    fontSize: 20,
    paddingHorizontal: 10,
    // backgroundColor: '#ccc',
    borderColor : '#ccc'
  },
    selectList: {
      borderWidth: 1,
      borderColor: '#ccc',
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
      // backgroundColor: '#fff',
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
      backgroundColor: '#a3238f', 
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
      marginRight: 10,
      // marginLeft: 'auto',
      marginTop: 30,
      position: 'absolute',
      zIndex: 1,
      // justifyContent: 'right',
      // display : 'flex',
      // float: 'right',
      marginLeft: 325,
    },
    input: {
      flex: 1,
    },
    errorText: {
      color: 'red',
      marginBottom: 8,
    },
    // image: {
    //   width: 300,
    //   height: 250, 
    //   resizeMode: 'contain',
    // },
});
export default RegisterScreen;