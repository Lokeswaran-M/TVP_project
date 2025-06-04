import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput,
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform, 
  ActivityIndicator,
  Modal
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import { API_BASE_URL } from '../constants/Config';

const AnimatedTextInput = React.forwardRef((props, ref) => {
  return (
    <TextInput
      {...props}
      ref={ref}
      style={styles.input}
      placeholderTextColor="#888"
    />
  );
});

const RegisterScreen = ({ route }) => {
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
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisible1, setPasswordVisible1] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [referMembers, setreferMembers] = useState([]);
  const [showAlreadyRegisteredModal, setShowAlreadyRegisteredModal] = useState(false);

  const [usernameError, setUsernameError] = useState('');
  const [usernametakenError, setUsernametakenError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [MobilenoError, setMobilenoError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [businessNameError, setBusinessNameError] = useState('');
  const [selectedProfessionError, setSelectedProfessionError] = useState('');
  const [selectedLocationError, setSelectedLocationError] = useState('');
  const [referredByError, setReferredByError] = useState('');
  const [isUsernameValid, setIsUsernameValid] = useState(false);
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const [firstNameError, setFirstNameError] = useState('');
const [lastNameError, setLastNameError] = useState('');
const firstNameInputRef = useRef(null);
const lastNameInputRef = useRef(null);

  const navigation = useNavigation();
  const scrollViewRef = useRef(null);

  const usernameInputRef = useRef(null);
  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.fromOtp) {
        setShowAlreadyRegisteredModal(true);
      }
      return () => {};
    }, [route.params])
  );

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
    try {
      const encodedProfession = encodeURIComponent(selectedProfession);
      const url = `${API_BASE_URL}/available-location?profession=${encodedProfession}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        if (data.availableLocations && Array.isArray(data.availableLocations) && data.availableLocations.length > 0) {
          const formattedLocations = data.availableLocations.map((item, index) => ({
            label: item.LocationName,
            value: item.LocationID,
            backgroundColor: index % 2 === 0 ? 'white' : '#F3ECF3',
          }));
          
          setLocationID(formattedLocations);
        } else {
          setLocationID([]);
        }
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };
  
  const fetchReferMembers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/ReferMembers`);
      const responseText = await response.text();
      const data = JSON.parse(responseText);
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
  
  const handleRegister = async () => {
    if (isLoading) return;
    setUsernameError('');
    setUsernametakenError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setMobilenoError('');
    setEmailError('');
    setAddressError('');
    setBusinessNameError('');
    setSelectedProfessionError('');
    setSelectedLocationError('');
    setReferredByError('');
    setFirstNameError('');
    setLastNameError('');
    
    let isValid = true;
const nameRegex = /^[A-Za-z]+$/;
const usernameRegex = /^(?=.{4,20}$)(?![_.])[a-z0-9._]+(?<![_.])$/;


if (!username.trim()) {
  setUsernameError('Username is required');
  isValid = false;
} else if (!usernameRegex.test(username)) {
  setUsernameError('Only lowercase letters, digits, underscores (_), and periods (.) are allowed. Cannot start or end with _ or .');
  isValid = false;
} else {
  setUsernameError('');
}

if (!firstName.trim()) {
  setFirstNameError('First Name is required');
  isValid = false;
} else if (!nameRegex.test(firstName.trim())) {
  setFirstNameError('Only letters are allowed');
  isValid = false;
} else {
  setFirstNameError('');
}

if (!lastName.trim()) {
  setLastNameError('Last Name is required');
  isValid = false;
} else if (!nameRegex.test(lastName.trim())) {
  setLastNameError('Only letters are allowed');
  isValid = false;
} else {
  setLastNameError('');
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
    
      if (data.count !== undefined) {
        if (data.count > 0) {
          setUsernametakenError('Username already taken');
          setIsUsernameValid(false);
          usernameInputRef.current?.focus();
          scrollViewRef.current?.scrollTo({ y: 0, animated: true });
          isValid = false;
        } else {
          setUsernametakenError('');
          setIsUsernameValid(true);
        }
      } else {
        setUsernametakenError('Invalid response from server');
      }
    } catch (err) {
      setUsernametakenError('Username is required');
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
    if (isValid) {
      setIsLoading(true);
      try {
        const userIdResponse = await fetch(`${API_BASE_URL}/execute-getuserid`);
        const userIdData = await userIdResponse.json();
        
        if (userIdData.NextuserId) {
          const generatedUserId = userIdData.NextuserId;
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
                firstName,
                lastName,
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
                referProfession
              }
            }),
          });
          const data = await response.json();
          console.log('Registration successful:', data);
          setIsLoading(false);
          navigation.navigate('Otpscreen', { Mobileno, firstName,businessName,LocationID: selectedLocation, LocationList: LocationID });
        } else {
          setIsLoading(false);
          console.error('No UserId found in the response!');
        }
      } catch (error) {
        setIsLoading(false);
        console.error('Error registering user:', error);
      }
    }
  };

  const handleLoginPress = () => {
    setShowAlreadyRegisteredModal(false);
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <LinearGradient
        colors={['#2e3192', '#3957E8']}
        style={styles.gradientContainer}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>Create Account</Text>
              <Text style={styles.headerSubtitle}>Fill in your details to get started</Text>
            </View>
            
            <View style={styles.formGroup}>
              <View style={styles.inputContainer}>
                <Icon name="user" size={20} color="#2e3192" style={styles.inputIcon} />
                <AnimatedTextInput
                  ref={usernameInputRef}
                  placeholder="Username"
                  value={username}
                  onChangeText={setUsername}
                />
              </View>
              {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
              {usernametakenError ? <Text style={styles.errorText}>{usernametakenError}</Text> : null}
            </View>

            <View style={styles.formGroup}>
              <View style={styles.inputContainer}>
                <Icon name="lock" size={20} color="#2e3192" style={styles.inputIcon} />
                <AnimatedTextInput
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!passwordVisible}
                />
                <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                  <Icon name={passwordVisible ? "eye" : "eye-slash"} size={20} color="#2e3192" />
                </TouchableOpacity>
              </View>
              {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            </View>

            <View style={styles.formGroup}>
              <View style={styles.inputContainer}>
                <Icon name="lock" size={20} color="#2e3192" style={styles.inputIcon} />
                <AnimatedTextInput
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!passwordVisible1}
                />
                <TouchableOpacity onPress={togglePasswordVisibility1} style={styles.eyeIcon}>
                  <Icon name={passwordVisible1 ? "eye" : "eye-slash"} size={20} color="#2e3192" />
                </TouchableOpacity>
              </View>
              {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
            </View>

<View style={styles.formGroup}>
  <View style={styles.inputContainer}>
    <Icon name="user" size={20} color="#2e3192" style={styles.inputIcon} />
    <AnimatedTextInput
      ref={firstNameInputRef}
      placeholder="First Name"
      value={firstName}
      onChangeText={setFirstName}
    />
  </View>
  {firstNameError ? <Text style={styles.errorText}>{firstNameError}</Text> : null}
</View>

<View style={styles.formGroup}>
  <View style={styles.inputContainer}>
    <Icon name="user" size={20} color="#2e3192" style={styles.inputIcon} />
    <AnimatedTextInput
      ref={lastNameInputRef}
      placeholder="Last Name"
      value={lastName}
      onChangeText={setLastName}
    />
  </View>
  {lastNameError ? <Text style={styles.errorText}>{lastNameError}</Text> : null}
</View>


            <View style={styles.formGroup}>
              <View style={styles.inputContainer}>
                <Icon name="phone" size={20} color="#2e3192" style={styles.inputIcon} />
                <AnimatedTextInput
                  placeholder="Mobile Number"
                  value={Mobileno}
                  keyboardType="phone-pad"
                  onChangeText={setMobileno}
                  maxLength={10}
                />
              </View>
              {MobilenoError ? <Text style={styles.errorText}>{MobilenoError}</Text> : null}
            </View>

            <View style={styles.formGroup}>
              <View style={styles.inputContainer}>
                <Icon name="envelope" size={20} color="#2e3192" style={styles.inputIcon} />
                <AnimatedTextInput
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            </View>

            <View style={styles.formGroup}>
              <View style={styles.inputContainer}>
                <Icon name="home" size={20} color="#2e3192" style={styles.inputIcon} />
                <AnimatedTextInput
                  placeholder="Address"
                  value={address}
                  onChangeText={setAddress}
                />
              </View>
              {addressError ? <Text style={styles.errorText}>{addressError}</Text> : null}
            </View>

            <View style={styles.formGroup}>
              <View style={styles.inputContainer}>
                <Icon name="briefcase" size={20} color="#2e3192" style={styles.inputIcon} />
                <AnimatedTextInput
                  placeholder="Business Name"
                  value={businessName}
                  onChangeText={setBusinessName}
                />
              </View>
              {businessNameError ? <Text style={styles.errorText}>{businessNameError}</Text> : null}
            </View>
            
            <View style={styles.formGroup}>
              <View style={styles.dropdownWrapper}>
                <Icon name="list" size={20} color="#2e3192" style={styles.dropdownIcon} />
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  placeholder="Select Profession"
      data={profession
  .sort((a, b) => a.ProfessionName.localeCompare(b.ProfessionName)) 
  .map((item, index) => ({
    label: item.ProfessionName,
    value: item.ProfessionName,
    backgroundColor: index % 2 === 0 ? 'white' : '#F5F7FE',
  }))
}

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
              </View>
              {selectedProfessionError && <Text style={styles.errorText}>{selectedProfessionError}</Text>}
            </View>

            <View style={styles.formGroup}>
              <View style={styles.dropdownWrapper}>
                <Icon name="map-marker" size={20} color="#2e3192" style={styles.dropdownIcon} />
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  placeholder="Select Location"
                  data={Array.isArray(LocationID) && LocationID.length > 0 ? LocationID
                   .sort((a, b) => a.label.localeCompare(b.label)) 
                     .map((item, index) => ({
                    label: item.label,
                    value: item.value,
                    backgroundColor: index % 2 === 0 ? 'white' : '#F5F7FE',
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
              </View>
              {selectedLocationError && <Text style={styles.errorText}>{selectedLocationError}</Text>}
            </View>

            <View style={styles.formGroup}>
              <View style={styles.dropdownWrapper}>
                <Icon name="user-plus" size={20} color="#2e3192" style={styles.dropdownIcon} />
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  placeholder="Referred By (Optional)"
                  data={
                    Array.isArray(referMembers)
                      ? referMembers
                      .sort((a, b) => a.UserInfo.localeCompare(b.UserInfo))
                      .map((member, index) => ({
                          label: member.UserInfo,
                          value: member.UserId,
                          backgroundColor: index % 2 === 0 ? 'white' : '#F5F7FE',
                        }))
                      : []
                  }
                  value={referredBy}
                  onChange={(item) => handleReferredByChange(item.value)}
                  search
                  searchPlaceholder="Search Referrer"
                  labelField="label"
                  valueField="value"
                  inputSearchStyle={styles.inputSearchStyle}
                  renderItem={(item) => (
                    <View style={[styles.item, { backgroundColor: item.backgroundColor }]}>
                      <Text style={styles.itemText}>{item.label}</Text>
                    </View>
                  )}
                />
              </View>
              {referredByError ? <Text style={styles.errorText}>{referredByError}</Text> : null}
            </View>

            <TouchableOpacity 
              style={styles.registerButton} 
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.registerButtonText}>Register</Text>
              )}
            </TouchableOpacity>
            
            <View style={styles.loginPrompt}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>

      {/* Already Registered Modal */}
      <Modal
        transparent={true}
        visible={showAlreadyRegisteredModal}
        animationType="fade"
        onRequestClose={() => setShowAlreadyRegisteredModal(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Icon name="info-circle" size={50} color="#2e3192" style={styles.modalIcon} />
            <Text style={styles.modalTitle}>Already Registered</Text>
            <Text style={styles.modalText}>
              You have already registered. Please login and activate your account.
            </Text>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={handleLoginPress}
            >
              <Text style={styles.modalButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingTop: 40,
    paddingBottom: 30,
  },
  formContainer: {
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e3192',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#F5F7FE',
    paddingHorizontal: 12,
    height: 55,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 12,
  },
  eyeIcon: {
    padding: 8,
  },
  dropdownWrapper: {
    position: 'relative',
  },
  dropdownIcon: {
    position: 'absolute',
    left: 12,
    top: 18,
    zIndex: 1,
  },
  dropdown: {
    height: 55,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingLeft: 40,
    backgroundColor: '#F5F7FE',
  },
  placeholderStyle: {
    color: '#888',
    fontSize: 16,
  },
  selectedTextStyle: {
    color: '#333',
    fontSize: 16,
  },
  inputSearchStyle: {
    borderColor: '#e0e0e0',
    borderRadius: 8,
    height: 40,
    color: '#333',
  },
  item: {
    height: 50,
    justifyContent: 'center',
    paddingLeft: 20,
  },
  itemText: {
    fontSize: 15,
    color: '#333',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  registerButton: {
    backgroundColor: '#2e3192',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#2e3192',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#666',
    fontSize: 14,
  },
  loginLink: {
    color: '#2e3192',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Modal styles
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalIcon: {
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e3192',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#2e3192',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;