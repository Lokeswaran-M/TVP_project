import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator, TouchableOpacity, useWindowDimensions } from 'react-native';
import { API_BASE_URL } from '../constants/Config';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import DatePicker from 'react-native-date-picker';
import styles from '../components/layout/PostStyles';
import { TabView, TabBar } from 'react-native-tab-view';
import Subscription from './Subscription';
const Post = ({ chapterType, locationId, navigation }) => {
  const [photos, setPhotos] = useState([]);
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [monthYearVisible, setMonthYearVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);

  // Function to fetch photos from the API
  const fetchPhotos = async () => {
    setRefreshing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/getOneOnOneMeeting-subadmin?locationId=${locationId}&slotId=${chapterType}`);
      const data = await response.json();

      if (response.ok && data.data) {
        const photosWithProfileData = await Promise.all(
          data.data.map(async (item) => {
            // Fetch User Profile Image
            const profileResponse = await fetch(`${API_BASE_URL}/profile-image?userId=${item.UserId}`);
            const profileData = await profileResponse.json();

            // Fetch Meet Profile Image
            const meetProfileResponse = await fetch(`${API_BASE_URL}/profile-image?userId=${item.MeetId}`);
            const meetProfileData = await meetProfileResponse.json();

            // Fetch Post Image
            const ProfileResponseImgPath = await fetch(`${API_BASE_URL}/one-profile-image?userId=${item.Img_Path}`);
            const ProfileDataImgPath = await ProfileResponseImgPath.json();

            return {
              ...item,
              profileImage: profileData.imageUrl,
              meetProfileImage: meetProfileData.imageUrl,
              postimage: ProfileDataImgPath.imageUrl,
              userName: item.Username || item.UserId,
              meetUsername: item.MeetUsername,
              userProfession: item.UserProfession,
              meetProfession: item.MeetProfession,
              userBusinessName: item.userbuisnessname,
              dateTime: item.DateTime,
            };
          })
        );
        photosWithProfileData.sort((a, b) => {
          const dateA = new Date(a.dateTime);
          const dateB = new Date(b.dateTime);
          return dateB - dateA; // Descending order (most recent first)
        });
        if (startDate && endDate) {
          filterPhotosByDateRange(startDate, endDate, photosWithProfileData);
        } else {
          setPhotos(photosWithProfileData);
          setFilteredPhotos(photosWithProfileData);
        }
      } else {
        setError(data.error || 'Failed to fetch data.');
      }
    } catch (err) {
      setError('Network request failed: ' + err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Filtering photos based on selected date range
  const filterPhotosByDateRange = (start, end, photosToFilter) => {
    const filtered = photosToFilter.filter(photo => {
      const photoDate = new Date(photo.dateTime);
      return photoDate >= start && photoDate <= end;
    });
    setFilteredPhotos(filtered);
  };

  // Handle start date change
  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (endDate) {
      filterPhotosByDateRange(date, endDate, photos);
    }
  };

  // Handle end date change
  const handleEndDateChange = (date) => {
    setEndDate(date);
    if (startDate) {
      filterPhotosByDateRange(startDate, date, photos);
    }
  };

  // Handle month/year change
  const handleMonthYearChange = (date) => {
    const selectedMonthYear = new Date(date);
    setSelectedMonth(selectedMonthYear);
    filterPhotosByMonthYear(selectedMonthYear);
  };

  // Filter photos by selected month and year
  const filterPhotosByMonthYear = (monthYear) => {
    const filtered = photos.filter(photo => {
      const photoDate = new Date(photo.dateTime);
      return (
        photoDate.getMonth() === monthYear.getMonth() && photoDate.getFullYear() === monthYear.getFullYear()
      );
    });
    setFilteredPhotos(filtered);
  };

  // Refresh photos when user pulls to refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchPhotos();
  };

  // UseEffect to fetch photos when locationId or chapterType change
  useEffect(() => {
    if (locationId && chapterType) {
      fetchPhotos();
    }
  }, [locationId, chapterType, startDate, endDate]);

  // Loading and error handling
  if (loading && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#2e3192" />
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

  // Render each photo item
  const renderItem = ({ item }) => {
    const formattedDate = item.dateTime
      ? new Date(item.dateTime).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'long'
        })
      : 'Date not available';

    return (
      <View style={styles.postContainer}>
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            <Image source={{ uri: item.meetProfileImage }} style={styles.profileImageUser} />
            <Image source={{ uri: item.profileImage }} style={styles.profileImageMeet} />
            <View>
              <TouchableOpacity 
                onPress={() =>
                  navigation.navigate('MemberDetails', {
                    userId: item.UserId,
                    Profession: item.UserProfession,
                  })
                }
              >
                <Text style={styles.profileNameUser}>{item.userName}</Text> 
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
          <View style={styles.profileContainer}>
            <View>
              <TouchableOpacity 
                onPress={() =>
                  navigation.navigate('MemberDetails', {
                    userId: item.MeetId,
                    Profession: item.meetProfession,
                  })
                }
              >
                <Text style={styles.profileNameMeet}>{item.meetUsername}</Text> 
              </TouchableOpacity>
              <View style={styles.businessContainer}>  
                <MaterialIcons name="business-center" size={16} color="#908f90" />
                <Text style={styles.meetProfession}>{item.meetProfession}</Text>
              </View>
            </View>
          </View>
        </View>

        <Image 
          source={{ uri: item.postimage }}
          style={styles.postImage} 
          resizeMode="cover" 
        />

        <View style={styles.captionContainer}>
          <Text style={styles.timestamp}>{formattedDate}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.filterContainer}>
      <View>
        <TouchableOpacity onPress={() => setMonthYearVisible(true)} style={styles.filterButton}>
          <Text style={styles.filterButtonText}>Month/Year</Text>
        </TouchableOpacity>
      </View>

      {/* Date Picker Modal for Month/Year selection */}
      {monthYearVisible && (
        <DatePicker
          modal
          open={monthYearVisible}
          date={selectedMonth || new Date(new Date().getFullYear(), new Date().getMonth(), 1)} // Default to 1st of current month
          mode="date"
          onConfirm={(date) => {
            handleMonthYearChange(date);
            setMonthYearVisible(false); // Close after selection
          }}
          onCancel={() => setMonthYearVisible(false)}
        />
      )}

      {/* Display the filtered photos */}
      <FlatList
        data={filteredPhotos}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.gridContainer}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        showsVerticalScrollIndicator={false} 
        showsHorizontalScrollIndicator={false} 
      />
    </View>
  );
};
export default function TabViewExample({ navigation }) {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([]);
  const userId = useSelector((state) => state.user?.userId);
  const [businessInfo, setBusinessInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchBusinessInfo = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/user/business-infodrawer/${userId}`);
        const data = await response.json();
        console.log("Data in the Home Screen Drawer-----------------------------", data);
        if (response.ok) {
          const updatedRoutes = data.map((business, index) => ({
            key: `business${index + 1}`,
            title: business.BD,
            chapterType: business.CT,
            locationId: business.L,
            isPaid: business.IsPaid,
          }));
          setRoutes(updatedRoutes);
          setBusinessInfo(data);
        } else {
          console.error('Error fetching business info:', data.message);
        }
      } catch (error) {
        console.error('API call error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinessInfo();
  }, [userId]);
  const renderScene = ({ route }) => {
    const business = businessInfo.find((b) => b.BD === route.title);
    if (business?.IsPaid === 0) {
      return <Subscription 
      navigation={navigation}
      route={{ 
        ...route, 
        params: { 
          locationId: business?.L, 
          chapterType: business?.CT,
          Profession: business?.BD 
        } 
      }} />;
    }
    return (
      <Post
        chapterType={business?.CT}
        locationId={business?.L}
        navigation={navigation}
      />
    );
  };
  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: '#2e3192' }}
      style={{ backgroundColor: '#rgb(220, 228, 250)' }}
      activeColor="#2e3192"
      inactiveColor="gray"
      labelStyle={{ fontSize: 14 }}
    />
  );
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={renderTabBar}
    />
  );
}

