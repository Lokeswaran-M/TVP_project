import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';


const { width, height } = Dimensions.get('window');

const HeadAdminLocationView = ({ route }) => {
  const { Location } = route.params;
  const navigation = useNavigation();

  const handleback = () => {
    navigation.navigate('HeadAdminLocation'); 
  };

  return (
    <View style={styles.container}>

      {/* Location Details */}
      <View style={styles.locationDetailsContainer}>
        <Text style={styles.locationName}>{Location.Location}</Text>
      </View>

      {/* Place Label */}
      <Text style={styles.placehead}>Place:</Text>

      {/* Place Details */}
      <View style={styles.PlaceDetailsContainer}>
        <Text style={styles.PlaceName}>{Location.Place}</Text>
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
  placehead: {
    position: 'absolute',
    color: '#A3238F',
    fontSize: 20,
    marginTop: height * 0.45, 
    marginLeft: 50,
    fontWeight: '500',
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
    transform: [{ translateY: -18 }],
  },
  PlaceName: {
    fontSize: 25,
    color: '#A3238F',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HeadAdminLocationView;