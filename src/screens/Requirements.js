import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '../constants/Config';
import { Picker } from '@react-native-picker/picker';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';

const Requirements = ({ route }) => {
  const { locationId, Profession, chapterType } = route.params;
  const userId = useSelector((state) => state.UserId);
  const navigation = useNavigation();

  const [businessInfo, setBusinessInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requirement, setRequirement] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [selectedMember, setSelectedMember] = useState('');
  const [members, setMembers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState(''); 

  useEffect(() => {
    const fetchBusinessInfo = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/user/business-info/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch business info');
        }
        const data = await response.json();
        setBusinessInfo(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchMembers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/list-members`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            LocationID: locationId,
            chapterType: chapterType,
            userId: userId,
            profession: Profession,
          }),
        });
        if (!response.ok) {
          throw new Error('Failed to fetch members');
        }
        const data = await response.json();
        setMembers(data.members);
      } catch (error) {
        console.error('Failed to fetch members:', error);
      }
    };

    if (userId) {
      fetchBusinessInfo();
      fetchMembers();
    }
  }, [userId]);

  const handleSubmit = async () => {
    if (!businessInfo || !requirement.trim() || !Profession) {
      setValidationError('Please provide your requirement and select a member');
      return;
    }
    setIsSubmitting(true);
    setValidationError('');
    const requestData = {
      UserId: userId,
      LocationID: businessInfo.LocationID,
      Slots: chapterType,
      Description: requirement.trim(),
      Member: selectedMember || null,
      profession: Profession,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/requirements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit requirement');
      }

      const result = await response.json();
      setModalMessage('Requirement Created Successfully');
      setIsModalVisible(true);

      const requirementsubmitResponse = await fetch(`${API_BASE_URL}/requirementsubmit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          Member: selectedMember || null,
        }),
      });
      const requirementsubmitData = await requirementsubmitResponse.json();
      if (requirementsubmitResponse.ok) {
        PushNotification.localNotification({
          channelId: 'acknowledgement-channel',
          title: 'New Notification',
          message: 'You have a new acknowledgement!',
          playSound: true,
          soundName: 'default',
          vibrate: true,
          vibration: 300,
        });
      } else {
        console.error('Error sending acknowledgement notification:', requirementsubmitData.error);
      }
    } catch (error) {
      setModalMessage('An error occurred while submitting your requirement.');
      setIsModalVisible(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2e3192" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Modal for Alerts */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity
        style={styles.modalButton}
        onPress={() => {
          setIsModalVisible(false); // Close the modal
          navigation.goBack(); // Navigate back to the previous screen
        }}
      >
            
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Form UI */}
      <View style={styles.card}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Submit Your Need</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedMember}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedMember(itemValue)}
            >
              <Picker.Item label="Choose Member" value="" />
              {members.map((member) => (
                <Picker.Item key={member.UserId} label={member.Username} value={member.UserId} />
              ))}
            </Picker>
          </View>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your requirement here"
            multiline={true}
            numberOfLines={4}
            value={requirement}
            onChangeText={setRequirement}
          />
          {validationError ? (
            <Text style={styles.errorText}>{validationError}</Text>
          ) : null}
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Icon name="check" size={20} color="#fff" style={styles.icon} />
              <Text style={styles.buttonText}>Submit</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e3192',
  },
  pickerContainer: {
    flex: 1,
    borderColor: '#2e3192',
    borderWidth: 1,
    borderRadius: 10,
    marginLeft: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    color: 'black',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#2e3192',
    borderRadius: 10,
    padding: 10,
    marginBottom: 5,
  },
  input: {
    height: 100,
    fontSize: 16,
    color: 'black',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
    marginHorizontal: 60,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2e3192',
    padding: 14,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2e3192',
    padding: 12,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 5,
  },
  icon: {
    marginRight: 5,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
        fontWeight:'700'
  },
  modalButton: {
    backgroundColor: '#2e3192',
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
        fontWeight:'700'
  },
});

export default Requirements;































