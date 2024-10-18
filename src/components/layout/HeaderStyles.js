import React, { useState, useEffect } from 'react';
import { View, Text,StyleSheet, Dimensions, } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const { width, height } = Dimensions.get('window'); // Get screen dimensions

const headerStyle = () => {

    <View >
     <Text style={styles.NavbuttonText}>Payments</Text>
    <View style={styles.buttonNavtop}>
      <View style={styles.topNavlogo}>
        <MaterialIcons name="group" size={28} color="#FFFFFF" />
        <Text style={styles.NavbuttonText}>Payments</Text>
      </View>
      <Text style={styles.NavbuttonText}>Payments</Text>
    </View>
  </View>
};


// Styles with responsiveness
const styles = StyleSheet.create({

  topNav: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomEndRadius: 15,
    borderBottomStartRadius: 15,
    justifyContent: 'center',
  },
  buttonNavtop: {
    borderRadius: 25,
    alignItems: 'center',
    borderColor: '#A3238F',
    borderWidth: 2,
    flexDirection: 'row',
  },
  topNavlogo: {
    backgroundColor: '#A3238F',
    padding: 4,
    borderRadius: 50,
    justifyContent: 'center',
  },
  NavbuttonText: {
    color: 'red',
    fontSize: width * 0.04, 
    fontWeight: 'bold',
    marginHorizontal: 10,
  },


});

export default headerStyle;