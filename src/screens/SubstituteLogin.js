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
    Alert.alert('Success', 'You have signed up successfully.');
  
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
    backgroundColor: '#CCC',
    flex: 1,
  },
  content: {
    padding: 40,
    paddingTop: 25,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginTop: 150,
    marginBottom: 80,
    marginHorizontal: 30,
    borderRadius: 20,
  },
  Blabel: {
    fontSize: 25,
    color: '#A3238F',
    fontWeight: 'bold',
    paddingBottom: 30,
  },
  inputContainer: {
    marginBottom: 15,
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    right: 10,
    top: 30,
    color: '#A3238F',
  },
  button: {
    backgroundColor: '#A3238F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 33,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
export default SubstituteLogin;