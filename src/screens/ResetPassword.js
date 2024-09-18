import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import styles from '../components/layout/ResetPasswordStyle';
import reset_password from '../../assets/images/reset_password.png';
import { toastConfig } from '../utils/toastConfig';
import { API_BASE_URL } from '../constants/Config';


const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigation = useNavigation();
  const route = useRoute();
  const { mobileNo } = route.params || {};

  const handleSubmit = async () => {
    if (newPassword === '' || confirmPassword === '') {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fill in all fields.',
        position: 'top',
        config: toastConfig,
      });
      return;
    }
  
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    setErrorMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/updatePassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobileNo: mobileNo,
          password: newPassword,
        }),
      });
  
      const result = await response.json();
      if (response.ok) {
        // Handle success response
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Password has been reset successfully.',
          position: 'top',
          config: toastConfig,
        });
        setTimeout(() => {
          navigation.navigate('Login');
        }, 1000);
      } else {
        // Handle API error response
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: result.message || 'Something went wrong.',
          position: 'top',
          config: toastConfig,
        });
      }
    } catch (error) {
      // Handle network or server errors
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Network error. Please try again later.',
        position: 'top',
        config: toastConfig,
      });
    }
  };  

  return (
    <View style={styles.container}>
      <Text style={styles.mobileNoText}>Mobile Number: {mobileNo}</Text>
      <Image source={reset_password} style={styles.image} />
      <Text style={styles.text}>Create new password</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry={!isPasswordVisible}
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TouchableOpacity 
          style={styles.eyeIcon}
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          <Icon name={isPasswordVisible ? "eye" : "eye-slash"} size={20} color="#333" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry={!isConfirmPasswordVisible}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity 
          style={styles.eyeIcon}
          onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
        >
          <Icon name={isConfirmPasswordVisible ? "eye" : "eye-slash"} size={20} color="#333" />
        </TouchableOpacity>
      </View>
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ResetPassword;