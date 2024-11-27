import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// import AuthContext from './Authcontext'; // Ensure your AuthContext is imported
import { WebView } from 'react-native-webview'; // Import WebView to handle payments
import { useSelector } from 'react-redux';

const Payment = () => {
  const [isOffMonth, setIsOffMonth] = useState(false);
  const navigation = useNavigation();
  // const { userID } = useContext(AuthContext); // Assume you're using user context
  const userId = useSelector((state) => state.user?.userId);
  console.log("User ID for home subscription------------------------------",userId);
  const handlePayment = () => {
    try {
      const paymentAmount = isOffMonth ? 1500 : 3000;
      const paymentUrl = `https://www.smartzensolutions.com/Payments/dataFrom.php?amount=${paymentAmount}&userid=${userId}`;
      
      // Log the URL for debugging purposes
      console.log('Payment URL:', paymentUrl);

      // Navigate to a WebView for payment processing
      navigation.navigate('PaymentWebview', { paymentUrl });
    } catch (error) {
      console.error('Error during payment initiation:', error);
      Alert.alert('Payment Error', 'An error occurred during the payment initiation. Please try again.');
    }
  };
  const handleContinue = () => {
    // Navigate to the Pay component
    navigation.navigate('Pay');
  };  

  return ( 
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Business Meeting Entry Payment</Text>
      <View style={styles.topcon}>
        <Text style={styles.headertocon}>Business Meeting Entry Fees</Text>
        <Text style={styles.toppaymentText}>₹3000</Text>
        <Text style={styles.MonthText}>₹4500</Text>
        <Text style={styles.upeventtext}>MAKE A PAYMENT FOR UPCOMING EVENTS</Text>
      </View>

      <View style={styles.toggleContainer}>
        <Text style={styles.botpaymentText}>₹1500</Text>
        <Text style={styles.offbotpaymentText}>₹2000</Text>
        <Text style={styles.toggleLabel}>Amount To Pay</Text>

        <TouchableOpacity style={styles.button} onPress={handlePayment}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottumcon}>
        <Text style={styles.termsHeader}>Terms and Conditions</Text>
        <Text style={styles.termsText}>
          By proceeding, you agree to our terms and conditions...
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    backgroundColor: '#ccc',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 40,
    textAlign: 'center',
    color: '#A3238F',
  },
  topcon: {
    backgroundColor: '#ffffff',
    padding: 40,
    marginBottom: 0,
    borderTopStartRadius: 15,
    borderTopEndRadius: 15,
  },
  headertocon: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    color: '#A3238F',
  },
  toppaymentText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#A3238F',
    textAlign: 'center',
    paddingBottom: 0,
  },
  MonthText: {
    fontSize: 16,
    color: '#A3238F',
    marginBottom: 30,
    textDecorationLine: 'line-through',
    marginTop: 0,
    paddingTop: 0,
    paddingLeft: 125,
    transform: [{ translateY: -5 }],
  },
  upeventtext: {
    fontSize: 12,
    marginBottom: -8,
    color: '#A3238F',
    backgroundColor: '#ffffff',
    textAlign: 'center',
    fontWeight: '400',
  },
  toggleContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#f9f3fb',
    padding: 20,
    paddingLeft: 10,
    paddingBottom: 20,
    paddingRight: 15,
    paddingTop: 20,
    borderRadius: 15,
    transform: [{ translateY: -13 }],
  },
  botpaymentText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#A3238F',
    paddingLeft: 10,
  },
  offbotpaymentText: {
    position: 'absolute',
    fontSize: 15,
    color: '#A3238F',
    transform: [{ translateX: 83 }],
    marginTop: 23,
    textDecorationLine: 'line-through',
  },
  toggleLabel: {
    fontSize: 16,
    color: '#A3238F',
    fontWeight: '500',
    paddingLeft: 10,
    transform: [{ translateY: 0 }],
  },
  button: {
    position: 'absolute',
    backgroundColor: '#A3238F',
    padding: 8,
    borderRadius: 15,
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginLeft: 195,
    transform: [{ translateY: 25 }],
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  bottumcon: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 15,
    paddingLeft: 20,
  },
  termsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#A3238F',
    textDecorationLine: 'underline',
  },
  termsText: {
    marginTop: 10,
    fontSize: 14,
    color: '#A3238F',
  },
});