// const TabViewExample = ({ navigation }) => {
//   const layout = useWindowDimensions();
//   const [index, setIndex] = useState(0);
//   const [routes, setRoutes] = useState([]);
//   const userId = useSelector((state) => state.user?.userId);
//   const [businessInfo, setBusinessInfo] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchBusinessInfo = async () => {
//       try {
//         const response = await fetch(`${API_BASE_URL}/api/user/business-infodrawer/${userId}`);
//         const data = await response.json();

//         if (response.ok) {
//           const updatedRoutes = data.map((business, index) => ({
//             key: `business${index + 1}`,
//             title: business.BD,
//             chapterType: business.CT,
//             locationId: business.L,
//           }));
//           setRoutes(updatedRoutes);
//           setBusinessInfo(data);
//         } else {
//           console.error('Error fetching business info:', data.message);
//         }
//       } catch (error) {
//         console.error('API call error:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBusinessInfo();
//   }, [userId]);

  // const renderScene = ({ route }) => {
  //   const business = businessInfo.find((b) => b.BD === route.title);
  //   return (
  //     <Post
  //       chapterType={business?.CT}
  //       locationId={business?.L}
  //       navigation={navigation}
  //     />
  //   );
  // };

  // const renderTabBar = (props) => (
  //   <TabBar
  //     {...props}
  //     indicatorStyle={{ backgroundColor: '#2e3192' }}
  //     style={{ backgroundColor: '#F3ECF3' }}
  //     activeColor="#2e3192"
  //     inactiveColor="gray"
  //     labelStyle={{ fontSize: 14 }}
  //   />
  // );

