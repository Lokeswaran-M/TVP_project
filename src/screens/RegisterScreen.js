
import React, { useState, useEffect } from 'react';
import { View, Button, ActivityIndicator, TouchableOpacity,StyleSheet, Text } from 'react-native';
import CustomInput from './Custom_input';
import { ScrollView } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import {API_BASE_URL} from '../constants/Config'
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';

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





//  const [inputFocus, setInputFocus] = useState({
//   username: false,
//   password: false,
//   confirmPassword: false,
//   mobileNo: false,
//   email: false,
//   address: false,
//   businessName: false,
//   referredBy: false,
// });

// const [inputAnimatedValues] = useState({
//   username: new Animated.Value(11),
//   password: new Animated.Value(11),
//   confirmPassword: new Animated.Value(11),
//   mobileNo: new Animated.Value(11),
//   email: new Animated.Value(11),
//   address: new Animated.Value(11),
//   businessName: new Animated.Value(11),
//   referredBy: new Animated.Value(11),
// });

// const [labelScaleValues] = useState({
//   username: new Animated.Value(1),
//   password: new Animated.Value(1),
//   confirmPassword: new Animated.Value(1),
//   mobileNo: new Animated.Value(1),
//   email: new Animated.Value(1),
//   address: new Animated.Value(1),
//   businessName: new Animated.Value(1),
//   referredBy: new Animated.Value(1),
// });

// const handleFocus = (field) => {
//   setInputFocus({ ...inputFocus, [field]: true });
//   Animated.parallel([
//     Animated.timing(inputAnimatedValues[field], {
//       toValue: -15,
//       duration: 200,
//       useNativeDriver: false,
//     }),
//     Animated.timing(labelScaleValues[field], {
//       toValue: 0.8,
//       duration: 200,
//       useNativeDriver: false,
//     }),
//   ]).start();
// };

// const handleBlur = (field, value) => {
//   if (value.trim() === '') {
//     Animated.parallel([
//       Animated.timing(inputAnimatedValues[field], {
//         toValue: 11,
//         duration: 200,
//         useNativeDriver: false,
//       }),
//       Animated.timing(labelScaleValues[field], {
//         toValue: 1,
//         duration: 200,
//         useNativeDriver: false,
//       }),
//     ]).start();
//   }
//   setInputFocus({ ...inputFocus, [field]: false });
// };

