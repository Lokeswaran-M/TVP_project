import { StyleSheet } from 'react-native';


export default StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#e7e7e7',

  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor:'#e7e7e7',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  gridContainer: {
    padding:0,
    backgroundColor:'#e7e7e7',
   
  },
  postContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: 'Black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    position: 'static',
  },
  businessContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'static',
    marginLeft: 10,
  },
  profileImageUser: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginTop: -10,
    zIndex: 1,
  },
  profileImageMeet: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: -10,
    marginLeft: -30,
    zIndex: 2,
  },
  profileName: {
    fontSize: 15,
    paddingRight: 8,
    fontWeight: '500',
    color: '#A3238F',

  },
  profileNameUser: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#A3238F',
  },
  profileNameMeet: {
    marginLeft: 12,
    marginRight: 0,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#A3238F',
  },
  postImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  captionContainer: {
    paddingHorizontal: 10,
    paddingTop: 8,
  },
  caption: {
    fontSize: 14,
  },
  timestamp: {
    fontSize: 13,
    color: '#333',
    paddingHorizontal: 10,
    paddingVertical: 5,
    paddingTop: 5,
    alignItems: 'center',
    fontWeight: 'bold',
  },
  userProfession: {
    marginLeft: 2,
    fontWeight: '400',
    fontSize: 12,
    color: '#b50098',
  },
  meetProfession: {
    marginLeft: 2,
    fontWeight: '400',
    fontSize: 12,
    color: '#b50098',
  },
  filterContainer:{
justifyContent:'center',
backgroundColor:'#e7e7e7',
  },
filterButton:{
backgroundColor:'#FFFFFF',
flexDirection:'row',
justifyContent:'center',
borderRadius:25,
alignItems:'flex-end',
padding:10,
margin:5,
  },
  filterButtonText:{
color:"#A3238F",
fontWeight: '800',
justifyContent:'center',
alignItems:'center',
fontSize: 16,
top:-2,
  },

});




