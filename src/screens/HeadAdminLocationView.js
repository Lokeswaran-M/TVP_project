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
      <View style={styles.topNav}>
        {/* Back Button */}
        <View style={styles.backButtonContainer}>
          <TouchableOpacity onPress={handleback}>
            <Icon name="arrow-left" size={28} color="#A3238F" />
          </TouchableOpacity>
        </View>

        {/* Title */}
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
  topNav: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomEndRadius: 15,
    borderBottomStartRadius: 15,
  },
  buttonNavtop: {
    borderRadius: 25,
    alignItems: 'center',
    borderColor: '#A3238F',
    borderWidth: 2,
    flexDirection: 'row',
    marginRight: 70,
    marginLeft: 50,
    paddingHorizontal: 10,
    paddingVertical: 5,
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
    marginHorizontal: 5,
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