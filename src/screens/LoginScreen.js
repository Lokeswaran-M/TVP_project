import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Animated,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch } from 'react-redux';
import { setUser } from '../Redux/action';
import { API_BASE_URL } from '../constants/Config';
import DeviceInfo from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';
import { useFocusEffect } from '@react-navigation/native';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [appVersion, setAppVersion] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [Mobileno, setMobileNo] = useState('');
  const [usernamePlaceholderTop] = useState(new Animated.Value(11));
  const [usernameLabelScale] = useState(new Animated.Value(1));
  const [passwordPlaceholderTop] = useState(new Animated.Value(11));
  const [passwordLabelScale] = useState(new Animated.Value(1));
  
  const logintype = '1';
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAppInfo = async () => {
      const version = DeviceInfo.getVersion();
      setAppVersion(version);
    };
    fetchAppInfo();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      console.log('Page Refreshed!');
      setUsername('');
      setPassword('');
      setLoginError('');
      setUsernameError('');
      setPasswordError('');
      return () => {
      };
    }, [])
  );
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
    if (usernameFocused) handleBlurUsername();
    if (passwordFocused) handleBlurPassword();
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

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
    setIsLoading(true);
  
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, logintype }),
      });
      
      const result = await response.json();
      if (!response.ok) {
        if (result.activateOption) {
          setLoginError(result.error);
          setMobileNo(result.mobileNo);
        } else {
          setLoginError(result.error || 'Login failed. Please try again.');
        }
        setIsLoading(false);
        return;
      }
      console.log('Dispatching user data:', result);
      dispatch(setUser(result.user));
      const rollId = result.user.RollId;
      if (rollId === 2 || rollId === 3) {
        try {
          const deviceId = await DeviceInfo.getUniqueId();
          const deviceName = await DeviceInfo.getDeviceName();
          const FCMtoken = await messaging().getToken();
          
          await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username,
              password,
              logintype: '1',
              deviceId,
              deviceName,
              FCMtoken,
            }),
          });
        } catch (deviceError) {
          console.error('Error saving device info:', deviceError);
        }
      }
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleTouchOutside}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        keyboardShouldPersistTaps="handled"
      >
        <StatusBar backgroundColor="#2e3192" barStyle="light-content" />
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <LinearGradient
              colors={['#2e3192', '#3957E8']}
              style={styles.headerGradient}
            >
              <Image 
                source={require('../../assets/images/Login.png')} 
                style={styles.logo} 
                resizeMode="contain"
              />
              <Text style={styles.title}>Hello, Welcome Back!</Text>
              <Text style={styles.subtitle}>Please sign in to continue</Text>
            </LinearGradient>
          </View>
          
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Animated.Text
                style={[
                  styles.placeholder,
                  {
                    top: usernamePlaceholderTop, 
                    transform: [{ scale: usernameLabelScale }],
                    color: usernameFocused ? '#2e3192' : '#888',
                  },
                ]}
              >
                Username
              </Animated.Text>
              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder=""
                placeholderTextColor="transparent"
                style={[
                  styles.input,
                  usernameFocused && styles.inputFocused,
                  usernameError && styles.inputError
                ]}
                onFocus={handleFocusUsername}
                onBlur={handleBlurUsername}
                autoCapitalize="none"
              />
              <Icon 
                name="user" 
                size={20} 
                color={usernameFocused ? '#2e3192' : '#888'} 
                style={styles.icon} 
              />
            </View>
            {usernameError ? 
              <Text style={styles.errorText}>
                <Icon name="exclamation-circle" size={14} color="#FF3B30" /> {usernameError}
              </Text> : null
            }
            
            <View style={[styles.inputContainer, {marginTop: 16}]}>
              <Animated.Text
                style={[
                  styles.placeholder,
                  { 
                    top: passwordPlaceholderTop, 
                    transform: [{ scale: passwordLabelScale }],
                    color: passwordFocused ? '#2e3192' : '#888',
                  },
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
                style={[
                  styles.input,
                  passwordFocused && styles.inputFocused,
                  passwordError && styles.inputError
                ]}
                onFocus={handleFocusPassword}
                onBlur={handleBlurPassword}
              />
              <TouchableOpacity onPress={togglePasswordVisibility} style={styles.icon}>
                <Icon 
                  name={passwordVisible ? "eye" : "eye-slash"} 
                  size={20} 
                  color={passwordFocused ? '#2e3192' : '#888'} 
                />
              </TouchableOpacity>
            </View>
            {passwordError ? 
              <Text style={styles.errorText}>
                <Icon name="exclamation-circle" size={14} color="#FF3B30" /> {passwordError}
              </Text> : null
            }
            
            {loginError ? 
              <View style={styles.errorContainer}>
                <Icon name="exclamation-triangle" size={16} color="#FF3B30" />
                <Text style={styles.loginErrorText}>{loginError}</Text>
              </View> : null
            }
            
            {loginError === 'User already exists but is not activated.' && (
              <TouchableOpacity 
                style={styles.activateButton}
                onPress={() => navigation.navigate('Otpscreen', { Mobileno })}
              >
                <Text style={styles.activateButtonText}>
                  Activate Account
                </Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={styles.forgotPasswordContainer} 
              onPress={() => navigation.navigate('ForgetPassword')}
            >
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              disabled={isLoading}
              style={styles.loginButton} 
              onPress={handleLogin}
            >
              <LinearGradient
                colors={['#2e3192', '#3957E8']}
                style={styles.gradientButton}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.buttonText}>Log In</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
            
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>
            
            <TouchableOpacity 
              style={styles.registerContainer}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.registerText}>
                Don't have an account? <Text style={styles.signUpText}>Sign up</Text>
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.appVersion}>
            <Text style={styles.appVersionText}>Version: {appVersion}</Text>
          </View>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};
const styles = {
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    width: '100%',
    height: 400,
    overflow: 'hidden',
  },
  headerGradient: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  logo: {
    width: 190,
    height: 190,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  formContainer: {
    width: '90%',
    alignSelf: 'center',
    marginTop: -30,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  inputContainer: {
    position: 'relative',
    height: 56,
    marginBottom: 4,
    backgroundColor: '#F5F7FE',
    borderRadius: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#E0E5F2',
  },
  placeholder: {
    position: 'absolute',
    left: 20,
    fontSize: 15,
    color: '#888',
    backgroundColor: 'transparent',
    paddingHorizontal: 4,
    zIndex: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingLeft: 32,
    fontSize: 16,
    color: '#333',
  },
  inputFocused: {
    borderColor: '#2e3192',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  icon: {
    position: 'absolute',
    right: 15,
    top: 17,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 16,
  },
  loginErrorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: 16,
    marginBottom: 20,
  },
  forgotPassword: {
    color: '#2e3192',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#2e3192',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  gradientButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E5F2',
  },
  dividerText: {
    paddingHorizontal: 16,
    color: '#888',
    fontSize: 14,
  },
  activateButton: {
    backgroundColor: '#F5F7FE',
    borderWidth: 1,
    borderColor: '#2e3192',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  activateButtonText: {
    color: '#2e3192',
    fontSize: 14,
    fontWeight: '600',
  },
  registerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  registerText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
  },
  signUpText: {
    color: '#2e3192',
    fontWeight: 'bold',
  },
  appVersion: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  appVersionText: {
    fontSize: 12,
    color: '#888',
  },
};

export default LoginScreen;