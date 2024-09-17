import React from 'react';
// import { View, Text } from 'react-native';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const user = useSelector((state) => state.user);
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };
  
  // If user is not authorized, navigate to the Unauthorized screen
  if (user.rollId !== 3) {
    navigation.navigate('UnauthorizedScreen');
    
   
        // <Text>Sorry!!! You are not authorized to view this page.</Text>
      
         

    
    return null;

  }


  return (
    <View>
      <Text>Welcome, {user?.username} {user?.rollId}!</Text>
      <Text>Profession: {user?.profession || 'Not provided'}</Text>
    </View>
  );
};

export default HomeScreen;



















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
