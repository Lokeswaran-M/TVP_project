import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: width * 0.05, 
    // marginTop: height * 0.25, 
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: width * 0.05, 
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
    textAlign: 'left',
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'black',
    marginBottom: height * 0.03,
    width: '100%',
  },
  input: {
    flex: 1,
    height: height * 0.07, 
    borderBottomWidth: 0,
    paddingHorizontal: width * 0.03, 
    color: 'black',
  },
  icon: {
    marginHorizontal: width * 0.03, 
    color: '#25D366',
  },
  button: {
    backgroundColor: '#a3238f',
    paddingVertical: height * 0.02, 
    paddingHorizontal: width * 0.05, 
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'stretch',
    width: '100%',
    marginTop: height * 0.01,
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.045, 
  },
  image: {
    width: width * 0.8,
    height: height * 0.3, 
    marginBottom: height * 0.02, 
  },
  otpContainer: {
    marginTop: height * 0.01, 
  },
  otpTitle: {
    fontSize: width * 0.04, 
    color: '#333',
    marginBottom: height * 0.015, 
  },
  otpTextInputContainer: {
    marginBottom: height * 0.03, 
  },
  otpTextInput: {
    width: width * 0.12, 
    height: height * 0.07, 
    borderColor: '#888',
    borderWidth: 1,
    borderRadius: 5,
    textAlign: 'center',
    fontSize: width * 0.045, 
  },
  timerText: {
    marginTop: height * 0.01, 
    color: 'red',
  },
  otpExpired: {
    marginTop: height * 0.01, 
    color: 'red',
    fontWeight: 'bold',
  },
  resendButtonText: {
    color: '#a3238f',
    textAlign: 'center',
  },
});

export default styles;
