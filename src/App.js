import React, { useState,useContext,Fragment } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, FlatList} from 'react-native';
import {Header, LearnMoreLinks, Colors, DebugInstructions, ReloadInstructions } from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from '../src/navigations/AppNavigator';
import Toast from 'react-native-toast-message';
import { toastConfig } from './utils/toastConfig';
import { Provider } from 'react-redux';
import store from './Redux/store';
import PushController from './components/common/PushController';
import PushNotification from 'react-native-push-notification';

const App = () => {
  return (

    <Provider store={store}>
      <NavigationContainer>
      <PushController/>
        <AppNavigator />
        {/* <Toast config={toastConfig} /> */}
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </NavigationContainer>
    </Provider>

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