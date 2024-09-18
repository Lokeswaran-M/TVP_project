import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import AnimatedTextInput from './AnimatedTextInput'; // Assuming you have a custom animated text input
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '../constants/Config';

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


  const [referredBy, setReferredBy] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisible1, setPasswordVisible1] = useState(false);

  const navigation = useNavigation();

  // Validation errors
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [MobilenoError, setMobilenoError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [businessNameError, setBusinessNameError] = useState('');
  const [selectedProfessionError, setSelectedProfessionError] = useState('');
  const [selectedLocationError, setSelectedLocationError] = useState('');
  const [selectedSlotError, setSelectedSlotError] = useState('');
  const [dateError, setDateError] = useState('');
  const [referredByError, setReferredByError] = useState('');

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const togglePasswordVisibility1 = () => setPasswordVisible1(!passwordVisible1);

  // Fetch initial profession list from API
  useEffect(() => {
    fetch(`${API_BASE_URL}/execute-profession`)
      .then((response) => response.json())
      .then((data) => setProfession(data.executeprofession))
      .catch((error) => console.error(error));
  }, []);

  // Fetch locations based on selected profession
  useEffect(() => {
    if (selectedProfession) {
      fetch(`${API_BASE_URL}/available-location?profession=${selectedProfession}`)
        .then((response) => response.json())
        .then((data) => setLocationID(data.availableLocations))
        .catch((error) => console.error(error));
      setSelectedLocation(null); // Reset location when profession changes
    }
  }, [selectedProfession]);

  // Fetch chapter types based on both selected profession and location
  useEffect(() => {
    if (selectedProfession && selectedLocation) {
      fetch(`${API_BASE_URL}/execute-getslot?Location=${selectedLocation}&Profession=${selectedProfession}`)
        .then((response) => response.json())
        .then((data) => setChapterType(data))
        .catch((error) => console.error(error));
      setSelectedChapterType(null); // Reset chapter type when location changes
    }
  }, [selectedProfession, selectedLocation]);

  // Handle registration
  const handleRegister = async () => {
    // Validation logic here

    if (/* validation passes */) {
      try {
        const response = await fetch(`${API_BASE_URL}/RegisterAlldata`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user: { userId, username, Password: password, Mobileno, email },
            business: {
              address, businessName, profession: selectedProfession,
              chapterType: selectedChapterType, LocationID: selectedLocation,
              referredBy, startDate, endDate
            }
          }),
        });

        const data = await response.json();
        console.log('Registration successful:', data);
        navigation.navigate('Otpscreen', { Mobileno });
      } catch (error) {
        console.error('Error registering data:', error);
      }
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View>
          <Icon name="user" size={24} color="gray" style={styles.iconStyle} />
          <AnimatedTextInput placeholder="Username" value={username} onChangeText={setUsername} />
          {usernameError && <Text style={styles.errorText}>{usernameError}</Text>}
        </View>

        <View>
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconStyle}>
            <Icon name={passwordVisible ? "eye" : "eye-slash"} size={24} color="#888" />
          </TouchableOpacity>
          <AnimatedTextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={!passwordVisible} />
          {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
        </View>

        <View>
          <TouchableOpacity onPress={togglePasswordVisibility1} style={styles.iconStyle}>
            <Icon name={passwordVisible1 ? "eye" : "eye-slash"} size={24} color="#888" />
          </TouchableOpacity>
          <AnimatedTextInput placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!passwordVisible1} />
          {confirmPasswordError && <Text style={styles.errorText}>{confirmPasswordError}</Text>}
        </View>

        {/* Profession Dropdown */}
        <View style={styles.dropdown}>
          <Picker
            selectedValue={selectedProfession}
            onValueChange={(itemValue) => setSelectedProfession(itemValue)}
          >
            <Picker.Item label="Select Profession" value="" />
            {profession.map((item) => (
              <Picker.Item key={item.id} label={item.name} value={item.name} />
            ))}
          </Picker>
          {selectedProfessionError && <Text style={styles.errorText}>{selectedProfessionError}</Text>}
        </View>

        {/* Location Dropdown */}
        <View style={styles.dropdown}>
          <Picker
            selectedValue={selectedLocation}
            onValueChange={(itemValue) => setSelectedLocation(itemValue)}
          >
            <Picker.Item label="Select Location" value="" />
            {LocationID.map((location) => (
              <Picker.Item key={location.id} label={location.location} value={location.location} />
            ))}
          </Picker>
          {selectedLocationError && <Text style={styles.errorText}>{selectedLocationError}</Text>}
        </View>

        {/* Chapter Type Dropdown */}
        <View style={styles.dropdown}>
          <Picker
            selectedValue={selectedChapterType}
            onValueChange={(itemValue) => setSelectedChapterType(itemValue)}
          >
            <Picker.Item label="Select Chapter Type" value="" />
            {chapterType.map((type) => (
              <Picker.Item key={type.id} label={type.name} value={type.name} />
            ))}
          </Picker>
          {selectedSlotError && <Text style={styles.errorText}>{selectedSlotError}</Text>}
        </View>

        {/* Submit Button */}
        <TouchableOpacity onPress={handleRegister} style={styles.button}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  dropdown: { marginVertical: 10 },
  iconStyle: { position: 'absolute', right: 10, top: 15 },
  errorText: { color: 'red', marginTop: 5 },
  button: { backgroundColor: '#007BFF', padding: 15, alignItems: 'center', borderRadius: 5 },
  buttonText: { color: 'white', fontSize: 16 },
});

