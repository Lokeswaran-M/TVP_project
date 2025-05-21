import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { API_BASE_URL } from '../constants/Config';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import DatePicker from 'react-native-date-picker';
import styles from '../components/layout/PostStyles';

const Post = ({ navigation }) => {
  const [photos, setPhotos] = useState([]);
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [monthYearVisible, setMonthYearVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const userId = useSelector((state) => state.UserId);
  
  useEffect(() => {
    const fetchBusinessInfo = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/user/business-infodrawer/${userId}`);
        const data = await response.json();    
        if (response.ok && data.length > 0) {
          const paidBusiness = data.find(business => business.IsPaid === 1) || data[0];
          setSelectedBusiness({
            locationId: paidBusiness.L,
            profession: paidBusiness.BD,
            isPaid: paidBusiness.IsPaid
          });
        } else {
          setError('No business information found');
        }
      } catch (error) {
        console.error('API call error:', error);
        setError('Failed to fetch business information');
      }
    };
    
    fetchBusinessInfo();
  }, [userId]);
  
  useEffect(() => {
    if (selectedBusiness?.locationId && selectedBusiness?.profession) {
      fetchPhotos();
    }
  }, [selectedBusiness, startDate, endDate]);

  const fetchPhotos = async () => {
    if (!selectedBusiness?.locationId || selectedBusiness?.isPaid === 0) {
      return;
    }
    
    setRefreshing(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/getOneOnOneMeeting-subadmin?locationId=${selectedBusiness.locationId}&Profession=${selectedBusiness.profession}`
      );
      const data = await response.json();
      console.log('Photos data:-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-', data);

      if (response.ok && data.data) {
        if (data.data.length === 0) {
          setPhotos([]);
          setFilteredPhotos([]);
        } else {
          const photosWithProfileData = await Promise.all(
            data.data.map(async (item) => {
              const profileResponse = await fetch(`${API_BASE_URL}/profile-image?userId=${item.UserId}`);
              const profileData = await profileResponse.json();
              const meetProfileResponse = await fetch(`${API_BASE_URL}/profile-image?userId=${item.MeetId}`);
              const meetProfileData = await meetProfileResponse.json();
              const ProfileResponseImgPath = await fetch(`${API_BASE_URL}/one-profile-image?userId=${item.Img_Path}`);
              const ProfileDataImgPath = await ProfileResponseImgPath.json();

              return {
                ...item,
                profileImage: profileData.imageUrl,
                meetProfileImage: meetProfileData.imageUrl,
                postimage: ProfileDataImgPath.imageUrl,
                userName: item.Username || item.UserId,
                meetUsername: item.MeetUsername,
                userProfession: item.Profession,
                meetProfession: item.MeetProfession,
                userBusinessName: item.userbuisnessname,
                dateTime: item.DateTime,
              };
            })
          );
          photosWithProfileData.sort((a, b) => {
            const dateA = new Date(a.dateTime);
            const dateB = new Date(b.dateTime);
            return dateB - dateA;
          });
          if (startDate && endDate) {
            filterPhotosByDateRange(startDate, endDate, photosWithProfileData);
          } else {
            setPhotos(photosWithProfileData);
            setFilteredPhotos(photosWithProfileData);
          }
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
  
  const filterPhotosByDateRange = (start, end, photosToFilter) => {
    const filtered = photosToFilter.filter(photo => {
      const photoDate = new Date(photo.dateTime);
      return photoDate >= start && photoDate <= end;
    });
    setFilteredPhotos(filtered);
  };
  
  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (endDate) {
      filterPhotosByDateRange(date, endDate, photos);
    }
  };
  
  const handleEndDateChange = (date) => {
    setEndDate(date);
    if (startDate) {
      filterPhotosByDateRange(startDate, date, photos);
    }
  };
  
  const handleMonthYearChange = (date) => {
    const selectedMonthYear = new Date(date);
    setSelectedMonth(selectedMonthYear);
    filterPhotosByMonthYear(selectedMonthYear);
  };
  
  const filterPhotosByMonthYear = (monthYear) => {
    const filtered = photos.filter(photo => {
      const photoDate = new Date(photo.dateTime);
      return (
        photoDate.getMonth() === monthYear.getMonth() && 
        photoDate.getFullYear() === monthYear.getFullYear()
      );
    });
    setFilteredPhotos(filtered);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPhotos();
  };
  if (selectedBusiness?.isPaid === 0) {
    return <Subscription 
      navigation={navigation}
      route={{ 
        params: { 
          locationId: selectedBusiness.locationId, 
          Profession: selectedBusiness.profession 
        } 
      }} 
    />;
  }

  if (loading && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#2e3192" />
      </View>
    );
  }

  if (error) {
    renderEmptyComponent
  }
  
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
              {/* <TouchableOpacity 
                onPress={() =>
                  navigation.navigate('MemberDetails', {
                    userId: item.UserId,
                    Profession: item.UserProfession,
                  })
                }
              > */}
                            <View style={styles.businessContainer}>  
               <MaterialIcons name="business-center" size={16} color="#908f90" />
                <Text style={styles.profileNameUser}>{item.userName}</Text> 
              </View>
              {/* </TouchableOpacity> */}

            </View>
          </View>
          <View>
            <Text style={styles.profileName}>TO</Text>
          </View>
          <View style={styles.profileContainer}>
            <View>
              {/* <TouchableOpacity 
                onPress={() =>
                  navigation.navigate('MemberDetails', {
                    userId: item.MeetId,
                    Profession: item.meetProfession,
                  })
                }
              > */}
                              <View style={styles.businessContainer}>  
                <MaterialIcons name="business-center" size={16} color="#908f90" />
                <Text style={styles.profileNameMeet}>{item.meetUsername}</Text> 
              </View>
              {/* </TouchableOpacity> */}

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

  const renderEmptyComponent = () => {
    return (
      <View style={styles.noPostsContainer}>
        <MaterialIcons name="image-not-supported" size={60} color="#2e3192" />
        <Text style={styles.noPostsText}>No posts available</Text>
        <Text style={styles.noPostsSubText}>
          {selectedMonth ? 'No posts found for the selected month.' : 'There are no posts to display.'}
        </Text>
        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={handleRefresh}
        >
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
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
          date={selectedMonth || new Date(new Date().getFullYear(), new Date().getMonth(), 1)}
          mode="date"
          onConfirm={(date) => {
            handleMonthYearChange(date);
            setMonthYearVisible(false);
          }}
          onCancel={() => setMonthYearVisible(false)}
        />
      )}
      
      <FlatList
        data={filteredPhotos}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={filteredPhotos.length === 0 ? styles.emptyGridContainer : styles.gridContainer}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        showsVerticalScrollIndicator={false} 
        showsHorizontalScrollIndicator={false}
        ListEmptyComponent={renderEmptyComponent}
      />
    </View>
  );
};

export default Post;