import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Linking, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useRoute } from '@react-navigation/native';
import Stars from '../screens/Stars';
import styles from '../components/layout/MemberDetailsStyle';
import { API_BASE_URL } from '../constants/Config';

const MemberDetails = () => {
  const route = useRoute();
  const { userId, Profession } = route.params; // Get Profession from route params
  console.log("USERID IN MEMBERS DETAILS------------------------------", userId);
  console.log("PROFESSION IN MEMBERS DETAILS--------------------------", Profession);
  
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [overallAverage, setOverallAverage] = useState(0);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [isPromoted, setIsPromoted] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Update API call to include userId and Profession
        const response = await fetch(`${API_BASE_URL}/api/user/info_with_star_rating2/${userId}/profession/${Profession}`);
        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Error:', errorData);
          throw new Error('Failed to fetch user details');
        }
        const data = await response.json();
        console.log("DATA in MEMBERSDETAILS----------------------------------------", data);
        console.log("RollId:---------------------------------------", data.businessInfo.RollId);

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
  }, [userId, Profession]); // Add Profession to dependency array

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/profile-image?userId=${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch profile image');
        }
        const data = await response.json();
        const uniqueImageUrl = `${data.imageUrl}?t=${new Date().getTime()}`;
        setProfileImageUrl(uniqueImageUrl);
      } catch (error) {
        console.error('Error fetching profile image:', error);
        setProfileImageUrl(null);
      }
    };
    
    fetchProfileImage();
  }, [userId]);

  const handleCall = () => {
    if (userDetails && userDetails.businessInfo.Mobileno) {
      Linking.openURL(`tel:${userDetails.businessInfo.Mobileno}`);
    }
  };
  
  const handlePromotionToggle = () => {
    setIsPromoted(!isPromoted);
    // Alert.alert(isPromoted ? 'Demoted' : 'Promoted', `User has been ${isPromoted ? 'demoted' : 'promoted'} to admin.`);
  };

const handleWhatsApp = () => {
  if (userDetails && userDetails.businessInfo.Mobileno) {
    const phoneNumber = userDetails.businessInfo.Mobileno;
    const countryCode = "+91";
    const formattedPhoneNumber = `${countryCode}${phoneNumber}`;
    Linking.openURL(`whatsapp://send?phone=${formattedPhoneNumber}`);
  }
};
//  const handleWhatsApp = () => {
//     if (userDetails && userDetails.businessInfo.Mobileno) {
//       Linking.openURL(whatsapp://send?phone=${userDetails.businessInfo.Mobileno});
//     }
//   };

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
          <Text style={styles.label}>Email ID</Text>
          <Text style={styles.value}>{businessInfo.Email}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Mobile Number</Text>
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
        {businessInfo.RollId === 1 && (
          <View>
            <TouchableOpacity
              style={styles.promoteButton}
              onPress={handlePromotionToggle}
            >
              <Icon name="paper-plane" size={20} color="#fff" />
              <Text style={styles.promoteButtonText}>
                {isPromoted ? 'Demote to User' : 'Promote to Admin'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default MemberDetails;