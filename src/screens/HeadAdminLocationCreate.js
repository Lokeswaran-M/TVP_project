import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '../constants/Config'; // Import your API base URL

// Get screen dimensions
const { width, height } = Dimensions.get('window');

const HeadAdminLocationCreate = () => {
  const navigation = useNavigation();
  const [locationName, setLocationName] = useState('');
  const [placeName, setPlaceName] = useState('');

  // Handle Cancel action
  const handleCancel = () => {
    navigation.navigate('HeadAdminLocation'); // Navigate back to the previous screen
  };

  // Handle Save action
  const handleSave = async () => {
    if (!locationName || !placeName) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/locations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          LocationName: locationName,
          Place: placeName,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Location created successfully!', [
          { text: 'OK', onPress: () => navigation.navigate('HeadAdminLocation') },
        ]);
      } else {
        Alert.alert('Error', result.error || 'Location creation failed');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Scrollable content */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.Blabel}>Create New Location</Text>

        {/* Location Name Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            value={locationName}
            onChangeText={setLocationName}
            placeholder="Enter location..."
            placeholderTextColor="gray"
          />
        </View>

        {/* Place Name Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Place</Text>
          <TextInput
            style={styles.input}
            value={placeName}
            onChangeText={setPlaceName}
            placeholder="Enter place..."
            placeholderTextColor="gray"
          />
        </View>

        {/* Button Row */}
        <View style={styles.buttonCon}>
          <TouchableOpacity style={styles.button1} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button2} onPress={handleCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

// Responsive styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CCC',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 25,
    justifyContent: 'center',
    marginTop: height * 0.20, // Adjust margin dynamically based on screen height
    marginBottom: height * 0.05,
    marginLeft: height * 0.03,
    marginRight: height * 0.03,
    backgroundColor:'#FFFFFF',
    borderRadius:10,

  },
  Blabel: {
    fontSize: 23,
    color: '#A3238F',
    fontWeight: 'bold',
    paddingBottom: 30,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 17,
    marginBottom: 5,
    color: '#A3238F',
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    borderColor: '#A3238F',
    borderWidth: 1.5,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  buttonCon: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  button1: {
    backgroundColor: '#A3238F',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    marginHorizontal: 10,
    width: width * 0.3, // Set the width as a percentage of screen width
  },
  button2: {
    backgroundColor: '#A3238F',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    marginHorizontal: 10,
    width: width * 0.3, // Set the width as a percentage of screen width
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HeadAdminLocationCreate;