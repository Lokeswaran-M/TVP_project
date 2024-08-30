import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Animated, ScrollView, Picker, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../components/layout/RegisterStyle'; // Make sure to create this style or reuse the LoginStyle if applicable

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [selectedProfession, setSelectedProfession] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [referredBy, setReferredBy] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');


// ANimated 

  const [inputFocus, setInputFocus] = useState({
    username: false,
    password: false,
    confirmPassword: false,
    mobileNo: false,
    email: false,
    address: false,
    businessName: false,
    referredBy: false,
  });

  const [inputAnimatedValues] = useState({
    username: new Animated.Value(11),
    password: new Animated.Value(11),
    confirmPassword: new Animated.Value(11),
    mobileNo: new Animated.Value(11),
    email: new Animated.Value(11),
    address: new Animated.Value(11),
    businessName: new Animated.Value(11),
    referredBy: new Animated.Value(11),
  });

  const [labelScaleValues] = useState({
    username: new Animated.Value(1),
    password: new Animated.Value(1),
    confirmPassword: new Animated.Value(1),
    mobileNo: new Animated.Value(1),
    email: new Animated.Value(1),
    address: new Animated.Value(1),
    businessName: new Animated.Value(1),
    referredBy: new Animated.Value(1),
  });

  const handleFocus = (field) => {
    setInputFocus({ ...inputFocus, [field]: true });
    Animated.parallel([
      Animated.timing(inputAnimatedValues[field], {
        toValue: -15,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(labelScaleValues[field], {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleBlur = (field, value) => {
    if (value.trim() === '') {
      Animated.parallel([
        Animated.timing(inputAnimatedValues[field], {
          toValue: 11,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(labelScaleValues[field], {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
    setInputFocus({ ...inputFocus, [field]: false });
  };

  const handleTouchOutside = () => {
    Keyboard.dismiss();
    Object.keys(inputFocus).forEach((field) => {
      handleBlur(field, eval(field));
    });
  };

  const handleRegister = () => {
    // Handle the register logic here
  };

  return (
    <TouchableWithoutFeedback onPress={handleTouchOutside}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Repeat the below block for each input field */}
          <View style={styles.inputContainer}>
            <Animated.Text
              style={[
                styles.placeholder,
                { top: inputAnimatedValues.username, transform: [{ scale: labelScaleValues.username }] },
              ]}
            >
              Username
            </Animated.Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder=""
              placeholderTextColor="transparent"
              style={styles.input}
              onFocus={() => handleFocus('username')}
              onBlur={() => handleBlur('username', username)}
            />
            <Icon name="user" size={20} color="#888" style={styles.icon} />
          </View>

          <View style={styles.inputContainer}>
            <Animated.Text
              style={[
                styles.placeholder,
                { top: inputAnimatedValues.password, transform: [{ scale: labelScaleValues.password }] },
              ]}
            >
              Password
            </Animated.Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder=""
              placeholderTextColor="transparent"
              secureTextEntry
              style={styles.input}
              onFocus={() => handleFocus('password')}
              onBlur={() => handleBlur('password', password)}
            />
            <Icon name="lock" size={20} color="#888" style={styles.icon} />
          </View>

          <View style={styles.inputContainer}>
            <Animated.Text
              style={[
                styles.placeholder,
                { top: inputAnimatedValues.confirmPassword, transform: [{ scale: labelScaleValues.confirmPassword }] },
              ]}
            >
              Confirm Password
            </Animated.Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder=""
              placeholderTextColor="transparent"
              secureTextEntry
              style={styles.input}
              onFocus={() => handleFocus('confirmPassword')}
              onBlur={() => handleBlur('confirmPassword', confirmPassword)}
            />
            <Icon name="lock" size={20} color="#888" style={styles.icon} />
          </View>

          <View style={styles.inputContainer}>
            <Animated.Text
              style={[
                styles.placeholder,
                { top: inputAnimatedValues.mobileNo, transform: [{ scale: labelScaleValues.mobileNo }] },
              ]}
            >
              Mobile No
            </Animated.Text>
            <TextInput
              value={mobileNo}
              onChangeText={setMobileNo}
              placeholder=""
              placeholderTextColor="transparent"
              style={styles.input}
              onFocus={() => handleFocus('mobileNo')}
              onBlur={() => handleBlur('mobileNo', mobileNo)}
            />
            <Icon name="phone" size={20} color="#888" style={styles.icon} />
          </View>

          {/* Add similar blocks for Email, Address, Business Name, Referred By */}
          
          {/* Profession Picker */}
          <Text style={styles.label}>Select Profession</Text>
          <View style={styles.selectList}>
            <Picker
              selectedValue={selectedProfession}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedProfession(itemValue)}
            >
              {profession.map((profession, index) => (
                <Picker.Item key={index} label={profession.ProfessionName} value={profession.ProfessionName} />
              ))}
            </Picker>
          </View>

          {/* Location Picker */}
          <Text style={styles.label}>Select Location</Text>
          <View style={styles.selectList}>
            <Picker
              selectedValue={selectedLocation}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedLocation(itemValue)}
            >
              {chapterNo.map((chapterNo, index) => (
                <Picker.Item key={index} label={chapterNo.location} value={chapterNo.location} />
              ))}
            </Picker>
          </View>

          {/* Similar for Slot Picker */}

          {/* Date Pickers for Start Date and End Date */}

          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default RegisterScreen;
