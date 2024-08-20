import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Animated, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../components/layout/LoginStyle';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [usernamePlaceholderTop] = useState(new Animated.Value(11));
  const [usernameLabelScale] = useState(new Animated.Value(1));

  const [passwordPlaceholderTop] = useState(new Animated.Value(11));
  const [passwordLabelScale] = useState(new Animated.Value(1));

  const handleFocusUsername = () => {
    setUsernameFocused(true);
    Animated.parallel([
      Animated.timing(usernamePlaceholderTop, {
        toValue: -15,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(usernameLabelScale, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleBlurUsername = () => {
    if (passwordFocused) return;
    if (username.trim() === '') {
      Animated.parallel([
        Animated.timing(usernamePlaceholderTop, {
          toValue: 11,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(usernameLabelScale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
    setUsernameFocused(false);
  };

  const handleFocusPassword = () => {
    setPasswordFocused(true);
    Animated.parallel([
      Animated.timing(passwordPlaceholderTop, {
        toValue: -15,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(passwordLabelScale, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleBlurPassword = () => {
    if (usernameFocused) return;
    if (password.trim() === '') {
      Animated.parallel([
        Animated.timing(passwordPlaceholderTop, {
          toValue: 11,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(passwordLabelScale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
    setPasswordFocused(false);
  };

  const handleTouchOutside = () => {
    Keyboard.dismiss();
    handleBlurUsername();
    handleBlurPassword();
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const handleLogin = () => {

    navigation.navigate('Dashboard');
  };

  return (
    <TouchableWithoutFeedback onPress={handleTouchOutside}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Image 
            source={require('../../assets/images/Login.png')} 
            style={styles.logo} 
          />
          <Text style={styles.title}>Hello, Welcome Back!</Text>
          <View style={styles.inputContainer}>
            <Animated.Text
              style={[
                styles.placeholder,
                { top: usernamePlaceholderTop, transform: [{ scale: usernameLabelScale }] },
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
              onFocus={handleFocusUsername}
              onBlur={handleBlurUsername}
            />
            <Icon name="user" size={20} color="#888" style={styles.icon} />
          </View>

          <View style={styles.inputContainer}>
            <Animated.Text
              style={[
                styles.placeholder,
                { top: passwordPlaceholderTop, transform: [{ scale: passwordLabelScale }] },
              ]}
            >
              Password
            </Animated.Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder=""
              placeholderTextColor="transparent"
              secureTextEntry={!passwordVisible}
              style={styles.input}
              onFocus={handleFocusPassword}
              onBlur={handleBlurPassword}
            />
            <TouchableOpacity onPress={togglePasswordVisibility} style={styles.icon}>
              <Icon name={passwordVisible ? "eye" : "eye-slash"} size={20} color="#888" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('ForgetPassword')}>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.registerLink}>
            <Text style={styles.registerText}>
              Don't have an account? <Text style={styles.signUpText}>Sign up.</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