//   if (loading) {
//     return <ActivityIndicator size="large" color="#2e3192" />;
//   }

//   return (
//     <TabView
//       navigationState={{ index, routes }}
//       renderScene={renderScene}
//       onIndexChange={setIndex}
//       initialLayout={{ width: layout.width }}
//       renderTabBar={renderTabBar}
//     />
//   );
// };

// export default TabViewExample;






















// import React, { useState, useEffect } from 'react';
// import { View, Text, Image, FlatList, ActivityIndicator, TouchableOpacity, useWindowDimensions } from 'react-native';
// import { API_BASE_URL } from '../constants/Config';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import { useSelector } from 'react-redux';
// import DatePicker from 'react-native-date-picker';
// import styles from '../components/layout/PostStyles';
// import { TabView, TabBar } from 'react-native-tab-view';

// const Post = ({ chapterType, locationId, navigation }) => {
//   const [photos, setPhotos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [refreshing, setRefreshing] = useState(false);
//   const [datePickerVisible, setDatePickerVisible] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(null);

//   const fetchPhotos = async () => {
//     setRefreshing(true);
//     try {
//       const response = await fetch(`${API_BASE_URL}/getOneOnOneMeeting-subadmin?locationId=${locationId}&slotId=${chapterType}`);
//       const data = await response.json();
  
//       if (response.ok && data.data) {
//         const photosWithProfileData = await Promise.all(
//           data.data.map(async (item) => {
//             // Fetch User Profile Image
//             const profileResponse = await fetch(`${API_BASE_URL}/profile-image?userId=${item.UserId}`);
//             const profileData = await profileResponse.json();
  
//             // Fetch Meet Profile Image
//             const meetProfileResponse = await fetch(`${API_BASE_URL}/profile-image?userId=${item.MeetId}`);
//             const meetProfileData = await meetProfileResponse.json();
  
//             // Fetch Post Image
//             const ProfileResponseImgPath = await fetch(`${API_BASE_URL}/one-profile-image?userId=${item.Img_Path}`);
//             const ProfileDataImgPath = await ProfileResponseImgPath.json();
  
//             return {
//               ...item,
//               profileImage: profileData.imageUrl,
//               meetProfileImage: meetProfileData.imageUrl,
//               postimage: ProfileDataImgPath.imageUrl,
//               userName: item.Username || item.UserId,
//               meetUsername: item.MeetUsername,
//               userProfession: item.UserProfession,
//               meetProfession: item.MeetProfession,
//               userBusinessName: item.userbuisnessname,
//               dateTime: item.DateTime, // Ensure correct date format is used
//             };
//           })
//         );
  
//         // Sort and filter photos based on date
//         const filteredPhotos = selectedDate
//           ? photosWithProfileData.filter((photo) => 
//               new Date(photo.dateTime).toDateString() === new Date(selectedDate).toDateString()
//             )
//           : photosWithProfileData;
  
//         setPhotos(filteredPhotos);
//       } else {
//         setError(data.error || 'Failed to fetch data.');
//       }
//     } catch (err) {
//       setError('Network request failed: ' + err.message);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };
  