export default RegisterScreen;






import React, { useState, useEffect } from 'react';
import { View, Text, Picker } from 'react-native';

const YourComponent = () => {
  const [selectedProfession, setSelectedProfession] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [LocationID, setLocationID] = useState([]);
  const [selectedLocationError, setSelectedLocationError] = useState('');

  // API Base URL
  const API_BASE_URL = 'your-api-base-url';  // Update with your actual API URL

  // Fetch locations when a profession is selected
  useEffect(() => {
    if (selectedProfession) {
      // Fetch the locations based on the profession
      fetch(`${API_BASE_URL}/available-location?profession=${selectedProfession}`)
        .then(response => response.json())
        .then(data => {
          console.log('Location data:', data);  // Check what data is being fetched
          setLocationID(data.availableLocations || []);  // Use default empty array if undefined
        })
        .catch(error => {
          console.error('Error fetching locations:', error);
          setLocationID([]);  // Clear the locations in case of error
        });
    }
  }, [selectedProfession]);

  return (
    <View>
      {/* Display an error message if the location selection is invalid */}
      {selectedLocationError ? <Text style={styles.errorText}>{selectedLocationError}</Text> : null}

      <Text style={styles.label}>Select Location</Text>
      <View style={styles.selectList}>
        <Picker
          selectedValue={selectedLocation}
          enabled={!!selectedProfession}  // Enable only if profession is selected
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedLocation(itemValue)}
        >
          {/* Ensure that LocationID is an array and map it to Picker items */}
          {Array.isArray(LocationID) && LocationID.map((location, index) => (
            <Picker.Item key={index} label={location.location} value={location.location} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

export default YourComponent;












{/* <Picker
  selectedValue={selectedProfession}
  onValueChange={(itemValue) => {
    setSelectedProfession(itemValue); // Set the selected profession
    console.log('Selected Profession:', itemValue); // Log the selected profession
  }}
>
  {profession.map((item, index) => (
    <Picker.Item label={item.name} value={item.id} key={index} />
  ))}
</Picker> */}










// REgister code 



// import React, { useState, useEffect } from 'react';
// import { View,Image, TextInput,Button, ActivityIndicator,Animated,TouchableOpacity,TouchableWithoutFeedback,StyleSheet,Keyboard,Text } from 'react-native';
// import CustomInput from './Custom_input';
// import { ScrollView } from 'react-native-gesture-handler';
// import { Picker } from '@react-native-picker/picker';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { useNavigation } from '@react-navigation/native';
// import AnimatedTextInput from './AnimatedTextInput';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import {API_BASE_URL} from '../constants/Config'
// // import Newteam from '../../assets/images/Newteam.png';

//   const RegisterScreen = () => {
//   const [userId, setUserId] = useState('');
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState(''); 

//   const [Mobileno, setMobileno] = useState('');
//   const [email, setEmail] = useState('');
//   const [address, setAddress] = useState('');
//   const [businessName, setBusinessName] = useState('');

//   const [profession, setProfession] = useState([]); 
//   const [selectedProfession, setSelectedProfession] = useState('');

//   const [chapterType, setChapterType] = useState([]); 
//   const [selectedChapterType, setSelectedChapterType] = useState('');

//   const [LocationID, setLocationID] = useState([]); 
//   const [selectedLocation, setSelectedLocation] = useState('');

//   // const [availabledata, setAvailableData] = useState([]);
//   // const [availableLocation, setAvailableLocation] = useState(['']);

//   const [referredBy, setReferredBy] = useState('');

//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [showStartPicker, setShowStartPicker] = useState(false);
//   const [showEndPicker, setShowEndPicker] = useState(false);

//   const [loading, setLoading] = useState(true);

//   const navigation = useNavigation();

//   const [passwordVisible, setPasswordVisible] = useState(false);
//   const [passwordVisible1, setPasswordVisible1] = useState(false);


//  // Validation error messages
//  const [usernameError, setUsernameError] = useState('');
//  const [passwordError, setPasswordError] = useState('');
//  const [confirmPasswordError, setConfirmPasswordError] = useState('');
//  const [MobilenoError, setMobilenoError] = useState('');
//  const [emailError, setEmailError] = useState('');
//  const [addressError, setAddressError] = useState('');
//  const [businessNameError, setBusinessNameError] = useState('');
//  const [selectedProfessionError, setSelectedProfessionError] = useState('');
//  const [selectedLocationError, setSelectedLocationError] = useState('');
//  const [selectedSlotError,setSelectedslotError] =useState('');
//  const [dateError,setSelecteddateError]= useState('');
//  const [referredByError, setReferredByError] = useState('');


//  const togglePasswordVisibility = () => {
//   setPasswordVisible(!passwordVisible);
// };

// const togglePasswordVisibility1 = () => {
//   setPasswordVisible1(!passwordVisible1);
// };

//   // useEffect(() => {
//   //   fetchData();
//   // }, []);




//   // useEffect(() => {
//   //   if (selectedProfession) {
//   //     fetchLocations();
//   //   }
//   // }, [selectedProfession]);


//   // useEffect(() => {
//   //   if (selectedLocation) {
//   //     fetchChapterTypes();
//   //   }
//   // }, [selectedLocation]); 


//  // Fetch professions on mount
// //  useEffect(() => {
// //   fetchProfession();
// // }, []);





//   // const fetchData = async () => {
//   //   setLoading(true);
//   //   try {
//   //     const userIdResponse = await fetch(`${API_BASE_URL}/execute-getuserid`);
//   //     const userIdData = await userIdResponse.json();
//   //     if (userIdData.length > 0) {
//   //       setUserId(userIdData[0].UserId);
//   //     } else {
//   //       console.error('No UserId found in the response!');
//   //     }

//   //     // const professionResponse = await fetch(`${API_BASE_URL}/execute-profession`);
//   //     // const professionData = await professionResponse.json();
//   //     // setProfession(professionData);
//   //     fetchProfession();  // Fetch professions
//   //   } catch (error) {
//   //     console.error('Error fetching data:', error);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };


//   // const fetchProfession = async () => {
//   //   try {
//   //     const response = await fetch(`${API_BASE_URL}/execute-profession`);
//   //     const data = await response.json();
//   //     console.log('data-------profes-------',data)
//   //     setProfession(data);
//   //   } catch (error) {
//   //     console.error('Error fetching professions:', error);
//   //   }
//   // };
  
  

//   // const fetchLocations = async () => {
//   //   try {
//   //     const locationResponse = await fetch(`${API_BASE_URL}/available-location?profession=${selectedProfession}`);
//   //     const locationData = await locationResponse.json();
//   //     setLocationID(locationData.availableLocations);
//   //   } catch (error) {
//   //     console.error('Error fetching locations:', error);
//   //   }
//   // };

//   // // const fetchChapterTypes = async () => {
//   // //   try {
//   // //     const chapterTypeResponse = await fetch(`${API_BASE_URL}/execute-getslot?Location=${selectedLocation}&${selectedProfession}`);
//   // //     const chapterTypeData = await chapterTypeResponse.json();
//   // //     setChapterType(chapterTypeData);
//   // //   } catch (error) {
//   // //     console.error('Error fetching chapter types:', error);
//   // //   }
//   // // };

// //   const fetchChapterTypes = async () => {
// //     try {
// //       const chapterTypeResponse = await fetch(
// //    `${API_BASE_URL}/execute-getslot?Location=${selectedLocation}&Profession=${selectedProfession}`
// //         // `${API_BASE_URL}/execute-getslot?Location=100001&Profession=consultant office`

// // );
// //       const chapterTypeData = await chapterTypeResponse.json();
// //       setChapterType(chapterTypeData);
// //     } catch (error) {
// //       console.error('Error fetching chapter types:', error);
// //     }
// //   };
  
// // const fetchLocations = async (selectedProfession) => {
// //   try {
// //     // const response = await fetch(`http://your-api-url/available-location?profession=${profession}`);
// //    const response = await fetch(`${API_BASE_URL}/available-location?profession=${selectedProfession}`);

// //     const data = await response.json();
// //     console.log('data------location--------',data)
// //     setLocationID(data.availableLocations);
// //   } catch (error) {
// //     console.error('Error fetching locations:', error);
// //   }
// // };

// // const fetchChapterTypes = async (selectedLocation, selectedProfession) => {
// //   try {
// //  const response = await fetch(`${API_BASE_URL}/execute-getslot?Location=${selectedLocation}&${selectedProfession}`);
 

// //  const data = await response.json();
// //   console.log('data--------slot------',data)
// //   setChapterType(data);
// //   } catch (error) {
// //     console.error('Error fetching slots:', error);
// //   }
// // };


// // const fetchChapterTypes = async (selectedLocation, selectedProfession) => {
// //   try {
// //     const response = await fetch(`${API_BASE_URL}/execute-getslot?Location=${selectedLocation}&Profession=${selectedProfession}`, {
// //       headers: {
// //         'Cache-Control': 'no-cache',
// //       },
// //     });
// //     const data = await response.json();
    
// //     // Update to handle specific details from the response
// //     setChapterType(data.getslot); 
// //     console.log('Fetched slot details:=========', data);
// //   } catch (error) {
// //     console.error('Error fetching slots:', error);
// //   }
// // };


//   // Fetch initial profession list from API
//   useEffect(() => {
//     fetch(`${API_BASE_URL}/execute-profession`) // Replace with your actual API endpoint
//       .then((response) => response.json())
//       .then((data) => setProfession(data))
//       .catch((error) => console.error(error));
//   }, []);

//   // Fetch locations based on selected profession
//   useEffect(() => {
//     if (selectedProfession) {
//       fetch(`${API_BASE_URL}/available-location?profession=${selectedProfession}`)
//       //  `${API_BASE_URL}/available-location?profession=${selectedProfession}
//       .then((response) => response.json())
//         .then((data) => setLocationID(data))
//         .catch((error) => console.error(error));

//       // Reset location and slot when profession changes
//       setSelectedLocation(null);
//       setChapterType([]); // Reset slots
//     }
//   }, [selectedProfession]);


//   // Fetch slots based on both selected profession and location
//   useEffect(() => {
//     if (selectedProfession && selectedLocation) {
//       fetch(`${API_BASE_URL}/execute-getslot?Location=${selectedLocation}&Profession=${selectedProfession}`)
//         .then((response) => response.json())
//         .then((data) => setChapterType(data))
//         .catch((error) => console.error(error));

//       // Reset slot when location changes
//       setSelectedChapterType(null);
//     }
//   }, [selectedProfession, selectedLocation]);

// // // When profession is selected
// // const handleProfessionChange = (itemValue) => {
// //   setSelectedProfession(itemValue);
// //   fetchLocations(itemValue);  // Fetch locations for the selected profession
// // };

// // // When location is selected
// // const handleLocationChange = (itemValue) => {
// //   setSelectedLocation(itemValue);
// //   console.log('itemValue============location is selected=======================',itemValue)
// //   fetchChapterTypes(itemValue, selectedProfession);  // Fetch slots based on location and profession
// // };

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

//     // Reset error messages
//     setUsernameError('');
//     setPasswordError('');
//     setConfirmPasswordError('');
//     setMobilenoError('');
//     setEmailError('');
//     setAddressError('');
//     setBusinessNameError('');
//     setSelectedProfessionError('');
//     setSelectedLocationError('');
//     setReferredByError('');
//     setSelecteddateError('');

//     let isValid = true;

//     // Validation checks
//     if (!username) {
//       setUsernameError('Username is required');
//       isValid = false;
//     }
//     if (!password) {
//       setPasswordError('Password is required');
//       isValid = false;
//     }
//     if (password !== confirmPassword) {
//       setConfirmPasswordError('Passwords do not match');
//       isValid = false;
//     }
//     if (!Mobileno) {
//       setMobilenoError('Mobile number is required');
//       isValid = false;
//     }
//     else if (Mobileno.length !== 10) {
//       setMobilenoError('Mobile number must be 10 digits');
//       isValid = false;
//     }
//     if (!email) {
//       setEmailError('Email is required');
//       isValid = false;
//     } else if (!/\S+@\S+\.\S+/.test(email)) {
//       setEmailError('Invalid email format');
//       isValid = false;
//     }
//     if (!address) {
//       setAddressError('Address is required');
//       isValid = false;
//     }
//     if (!businessName) {
//       setBusinessNameError('Business Name is required');
//       isValid = false;
//     }
//     if (!selectedProfession) {
//       setSelectedProfessionError('Profession is required');
//       isValid = false;
//     }
//     if (!selectedLocation) {
//       setSelectedLocationError('Location is required');
//       isValid = false;
//     }
//     if (!chapterType) {
//       setSelectedslotError('slot is required');
//       isValid = false;
//     }
//     if (!referredBy) {
//       setReferredByError('Referred By is required');
//       isValid = false;
//     }
//     if (!startDate) {
//       setSelecteddateError('date By is required');
//       isValid = false;
//     }
//     if (isValid) {


      
//     try {
//       const response = await fetch(`${API_BASE_URL}/RegisterAlldata`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           user: {
//             userId:userId,
//             username,
//             Password: password,
//             Mobileno,
//             email
//           },
//           business: {
//             address,
//             businessName,
//             profession: selectedProfession,
//             chapterType: selectedChapterType,
//             LocationID: selectedLocation,
//             referredBy,
//             startDate,
//             endDate
//           }
//         }),
//       });
    
//       const data = await response.json();
//       console.log('data=================',data)
//       console.log('response user =====',data.user)
//       console.log('response business-----',data.business)
//       navigation.navigate('Otpscreen',{ Mobileno });

//       console.log('Registration successful:', data);
//     } catch (error) {
//       console.error('Error registering data:', error);
//     }
//   }
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
//     <View style={styles.container}>
//     {/* <View style={styles.container1}>
//     <Image source={Newteam} style={styles.image} />
//     </View> */}
//       {/* Username Field */}
//       <View>
//         <Icon name="user" size={24} color="gray" style={styles.iconStyle} />
//         <AnimatedTextInput
//           placeholder="Username"
//           value={username}
//           onChangeText={setUsername}
//         />
//       </View>
//       {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}

//       {/* Password Field */}
//       <View>
//       <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconStyle}>
//               <Icon name={passwordVisible ? "eye" : "eye-slash"} size={24} color="#888" />
//             </TouchableOpacity>
//         <AnimatedTextInput
//           placeholder="Password"
//           value={password}
//           onChangeText={setPassword}
//           secureTextEntry={!passwordVisible}
//         />
//       </View>
//       {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

//       {/* Confirm Password Field */}
//       <View>
//       <TouchableOpacity onPress={togglePasswordVisibility1} style={styles.iconStyle}>
//               <Icon name={passwordVisible1 ? "eye" : "eye-slash"} size={24} color="#888" />
//             </TouchableOpacity>
//         <AnimatedTextInput
//           placeholder="Confirm Password"
//           value={confirmPassword}
//           onChangeText={setConfirmPassword}
//           secureTextEntry={!passwordVisible1}
//         />
//       </View>
//       {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

//       {/* Mobile Number Field */}
//       <View>
//         <Icon name="phone" size={24} color="gray" style={styles.iconStyle} />
//         <AnimatedTextInput
//           placeholder="Mobile Number"
//           value={Mobileno}
//           keyboardType="phone-pad"
//           onChangeText={setMobileno}
//         />
//       </View>
//       {MobilenoError ? <Text style={styles.errorText}>{MobilenoError}</Text> : null}

//       {/* Email Field */}
//       <View>
//         <Icon name="envelope" size={24} color="gray" style={styles.iconStyle} />
//         <AnimatedTextInput
//           placeholder="Email"
//           value={email}
//           onChangeText={setEmail}
//         />
//       </View>
//       {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

//       {/* Address Field */}
//       <View style={styles.inputContainer}>
//         <Icon name="home" size={24} color="gray" style={styles.iconStyle} />
//         <AnimatedTextInput
//           placeholder="Address"
//           value={address}
//           onChangeText={setAddress}
          
//         />
//       </View>
//       {addressError ? <Text style={styles.errorText}>{addressError}</Text> : null}
       
//       <View style={styles.inputContainer}>
//       <Icon name="briefcase" size={24} color="gray" style={styles.iconStyle} />
//      <AnimatedTextInput
//         placeholder="Business Name"
//         value={businessName}
//         onChangeText={setBusinessName}
//       />
//       </View>
//       {businessNameError ? <Text style={styles.errorText}>{businessNameError}</Text> : null}
       
//       {selectedProfessionError ? <Text style={styles.errorText}>{selectedProfessionError}</Text> : null}

//         {/* <Text style={styles.label}>User ID: {userId}</Text> */}

//         <Text style={styles.label}>Select Profession</Text>
//         <View style={styles.selectList}>
//         {/* <Picker borderBottomWidth='1'
//           selectedValue={selectedProfession}
//           style={styles.picker}
//           onValueChange={(itemValue) => handleProfessionChange(itemValue)}
//         >
//           {profession.map((profession, index) => (
//             <Picker.Item key={index} label={profession.ProfessionName} value={profession.ProfessionName} />
//           ))}
//         </Picker> */}
//          <Picker
//             selectedValue={selectedProfession}
//             onValueChange={setSelectedProfession}
//             style={styles.picker}
//           >
//             {profession.map((prof) => (
//               <Picker.Item key={prof.Id} label={prof.ProfessionName} value={prof.ProfessionName} />
//             ))}
//           </Picker>


//         </View>
//         {selectedLocationError ? <Text style={styles.errorText}>{selectedLocationError}</Text> : null}

//         <Text style={styles.label}>Select Location</Text>
//         <View style={styles.selectList}>
//         <Picker borderBottomWidth='1'
//           selectedValue={selectedLocation}
//           enabled={!!selectedProfession}  // Enable only if profession is selected
//           style={styles.picker}
//           onValueChange={(itemValue) => handleLocationChange(itemValue)}
//           >
//           {LocationID.map((LocationID, index) => (
//             <Picker.Item key={index} label={LocationID.location} value={LocationID.value} />
//           ))}
//         </Picker>
//         {/* <Picker
//             selectedValue={selectedLocation}
//             onValueChange={handleLocationChange}
//             style={styles.picker}
//           >
//             {LocationID.map((loc) => (
//               <Picker.Item key={loc.location} label={loc.location} value={loc.location} />
//             ))}
//           </Picker> */}
//         </View>
//         {selectedSlotError ? <Text style={styles.errorText}>{selectedSlotError}</Text> : null}

//         <Text style={styles.label}>Select Slot</Text>
//         <View style={styles.selectList}>
//            {/* <Picker borderBottomWidth='1'
//           selectedValue={selectedChapterType}
//           style={styles.picker}
//           onValueChange={(itemValue) => setSelectedChapterType(itemValue)}
//             >
//           {chapterType.map((chapterType, index) => (
//             <Picker.Item key={index} label={chapterType.id.toString()} value={chapterType.id} />
//           ))}
//            </Picker> */}
//           <Picker
//             selectedValue={selectedChapterType}
//             onValueChange={(itemValue) => setSelectedSlot(itemValue)}
//             style={styles.picker}
//             >
//             {chapterType.map((slot) => (
//               <Picker.Item key={slot.id} label={slot.id} value={slot.id} />
//             ))}
//           </Picker>

//         </View>
        
//         <View style={styles.inputContainer}>
//         <Icon name="user-plus" size={24} color="gray" style={styles.iconStyle} />
//           <AnimatedTextInput
//         placeholder="Referred By"
//         value={referredBy}
//         onChangeText={setReferredBy}
//       />
//       </View>
//       {referredByError ? <Text style={styles.errorText}>{referredByError}</Text> : null}
       
//         {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}
//        {/* Start Date */}
//       <Text style={styles.label}>Start Date</Text>
//       <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.datePickerButton}>
//         <Text style={styles.datePickerText}>{startDate ? startDate : 'Select Start Date'}</Text>
//       </TouchableOpacity>

//       {showStartPicker && (
//         <DateTimePicker
//           value={startDate ? new Date(startDate) : new Date()}
//           mode="date"
//           display="default"
//           onChange={onChangeStartDate}
//         />
//       )}

//       {/* End Date */}
//       <Text style={styles.label}>End Date</Text>
//       <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.datePickerButton}>
//         <Text style={styles.datePickerText}>{endDate ? endDate : 'Select End Date'}</Text>
//       </TouchableOpacity>

//       {showEndPicker && (
//         <DateTimePicker
//           value={endDate ? new Date(endDate) : new Date()}
//           mode="date"
//           display="default"
//           onChange={onChangeEndDate}
//         />
//       )}

//         <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
//         <Text style={styles.registerButtonText}>Register</Text>
//       </TouchableOpacity>
   
//         {/* <Button title="Register" onPress={handleRegister} /> */}
//       </View>
//     </ScrollView>
//   );
// };



// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//     // justifyContent: 'center',
//     // alignItems: 'center',
//   },
//   container1: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
  
//   pickerContainer: {
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 5,
//     backgroundColor: '#fff',
//   },
//   label: {
//     marginVertical: 10,
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#4b5059',
//     // marginBottom: 10,
//   },
//   picker: {
//     height: 50,
//     width: '100%',
//     color: 'black',
//     fontSize: 20,
//     paddingHorizontal: 10,
//     // backgroundColor: '#ccc',
//     borderColor : '#ccc'
//   },
//     selectList: {
//       borderWidth: 1,
//       borderColor: '#ccc',
//       borderRadius:10,
//       overflow: 'hidden',
//       marginVertical: 10,
//     },
//     datePickerButton: {
//       borderColor: '#ccc',
//       borderWidth: 1,
//       borderRadius: 5,
//       padding: 15,
//       width: '100%',
//       alignItems: 'center',
//       // backgroundColor: '#fff',
//     },
//     datePickerText: {
//       fontSize: 16,
//       color: '#333',
//     },
    
//     errorText: {
//       color: 'red',
//       marginBottom: 10,
//     },
//     registerButton: {
//       backgroundColor: '#a3238f', 
//       padding: 15,
//       borderRadius: 5,
//       alignItems: 'center',
//       marginTop:10,
//       marginBottom: 10,
//     },
//     registerButtonText: {
//       color: '#fff',
//       fontSize: 16,
//       fontWeight: 'bold',
//     },
//     iconStyle: {
//       marginRight: 10,
//       // marginLeft: 'auto',
//       marginTop: 30,
//       position: 'absolute',
//       zIndex: 1,
//       // justifyContent: 'right',
//       // display : 'flex',
//       // float: 'right',
//       marginLeft: 325,
//     },
//     input: {
//       flex: 1,
//     },
//     errorText: {
//       color: 'red',
//       marginBottom: 8,
//     },
//     // image: {
//     //   width: 300,
//     //   height: 250, 
//     //   resizeMode: 'contain',
//     // },
// });

// export default RegisterScreen;








// if (logintype === '1') { // Member login
//   if (rollId === 1) {
//     navigation.navigate('AdminPage');
//   } else if (rollId === 2) {
//     navigation.navigate('ChapterAdministratorPage');
//   } else if (rollId === 3) {
//     navigation.navigate('DrawerNavigator'); // Member page
//   } else {
//     setLoginError('Invalid role ID');
//   }
// } else if (logintype === '2') { // Substitute login
//   navigation.navigate('SubstitutePage'); // Navigate to Substitute page
// }
// } else {
// setLoginError(result.error || 'Incorrect username or password');
// }
// } catch (error) {
// setLoginError('An error occurred. Please try again.');
// console.error(error);
// }