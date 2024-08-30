import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from '../src/navigations/AppNavigator';
import Toast from 'react-native-toast-message';
import { toastConfig } from './utils/toastConfig';

const App = () => {
  return (
    <NavigationContainer>
      <AppNavigator />
      <Toast config={toastConfig} />
    </NavigationContainer>
  );
};

export default App;




// import React, { useState } from 'react';
// import VideoSplashScreen from './components/common/SplashScreen';
// import SplashScreen from 'react-native-splash-screen';

// const App = () => {
//     const [isSplashVisible, setIsSplashVisible] = useState(true);

//     const handleSplashFinish = () => {
//         setIsSplashVisible(false);
//     };

//     return (
//         <>
//             {isSplashVisible ? (
//                 <VideoSplashScreen onFinish={handleSplashFinish} />
//             ) : (
//                 // Your main app content goes here
//                 <SplashScreen />
//             )}
//         </>
//     );
// };

// export default App;