//   useEffect(() => {
//     if (locationId && chapterType) {
//       fetchPhotos();
//     }
//   }, [locationId, chapterType, selectedDate]);

//   const handleDateChange = (date) => {
//     setSelectedDate(date);
//     setDatePickerVisible(false);
//     fetchPhotos();
//   };

//   const handleRefresh = () => {
//     setRefreshing(true);
//     fetchPhotos();
//   };

//   if (loading && !refreshing) {
//     return <ActivityIndicator size="large" color="#2e3192" />;
//   }

//   if (error) {
//     return <Text style={styles.errorText}>{error}</Text>;
//   }
  
//   const renderItem = ({ item }) => {
//     const formattedDate = item.dateTime
//       ? new Date(item.dateTime).toLocaleDateString('en-IN', {
//           day: '2-digit',
//           month: 'long'
//         })
//       : 'Date not available';
    
//     return (
//       <View style={styles.postContainer}>
//         <View style={styles.header}>
//           <View style={styles.profileContainer}>
//             <Image source={{ uri: item.meetProfileImage }} style={styles.profileImageUser} />
//             <Image source={{ uri: item.profileImage }} style={styles.profileImageMeet} />
//             <View>
//               <TouchableOpacity 
//                 onPress={() =>
//                   navigation.navigate('MemberDetails', {
//                     userId: item.UserId,
//                     Profession: item.UserProfession,
//                   })
//                 }
//               > 
//                 <Text style={styles.profileNameUser}>{item.userName}</Text> 
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
//           <View style={styles.profileContainer}>
//             <View>
//               <TouchableOpacity 
//                 onPress={() =>
//                   navigation.navigate('MemberDetails', {
//                     userId: item.MeetId,
//                     Profession: item.meetProfession,
//                   })
//                 }
//               > 
//                 <Text style={styles.profileNameMeet}>{item.meetUsername}</Text> 
//               </TouchableOpacity>
//               <View style={styles.businessContainer}>  
//                 <MaterialIcons name="business-center" size={16} color="#908f90" />
//                 <Text style={styles.meetProfession}>{item.meetProfession}</Text>
//               </View>
//             </View>
//           </View>
//         </View>

//         <Image 
//           source={{ uri: item.postimage }}
//           style={styles.postImage} 
//           resizeMode="cover" 
//         />

//         <View style={styles.captionContainer}>
//           <Text style={styles.timestamp}>{formattedDate}</Text>
//         </View>
//       </View>
//     );
//   };
  
//   return (
//     <View style={styles.filterContainer}>
//       <View>
//         <TouchableOpacity onPress={() => setDatePickerVisible(true)} style={styles.filterButton}>
//           <Text style={styles.filterButtonText}>Filter by Date</Text>
//           <MaterialIcons name="filter-list" size={26} color="#2e3192" />
//         </TouchableOpacity>
//       </View>

//       {datePickerVisible && (
//         <DatePicker
//           modal
//           open={datePickerVisible}
//           date={selectedDate || new Date()}
//           mode="date"
//           onConfirm={handleDateChange}
//           onCancel={() => setDatePickerVisible(false)}
//         />
//       )}

//       <FlatList
//         data={photos}
//         renderItem={renderItem}
//         keyExtractor={(item, index) => index.toString()}
//         contentContainerStyle={styles.gridContainer}
//         refreshing={refreshing}
//         onRefresh={handleRefresh}
//             showsVerticalScrollIndicator={false} 
//         showsHorizontalScrollIndicator={false} 
//       />
//     </View>
//   );
// };



// const TabViewExample = ({ navigation }) => {
//   const layout = useWindowDimensions();
//   const [index, setIndex] = useState(0);
//   const [routes, setRoutes] = useState([]);
//   const userId = useSelector((state) => state.user?.userId);
//   const [businessInfo, setBusinessInfo] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchBusinessInfo = async () => {
//       try {
//         const response = await fetch(`${API_BASE_URL}/api/user/business-infodrawer/${userId}`);
//         const data = await response.json();

//         if (response.ok) {
//           const updatedRoutes = data.map((business, index) => ({
//             key: `business${index + 1}`,
//             title: business.BD,
//             chapterType: business.CT,
//             locationId: business.L,
//           }));
//           setRoutes(updatedRoutes);
//           setBusinessInfo(data);
//         } else {
//           console.error('Error fetching business info:', data.message);
//         }
//       } catch (error) {
//         console.error('API call error:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBusinessInfo();
//   }, [userId]);

