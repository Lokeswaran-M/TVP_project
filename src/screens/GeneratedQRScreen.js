

// import React, { useRef } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import QRCode from 'react-native-qrcode-svg';
// import { captureRef } from 'react-native-view-shot';
// import CameraRoll from '@react-native-camera-roll/camera-roll';


// const GeneratedQRScreen = ({ route, navigation }) => {
//   const { eventId } = route.params;
//   const qrCodeRef = useRef();

//   const handleDownloadQR = async () => {
//     try {
//       const uri = await captureRef(qrCodeRef, {
//         format: 'png',
//         quality: 1,
//       });
//       await CameraRoll.save(uri, { type: 'photo' });
//       alert('QR Code saved to gallery');
//     } catch (error) {
//       console.error('Error saving QR Code:', error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Your Meeting QR Code</Text>
//       <View style={styles.qrContainer} ref={qrCodeRef}>
//         <QRCode value={eventId.toString()} size={200} />
//       </View>
//       <TouchableOpacity style={styles.downloadButton} onPress={handleDownloadQR}>
//         <Text style={styles.downloadText}>Download QR </Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   qrContainer: {
//     marginBottom: 20,
//   },
//   downloadButton: {
//     backgroundColor: '#2e3192',
//     padding: 10,
//     borderRadius: 5,
//   },
//   downloadText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
// });

// export default GeneratedQRScreen;
