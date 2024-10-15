import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: '#f0f0f0',
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: 10,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
      marginTop: -25,
    },
      infoContainer: {
        marginBottom: 5,
      },
      label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#A3238F',
      },
      ratingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center', 
        marginBottom: 5,
      },
      ratingName: {
        fontSize: 14,
        color: 'black',
      },
      starsContainer: {
        flexDirection: 'row',
      },
    profileContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 40,
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      resizeMode: 'cover',
    },    
    profilePic: {
      width: 90,
      height: 90,
      borderRadius: 50,
      backgroundColor: '#A3238F',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 20,
      marginTop:10,
    },
    profilePicText: {
      color: '#ffffff',
      fontSize: 30,
      fontWeight: 'bold',
    },
    userInfotop: {
      flexDirection: 'column',
      paddingTop: 30,
      marginLeft: 20,
    },
    labeltop1:{
  fontSize: 20,
  marginBottom: 10,
      fontWeight: 'bold',
      color: '#A3238F',
      transform: [{ translateY: -5}],
    },
    valuetop: {
      transform: [{ translateY: -10}],
      bottom: 6,
      marginTop: 10,
      color: 'black',
    },
    value: {
      fontSize: 14,
      color: 'black',
    },
    star: {
      color: 'gold',
      fontSize: 22,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 5,
      marginBottom: 15,
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      borderColor: '#A3238F',
      borderWidth: 1.5,
      borderRadius: 50,
      width: '45%',
      justifyContent: 'center',
      backgroundColor: '#fff',
      paddingVertical: 5,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 }, 
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    buttonIcon: {
      backgroundColor: '#A3238F',
      borderRadius: 70,
      padding: 6,
      marginRight: 10,
    },
    buttonText: {
      color: '#A3238F',
      fontWeight: 'bold',
    },
    performanceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 5,
    },
    performanceLabel: {
      fontSize: 14,
      color: '#000',
    },
    stars: {
      flexDirection: 'row',
    },
    promoteButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#7c1a7c',
      padding: 10,
      borderRadius: 15,
      width: '65%',
      justifyContent: 'center',
      marginTop: 30,
      marginLeft: 10,
      marginBottom: 10,
    },
    promoteButtonText: {
      color: '#fff',
      marginLeft: 5,
      fontWeight: 'bold',
    },
  });

export default styles;