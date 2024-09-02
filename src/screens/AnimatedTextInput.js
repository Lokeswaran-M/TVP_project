import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Animated, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AnimatedTextInput = ({ placeholder, value, onChangeText, secureTextEntry }) => {
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
    left: 10,
    top: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [20, 0],
    }),
    fontSize: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [18, 14],
    }),
    color: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: ['#aaa', '#000'],
    }),
  };

  return (
    <View style={styles.container}>
      <View style={[styles.inputContainer, isFocused && styles.focusedBorder]}>
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
        />
        {/* <Icon name="account" size={24} color="gray" style={styles.iconStyle} /> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    paddingLeft: 15,
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


























// import React, { useState, useEffect, useRef } from 'react';
// import { View, TextInput, Animated, StyleSheet } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// const AnimatedTextInput = ({ placeholder, value, onChangeText, secureTextEntry }) => {
//   const [isFocused, setIsFocused] = useState(false);
//   const animatedIsFocused = useRef(new Animated.Value(value ? 1 : 0)).current;

//   useEffect(() => {
//     Animated.timing(animatedIsFocused, {
//       toValue: isFocused || value ? 1 : 0,
//       duration: 200,
//       useNativeDriver: false,
//     }).start();
//   }, [isFocused, value]);

//   const labelStyle = {
//     position: 'absolute',
//     left: 15,
//     top: animatedIsFocused.interpolate({
//       inputRange: [0, 1],
//       outputRange: [20, -10],
//     }),
//     fontSize: animatedIsFocused.interpolate({
//       inputRange: [0, 1],
//       outputRange: [18, 14],
//     }),
//     color: animatedIsFocused.interpolate({
//       inputRange: [0, 1],
//       outputRange: ['#aaa', '#ffa500'], // Change placeholder color on focus
//     }),
//     zIndex: 1,
//   };

//   return (
//     <View style={styles.container}>
//       <View style={[styles.inputContainer, isFocused && styles.focusedBorder]}>
//         <Animated.Text style={labelStyle}>
//           {placeholder}
//         </Animated.Text>
//         <TextInput
//           style={styles.textInput}
//           value={value}
//           onChangeText={onChangeText}
//           onFocus={() => setIsFocused(true)}
//           onBlur={() => setIsFocused(false)}
//           secureTextEntry={secureTextEntry}
//           placeholderTextColor="transparent" // Hide default placeholder text
//         />
//         <Icon name="account" size={24} color="gray" style={styles.iconStyle} />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginVertical: 10,
//     // Adjust margin or padding if needed
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     padding: 10,
//     paddingLeft: 15,
//     position: 'relative', // Ensure the label is positioned correctly
//   },
//   focusedBorder: {
//     borderColor: '#ffa500', // Border color when focused
//   },
//   textInput: {
//     flex: 1,
//     fontSize: 18,
//     color: '#000',
//     // paddingHorizontal: 0, // Remove extra padding from TextInput
//   },
//   iconStyle: {
//     marginLeft: 10,
//     // Adjust icon style if needed
//   },
// });

// export default AnimatedTextInput;
