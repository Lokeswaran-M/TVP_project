import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useRoute } from '@react-navigation/native';
import { API_BASE_URL } from '../constants/Config';  // Ensure this points to your API base URL
import { useNavigation } from '@react-navigation/native';

const HeadAdminMemberViewPage = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { memberId } = route.params; 
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [overallAverage, setOverallAverage] = useState(0);
  const [isPromoted, setIsPromoted] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(''); 

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/info_with_star_rating/${memberId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user details. Please try again later.');
        }
        const data = await response.json();
        setUserDetails(data);
        if (data.ratings && Array.isArray(data.ratings) && data.ratings.length > 0) {
          const totalAverage = data.ratings.reduce((sum, rating) => sum + parseFloat(rating.average), 0);
          const overallAverage = totalAverage / data.ratings.length;
          setOverallAverage(overallAverage.toFixed(1));
        }
        await fetchProfileImage(data.businessInfo.userId);  // Await for profile image fetch
      } catch (error) {
        console.error('Error fetching user details:', error);
        Alert.alert('Error', error.message || 'An unexpected error occurred while fetching user details.');
      } finally {
        setLoading(false);
      }
    };

    const fetchProfileImage = async (userId) => {
      try {
        const response = await fetch(`${API_BASE_URL}/profile-image?userId=${memberId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch profile image. Please try again later.');
        }
        const data = await response.json();
        if (data.imageUrl) {
          setProfileImageUrl(data.imageUrl); 
        } else {
          console.warn('No image URL found in response:', data);
          Alert.alert('Info', 'No profile image available.');
        }
      } catch (error) {
        console.error('Error fetching profile image:', error);
        Alert.alert('Error', error.message || 'An unexpected error occurred while fetching the profile image.');
      }
    };

    fetchUserDetails();
  }, [memberId]); 

  const renderStars = (averageRating) => {
    const filledStars = Math.floor(averageRating);
    const hasHalfStar = averageRating % 1 >= 0.2 && averageRating % 1 < 0.8;
    const totalStars = 5;
    const stars = Array(filledStars).fill(0).map((_, index) => (
      <Icon key={index} name="star" size={25} color="#FFD700" />
    ));
    if (hasHalfStar) {
      stars.push(<Icon key="half" name="star-half-full" size={25} color="#FFD700" />);
    }
    const unfilledStars = Array(totalStars - filledStars - (hasHalfStar ? 1 : 0)).fill(0).map((_, index) => (
      <Icon key={filledStars + index + (hasHalfStar ? 1 : 0)} name="star-o" size={25} color="#D3D3D3" />
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

  const handleBack = () => {
    navigation.navigate('HeadAdminMembersPage');
  };

  const handlePromotionToggle = () => {
    setIsPromoted(!isPromoted);
    Alert.alert(isPromoted ? 'Demoted' : 'Promoted', `User has been ${isPromoted ? 'demoted' : 'promoted'} to admin.`);
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }
  if (!userDetails) {
    return <Text>No user details found.</Text>;
  }

  const { businessInfo, ratings } = userDetails;
  return (
    <View>
     

      <ScrollView contentContainerStyle={styles.container}>
        <View>
          <View style={styles.profileContainer}>
            <View style={styles.profilePic}>
              {/* Display profile image */}
              {profileImageUrl ? (
                <Image source={{ uri: profileImageUrl }} style={styles.profileImage} />
              ) : (
                <Text style={styles.profilePicText}>{businessInfo.Username.charAt(0)}</Text>
              )}
            </View>
            <View style={styles.userInfotop}>
              <Text style={styles.labeltop1}>{businessInfo.Username}</Text>
              <Text style={styles.valuetop}>{renderStars(overallAverage || 0)} {overallAverage} out of 5 {'\n'}</Text>
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
          <TouchableOpacity style={styles.promoteButton} onPress={handlePromotionToggle}>
            <Icon name="paper-plane" size={20} color="#fff" />
            <Text style={styles.promoteButtonText}>{isPromoted ? 'Demote to User' : 'Promote to Admin'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 80,
  },
    infoContainer: {
      marginBottom: 15,
    },
    profileImage: {
      width: 90,
      height: 90,
      borderRadius: 50,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
      color: '#A3238F',
    },
    ratingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center', 
      marginBottom: 5,
    },
    ratingName: {
      fontSize: 14,
      color: 'black',
    },
    starsContainer: {
      flexDirection: 'row',
    },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  profilePic: {
    width: 90,
    height: 90,
    borderRadius: 50,
    backgroundColor: '#A3238F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    marginTop:10,
  },
 
  userInfotop: {
    flexDirection: 'column',
    paddingTop: 30,
    marginLeft: 20,
  },
  labeltop1:{
fontSize: 20,
marginBottom: 10,
    fontWeight: 'bold',
    color: '#A3238F',
    transform: [{ translateY: -5}],
  },
  valuetop: {
    transform: [{ translateY: -10}],
    marginTop: 10,
  },
  value: {
    fontSize: 14,
    color: 'black',
  },
  star: {
    color: 'gold',
    fontSize: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 5,
    marginBottom: 15,
  },
  button: {
    marginTop:50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A3238F',
    padding:5,
    borderRadius: 5,
    width: '45%',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  buttonIcon: {
    backgroundColor: '#A3238F',
    borderRadius: 70,
    padding: 6,
    marginRight: 10,
  },

  performanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  performanceLabel: {
    fontSize: 14,
    color: '#000',
  },
  promoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7c1a7c',
    padding: 10,
    borderRadius: 15,
    width: '65%',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  promoteButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  stars: {
    flexDirection: 'row',
  },
});

export default HeadAdminMemberViewPage;





































