import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
// import { Assets } from 'react-navigation-stack';


const { width, height } = Dimensions.get('window'); 

const AdminPage = () => {
  const navigation = useNavigation();

  const handleNavPress1 = () => {
    navigation.navigate('AdminMemberstack');
  };
  const handleNavPress2 = () => {
    navigation.navigate('AdminLocationstack');
  };

  const handleNavPress3 = () => {
    navigation.navigate('HeadAdminNewSubscribers');
  };
  const handleNavPress4 = () => {
    navigation.navigate('HeadAdminPaymentsPage');
  };

  return (
    <View style={styles.container}>

      <View style={styles.containermain}>
    
        <View style={styles.topContainer1}>
          <Text style={styles.topText}>Requirements</Text>
          <View style={styles.underline} />
          <View style={styles.innerContainer1}>
            <Image
              source={{
                uri: 'https://i.pinimg.com/736x/52/af/bf/52afbfeb6294f24e715a00367be3cdf3.jpg',
              }}
              style={styles.profileImage1}
            />
            <Text style={styles.profileName1}>Lokiliikiijjjijihihuii</Text>
            <Text style={styles.innerText1}>
              Details about Requirements reviews React Native allows developers to build mobile apps.
            </Text>
          </View>
        </View>

        <View style={styles.topContainer2}>
          <Text style={styles.topText}>Reviews</Text>
          <View style={styles.underline} />
          <View style={styles.innerContainer2}>
            <Text style={styles.profileName2}>Logeshwaran</Text>
            <Image
              source={{
                uri: 'https://i.pinimg.com/736x/52/af/bf/52afbfeb6294f24e715a00367be3cdf3.jpg',
              }}
              style={styles.profileImage2}
            />
            <View style={styles.innerTextcon}>
              <View style={styles.ratingContainer}>
                <Icon name="star" size={18} color="gold" />
                <Icon name="star" size={18} color="gold" />
                <Icon name="star" size={18} color="gold" />
                <Icon name="star" size={18} color="gold" />
                <Icon name="star" size={18} color="gold" />
              </View>
              <Text style={styles.innerText3}>
                Reviews React Native allows developers who know React to create native apps.
              </Text>
            </View>
          </View>
        </View>

      
        <View style={styles.buttonContainer}>
          <View style={styles.leftButtons}>
            <TouchableOpacity style={styles.button} onPress={handleNavPress1}>
              <Icon name="users" size={20} color="white" style={styles.icon} />
              <Text style={styles.buttonText}>Members</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleNavPress2}>
              <Feather name="map-pin" size={20} color="white" style={styles.icon} />
              <Text style={styles.buttonText}>Locations</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rightButtons}>
            <TouchableOpacity style={styles.button} onPress={handleNavPress3}>
              <Feather name="users" size={20} color="white" style={styles.icon} />
              <Text style={styles.buttonText}>New Sub</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleNavPress4}>
              <Icon name="money" size={20} color="white" style={styles.icon} />
              <Text style={styles.buttonText}>Payments</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccc',
  },
  containermain: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#ccc',
  },
  iconImage:{

    width: 300, 
    height: 50, 
    resizeMode: 'contain',
  },
  topNav: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomEndRadius: 15,
    borderBottomStartRadius: 15,
    justifyContent: 'center',
  },


  topContainer1: {
    width: '90%',
    height: height * 0.2,
    backgroundColor: '#fff',
    marginBottom: 25,
    borderRadius: 15,
    marginTop: 50,
    padding: 8,
  },
  topContainer2: {
    width: '90%',
    height: height * 0.2, 
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 8,
  },
  topText: {
    color: '#A3238F',
    fontSize: 15,
    fontWeight: 'bold',
  },
  underline: {
    height: 1,
    backgroundColor: 'black',
    width: '100%',
    marginTop: 5,
  },
  innerContainer1: {
    margin: 5,
    backgroundColor: '#f0e1eb',
    borderRadius: 8,
    height: 110,
    justifyContent: 'center',
  },
  innerContainer2: {
    margin: 5,
    backgroundColor: '#f0e1eb',
    borderRadius: 8,
    height: 110,
    flexDirection: 'row',
    paddingRight: 10,
    paddingLeft: 10,
  },
  innerText1: {
    color: '#A3238F',
    fontSize: 15,
    height: 55,
    width: '93.5%',
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 8,
    margin: 20,
    marginLeft: 10,
    transform: [{ translateY: -20 }],
  },
  innerText3: {
    color: 'black',
  },
  innerTextcon: {
    backgroundColor: '#fff',
    height: 77,
    width: '78%',
    borderRadius: 8,
    padding: 5,
    marginLeft: 5,
    alignItems: 'flex-start',
    marginTop: 25,
  },
  profileImage1: {
    height: 35,
    width: 35,
    borderRadius: 50,
    marginRight: 10,
    marginBottom: 6,
    marginLeft: 10,
    marginTop: 36,
  },
  profileImage2: {
    height: 55,
    width: 55,
    borderRadius: 50,
    marginRight: 5,
    alignSelf: 'center',
    marginTop: 15,
  },
  profileName1: {
    position: 'absolute',
    padding: 10,
    color: '#A3238F',
    paddingBottom: 75,
    paddingLeft: 10,
    transform: [{ translateX: 40 }],
    fontSize: 15,
    fontWeight: 'bold',
    alignItems: 'flex-start',
  },
  profileName2: {
    position: 'absolute',
    color: '#A3238F',
    fontSize: 15,
    marginLeft: 10,
    paddingTop: 2,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderRadius: 8,
    width: '90%',
    backgroundColor: '#fff',
    padding: 10,
    marginTop: 30,
  },
  leftButtons: {
    flex: 1,
    justifyContent: 'space-around',
  },
  rightButtons: {
    flex: 1,
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#A3238F',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 3,
    marginVertical: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  icon: {
    marginRight: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
  },
});

export default AdminPage;