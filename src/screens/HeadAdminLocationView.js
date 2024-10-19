import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const HeadAdminLocationView = ({ route }) => {
  // Access the location data passed through route.params
  const { location } = route.params;
  const navigation = useNavigation();

 
  return (
    <View style={styles.container}>

      {/* Location Details */}
      <View style={styles.locationDetailsContainer}>
        <Text style={styles.locationName}>{location.LocationName}</Text>
      </View>

      {/* Place Label */}

      
      {/* Place Details */}
      <View style={styles.PlaceDetailsContainer}>
      <Text style={styles.PlaceNameHead}>Meetin Place:</Text>
        <Text style={styles.PlaceName}>{location.Place}</Text>
        
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CCC',
  },
  backButtonContainer: {
    padding: 0,
    margin: 0,
    alignItems: 'flex-start',
    backgroundColor: '#fff',
  },
  
  locationDetailsContainer: {
    height: height * 0.25,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.2, 
  },
  locationName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#A3238F',
    textAlign: 'center',
  },

  PlaceDetailsContainer: {
    height: height * 0.12, 
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#f0e1eb',
    borderRadius: 10,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: -39 }],
  },
  PlaceNameHead:{
  color:'black',
  fontSize:15,
  fontWeight:'600',
  marginBottom:10,
  },
  PlaceName: {
    fontSize: 25,
    color: '#A3238F',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HeadAdminLocationView;