//   const renderScene = ({ route }) => {
//     const business = businessInfo.find((b) => b.BD === route.title);
//     return (
//       <Post
//         chapterType={business?.CT}
//         locationId={business?.L}
//         navigation={navigation}
//       />
//     );
//   };

//   const renderTabBar = (props) => (
//     <TabBar
//       {...props}
//       indicatorStyle={{ backgroundColor: '#2e3192' }}
//       style={{ backgroundColor: '#F3ECF3' }}
//       activeColor="#2e3192"
//       inactiveColor="gray"
//       labelStyle={{ fontSize: 14 }}
//     />
//   );

//   if (loading) {
//     return <ActivityIndicator size="large" color="#2e3192" />;
//   }

//   return (
//     <TabView
//       navigationState={{ index, routes }}
//       renderScene={renderScene}
//       onIndexChange={setIndex}
//       initialLayout={{ width: layout.width }}
//       renderTabBar={renderTabBar}
//     />
//   );
// };

// export default TabViewExample;











// import React, { useState, useEffect } from 'react';
// import { View, Text, Image, FlatList, ActivityIndicator, TouchableOpacity, useWindowDimensions } from 'react-native';
// import { API_BASE_URL } from '../constants/Config';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import { useSelector } from 'react-redux';
// import DatePicker from 'react-native-date-picker';
// import styles from '../components/layout/PostStyles';
// import { TabView, TabBar } from 'react-native-tab-view';

// const Post = ({ chapterType, locationId, navigation }) => {
//   const [photos, setPhotos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [refreshing, setRefreshing] = useState(false);
//   const [datePickerVisible, setDatePickerVisible] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(null);

//   const fetchPhotos = async () => {
//     setRefreshing(true);
//     try {
//       const response = await fetch(`${API_BASE_URL}/getOneOnOneMeeting-subadmin?locationId=${locationId}&slotId=${chapterType}`);
//       const data = await response.json();
  
//       if (response.ok && data.data) {
//         const photosWithProfileData = await Promise.all(
//           data.data.map(async (item) => {
//             // Fetch User Profile Image
//             const profileResponse = await fetch(`${API_BASE_URL}/profile-image?userId=${item.UserId}`);
//             const profileData = await profileResponse.json();
  
//             // Fetch Meet Profile Image
//             const meetProfileResponse = await fetch(`${API_BASE_URL}/profile-image?userId=${item.MeetId}`);
//             const meetProfileData = await meetProfileResponse.json();
  
//             // Fetch Post Image
//             const ProfileResponseImgPath = await fetch(`${API_BASE_URL}/one-profile-image?userId=${item.Img_Path}`);
//             const ProfileDataImgPath = await ProfileResponseImgPath.json();
  
//             return {
//               ...item,
//               profileImage: profileData.imageUrl,
//               meetProfileImage: meetProfileData.imageUrl,
//               postimage: ProfileDataImgPath.imageUrl,
//               userName: item.Username || item.UserId,
//               meetUsername: item.MeetUsername,
//               userProfession: item.UserProfession,
//               meetProfession: item.MeetProfession,
//               userBusinessName: item.userbuisnessname,
//               dateTime: item.DateTime, // Ensure correct date format is used
//             };
//           })
//         );
  
//         // Sort and filter photos based on date
//         const filteredPhotos = selectedDate
//           ? photosWithProfileData.filter((photo) => 
//               new Date(photo.dateTime).toDateString() === new Date(selectedDate).toDateString()
//             )
//           : photosWithProfileData;
  
//         setPhotos(filteredPhotos);
//       } else {
//         setError(data.error || 'Failed to fetch data.');
//       }
//     } catch (err) {
//       setError('Network request failed: ' + err.message);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };
  
//   useEffect(() => {
//     if (locationId && chapterType) {
//       fetchPhotos();
//     }
//   }, [locationId, chapterType, selectedDate]);

//   const handleDateChange = (date) => {
//     setSelectedDate(date);
//     setDatePickerVisible(false);
//     fetchPhotos();
//   };

//   const handleRefresh = () => {
//     setRefreshing(true);
//     fetchPhotos();
//   };

