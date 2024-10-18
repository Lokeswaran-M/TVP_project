import React, { useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { API_BASE_URL } from '../constants/Config';
import sunmoon from '../../assets/images/sunandmoon-icon.png';
import styles from '../components/layout/ProfileStyles';
import Stars from '../screens/Stars';
const Profile = () => {
  const route = useRoute();
  const { categoryID, Profession } = route.params;
  console.log("CategoryId in Profile Screen:", categoryID);
  console.log("Profession in Profile Screen:", Profession);
  const profession = categoryID === 2 ? route.params?.profession : route.params?.Profession; 
  console.log('Received Profession:', profession);
  const [profileData, setProfileData] = useState({});
  console.log('Profile data in PROFILE SCREEN------------------',profileData);
  const [multiProfile, setMultiProfile] = useState({});
  const [overallAverage, setOverallAverage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState(require('../../assets/images/DefaultProfile.jpg'));
  const userId = useSelector((state) => state.user?.userId);
  const navigation = useNavigation();
  const fetchProfileImage = async () => {
    const response = await fetch(`${API_BASE_URL}/profile-image?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    const uniqueImageUrl = `${data.imageUrl}?t=${new Date().getTime()}`;
    setImageUrl(uniqueImageUrl);
  };
  const fetchProfileData = async () => {
    setLoading(true);
    try {
        let response;
        const url = categoryID === 2 
            ? `${API_BASE_URL}/api/user/info_with_star_rating2/${userId}/profession/${profession}` 
            : `${API_BASE_URL}/api/info_with_star_rating/${userId}`;
        console.log('Fetching URL:', url);
        response = await fetch(url);
        if (!response.ok) {
            const textResponse = await response.text();
            console.error('Error response text:', textResponse);
            throw new Error('Failed to fetch profile data');
        }
        const data = await response.json();
        if (categoryID === 2) {
            setMultiProfile(data || {});
            console.log("Data%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%", data);
            if (data.ratings && Array.isArray(data.ratings) && data.ratings.length > 0) {
              const totalAverage = data.ratings.reduce((sum, rating) => sum + parseFloat(rating.average), 0);
              const overallAverage = totalAverage / data.ratings.length;
              setOverallAverage(overallAverage.toFixed(1));
              console.log("Total Average----------------------------------", totalAverage);
              console.log("Overall Average---------------------------------", overallAverage);
          } else {
              console.log("No ratings available.");
          }
        } else {
            setProfileData(data);
            if (data.ratings && Array.isArray(data.ratings) && data.ratings.length > 0) {
                const totalAverage = data.ratings.reduce((sum, rating) => sum + parseFloat(rating.average), 0);
                const overallAverage = totalAverage / data.ratings.length;
                setOverallAverage(overallAverage.toFixed(1));
                console.log("Total Average----------------------------------", totalAverage);
                console.log("Overall Average---------------------------------", overallAverage);
            } else {
                console.log("No ratings available.");
            }
        }
    } catch (error) {
        console.error('Error fetching profile data:', error.message);
    } finally {
        setLoading(false);
    }
};
  useFocusEffect(
    useCallback(() => {
      fetchProfileImage();
      fetchProfileData();
    }, [userId, categoryID, profession])
  );
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.topSection}>
          {loading ? (
            <ActivityIndicator size="large" color="#C23A8A" />
          ) : (
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: imageUrl }}
                style={styles.image}
              />
              <View style={styles.editIconWrapper}>
                <Image 
                  source={sunmoon} 
                  style={{ width: 25, height: 25 }} 
                />
              </View>
            </View>
          )}
          <Text style={styles.userId}>User ID: {userId} </Text>
          <Stars averageRating={overallAverage} />
            <Text style={styles.RatingValue}>
             {overallAverage} out of 5
      </Text>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="#C23A8A" />
        ) : (
          <View style={styles.detailsSection}>
            {categoryID === 2 ? (
              <>
            <Text style={styles.label}>Name</Text>
<View style={styles.nameRow}>
  <Text style={styles.info}>{multiProfile?.businessInfo?.Username || 'None'}</Text>
  <TouchableOpacity 
    style={styles.editButton} 
    onPress={() => navigation.navigate('EditProfile', { profession: multiProfile?.businessInfo?.Profession })}
  >
    <FontAwesome name="edit" size={15} color="#C23A8A" />
    <Text style={styles.editText}>Edit Profile</Text>
  </TouchableOpacity>
</View>
<Text style={styles.label}>Profession</Text>
<Text style={styles.info}>{multiProfile?.businessInfo?.Profession || 'None'}</Text>
<Text style={styles.label}>Business Name</Text>
<Text style={styles.info}>{multiProfile?.businessInfo?.BusinessName || 'None'}</Text>
<Text style={styles.label}>Description</Text>
<Text style={styles.description}>{multiProfile?.businessInfo?.Description || 'None'}</Text>
<Text style={styles.label}>Business Address</Text>
<Text style={styles.info}>{multiProfile?.businessInfo?.Address || 'None'}</Text>
            </>
            ) : (
              <>
              <Text style={styles.label}>Name</Text>
            <View style={styles.nameRow}>
              <Text style={styles.info}>{profileData?.businessInfo?.Username || 'None'}</Text>
              <TouchableOpacity 
                style={styles.editButton} 
                onPress={() => navigation.navigate('EditProfile', { profession: profileData?.businessInfo?.Profession })}
              >
                <FontAwesome name="edit" size={15} color="#C23A8A" />
                <Text style={styles.editText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>Profession</Text>
            <Text style={styles.info}>{profileData?.businessInfo?.Profession || 'None'}</Text>
            <Text style={styles.label}>Business Name</Text>
            <Text style={styles.info}>{profileData?.businessInfo?.BusinessName || 'None'}</Text>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.description}>{profileData?.businessInfo?.Description || 'None'}</Text>
            <Text style={styles.label}>Business Address</Text>
            <Text style={styles.info}>{profileData?.businessInfo?.Address || 'None'}</Text>
            </>
            )}
            {categoryID === 2 ? (
              <>
            <View style={styles.performanceSection}>
  <Text style={styles.performanceTitle}>Your Performance Score:</Text>
  {multiProfile?.ratings?.length > 0 && multiProfile.ratings.map((rating, index) => (
    <View key={index} style={styles.performanceRow}>
      <Text style={styles.performanceLabel}>{rating.RatingName.trim()}</Text>
      <View style={styles.stars}>
  <Stars averageRating={parseFloat(rating.average)} />
</View>
    </View>
  ))}
</View>
</>
) : (
  <>
<View style={styles.performanceSection}>
  <Text style={styles.performanceTitle}>Your Performance Score:</Text>
  {profileData?.ratings?.length > 0 && profileData.ratings.map((rating, index) => (
    <View key={index} style={styles.performanceRow}>
      <Text style={styles.performanceLabel}>{rating.RatingName.trim()}</Text>
      <View style={styles.stars}>
  <Stars averageRating={parseFloat(rating.average)} />
</View>
    </View>
  ))}
</View>
</>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};
export default Profile;