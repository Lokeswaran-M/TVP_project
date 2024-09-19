import React, { useState, useEffect ,useRef} from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import styles from '../components/layout/ForgetPasswordStyle';
// import ForgetImage from '../../assets/images/Forget.png';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';
import { API_BASE_URL } from '../constants/Config';
import { toastConfig } from '../utils/toastConfig';
import OTPTextInput from 'react-native-otp-textinput';
import { useRoute } from '@react-navigation/native';
 
const Otpscreen = ({ navigation }) => {
  const route = useRoute();
  const { Mobileno } = route.params || {}; 

  // const [phoneNumber, setPhoneNumber] = useState('');
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
    if (Mobileno.length < 10) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a valid phone number.',
        position: 'top',
        config: toastConfig,
      }); 
      return;
    }
    setLoading(true);
    const generatedOtp = generateOtp();
    const message = `Your OTP is: ${generatedOtp}`;
    console.log("OTP----------------------", generatedOtp);
    try {
      const response = await fetch(`${API_BASE_URL}/sendOtp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Mobileno,
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
          text1: 'Success',
          text2: `OTP sent successfully to ${Mobileno}.`,
          position: 'top',
          config: toastConfig,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: data.message || 'Failed to send OTP.',
          position: 'top',
          config: toastConfig,
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An error occurred while sending the OTP.',
        position: 'top',
        config: toastConfig,
      });
    } finally {
      setLoading(false);
    }
  };
  const handleOtpVerification = async () => {
    if (otpExpired) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'OTP has expired. Please request a new OTP.',
        position: 'top',
        config: toastConfig,
      });
      return;
    }
  
    if (Mobileno.length < 10 || otp.length < 4) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a valid OTP.',
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
          enteredOtp: otp,
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        // OTP Verified successfully
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: data.message || 'OTP verified successfully!',
          position: 'top',
          config: toastConfig,
        });
  
        // Call the activateUser API after successful OTP verification
        await fetch(`${API_BASE_URL}/activateUser`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ Mobileno }),
        });
  
        // Wait for the toast to disappear, then navigate
        setTimeout(() => {
          navigation.navigate('Login');
        }, 2000);
  
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: data.message || 'Failed to verify OTP.',
          position: 'top',
          config: toastConfig,
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An error occurred while verifying the OTP.',
        position: 'top',
        config: toastConfig,
      });
    } finally {
      setLoading(false);
    }
  };   
  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
      <Text style={styles.title}>Verify your Phone!</Text>
        <Text style={styles.title}>We will send you a one time password on your WhatsApp.</Text> 
        {/* <Image source={ForgetImage} style={styles.image} /> */}
       
        <View style={styles.inputContainer}>
          <Icon name="whatsapp" size={20} color="#075E54" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your Phone Number"
            keyboardType="phone-pad"
            value={Mobileno}
            // onChangeText={setPhoneNumber}
          />
        </View>
        {!otpSent && (
          <TouchableOpacity 
            onPress={handlePasswordReset} 
            style={styles.button} 
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Send OTP</Text>
            )}
          </TouchableOpacity>
        )}
        {otpSent && (
          <>
            <View style={styles.otpContainer}>
              <Text style={styles.otpTitle}>Enter the OTP sent to your phone</Text>
              <OTPTextInput
                ref={otpInputRef} 
               handleTextChange={(text) => setOtp(text)}
              inputCount={4}
              containerStyle={styles.otpTextInputContainer}
              textInputStyle={styles.otpTextInput}
                // handleTextChange={setOtp}
                // inputCount={4}
                // containerStyle={styles.otpTextInputContainer}
                // textInputStyle={styles.otpTextInput}
              />
              <Text style={styles.timerText}>
                OTP expires in: {timer} seconds
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleOtpVerification}
              >
              <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handlePasswordReset}
              disabled={loading || timer > 0}
            >
              <Text>Didn't receive OTP?<Text style={styles.resendButtonText}> Resend</Text></Text>
            </TouchableOpacity>
          </>
        )}
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </View>
    </ScrollView>
  );
};
export default Otpscreen;