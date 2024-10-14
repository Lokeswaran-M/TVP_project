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
      {/* Top Navigation Bar */}
      <View style={styles.topNav}>
      <View style={styles.backButtonContainer}>
          <TouchableOpacity onPress={handleback}>
            <Icon name="arrow-left" size={28} color="#A3238F" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.buttonNavtop}>
          <View style={styles.topNavlogo}>
            <Ionicons name="location-outline" size={28} color="#FFFFFF" />
          </View>
          <Text style={styles.NavbuttonText}>LOCATION</Text>
        </TouchableOpacity>
      </View>

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
  topNav: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomEndRadius: 15,
    borderBottomStartRadius: 15,
    justifyContent: 'center',
  },
  backButtonContainer: {
    padding: 0,
    margin: 0,
    alignItems: 'flex-start',
  },
  navTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonNavtop: {
    borderRadius: 25,
    alignItems: 'center',
    borderColor: '#A3238F',
    borderWidth: 2,
    flexDirection: 'row',
    marginRight: 70,
    marginLeft: 50,
  },
  topNavlogo: {
    backgroundColor: '#A3238F',
    padding: 4,
    paddingRight: 5,
    paddingLeft: 5,
    borderRadius: 50,
    justifyContent: 'center',
  },
  NavbuttonText: {
    color: '#A3238F',
    fontSize: 15,
    fontWeight: 'bold',
    margin: 7,
    paddingHorizontal: 32,
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
