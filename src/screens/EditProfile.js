import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { API_BASE_URL } from '../constants/Config';

const EditProfile = () => {
  const route = useRoute();
  const categoryID = route.params?.CategoryId;
  const profession = categoryID === 2 ? route.params?.profession : undefined;
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({});
  const [multiProfile, setMultiProfile] = useState({});
  const userId = useSelector((state) => state.user?.userId);
  const [username, setName] = useState('');
  const [professionForm, setProfession] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');

  // State for modal alert
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      let response;
      if (categoryID === 2) {
        response = await fetch(
          `${API_BASE_URL}/api/user/Multibusiness-info/${userId}/profession/${profession}`
        );
      } else {
        response = await fetch(`${API_BASE_URL}/api/user/business-info/${userId}`);
      }
      if (!response.ok) {
        console.error('Response failed:', response.statusText);
        throw new Error('Failed to fetch profile data');
      }
      const data = await response.json();
      if (categoryID === 2) {
        setMultiProfile(data[0] || {});
        setName(data[0].Username || '');
        setProfession(data[0].Profession || '');
        setBusinessName(data[0].BusinessName || '');
        setDescription(data[0].Description || '');
        setAddress(data[0].Address || '');
      } else {
        setProfileData(data);
        setName(data.Username || '');
        setProfession(data.Profession || '');
        setBusinessName(data.BusinessName || '');
        setDescription(data.Description || '');
        setAddress(data.Address || '');
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      let response;
      if (categoryID === 2) {
        response = await fetch(`${API_BASE_URL}/update-Multiprofile`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,
            username,
            professionForm: profession,
            businessName,
            description,
            address,
          }),
        });
      } else {
        response = await fetch(`${API_BASE_URL}/update-profile`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,
            username,
            professionForm: profession,
            businessName,
            description,
            address,
          }),
        });
      }
      if (response.ok) {
        setModalMessage('Profile updated successfully');
      } else {
        setModalMessage('Fill all the fields');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setModalMessage('Network Error');
    } finally {
      setModalVisible(true);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfileData();
    }, [userId])
  );

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.label}>Username</Text>
        </View>
        <TextInput
          style={styles.inputProfession}
          value={username}
          onChangeText={setName}
          editable={false}
        />
        <View style={styles.row}>
          <Text style={styles.label}>Profession</Text>
        </View>
        <TextInput
          style={styles.inputProfession}
          value={professionForm}
          onChangeText={setProfession}
          editable={false}
        />
        <View style={styles.row}>
          <Text style={styles.label}>Business Name</Text>
        </View>
        <TextInput
          style={styles.input}
          value={businessName}
          onChangeText={setBusinessName}
        />
        <View style={styles.row}>
          <Text style={styles.label}>Description (250 words)</Text>
        </View>
        <TextInput
          style={styles.input}
          multiline
          value={description}
          onChangeText={setDescription}
        />
        <View style={styles.row}>
          <Text style={styles.label}>Business Address</Text>
        </View>
        <TextInput
          style={styles.input}
          multiline
          value={address}
          onChangeText={setAddress}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <FontAwesome name="save" size={20} color="#fff" />
            <Text style={styles.buttonText}> Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.exitButton}
            onPress={() => navigation.goBack()}
          >
            <FontAwesome name="times" size={20} color="#2e3192" />
            <Text style={[styles.buttonText, { color: '#2e3192' }]}> Exit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal for alert */}
      <Modal
  transparent={true}
  animationType="slide"
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalText}>{modalMessage}</Text>
      <TouchableOpacity
        style={styles.modalButton}
        onPress={() => {
          setModalVisible(false);
          if (modalMessage === 'Profile updated successfully') {
            navigation.goBack();
          }
        }}
      >
        <Text style={styles.modalButtonText}>OK</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: '#2e3192',
    fontWeight: 'bold',
  },
  input: {
    borderBottomWidth: 1,
    backgroundColor: '#F3ECF3',
    borderColor: '#888',
    fontSize: 16,
    paddingVertical: 8,
    marginBottom: 15,
    color: '#333',
  },
  inputProfession: {
    borderBottomWidth: 1,
    backgroundColor: '#BDBCBD',
    borderColor: '#888',
    fontSize: 16,
    paddingVertical: 8,
    marginBottom: 15,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#2e3192',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
  },
  exitButton: {
    flexDirection: 'row',
    borderColor: '#2e3192',
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#2e3192',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default EditProfile;























// import React, { useState, useCallback } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import { useSelector } from 'react-redux';
// import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
// import { API_BASE_URL } from '../constants/Config';
// const EditProfile = () => {
//   const route = useRoute();
//   const categoryID = route.params?.CategoryId;
//   console.log('CATEGORY id IN EDIT PROFILE SCREEN-------------------', categoryID);
//   const navigation = useNavigation(); 
//   const profession =  categoryID === 2 ? route.params?.profession : undefined;
//   console.log('Profession in Edit Profile--------------------------',profession);
//   const [loading, setLoading] = useState(true);
//   const [profileData, setProfileData] = useState({});
//   const [multiProfile, setMultiProfile] = useState({});
//   const userId = useSelector((state) => state.user?.userId);
//   console.log('User ID in Edit Profile----------------',userId);
//   const [username, setName] = useState('');
//   const [professionForm, setProfession] = useState('');
//   const [businessName, setBusinessName] = useState('');
//   const [description, setDescription] = useState('');
//   const [address, setAddress] = useState('');
//   const fetchProfileData = async () => {
//     setLoading(true);
//     try {
//       let response;
//         if (categoryID === 2) {
//             response = await fetch(`${API_BASE_URL}/api/user/Multibusiness-info/${userId}/profession/${profession}`);
//         } else {
//             response = await fetch(`${API_BASE_URL}/api/user/business-info/${userId}`);
//         }
//         if (!response.ok) {
//             console.error('Response failed:', response.statusText);
//             throw new Error('Failed to fetch profile data');
//         }
//       const data = await response.json();
//       console.log("Name in Edit Profile-----------------------------------------------------------",data);
//       if (categoryID === 2) {
//         setMultiProfile(data[0] || {});
//         setName(data[0].Username || '');
//         setProfession(data[0].Profession || '');
//         setBusinessName(data[0].BusinessName || '');
//         setDescription(data[0].Description || '');
//         setAddress(data[0].Address || '');
//         console.log('MultiProfile:', data[0]);
//     } else {
//         setProfileData(data);
//         setName(data.Username || '');
//         setProfession(data.Profession || '');
//         setBusinessName(data.BusinessName || '');
//         setDescription(data.Description || '');
//         setAddress(data.Address || '');
//       }
//     } catch (error) {
//       console.error('Error fetching profile data in edit Profile:', error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const handleSave = async () => {
//     try {
//       let response;
//       if (categoryID === 2) {
//         response = await fetch(`${API_BASE_URL}/update-Multiprofile`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             userId: userId,
//             username,
//             professionForm: profession,
//             businessName,
//             description,
//             address,
//           }),
//         });

//     } else {
//       response = await fetch(`${API_BASE_URL}/update-profile`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           userId: userId,
//           username,
//           professionForm: profession,
//           businessName,
//           description,
//           address,
//         }),
//       });
//     }
//       const result = await response.json();
//       console.log('RESULT in Edit Profile------------------',result);
//       if (response.ok) {
//         alert('Profile updated successfully');
        
//         navigation.goBack();
//       } else {
//         alert('Fill all the Feilds');
//       }
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       alert('Network Error');
//     }
//   };
//   useFocusEffect(
//     useCallback(() => {
//       fetchProfileData();
//     }, [userId])
//   );
//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.row}>
//         <Text style={styles.label}>Username</Text>
//       </View>
//       <TextInput
//         style={styles.inputProfession}
//         value={username}
//         onChangeText={setName}
//         editable={false}
//       />
//       <View style={styles.row}>
//         <Text style={styles.label}>Profession</Text>
//       </View>
//       <TextInput
//   style={styles.inputProfession}
//   value={professionForm}
//   onChangeText={setProfession}
//   editable={false}
// />
//       <View style={styles.row}>
//         <Text style={styles.label}>Business Name</Text>
//       </View>
//       <TextInput
//         style={styles.input}
//         value={businessName}
//         onChangeText={setBusinessName}
//       />
//       <View style={styles.row}>
//         <Text style={styles.label}>Description (250 words)</Text>
//       </View>
//       <TextInput
//         style={styles.input}
//         multiline
//         value={description}
//         onChangeText={setDescription}
//       />
//       <View style={styles.row}>
//         <Text style={styles.label}>Business Address</Text>
//       </View>
//       <TextInput
//         style={styles.input}
//         multiline
//         value={address}
//         onChangeText={setAddress}
//       />
//       <View style={styles.buttonContainer}>
//         <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
//           <FontAwesome name="save" size={20} color="#fff" />
//           <Text style={styles.buttonText}> Save</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={styles.exitButton} 
//           onPress={() => navigation.goBack()}
//         >
//           <FontAwesome name="times" size={20} color="#2e3192" />
//           <Text style={[styles.buttonText, { color: '#2e3192' }]}> Exit</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   label: {
//     fontSize: 14,
//     color: '#2e3192',
//     fontWeight: 'bold',
//   },
//   input: {
//     borderBottomWidth: 1,
//     backgroundColor: '#F3ECF3',
//     borderColor: '#888',
//     fontSize: 16,
//     paddingVertical: 8,
//     marginBottom: 15,
//     color: '#333',
//   },inputProfession: {
//     borderBottomWidth: 1,
//     backgroundColor: '#BDBCBD',
//     borderColor: '#888',
//     fontSize: 16,
//     paddingVertical: 8,
//     marginBottom: 15,
//     color: '#333',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 20,
//   },
//   saveButton: {
//     flexDirection: 'row',
//     backgroundColor: '#2e3192',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 30,
//     alignItems: 'center',
//   },
//   exitButton: {
//     flexDirection: 'row',
//     borderColor: '#2e3192',
//     borderWidth: 1,
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 30,
//     alignItems: 'center',
//   },
//   buttonText: {
//     fontSize: 16,
//     color: '#fff',
//     marginLeft: 5,
//   },
// });

// export default EditProfile;