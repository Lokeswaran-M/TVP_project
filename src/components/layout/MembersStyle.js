import { StyleSheet,Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window'); 
const styles = StyleSheet.create({

  container: {
    backgroundColor: '#DDDDDD',
    flex: 1,
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 0,
    backgroundColor: '#FFFFFF',
    position: 'relative',
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 10,
    marginTop: 30,
    alignItems: 'center',
   
  },
  searchInput: {
    flex: 1,
    borderRadius: 25,
    paddingHorizontal: 50,
    fontSize: 16,
  },
  searchIconContainer: {
    position: 'absolute',
    left: 15,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  memberList: {
    flexGrow: 1,
    paddingHorizontal: 10,
    margin: 20,
    paddingBottom: 20,
  },
  memberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginVertical: 5,
    elevation: 2,
  },
  memberDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  crownContainer: {
    position: 'absolute',
    top: -10,
    right: '80%',
    transform: [
      { translateX: -15 },
      { rotate: '-35deg' },
    ],
    zIndex: 1,
  },  
  profileImageWithBorder: {
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  memberText: {
    marginLeft: 10,
  },
  profilePicContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  profilePicText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  profilePicImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#A3238F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileLetter: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },

  
  alarmContainer: {
    margin: 11,
  },
  filterButton: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 50,
    marginRight: 8,
  },
  filterContainer: {
    backgroundColor: '#f0e1eb',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 15,
    elevation: 5,
    marginTop: 0,
    marginBottom: 10,
  },
  filterSearchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  filterSearchInput: {
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingLeft: 30,
    fontSize: 15,
    flex: 1,
  },
  picker: {
    color: "black",
    
  },
  filterSearchIconContainer: {
    position: 'absolute',
  },
  filterIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  sunIcon: {
    backgroundColor: '#FDB813',
    padding: 5,
    borderRadius: 50,
  },
  moonIcon: {
    backgroundColor: '#07435E',
    padding: 5,
    paddingLeft: 6.5,
    paddingRight: 6.5,
    borderRadius: 50,

  },
  filterOption: {
    width: 100,
    borderRadius: 5,
    marginVertical: 4,
    borderWidth: 2,
    borderColor: '#A3238F',
  },

  filterOptionText: {
    fontSize: 16,
    color: '#A3238F',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  activeButton: {
    backgroundColor: '#A3238F',
    width: 100,
    borderRadius: 5,
    marginVertical: 4,
  },
  activeButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',

  },
  Bottoncon: {
    alignItems: 'flex-end',
  },
  clearButton: {
    backgroundColor: '#A3238F',
    borderRadius: 20,
    padding: 9,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 10,
  },

  memberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginVertical: 5,
    elevation: 2,
  },
  memberDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
    color: 'black',
  },
  memberRole: {
    fontSize: 14,
    color: 'gray',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconWrapper: {
    width: 40, // Adjust the width as needed
    height: 40, // Adjust the height as needed
    borderRadius: 25, // This makes it round
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10, // Space between icons
    elevation: 5, // Add shadow for elevation on Android
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  alarmContainer: {
    margin: 11,
  },
  memberCountContainer: {
    position: 'absolute',
    bottom: 40,
    left: width * 0.75,
    backgroundColor: 'rgba(250, 250, 250, 0.8)',
    padding: 10,
    borderRadius: 20,
    borderColor: '#A3238F',
    borderWidth: 2,
  },
  memberCountText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#A3238F',
  },
    noResultsTextcon:{
      justifyContent:'center',
      alignItems:'center',
   },
    noResultsText:{
      fontSize: 16,
      fontWeight:'bold',
       color:'black',
       justifyContent:'center',
       alignItems:'center',

    },
    buttoncon:{
  
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#A3238F',
      justifyContent:'center',
      borderRadius: 10,
      paddingVertical:10,
      marginHorizontal:90,
    },
    icon: {
      marginRight: 10,
    },
    buttonText: {
      color: '#FFF',
      fontSize: 20,
      fontWeight: 'bold',
    },
    noteText: {
      marginTop: 10,
      color: '#A3238F',
      fontSize: 14,
      fontStyle: 'italic',
    },
});

export default styles;