//   if (loading && !refreshing) {
//     return <ActivityIndicator size="large" color="#2e3192" />;
//   }

//   if (error) {
//     return <Text style={styles.errorText}>{error}</Text>;
//   }
  
//   const renderItem = ({ item }) => {
//     const formattedDate = item.dateTime
//       ? new Date(item.dateTime).toLocaleDateString('en-IN', {
//           day: '2-digit',
//           month: 'long'
//         })
//       : 'Date not available';
    
//     return (
//       <View style={styles.postContainer}>
//         <View style={styles.header}>
//           <View style={styles.profileContainer}>
//             <Image source={{ uri: item.meetProfileImage }} style={styles.profileImageUser} />
//             <Image source={{ uri: item.profileImage }} style={styles.profileImageMeet} />
//             <View>
//               <TouchableOpacity 
//                 onPress={() =>
//                   navigation.navigate('MemberDetails', {
//                     userId: item.UserId,
//                     Profession: item.UserProfession,
//                   })
//                 }
//               > 
//                 <Text style={styles.profileNameUser}>{item.userName}</Text> 
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
//           <View style={styles.profileContainer}>
//             <View>
//               <TouchableOpacity 
//                 onPress={() =>
//                   navigation.navigate('MemberDetails', {
//                     userId: item.MeetId,
//                     Profession: item.meetProfession,
//                   })
//                 }
//               > 
//                 <Text style={styles.profileNameMeet}>{item.meetUsername}</Text> 
//               </TouchableOpacity>
//               <View style={styles.businessContainer}>  
//                 <MaterialIcons name="business-center" size={16} color="#908f90" />
//                 <Text style={styles.meetProfession}>{item.meetProfession}</Text>
//               </View>
//             </View>
//           </View>
//         </View>

//         <Image 
//           source={{ uri: item.postimage }}
//           style={styles.postImage} 
//           resizeMode="cover" 
//         />

//         <View style={styles.captionContainer}>
//           <Text style={styles.timestamp}>{formattedDate}</Text>
//         </View>
//       </View>
//     );
//   };
  
//   return (
//     <View style={styles.filterContainer}>
//       <View>
//         <TouchableOpacity onPress={() => setDatePickerVisible(true)} style={styles.filterButton}>
//           <Text style={styles.filterButtonText}>Filter by Date</Text>
//           <MaterialIcons name="filter-list" size={26} color="#2e3192" />
//         </TouchableOpacity>
//       </View>

//       {datePickerVisible && (
//         <DatePicker
//           modal
//           open={datePickerVisible}
//           date={selectedDate || new Date()}
//           mode="date"
//           onConfirm={handleDateChange}
//           onCancel={() => setDatePickerVisible(false)}
//         />
//       )}

//       <FlatList
//         data={photos}
//         renderItem={renderItem}
//         keyExtractor={(item, index) => index.toString()}
//         contentContainerStyle={styles.gridContainer}
//         refreshing={refreshing}
//         onRefresh={handleRefresh}
//             showsVerticalScrollIndicator={false} 
//         showsHorizontalScrollIndicator={false} 
//       />
//     </View>
//   );
// };



// const TabViewExample = ({ navigation }) => {
//   const layout = useWindowDimensions();
//   const [index, setIndex] = useState(0);
//   const [routes, setRoutes] = useState([]);
//   const userId = useSelector((state) => state.user?.userId);
//   const [businessInfo, setBusinessInfo] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchBusinessInfo = async () => {
//       try {
//         const response = await fetch(`${API_BASE_URL}/api/user/business-infodrawer/${userId}`);
//         const data = await response.json();

//         if (response.ok) {
//           const updatedRoutes = data.map((business, index) => ({
//             key: `business${index + 1}`,
//             title: business.BD,
//             chapterType: business.CT,
//             locationId: business.L,
//           }));
//           setRoutes(updatedRoutes);
//           setBusinessInfo(data);
//         } else {
//           console.error('Error fetching business info:', data.message);
//         }
//       } catch (error) {
//         console.error('API call error:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBusinessInfo();
//   }, [userId]);

//   const renderScene = ({ route }) => {
//     const business = businessInfo.find((b) => b.BD === route.title);
//     return (
//       <Post
//         chapterType={business?.CT}
//         locationId={business?.L}
//         navigation={navigation}
//       />
//     );
//   };

