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
      <Text style={styles.PlaceNameHead}>Meeting Place:</Text>
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
    color: '#2e3192',
    textAlign: 'center',
  },

  PlaceDetailsContainer: {
    height: height * 0.12, 
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#F5F7FE',
    borderRadius: 10,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: -39 }],
  },
  PlaceNameHead:{
  color:'black',
  fontSize:17,
  fontWeight:'500',
  marginBottom:10,
  },
  PlaceName: {
    fontSize: 25,
    color: '#2e3192',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HeadAdminLocationView;