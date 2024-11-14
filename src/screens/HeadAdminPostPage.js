import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { API_BASE_URL } from '../constants/Config';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const HeadAdminPostPage = ({ navigation }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPhotos = async () => {
    setRefreshing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/get-meeting-photos`);
      const data = await response.json();
  
      if (data.success) {
        const sortedPhotos = data.files.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));
  
        const photosWithProfileData = await Promise.all(
          sortedPhotos.map(async (item) => {
            const filename = item.imageUrl.split('/').pop();
            console.log('----------------------filename---------------',filename);
            const userId = filename.split('_')[0];
  
            // Fetch UserId profile
            const profileResponse = await fetch(`${API_BASE_URL}/profile-image?userId=${userId}`);
            const profileData = await profileResponse.json();
  
            // Fetch User and Meet data
            const usernameResponse = await fetch(`${API_BASE_URL}/post-username?userId=${userId}`);
            const usernameData = await usernameResponse.json();
            console.log('----------------------all dataaaaaaaaaaaaaaaaaaaaaaaaaaaa--------------',usernameData);
            // Fetch MeetId profile using the MeetId from usernameData
            const meetId = usernameData.oneononeData[0]?.MeetId;
            const meetProfileResponse = await fetch(`${API_BASE_URL}/profile-image?userId=${meetId}`);
            const meetProfileData = await meetProfileResponse.json();
              
            return { 
              ...item,
              userId, 
              meetId,
              profileImage: profileData.imageUrl, 
              username: usernameData.username || userId,
              meetusername: usernameData.oneononeData[0]?.MeetUsername,
              meetProfileImage: meetProfileData.imageUrl,
              userProfession: usernameData.oneononeData[0]?.UserProfession,
              meetProfession: usernameData.oneononeData[0]?.MeetProfession,
              userbuisnessname: usernameData.oneononeData[0]?.userbuisnessname,
              meetbuisnessname: usernameData.oneononeData[0]?.meetbuisnessname,
              dateTime: usernameData.oneononeData[0]?.DateTime
            };
          })
        );
  
        setPhotos(photosWithProfileData);
      } else {
        throw new Error(data.error || 'Failed to fetch photos.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPhotos();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#A3238F" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => {
    // Format the date as "DD MONTH" if dateTime exists
    const formattedDate = item.dateTime
      ? new Date(item.dateTime).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'long'
        })
      : 'Date not available';
    console.log('----------------date---------------',)
    return (
      <View style={styles.postContainer}>
        <View style={styles.header}>
          {/* UserId profile and business name */}
          <View style={styles.profileContainer}>
            <Image source={{ uri: item.meetProfileImage }} style={styles.profileImageUser} />
            <Image source={{ uri: item.profileImage }} style={styles.profileImageMeet} />
            <View>
              <TouchableOpacity 
                onPress={() =>
                  navigation.navigate('MemberDetails', {
                    userId: item.userId,
                    Profession: item.userProfession,
                  })
                }
              > 
                <Text style={styles.profileNameUser}>{item.username}</Text> 
              </TouchableOpacity>
              <View style={styles.businessContainer}>  
                <MaterialIcons name="business-center" size={16} color="#908f90" />
                <Text style={styles.userProfession}>{item.userProfession}</Text>
              </View>
            </View>
          </View>
          <View>
            <Text style={styles.profileName}>TO</Text>
          </View>
          {/* MeetId profile and business name */}
          <View style={styles.profileContainer}>
            <View>
              <TouchableOpacity 
                onPress={() =>
                  navigation.navigate('MemberDetails', {
                    userId: item.meetId,
                    Profession: item.meetProfession,
                  })
                }
              > 
                <Text style={styles.profileNameMeet}>{item.meetusername}</Text> 
              </TouchableOpacity>
              <View style={styles.businessContainer}>  
                <MaterialIcons name="business-center" size={16} color="#908f90" />
                <Text style={styles.meetProfession}>{item.meetProfession}</Text>
              </View>
            </View>
          </View>
        </View>
  
        {/* Post image */}
        <Image 
          source={{ uri: `${API_BASE_URL}${item.imageUrl}` }} 
          style={styles.postImage} 
          resizeMode="cover" 
        />
  
        {/* Caption and timestamp */}
        <View style={styles.captionContainer}>
          <Text style={styles.timestamp}>{formattedDate}</Text>
        </View>
      </View>
    );
  };
  
  return (
    <FlatList
      data={photos}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.gridContainer}
      refreshing={refreshing}
      onRefresh={handleRefresh}
    />
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
 
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ccc',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  gridContainer: {
    padding: 10,
    backgroundColor:'black',
  },
  postContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'flex-start',
    padding: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight:20,
    position:'static',
  },
  businessContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    position:'static',
    marginLeft: 10,
  },
  profileImageUser: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginTop:-10,
    zIndex: 1,
  },
  profileImageMeet: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom:-10,
    marginLeft: -30, 
    zIndex: 2,
  },
  profileName:{
  fontSize:15,
  paddingRight:8,
  fontWeight:'500',
  color:'#A3238F',
  
  },
  profileNameUser: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#A3238F',
  },
  profileNameMeet: {
    marginLeft: 12,
    marginRight:0,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#A3238F',
  },
  postImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  
  captionContainer: {
    paddingHorizontal: 10,
    paddingTop: 5,
  },
  caption: {
    fontSize: 14,
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: 'black',
    paddingHorizontal: 10,
    paddingVertical:5,
    paddingTop: 5,
    alignItems:'center',
  },
  userProfession: {
    marginLeft: 2,
    fontWeight: '400',
   fontSize: 12,
   color: '#b50098',
},
meetProfession: {
  marginLeft: 2,
  fontWeight: '400',
 fontSize: 12,
 color: '#b50098',
},

});

export default HeadAdminPostPage;














// import React, { useEffect, useState } from 'react';
// import { View, Text, Image, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
// import { API_BASE_URL } from '../constants/Config';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// const HeadAdminPostPage = ({ navigation }) => {
//   const [photos, setPhotos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [refreshing, setRefreshing] = useState(false);

//   const fetchPhotos = async () => {
//     setRefreshing(true);
//     try {
//       const response = await fetch(`${API_BASE_URL}/get-meeting-photos`);
//       const data = await response.json();
  
//       if (data.success) {
//         const sortedPhotos = data.files.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));
  
//         const photosWithProfileData = await Promise.all(
//           sortedPhotos.map(async (item) => {
//             const filename = item.imageUrl.split('/').pop();
//             console.log('----------------------filename---------------',filename);
//             const userId = filename.split('_')[0];
  
//             // Fetch UserId profile
//             const profileResponse = await fetch(`${API_BASE_URL}/profile-image?userId=${userId}`);
//             const profileData = await profileResponse.json();
  
//             // Fetch User and Meet data
//             const usernameResponse = await fetch(`${API_BASE_URL}/post-username?userId=${userId}`);
//             const usernameData = await usernameResponse.json();
//             console.log('----------------------all dataaaaaaaaaaaaaaaaaaaaaaaaaaaa--------------',usernameData);
//             // Fetch MeetId profile using the MeetId from usernameData
//             const meetId = usernameData.oneononeData[0]?.MeetId;
//             const meetProfileResponse = await fetch(`${API_BASE_URL}/profile-image?userId=${meetId}`);
//             const meetProfileData = await meetProfileResponse.json();
              
//             return { 
//               ...item,
//               userId, 
//               meetId,
//               profileImage: profileData.imageUrl, 
//               username: usernameData.username || userId,
//               meetusername: usernameData.oneononeData[0]?.MeetUsername,
//               meetProfileImage: meetProfileData.imageUrl,
//               userProfession: usernameData.oneononeData[0]?.UserProfession,
//               meetProfession: usernameData.oneononeData[0]?.MeetProfession,
//               userbuisnessname: usernameData.oneononeData[0]?.userbuisnessname,
//               meetbuisnessname: usernameData.oneononeData[0]?.meetbuisnessname,
//               dateTime: usernameData.oneononeData[0]?.DateTime
//             };
//           })
//         );
  
//         setPhotos(photosWithProfileData);
//       } else {
//         throw new Error(data.error || 'Failed to fetch photos.');
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };
  
//   useEffect(() => {
//     fetchPhotos();
//   }, []);

//   const handleRefresh = () => {
//     setRefreshing(true);
//     fetchPhotos();
//   };

//   if (loading && !refreshing) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color="#A3238F" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>{error}</Text>
//       </View>
//     );
//   }

//   const renderItem = ({ item }) => {
//     // Format the date as "DD MONTH" if dateTime exists
//     const formattedDate = item.dateTime
//       ? new Date(item.dateTime).toLocaleDateString('en-IN', {
//           day: '2-digit',
//           month: 'long'
//         })
//       : 'Date not available';
//     console.log('----------------date---------------',)
//     return (
//       <View style={styles.postContainer}>
//         <View style={styles.header}>
//           {/* UserId profile and business name */}
//           <View style={styles.profileContainer}>
//             <Image source={{ uri: item.meetProfileImage }} style={styles.profileImageUser} />
//             <Image source={{ uri: item.profileImage }} style={styles.profileImageMeet} />
//             <View>
//               <TouchableOpacity 
//                 onPress={() =>
//                   navigation.navigate('MemberDetails', {
//                     userId: item.userId,
//                     Profession: item.userProfession,
//                   })
//                 }
//               > 
//                 <Text style={styles.profileNameUser}>{item.username}</Text> 
//               </TouchableOpacity>
//               <View style={styles.businessContainer}>  
//                 <MaterialIcons name="business-center" size={16} color="#908f90" />
//                 <Text style={styles.userProfession}>{item.userProfession}</Text>
//               </View>
//             </View>
//           </View>
//           <View>
//             <Text style={styles.profileName}>TO</Text>
//           </View>
//           {/* MeetId profile and business name */}
//           <View style={styles.profileContainer}>
//             <View>
//               <TouchableOpacity 
//                 onPress={() =>
//                   navigation.navigate('MemberDetails', {
//                     userId: item.meetId,
//                     Profession: item.meetProfession,
//                   })
//                 }
//               > 
//                 <Text style={styles.profileNameMeet}>{item.meetusername}</Text> 
//               </TouchableOpacity>
//               <View style={styles.businessContainer}>  
//                 <MaterialIcons name="business-center" size={16} color="#908f90" />
//                 <Text style={styles.meetProfession}>{item.meetProfession}</Text>
//               </View>
//             </View>
//           </View>
//         </View>
  
//         {/* Post image */}
//         <Image 
//           source={{ uri: `${API_BASE_URL}${item.imageUrl}` }} 
//           style={styles.postImage} 
//           resizeMode="cover" 
//         />
  
//         {/* Caption and timestamp */}
//         <View style={styles.captionContainer}>
//           <Text style={styles.timestamp}>{formattedDate}</Text>
//         </View>
//       </View>
//     );
//   };
  
//   return (
//     <FlatList
//       data={photos}
//       renderItem={renderItem}
//       keyExtractor={(item, index) => index.toString()}
//       contentContainerStyle={styles.gridContainer}
//       refreshing={refreshing}
//       onRefresh={handleRefresh}
//     />
//   );
// };

// const styles = StyleSheet.create({
//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#ccc',
 
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#ccc',
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 16,
//   },
//   gridContainer: {
//     padding: 10,

//   },
//   postContainer: {
//     marginBottom: 20,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent:'flex-start',
//     padding: 10,
//   },
//   profileContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight:20,
//     position:'static',
//   },
//   businessContainer:{
//     flexDirection: 'row',
//     alignItems: 'center',
//     position:'static',
//     marginLeft: 10,
//   },
//   profileImageUser: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginTop:-10,
//     zIndex: 1,
//   },
//   profileImageMeet: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginBottom:-10,
//     marginLeft: -30, 
//     zIndex: 2,
//   },
//   profileName:{
//   fontSize:15,
//   paddingRight:8,
//   fontWeight:'500',
//   color:'#A3238F',
  
//   },
//   profileNameUser: {
//     marginLeft: 12,
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#A3238F',
//   },
//   profileNameMeet: {
//     marginLeft: 12,
//     marginRight:0,
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#A3238F',
//   },
//   postImage: {
//     width: '100%',
//     height: 300,
//     borderRadius: 10,
//   },
  
//   captionContainer: {
//     paddingHorizontal: 10,
//     paddingTop: 5,
//   },
//   caption: {
//     fontSize: 14,
//     color: '#333',
//   },
//   timestamp: {
//     fontSize: 12,
//     color: 'black',
//     paddingHorizontal: 10,
//     paddingVertical:5,
//     paddingTop: 5,
//     alignItems:'center',
//   },
//   userProfession: {
//     marginLeft: 2,
//     fontWeight: '400',
//    fontSize: 12,
//    color: '#b50098',
// },
// meetProfession: {
//   marginLeft: 2,
//   fontWeight: '400',
//  fontSize: 12,
//  color: '#b50098',
// },

// });

// export default HeadAdminPostPage;








// SELECT
// 	O.Id,O.UserId,O.MeetId,U.Username,MU.Username AS MeetUserid , BD.BusinessName as userbuisnessname,BD2.BusinessName as meetbuisnessname,BD.Profession AS UserProfession ,BD2.Profession AS MeetProfession,O.DateTime
// FROM
// 	tbloneonone AS O
// 	INNER JOIN tbluser AS U ON O.UserId = U.UserId
// 	INNER JOIN tbluser AS MU ON O.MeetId = MU.UserId
// 	INNER JOIN tblbusinessdetail AS BD ON O.SlotID = BD.ChapterType and O.UserId = BD.UserId
// 	INNER JOIN tblbusinessdetail AS BD2 ON O.SlotID = BD2.ChapterType and O.MeetId = BD2.UserId






// import React, { useEffect, useState } from 'react';
// import { View, Text, Image, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
// import { API_BASE_URL } from '../constants/Config';

// const HeadAdminPostPage = () => {
//   const [photos, setPhotos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [refreshing, setRefreshing] = useState(false);

//   // Fetch photos and profile images from the API
//   const fetchPhotos = async () => {
//     setRefreshing(true);
//     try {
//       const response = await fetch(`${API_BASE_URL}/get-meeting-photos`);
//       const data = await response.json();

//       if (data.success) {
//         // Sort the photos array by timestamp in descending order
//         const sortedPhotos = data.files.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));
        
//         // Fetch profile image URLs for each user
//         const photosWithProfileImage = await Promise.all(
//           sortedPhotos.map(async (item) => {
//             const filename = item.imageUrl.split('/').pop();
//             // Extract UserId from photo filename
//             const userId = filename.split('_')[0];
//             console.log('-------------------userId------------', userId);

//             // Fetch profile image
//             const profileResponse = await fetch(`${API_BASE_URL}/profile-image?userId=${userId}`);
//             const profileData = await profileResponse.json();

//             return { ...item, profileImage: profileData.imageUrl }; // Add profileImage URL to each photo
//           })
//         );

//         setPhotos(photosWithProfileImage);
//       } else {
//         throw new Error(data.error || 'Failed to fetch photos.');
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchPhotos();
//   }, []);

//   // Pull-to-refresh handler
//   const handleRefresh = () => {
//     setRefreshing(true);
//     fetchPhotos();
//   };

//   if (loading && !refreshing) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color="#A3238F" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>{error}</Text>
//       </View>
//     );
//   }

//   const renderItem = ({ item }) => {
//     const filename = item.imageUrl.split('/').pop();
//     const userId = filename.split('_')[0];

//     return (
//       <View style={styles.postContainer}>
//         {/* Post Header */}
//         <View style={styles.header}>
//           <TouchableOpacity style={styles.profileContainer}>
//             <Image source={{ uri: item.profileImage }} style={styles.profileImage} />
//             <Text style={styles.profileName}>{userId}</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Post Image */}
//         <Image 
//           source={{ uri: `${API_BASE_URL}${item.imageUrl}` }} 
//           style={styles.postImage} 
//           resizeMode="cover" 
//         />

//         {/* Caption */}
//         <View style={styles.captionContainer}>
//           <Text style={styles.caption}>
//             <Text style={styles.profileName}>{userId} </Text>{item.chapterType} | {item.locationId} | {item.date}
//           </Text>
//         </View>

//         {/* Timestamp */}
//         <Text style={styles.timestamp}>{item.timeStamp}</Text>
//       </View>
//     );
//   };

//   return (
//     <FlatList
//       data={photos}
//       renderItem={renderItem}
//       keyExtractor={(item, index) => index.toString()}
//       contentContainerStyle={styles.gridContainer}
//       refreshing={refreshing}
//       onRefresh={handleRefresh}
//     />
//   );
// };




// const styles = StyleSheet.create({
//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#ccc',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 16,
//   },
//   gridContainer: {
//     padding: 10,
//     backgroundColor: '#fff',
//   },
//   postContainer: {
//     marginBottom: 20,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 10,
//   },
//   profileContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   profileImage: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//   },
//   profileName: {
//     marginLeft: 10,
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   postImage: {
//     width: '100%',
//     height: 300,
//     borderRadius: 10,
//   },
//   captionContainer: {
//     paddingHorizontal: 10,
//     paddingTop: 5,
//   },
//   caption: {
//     fontSize: 14,
//     color: '#333',
//   },
//   timestamp: {
//     fontSize: 12,
//     color: '#888',
//     paddingHorizontal: 10,
//     paddingTop: 5,
//   },
// });

// export default HeadAdminPostPage;
