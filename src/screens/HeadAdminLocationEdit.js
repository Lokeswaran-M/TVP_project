import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Modal,
} from 'react-native';
import { API_BASE_URL } from '../constants/Config';

const { width, height } = Dimensions.get('window');

const HeadAdminLocationEdit = ({ route, navigation }) => {
  const { LocationID, Place, LocationName } = route.params;
  const [editedPlace, setEditedPlace] = useState(Place);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleSave = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Locations/${LocationID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          LocationName,
          Place: editedPlace,
          IsActive: 1,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setModalMessage('Location updated successfully!');
        setModalVisible(true);
      } else {
        setModalMessage(data.error || 'Failed to update location.');
        setModalVisible(true);
      }
    } catch (error) {
      setModalMessage('An unexpected error occurred.');
      setModalVisible(true);
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    if (modalMessage === 'Location updated successfully!') {
      navigation.navigate('HeadAdminLocation');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.locationDetailsContainer}>
        <Text style={styles.locationName}>{LocationName}</Text>
      </View>

      <View style={styles.placeDetailsContainer}>
        <TextInput
          style={styles.input}
          value={editedPlace}
          onChangeText={setEditedPlace}
          placeholder="Edit Place Name"
          placeholderTextColor="gray"
        />
        <View style={styles.buttonCon}>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal for alerts */}
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
    color: '#2e3192',
  },
  placeDetailsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#F5F7FE',
    borderRadius: 10,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
    transform: [{ translateY: -18 }],
  },
  input: {
    borderWidth: 1,
    borderColor: '#2e3192',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    width: '100%',
    color: '#2e3192',
    fontSize: 17,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#2e3192',
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

export default HeadAdminLocationEdit;