import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import reset_password from '../../assets/images/reset_password.png';
import { toastConfig } from '../utils/toastConfig';
import { API_BASE_URL } from '../constants/Config';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();
  const { Mobileno } = route.params || {};

  const validatePasswords = () => {
    if (newPassword === '' || confirmPassword === '') {
      setErrorMessage('Please fill in all fields.');
      return false;
    }

    if (newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return false;
    }
    
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return false;
    }

    setErrorMessage('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validatePasswords()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: errorMessage,
        position: 'top',
        config: toastConfig,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/updatePassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Mobileno: Mobileno,
          password: newPassword,
        }),        
      });
  
      const result = await response.json();
      if (response.ok) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Password has been reset successfully.',
          position: 'top',
          config: toastConfig,
        });
        setTimeout(() => {
          navigation.navigate('Login');
        }, 2000);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: result.message || 'Something went wrong.',
          position: 'top',
          config: toastConfig,
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Network error. Please try again later.',
        position: 'top',
        config: toastConfig,
      });
    } finally {
      setLoading(false);
    }
  };  

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Icon name="arrow-left" size={20} color="#333" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Reset Password</Text>
            </View>

            <Image source={reset_password} style={styles.image} resizeMode="contain" />
            
            <View style={styles.formContainer}>
              <Text style={styles.title}>Create New Password</Text>
              <Text style={styles.subtitle}>Your new password must be different from previous passwords</Text>
              
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>New Password</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter new password"
                    secureTextEntry={!isPasswordVisible}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholderTextColor="#A0A0A0"
                  />
                  <TouchableOpacity 
                    style={styles.eyeIcon}
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  >
                    <Icon name={isPasswordVisible ? "eye" : "eye-slash"} size={20} color="#666" />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm your password"
                    secureTextEntry={!isConfirmPasswordVisible}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholderTextColor="#A0A0A0"
                  />
                  <TouchableOpacity 
                    style={styles.eyeIcon}
                    onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                  >
                    <Icon name={isConfirmPasswordVisible ? "eye" : "eye-slash"} size={20} color="#666" />
                  </TouchableOpacity>
                </View>
              </View>

              {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
              
              <View style={styles.passwordRequirements}>
                <Text style={styles.requirementsTitle}>Password Requirements:</Text>
                <View style={styles.requirementItem}>
                  <Icon name="check-circle" size={14} color="#2e3192" />
                  <Text style={styles.requirementText}>At least 8 characters</Text>
                </View>
                <View style={styles.requirementItem}>
                  <Icon name="check-circle" size={14} color="#2e3192" />
                  <Text style={styles.requirementText}>Include numbers and symbols</Text>
                </View>
              </View>

              <TouchableOpacity 
                disabled={loading}
                onPress={handleSubmit}
                style={styles.buttonContainer}
              >
                <LinearGradient
                  colors={['#2e3192', '#3957E8']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.gradient}
                >
                  <Text style={styles.buttonText}>
                    {loading ? 'Setting new password...' : 'Reset Password'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Toast config={toastConfig} />
    </SafeAreaView>
  );
};

const styles = {
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 15,
    color: '#333',
  },
  image: {
    width: '100%',
    height: 180,
    alignSelf: 'center',
    marginVertical: 20,
  },
  formContainer: {
    width: '100%',
    paddingVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 25,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#333',
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 5,
    marginBottom: 10,
  },
  passwordRequirements: {
    marginVertical: 16,
    paddingHorizontal: 5,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  requirementText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 8,
  },
  buttonContainer: {
    marginTop: 20,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#2e3192',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  gradient: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
};

export default ResetPassword;