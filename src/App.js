
import React, { useState,useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from '../src/navigations/AppNavigator';
import Toast from 'react-native-toast-message';
import { toastConfig } from './utils/toastConfig';
import { Provider } from 'react-redux';
import store from './Redux/store';


const App = () => {
  return (

    <Provider store={store}>
      <NavigationContainer>
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