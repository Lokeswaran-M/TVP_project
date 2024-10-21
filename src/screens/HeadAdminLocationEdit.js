import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Alert,
} from 'react-native';
import { API_BASE_URL } from '../constants/Config'; 
// Get screen dimensions
const { width, height } = Dimensions.get('window');

const HeadAdminLocationEdit = ({ route, navigation }) => {
  const { LocationID, Place, LocationName } = route.params; // Destructure parameters from route
  console.log('---------------------------headadminedit page', LocationID, Place, LocationName);

  // Initialize state for edited place name
  const [editedPlace, setEditedPlace] = useState(Place);

  const handleSave = async () => {
    try {
      // Send PUT request to update the location
      
      const response = await fetch(`${API_BASE_URL}/Locations/${LocationID}`, { // Replace with your actual API URL
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          LocationName, // Include the existing LocationName from params
          Place: editedPlace, // Send the updated place
          IsActive: 1, 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', data.message); // Show success message
        navigation.navigate('HeadAdminLocation'); // Navigate back to the list
      } else {
        Alert.alert('Error', data.error || 'Failed to update location.'); // Show error message
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred.'); // Handle network errors
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Location Name Display */}
      <View style={styles.locationDetailsContainer}>
        <Text style={styles.locationName}>{LocationName}</Text>
      </View>

      {/* Edit Place Input */}
      <View style={styles.placeDetailsContainer}>
        <TextInput
          style={styles.input}
          value={editedPlace}
          onChangeText={setEditedPlace}
          placeholder="Edit Place Name"
          placeholderTextColor="#A3238F"
        />
        <View style={styles.buttonCon}>
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CCC',
  },
  locationDetailsContainer: {
    height: height * 0.15, 
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  locationName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#A3238F',
  },
  placeDetailsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#f0e1eb',
    borderRadius: 10,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
    transform: [{ translateY: -18 }],
  },
  input: {
    borderWidth: 1,
    borderColor: '#A3238F',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    width: '100%',
    color: '#A3238F',
    fontSize: 17,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#A3238F',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    width: width * 0.3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonCon: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: 40,
    marginTop: 20,
  },
});

export default HeadAdminLocationEdit;