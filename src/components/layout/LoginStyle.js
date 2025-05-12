import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: width * 0.05, 
    paddingVertical:width * 0.25,
    paddingBottom:1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',

  },
  logo: {
    width: width * 0.85, 
    height: height * 0.35, 
    marginBottom: height * 0.015, 
    marginTop: -height * 0.12, 
  },
  title: {
    fontSize: width * 0.05, 
    fontWeight: 'bold',
    marginBottom: height * 0.035,
    color: '#2e3192',
    textAlign:'center',
  },
  inputContainer: {
    width: '100%',
    height: height * 0.07,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#888',
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: height * 0.02, 
    backgroundColor: 'white',
    position: 'relative',
  },
  input: {
    flex: 1,
    paddingHorizontal: width * 0.04,
    fontSize: width * 0.04, 
    paddingTop: height * 0.02, 
    color: 'black',
  },
  icon: {
    paddingHorizontal: width * 0.025,
  },
  placeholder: {
    position: 'absolute',
    left: width * 0.04, 
    top: height * 0.02, 
    fontSize: width * 0.04, 
    color: '#888',
    backgroundColor: 'white',
    paddingHorizontal: width * 0.015, 
    borderRadius: 30,
  },
  button: {
    width: '100%',
    height: height * 0.07, 
    backgroundColor: '#2e3192',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: height * 0.01, 
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.045, 
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: '#2e3192',
    marginTop: height * 0.02, 
    fontSize: width * 0.035, 
    paddingBottom:20,
  },
  registerLink: {

    position: 'absolute',
    bottom: height * 0.05, 
  },
  registerText: {
    fontSize: width * 0.035, 
    color: '#888',
  },
  signUpText: {
 
    color: '#2e3192',
    fontWeight: 'bold',
  },
  appVersion:{
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: '#fff',
    padding:8,
    },
  appVersionText:{
  color:'#888',
  alignItems:'center',
  justifyContent:'center',
  fontSize:12,
  fontWeight:'600',
  },
  errorText: {
    color: 'red',
    marginBottom:10,
    marginLeft:0,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  radioButtonContainer: {
    marginBottom: 20,
  },
  radioButtonRow: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
  },
  radioButtonItem: {
    flexDirection: 'row', 
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 15, 
  },
  radioButtonLabel: {
    fontSize: 16,
    marginLeft: 8, 
    color:'black',
  },
});

export default styles;
