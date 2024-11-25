import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AnimatedTextInput from './AnimatedTextInput';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import {API_BASE_URL} from '../constants/Config';
import { useSelector } from 'react-redux';
const SubstituteLogin = () => {
  const [S_User, setUsername] = useState('');
  const [S_Password, setPassword] = useState('');
  const [conPassword, setConPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisible1, setPasswordVisible1] = useState(false);

  const user = useSelector((state) => state.user);
  console.log('Sustitute User------------',user?.userId)
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const togglePasswordVisibility1 = () => {
    setPasswordVisible1(!passwordVisible1);
  };

  const handleSignup = async () => {
    if (!user?.userId) {
      Alert.alert('Error', 'User ID not found.');
      return;
    }
      if (S_User === '' || S_Password === '' || conPassword === '') {
      Alert.alert('Error', 'All fields are required.');
      return;
    }
    if (S_Password !== conPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/updateSubUser?userId=${user.userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.userId,
          S_User, 
          S_Password,
        }),
      });
  
      const result = await response.json();
      if (response.ok) {
        Alert.alert('Success', result.message);
        console.log("Error-------",result.message);
      } else {
        Alert.alert('Error', result.message);
        console.log("Error-------",result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong.');
    }
  };
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          <Text style={styles.Blabel}>Create Substitute</Text>

          <View style={styles.inputContainer}>
            <AnimatedTextInput
              placeholder="Substitute Name"
              value={S_User}
              onChangeText={setUsername}
              keyboardType="default"
            />
            <Icon name="user" size={20} color="#A3238F" style={styles.icon} />
          </View>

          <View style={styles.inputContainer}>
            <AnimatedTextInput
              placeholder="New Password"
              value={S_Password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
              keyboardType="default"
            />
            <TouchableOpacity onPress={togglePasswordVisibility} style={styles.icon}>
              <Icon name={passwordVisible ? "eye" : "eye-slash"} size={20} color="#A3238F" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <AnimatedTextInput
              placeholder="Confirm Password"
              value={conPassword}
              onChangeText={setConPassword}
              secureTextEntry={!passwordVisible1}
              keyboardType="default"
            />
            <TouchableOpacity onPress={togglePasswordVisibility1} style={styles.icon}>
            <Icon name={passwordVisible1 ? "eye" : "eye-slash"} size={20} color="#A3238F" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSignup}
          >
            <Text style={styles.buttonText}>Generate</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F3F3F3', // Light gray background for the entire screen
    flex: 1,
  },
  content: {
    padding: 40,
    paddingTop: 30,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginTop: 100, // Adjusted for better spacing
    marginBottom: 60,
    marginHorizontal: 30,
    borderRadius: 20,
    shadowColor: "#000", // Shadow effect for container
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5, // For Android shadow
  },
  Blabel: {
    fontSize: 28, // Increased font size for the title
    color: '#A3238F',
    fontWeight: 'bold',
    paddingBottom: 40,
    textAlign: 'center', // Centering the title
  },
  inputContainer: {
    marginBottom: 20,
    position: 'relative',
    borderBottomWidth: 1, // Added bottom border for input fields
    borderBottomColor: '#DDD', // Light gray border
  },
  icon: {
    position: 'absolute',
    right: 10,
    top: 30,
    color: '#A3238F',
  },
  button: {
    backgroundColor: '#A3238F',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 35,
    elevation: 3, // Slight shadow for the button
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20, // Larger font for better readability
    fontWeight: 'bold',
  },
  textInput: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: '#FFF',
    borderColor: '#DDD',
    borderWidth: 1,
    marginBottom: 15, // To add space between inputs
  },
  textInputFocused: {
    borderColor: '#A3238F', // Change border color on focus
    shadowColor: '#A3238F', 
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 30,
  },
  errorMessage: {
    fontSize: 14,
    color: '#D8000C', // Red color for error messages
    marginTop: 5,
    marginLeft: 15,
  },
});
export default SubstituteLogin;