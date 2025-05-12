import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: width * 0.8, 
    height: height * 0.25, 
    marginBottom: height * 0.03, 
    marginTop: -height * 0.01, 
  },
  text: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: height * 0.015, 
    width: '80%',
  },
  input: {
    flex: 1,
    height: height * 0.06, 
    paddingHorizontal: width * 0.03, 
    fontSize: width * 0.04, 
    color: 'black',
  },
  eyeIcon: {
    padding: width * 0.025, 
  },
  submitButton: {
    backgroundColor: '#2e3192',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05, 
    borderRadius: 10,
    marginTop: height * 0.03, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: width * 0.045,
  },
  errorText: {
    color: 'red',
    fontSize: width * 0.04, 
  },
});

export default styles;
