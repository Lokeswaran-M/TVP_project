import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  StatusBar
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';
import OTPTextInput from 'react-native-otp-textinput';
import { API_BASE_URL } from '../constants/Config';
const { width, height } = Dimensions.get('window');

const ForgetPassword = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [otpExpired, setOtpExpired] = useState(false);
  const otpInputRef = useRef(null);

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
    setOtp('');
    if (otpInputRef.current) {
      otpInputRef.current.clear();
    }
  };

  const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const handlePasswordReset = async () => {
    if (phoneNumber.length < 10) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Phone Number',
        text2: 'Please enter a valid phone number.',
        position: 'top',
      });
      return;
    }
    
    setLoading(true);
    const generatedOtp = generateOtp();
    const message = `Your OTP is: ${generatedOtp}`;
    console.log("OTP Generated:", generatedOtp);
    
    try {
      const response = await fetch(`${API_BASE_URL}/sendOtp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Mobileno: phoneNumber,
          message,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setOtpSent(true);
        setOtpExpired(false);
        setTimer(60);
        Toast.show({
          type: 'success',
          text1: 'OTP Sent',
          text2: `Verification code sent to ${phoneNumber}`,
          position: 'top',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed to Send OTP',
          text2: data.message || 'Please try again later.',
          position: 'top',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: 'Unable to connect to server. Please check your connection.',
        position: 'top',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async () => {
    if (otpExpired) {
      Toast.show({
        type: 'error',
        text1: 'OTP Expired',
        text2: 'Your verification code has expired. Please request a new one.',
        position: 'top',
      });
      return;
    }
    
    if (phoneNumber.length < 10 || otp.length < 4) {
      Toast.show({
        type: 'error',
        text1: 'Invalid OTP',
        text2: 'Please enter a valid verification code.',
        position: 'top',
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
          Mobileno: phoneNumber,
          enteredOtp: otp,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        Toast.show({
          type: 'success',
          text1: 'Verification Successful',
          text2: 'Redirecting to reset password screen',
          position: 'top',
        });
        
        setTimeout(() => {
          navigation.navigate('ResetPassword', { Mobileno: phoneNumber });
        }, 2000);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Verification Failed',
          text2: data.message || 'Invalid verification code',
          position: 'top',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: 'Unable to verify OTP. Please check your connection.',
        position: 'top',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <LinearGradient
        colors={['#2e3192', '#3957E8']}
        style={styles.headerGradient}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Forgot Password</Text>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentContainer}>
            <Image 
              source={require('../../assets/images/Forget.png')} 
              style={styles.image}
              resizeMode="contain"
            />
            
            <View style={styles.textContainer}>
              <Text style={styles.title}>Don't worry!</Text>
              <Text style={styles.subtitle}>
                Enter your WhatsApp number and we'll send you a verification code to reset your password.
              </Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <View style={styles.iconContainer}>
                  <Icon name="whatsapp" size={20} color="#075E54" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your phone number"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  maxLength={10}
                />
              </View>
              {otpSent && (
                <View style={styles.otpContainer}>
                  <Text style={styles.otpTitle}>
                    Verification Code
                  </Text>
                  <Text style={styles.otpDescription}>
                    Enter the 4-digit code sent to your WhatsApp
                  </Text>

                  <OTPTextInput
                    ref={otpInputRef}
                    handleTextChange={(text) => setOtp(text)}
                    inputCount={4}
                    keyboardType="numeric"
                    containerStyle={styles.otpTextInputContainer}
                    textInputStyle={styles.otpTextInput}
                    tintColor="#3957E8"
                  />

                  <View style={styles.timerContainer}>
                    <Text style={styles.timerText}>
                      Code expires in: <Text style={styles.timerNumber}>{timer}s</Text>
                    </Text>
                  </View>
                </View>
              )}
              {!otpSent ? (
                <TouchableOpacity
                  onPress={handlePasswordReset}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={['#2e3192', '#3957E8']}
                    style={styles.primaryButton}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.primaryButtonText}>Send Verification Code</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity
                    onPress={handleOtpVerification}
                    disabled={loading}
                  >
                    <LinearGradient
                      colors={['#2e3192', '#3957E8']}
                      style={styles.primaryButton}
                    >
                      {loading ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <Text style={styles.primaryButtonText}>Verify & Continue</Text>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handlePasswordReset}
                    style={styles.secondaryButton}
                    disabled={loading || timer > 0}
                  >
                    <Text style={[
                      styles.secondaryButtonText,
                      (loading || timer > 0) && styles.disabledText
                    ]}>
                      Didn't receive code? <Text style={styles.resendText}>Resend</Text>
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerGradient: {
    width: '100%',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 15,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  image: {
    width: width * 0.65,
    height: height * 0.22,
    marginBottom: 25,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2e3192',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  iconContainer: {
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    paddingRight: 15,
    fontSize: 16,
    color: '#333333',
  },
  otpContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  otpTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  otpDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
    textAlign: 'center',
  },
  otpTextInputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  otpTextInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    width: 55,
    height: 55,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timerContainer: {
    alignItems: 'center',
    marginTop: 5,
  },
  timerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  timerNumber: {
    fontWeight: '600',
    color: '#3957E8',
  },
  primaryButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  secondaryButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
  disabledText: {
    opacity: 0.6,
  },
  resendText: {
    fontWeight: '700',
    color: '#3957E8',
    textDecorationLine: 'underline',
  },
});

export default ForgetPassword;