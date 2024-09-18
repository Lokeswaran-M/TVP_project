import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { API_BASE_URL } from '../constants/Config';

const AddLocation = ({ navigation }) => {
  const [location, setLocation] = useState('');
  const [place, setPlace] = useState('');

  const handleAddLocation = async () => {
    if (!location || !place) {
      Alert.alert('Error', 'Please fill in both fields');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/locations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          LocationName: location,
          Place: place,
          IsActive: 1,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add location');
      }

      const result = await response.json();
      Alert.alert('Success', result.message);
      navigation.goBack();
    } catch (error) {
      console.error('Error adding location:', error);
      Alert.alert('Error', 'Failed to add location');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter Location Name"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Place"
        value={place}
        onChangeText={setPlace}
      />
      <Button title="Add Location" onPress={handleAddLocation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 50,
    borderColor: '#888',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

export default AddLocation;