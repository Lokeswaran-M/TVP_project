import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { API_BASE_URL } from '../constants/Config';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { PERMISSIONS, request } from 'react-native-permissions';

const CustomDrawerContent = (props) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(require('../../assets/images/DefaultProfile.jpg'));
  const [previousProfileImageUri, setPreviousProfileImageUri] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/profile-image`);
        const data = await response.json();

        if (data.imageUrl) {
          setProfileImage({ uri: data.imageUrl });
          setPreviousProfileImageUri(data.imageUrl);
        } else {
          console.warn('No profile image found');
        }
      } catch (error) {
        console.error('Failed to load profile image from API:', error);
      }
    };

    fetchProfileImage();
  }, []);

  const requestCameraPermission = async () => {
    try {
      const cameraPermission = await request(PERMISSIONS.ANDROID.CAMERA);
      const storagePermission = await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);

      if (cameraPermission === 'granted' && storagePermission === 'granted') {
        console.log('Camera and Storage permissions granted');
      } else {
        // Alert.alert('Permission Denied', 'Camera or Storage permission is required to take a photo.');
      }
    } catch (error) {
      console.error('Permission request error:', error);
    }
  };

  const handleImagePicker = async (type) => {
    await requestCameraPermission();
    let result;
    if (type === 'camera') {
      result = await launchCamera({
        mediaType: 'photo',
        quality: 1,
        saveToPhotos: true,
      });
    } else if (type === 'gallery') {
      result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
      });
    }

    if (result && result.assets && !result.didCancel) {
      const { uri, type: fileType } = result.assets[0];
      setProfileImage({ uri });
      console.log('Selected image URI:', uri);
      uploadImage(uri, fileType);
    } else {
      console.log('Image selection cancelled');
    }
    setModalVisible(false);
  };

  const uploadImage = async (uri, fileType) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('avatar', {
      uri,
      type: fileType,
      name: `photo.${fileType.split('/')[1]}`,
    });
  
    try {
      const response = await fetch(`${API_BASE_URL}/upload-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
      const data = await response.json();
      console.log('Profile picture updated successfully:', data);
  
      if (data.newFilePath) {
        setProfileImage({ uri: `${API_BASE_URL}/${data.newFilePath}` });
        setPreviousProfileImageUri(`${API_BASE_URL}/${data.newFilePath}`);
      }
    } catch (error) {
      console.error('Profile picture update failed:', error);
      setProfileImage(previousProfileImageUri ? { uri: previousProfileImageUri } : require('../../assets/images/DefaultProfile.jpg'));
      Alert.alert(
        'Update Failed',
        'Failed to update profile picture due to network issues. Please try again later.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };  

  const handleRemoveProfilePicture = () => {
    setProfileImage(require('../../assets/images/DefaultProfile.jpg'));
    setPreviousProfileImageUri(null);
    setModalVisible(false);
    console.log('Profile picture removed');
  };

  return (
    <DrawerContentScrollView {...props}>
      <LinearGradient
        colors={['#a3238f', '#ffbe4e']}
        style={styles.profileContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.imageContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#ffbe4e" />
          ) : (
            <Image
              source={profileImage}
              style={styles.profileImage}
            />
          )}
          <TouchableOpacity
            style={styles.pencilIcon}
            onPress={() => setModalVisible(true)}
          >
            <Icon name="pencil" size={20} color="#a3238f" />
          </TouchableOpacity>
        </View>
        <Text style={styles.nameText}>Your Name</Text>
        <Text style={styles.professionText}>Profession</Text>
        <View style={styles.iconContainer}>
          <Icon name="sun-o" size={20} color="#FDB813" style={styles.icon} />
          <Icon name="moon-o" size={20} color="#F6F1D5" style={styles.icon} />
        </View>
      </LinearGradient>
      <View style={styles.container}>
        <DrawerItemList {...props} />
      </View>
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={styles.modal}
        useNativeDriver={true}
        useNativeDriverForBackdrop={true}
      >
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.modalButton} onPress={() => handleImagePicker('camera')}>
            <Icon name="camera" size={20} color="#a3238f" />
            <Text style={styles.modalButtonText}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={() => handleImagePicker('gallery')}>
            <Icon name="image" size={20} color="#a3238f" />
            <Text style={styles.modalButtonText}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={handleRemoveProfilePicture}>
            <Icon name="trash" size={20} color="#a3238f" />
            <Text style={styles.modalButtonText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
            <Icon name="times" size={20} color="#a3238f" />
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  profileContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#a3238f',
    marginTop: -10,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
    marginTop: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  pencilIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 5,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  professionText: {
    fontSize: 14,
    color: '#ffbe4e',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 50,
    borderRadius: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  modalButton: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  modalButtonText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#a3238f',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  icon: {
    marginHorizontal: 10,
  },
});

export default CustomDrawerContent;


// import React, { useState, useEffect } from 'react';
// import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import LinearGradient from 'react-native-linear-gradient';
// import Modal from 'react-native-modal';
// import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
// import { PERMISSIONS, request } from 'react-native-permissions';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// const CustomDrawerContent = (props) => {
//   const [isModalVisible, setModalVisible] = useState(false);
//   const [profileImage, setProfileImage] = useState(require('../../assets/images/DefaultProfile.jpg'));
//   const [previousProfileImageUri, setPreviousProfileImageUri] = useState(null);
//   useEffect(() => {
//     const loadProfileImage = async () => {
//       try {
//         const storedProfileImage = await AsyncStorage.getItem('profileImage');
//         if (storedProfileImage) {
//           setProfileImage({ uri: storedProfileImage });
//           setPreviousProfileImageUri(storedProfileImage);
//         }
//       } catch (error) {
//         console.error('Failed to load profile image:', error);
//       }
//     };
//     loadProfileImage();
//   }, []);
//   const requestCameraPermission = async () => {
//     try {
//       const cameraPermission = await request(PERMISSIONS.ANDROID.CAMERA);
//       const storagePermission = await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);

