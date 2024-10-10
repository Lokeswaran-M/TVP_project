import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useRoute } from '@react-navigation/native';
import styles from '../components/layout/MemberDetailsStyle';
import { API_BASE_URL } from '../constants/Config';
const MemberDetails = () => {
  const route = useRoute();
  const { userId } = route.params;
  console.log("USERID in MEMBER DETAILS-----------------------------",userId);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [overallAverage, setOverallAverage] = useState(0);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/info_with_star_rating/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }
        const data = await response.json();
        console.log("MEMBERS DETAIL DATA IN MEMBER DETAILS PAGE:", data);
        setUserDetails(data);
        if (data.ratings && Array.isArray(data.ratings) && data.ratings.length > 0) {
          const totalAverage = data.ratings.reduce((sum, rating) => sum + parseFloat(rating.average), 0);
          const overallAverage = totalAverage / data.ratings.length;
          setOverallAverage(overallAverage.toFixed(1));
          console.log("Total Average----------------------------------", totalAverage);
          console.log("Overall Average---------------------------------", overallAverage);
        } else {
          console.log("No ratings available.");
      }
      } catch (error) {
        console.error('Error fetching user details:', error);
        Alert.alert('Error', 'Unable to fetch user details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, [userId]);
  const renderStars = (averageRating) => {
  const filledStars = Math.floor(averageRating);
  const hasHalfStar = averageRating % 1 >= 0.3 && averageRating % 1 < 0.8;
  const totalStars = 5;
  const stars = Array(filledStars).fill(0).map((_, index) => (
    <Icon key={index} name="star" size={25} color="#FFD700" style={styles.starIcon} />
  ));
  if (hasHalfStar) {
    stars.push(<Icon key="half" name="star-half-full" size={25} color="#FFD700" style={styles.starIcon} />);
  }
  const unfilledStars = Array(totalStars - filledStars - (hasHalfStar ? 1 : 0)).fill(0).map((_, index) => (
    <Icon key={filledStars + index + (hasHalfStar ? 1 : 0)} name="star-o" size={25} color="#FFD700" style={styles.starIcon} />
  ));
  return [...stars, ...unfilledStars];
};

  const handleCall = () => {
    if (userDetails && userDetails.businessInfo.Mobileno) {
      Linking.openURL(`tel:${userDetails.businessInfo.Mobileno}`);
    }
  };
  const handleWhatsApp = () => {
    if (userDetails && userDetails.businessInfo.Mobileno) {
      Linking.openURL(`whatsapp://send?phone=${userDetails.businessInfo.Mobileno}`);
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
            <Text style={styles.profilePicText}>{businessInfo.Username.charAt(0)} </Text>
          </View>
          <View style={styles.userInfotop}>
            <Text style={styles.labeltop1}>{businessInfo.Username}</Text>
            <Text style={styles.valuetop}>{renderStars(overallAverage || 0)}  {overallAverage} out of 5 {'\n'}</Text>
          </View>
        </View>
      </View>
      <View style={styles.card}>
        {/* <View style={styles.infoContainer}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{businessInfo.Username}</Text>
        </View> */}
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Profession:</Text>
          <Text style={styles.value}>{businessInfo.Profession}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Business Name:</Text>
          <Text style={styles.value}>{businessInfo.BusinessName}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.value}>{businessInfo.Description}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Business Address:</Text>
          <Text style={styles.value}>{businessInfo.Address}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Performance Ratings:</Text>
          {ratings.map((rating) => (
            <View key={rating.RatingId} style={styles.ratingRow}>
              <Text style={styles.ratingName}>{rating.RatingName}</Text>
              <View style={styles.starsContainer}>
                {renderStars(rating.average)}
              </View>
            </View>
          ))}
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
      </View>
    </ScrollView>
  );
};
export default MemberDetails;