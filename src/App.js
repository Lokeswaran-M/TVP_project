import React, { useState,useContext,Fragment, useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from '../src/navigations/AppNavigator';
import Toast from 'react-native-toast-message';
import { toastConfig } from './utils/toastConfig';
import { Provider } from 'react-redux';
import store from './Redux/store';
import PushController from './components/common/PushController';
import PushNotification from 'react-native-push-notification';
const App = () => {
  useEffect(() => {
    const requestNotificationPermission = async () => {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
            {
              title: "Notification Permission",
              message:
                "This app needs access to notifications to alert you about important updates.",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK",
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("Notification permission granted");
          } else {
            console.log("Notification permission denied");
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };

    requestNotificationPermission();
  }, []);
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