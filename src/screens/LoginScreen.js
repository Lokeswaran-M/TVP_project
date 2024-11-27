import React, { useState,useEffect  } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Animated, TouchableWithoutFeedback, Keyboard, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../components/layout/LoginStyle';
import { useDispatch } from 'react-redux';
import { setUser } from '../Redux/action';
import { API_BASE_URL } from '../constants/Config';
import DeviceInfo from 'react-native-device-info';
import { RadioButton } from 'react-native-paper'; 
import messaging from '@react-native-firebase/messaging';
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
  const [mobileNo, setMobileNo] = useState('');
  console.log("UserName----------------------",username);
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
    // Reset error states
    setUsernameError('');
    setPasswordError('');
    setLoginError('');
  
    // Input validation
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
      // Send login request
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, logintype }),
      });
      const result = await response.json();
      console.log('Data from login response:', result);
      if (!response.ok) {
        if (result.activateOption) {
          setLoginError(result.error);
          setMobileNo(result.mobileNo); 
        }
         else {
          setLoginError(result.error || 'Login failed. Please try again.');
        }
        return;
      }
      setMobileNo(result.mobileNo);
      dispatch(setUser(result));
      const { rollId } = result.user;
      if (logintype === '2') {
        navigation.navigate('SubstitutePage');
        return;
      }

      if (rollId === 2 || rollId === 3) {
        try {
          const deviceId = await DeviceInfo.getUniqueId();
          console.log('Device ID:', deviceId);
  
          const deviceName = await DeviceInfo.getDeviceName();
          console.log('Device Name:', deviceName);
  
          const FCMtoken = await messaging().getToken();
          console.log('FCM Token:', FCMtoken);
  
          const deviceResponse = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username,
              password,
              logintype,
              deviceId,
              deviceName,
              FCMtoken,
            }),
          });
  
          const deviceResult = await deviceResponse.json();
          if (deviceResponse.ok) {
            console.log('Device info saved successfully.');
          } else {
            console.error('Failed to save device info:', deviceResult.error);
          }
        } catch (deviceError) {
          console.error('Error saving device info:', deviceError);
        }
      }
  
      // Navigate based on role and logintype
      if (logintype === '1') {
        if (rollId === 1) {
          navigation.navigate('AdminPage');
        } else if (rollId === 2 || rollId === 3) {
          navigation.navigate('DrawerNavigator');
        } else {
          setLoginError('Invalid role ID');
        }
      }
    } catch (error) {
      setLoginError('An error occurred. Please try again.');
      console.error('Login error:', error);
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
                  <RadioButton value='1' />
                  <Text style={styles.radioButtonLabel}>Member Login</Text>
                </View>
                <View style={styles.radioButtonItem}>
                  <RadioButton value='2' />
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
          {/* {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null} 
          <TouchableOpacity onPress={() => navigation.navigate('Otpscreen')}>
            <Text style={styles.registerText}>
            Do you want to activate the user? <Text style={styles.signUpText}>Activate.</Text>
            </Text>
          </TouchableOpacity> */}
         {loginError && <Text style={styles.errorText}>{loginError}</Text>}
{loginError === 'User is not activated.' && (
  <Text style={styles.registerText}>
    Do you want to activate the user?{' '}
    <Text style={styles.signUpText} onPress={() => navigation.navigate('ActivateScreen', { mobileNo })}>
      Activate.
    </Text>
  </Text>
)}
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







 // const handleLogin = async () => {
  //   setUsernameError('');
  //   setPasswordError('');
  //   setLoginError('');
  //   let isValid = true;
  //   if (!username) {
  //     setUsernameError('Username is required');
  //     isValid = false;
  //   }
  //   if (!password) {
  //     setPasswordError('Password is required');
  //     isValid = false;
  //   }
  //   if (!isValid) return;
  //   try {
  //     const response = await fetch(`${API_BASE_URL}/login`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ username, password, logintype }),
  //     });
    
  //     const result = await response.json();
  //     console.log("Data from login response:", result);
  //     setMobileNo(result.mobileNo);
  //     console.log("MobileNo Data from login response:", mobileNo);
    
  //     if (!response.ok) {
  //       if (result.activateOption) {
  //         setLoginError(result.error);
  //       } else {
  //         setLoginError('Login failed. Please try again.');
  //       }
  //       return; 
  //     }
  //     setMobileNo(result.mobileNo); 
  //     dispatch(setUser(result));
  //     const { rollId } = result.user;
    
  //     if (logintype === '2') {
  //       navigation.navigate('SubstitutePage');
  //       return;
  //     }
    
  //     if (rollId === 2 || rollId === 3) {
  //       const deviceId = await DeviceInfo.getUniqueId();
  //       console.log('Device ID:', deviceId);
    
  //       const deviceName = await DeviceInfo.getDeviceName();
  //       console.log('Device Name:', deviceName);
    
  //       const FCMtoken = await messaging().getToken();
  //       console.log('FCM Token:', FCMtoken);
    
  //       const deviceResponse = await fetch(`${API_BASE_URL}/login`, { 
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           username,
  //           password,
  //           logintype,
  //           deviceId,
  //           deviceName,
  //           FCMtoken,
  //         }),
  //       });
    
  //       const deviceResult = await deviceResponse.json();
  //       console.log('Device Result:', deviceResult); 
    
  //       if (deviceResponse.ok) {
  //         console.log('Device info saved successfully.');
  //       } else {
  //         console.error('Failed to save device info:', deviceResult.error);
  //       }
    
  //       navigation.navigate('DrawerNavigator');
  //     } else if (logintype === '1') {
  //       if (rollId === 1) {
  //         navigation.navigate('AdminPage');
  //       } else if (rollId === 2 || rollId === 3) {
  //         navigation.navigate('DrawerNavigator');
  //       } else {
  //         setLoginError('Invalid role ID');
  //       }
  //     }
  //   } catch (error) {
  //     setLoginError('An error occurred. Please try again.');
  //     console.error(error);
  //   } 





  //   try {
  //     const response = await fetch(`${API_BASE_URL}/login`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ username, password, logintype }),
  //     });
  //     const result = await response.json();
  //     console.log("Data from login response:", result);
  //     dispatch(setUser(result));
  //     const { rollId } = result.user;
  //     if (logintype === '2') {
  //       navigation.navigate('SubstitutePage');
  //       return;
  //     }
  //     if (rollId === 2 || rollId === 3) {
  //       const deviceId = await DeviceInfo.getUniqueId();
  //       console.log('Device ID:', deviceId);
  //       const deviceName = await DeviceInfo.getDeviceName();
  //       console.log('Device Name:', deviceName);
  //       const FCMtoken = await messaging().getToken();
  // console.log('FCM Token:=============================', FCMtoken);
  //       const deviceResponse = await fetch(`${API_BASE_URL}/login`, { 
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           username,
  //           password,
  //           logintype,
  //           deviceId,
  //           deviceName,
  //           FCMtoken,
  //         }),
  //       });
  
  //       const deviceResult = await deviceResponse.json();
  //       console.log('Device Result:', deviceResult); 
  //       if (deviceResponse.ok) {
  //         console.log('Device info saved successfully.');
  //       } else {
  //         console.error('Failed to save device info:', deviceResult.error);
  //       }
  //       navigation.navigate('DrawerNavigator');
  //     } else if (logintype === '1') {
  //       if (rollId === 1) {
  //         navigation.navigate('AdminPage');
  //       } else if (rollId === 2) {
  //         navigation.navigate('DrawerNavigator');
  //       } else if (rollId === 3) {
  //         navigation.navigate('DrawerNavigator');
  //       } else {
  //         setLoginError('Invalid role ID');
  //       }
  //     }
  
  //   } catch (error) {
  //     setLoginError('An error occurred. Please try again.');
  //     console.error(error);
  //   }