import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/FontAwesome';

const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.profileContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/images/DefaultProfile.jpg')} 
            style={styles.profileImage}
          />
          <TouchableOpacity
            style={styles.pencilIcon}
            onPress={() => {
              // Handle the pencil icon press action here (e.g., navigate to profile editing screen)
            }}
          >
            <Icon name="pencil" size={20} color="#a3238f" />
          </TouchableOpacity>
        </View>
        <Text style={styles.nameText}>Your Name</Text>
        <Text style={styles.professionText}>Profession</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#a3238f',
    marginTop: -10,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
    marginTop: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  pencilIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 5,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  professionText: {
    fontSize: 14,
    color: '#ffbe4e',
  },
});

export default CustomDrawerContent;