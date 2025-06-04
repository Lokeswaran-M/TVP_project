import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';
import { API_BASE_URL } from '../constants/Config';
import { toastConfig } from '../utils/toastConfig';
import { useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const OtpScreen = ({ navigation }) => {
  const route = useRoute();
  const { Mobileno,  firstName, businessName, LocationID, LocationList } = route.params || {};
  console.log('Received Mobileno:=================', Mobileno);
  console.log('Received first Name:================', firstName); 
  console.log('Received LocationID:==============', LocationID); 
  console.log('Received LocationList:==============', LocationList);
    console.log('Received businessName:==============', businessName);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [otpExpired, setOtpExpired] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const inputRefs = useRef([
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef()
  ]);
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setOtpExpired(true);
      clearOtpInput();
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);
  const clearOtpInput = () => {
    setOtp(['', '', '', '']);
    inputRefs.current.forEach((ref) => {
      if (ref.current) {
        ref.current.clear();
      }
    });
  };
  const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };
  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3 && inputRefs.current[index + 1]?.current) {
      inputRefs.current[index + 1].current.focus();
    }
  };
  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].current.focus();
    }
  };

const handleSendOTP = async () => {
  if (!Mobileno || Mobileno.length < 10) {
    Toast.show({
      type: 'error',
      text1: 'Invalid Phone Number',
      text2: 'Please enter a valid phone number.',
      position: 'top',
      config: toastConfig,
    });
    return;
  }
  
  setLoading(true);
  const generatedOtp = generateOtp();
  const message = `Your OTP is: ${generatedOtp}`;

  let locationName = '';
  if (LocationList && LocationID) {
    const selectedLocation = LocationList.find(loc => loc.value === LocationID);
    locationName = selectedLocation ? selectedLocation.label : '';
    console.log('Selected Location:', selectedLocation);
    console.log('Location Name:', locationName);
  }
  
  try {
    console.log('Sending OTP with payload:', {
      Mobileno,
      message,
      businessName,
      LocationID,
      firstName: firstName || '',
      location: locationName || '',
    });

    const response = await fetch(`${API_BASE_URL}/sendOtp`, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({
      Mobileno,
      message,
      businessName,
      LocationID,
      firstName: firstName || '',
      location: locationName || '', 
      }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      setOtpSent(true);
      setOtpExpired(false);
      setTimer(60);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 30,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start();
      });
      
      Toast.show({
        type: 'success',
        text1: 'OTP Sent',
        text2: `Check your WhatsApp for the OTP code.`,
        position: 'top',
        config: toastConfig,
      });
      
      if (inputRefs.current[0]?.current) {
        setTimeout(() => {
          inputRefs.current[0].current.focus();
        }, 800);
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'Failed to Send OTP',
        text2: data.message || 'Please try again later.',
        position: 'top',
        config: toastConfig,
      });
    }
  } catch (error) {
    console.error('OTP Send Error:', error);
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'Something went wrong. Please try again.',
      position: 'top',
      config: toastConfig,
    });
  } finally {
    setLoading(false);
  }
};












  const handleOtpVerification = async () => {
    const otpString = otp.join('');
    
    if (otpExpired) {
      Toast.show({
        type: 'error',
        text1: 'OTP Expired',
        text2: 'Please request a new OTP code.',
        position: 'top',
        config: toastConfig,
      });
      return;
    }
  
    if (otpString.length < 4) {
      Toast.show({
        type: 'error',
        text1: 'Invalid OTP',
        text2: 'Please enter a complete 4-digit OTP.',
        position: 'top',
        config: toastConfig,
      });
      return;
    }
  
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/verifyOtp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      body: JSON.stringify({
      Mobileno,
      enteredOtp: otpString,
      businessName,
      LocationID,
      firstName: firstName || '',
        }),
      });
  
      const data = await response.json();
      
      if (response.ok) {
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0.3,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
        
        Toast.show({
          type: 'success',
          text1: 'Verification Successful',
          text2: 'Your phone number has been verified!',
          position: 'top',
          config: toastConfig,
        });
        await fetch(`${API_BASE_URL}/activateUser`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ Mobileno }),
        });
        setTimeout(() => {
          navigation.navigate('Login');
        }, 2000);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Verification Failed',
          text2: data.message || 'Invalid OTP code.',
          position: 'top',
          config: toastConfig,
        });
      }
} catch (error) {
  console.error("Error during OTP verification fetch:", error);

  Toast.show({
    type: 'error',
    text1: 'Error',
    text2: error.message || 'Something went wrong. Please try again.',
    position: 'top',
    config: toastConfig,
  });
}
 finally {
      setLoading(false);
    }
  };



  
  const formatMobile = (number) => {
    if (!number) return '';
    const cleaned = number.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return number;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#2e3192" barStyle="light-content" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollViewContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Animated.View 
            style={[
              styles.contentContainer,
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }] 
              }
            ]}
          >
            {!otpSent ? (
              <>
                <View style={styles.headerContainer}>
                <Icon name="whatsapp" size={40} color="#25D366"  style={styles.headerIcon} />
                  {/* <Icon name="shield" size={40} color="#2e3192" style={styles.headerIcon} /> */}
                  <Text style={styles.title}>Verify Your Phone</Text>
                  <Text style={styles.subtitle}>
                    We'll send a verification code to your <Text style={{ color:"#25D366" , fontWeight:"bold" ,}} >WhatsApp</Text>
                  </Text>
                </View>
                
                <View style={styles.inputWrapper}>
                  <View style={styles.phoneInputContainer}>
                    <Icon name="whatsapp" size={20} color="#075E54" style={styles.inputIcon} />
                    <TextInput
                      style={styles.phoneInput}
                      placeholder="Enter your phone number"
                      keyboardType="phone-pad"
                      value={Mobileno}
                      editable={false}
                      maxLength={15}
                    />
                  </View>
                  
                  <LinearGradient
                    colors={['#2e3192', '#3957E8']}
                    style={styles.gradientButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <TouchableOpacity
                      onPress={handleSendOTP}
                      disabled={loading}
                      style={styles.button}
                    >
                      {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text style={styles.buttonText}>Send OTP</Text>
                      )}
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              </>
            ) : (
              <>
                <View style={styles.headerContainer}>
                  <Icon name="lock" size={40} color="#2e3192" style={styles.headerIcon} />
                  <Text style={styles.title}>Enter Verification Code</Text>
                  <Text style={styles.subtitle}>
                    We've sent the code to {(Mobileno)}
                  </Text>
                </View>
                
                <View style={styles.otpContainer}>
                  {/* OTP Input Fields */}
                  <View style={styles.otpInputsContainer}>
                    {[0, 1, 2, 3].map((index) => (
                      <View
                        key={index}
                        style={[
                          styles.otpInputBox,
                          focusedInput === index && styles.otpInputBoxFocused,
                        ]}
                      >
                        <TextInput
                          ref={inputRefs.current[index]}
                          style={styles.otpInput}
                          maxLength={1}
                          keyboardType="number-pad"
                          value={otp[index]}
                          onChangeText={(value) => handleOtpChange(value, index)}
                          onFocus={() => setFocusedInput(index)}
                          onBlur={() => setFocusedInput(null)}
                          onKeyPress={(e) => handleKeyPress(e, index)}
                        />
                      </View>
                    ))}
                  </View>
                  
                  {/* Timer */}
                  <Text style={[
                    styles.timerText,
                    timer < 10 && styles.timerWarning
                  ]}>
                    Code expires in {timer} seconds
                  </Text>
                  
                  <LinearGradient
                    colors={['#2e3192', '#3957E8']}
                    style={styles.gradientButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <TouchableOpacity
                      onPress={handleOtpVerification}
                      disabled={loading}
                      style={styles.button}
                    >
                      {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text style={styles.buttonText}>Verify</Text>
                      )}
                    </TouchableOpacity>
                  </LinearGradient>
                  
                  <TouchableOpacity
                    onPress={handleSendOTP}
                    disabled={loading || timer > 0}
                    style={styles.resendContainer}
                  >
                    <Text style={styles.resendText}>
                      Didn't receive code? {' '}
                      <Text 
                        style={[
                          styles.resendLinkText,
                          timer > 0 && styles.resendLinkDisabled
                        ]}
                      >
                        Resend
                      </Text>
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Animated.View>
        </View>
      </ScrollView>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F7FE',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  contentContainer: {
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerIcon: {
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  inputWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 55,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
  },
  inputIcon: {
    marginRight: 10,
  },
  phoneInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  gradientButton: {
    width: '100%',
    height: 55,
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 15,
  },
  button: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  otpContainer: {
    width: '100%',
    alignItems: 'center',
  },
  otpInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  otpInputBox: {
    width: width * 0.15,
    height: width * 0.15,
    maxWidth: 60,
    maxHeight: 60,
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  otpInputBoxFocused: {
    borderColor: '#3957E8',
    backgroundColor: '#fff',
    shadowColor: '#3957E8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  otpInput: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  timerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  timerWarning: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  resendContainer: {
    marginTop: 15,
    padding: 10,
  },
  resendText: {
    fontSize: 14,
    color: '#666',
  },
  resendLinkText: {
    color: '#3957E8',
    fontWeight: '600',
  },
  resendLinkDisabled: {
    color: '#999',
  },
});

export default OtpScreen;