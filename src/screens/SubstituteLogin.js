import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Alert, TextInput, RefreshControl } from 'react-native';
import AnimatedTextInput from './AnimatedTextInput';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API_BASE_URL } from '../constants/Config';
import { useSelector } from 'react-redux';
const SubstituteLogin = () => {
  const [S_User, setUsername] = useState('');
  const [S_Password, setPassword] = useState('');
  const [conPassword, setConPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisible1, setPasswordVisible1] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [userDetails, setUserDetails] = useState({ S_User: '', S_Password: '' });
  const [isRefreshing, setIsRefreshing] = useState(false); 
  const usernameInputRef = useRef(null);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (user?.userId) {
      fetchUserDetails(user.userId);
    }
  }, [user?.userId]);

  const fetchUserDetails = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user-details?UserId=${userId}`);
      const data = await response.json();
      if (response.ok) {
        setUserDetails(data);
      } else {
        Alert.alert('Error', data.error || 'Failed to fetch user details.');
      }
    } catch (err) {
      Alert.alert('Error', 'Network error while fetching user details.');
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    setUsername('');
    setPassword('');
    setConPassword('');
    
    if (user?.userId) {
      await fetchUserDetails(user.userId);
    }
    setIsRefreshing(false);
  };  

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const togglePasswordVisibility1 = () => {
    setPasswordVisible1(!passwordVisible1);
  };

  const handleSignup = async () => {
    setUsernameError('');
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
      const response = await fetch(`${API_BASE_URL}/api/Suser-count?S_User=${S_User}`);
      const data = await response.json();
      if (response.ok) {
        if (data.count > 0) {
          setUsernameError('Username already taken');
          setTimeout(() => {
            usernameInputRef.current?.focus();
          }, 100);
          return;
        }
      } else {
        setUsernameError('Error checking username availability');
        return;
      }
    } catch (err) {
      setUsernameError('Network error');
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/updateSubUser`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.userId,
          S_User,
          S_Password,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        Alert.alert('Success', result.message);
      } else {
        Alert.alert('Error', result.message || 'Something went wrong.');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to update the substitute user.');
    }
  };
  const handleChangePassword = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/updateSubUser`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.userId,
          S_User: null,
          S_Password: null,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        setUserDetails({ S_User: '', S_Password: '' });
        Alert.alert('Success', result.message);
      } else {
        Alert.alert('Error', result.message || 'Something went wrong.');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to change the password.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}>
        {userDetails.S_User && userDetails.S_Password ? (
          <View style={styles.content}>
            <Text style={styles.label}>Substitute Username: </Text>
            <View style={styles.inputContainer}>
              <TextInput style={styles.value} value={userDetails.S_User} editable={false} />
              <Icon name="user" size={20} color="#A3238F" style={styles.iconInside} />
            </View>
            <Text style={styles.label}>Substitute Password: </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.value}
                value={userDetails.S_Password}
                editable={false}
                secureTextEntry={true}
              />
              <Icon name="lock" size={20} color="#A3238F" style={styles.iconInside} />
            </View>
            <TouchableOpacity onPress={handleChangePassword}>
              <Text style={styles.forgotPassword}>Change Password?</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.content}>
            <Text style={styles.Blabel}>Create Substitute</Text>
            <View style={styles.inputContainer}>
              <AnimatedTextInput
                placeholder="Substitute Username"
                value={S_User}
                onChangeText={setUsername}
                keyboardType="default"
              />
              <Icon name="user" size={20} color="#A3238F" style={styles.icon} />
            </View>
            {usernameError ? <Text style={styles.errorMessage}>{usernameError}</Text> : null}
            <View style={styles.inputContainer}>
              <AnimatedTextInput
                placeholder="New Password"
                value={S_Password}
                onChangeText={setPassword}
                secureTextEntry={!passwordVisible}
                keyboardType="default"
              />
              <TouchableOpacity onPress={togglePasswordVisibility} style={styles.icon}>
                <Icon name={passwordVisible ? 'eye' : 'eye-slash'} size={20} color="#A3238F" />
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
                <Icon name={passwordVisible1 ? 'eye' : 'eye-slash'} size={20} color="#A3238F" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSignup}>
              <Text style={styles.buttonText}>Generate</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F3F3F3',
    flex: 1,
  },
  content: {
    padding: 40,
    paddingTop: 30,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    alignContent: 'center',
    marginVertical: 100,
    margin: 10,
    marginHorizontal: 30,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
    label: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#A3238F',
      marginBottom: 5,
    },
    value: {
      fontSize: 18,
      color: '#555',
      marginBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#A3238F',
    },    
  Blabel: {
    fontSize: 28, 
    color: '#A3238F',
    fontWeight: 'bold',
    paddingBottom: 40,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
    position: 'relative', 
  },
  icon: {
    position: 'absolute',
    right: 10,
    top: 30,
    color: '#A3238F',
  },
  iconInside: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  button: {
    backgroundColor: '#A3238F',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 35,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  errorMessage: {
    fontSize: 14,
    color: '#D8000C',
    marginTop: -15,
    marginBottom: 5,
    marginLeft: 5,
  },
  forgotPassword: {
    color: '#a3238f',
    marginTop: height * 0.02, 
    fontSize: width * 0.035, 
    paddingBottom:20,
  },
});
export default SubstituteLogin;