import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  SafeAreaView,
  Image
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { API_BASE_URL } from '../constants/Config';
import { launchImageLibrary } from 'react-native-image-picker';
import { Dropdown } from 'react-native-element-dropdown';

const EditProfile = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const categoryID = route.params?.CategoryId;
  const profession = categoryID === 2 ? route.params?.profession : undefined;
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({});
  const [multiProfile, setMultiProfile] = useState({});
  const userId = useSelector((state) => state.UserId);
  const [username, setName] = useState('');
  const [professionForm, setProfession] = useState('');
  const [AllProfession, setAllProfession] = useState([]);
  const [selectedProfession, setSelectedProfession] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [descriptionWordCount, setDescriptionWordCount] = useState(0);
  const [posterImage, setPosterImage] = useState(null);

  useEffect(() => {
    const words = description.trim() ? description.trim().split(/\s+/).length : 0;
    setDescriptionWordCount(words);
  }, [description]);


useEffect(() =>{
fetchProfileData();
},[ ]);




  const selectPosterImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1024,
      maxHeight: 1024,
      selectionLimit: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
        setModalMessage('Failed to select image');
        setModalVisible(true);
      } else {
        const asset = response.assets[0];
        setPosterImage({
          uri: asset.uri,
          type: asset.type || 'image/jpeg',
          name: asset.fileName || `profile_${Date.now()}.jpg`,
        });
      }
    });
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/execute-profession`)
      .then((response) => response.json())
      .then((data) => setAllProfession(data.executeprofession))
      .catch((error) => console.error(error));
  }, []);


  const handleProfessionChange = (AllProfession) => {
    setSelectedProfession(AllProfession);
  };




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
        setName(data[0]?.Username || '');
        setProfession(data[0]?.Profession || '');
        setBusinessName(data[0]?.BusinessName || '');
        setDescription(data[0]?.Description || '');
        setAddress(data[0]?.Address || '');
      } else {
        setProfileData(data);
        setName(data?.Username || '');
        setProfession(data?.Profession || '');
        setBusinessName(data?.BusinessName || '');
        setDescription(data?.Description || '');
        setAddress(data?.Address || '');
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };






const handleSave = async () => {
  if (!businessName.trim()) {
    setModalMessage('Please enter your business name');
    setModalVisible(true);
    return;
  }
  if (descriptionWordCount > 25) {
    setModalMessage('Description exceeds 25 words limit');
    setModalVisible(true);
    return;
  }

  setLoading(true);
  let uploadedImageFileName = null;

  try {
    // Step 1: Upload image first if exists
    if (posterImage) {
      const imageForm = new FormData();
      imageForm.append('userId', userId);
      imageForm.append('posterImage', {
        uri: posterImage.uri,
        type: posterImage.type,
        name: posterImage.name,
      });

      const imageResponse = await fetch(`${API_BASE_URL}/upload-post-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: imageForm,
      });

      const imageData = await imageResponse.json();
      if (imageResponse.ok && imageData.success) {
        uploadedImageFileName = imageData.imageUrl.split('/').pop(); // Extract filename
      } else {
        setModalMessage(imageData.message || 'Image upload failed');
        setModalVisible(true);
        setLoading(false);
        return;
      }
    }

    // Step 2: Send profile details including uploaded image file name
    const profileForm = new FormData();
    profileForm.append('userId', userId);
    profileForm.append('username', username);
    profileForm.append('professionForm', professionForm);
    profileForm.append('businessName', businessName);
    profileForm.append('description', description);
    profileForm.append('address', address);
    profileForm.append('selectedProfession',selectedProfession);

    if (uploadedImageFileName) {
      profileForm.append('Post_Img', uploadedImageFileName);
    }

    const profileResponse = await fetch(`${API_BASE_URL}/update-Multiprofile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: profileForm,
    });

    const profileData = await profileResponse.json();
    if (profileResponse.ok) {
      setModalMessage('Profile updated successfully');
    } else {
      setModalMessage(profileData.message || 'Failed to update profile');
    }

  } catch (error) {
    console.error('Upload error:', error);
    setModalMessage('Network Error');
  } finally {
    setLoading(false);
    setModalVisible(true);
  }
};



  useFocusEffect(
    useCallback(() => {
      fetchProfileData();
    }, [userId])
  );

  if (loading && !modalVisible) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2e3192" />
        <Text style={styles.loadingText}>Loading profile data...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#2e3192" barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <View style={styles.inputReadOnly}>
                <TextInput
                  style={styles.textInput}
                  value={username}
                  editable={false}
                />
                <FontAwesome name="lock" size={16} color="#888" style={styles.inputIcon} />
              </View>
            </View>
{professionForm !== ' Others' ? (
  // Render read-only profession view if NOT "Others"
  <View style={styles.inputGroup}>
    <Text style={styles.label}>Profession</Text>
    <View style={styles.inputReadOnly}>
      <TextInput
        style={styles.textInput}
        value={professionForm}
        editable={false}
      />
      <FontAwesome name="briefcase" size={16} color="#888" style={styles.inputIcon} />
    </View>
  </View>
) : (
  // Render dropdown + editable text field if "Others"
  <View style={styles.inputGroup2}>
    <Text style={styles.label2}>Profession <Text style={styles.required}>*</Text></Text>
    <View style={styles.inputReadOnly1}>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        placeholder="Select Profession"
        search
        searchPlaceholder="Search Profession"
        labelField="label"
        valueField="value"
        inputSearchStyle={styles.inputSearchStyle}
        value={selectedProfession}
        onChange={(item) => handleProfessionChange(item.value)}
        data={AllProfession
          .slice()
          .sort((a, b) => a.ProfessionName.localeCompare(b.ProfessionName))
          .map((item, index) => ({
            label: item.ProfessionName,
            value: item.ProfessionName,
            backgroundColor: index % 2 === 0 ? 'white' : '#F5F7FE',
          }))}
        renderItem={(item) => (
          <View style={[styles.item1, { backgroundColor: item.backgroundColor }]}>
            <Text style={styles.itemText1}>{item.label}</Text>
          </View>
        )}
      />
      {/* <TextInput
        style={styles.textInput1}
        value={professionForm}
        onChangeText={(text) => setProfessionForm(text)} // You can handle input change here
      /> */}
      <FontAwesome name="briefcase" size={16} color="#888" style={styles.inputIcon1} />
    </View>
  </View>
)}


            <View style={styles.inputGroup}>
              <Text style={styles.label}>Business Name <Text style={styles.required}>*</Text></Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  value={businessName}
                  onChangeText={setBusinessName}
                  placeholder="Enter your business name"
                  placeholderTextColor="#aaa"
                />
                <FontAwesome name="building" size={16} color="#2e3192" style={styles.inputIcon} />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Description <Text style={styles.required}>*</Text></Text>
                <Text style={[
                  styles.wordCount, 
                  descriptionWordCount > 25 ? styles.wordCountExceeded : null
                ]}>
                  {descriptionWordCount}/25 words
                </Text>
              </View>
              <View style={[styles.inputWrapper, styles.textareaWrapper]}>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  multiline
                  numberOfLines={6}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Describe your business or service"
                  placeholderTextColor="#aaa"
                  textAlignVertical="top"
                />
              </View>
            </View>







  <View style={styles.inputGroup1}>
            <Text style={styles.label1}>Poster Image</Text>
            <View style={styles.imageUploadContainer}>
              {posterImage?.uri ? (
                <View style={styles.imagePreviewContainer}>
                  <Image 
                    source={{ uri: posterImage.uri }} 
                    style={styles.imagePreview}
                    resizeMode="cover"
                  />
                  <TouchableOpacity 
                    style={styles.changeImageButton}
                    onPress={selectPosterImage}
                  >
                    <Text style={styles.changeImageText}>Change Image</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity 
                  style={styles.imagePickerButton1} 
                  onPress={selectPosterImage}
                  activeOpacity={0.8}
                >
                  <View style={styles.buttonContent}>
                    <FontAwesome name="image" size={20} color="#2e3192" />
                    <Text style={styles.imagePickerText1}>Select Post Image</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
            {posterImage?.name && (
              <Text style={styles.fileNameText} numberOfLines={1}>
                Selected: {posterImage.name}
              </Text>
            )}
          </View>







            <View style={styles.inputGroup}>
              <Text style={styles.label}>Business Address <Text style={styles.required}>*</Text></Text>
              <View style={[styles.inputWrapper, styles.textareaWrapper]}>
                <TextInput
                  style={[styles.textInput, styles.addressArea]}
                  multiline
                  numberOfLines={3}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Enter your business address"
                  placeholderTextColor="#aaa"
                  textAlignVertical="top"
                />
                <FontAwesome name="map-marker" size={16} color="#2e3192" style={[styles.inputIcon, {alignSelf: 'flex-start', marginTop: 12}]} />
              </View>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <FontAwesome name="check-circle" size={18} color="#fff" />
                  <Text style={styles.saveButtonText}>Save Profile</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <FontAwesome name="times-circle" size={18} color="#2e3192" />
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <FontAwesome 
                name={modalMessage.includes('success') ? "check-circle" : "info-circle"} 
                size={40} 
                color={modalMessage.includes('success') ? "#4CAF50" : "#2e3192"} 
                style={styles.modalIcon}
              />
            </View>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity
              style={[
                styles.modalButton,
                {backgroundColor: modalMessage.includes('success') ? "#4CAF50" : "#2e3192"}
              ]}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9ff',
  },
  loadingText: {
    marginTop: 10,
    color: '#2e3192',
    fontSize: 16,
  },
  formSection: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },



  imagePickerButton: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#C23A8A',
  padding: 10,
  borderRadius: 5,
  marginTop: 10,
},

imagePickerText: {
  color: '#fff',
  fontSize: 16,
},

  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: 'red',
  },
  wordCount: {
    fontSize: 12,
    color: '#666',
  },
  wordCountExceeded: {
    color: 'red',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputReadOnly: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    height: 50,
  },
  textareaWrapper: {
    height: 'auto',
    alignItems: 'flex-start',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 10,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  addressArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  inputIcon: {
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'column',
    padding: 20,
    paddingBottom: 40,
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#2e3192',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: '#2e3192',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  cancelButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2e3192',
    backgroundColor: '#fff',
  },
  cancelButtonText: {
    color: '#2e3192',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 24,
    alignItems: 'center',
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    marginBottom: 20,
  },
  modalIcon: {
    alignSelf: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalButton: {
    backgroundColor: '#2e3192',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    minWidth: 120,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
    inputGroup1: {
    marginBottom: 24,
  },
  


    inputGroup1: {
    marginBottom: 25,
  },
  label1: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  imageUploadContainer: {
    marginTop: 5,
  },
  imagePickerButton1: {
    borderWidth: 1,
    borderColor: '#2e3192',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  imagePickerText1: {
    color: '#2e3192',
    fontSize: 16,
    fontWeight: '500',
  },
  imagePreviewContainer: {
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  changeImageButton: {
    padding: 10,
    backgroundColor: '#2e3192',
    borderRadius: 6,
  },
  changeImageText: {
    color: '#fff',
    fontWeight: '500',
  },
  fileNameText: {
    marginTop: 5,
    fontSize: 14,
    color: 'green',

  },
    inputGroup2: {
    marginBottom: 20,
  },
  label2: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },

  dropdown: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  placeholderStyle: {
    color: '#999',
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#333',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  item1: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  itemText1: {
    fontSize: 16,
    color: '#333',
  },
  textInput1: {
    height: 0, // Hide if not editable, or change height if needed
    opacity: 0,
  },
  inputIcon1: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
});

export default EditProfile;