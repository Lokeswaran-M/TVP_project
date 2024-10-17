
// // PaymentWebView.js




import React from 'react';
import { WebView } from 'react-native-webview';

const PaymentWebView = ({ route }) => {
  const { paymentUrl } = route.params;
  console.log('paymentUrl=========from payment weburl==========',paymentUrl)

  return (
    <WebView
      source={{ uri: paymentUrl }}
      style={{ flex: 1 }}
    />
  );
};

export default PaymentWebView;















// import React from 'react';
// import { WebView } from 'react-native-webview';
// import {Alert} from 'react-native';
// import { useNavigation } from '@react-navigation/native';


// const PaymentWebView = ({ route }) => {
//   const navigation = useNavigation();

//   const { paymentUrl } = route.params;

  
//   const onMessage = (m) =>
//   {
//  navigation.navigate('Paymentcustomer')
//   }
  
// return <WebView source={{ uri: paymentUrl }}
// onMessage={(m) => onMessage(m)}  />;

// };

// export default PaymentWebView;
