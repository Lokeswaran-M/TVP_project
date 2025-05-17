import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Auth');
    }, 3000); 

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <FastImage
        style={styles.image}
        source={require('../../../assets/images/tha-pa-va_gif.gif')}
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








// import React, { useEffect } from 'react';
// import { View, StyleSheet } from 'react-native';
// import FastImage from 'react-native-fast-image';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const SplashScreen = ({ navigation }) => {
//   useEffect(() => {
//     const fetchUserInfo = async () => {
//       const { userId, rollId } = await getUserInfo();
//       console.log('User ID in splash screen-----------', userId);
//       console.log('Roll ID in splash screen-----------', rollId);
//       const role = Number(rollId);

//       setTimeout(() => {
//         if (role === 1) {
//           navigation.navigate('AdminPage');
//         } else if (role === 2 || role === 3) {
//           navigation.navigate('DrawerNavigator');
//         } else {
//           navigation.replace('Auth');
//         }
//       }, 3000);
//     };

//     fetchUserInfo();
//   }, [navigation]);

//   const getUserInfo = async () => {
//     try {
//       const userId = await AsyncStorage.getItem('userId');
//       const rollId = await AsyncStorage.getItem('rollId');
//       console.log('Retrieved User ID:', userId);
//       console.log('Retrieved Roll ID:', rollId);
//       return { userId, rollId };
//     } catch (error) {
//       console.error('Error retrieving user info from AsyncStorage:', error);
//       return { userId: null, rollId: null };
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <FastImage
//         style={styles.image}
//         source={require('../../../assets/images/tha-pa-va_gif.gif')}
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
//     backgroundColor: '#fbfcfa',
//   },
//   image: {
//     width: 400,
//     height: 400,
//   },
// });

// export default SplashScreen;