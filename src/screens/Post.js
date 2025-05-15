import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator, TouchableOpacity, useWindowDimensions } from 'react-native';
import { API_BASE_URL } from '../constants/Config';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import DatePicker from 'react-native-date-picker';
import styles from '../components/layout/PostStyles';
import { TabView, TabBar } from 'react-native-tab-view';
import Subscription from './Subscription';
const Post = ({ locationId, navigation }) => {
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
      const response = await fetch(`${API_BASE_URL}/getOneOnOneMeeting-subadmin?locationId=${locationId}`);
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

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPhotos();
  };

  useEffect(() => {
    if (locationId) {
      fetchPhotos();
    }
  }, [locationId, startDate, endDate]);

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
  const userId = useSelector((state) => state.UserId);
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
          Profession: business?.BD 
        } 
      }} />;
    }
    return (
      <Post
        locationId={business?.L}
        navigation={navigation}
      />
    );
  };
  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: '#2e3192' }}
      style={{ backgroundColor: '#f5f7ff' }}
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