// const handleTouchOutside = () => {
//   Keyboard.dismiss();
//   Object.keys(inputFocus).forEach((field) => {
//     handleBlur(field, eval(field));
//   });
// };





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
      const userIdResponse = await fetch(`http://192.168.29.48:3000/execute-getuserid`);
      const userIdData = await userIdResponse.json();
      console.log('UserId:', userIdData);
      setUserId(userIdData.UserId);

      // Fetch professions
      const professionResponse = await fetch('http://192.168.29.48:3000/execute-profession');
      const professionData = await professionResponse.json();
      console.log('Professions:', professionData);
      setProfession(professionData);    

      // Fetch locations
      const locationResponse = await fetch('http://192.168.29.48:3000/available-location');

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
      const chapterTypeResponse = await fetch(`http://192.168.29.48:3000/execute-getslot?Location=${selectedLocation}`); 
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
      const response = await fetch('http://192.168.29.48:3000/RegisterAlldata', {
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

      navigation.navigate('Otpscreen');

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
      {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
        <CustomInput
          placeholder="Username"
          iconName="account"
          value={username}
          onChangeText={setUsername}
        />
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        <CustomInput
          placeholder="Password"
          iconName="lock"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

    {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

        <CustomInput
          placeholder="Confirm Password"
          iconName="lock"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

      {mobileNoError ? <Text style={styles.errorText}>{mobileNoError}</Text> : null}

        <CustomInput
          placeholder="Mobile No"
          iconName="phone"
          value={mobileNo}
          onChangeText={setMobileNo}
        />
       {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <CustomInput
          placeholder="Email"
          iconName="email"
          value={email}
          onChangeText={setEmail}
        />
       {addressError ? <Text style={styles.errorText}>{addressError}</Text> : null}


        <CustomInput
          placeholder="Address"
          iconName="home"
          value={address}
          onChangeText={setAddress}
        />
     {businessNameError ? <Text style={styles.errorText}>{businessNameError}</Text> : null}

        <CustomInput
          placeholder="Business Name"
          iconName="briefcase"
          value={businessName}
          onChangeText={setBusinessName}
        />


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
        
          {referredByError ? <Text style={styles.errorText}>{referredByError}</Text> : null}

        <CustomInput
          placeholder="Referred By"
          iconName="account-group"
          value={referredBy}
          onChangeText={setReferredBy}
        />



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
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginVertical: 10,
  },

  label: {
    marginVertical: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4b5059',
  },
  picker: {
    height: 50,
    width: '100%',
    color: 'black',
    fontSize: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff'
  },
    selectList: {
      borderWidth: 1,
      borderColor: '#4b5059',
      borderRadius:10,
      overflow: 'hidden',
      marginVertical: 10,
    },
    datePickerButton: {
      padding: 10,
      backgroundColor: '#fff',
      borderRadius: 10,
      marginVertical: 10,
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
    },
    registerButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
});

export default RegisterScreen;











// import React, { useState, useEffect } from 'react';
// import { View, Button, ActivityIndicator, TouchableOpacity,StyleSheet, Text } from 'react-native';
// import CustomInput from './Custom_input';
// import { ScrollView } from 'react-native-gesture-handler';
// import { Picker } from '@react-native-picker/picker';
// import {API_BASE_URL} from '../constants/Config'
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { useNavigation } from '@react-navigation/native';

//   const RegisterScreen = () => {
//   const [userId, setUserId] = useState('');
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [mobileNo, setMobileNo] = useState('');
//   const [email, setEmail] = useState('');
//   const [address, setAddress] = useState('');
//   const [businessName, setBusinessName] = useState('');

//   const [profession, setProfession] = useState([]); 
//   const [selectedProfession, setSelectedProfession] = useState('');

//   const [chapterType, setChapterType] = useState([]); 
//   const [selectedChapterType, setSelectedChapterType] = useState('');

//   const [chapterNo, setChapterNo] = useState([]); 
//   const [selectedLocation, setSelectedLocation] = useState('');

//   // const [availabledata, setAvailableData] = useState([]);
//   // const [availableLocation, setAvailableLocation] = useState(['']);

//   const [referredBy, setReferredBy] = useState('');

//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [showStartPicker, setShowStartPicker] = useState(false);
//   const [showEndPicker, setShowEndPicker] = useState(false);



//   const [loading, setLoading] = useState(true);

  


//   useEffect(() => {
//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (selectedLocation) {
//       fetchChapterTypes();
//     }
//   }, [selectedLocation]); // Trigger fetch when selectedLocation changes

//   const fetchData = async () => {
//     setLoading(true);

//     try {
//       // Fetch userId
//       const userIdResponse = await fetch(`http://192.168.29.48:3000/execute-getuserid`);
//       const userIdData = await userIdResponse.json();
//       console.log('UserId:', userIdData);
//       setUserId(userIdData.UserId);

//       // Fetch professions
//       const professionResponse = await fetch('http://192.168.29.48:3000/execute-profession');
//       const professionData = await professionResponse.json();
//       console.log('Professions:', professionData);
//       setProfession(professionData);    

//       // Fetch locations
//       const locationResponse = await fetch('http://192.168.29.48:3000/available-location');

//       const locationData = await locationResponse.json();
//       console.log('Locations:', locationData);
//       setChapterNo(locationData.availableLocations);


//       //  // Fetch chapter types (slots)
//       //  const chapterTypeResponse = await fetch(`http://192.168.29.81:3000/execute-getslot?Location=${chapterNo}`); 
//       //  const chapterTypeData = await chapterTypeResponse.json();
//       //  console.log('Chapter Types:', chapterTypeData);
//       //  setChapterType(chapterTypeData);

//     } catch (error) {
//       console.error('Error fetching data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };
//  const fetchChapterTypes = async () => {
//     try {
//       const chapterTypeResponse = await fetch(`http://192.168.29.48:3000/execute-getslot?Location=${selectedLocation}`); 
//       const chapterTypeData = await chapterTypeResponse.json();
//       console.log('Chapter Types:', chapterTypeData);
//       setChapterType(chapterTypeData);
//     } catch (error) {
//       console.error('Error fetching chapter types:', error);
//     }
//   };

// // choose date 
//   const onChangeStartDate = (event, selectedDate) => {
//     setShowStartPicker(false);
//     if (selectedDate) {
//       const formattedStartDate = selectedDate.toISOString().split('T')[0];
//       setStartDate(formattedStartDate);

//       const oneYearLater = new Date(selectedDate);
//       oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
//       const formattedEndDate = oneYearLater.toISOString().split('T')[0];
//       setEndDate(formattedEndDate);
//     }
//   };

//   const onChangeEndDate = (event, selectedDate) => {
//     setShowEndPicker(false);
//     if (selectedDate) {
//       const formattedEndDate = selectedDate.toISOString().split('T')[0];
//       setEndDate(formattedEndDate);
//     }
//   };
//   const handleRegister = async () => {
//     try {
//       const response = await fetch('http://192.168.29.48:3000/RegisterAlldata', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           user: {
//             userId:userId,
//             username,
//             Password: password,
//             mobileNo,
//             email
//           },
//           business: {
//             address,
//             businessName,
//             profession: selectedProfession,
//             chapterType: selectedChapterType,
//             chapterNo: selectedLocation,
//             referredBy,
//             startDate,
//             endDate
//           }
//         }),
//       });

//       const data = await response.json();
//       console.log('Registration successful:', data);
//     } catch (error) {
//       console.error('Error registering data:', error);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <Text>Loading data...</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView>
//       <View style={styles.container}>
//         <CustomInput
//           placeholder="Username"
//           iconName="account"
//           value={username}
//           onChangeText={setUsername}
//         />
//         <CustomInput
//           placeholder="Password"
//           iconName="lock"
//           value={password}
//           onChangeText={setPassword}
//           secureTextEntry
//         />
//         <CustomInput
//           placeholder="Mobile No"
//           iconName="phone"
//           value={mobileNo}
//           onChangeText={setMobileNo}
//         />
//         <CustomInput
//           placeholder="Email"
//           iconName="email"
//           value={email}
//           onChangeText={setEmail}
//         />
//         <CustomInput
//           placeholder="Address"
//           iconName="home"
//           value={address}
//           onChangeText={setAddress}
//         />
//         <CustomInput
//           placeholder="Business Name"
//           iconName="briefcase"
//           value={businessName}
//           onChangeText={setBusinessName}
//         />


//         {/* <Text style={styles.label}>User ID: {userId}</Text> */}

//         <Text style={styles.label}>Select Profession</Text>
//         <View style={styles.selectList}>
//         <Picker borderBottomWidth='1'
//           selectedValue={selectedProfession}
//           style={styles.picker}
//           onValueChange={(itemValue) => setSelectedProfession(itemValue)}
//         >
//           {profession.map((profession, index) => (
//             <Picker.Item key={index} label={profession.ProfessionName} value={profession.ProfessionName} />
//           ))}
//         </Picker>
//         </View>

//         <Text style={styles.label}>Select Location</Text>
//         <View style={styles.selectList}>
//         <Picker borderBottomWidth='1'
//           selectedValue={selectedLocation}
//           style={styles.picker}
//           onValueChange={(itemValue) => setSelectedLocation(itemValue)}
//           >
//           {chapterNo.map((chapterNo, index) => (
//             <Picker.Item key={index} label={chapterNo.location} value={chapterNo.location} />
//           ))}
//         </Picker>
//         </View>

//         <Text style={styles.label}>Select Slot</Text>
//         <View style={styles.selectList}>
//         <Picker borderBottomWidth='1'
//           selectedValue={selectedChapterType}
//           style={styles.picker}
//           onValueChange={(itemValue) => setSelectedChapterType(itemValue)}
//         >
//           {chapterType.map((type, index) => (
//             <Picker.Item key={index} label={type.id.toString()} value={type.id} />
//           ))}
//         </Picker>
//           </View>

//         <CustomInput
//           placeholder="Referred By"
//           iconName="account-group"
//           value={referredBy}
//           onChangeText={setReferredBy}
//         />

//          <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.datePickerButton}>
//           <Text style={styles.datePickerText}>{startDate ? `Start Date: ${startDate}` : 'Select Start Date'}</Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.datePickerButton}>
//           <Text style={styles.datePickerText}>{endDate ? `End Date: ${endDate}` : 'Select End Date'}</Text>
//         </TouchableOpacity>

//         {showStartPicker && (
//           <DateTimePicker
//             value={startDate ? new Date(startDate) : new Date()}
//             mode="date"
//             display="default"
//             onChange={onChangeStartDate}
//           />
//         )}

//         {showEndPicker && (
//           <DateTimePicker
//             value={endDate ? new Date(endDate) : new Date()}
//             mode="date"
//             display="default"
//             onChange={onChangeEndDate}
//           />
//         )}

   
//         <Button title="Register" onPress={handleRegister} />
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f5f5f5',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   pickerContainer: {
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     marginVertical: 10,
//   },

//   label: {
//     marginVertical: 10,
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#4b5059',
//   },
//   picker: {
//     height: 50,
//     width: '100%',
//     color: 'black',
//     fontSize: 20,
//     paddingHorizontal: 10,
//     backgroundColor: '#fff'
//   },
//     selectList: {
//       borderWidth: 1,
//       borderColor: '#4b5059',
//       borderRadius:10,
//       overflow: 'hidden',
//       marginVertical: 10,
//     },
//     datePickerButton: {
//       padding: 10,
//       backgroundColor: '#e0e0e0',
//       borderRadius: 5,
//       marginVertical: 10,
//     },
//     datePickerText: {
//       fontSize: 16,
//       color: '#333',
//     },
// });

// export default RegisterScreen;




