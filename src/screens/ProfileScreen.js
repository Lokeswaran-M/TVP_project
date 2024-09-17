import React, { useState, useCallback } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '../constants/Config';
import { useSelector } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { ScrollView } from 'react-native-gesture-handler';
import sunmoon from '../../assets/images/sunandmoon-icon.png';
const Profile = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user);
  const navigation = useNavigation();
  const fetchProfileImage = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/profile-image`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }
      const data = await response.json();
      const uniqueImageUrl = `${data.imageUrl}?t=${new Date().getTime()}`;
      setImageUrl(uniqueImageUrl);
    } catch (error) {
      console.error('Error fetching profile image:', error);
    } finally {
      setLoading(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchProfileImage();
    }, [])
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
          <Text style={styles.userId}>User ID: {user?.userId}</Text>
          <View style={styles.starsWrapper}>
            {Array.from({ length: 5 }).map((_, index) => (
              <FontAwesome key={index} name="star" size={20} color="#FFD700" />
            ))}
          </View>
        </View>
        <View style={styles.detailsSection}>
          <Text style={styles.label}>Name</Text>
          <View style={styles.nameRow}>
            <Text style={styles.info}>{user?.username || 'None'}</Text>
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={() => navigation.navigate('EditProfile')} 
            >
              <FontAwesome name="edit" size={15} color="#C23A8A" />
              <Text style={styles.editText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.label}>Profession</Text>
          <Text style={styles.info}>{user?.profession || 'Digital Marketing'}</Text>
          <Text style={styles.label}>Business Name</Text>
          <Text style={styles.info}>{user?.BusinessName || 'None'}</Text>
          <Text style={styles.label}>Description</Text>
          <Text style={styles.description}>{user?.Description || 'None'}</Text>
          <Text style={styles.label}>Business Address</Text>
          <Text style={styles.info}>
          {user?.Address || 'None'}
          </Text>
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
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3ECF3',
    paddingTop: 18,
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imageWrapper: {
    position: 'relative',
    marginBottom: 10,
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#fff',
  },
  editIconWrapper: {
    position: 'absolute',
    right: 10,
    bottom: 0,
    borderRadius: 50,
    padding: 5,
  },
  userId: {
    fontSize: 14,
    color: '#C23A8A',
    marginVertical: 5,
  },
  starsWrapper: {
    flexDirection: 'row',
    marginTop: 5,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  info: {
    fontSize: 20,
    color: 'black',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3ECF3',
    borderRadius: 8,
    padding: 8,
    bottom: 20,
  },
  editText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#C23A8A',
  },
  detailsSection: {
    backgroundColor: 'white',
    borderTopStartRadius: 40,
    borderTopEndRadius:40,
    padding: 25,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#C23A8A',
    marginVertical: 5,
  },
  info: {
    fontSize: 14,
    color: '#000',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#000',
    marginBottom: 10,
  },
  performanceSection: {
    marginTop: 10,
  },
  performanceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#C23A8A',
    marginBottom: 10,
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
  stars: {
    flexDirection: 'row',
  },
});

export default Profile;



// import React, { useState, useCallback } from 'react';
// import { View, Text, Image, ActivityIndicator, StyleSheet } from 'react-native';
// import { useFocusEffect } from '@react-navigation/native';
// import { API_BASE_URL } from '../constants/Config';
// import { useSelector } from 'react-redux';

// const Profile = () => {
//   const [imageUrl, setImageUrl] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const user = useSelector((state) => state.user);  

//   const fetchProfileImage = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${API_BASE_URL}/profile-image`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch image');
//       }
//       const data = await response.json();
//       const uniqueImageUrl = `${data.imageUrl}?t=${new Date().getTime()}`; 
//       setImageUrl(uniqueImageUrl);
//     } catch (error) {
//       console.error('Error fetching profile image:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       fetchProfileImage();
//     }, [])
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.topSection}>
//         {loading ? (
//           <ActivityIndicator size="large" color="#0000ff" />
//         ) : (
//           imageUrl && (
//             <Image
//               source={{ uri: imageUrl }}
//               style={styles.image}
//             />
//           )
//         )}
//       </View>
//       <View style={styles.bottomSection}>
//         <Text style={styles.text}>{user?.username}</Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   topSection: {
//     flex: 2,
//     justifyContent: 'center',
//     alignItems: 'center',
//     // marginBottom: 10,
//     marginTop: 50,
//   },
//   bottomSection: {
//     flex: 3,
//     marginTop: 20,
//     // justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'white',
//     borderRadius: 50,
//   },
//   image: {
//     width: 420,
//     height: 400,
//     resizeMode: 'cover',
//   },
//   text: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: 'black',
//   },
// });

// export default Profile;