// import React, { useEffect, useState } from 'react';
// import { View, Text, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, Alert } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import { useSelector } from 'react-redux';
// import { useNavigation } from '@react-navigation/native';
// import { API_BASE_URL } from '../constants/Config';
// import { Picker } from '@react-native-picker/picker';
// import PushNotification from 'react-native-push-notification';
// import messaging from '@react-native-firebase/messaging';
// const Requirements = ({ route }) => {
//   const { locationId, Profession, chapterType } = route.params;
//   console.log("Profession in the Requirements----------------------------",Profession);
//   console.log("Chapter type in Requirements--------------------",chapterType);
//   const userId = useSelector((state) => state.UserId);
//   const navigation = useNavigation();
//   const [businessInfo, setBusinessInfo] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [requirement, setRequirement] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [validationError, setValidationError] = useState('');
//   const [selectedMember, setSelectedMember] = useState('');
//   const [members, setMembers] = useState([]);
//   useEffect(() => {
//     const fetchBusinessInfo = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(`${API_BASE_URL}/api/user/business-info/${userId}`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch business info');
//         }
//         const data = await response.json();
//         setBusinessInfo(data);
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     const fetchMembers = async () => {
//       try {
//         const response = await fetch(`${API_BASE_URL}/list-members`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             LocationID: locationId,
//             chapterType: chapterType,
//             userId: userId,
//             profession: Profession,
//           }),
//         });
//         if (!response.ok) {
//           throw new Error('Failed to fetch members');
//         }
//         const data = await response.json();
//         setMembers(data.members);
//       } catch (error) {
//         console.error('Failed to fetch members:', error);
//       }
//     };
//     if (userId) {
//       fetchBusinessInfo();
//       fetchMembers();
//     }
//   }, [userId]);
//   const handleSubmit = async () => {
//     console.log("Validation-------------------",businessInfo, "Requirement" , requirement.trim(), "Profession" , Profession);
//     if (!businessInfo || !requirement.trim() || !Profession) {
//       setValidationError('Please provide your requirement and select a member');
//       return;
//     }
//     setIsSubmitting(true);
//     setValidationError('');
//     const requestData = {
//       UserId: userId,
//       LocationID: businessInfo.LocationID,
//       Slots: chapterType,
//       Description: requirement.trim(),
//       Member: selectedMember || null,
//       profession: Profession,
//     };
//     try {
//       const response = await fetch(`${API_BASE_URL}/requirements`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(requestData),
//       });
  
//       if (!response.ok) {
//         throw new Error('Failed to submit requirement');
//       }
//       const result = await response.json();
//       console.log("Result of handleSubmit:", result);
//       Alert.alert('Success', 'Requirement Created Successfully');
//       navigation.goBack();
//       const requirementsubmitResponse = await fetch(`${API_BASE_URL}/requirementsubmit`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           userId: userId,
//           Member: selectedMember || null,
//         }),
//       });
//       const requirementsubmitData = await requirementsubmitResponse.json();
//       console.log("Requirement Submit Data:", requirementsubmitData);
//       if (requirementsubmitResponse.ok) {
//         console.log('Requirement submitted, notification sent successfully');
//         PushNotification.localNotification({
//           channelId: 'acknowledgement-channel',
//           title: 'New Notification',
//           message: 'You have a new acknowledgement!',
//           playSound: true,
//           soundName: 'default',
//           vibrate: true,
//           vibration: 300,
//         });
//       } else {
//         console.error('Error sending acknowledgement notification:', requirementsubmitData.error);
//       }
//     } catch (error) {
//       console.error('Error submitting requirement:', error);
//       setError(error.message);
//       // Alert.alert('Error', 'An error occurred while submitting your requirement.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };  
//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#2e3192" />
//       </View>
//     );
//   }
//   return (
//     <View style={styles.container}>
//       <View style={styles.card}>
//         <View style={styles.headerContainer}>
//           <Text style={styles.title}>Submit Your Need</Text>
//           <View style={styles.pickerContainer}>
//             <Picker
//               selectedValue={selectedMember}
//               style={styles.picker}
//               onValueChange={(itemValue) => setSelectedMember(itemValue)}
//             >
//               <Picker.Item label="Choose Member" value="" />
//               {members.map((member) => (
//                 <Picker.Item key={member.UserId} label={member.Username} value={member.UserId} />
//               ))}
//             </Picker>
//           </View>
//         </View>
//         <View style={styles.inputContainer}>
//           <TextInput
//             style={styles.input}
//             placeholder="Enter your requirement here"
//             multiline={true}
//             numberOfLines={4}
//             value={requirement}
//             onChangeText={setRequirement}
//           />
//           {validationError ? (
//             <Text style={styles.errorText}>{validationError}</Text>
//           ) : null}
//         </View>
//       </View>
//       <View style={styles.buttonContainer}>
//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() => navigation.goBack()}
//         >
//           <Icon name="arrow-left" size={20} color="#fff" style={styles.icon} />
//           <Text style={styles.buttonText}>Back</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.submitButton}
//           onPress={handleSubmit}
//           disabled={isSubmitting}
//         >
//           {isSubmitting ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <>
//               <Icon name="check" size={20} color="#fff" style={styles.icon} />
//               <Text style={styles.buttonText}>Submit</Text>
//             </>
//           )}
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 10,
//   },
//   card: {
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   headerContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#2e3192',
//   },
//   pickerContainer: {
//     flex: 1,
//     borderColor: '#2e3192',
//     borderWidth: 1,
//     borderRadius: 10,
//     marginLeft: 10,
//   },
//   picker: {
//     height: 50,
//     width: '100%',
//     color: 'black',
//   },
//   inputContainer: {
//     borderWidth: 1,
//     borderColor: '#2e3192',
//     borderRadius: 10,
//     padding: 10,
//     marginBottom: 5,
//   },
//   input: {
//     height: 100,
//     fontSize: 16,
//     color: 'black',
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 14,
//     marginTop: 5,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     margin: 20,
//     marginHorizontal: 60,
//   },
//   backButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#2e3192',
//     padding: 14,
//     borderRadius: 30,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   submitButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#2e3192',
//     padding: 12,
//     borderRadius: 30,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//     marginLeft: 5,
//   },
//   icon: {
//     marginRight: 5,
//   },
// });

// export default Requirements;