//   const renderTabBar = (props) => (
//     <TabBar
//       {...props}
//       indicatorStyle={{ backgroundColor: '#2e3192' }}
//       style={{ backgroundColor: '#F3ECF3' }}
//       activeColor="#2e3192"
//       inactiveColor="gray"
//       labelStyle={{ fontSize: 14 }}
//     />
//   );

//   if (loading) {
//     return <ActivityIndicator size="large" color="#2e3192" />;
//   }

//   return (
//     <TabView
//       navigationState={{ index, routes }}
//       renderScene={renderScene}
//       onIndexChange={setIndex}
//       initialLayout={{ width: layout.width }}
//       renderTabBar={renderTabBar}
//     />
//   );
// };

// export default TabViewExample;
























// import React, { useState, useEffect } from 'react';
// import { View, Text, Image, FlatList, ActivityIndicator, TouchableOpacity, useWindowDimensions } from 'react-native';
// import { API_BASE_URL } from '../constants/Config';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import { useSelector } from 'react-redux';
// import DatePicker from 'react-native-date-picker';
// import styles from '../components/layout/PostStyles';
// import { TabView, TabBar } from 'react-native-tab-view';

// const Post = ({ chapterType, locationId, navigation }) => {
//   const [photos, setPhotos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [refreshing, setRefreshing] = useState(false);

//   const fetchPhotos = async () => {
//     setRefreshing(true);
//     try {
//       const response = await fetch(`${API_BASE_URL}/getOneOnOneMeeting-subadmin?locationId=${locationId}&slotId=${chapterType}`);
//       const data = await response.json();
//       console.log('----------------User data ---------------', data);
  
//       if (response.ok && data.data) {
//         const photosWithProfileData = await Promise.all(
//           data.data.map(async (item) => {
//             // Fetch User Profile Image
//             const profileResponse = await fetch(`${API_BASE_URL}/profile-image?userId=${item.UserId}`);
//             const profileData = await profileResponse.json();
  
//             // Fetch Meet Profile Image
//             const meetProfileResponse = await fetch(`${API_BASE_URL}/profile-image?userId=${item.MeetId}`);
//             const meetProfileData = await meetProfileResponse.json();
//             console.log('----------------User data profileResponse ---------------', meetProfileData);
  
//             // Fetch Post Image
//             const ProfileResponseImgPath = await fetch(`${API_BASE_URL}/one-profile-image?userId=${item.Img_Path}`);
//             const ProfileDataImgPath = await ProfileResponseImgPath.json();
//             console.log('----------------User data ---------------', ProfileDataImgPath);
  
//             return {
//               ...item,
//               profileImage: profileData.imageUrl,
//               meetProfileImage: meetProfileData.imageUrl,
//               postimage: ProfileDataImgPath.imageUrl,
//               userName: data.Username || item.UserId,
//               meetUsername: data.MeetUsername,
//               userProfession: data.UserProfession,
//               meetProfession: data.MeetProfession,
//               userBusinessName: data.userbuisnessname,
//               dateTime: data.DateTime, // Ensure correct date format is used
//             };
//           })
//         );
  
//         // Sort photos by dateTime in descending order
//         photosWithProfileData.sort((a, b) => {
//           const dateA = new Date(a.DateTime);
//           const dateB = new Date(b.DateTime);
//           return dateB - dateA; // Descending order (most recent first)
//         });
  
//         // Update the state with sorted photos
//         setPhotos(photosWithProfileData);
//       } else {
//         setError(data.error || 'Failed to fetch data.');
//       }
//     } catch (err) {
//       setError('Network request failed: ' + err.message);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };
  
//   useEffect(() => {
//     if (locationId && chapterType) {
//       fetchPhotos();
//     }
//   }, [locationId, chapterType]);

//   const handleRefresh = () => {
//     setRefreshing(true);
//     fetchPhotos();
//   };

//   if (loading && !refreshing) {
//     return <ActivityIndicator size="large" color="#2e3192" />;
//   }

//   if (error) {
//     return <Text style={styles.errorText}>{error}</Text>;
//   }
  
