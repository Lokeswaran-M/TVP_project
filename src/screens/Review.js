
import React, { useEffect, useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '../constants/Config';
import { Picker } from '@react-native-picker/picker';
import { MaskedTextInput } from 'react-native-mask-text';
import { CommonActions } from '@react-navigation/native';
const Review = ({ route }) => {
  const userId = useSelector((state) => state.UserId);
  const { businessName, locationId } = route.params;
  const [rating, setRating] = useState(0);
  const [selectedMember, setSelectedMember] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const navigation = useNavigation();
  const [businessInfo, setBusinessInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState('');
  const [members, setMembers] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [errors, setErrors] = useState({});
  const [amount, setAmount] = useState('');
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
  const [modalMessage, setModalMessage] = useState(''); // Modal message state

  const formatAmount = (value) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleChange = (text) => {
    const formattedValue = formatAmount(text);
    setAmount(formattedValue);
  };

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
        console.error('Failed to fetch business info:', error);
      } finally {
        setLoading(false);
      }
    };
    const fetchMembers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/list-members`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ LocationID: locationId, userId }),
        });
        if (!response.ok) {
          throw new Error('Failed to fetch members');
        }
        const data = await response.json();
        console.log("Member List for the Reviews--------------------------",data);
        setMembers(data.members);
      } catch (error) {
        console.error('Failed to fetch members:', error);
      }
    };
    const fetchRatings = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/reviewRatings`);
        if (!response.ok) {
          throw new Error('Failed to fetch ratings');
        }
        const data = await response.json();
        console.log("Rating List for the Reviews--------------------------",data);
        setRatings(data);
      } catch (error) {
        console.error('Failed to fetch ratings:', error);
      }
    };
    if (userId) {
      fetchBusinessInfo();
      fetchMembers();
      fetchRatings();
    }
  }, [userId]);

  const validateForm = () => {
    const newErrors = {};
    if (!selectedMember) newErrors.selectedMember = 'Please choose a member.';
    if (!selectedRating) newErrors.selectedRating = 'Please select a rating type.';
    console.log("Validation----------------",selectedRating)
    if (selectedRating === 9 || selectedRating === 10 ) {
      if (!amount) {
        newErrors.amount = 'Please enter an amount.';
      }
      console.log("Amount--------------------------",amount);
    }
    if (!review.trim()) newErrors.review = 'Please enter a comment.';
    if (rating === 0) newErrors.rating = 'Please select a rating.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };    

  const submitReview = async () => {
    if (!validateForm()) return;
    const formattedAmount = amount.replace(/,/g, '');
    try {
      const response = await fetch(`${API_BASE_URL}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          UserId: userId,
          LocationID: locationId,
          RatingId: selectedRating,
          Description: review,
          Member: selectedMember || null,
          Stars: rating,
          Profession: businessName,
          Amount: formattedAmount,
        }),
      });
      if (response.ok) {
        setModalMessage('Review created successfully!');
        setModalVisible(true);
 
      } else {
        setModalMessage('Failed to create review');
        setModalVisible(true);
      }
    } catch (error) {
      setModalMessage('Failed to submit review');
      setModalVisible(true);
    }
  };

  const handleRating = (rate) => {
    setRating(rate);
    setErrors((prevErrors) => ({ ...prevErrors, rating: '' }));
  };
  const handleModalClose = () => {
    setModalVisible(false);
    navigation.navigate('Dashboard')
  };
  return (
    <View style={styles.container}>
      {/* Modal for success or error message */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
         <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleModalClose}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Text style={styles.title}>Write A Review </Text>
      <View style={styles.container1}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedRating}
            style={styles.picker}
            onValueChange={(itemValue) => {
              if (itemValue === "Receiving Business") {
                setSelectedRating(8);
              } else if (itemValue === "Successful Collaboration") {
                setSelectedRating(9);
              } else if (itemValue === "Business Offer") {
                setSelectedRating(10);
              } else {
                setSelectedRating(itemValue);
              }
              setErrors((prevErrors) => ({ ...prevErrors, selectedRating: '' }));
            }}
          >
            <Picker.Item label="Choose Rating Type" value="" />
            {ratings.map((rating) => (
              <Picker.Item key={rating.Id} label={rating.RatingName} value={rating.Id} />
            ))}
          </Picker>
        </View>
        {errors.selectedRating && <Text style={styles.errorText}>{errors.selectedRating}</Text>}

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedMember}
            style={styles.picker}
            onValueChange={(itemValue) => {
              setSelectedMember(itemValue);
              setErrors((prevErrors) => ({ ...prevErrors, selectedMember: '' }));
            }}
          >
            <Picker.Item label="Choose Member" value="" />
            {members.map((member) => (
              <Picker.Item key={member.UserId} label={member.UserProfession} value={member.UserId} />
            ))}
          </Picker>
        </View>
        {errors.selectedMember && <Text style={styles.errorText}>{errors.selectedMember}</Text>}

        {(selectedRating === 9 || selectedRating === 10) && (
          <View>
            <TextInput
              style={styles.textInput1}
              value={amount}
              placeholder="₹ Enter the amount"
              placeholderTextColor="#000"
              keyboardType="numeric"
              onChangeText={handleChange}
            />
            {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
          </View>
        )}

        <Text style={styles.label}>Comment</Text>
        <TextInput
          style={styles.textInput}
          multiline
          numberOfLines={4}
          value={review}
          placeholder="Write your comment here"
          placeholderTextColor="#000"
          onChangeText={(text) => {
            setReview(text);
            setErrors((prevErrors) => ({ ...prevErrors, review: '' }));
          }}
        />
        {errors.review && <Text style={styles.errorText}>{errors.review}</Text>}

        <Text style={styles.label}>Give a rating</Text>
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((item) => (
            <TouchableOpacity key={item} onPress={() => handleRating(item)}>
              <Icon
                name={item <= rating ? 'star' : 'star-o'}
                size={30}
                color="#FFD700"
                style={styles.star}
              />
            </TouchableOpacity>
          ))}
        </View>
        {errors.rating && <Text style={styles.errorText}>{errors.rating}</Text>}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={submitReview}>
          <Icon name="check" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  container1: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: 'white',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  pickerContainer: {
    borderColor: '#2e3192',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#000',
  },
  title: {
    fontSize: 20,
    color: '#2e3192',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2e3192',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
  },
  label: {
    fontSize: 20,
    color: '#2e3192',
    marginBottom: 10,
  },
  textInput1: {
    borderColor: '#2e3192',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    color: '#000',
  },
  textInput: {
    height: 100,
    borderColor: '#2e3192',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 20,
    textAlignVertical: 'top',
    color: '#000',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  star: {
    marginHorizontal: 5,
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
  backButton: {
    backgroundColor: '#2e3192',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    color: '#2e3192',
 marginVertical:20,
    fontWeight:'700'
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight:'700'

  },
  modalButton: {
    backgroundColor: '#2e3192',
    padding: 10,
    borderRadius: 5,
  },
});
export default Review;