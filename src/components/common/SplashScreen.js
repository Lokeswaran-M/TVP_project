// import React, { useEffect } from 'react';
// import { View, StyleSheet } from 'react-native';
// import FastImage from 'react-native-fast-image';

// const SplashScreen = ({ navigation }) => {
//   useEffect(() => {
//     setTimeout(() => {
     
//     }, 3000); 
//   }, [navigation]);

//   return (
//     <View style={styles.container}>
//       <FastImage
//         style={styles.image}
//         source={require('../../../assets/images/TPV_ss.gif')} 
//         resizeMode={FastImage.resizeMode.contain}
//       />
//     </View>
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   image: {
//     width: 250, 
//     height: 250, 
//   },
// });

// export default SplashScreen;


import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Auth'); // Navigate to Auth stack
    }, 3000); // 5000 milliseconds = 5 seconds

    return () => clearTimeout(timer); // Clear the timer on component unmount
  }, [navigation]);

  return (
    <View style={styles.container}>
      <FastImage
        style={styles.image}
        source={require('../../../assets/images/tha-pa-va_gif.gif')} // Replace with your image path
        resizeMode={FastImage.resizeMode.contain}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#fbfcfa',

  },
  image: {
    width: 400,
    height: 400,
  },
});

export default SplashScreen;





