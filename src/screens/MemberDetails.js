import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Linking, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useRoute } from '@react-navigation/native';
import Stars from '../screens/Stars';
import styles from '../components/layout/MemberDetailsStyle';
import { API_BASE_URL } from '../constants/Config';
import { useSelector } from 'react-redux';

const MemberDetails = () => {
  const route = useRoute();
  const { userId, Profession } = route.params;
  const UserID = useSelector((state) => state.user?.userId);
  const [businessInfoo, setBusinessInfoo] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [overallAverage, setOverallAverage] = useState(0);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [isPromoted, setIsPromoted] = useState(false);
  const [RollID, setRollID] = useState(null);

  useEffect(() => {
    const fetchBusinessInfo = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/user/Member-info/${UserID}`);
        if (!response.ok) {
          throw new Error('Failed to fetch business info');
        }
        const data = await response.json();
        setRollID(data.RollId);
        setBusinessInfoo(data);
        setIsPromoted(data.RollId === 2); // Assuming RollID 2 means "Admin"
      } catch (error) {
        console.error('Error fetching business info:', error);
        Alert.alert('Error', 'Unable to fetch business info. Please try again.');
      }
    };

    if (UserID) {
      fetchBusinessInfo();
    }

    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/user/info_with_star_rating2/${userId}/profession/${Profession}`);
        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Error:', errorData);
          throw new Error('Failed to fetch user details');
        }
        const data = await response.json();
        setUserDetails(data);
        if (data.ratings && Array.isArray(data.ratings) && data.ratings.length > 0) {
          const totalAverage = data.ratings.reduce((sum, rating) => sum + parseFloat(rating.average), 0);
          const overallAverage = totalAverage / data.ratings.length;
          setOverallAverage(overallAverage.toFixed(1));
        } else {
          setOverallAverage(0);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        Alert.alert('Error', 'Unable to fetch user details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [UserID, userId, Profession]);

  const handleCall = () => {
    if (userDetails && userDetails.businessInfo.Mobileno) {
      Linking.openURL(`tel:${userDetails.businessInfo.Mobileno}`);
    }
  };

  const handlePromotion = async () => {
    const newRollId = 2; // Set RollId to 2 for promotion
    console.log(`Attempting to promote user with RollId: ${newRollId}`);

    try {
      const response = await fetch(`${API_BASE_URL}/api/tbluser/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ RollId: newRollId }),
      });
      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', data.message);
        setRollID(newRollId); // Update local RollID state
        setIsPromoted(true); // Update the promotion state
        console.log('User has been promoted to Admin.');
      } else {
        console.error('Failed to update RollId:', data.error);
        Alert.alert('Error', data.error || 'Failed to update RollId');
      }
    } catch (error) {
      console.error('Network error:', error);
      Alert.alert('Error', 'Network error, please try again');
    }
  };

  const handleDemotion = async () => {
    const newRollId = 3; // Set RollId to 3 for demotion
    console.log(`Attempting to demote user with RollId: ${newRollId}`);

    try {
      const response = await fetch(`${API_BASE_URL}/api/tbluser/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ RollId: newRollId }),
      });
      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', data.message);
        setRollID(newRollId); // Update local RollID state
        setIsPromoted(false); // Update the promotion state
        console.log('User has been demoted to User.');
      } else {
        console.error('Failed to update RollId:', data.error);
        Alert.alert('Error', data.error || 'Failed to update RollId');
      }
    } catch (error) {
      console.error('Network error:', error);
      Alert.alert('Error', 'Network error, please try again');
    }
  };

  const handleWhatsApp = () => {
    if (userDetails && userDetails.businessInfo.Mobileno) {
      const phoneNumber = userDetails.businessInfo.Mobileno;
      const countryCode = "+91";
      const formattedPhoneNumber = `${countryCode}${phoneNumber}`;
      Linking.openURL(`whatsapp://send?phone=${formattedPhoneNumber}`);
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }
  if (!userDetails) {
    return <Text>No user details found.</Text>;
  }

  const { businessInfo, ratings } = userDetails;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <View style={styles.profileContainer}>
          <View style={styles.profilePic}>
            {profileImageUrl ? (
              <Image
                source={{ uri: profileImageUrl }}
                style={styles.profileImage}
              />
            ) : (
              <Text style={styles.profilePicText}>{businessInfo.Username.charAt(0)}</Text>
            )}
          </View>
          <View style={styles.userInfotop}>
            <Text style={styles.labeltop1}>{businessInfo.Username}</Text>
            <Text style={styles.valuetop}>
              <Stars averageRating={overallAverage} />
              <Text style={styles.valuetop}>{overallAverage} out of 5</Text>
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.card}>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Profession:</Text>
          <Text style={styles.value}>{businessInfo.Profession}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Business Name:</Text>
          <Text style={styles.value}>{businessInfo.BusinessName}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Business Address:</Text>
          <Text style={styles.value}>{businessInfo.Address}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Email ID:</Text>
          <Text style={styles.value}>{businessInfo.Email}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Mobile Number:</Text>
          <Text style={styles.value}>{businessInfo.Mobileno}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.value}>{businessInfo.Description}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Performance Ratings:</Text>
          {ratings.length > 0 ? ratings.map((rating) => (
            <View key={rating.RatingId} style={styles.ratingRow}>
              <Text style={styles.ratingName}>{rating.RatingName}</Text>
              <View style={styles.starsContainer}>
                <Stars averageRating={rating.average} />
              </View>
            </View>
          )) : (
            <Text>No ratings available</Text>
          )}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleCall}>
            <View style={styles.buttonIcon}>
              <MaterialIcons name="call" size={20} color="#fff" />
            </View>
            <Text style={styles.buttonText}>Voice call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleWhatsApp}>
            <View style={styles.buttonIcon}>
              <Icon name="whatsapp" size={20} color="#fff" />
            </View>
            <Text style={styles.buttonText}>WhatsApp</Text>
          </TouchableOpacity>
        </View>

        {/* Show separate promote and demote buttons based on RollID */}
        {RollID === 1 && (
          <View>
            {/* Promote Button */}
            {!isPromoted && (
              <TouchableOpacity
                style={styles.promoteButton}
                onPress={handlePromotion}
              >
                <Icon name="paper-plane" size={20} color="#fff" />
                <Text style={styles.promoteButtonText}>
                  Promote to Admin
                </Text>
              </TouchableOpacity>
            )}

            {/* Demote Button */}
            {isPromoted && (
              <TouchableOpacity
                style={styles.demoteButton}
                onPress={handleDemotion}
              >
                <Icon name="arrow-down" size={20} color="#fff" />
                <Text style={styles.demoteButtonText}>
                  Demote to User
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

      </View>
    </ScrollView>
  );
};

export default MemberDetails;
