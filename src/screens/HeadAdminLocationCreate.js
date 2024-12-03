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
import { API_BASE_URL } from '../constants/Config'; 

const { width, height } = Dimensions.get('window');

const HeadAdminLocationCreate = () => {
  const navigation = useNavigation();
  const [locationName, setLocationName] = useState('');
  const [placeName, setPlaceName] = useState('');


  const handleCancel = () => {
    navigation.navigate('HeadAdminLocation'); 
  };

  const handleSave = async () => {
    if (!locationName || !placeName) {
      Alert.alert('Please fill out all fields');
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

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.Blabel}>Create New Location</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            value={locationName}
            onChangeText={setLocationName}
            placeholder="Enter Location..."
            placeholderTextColor="gray"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Meeting Place</Text>
          <TextInput
            style={styles.input}
            value={placeName}
            onChangeText={setPlaceName}
            placeholder="Enter Meeting Place..."
            placeholderTextColor="gray"
          />
        </View>

        <View style={styles.buttonCon}>
        <TouchableOpacity style={styles.button} onPress={handleCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#CCC',
  },

  content: {
    paddingHorizontal: 20,
    paddingVertical: 25,
    justifyContent: 'center',
    marginTop: height * 0.20,
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

  button: {
    backgroundColor: '#A3238F',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    marginHorizontal: 10,
    width:120,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

});

export default HeadAdminLocationCreate;