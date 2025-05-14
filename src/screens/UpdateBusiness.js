import React, { useState, useRef, useEffect,useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import AnimatedTextInput from './AnimatedTextInput';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API_BASE_URL } from '../constants/Config';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSelector } from 'react-redux';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const UpdateBusiness = ({ route }) => {
    const userId = useSelector((state) => state.UserId);
  const { chapterType, locationId, Profession } = route.params;
  console.log('Chapter Type:', chapterType);
  console.log('Location ID:', locationId);
  console.log('Profession:', Profession);
  console.log('User ID-------',userId);
  const [profileData, setProfileData] = useState({});
  console.log("Profile data in Add Business--------------",profileData);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState(''); 
  const [Mobileno, setMobileno] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [profession, setProfession] = useState([]); 
  const [selectedProfession, setSelectedProfession] = useState('');
  const [slotType, setSlotType] = useState([]); 
  const [selectedChapterType, setSelectedChapterType] = useState('');
  const [LocationID, setLocationID] = useState([]); 
  const [selectedLocation, setSelectedLocation] = useState('');
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
 const [selectedSlotError,setSelectedslotError] =useState('');
 const [dateError,setSelecteddateError]= useState('');
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
  useEffect(() => {
    const fetchUserBusinessDetails = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/userBusinessDetails?UserId=${userId}&LocationID=${locationId}&ChapterType=${chapterType}`
        );
        const data = await response.json();
        console.log("Data in the User Business Details---------------------",data);
        if (response.ok && data.length > 0) {
          const details = data[0];
          setUsername(details.Username || '');
          setPassword(details.password || '');
        //   setConfirmPassword(details.password || '');
          setMobileno(details.Mobileno || '');
          setEmail(details.Email || '');
          setAddress(details.Address || '');
          setBusinessName(details.BusinessName || '');
        //   setSelectedProfession(details.Profession || '');
        //   setSelectedChapterType(details.Slots || '');
        //   setSelectedLocation(details.LocationName || '');
        //   setStartDate(details.StartDate?.split('T')[0] || '');
        //   setEndDate(details.EndDate?.split('T')[0] || '');
        } else {
          console.warn('No matching details found.');
        }
      } catch (error) {
        console.error('Error fetching user business details:', error);
      }
    };
  
    fetchUserBusinessDetails();
  }, [userId, locationId, chapterType]);
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
    setSlotType(data.getslot); 
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
  
      if (profileData.RollId === 2 && profileData.CategoryId === 2) {
        const { LocationID: locationId, ChapterType: chapterType } = profileData;
  
        if (locationId && chapterType) {
          console.log(`LocationID: ${locationId}, ChapterType: ${chapterType}`);
          setSelectedLocation(locationId); // Set the location
          setSelectedChapterType(chapterType); // Set the chapter type
        } else {
          console.error('LocationID or ChapterType is missing');
        }
      } else {
        console.log('Fetching execute professions for RollId 3 or other cases');
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
  

  // const fetchData = async () => {
  //   try {
  //     const profileResponse = await fetch(`${API_BASE_URL}/api/user/business-info/${userId}`);
  //     if (!profileResponse.ok) {
  //       throw new Error('Failed to fetch profile data');
  //     }
  //     const profileData = await profileResponse.json();
  //     console.log("Fetched profile data:", profileData);
  //     if (profileResponse.status === 404) {
  //       setProfileData({});
  //     } else {
  //       setProfileData(profileData);
  //     }
  //     if (profileData.RollId === 2) {
  //       const { LocationID: locationId, ChapterType: chapterType } = profileData;
  //       // chapterType = chapterType === '1' ? '2' : '1';
  //       if (locationId && chapterType) {
  //         console.log(`LocationID: ${locationId}, ChapterType: ${chapterType}`);
  //         const excludeResponse = await fetch(`${API_BASE_URL}/api/professions/exclude-business-location/${locationId}/${chapterType}`);
  //         if (!excludeResponse.ok) {
  //           throw new Error(`HTTP error! status: ${excludeResponse.status}`);
  //         }
  //         const excludeData = await excludeResponse.json();
  //         console.log('Exclude professions data:', excludeData);
  //         setProfession(excludeData);
  //       } else {
  //         console.error('LocationID or ChapterType is missing');
  //       }
  //     } else {
  //       console.log('Fetching execute professions for RollId 3');
  //       const executeResponse = await fetch(`${API_BASE_URL}/execute-profession`);
  //       if (!executeResponse.ok) {
  //         throw new Error(`HTTP error! status: ${executeResponse.status}`);
  //       }
  //       const executeData = await executeResponse.json();
  //       console.log('Execute professions data:', executeData.executeprofession);
  //       setProfession(executeData.executeprofession);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };
  useFocusEffect(
    useCallback(() => {
      console.log('Fetching profile data for userId:', userId);
      fetchData();
    }, [userId])
  );

  const handleUpdateBusiness = async () => {
    if (!email || !address || !businessName || !startDate || !endDate || !selectedProfession || !selectedLocation || !selectedChapterType) {
      console.log("All fields are required.");
      return;
    }
  
    const requestData = {
      Profession: selectedProfession,
      LocationID: selectedLocation,
      ChapterType: selectedChapterType,
      UserId: userId,
      Address: address,
      Email: email,
      BusinessName: businessName,
      StartDate: startDate,
      EndDate: endDate
    };
  console.log("Request Data-----------------------------",requestData);
    try {
      const response = await fetch(`${API_BASE_URL}/updateBusiness`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Business updated successfully:", data);
        navigation.pop(2);
      } else {
        console.error("Error updating business:", data.error || 'Unknown error');
      }
    } catch (error) {
      console.error("Error updating business:", error);
    }
  };
  
//   const handleUpdateBusiness = async () => {
//     if (!email || !address || !businessName || !startDate || !endDate || !selectedProfession || !selectedLocation || !selectedChapterType) {
//         console.log("All fields are required.");
//         return;
//     }
//     const requestData = {
//         Profession: selectedProfession,
//         LocationID: selectedLocation,
//         ChapterType: selectedChapterType,
//         UserId: userId,
//         Address: address,
//         Email: email,
//         BusinessName: businessName,
//         StartDate: startDate,
//         EndDate: endDate
//     };
//     try {
//         const response = await fetch(`${API_BASE_URL}/updateBusiness`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(requestData),
//         });
//         const data = await response.json();
//         if (response.ok) {
//             console.log("Business updated successfully:", data);
//             navigation.pop(2);
//         } else {
//             console.error("Error updating business:", data.error || 'Unknown error');
//         }
//     } catch (error) {
//         console.error("Error updating business:", error);
//     }
// };

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
            editable={false}
          />
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
          editable={false}
        />
      </View>
      <View>
        <Icon name="phone" size={24} color="gray" style={styles.iconStyle} />
        <AnimatedTextInput
          placeholder="Mobile Number"
          value={Mobileno}
          keyboardType="phone-pad"
          onChangeText={setMobileno}
          editable={false}
        />
      </View>
      <View>
        <Icon name="envelope" size={24} color="gray" style={styles.iconStyle} />
        <AnimatedTextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="home" size={24} color="gray" style={styles.iconStyle} />
        <AnimatedTextInput
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
        />
      </View>
      <View style={styles.inputContainer}>
      <Icon name="briefcase" size={24} color="gray" style={styles.iconStyle} />
     <AnimatedTextInput
        placeholder="Business Name"
        value={businessName}
        onChangeText={setBusinessName}
      />
      </View>
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
{profileData.RollId === 2 ? (
       <View style={styles.selectList}>
          <TextInput
            style={styles.textInput}
            value={profileData.LocationName || 'None'}
            editable={false}
          />
          </View>
        ) : (
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
        )}
        {profileData.CategoryId === 2 ? (
   <View style={styles.selectList}>
   <TextInput
     style={styles.textInput}
     value={profileData.ChapterType === '2' ? '1' : '2'}
     editable={false}
   />
 </View>
        ) : (
            <Dropdown
  style={styles.dropdown}
  placeholderStyle={styles.placeholderStyle}
  selectedTextStyle={styles.selectedTextStyle}
  placeholder="Select Slot"
  data={slotType.map((item, index) => ({
    label: item.Slots,
    value: item.id,
    backgroundColor: index % 2 === 0 ? 'white' : '#f5f7ff',
  }))}
  value={selectedChapterType}
  onChange={(item) => setSelectedChapterType(item.value)}
  search
  searchPlaceholder="Search Slot"
  labelField="label"
  valueField="value"
  inputSearchStyle={styles.inputSearchStyle}
  renderItem={(item) => (
    <View style={[styles.item, { backgroundColor: item.backgroundColor }]}>
      <Text style={styles.itemText}>{item.label}</Text>
    </View>
  )}
/>
        )}
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
       <TouchableOpacity onPress={handleUpdateBusiness} style={styles.updateButton}>
  <Text style={styles.buttonText}>Update</Text>
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
    borderRadius: 10,
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
    marginTop: 10,
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
  },
  selectedTextStyle: {
    color: '#000',
    fontSize: 18,
  },
  inputSearchStyle: {
    borderColor: '#2e3192',
    borderRadius: 8,
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
  updateButton: {
    backgroundColor: '#2e3192',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  textInput: {
    height: 50,
    borderColor: '#888',
    borderWidth: 0.4,
    paddingHorizontal: 10,
    color: '#000',
    fontSize: 18,
    // paddingLeft: 10,
  },
});
export default UpdateBusiness;