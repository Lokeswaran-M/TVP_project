import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

const HeadAdminLocationEdit = ({ route, navigation }) => {
  const { Location } = route.params;

  // Initialize state for edited place name
  const [editedPlace, setEditedPlace] = useState(Location.Place);
  const handleback = () => {
    navigation.navigate('HeadAdminLocation'); 
  };
  const handleSave = () => {
    // Pass the updated place name back to the previous screen
    navigation.navigate('HeadAdminLocation', {
      editedLocation: Location.Location,
      editedPlace: editedPlace,
    });
   
  };

  return (
    <View style={styles.container}>
 

      {/* Location Details */}
      <View style={styles.locationDetailsContainer}>
        <Text style={styles.locationName}>{Location.Location}</Text>
      </View>

      {/* Edit Place Details */}
      <View style={styles.PlaceDetailsContainer}>
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

// Responsive styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CCC',
  },
 

  locationDetailsContainer: {
    height: height * 0.15, // Adjusting height dynamically
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100, // Adjusted margin for better spacing
  },
  locationName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#A3238F',
  },
  PlaceDetailsContainer: {
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
