import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

const HeadAdminLocationCreate = () => {
  const navigation = useNavigation();
  const [locationName, setLocationName] = useState('');
  const [placeName, setPlaceName] = useState('');

  const handleCancel = () => {
    navigation.navigate('HeadAdminLocation'); // Navigate back to the previous screen
  };
  
  const handleSave = () => {
    navigation.goBack(); // Navigate back to the previous screen
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
            placeholder="Enter location"
            placeholderTextColor="#D1C7E0"
          />
        </View>

        {/* Place Name Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Place</Text>
          <TextInput
            style={styles.input}
            value={placeName}
            onChangeText={setPlaceName}
            placeholder="Enter place"
            placeholderTextColor="#D1C7E0"
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
    marginTop: height * 0.05, // Adjust margin dynamically based on screen height
    marginBottom: height * 0.05,
    marginLeft: height * 0.03,
    marginRight: height * 0.03,
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