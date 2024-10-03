// import React, { useState, useCallback } from 'react';
// import { View, Text, ActivityIndicator, ScrollView,Image, TouchableOpacity } from 'react-native';
// import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
// import { useSelector } from 'react-redux';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import { API_BASE_URL } from '../constants/Config';
// import sunmoon from '../../assets/images/sunandmoon-icon.png';
// import styles from '../components/layout/ProfileStyles';

// const Profile = () => {
//   const route = useRoute();
// const { profession, categoryID } = route.params;
// console.log('Received Profession:', profession);
// console.log('Received CategoryID:', categoryID);
//   console.log('PROFESSION IN PROFILE---------------------',profession);
//   const [profileData, setProfileData] = useState({});
//   console.log("Profile data in Profile Screen--------------",profileData);
//   console.log("Location in Profile---------------",profileData?.LocationID)
//   const [loading, setLoading] = useState(true);
//   const [imageUrl, setImageUrl] = useState(require('../../assets/images/DefaultProfile.jpg'));
//   const userId = useSelector((state) => state.user?.userId);
//   console.log("UserID----------",userId);
//   const navigation = useNavigation();

//   const fetchProfileImage = async () => {
//       const response = await fetch(`${API_BASE_URL}/profile-image?userId=${userId}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       const data = await response.json();
//       const uniqueImageUrl = `${data.imageUrl}?t=${new Date().getTime()}`;
//       setImageUrl(uniqueImageUrl);
//   };

//   const fetchProfileData = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/user/business-info/${userId}`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch profile data');
//       }
//       const data = await response.json();
//       if (response.status === 404) {
//         setProfileData({});
//       } else {
//         setProfileData(data);
//       }
//     } catch (error) {
//       console.error('Error fetching profile data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };  

//   useFocusEffect(
//     useCallback(() => {
//       fetchProfileImage();
//       fetchProfileData();
//     }, [userId])
//   );

//   return (
//     <ScrollView>
//       <View style={styles.container}>
//         <View style={styles.topSection}>
//           {loading ? (
//             <ActivityIndicator size="large" color="#C23A8A" />
//           ) : (
//             <View style={styles.imageWrapper}>
//               <Image
//                 source={{ uri: imageUrl }}
//                 style={styles.image}
//               />
//               <View style={styles.editIconWrapper}>
//                 <Image 
//                   source={sunmoon} 
//                   style={{ width: 25, height: 25 }} 
//                 />
//               </View>
//             </View>
//           )}
//           <Text style={styles.userId}>User ID: {profileData?.UserId}</Text>
//           <View style={styles.starsWrapper}>
//             {Array.from({ length: 5 }).map((_, index) => (
//               <FontAwesome key={index} name="star" size={20} color="#FFD700" />
//             ))}
//           </View>
//         </View>
//         {loading ? (
//           <ActivityIndicator size="large" color="#C23A8A" />
//         ) : (
//           <View style={styles.detailsSection}>
//             <Text style={styles.label}>Name</Text>
//             <View style={styles.nameRow}>
//               <Text style={styles.info}>{profileData?.Username || 'None'}</Text>
//               <TouchableOpacity 
//                 style={styles.editButton} 
//                 onPress={() => navigation.navigate('EditProfile')}
//               >
//                 <FontAwesome name="edit" size={15} color="#C23A8A" />
//                 <Text style={styles.editText}>Edit Profile</Text>
//               </TouchableOpacity>
//             </View>
//             <Text style={styles.label}>Profession</Text>
//             <Text style={styles.info}>{profileData?.Profession || 'None'}</Text>
//             <Text style={styles.label}>Business Name</Text>
//             <Text style={styles.info}>{profileData?.BusinessName || 'None'}</Text>
//             <Text style={styles.label}>Description</Text>
//             <Text style={styles.description}>{profileData?.Description || 'None'}</Text>
//             <Text style={styles.label}>Business Address</Text>
//             <Text style={styles.info}>{profileData?.Address || 'None'}</Text>
//             <View style={styles.performanceSection}>
//           <Text style={styles.performanceTitle}>Your Performance Score:</Text>
//           {['Attendance', 'One-Min-Presentation', 'One-on-One Meeting', 'Business Referral', 'Offering Business', 'External Business'].map((category, index) => (
//               <View key={index} style={styles.performanceRow}>
//                 <Text style={styles.performanceLabel}>{category}</Text>
//                 <View style={styles.stars}>
//                   {Array.from({ length: 5 }).map((_, i) => (
//                     <FontAwesome key={i} name="star" size={16} color="#FFD700" />
//                   ))}
//                 </View>
//               </View>
//             ))}
//           </View>
//           </View>
//         )}
        
