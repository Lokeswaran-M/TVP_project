import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  ActivityIndicator, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet
} from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { API_BASE_URL } from '../constants/Config';
import LinearGradient from 'react-native-linear-gradient';
const Stars = ({ averageRating }) => {
  const isNegative = averageRating < 0;
  const filledStars = Math.floor(Math.abs(averageRating));
  const decimalPart = Math.abs(averageRating) % 1;
  const hasHalfStar = decimalPart >= 0.3 && decimalPart < 0.8;
  const hasAdditionalFullStar = decimalPart >= 0.8;
  const totalStars = 5;

  const positiveStarColor = "#FFD700";
  const negativeStarColor = "#D3D3D3";
  const starColor = isNegative ? negativeStarColor : positiveStarColor;

  const stars = Array(filledStars).fill(0).map((_, index) => (
    <FontAwesome key={index} name="star" size={20} color={starColor} style={styles.starIcon} />
  ));
  
  if (hasHalfStar) {
    stars.push(
      <FontAwesome
        key="half"
        name="star-half-full"
        size={20}
        color={starColor}
        style={styles.starIcon}
      />
    );
  }

  if (hasAdditionalFullStar) {
    stars.push(
      <FontAwesome
        key="full"
        name="star"
        size={20}
        color={starColor}
        style={styles.starIcon}
      />
    );
  }

  const remainingStars = totalStars - stars.length;
  const unfilledStars = Array(remainingStars).fill(0).map((_, index) => (
    <FontAwesome
      key={filledStars + index + (hasHalfStar ? 1 : 0) + (hasAdditionalFullStar ? 1 : 0)}
      name="star-o"
      size={20}
      color={starColor}
      style={styles.starIcon}
    />
  ));

  return (
    <View style={styles.starContainer}>
      {stars}
      {unfilledStars}
    </View>
  );
};

const ProfileSection = ({ title, value, icon }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoIconContainer}>
      <FontAwesome name={icon} size={18} color="#2e3192" />
    </View>
    <View style={styles.infoTextContainer}>
      <Text style={styles.infoLabel}>{title}</Text>
      <Text style={styles.infoValue}>{value || 'None'}</Text>
    </View>
  </View>
);

