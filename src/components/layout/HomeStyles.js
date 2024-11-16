import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: '#F5F5F5',
      margin: 8,
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 10,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 8,
      elevation: 5,
    },
    image: {
      width: '100%',
      height: 150, 
      borderRadius: 10,
    },
    cards: {
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 15,
      margin: 0,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    dashboardContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    dashboardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
      color: '#a3238f',
    },
    arrowIcon: {
      marginLeft: 10,
    },    
    meetupCard: {
      backgroundColor: '#F3ECF3',
      borderRadius: 10,
      padding: 15,
      marginBottom: 10,
    },
    meetupTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#6C757D',
      marginBottom: 10,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
    },
    downArrowIcon: {
      alignSelf: 'center',
      marginVertical: 10,
    },  
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center', 
      justifyContent: 'space-between',
    },    
    meetupInfo: {
      marginLeft: 5,
      marginRight: 15,
      color: '#6C757D',
      fontSize: 14,
    },
    locationText: {
      marginLeft: 5,
      color: '#6C757D',
      fontSize: 14,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 5,
    },
    confirmButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white',
      padding: 5,
      paddingHorizontal: 10,
      borderRadius: 50,
    },
    declineButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#DC3545',
      padding: 10,
      borderRadius: 5,
    },
    disabledButton: {
      backgroundColor: '#B0B0B0',
      opacity: 0.6,
    },
    buttonText: {
      color: '#a3238f',
      marginLeft: 5,
      fontSize: 14,
    },
    buttonText1: {
      color: 'white',
      marginLeft: 5,
      fontSize: 14,
      fontWeight: '600',
    },
    disabledButton: {
      backgroundColor: '#B0B0B0',
      opacity: 0.6,
    },    
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    headerText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
    },
    requirementCard: {
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 3,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    profileContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    profileImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 10,
    },
    profileName: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    requirementContent: {
      flex: 1,
      justifyContent: 'space-between',
    },
    requirementText: {
      fontSize: 14,
      color: '#666',
      marginBottom: 10,
    },
    line: {
        margin: 15,
        textAlign: 'center',
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      iconStyle: {
        marginRight: 8,
      },
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#a3238f',
      },
      addButton: {
        backgroundColor: '#a3238f',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
      },
      addButtonText: {
        color: '#fff',
        fontWeight: '600',
      },
      card: {
        backgroundColor: '#F6EDF7',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        marginBottom: 20,
      },
      profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      },
      profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
      },
      profileName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#a3238f',
      },
      profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
      },
      requirementSection: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
      },
      requirementText: {
        fontSize: 14,
        color: '#7E3F8F',
        lineHeight: 22,
      },
      acknowledgeButton: {
        position: 'absolute',
        top: -50,
        right: 0,
        backgroundColor: '#a3238f',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 20,
      },
      acknowledgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
      },
    
    pagination: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    activeDot: {
      width: 8,
      height: 8,
      backgroundColor: '#A83893',
      borderRadius: 4,
      marginHorizontal: 4,
    },
    inactiveDot: {
      width: 8,
      height: 8,
      backgroundColor: '#D8D8D8',
      borderRadius: 4,
      marginHorizontal: 4,
    },
  
    noMeetupCard: {
      padding: 20,
      backgroundColor: '#f8f9fa',
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 20,
    },
    noMeetupText: {
      fontSize: 16,
      color: '#6C757D',
    },
  });
  export default styles;