//       if (cameraPermission === 'granted' && storagePermission === 'granted') {
//         console.log('Camera and Storage permissions granted');
//       } else {
//         Alert.alert('Permission Denied', 'Camera or Storage permission is required to take a photo.');
//       }
//     } catch (error) {
//       console.error('Permission request error:', error);
//     }
//   };
//   const handleImagePicker = async (type) => {
//     await requestCameraPermission();
//     let result;
//     if (type === 'camera') {
//       result = await launchCamera({
//         mediaType: 'photo',
//         quality: 1,
//         saveToPhotos: true,
//       });
//     } else if (type === 'gallery') {
//       result = await launchImageLibrary({
//         mediaType: 'photo',
//         quality: 1,
//       });
//     }
//     if (result && result.assets && !result.didCancel) {
//       const { uri } = result.assets[0];
//       setProfileImage({ uri });
//       await AsyncStorage.setItem('profileImage', uri);
//       setPreviousProfileImageUri(uri);
//       console.log('URI-----------------------',uri);
//     } else {
//       console.log('Image selection cancelled');
//     }
//     setModalVisible(false); 
//   };
//   const handleRemoveProfilePicture = async () => {
//     try {
//       await AsyncStorage.removeItem('profileImage');
//       setProfileImage(require('../../assets/images/DefaultProfile.jpg'));
//       setPreviousProfileImageUri(null);
//       console.log('Profile picture removed');
//     } catch (error) {
//       console.error('Failed to remove profile picture:', error);
//     }
//     setModalVisible(false); 
//   };
//   return (
//     <DrawerContentScrollView {...props}>
//       <LinearGradient
//         colors={['#a3238f', '#ffbe4e']}
//         style={styles.profileContainer}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 0 }}
//       >
//         <View style={styles.imageContainer}>
//           <Image
//             source={profileImage}
//             style={styles.profileImage}
//           />
//           <TouchableOpacity
//             style={styles.pencilIcon}
//             onPress={() => setModalVisible(true)}
//           >
//             <Icon name="pencil" size={20} color="#fff" />
//           </TouchableOpacity>
//         </View>
//         <Text style={styles.nameText}>Your Name</Text>
//         <Text style={styles.professionText}>Profession</Text>
//         <View style={styles.iconContainer}>
//         <Icon name="sun-o" size={20} color="#FDB813" style={styles.icon} />
//       <Icon name="moon-o" size={20} color="#F6F1D5" style={styles.icon} />
//     </View>
//       </LinearGradient>
//       <View style={styles.container}>
//         <DrawerItemList {...props} />
//       </View>
//       <Modal
//         isVisible={isModalVisible}
//         onBackdropPress={() => setModalVisible(false)} 
//         style={styles.modal}
//         useNativeDriver={true}
//         useNativeDriverForBackdrop={true}
//       >
//         <View style={styles.modalContent}>
//           <TouchableOpacity style={styles.modalButton} onPress={() => handleImagePicker('camera')}>
//             <Icon name="camera" size={20} color="#a3238f" />
//             <Text style={styles.modalButtonText}>Camera</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.modalButton} onPress={() => handleImagePicker('gallery')}>
//             <Icon name="image" size={20} color="#a3238f" />
//             <Text style={styles.modalButtonText}>Gallery</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.modalButton} onPress={handleRemoveProfilePicture}>
//             <Icon name="trash" size={20} color="#a3238f" />
//             <Text style={styles.modalButtonText}>Delete</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
//             <Icon name="times" size={20} color="#a3238f" />
//             <Text style={styles.modalButtonText}>Cancel</Text>
//           </TouchableOpacity>
//         </View>
//       </Modal>
//     </DrawerContentScrollView>
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'white',
//   },
//   profileContainer: {
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#a3238f',
//     marginTop: -10,
//   },
//   imageContainer: {
//     position: 'relative',
//     marginBottom: 20,
//     marginTop: 20,
//   },
//   profileImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//   },
//   pencilIcon: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     backgroundColor: '#a3238f',
//     borderRadius: 50,
//     padding: 5,
//   },
//   nameText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   professionText: {
//     fontSize: 14,
//     color: '#ffbe4e',
//   },
//   modal: {
//     justifyContent: 'flex-end',
//     margin: 0,
//   },
//   modalContent: {
//     flexDirection: 'row',
//     backgroundColor: 'white',
//     padding: 50,
//     borderRadius: 10,
//     justifyContent: 'space-around',
//     alignItems: 'center',
//   },
//   modalButton: {
//     flexDirection: 'column',
//     alignItems: 'center',
//     marginHorizontal: 10,
//   },
//   modalButtonText: {
//     fontSize: 16,
//     marginLeft: 10,
//     color: '#a3238f',
//   },
//   iconContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 10,
//   },
//   icon: {
//     marginHorizontal: 10,
//   },
// });
// export default CustomDrawerContent;