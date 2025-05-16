import React, { useState, useCallback, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from 'react-native';
import { API_BASE_URL } from '../constants/Config';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { Dropdown } from 'react-native-element-dropdown';
import LinearGradient from 'react-native-linear-gradient';
const { width, height } = Dimensions.get('window');
const scale = width / 375;
const verticalScale = height / 812;
const normalize = (size) => Math.round(size * scale);

const AnimatedInput = ({ 
  label, 
  value, 
  onChangeText, 
  icon, 
  error, 
  editable = true, 
  keyboardType = 'default',
  secureTextEntry = false,
  placeholder = ''
}) => {
  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.inputLabelTop}>
        {icon && <Icon name={icon} size={normalize(14)} color="#555" />} {label}
      </Text>
      <View style={[
        styles.inputContainer,
        error ? styles.inputContainerError : null,
        !editable ? styles.inputContainerDisabled : null
      ]}>
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          editable={editable}
          placeholder={placeholder}
          placeholderTextColor="#aaa"
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const AddBusiness = () => {
  const [profileData, setProfileData] = useState({});
  const userId = useSelector((state) => state.UserId);
  const navigation = useNavigation();
  
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [profession, setProfession] = useState([]);
  console.log("Profession---------------------------", profession);
  const [filteredProfessions, setFilteredProfessions] = useState([]);
  const [selectedProfession, setSelectedProfession] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locations, setLocations] = useState([]);
  
  const [emailError, setEmailError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [businessNameError, setBusinessNameError] = useState('');
  const [selectedProfessionError, setSelectedProfessionError] = useState('');
  const [selectedLocationError, setSelectedLocationError] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const profileResponse = await fetch(`${API_BASE_URL}/api/user/business-info/${userId}`);
      if (!profileResponse.ok) {
        throw new Error('Failed to fetch profile data');
      }
      
      const profileData = await profileResponse.json();
      
      if (profileResponse.status === 404) {
        setProfileData({});
      } else {
        setProfileData(profileData);
        if (profileData.Email) setEmail('');
        if (profileData.Address) setAddress('');
        if (profileData.BusinessName) setBusinessName('');
      }

      if (profileData.RollId === 2) {
        const { LocationID: locationId } = profileData;
        if (locationId) {
          const excludeResponse = await fetch(
            `${API_BASE_URL}/api/professions/exclude-business-location/${locationId}`
          );
          if (!excludeResponse.ok) {
            throw new Error(`HTTP error! status: ${excludeResponse.status}`);
          }
          const excludeData = await excludeResponse.json();
          setProfession(excludeData);
          
          const filtered = excludeData.filter(item => 
            item.ProfessionName !== profileData.Profession
          );
          setFilteredProfessions(filtered);
        }
      } else {
        const executeResponse = await fetch(`${API_BASE_URL}/execute-profession`);
        if (!executeResponse.ok) {
          throw new Error(`HTTP error! status: ${executeResponse.status}`);
        }
        const executeData = await executeResponse.json();
        setProfession(executeData.executeprofession);

        const filtered = executeData.executeprofession.filter(item => 
          item.ProfessionName !== profileData.Profession
        );
        setFilteredProfessions(filtered);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [userId])
  );

  const fetchLocationsByProfession = async (selectedProfession) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/available-location?profession=${selectedProfession}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setLocations(data);
    } catch (error) {
      console.error('Error fetching locations:', error);
      Alert.alert('Error', 'Failed to load locations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfessionChange = (profession) => {
    setSelectedProfession(profession);
    setSelectedLocation(null);
    setSelectedProfessionError('');
    
    if (profileData.RollId !== 2 && profileData.RollId !== 3) {
      fetchLocationsByProfession(profession);
    }
  };

  const validateForm = () => {
    setEmailError('');
    setAddressError('');
    setBusinessNameError('');
    setSelectedProfessionError('');
    setSelectedLocationError('');
    
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
      setBusinessNameError('Business name is required');
      isValid = false;
    }
    
    if (!selectedProfession) {
      setSelectedProfessionError('Profession is required');
      isValid = false;
    }

    if (profileData.RollId !== 2 && profileData.RollId !== 3 && !selectedLocation) {
      setSelectedLocationError('Location is required');
      isValid = false;
    }
    
    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const LocationID = profileData.RollId === 2 || profileData.RollId === 3 
        ? profileData.LocationID 
        : selectedLocation;
      
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
          LocationID
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register business');
      }
      
      await response.json();
      
      Alert.alert(
        'Success',
        'Business added successfully!',
        [{ 
          text: 'OK',
          onPress: () => navigation.pop(2)
        }]
      );
    } catch (error) {
      console.error('Error registering business:', error);
      Alert.alert('Error', error.message || 'Failed to add business. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <LinearGradient
        colors={['#2e3192', '#3957E8']}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </LinearGradient>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#2e3192" barStyle="light-content" />
      
      <LinearGradient
        colors={['#2e3192', '#3957E8']}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Add New Business</Text>
          <Text style={styles.headerSubtitle}>
            Please fill in the details to register your business
          </Text>
        </View>
      </LinearGradient>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            <View style={styles.formCard}>
              <AnimatedInput
                label="Email Address"
                value={email}
                onChangeText={setEmail}
                icon="envelope"
                error={emailError}
                keyboardType="email-address"
                placeholder="Enter your email address"
              />
              
              <AnimatedInput
                label="Business Name"
                value={businessName}
                onChangeText={setBusinessName}
                icon="briefcase"
                error={businessNameError}
                placeholder="Enter your business name"
              />
              
              <AnimatedInput
                label="Business Address"
                value={address}
                onChangeText={setAddress}
                icon="map-marker"
                error={addressError}
                placeholder="Enter your business address"
              />
              
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabelTop}>
                  <Icon name="list" size={normalize(14)} color="#555" /> Select Profession
                </Text>
                <Dropdown
                  style={[styles.dropdown, selectedProfessionError ? styles.dropdownError : null]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  placeholder="Select a profession"
                  data={filteredProfessions.map((item, index) => ({
                    label: item.ProfessionName,
                    value: item.ProfessionName,
                  }))}
                  value={selectedProfession}
                  onChange={(item) => handleProfessionChange(item.value)}
                  search
                  searchPlaceholder="Search for profession"
                  labelField="label"
                  valueField="value"
                  inputSearchStyle={styles.inputSearchStyle}
                  maxHeight={normalize(300)}
                  renderItem={(item) => (
                    <View style={styles.dropdownItem}>
                      <Text style={styles.dropdownItemText}>{item.label}</Text>
                    </View>
                  )}
                />
                {selectedProfessionError ? 
                  <Text style={styles.errorText}>{selectedProfessionError}</Text> 
                  : null
                }
              </View>
              
              {(profileData.RollId === 2 || profileData.RollId === 3) ? (
                <AnimatedInput
                  label="Location"
                  value={profileData.LocationName || 'None'}
                  editable={false}
                  icon="location-arrow"
                  error={selectedLocationError}
                />
              ) : (
                locations.length > 0 && (
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabelTop}>
                      <Icon name="location-arrow" size={normalize(14)} color="#555" /> Select Location
                    </Text>
                    <Dropdown
                      style={[styles.dropdown, selectedLocationError ? styles.dropdownError : null]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      placeholder="Select a location"
                      data={locations.map((item) => ({
                        label: item.LocationName,
                        value: item.LocationID,
                      }))}
                      value={selectedLocation}
                      onChange={(item) => {
                        setSelectedLocation(item.value);
                        setSelectedLocationError('');
                      }}
                      search
                      searchPlaceholder="Search for location"
                      labelField="label"
                      valueField="value"
                      inputSearchStyle={styles.inputSearchStyle}
                      maxHeight={normalize(300)}
                      renderItem={(item) => (
                        <View style={styles.dropdownItem}>
                          <Text style={styles.dropdownItemText}>{item.label}</Text>
                        </View>
                      )}
                    />
                    {selectedLocationError ? 
                      <Text style={styles.errorText}>{selectedLocationError}</Text> 
                      : null
                    }
                  </View>
                )
              )}
            </View>
          </View>
          
          <LinearGradient
            colors={['#2e3192', '#3957E8']}
            style={styles.registerButtonGradient}
          >
            <TouchableOpacity 
              style={[
                styles.registerButton,
                isSubmitting ? styles.registerButtonDisabled : null
              ]} 
              onPress={handleRegister}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.registerButtonText}>
                  <Icon name="plus" size={normalize(16)} /> Add Business
                </Text>
              )}
            </TouchableOpacity>
          </LinearGradient>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FE',
  },
  keyboardAvoidView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: normalize(30),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: normalize(10),
    color: '#fff',
    fontSize: normalize(12),
    fontWeight: '500',
  },
  headerGradient: {
    borderBottomLeftRadius: normalize(30),
    borderBottomRightRadius: normalize(30),
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  headerContent: {
    padding: normalize(20),
    paddingTop: normalize(15),
    paddingBottom: normalize(25),
  },
  headerTitle: {
    fontSize: normalize(20),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: normalize(5),
  },
  headerSubtitle: {
    fontSize: normalize(12),
    color: '#e0e0e0',
  },
  formContainer: {
    paddingHorizontal: normalize(15),
    marginTop: normalize(10),
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: normalize(15),
    padding: normalize(20),
    marginBottom: normalize(20),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  inputWrapper: {
    marginBottom: normalize(20),
  },
  inputLabelTop: {
    fontSize: normalize(12),
    color: '#555',
    marginBottom: normalize(8),
    fontWeight: '500',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: normalize(10),
    backgroundColor: '#fff',
    overflow: 'hidden',
    height: normalize(50),
    justifyContent: 'center',
  },
  inputContainerError: {
    borderColor: '#ff3b30',
  },
  inputContainerDisabled: {
    backgroundColor: '#f9f9f9',
    borderColor: '#eee',
  },
  textInput: {
    fontSize: normalize(14),
    color: '#333',
    paddingHorizontal: normalize(15),
    height: '100%',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: normalize(10),
    marginTop: normalize(4),
    marginLeft: normalize(5),
  },
  dropdown: {
    height: normalize(50),
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: normalize(10),
    paddingHorizontal: normalize(15),
    backgroundColor: '#fff',
  },
  dropdownError: {
    borderColor: '#ff3b30',
  },
  placeholderStyle: {
    fontSize: normalize(14),
    color: '#aaa',
  },
  selectedTextStyle: {
    fontSize: normalize(14),
    color: '#333',
  },
  inputSearchStyle: {
    height: normalize(40),
    fontSize: normalize(14),
    borderColor: '#ddd',
  },
  dropdownItem: {
    padding: normalize(15),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: normalize(14),
    color: '#333',
  },
  registerButtonGradient: {
    borderRadius: normalize(10),
    marginHorizontal: normalize(20),
    marginTop: normalize(10),
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  registerButton: {
    paddingVertical: normalize(15),
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButtonDisabled: {
    opacity: 0.7,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: normalize(16),
    fontWeight: '600',
  }
});

export default AddBusiness;