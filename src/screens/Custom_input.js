
import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CustomInput = ({ placeholder, iconName, value, onChangeText, secureTextEntry }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.inputContainer, isFocused && styles.inputFocused]}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        secureTextEntry={secureTextEntry}
      />
      <Icon name={iconName} size={20} color="#666" style={styles.icon} />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  // inputFocused: {
  //   borderColor: 'red',
  // },
  input: {
    flex: 1,
    paddingVertical: 10,
    color: '#000',
  },
  icon: {
    marginLeft: 10,
  },
});

export default CustomInput;
