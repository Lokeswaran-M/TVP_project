

import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Animated, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AnimatedTextInput = ({ placeholder, value, onChangeText, secureTextEntry,keyboardType }) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedIsFocused = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedIsFocused, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelStyle = {
    position: 'absolute',
    left: 15,
    top: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [20, -10],
    }),
    fontSize: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [18, 14],
    }),
    color: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: ['#aaa', '#ffa500'],
    }),
    backgroundColor: 'white',
    paddingHorizontal: 5, 
    borderRadius: 20,
    zIndex: 1,
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => setIsFocused(true)}
        style={[styles.inputContainer, isFocused && styles.focusedBorder]}
      >
        <Animated.Text style={labelStyle}>
          {placeholder}
        </Animated.Text>
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType} 
          placeholderTextColor="transparent"
        />
        {/* <Icon name="account" size={24} color="gray" style={styles.iconStyle} /> */}
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    paddingLeft: 15,
    position: 'relative',
  },
  focusedBorder: {
    borderColor: '#ffa500', 
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    color: '#000',
  },
  iconStyle: {
    marginLeft: 10,
  },
});

export default AnimatedTextInput;