const Profile = () => {
  const route = useRoute();
  const { categoryID, Profession } = route.params;
  const profession = categoryID === 2 ? route.params?.profession : route.params?.Profession; 
  const [profileData, setProfileData] = useState({});
  const [multiProfile, setMultiProfile] = useState({});
  const [overallAverage, setOverallAverage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState();
  const userId = useSelector((state) => state.UserId);
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
      
      response = await fetch(url);
      if (!response.ok) {
        const textResponse = await response.text();
        throw new Error('Failed to fetch profile data');
      }
      
      const data = await response.json();
      if (categoryID === 2) {
        setMultiProfile(data || {});
        console.log('MultiProfile:----------------------------', data);
        if (data.ratings && Array.isArray(data.ratings) && data.ratings.length > 0) {
          const totalAverage = data.ratings.reduce((sum, rating) => sum + parseFloat(rating.average || 0), 0);
          const overallAvg = totalAverage / data.ratings.length;
          setOverallAverage(overallAvg.toFixed(1));
        }
      } else {
        setProfileData(data);
        if (data.ratings && Array.isArray(data.ratings) && data.ratings.length > 0) {
          const totalAverage = data.ratings.reduce((sum, rating) => sum + parseFloat(rating.average || 0), 0);
          const overallAvg = totalAverage / data.ratings.length;
          setOverallAverage(overallAvg.toFixed(1));
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

  const businessInfo = categoryID === 2 ? multiProfile?.businessInfo : profileData?.businessInfo;
  const ratings = categoryID === 2 ? multiProfile?.ratings : profileData?.ratings;
  const defaultAvatar = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#2e3192" barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <LinearGradient colors={['#2e3192', '#4a4dc4']} style={styles.headerGradient}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <FontAwesome name="arrow-left" size={20} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate('EditProfile', { profession: businessInfo?.Profession })}
            >
              <FontAwesome name="edit" size={16} color="#ffffff" />
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2e3192" />
          </View>
        ) : (
          <>
            <View style={styles.profileHeader}>
              <View style={styles.imageContainer}>
                <View style={styles.imageWrapper}>
                  <Image
                    source={{ uri: imageUrl || defaultAvatar }}
                    style={styles.profileImage}
                    defaultSource={{ uri: defaultAvatar }}
                  />
                </View>
              </View>
              
              <Text style={styles.userName}>{businessInfo?.Username || 'User'}</Text>
              <Text style={styles.userProfession}>{businessInfo?.Profession || 'No profession added'}</Text>
              
              <View style={styles.ratingContainer}>
                <Stars averageRating={parseFloat(overallAverage) || 0} />
                <Text style={styles.ratingText}>
                  {overallAverage} out of 5
                </Text>
              </View>
              
              <View style={styles.userIdBadge}>
                <FontAwesome name="id-badge" size={14} color="#2e3192" />
                <Text style={styles.userIdText}>ID: {userId}</Text>
              </View>
            </View>

            <View style={styles.contentSection}>
              <Text style={styles.sectionTitle}>Business Information</Text>
              
              <View style={styles.infoContainer}>
                <ProfileSection 
                  title="Business Name" 
                  value={businessInfo?.BusinessName} 
                  icon="building" 
                />
                
                <ProfileSection 
                  title="Business Address" 
                  value={businessInfo?.Address} 
                  icon="map-marker" 
                />
                
                <ProfileSection 
                  title="Location" 
                  value={businessInfo?.LocationName} 
                  icon="location-arrow" 
                />
                
                <ProfileSection 
                  title="Email" 
                  value={businessInfo?.Email} 
                  icon="envelope" 
                />
                
                {!categoryID === 2 && (
                  <ProfileSection 
                    title="Mobile Number" 
                    value={businessInfo?.Mobileno} 
                    icon="phone" 
                  />
                )}
                
                {businessInfo?.Description && (
                  <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionTitle}>Description</Text>
                    <Text style={styles.descriptionContent}>
                      {businessInfo?.Description || 'No description available'}
                    </Text>
                  </View>
                )}
              </View>

              {ratings && ratings.length > 0 && (
                <View style={styles.performanceSection}>
                  <Text style={styles.sectionTitle}>TPV Score</Text>
                  
                  {ratings.map((rating, index) => (
                    <View key={index} style={styles.ratingRow}>
                      <Text style={styles.ratingLabel}>{rating.RatingName.trim()}</Text>
                      <View style={styles.ratingStars}>
                          <Text style={styles.ratingValue}>{parseFloat(rating.average).toFixed(1)}</Text>
                        <Stars averageRating={parseFloat(rating.average) || 0} />
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f8fc',
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerGradient: {
    paddingTop: 15,
    paddingBottom: 30,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 5,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  editText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: -60,
    paddingBottom: 20,
  },
  imageContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 15,
  },
  imageWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 6,
    borderColor: '#ffffff',
    overflow: 'hidden',
    backgroundColor: '#e1e5f5',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 70,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  userProfession: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  ratingContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
  userIdBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e1e5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  userIdText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#2e3192',
  },
  contentSection: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    margin: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e3192',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5f5',
    paddingBottom: 8,
  },
  infoContainer: {
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  infoIconContainer: {
    width: 30,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 2,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  descriptionContainer: {
    marginTop: 5,
    backgroundColor: '#f9f9fd',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2e3192',
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2e3192',
  },
  descriptionContent: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
  },
  performanceSection: {
    marginTop: 15,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f7',
  },
  ratingLabel: {
    fontSize: 15,
    color: '#444',
    flex: 1,
  },
  ratingStars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingValue: {
    marginRight: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    marginHorizontal: 2,
  },
});

export default Profile;