import React, { useState, useEffect } from 'react';
import { View,Image, TextInput,Button, ActivityIndicator,Animated,TouchableOpacity,TouchableWithoutFeedback,StyleSheet,Keyboard,Text } from 'react-native';
import CustomInput from './Custom_input';
import { ScrollView } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import {API_BASE_URL} from '../constants/Config'
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import AnimatedTextInput from './AnimatedTextInput';
import Icon from 'react-native-vector-icons/FontAwesome';
// import Newteam from '../../assets/images/Newteam.png';

  const RegisterScreen = () => {
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 

  const [mobileNo, setMobileNo] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [businessName, setBusinessName] = useState('');

  const [profession, setProfession] = useState([]); 
  const [selectedProfession, setSelectedProfession] = useState('');

  const [chapterType, setChapterType] = useState([]); 
  const [selectedChapterType, setSelectedChapterType] = useState('');

  const [chapterNo, setChapterNo] = useState([]); 
  const [selectedLocation, setSelectedLocation] = useState('');

  // const [availabledata, setAvailableData] = useState([]);
  // const [availableLocation, setAvailableLocation] = useState(['']);

  const [referredBy, setReferredBy] = useState('');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisible1, setPasswordVisible1] = useState(false);


 // Validation error messages
 const [usernameError, setUsernameError] = useState('');
 const [passwordError, setPasswordError] = useState('');
 const [confirmPasswordError, setConfirmPasswordError] = useState('');
 const [mobileNoError, setMobileNoError] = useState('');
 const [emailError, setEmailError] = useState('');
 const [addressError, setAddressError] = useState('');
 const [businessNameError, setBusinessNameError] = useState('');
 const [selectedProfessionError, setSelectedProfessionError] = useState('');
 const [selectedLocationError, setSelectedLocationError] = useState('');
 const [selectedSlotError,setSelectedslotError] =useState('');
 const [dateError,setSelecteddateError]= useState('');
 const [referredByError, setReferredByError] = useState('');


 const togglePasswordVisibility = () => {
  setPasswordVisible(!passwordVisible);
};

const togglePasswordVisibility1 = () => {
  setPasswordVisible1(!passwordVisible1);
};

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      fetchChapterTypes();
    }
  }, [selectedLocation]); // Trigger fetch when selectedLocation changes

  const fetchData = async () => {
    setLoading(true);

    try {
   
      // Fetch userId
      const userIdResponse = await fetch('http://192.168.29.10:3000/execute-getuserid');
      const userIdData = await userIdResponse.json();
      console.log('UserId response:', userIdData); 

      // Extract UserId from the first object in the array
      if (userIdData.length > 0) {
        const userId = userIdData[0].UserId;
        setUserId(userId);
        console.log('Extracted UserId:', userId); 
      } else {
        console.error('No UserId found in the response!');
      }


      // Fetch professions
      const professionResponse = await fetch('http://192.168.29.10:3000/execute-profession');
      const professionData = await professionResponse.json();
      console.log('Professions:', professionData);
      setProfession(professionData);    

      // Fetch locations
      const locationResponse = await fetch('http://192.168.29.10:3000/available-location');

      const locationData = await locationResponse.json();
      console.log('Locations:', locationData);
      setChapterNo(locationData.availableLocations);


      //  // Fetch chapter types (slots)
      //  const chapterTypeResponse = await fetch(`http://192.168.29.81:3000/execute-getslot?Location=${chapterNo}`); 
      //  const chapterTypeData = await chapterTypeResponse.json();
      //  console.log('Chapter Types:', chapterTypeData);
      //  setChapterType(chapterTypeData);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
 const fetchChapterTypes = async () => {
    try {
      const chapterTypeResponse = await fetch(`http://192.168.29.10:3000/execute-getslot?Location=${selectedLocation}`); 
      const chapterTypeData = await chapterTypeResponse.json();
      console.log('Chapter Types:', chapterTypeData);
      setChapterType(chapterTypeData);
    } catch (error) {
      console.error('Error fetching chapter types:', error);
    }
  };

// choose date 
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

    // Reset error messages
    setUsernameError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setMobileNoError('');
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
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }
    if (!mobileNo) {
      setMobileNoError('Mobile number is required');
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
      setSelectedslotError('slot is required');
      isValid = false;
    }
    if (!referredBy) {
      setReferredByError('Referred By is required');
      isValid = false;
    }
    if (!startDate) {
      setSelecteddateError('date By is required');
      isValid = false;
    }
    if (isValid) {
    try {
      const response = await fetch('http://192.168.29.10:3000/RegisterAlldata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            userId:userId,
            username,
            Password: password,
            mobileNo,
            email
          },
          business: {
            address,
            businessName,
            profession: selectedProfession,
            chapterType: selectedChapterType,
            chapterNo: selectedLocation,
            referredBy,
            startDate,
            endDate
          }
        }),
      });
    
      const data = await response.json();
      console.log('response user =====',data.user)
      console.log('response business-----',data.business)
      navigation.navigate('Otpscreen',{ mobileNo });

      console.log('Registration successful:', data);
    } catch (error) {
      console.error('Error registering data:', error);
    }
  }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading data...</Text>
      </View>
    );
  }
  return (

    <ScrollView>
    <View style={styles.container}>
    {/* <View style={styles.container1}>
    <Image source={Newteam} style={styles.image} />
    </View> */}
      {/* Username Field */}
      <View>
        <Icon name="user" size={24} color="gray" style={styles.iconStyle} />
        <AnimatedTextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
      </View>
      {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}

      {/* Password Field */}
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

      {/* Confirm Password Field */}
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

      {/* Mobile Number Field */}
      <View>
        <Icon name="phone" size={24} color="gray" style={styles.iconStyle} />
        <AnimatedTextInput
          placeholder="Mobile Number"
          value={mobileNo}
          onChangeText={setMobileNo}
        />
      </View>
      {mobileNoError ? <Text style={styles.errorText}>{mobileNoError}</Text> : null}

      {/* Email Field */}
      <View>
        <Icon name="envelope" size={24} color="gray" style={styles.iconStyle} />
        <AnimatedTextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      {/* Address Field */}
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

        {/* <Text style={styles.label}>User ID: {userId}</Text> */}

        <Text style={styles.label}>Select Profession</Text>
        <View style={styles.selectList}>
        <Picker borderBottomWidth='1'
          selectedValue={selectedProfession}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedProfession(itemValue)}
        >
          {profession.map((profession, index) => (
            <Picker.Item key={index} label={profession.ProfessionName} value={profession.ProfessionName} />
          ))}
        </Picker>
        </View>
        {selectedLocationError ? <Text style={styles.errorText}>{selectedLocationError}</Text> : null}

        <Text style={styles.label}>Select Location</Text>
        <View style={styles.selectList}>
        <Picker borderBottomWidth='1'
          selectedValue={selectedLocation}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedLocation(itemValue)}
          >
          {chapterNo.map((chapterNo, index) => (
            <Picker.Item key={index} label={chapterNo.location} value={chapterNo.location} />
          ))}
        </Picker>
        </View>
        {selectedSlotError ? <Text style={styles.errorText}>{selectedSlotError}</Text> : null}

        <Text style={styles.label}>Select Slot</Text>
        <View style={styles.selectList}>
           <Picker borderBottomWidth='1'
          selectedValue={selectedChapterType}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedChapterType(itemValue)}
            >
          {chapterType.map((type, index) => (
            <Picker.Item key={index} label={type.id.toString()} value={type.id} />
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