//   const renderItem = ({ item }) => {
//     // Format the date as "DD MONTH" if dateTime exists
//     const formattedDate = item.DateTime
//       ? new Date(item.DateTime).toLocaleDateString('en-IN', {
//           day: '2-digit',
//           month: 'long'
//         })
//       : 'Date not available';
    
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
//                     userId: item.UserId,
//                     Profession: item.UserProfession,
//                   })
//                 }
//               > 
//                 <Text style={styles.profileNameUser}>{item.Username}</Text> 
//               </TouchableOpacity>
//               <View style={styles.businessContainer}>  
//                 <MaterialIcons name="business-center" size={16} color="#908f90" />
//                 <Text style={styles.userProfession}>{item.UserProfession}</Text>
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
//                     userId: item.MeetId,
//                     Profession: item.MeetProfession,
//                   })
//                 }
//               > 
//                 <Text style={styles.profileNameMeet}>{item.MeetUsername}</Text> 
//               </TouchableOpacity>
//               <View style={styles.businessContainer}>  
//                 <MaterialIcons name="business-center" size={16} color="#908f90" />
//                 <Text style={styles.meetProfession}>{item.MeetProfession}</Text>
//               </View>
//             </View>
//           </View>
//         </View>

//         {/* Post image */}
//         <Image 
//              source={{ uri: item.postimage }}
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
//     <View>
//       {/* Date Picker and Filter Button */}
//       <View style={styles.filterContainer}>
//         <TouchableOpacity onPress={() => setDatePickerVisible(true)} style={styles.filterButton}>
//         <Text style={styles.filterButtonText}>Filter by Date</Text>
//         <MaterialIcons name="filter-list" size={26} top={3} color="#2e3192" />
//         </TouchableOpacity>
//       </View>

//       {/* Date Picker Modal */}
//       {datePickerVisible && (
//         <DatePicker
//           modal
//           open={datePickerVisible}
//           date={selectedDate || new Date()}
//           mode="date"
//           onConfirm={(date) => {
//             setDatePickerVisible(false);
//             handleDateChange(date);
//           }}
//           onCancel={() => setDatePickerVisible(false)}
//         />
//       )}
//     <FlatList
//       data={photos}
//       renderItem={renderItem}
//       keyExtractor={(item, index) => index.toString()}
//       contentContainerStyle={styles.gridContainer}
//       refreshing={refreshing}
//       onRefresh={handleRefresh}
//     />
//          </View>

//   );
// };

// const TabViewExample = ({ navigation }) => {
//   const layout = useWindowDimensions();
//   const [index, setIndex] = useState(0);
//   const [routes, setRoutes] = useState([]);
//   const userId = useSelector((state) => state.user?.userId);
//   const [businessInfo, setBusinessInfo] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchBusinessInfo = async () => {
//       try {
//         const response = await fetch(`${API_BASE_URL}/api/user/business-infodrawer/${userId}`);
//         const data = await response.json();

//         if (response.ok) {
//           const updatedRoutes = data.map((business, index) => ({
//             key: `business${index + 1}`,
//             title: business.BD,
//             chapterType: business.CT,
//             locationId: business.L,
//           }));
//           setRoutes(updatedRoutes);
//           setBusinessInfo(data);
//         } else {
//           console.error('Error fetching business info:', data.message);
//         }
//       } catch (error) {
//         console.error('API call error:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBusinessInfo();
//   }, [userId]);

//   const renderScene = ({ route }) => {
//     const business = businessInfo.find((b) => b.BD === route.title);
//     return (
//       <Post
//         chapterType={business?.CT}
//         locationId={business?.L}
//         navigation={navigation}
//       />
//     );
//   };

//   const renderTabBar = (props) => (
//     <TabBar
//       {...props}
//       indicatorStyle={{ backgroundColor: '#2e3192' }}
//       style={{ backgroundColor: '#F3ECF3' }}
//       activeColor="#2e3192"
//       inactiveColor="gray"
//       labelStyle={{ fontSize: 14 }}
//     />
//   );

//   if (loading) {
//     return <ActivityIndicator size="large" color="#2e3192" />;
//   }

//   return (
//     <TabView
//       navigationState={{ index, routes }}
//       renderScene={renderScene}
//       onIndexChange={setIndex}
//       initialLayout={{ width: layout.width }}
//       renderTabBar={renderTabBar}
//     />
//   );
// };

// export default TabViewExample;
