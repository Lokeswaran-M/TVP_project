import React, { useState } from 'react';
import { View, TextInput, Text, Button, StyleSheet } from 'react-native';

const UsernameValidation = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [isUsernameValid, setIsUsernameValid] = useState(false);

  // Function to call API to check username availability
  const validateUsername = async () => {
    if (!username.trim()) {
      setUsernameError('Username is required');
      return;
    }

    try {
      const response = await fetch(`http://your-server-address/api/user-count?username=${username}`);
      const data = await response.json();

      if (data.count > 0) {
        setUsernameError('Username already taken');
        setIsUsernameValid(false);
      } else {
        setUsernameError(''); // Clear the error if no issue
        setIsUsernameValid(true);
      }
    } catch (err) {
      setUsernameError('Error validating username');
    }
  };

  // Function to submit username and password to the server when password is entered
  const handlePasswordSubmit = async () => {
    if (!isUsernameValid) {
      setUsernameError('Please enter a valid username');
      return;
    }

    try {
      const response = await fetch('http://your-server-address/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      console.log('Server Response:', data);
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter username"
        value={username}
        onChangeText={setUsername}
        onBlur={validateUsername} // Check the username when the user leaves the field
        placeholderTextColor="#888"
      />
      {usernameError ? <Text style={styles.error}>{usernameError}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Enter password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        onBlur={handlePasswordSubmit} // Submit when the user leaves the password field
        placeholderTextColor="#888"
      />

      <Button title="Submit" onPress={handlePasswordSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 50,
    borderColor: '#888',
    borderBottomWidth: 1,
    marginBottom: 20,
    color: 'black',
    paddingHorizontal: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default UsernameValidation;
