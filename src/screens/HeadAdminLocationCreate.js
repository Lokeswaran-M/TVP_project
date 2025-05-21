import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '../constants/Config';

const { width, height } = Dimensions.get('window');

const HeadAdminLocationCreate = () => {
  const navigation = useNavigation();
  const [locationName, setLocationName] = useState('');
  const [placeName, setPlaceName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleCancel = () => {
    navigation.navigate('HeadAdminLocation');
  };

  const handleSave = async () => {
    if (!locationName || !placeName) {
      setModalMessage('Please fill out all fields');
      setModalVisible(true);
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
        setModalMessage('Location created successfully!');
        setModalVisible(true);
      } else {
        setModalMessage(result.error || 'Location creation failed');
        setModalVisible(true);
      }
    } catch (error) {
      setModalMessage('An error occurred. Please try again.');
      setModalVisible(true);
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    if (modalMessage === 'Location created successfully!') {
      navigation.navigate('HeadAdminLocation');
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

     
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleModalClose}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    color: '#2e3192',
    fontWeight: 'bold',
    paddingBottom: 30,
  },

  inputContainer: {
    marginBottom: 15,
  },

  label: {
    fontSize: 17,
    marginBottom: 5,
    color: '#2e3192',
    fontWeight: 'bold',
  },

  input: {
    height: 40,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    borderColor: '#2e3192',
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
    backgroundColor: '#2e3192',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: width * 0.8,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#2e3192',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

});

export default HeadAdminLocationCreate;