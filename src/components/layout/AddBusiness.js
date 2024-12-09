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
      },
        datePickerButton: {
          borderColor: '#a3238f',
          borderWidth: 1,
          borderRadius: 10,
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
        selectList: {
          borderWidth: 1,
          borderColor: '#a3238f',
          borderRadius:10,
          overflow: 'hidden',
          marginVertical: 10,
          // paddingLeft: 10,
        },
        textInput: {
          height: 50,
          borderColor: '#888',
          borderWidth: 0.4,
          paddingHorizontal: 10,
          color: '#888',
          fontSize: 18,
          // paddingLeft: 10,
        },
        dropdown: {
          height: 55,
          borderWidth: 2,
          borderColor: '#a3238f',
          borderRadius: 10,
          paddingHorizontal: 20,
          overflow: 'hidden',
          marginVertical: 10,
          
        },
        readOnlyText: {
          height: 50,
          lineHeight: 50,
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 5,
          paddingHorizontal: 10,
          color: '#666',
          backgroundColor: '#f5f5f5',
        },
        placeholderStyle: {
          color: '#888',
          fontSize: 18,
          // paddingLeft: 10,
        },
        selectedTextStyle: {
          color: '#000',
          fontSize: 18,
        },
        inputSearchStyle: {
          // borderWidth: 1,
          borderColor: '#a3238f',
          borderRadius: 8, 
          // paddingHorizontal: -10,
          height: 40, 
          color: '#000',
        },
        item: {
          height: 50,
          justifyContent: 'center',
          paddingLeft: 20,
        },
        itemText: {
          fontSize: 15,
          color: '#000',
        },          
});