export default Payment;








// import React, { useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

// const Payment = () => {
//   const [isOffMonth, setIsOffMonth] = useState(false);

//   const handleContinue = () => {
//     alert(`Proceeding with payment of ₹${isOffMonth ? 1500 : 3000}`);
//   };  

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.header}>Business Meeting Entry Payment</Text>
//       <View style={styles.topcon}>
//       <Text style={styles.headertocon}>Business Meeting Entry Fees</Text>
//         <Text style={styles.toppaymentText}>₹3000</Text>
//         <Text style={styles.MonthText}>₹4500</Text>
//         <Text style={styles.upeventtext}>MAKE A PAYMENT FOR UPCOMING EVENTS</Text>
//       </View>
      
//       <View style={styles.toggleContainer}>
//       <Text style={styles.botpaymentText}>₹1500</Text>
//       <Text style={styles.offbotpaymentText}>₹2000</Text>
//         <Text style={styles.toggleLabel}>Amount To Pay</Text>
//         <TouchableOpacity style={styles.button} onPress={handleContinue}>
//         <Text style={styles.buttonText}>Continue</Text>
//       </TouchableOpacity>
//       </View>
     
//       <View style={styles.bottumcon}>
//         <Text style={styles.termsHeader}>Terms and Conditions</Text>
//         <Text style={styles.termsText}>
//           By proceeding, you agree to our terms and conditions...
//         </Text>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     flexGrow: 1,
//     backgroundColor: '#ccc',
//   },
//   header: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginTop: 20,
//     marginBottom: 40,
//     textAlign: 'center',
//     color: '#A3238F',
//   },

//   topcon: {
//     backgroundColor: '#ffffff',
//     padding: 40,
//     marginBottom: 0,
//     borderTopStartRadius: 15,
//     borderTopEndRadius: 15,
//   },
//   headertocon:{
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 40,
//     textAlign: 'center',
//     color: '#A3238F',
//   },
//   toppaymentText: {
//     fontSize: 40,
//     fontWeight: 'bold',
//     color: '#A3238F',
   
//     textAlign:'center',
//     paddingBottom:0,
    
    
//   },
//   MonthText: {
//     fontSize: 16,
//     color: '#A3238F',
//     marginBottom: 30,
//     textDecorationLine:'line-through',
//     marginTop:0,
//     paddingTop:0,
//     paddingLeft:125,
//     transform: [{ translateY: -5 }],
    
//   },
//   upeventtext:{
//     fontSize: 12,
//     marginBottom: -8,
//     color: '#A3238F',
//     backgroundColor: '#ffffff',
//     textAlign:'center',
//     fontWeight:'400',
//   },
//   toggleContainer: {
//     flexDirection: 'column',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//     backgroundColor: '#f9f3fb',
//     padding: 20,
//     paddingLeft:10,
//     paddingBottom:20,
//     paddingRight:15,
//     paddingTop: 20,
//     borderRadius: 15,
//     transform: [{ translateY: -13 }],
//   },
//   botpaymentText:{
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#A3238F',
//     paddingLeft:10,
//   },
  
//   offbotpaymentText:{
//     position:'absolute',
//     fontSize: 15,
//     color: '#A3238F',
//     transform: [{ translateX: 83 }],
//     marginTop:23,
//     textDecorationLine:'line-through',
//   },


//   toggleLabel: {
//     fontSize: 16,
//     color: '#A3238F',
//     fontWeight:'500',
//     paddingLeft:10,
//     transform: [{ translateY: 0 }],
//   },
//   button: {
//     position:'absolute',
//     backgroundColor: '#A3238F',
//     padding: 8,
//     borderRadius: 15,
//     alignItems:'flex-end',
//     paddingHorizontal:20,
//     marginLeft:195,
//     transform: [{ translateY: 25}],
   
//   },
//   buttonText: {
//     color: '#FFFFFF',
//     fontSize: 15,
//     fontWeight: 'bold',


//   },
//   bottumcon: {
//     backgroundColor: '#ffffff',
//     padding: 15,
//     borderRadius: 15,
//     paddingLeft:20,
//   },

//   termsHeader: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#A3238F',
//     textDecorationLine:'underline',
//       },
//   termsText: {
//     marginTop: 10,
//     fontSize: 14,
//     color: '#A3238F',
//   },
// });

// export default Payment;