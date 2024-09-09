import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Animated, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RadioButton } from 'react-native-paper';  // Import RadioButton component from react-native-paper
import styles from '../components/layout/LoginStyle';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [selectedLoginType, setSelectedLoginType] = useState('member'); // State for radio button selection

  const [usernamePlaceholderTop] = useState(new Animated.Value(11));
  const [usernameLabelScale] = useState(new Animated.Value(1));

  const [passwordPlaceholderTop] = useState(new Animated.Value(11));
  const [passwordLabelScale] = useState(new Animated.Value(1));

  //  Validation error messages
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState(''); 

  // Handle focus and blur for animations (same as before)
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

  const handleLogin = async () => {
    // Reset error messages
    setUsernameError('');
    setPasswordError('');
    setLoginError(''); 

    let isValid = true; // Flag to track validation status

    if (!username) {
      setUsernameError('Username is required');
      isValid = false;
    }
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    }
    if (!isValid) return; // If not valid, do not proceed with the API call

    try {
      const response = await fetch('http://192.168.29.10:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        console.log('Login successful:', result);

        // Navigate based on the selected login type
        if (selectedLoginType === 'member') {
          navigation.navigate('DrawerNavigator');
        } else if (selectedLoginType === 'substitute') {
          navigation.navigate('SubstitutePage');
        }

      } else {
        setLoginError(result.error || 'Incorrect username or password'); // Show login error
      }
    } catch (error) {
      setLoginError('An error occurred. Please try again.'); // Show error message
      console.error(error);
    }
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

          {/* Radio Buttons for Login Type */}
          <View style={styles.radioButtonContainer}>
            <RadioButton.Group
              onValueChange={newValue => setSelectedLoginType(newValue)}
              value={selectedLoginType}
            >
              <View style={styles.radioButtonItem}>
                <RadioButton value="member" />
                <Text style={styles.radioButtonLabel}>Member Login</Text>
              </View>
              <View style={styles.radioButtonItem}>
                <RadioButton value="substitute" />
                <Text style={styles.radioButtonLabel}>Substitute Login</Text>
              </View>
            </RadioButton.Group>
          </View>

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

          {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}

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

          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null} 

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







const handleLogin = async () => {
  // Reset error messages
  setUsernameError('');
  setPasswordError('');
  setLoginError('');

  let isValid = true; // Flag to track validation status

  if (!username) {
    setUsernameError('Username is required');
    isValid = false;
  }
  if (!password) {
    setPasswordError('Password is required');
    isValid = false;
  }

  if (!isValid) return; // If not valid, do not proceed with the API call

  try {
    const response = await fetch('http://192.168.29.10:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();

    if (response.ok) {
      console.log('Login successful:', result);

      dispatch(setUser(result));
      
      const { rollId } = result; // Get the rollId from the result

      // Navigate based on the rollId
      if (rollId === 1) {
        navigation.navigate('AdminPage');
      } else if (rollId === 2) {
        navigation.navigate('ChapterAdministratorPage');
      } else if (rollId === 3) {
        navigation.navigate('MemberPage');
      } else {
        // Handle other roles if needed
        setLoginError('Invalid role ID');
      }

    } else {
      setLoginError(result.error || 'Incorrect username or password');
    }
  } catch (error) {
    setLoginError('An error occurred. Please try again.');
    console.error(error);
  }
};











