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
  console.log("Data in the Members details--------------------------",userId,Profession);
  const AdminUserID = useSelector((state) => state.user?.userId);
  const [businessInfoo, setBusinessInfoo] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [overallAverage, setOverallAverage] = useState(0);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [RollID, setRollID] = useState(null);
  const [RollIDMem, setRollIDMem] = useState(null);
  const [refreshToggle, setRefreshToggle] = useState(false);

  useEffect(() => {
    const fetchBusinessInfo = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/user/Admin-info/${AdminUserID}`);
        if (!response.ok) throw new Error('Failed to fetch business info');
        const data = await response.json();
        console.log("Data in business info------------------------",data);
        setRollID(data.RollId);
        setBusinessInfoo(data);
      } catch (error) {
        console.error('Error fetching business info:', error);
        Alert.alert('Error', 'Unable to fetch business info. Please try again.');
      }
    };
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/user/info_with_star_rating2/${userId}/profession/${Profession}`);
        if (!response.ok) throw new Error('Failed to fetch user details');
        const data = await response.json();
        console.log("Data in member details----------------------",data);
        setRollIDMem(data.businessInfo?.RollId || null);
        setUserDetails(data);
        if (data.ratings?.length > 0) {
          const totalAverage = data.ratings.reduce((sum, rating) => sum + parseFloat(rating.average), 0);
          setOverallAverage((totalAverage / data.ratings.length).toFixed(1));
        } else {
          setOverallAverage(0);
        }
        const profileImageResponse = await fetch(
          `${API_BASE_URL}/profile-image?userId=${userId}`
        );
        if (!profileImageResponse.ok) throw new Error('Failed to fetch profile image');
        const imageData = await profileImageResponse.json();
        setProfileImageUrl(imageData.imageUrl);
      } catch (error) {
        console.error('Error fetching user details or profile image:', error);
        Alert.alert('Error', 'Unable to fetch user details or profile image. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    if (AdminUserID) {
      fetchBusinessInfo();
      fetchUserDetails();
    }
  }, [AdminUserID, userId, Profession, refreshToggle]); 

  const handlePromotion = async () => {
    let newRollId = 2;
    try {
      const response = await fetch(`${API_BASE_URL}/api/tbluser/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ RollId: newRollId }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', data.message);
        setRollID(newRollId);
        setRefreshToggle(!refreshToggle);
      } else {
        Alert.alert('Error', data.error || 'Failed to update RollId');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error, please try again');
    }
  };  
  
  const handleDemotion = async () => {
    let newRollId = 3;
    try {
      const response = await fetch(`${API_BASE_URL}/api/tbluser/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ RollId: newRollId }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', data.message);
        setRollID(newRollId);
        setRefreshToggle(!refreshToggle);
      } else {
        Alert.alert('Error', data.error || 'Failed to update RollId');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error, please try again');
    }
  };

  const handleCall = () => {
    if (userDetails && userDetails.businessInfo.Mobileno) {
      Linking.openURL(`tel:${userDetails.businessInfo.Mobileno}`);
    }
  };

  const handleWhatsApp = () => {
    if (userDetails && userDetails.businessInfo.Mobileno) {
      const phoneNumber = userDetails.businessInfo.Mobileno;
      const countryCode = "+91";
      Linking.openURL(`whatsapp://send?phone=${countryCode}${phoneNumber}`);
    }
  };

  if (loading) return <Text>Loading...</Text>;
  if (!userDetails) return <Text>No user details found.</Text>;

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
          <Text style={styles.label}>User ID</Text>
          <Text style={styles.value}>{businessInfo.UserId}</Text>
        </View>
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
       {RollID === 1 && RollIDMem && (
        <View>
          {RollIDMem == 3 ? (
            <TouchableOpacity style={styles.promoteButton} onPress={handlePromotion}>
              <Icon name="paper-plane" size={20} color="#fff" />
              <Text style={styles.promoteButtonText}>Promote to Admin</Text>
            </TouchableOpacity>
          ) : RollIDMem == 2 ? (
            <TouchableOpacity style={styles.promoteButton} onPress={handleDemotion}>
              <Icon name="arrow-down" size={20} color="#fff" />
              <Text style={styles.promoteButtonText}>Demote to User</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      )}
      </View>
    </ScrollView>
  );
};
export default MemberDetails;