import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '../constants/Config';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { PERMISSIONS, request } from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';
import { compressImage } from 'react-native-compressor'; 

const CustomDrawerContent = (props) => {
  const user = useSelector((state) => state.user);
  const userId = useSelector((state) => state.user?.userId);
  console.log("UserID----------",userId);
  const [isModalVisible, setModalVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(require('../../assets/images/DefaultProfile.jpg'));
  const [previousProfileImageUri, setPreviousProfileImageUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const fetchProfileImage = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/profile-image?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log("Fetched data:", data);
      const imageUrlWithTimestamp = `${data.imageUrl}?t=${new Date().getTime()}`;
      setProfileImage({ uri: imageUrlWithTimestamp });
      setPreviousProfileImageUri({ uri: imageUrlWithTimestamp });
    } catch (error) {
      console.error("Error fetching profile image:", error);
    }
  };  
  const requestCameraPermission = async () => {
    try {
      const cameraPermission = await request(PERMISSIONS.ANDROID.CAMERA);
      const storagePermission = await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);

      if (cameraPermission === 'granted' && storagePermission === 'granted') {
        console.log('Camera and Storage permissions granted');
      } 
    } catch (error) {
      console.error('Permission request error:', error);
    }
  };
  const handleImagePicker = async (type) => {
    await requestCameraPermission();
    try {
      let result;
      if (type === 'camera') {
        result = await ImagePicker.openCamera({
          width: 500,
          height: 500,
          cropping: true,
          cropperCircleOverlay: true,
          mediaType: 'photo',
        });
      } else if (type === 'gallery') {
        result = await ImagePicker.openPicker({
          width: 500,
          height: 500,
          cropping: true,
          cropperCircleOverlay: true,
          mediaType: 'photo',
        });
      }
      if (result && result.path) {
        const { path, mime } = result;
        setPreviousProfileImageUri(profileImage);
        setProfileImage({ uri: path });
        uploadImage(path, mime);
      }
    } catch (error) {
      console.error('Error picking image:', error);
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
      const response = await fetch(`${API_BASE_URL}/upload-profile?userId=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
// f
      const data = await response.json();
      console.log("Data in the uploaded Profile--------------------",data);
      if (data.newFilePath) {
        fetchProfileImage();
      } else {
        console.warn('No new file path returned from server');
      }
    } catch (error) {
      console.error('Profile picture update failed:', error);
      setProfileImage(previousProfileImageUri);
      Alert.alert(
        'Update Failed',
        'Failed to update profile picture due to network issues. Please try again later.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };
  const handleRemoveProfilePicture = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/delete-profile-image?userId=${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        setProfileImage(require('../../assets/images/DefaultProfile.jpg'));
        setPreviousProfileImageUri(null);
        Alert.alert('Success', 'Profile picture deleted successfully.');
      } else {
        Alert.alert('Error', 'Failed to delete profile picture.');
      }
    } catch (error) {
      console.error('Error deleting profile image:', error);
      Alert.alert('Error', 'Failed to delete profile picture. Please try again later.');
    } finally {
      setLoading(false);
    }
    setModalVisible(false);
  };
  useFocusEffect(
    useCallback(() => {
      fetchProfileImage();
    }, [userId])
  );
  return (
    <DrawerContentScrollView {...props}>
      <LinearGradient
        colors={['#fff', '#F3ECF3']}
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
          <View style={styles.editIconWrapper}>
          <TouchableOpacity
            style={styles.pencilIcon}
            onPress={() => setModalVisible(true)}
          >
          <Icon name="pencil" size={20} color="white" />
          </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.profileName}>{user?.username || 'Guest'}</Text>
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
            <Icon name="camera" size={20} color="#2e3192" />
            <Text style={styles.modalButtonText}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={() => handleImagePicker('gallery')}>
            <Icon name="image" size={20} color="#2e3192" />
            <Text style={styles.modalButtonText}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={handleRemoveProfilePicture}>
            <Icon name="trash" size={20} color="#2e3192" />
            <Text style={styles.modalButtonText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
            <Icon name="times" size={20} color="#2e3192" />
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
    backgroundColor: '#2e3192',
    marginTop: -10,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
    marginTop: 40,
    borderColor: '#e4dfe4',
    borderWidth: 10,
    borderRadius: 90,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 90,
  },
  pencilIcon: {
    position: 'absolute',
    right: -10,
    bottom: -8,
    backgroundColor: 'transparent',
    borderRadius: 50,
    padding: 15,
    flexDirection: 'row',   
    alignItems: 'center',
  },  
  editIconWrapper: {
    position: 'absolute',
    right: -3,
    bottom: 0,
    backgroundColor: '#2e3192',
    borderRadius: 100,
    padding: 15,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  editText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#2e3192',
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
    color: '#2e3192',
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