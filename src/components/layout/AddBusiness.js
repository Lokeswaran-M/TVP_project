import { StyleSheet } from 'react-native';
export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
      },
      container1: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      
      pickerContainer: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#fff',
      },
      label: {
        marginVertical: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4b5059',
      },
      picker: {
        height: 50,
        width: '100%',
        color: 'black',
        fontSize: 20,
        paddingHorizontal: 10,
        borderColor : '#ccc'
      },
        selectList: {
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius:10,
          overflow: 'hidden',
          marginVertical: 10,
        },
        datePickerButton: {
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 5,
          padding: 15,
          width: '100%',
          alignItems: 'center',
        },
        datePickerText: {
          fontSize: 16,
          color: '#333',
        },
        errorText: {
          color: 'red',
          marginBottom: 10,
        },
        registerButton: {
          backgroundColor: '#a3238f', 
          padding: 15,
          borderRadius: 5,
          alignItems: 'center',
          marginTop:10,
          marginBottom: 10,
        },
        registerButtonText: {
          color: '#fff',
          fontSize: 16,
          fontWeight: 'bold',
        },
        iconStyle: {
          marginRight: 10,
          marginTop: 30,
          position: 'absolute',
          zIndex: 1,
          marginLeft: 325,
        },
        input: {
          flex: 1,
        },
        errorText: {
          color: 'red',
          marginBottom: 8,
        },
});