import React, { useState,useEffect  } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Animated, TouchableWithoutFeedback, Keyboard, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../components/layout/LoginStyle';
import { useDispatch } from 'react-redux';
import { setUser } from '../Redux/action';
import { API_BASE_URL } from '../constants/Config';
import DeviceInfo from 'react-native-device-info';
import { RadioButton } from 'react-native-paper'; 
const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [logintype, setLogintype] = useState('1');
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [appVersion, setAppVersion] = useState('');
  const [usernamePlaceholderTop] = useState(new Animated.Value(11));
  const [usernameLabelScale] = useState(new Animated.Value(1));
  const [passwordPlaceholderTop] = useState(new Animated.Value(11));
  const [passwordLabelScale] = useState(new Animated.Value(1));
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState(''); 
  useEffect(() => {
    const fetchAppInfo = async () => {
      const version = DeviceInfo.getVersion();
      setAppVersion(version);
    };
    fetchAppInfo();
  }, []);
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
  const dispatch = useDispatch();
  const handleLogin = async () => {
    setUsernameError('');
    setPasswordError('');
    setLoginError('');
    
    let isValid = true;
    if (!username) {
      setUsernameError('Username is required');
      isValid = false;
    }
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    }
    if (!isValid) return;
  
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, logintype }),
      });
      
      const result = await response.json();
  
      if (response.ok) {
        dispatch(setUser(result));
        const { rollId } = result.user;
        if (logintype === '1') {
          if (rollId === 1) {
            navigation.navigate('AdminPage');
          } else if (rollId === 2 || rollId === 3) {
            navigation.navigate('DrawerNavigator');
          } else {
            setLoginError('Invalid role ID');
          }
        } else if (logintype === '2') {
          navigation.navigate('SubstitutePage');
        }
      } else if (response.status === 403) {
        setLoginError('Username is not activated');
      } else {
        setLoginError(result.error || 'Incorrect username or password');
      }
    } catch (error) {
      setLoginError('An error occurred. Please try again.');
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
           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <RadioButton.Group
              onValueChange={newValue => setLogintype(newValue)}
              value={logintype}
            >
                <View style={styles.radioButtonItem}>
                  <RadioButton value="1" />
                  <Text style={styles.radioButtonLabel}>Member Login</Text>
                </View>
                <View style={styles.radioButtonItem}>
                  <RadioButton value="2" />
                  <Text style={styles.radioButtonLabel}>Substitute Login</Text>
              </View>
            </RadioButton.Group>
          </View>
          <View style={styles.inputContainer}>
            <Animated.Text
              style={[
                styles.placeholder,
                {top: usernamePlaceholderTop, transform: [{ scale: usernameLabelScale }] },
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
          <View >
          {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
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
          <View style={styles.errorcontainer}>
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          </View>
          {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null} 
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('ForgetPassword')}>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerText}>
              Don't have an account? <Text style={styles.signUpText}>Sign up.</Text>
            </Text>
          </TouchableOpacity>
        
        </View>
        <View style={styles.appVersion}>
        <Text style={styles.appVersionText}>Version: {appVersion}</Text>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};
export default LoginScreen;