//       </View>
//     </ScrollView>
//   );
// };

// export default Profile;

import React, { useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { API_BASE_URL } from '../constants/Config';
import sunmoon from '../../assets/images/sunandmoon-icon.png';
import styles from '../components/layout/ProfileStyles';
const Profile = () => {
  const route = useRoute();
  const categoryID = route.params?.CategoryId;
  console.log('CATEGORY id IN PROFILE SCREEN:', categoryID);
  const profession = categoryID === 2 ? route.params?.profession : undefined; 
  console.log('Received Profession:', profession); 
  const [profileData, setProfileData] = useState({});
  const [multiProfile, setMultiProfile] = useState({});
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
        if (categoryID === 2) {
            response = await fetch(`${API_BASE_URL}/api/user/Multibusiness-info/${userId}/profession/${profession}`);
        } else {
            response = await fetch(`${API_BASE_URL}/api/user/business-info/${userId}`);
        }
        if (!response.ok) {
            console.error('Response failed:', response.statusText);
            throw new Error('Failed to fetch profile data');
        }
        const data = await response.json();
        console.log('Data in Profile Screen------------------------------', data);
        if (categoryID === 2) {
            setMultiProfile(data[0] || {});
            console.log('MultiProfile:', data[0]);
        } else {
            setProfileData(data);
        }
    } catch (error) {
        console.error('Error fetching profile data:', error);
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
          <Text style={styles.userId}>User ID: {profileData?.UserId}</Text>
          <View style={styles.starsWrapper}>
            {Array.from({ length: 5 }).map((_, index) => (
              <FontAwesome key={index} name="star" size={20} color="#FFD700" />
            ))}
          </View>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="#C23A8A" />
        ) : (
          <View style={styles.detailsSection}>
            {categoryID === 2 ? (
              <>
            <Text style={styles.label}>Name</Text>
            <View style={styles.nameRow}>
              <Text style={styles.info}>{multiProfile?.Username || 'None'}</Text>
              <TouchableOpacity 
                style={styles.editButton} 
                onPress={() => navigation.navigate('EditProfile', { profession: multiProfile?.Profession })}
              >
                <FontAwesome name="edit" size={15} color="#C23A8A" />
                <Text style={styles.editText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>Profession</Text>
            <Text style={styles.info}>{multiProfile?.Profession || 'None'}</Text>
            <Text style={styles.label}>Business Name</Text>
            <Text style={styles.info}>{multiProfile?.BusinessName || 'None'}</Text>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.description}>{multiProfile?.Description || 'None'}</Text>
            <Text style={styles.label}>Business Address</Text>
            <Text style={styles.info}>{multiProfile?.Address || 'None'}</Text>
            </>
            ) : (
              <>
              <Text style={styles.label}>Name</Text>
            <View style={styles.nameRow}>
              <Text style={styles.info}>{profileData?.Username || 'None'}</Text>
              <TouchableOpacity 
                style={styles.editButton} 
                onPress={() => navigation.navigate('EditProfile', { profession: profileData?.Profession })}
              >
                <FontAwesome name="edit" size={15} color="#C23A8A" />
                <Text style={styles.editText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>Profession</Text>
            <Text style={styles.info}>{profileData?.Profession || 'None'}</Text>
            <Text style={styles.label}>Business Name</Text>
            <Text style={styles.info}>{profileData?.BusinessName || 'None'}</Text>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.description}>{profileData?.Description || 'None'}</Text>
            <Text style={styles.label}>Business Address</Text>
            <Text style={styles.info}>{profileData?.Address || 'None'}</Text>
            </>
            )}
            <View style={styles.performanceSection}>
              <Text style={styles.performanceTitle}>Your Performance Score:</Text>
              {['Attendance', 'One-Min-Presentation', 'One-on-One Meeting', 'Business Referral', 'Offering Business', 'External Business'].map((category, index) => (
                <View key={index} style={styles.performanceRow}>
                  <Text style={styles.performanceLabel}>{category}</Text>
                  <View style={styles.stars}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FontAwesome key={i} name="star" size={16} color="#FFD700" />
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};
export default Profile;