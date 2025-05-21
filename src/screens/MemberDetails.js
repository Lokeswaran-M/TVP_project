import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  Image,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  RefreshControl
} from 'react-native';
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
  const AdminUserID = useSelector((state) => state.UserId);
  
  const [businessInfo, setBusinessInfo] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [overallAverage, setOverallAverage] = useState(0);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [adminRollID, setAdminRollID] = useState(null);
  const [memberRollID, setMemberRollID] = useState(null);
  const [refreshToggle, setRefreshToggle] = useState(false);
 const refreshData = () => {
    setRefreshToggle(prev => !prev);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const adminResponse = await fetch(`${API_BASE_URL}/api/user/Admin-info/${AdminUserID}`);
        if (!adminResponse.ok) throw new Error('Failed to fetch admin info');
        const adminData = await adminResponse.json();
        setAdminRollID(adminData.RollId);
        setBusinessInfo(adminData);
        const userResponse = await fetch(
          `${API_BASE_URL}/api/user/info_with_star_rating2/${userId}/profession/${Profession}`
        );
        if (!userResponse.ok) throw new Error('Failed to fetch user details');
        const userData = await userResponse.json();
        setMemberRollID(userData.businessInfo?.RollId || null);
        setUserDetails(userData);
        if (userData.ratings?.length > 0) {
          const totalAverage = userData.ratings.reduce(
            (sum, rating) => sum + parseFloat(rating.average), 0
          );
          setOverallAverage((totalAverage / userData.ratings.length).toFixed(1));
        }
        const imageResponse = await fetch(`${API_BASE_URL}/profile-image?userId=${userId}`);
        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          setProfileImageUrl(imageData.imageUrl);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'Unable to load user data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (AdminUserID) {
      fetchData();
    }
  }, [AdminUserID, userId, Profession, refreshToggle]);

  const handleRoleChange = async (newRollId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tbluser/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ RollId: newRollId }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        Alert.alert('Success', data.message);
        setMemberRollID(newRollId);
        setRefreshToggle(!refreshToggle);
      } else {
        // Alert.alert('Error', data.error || 'Failed to update role');
      }
    } catch (error) {
      // Alert.alert('Error', 'Network error, please try again');
    }
  };

  const handleCall = () => {
    if (userDetails?.businessInfo?.Mobileno) {
      Linking.openURL(`tel:${userDetails.businessInfo.Mobileno}`);
    }
  };

  const handleWhatsApp = () => {
    if (userDetails?.businessInfo?.Mobileno) {
      const phoneNumber = userDetails.businessInfo.Mobileno;
      const countryCode = "+91";
      Linking.openURL(`whatsapp://send?phone=${countryCode}${phoneNumber}`);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2e3192" />
        <Text style={styles.loadingText}>Loading member details...</Text>
      </View>
    );
  }

  if (!userDetails) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={50} color="#ff6b6b" />
        <Text style={styles.errorText}>No user details found</Text>
      </View>
    );
  }
  const { businessInfo: memberInfo, ratings } = userDetails;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#2e3192" barStyle="light-content" />
         <ScrollView 
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refreshData}
            colors={['#2e3192']}
            tintColor="#2e3192"
          />
        }
      >
        <View style={styles.headerContainer}>
          <View style={styles.profileContainer}>
            {profileImageUrl ? (
              <Image source={{ uri: profileImageUrl }} style={styles.profileImage} />
            ) : (
              <View style={styles.profilePic}>
                <Text style={styles.profilePicText}>
                  {memberInfo.Username.charAt(0)}
                </Text>
              </View>
            )}
            
            <View style={styles.userInfoTop}>
              <Text style={styles.username}>{memberInfo.Username}</Text>
              <Text style={styles.profession}>{memberInfo.Profession}</Text>
              <View style={styles.ratingContainer}>
                <Stars averageRating={overallAverage} />
                <Text style={styles.ratingText}>{overallAverage} out of 5</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
            <View style={styles.buttonIcon}>
              <MaterialIcons name="call" size={20} color="#fff" />
            </View>
            <Text style={styles.buttonText}>Call</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleWhatsApp}>
            <View style={[styles.buttonIcon, styles.whatsappIcon]}>
              <Icon name="whatsapp" size={20} color="#fff" />
            </View>
            <Text style={styles.buttonText}>WhatsApp</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Business Details</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <MaterialIcons name="business" size={20} color="#2e3192" />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.label}>Business Name</Text>
              <Text style={styles.value}>{memberInfo.BusinessName || 'Not specified'}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <MaterialIcons name="location-on" size={20} color="#2e3192" />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.label}>Address</Text>
              <Text style={styles.value}>{memberInfo.Address || 'Not specified'}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <MaterialIcons name="email" size={20} color="#2e3192" />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{memberInfo.Email || 'Not specified'}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <MaterialIcons name="phone" size={20} color="#2e3192" />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.label}>Mobile</Text>
              <Text style={styles.value}>{memberInfo.Mobileno || 'Not specified'}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <MaterialIcons name="person" size={20} color="#2e3192" />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.label}>User ID</Text>
              <Text style={styles.value}>{memberInfo.UserId}</Text>
            </View>
          </View>
          
          {memberInfo.Description && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.label}>Description</Text>
              <Text style={styles.descriptionText}>{memberInfo.Description}</Text>
            </View>
          )}
        </View>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>TPV Score</Text>
          
          {ratings && ratings.length > 0 ? (
            ratings.map((rating) => (
              <View key={rating.RatingId} style={styles.ratingRow}>
                <Text style={styles.ratingName}>{rating.RatingName}</Text>
                <View style={styles.ratingStarsContainer}>
                  <Text style={styles.ratingValue}>{parseFloat(rating.average).toFixed(1)}</Text>
                  <Stars averageRating={rating.average} />
                </View>
              </View>
            ))
          ) : (
            <View style={styles.noRatingContainer}>
              <MaterialIcons name="star-border" size={40} color="#bdbdbd" />
              <Text style={styles.noRatingText}>No ratings available yet</Text>
            </View>
          )}
        </View>
        {adminRollID === 1 && memberRollID && (
          <View style={styles.adminActionsCard}>
            <Text style={styles.sectionTitle}>Admin Actions</Text>
            
            {memberRollID === 3 ? (
              <TouchableOpacity 
                style={[styles.roleButton, styles.promoteButton]} 
                onPress={() => handleRoleChange(2)}
              >
                <Icon name="arrow-up" size={18} color="#fff" />
                <Text style={styles.roleButtonText}>Promote to Admin</Text>
              </TouchableOpacity>
            ) : memberRollID === 2 ? (
              <TouchableOpacity 
                style={[styles.roleButton, styles.demoteButton]} 
                onPress={() => handleRoleChange(3)}
              >
                <Icon name="arrow-down" size={18} color="#fff" />
                <Text style={styles.roleButtonText}>Demote to User</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MemberDetails;