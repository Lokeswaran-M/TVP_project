import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
// import { View, Text } from 'react-native';

// import { View, Text, StyleSheet } from 'react-native';

// >>>>>>> 65a3d8b83bd5f7bd4228c293eb7248010d4a6486
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
const HomeScreen = () => {
  const user = useSelector((state) => state.user);
  const navigation = useNavigation();
  const handleGoBack = () => {
    navigation.goBack();
  };
  if (user.rollId !== 3) {
    navigation.navigate('UnauthorizedScreen');
    return null;

  }


  // return (
  //   <View>
  //     <Text>Welcome, {user?.username} {user?.rollId}!</Text>
  //     <Text>Profession: {user?.profession || 'Not provided'}</Text>

  return (
    <View>
      <Text style={styles.textBold}>ID {user?.userId}</Text>
      <Text style={styles.textLargeBold}>Welcome, {user?.username}!</Text>
      <Text style={styles.textNormal}>Profession: {user?.profession || 'Not provided'}</Text>
    </View>
  );
};

// export default HomeScreen;











// import React from 'react';
// import { View, Text, Alert } from 'react-native';
// import { useSelector } from 'react-redux';
// import { useNavigation } from '@react-navigation/native';

// const HomeScreen = () => {
//   const user = useSelector((state) => state.user);  
//   console.log('user--------',user)
//   console.log('user--name------',user.username)
  
//   const navigation = useNavigation();


//   if(user.rollId !=3 ){
//     // navigation.navigate('Login');

//     return (
//       <View>
//         <Text>Sorry!!! You are not authorized to view this page.</Text>
//         <Text>Click here to go Back</Text>
//       </View>
//     );
//   }  else {   
  
//   return (
//     <View>
//       <Text>Welcome, {user?.username} {user?.rollId}!</Text>
//       <Text>Profession: {user?.profession || 'Not provided'}</Text>
//     </View>
//   );
// }
// };

// export default HomeScreen;

const styles = StyleSheet.create({
  textBold: {
    fontWeight: 'bold',
    fontSize: 16, 
  },
  textLargeBold: {
    fontWeight: 'bold',
    fontSize: 24, 
  },
  textNormal: {
    fontSize: 18,
  },
});
export default HomeScreen;
// export default HomeScreen;