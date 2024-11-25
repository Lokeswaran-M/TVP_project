import React, { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from '../src/navigations/AppNavigator';
import Toast from 'react-native-toast-message';
import { toastConfig } from './utils/toastConfig';
import { Provider } from 'react-redux';
import store from './Redux/store';
import PushController from './components/common/PushController';

const App = () => {
  useEffect(() => {
    const requestPermissions = async () => {
      try {
        // Request Notification Permission
        if (Platform.OS === 'android' && Platform.Version >= 33) {
          const notificationGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
            {
              title: 'Notification Permission',
              message:
                'This app needs access to notifications to alert you about important updates.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );

          if (notificationGranted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Notification permission granted');
          } else {
            console.log('Notification permission denied');
          }
        }

        // Request Camera Permission
        const cameraGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs access to your camera for capturing photos.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );

        if (cameraGranted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Camera permission granted');
        } else {
          console.log('Camera permission denied');
        }

        // Request Storage Permission
        const storageGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'This app needs access to your storage to save files.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );

        if (storageGranted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Storage permission granted');
        } else {
          console.log('Storage permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    };

    requestPermissions();
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <PushController />
        <AppNavigator />
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