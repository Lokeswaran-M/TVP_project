import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { API_BASE_URL } from '../constants/Config';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DatePicker from 'react-native-date-picker';
import styles from '../components/layout/PostStyles';

const HeadAdminPostPage = ({ navigation }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [datePickerType, setDatePickerType] = useState('start');
  const [monthYearVisible, setMonthYearVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null); 

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
            const userId = filename.split('_')[0];

            const profileResponse = await fetch(`${API_BASE_URL}/profile-image?userId=${userId}`);
            const profileData = await profileResponse.json();

            const usernameResponse = await fetch(`${API_BASE_URL}/getOneOnOneMeeting-admin?userId=${userId}`);
            const usernameData = await usernameResponse.json();

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

        photosWithProfileData.sort((a, b) => {
          const dateA = new Date(a.dateTime);
          const dateB = new Date(b.dateTime);
          return dateB - dateA; // Descending order (most recent first)
        });

        setPhotos(photosWithProfileData);
        setFilteredPhotos(photosWithProfileData);
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

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (endDate) {
      filterPhotosByDateRange(date, endDate);
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    if (startDate) {
      filterPhotosByDateRange(startDate, date);
    }
  };

  const handleMonthYearChange = (date) => {
    const selectedMonthYear = new Date(date);
    setSelectedMonth(selectedMonthYear);
    filterPhotosByMonthYear(selectedMonthYear);
  };

  const filterPhotosByDateRange = (start, end) => {
    if (!start || !end) return;
    const filtered = photos.filter(photo => {
      const photoDate = new Date(photo.dateTime);
      return photoDate >= start && photoDate <= end;
    });
    setFilteredPhotos(filtered);
  };

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

  const renderItem = ({ item }) => {
    const formattedDate = item.dateTime
      ? new Date(item.dateTime).toLocaleDateString('en-IN', { day: '2-digit', month: 'long' })
      : 'Date not available';

    return (
      <View style={styles.postContainer}>
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            <Image source={{ uri: item.meetProfileImage }} style={styles.profileImageUser} />
            <Image source={{ uri: item.profileImage }} style={styles.profileImageMeet} />
            <View>
              <TouchableOpacity 
                onPress={() => navigation.navigate('MemberDetails', { userId: item.userId, Profession: item.userProfession })}>
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
          <View style={styles.profileContainer}>
            <View>
              <TouchableOpacity 
                onPress={() => navigation.navigate('MemberDetails', { userId: item.meetId, Profession: item.meetProfession })}>
                <Text style={styles.profileNameMeet}>{item.meetusername}</Text> 
              </TouchableOpacity>
              <View style={styles.businessContainer}>  
                <MaterialIcons name="business-center" size={16} color="#908f90" />
                <Text style={styles.meetProfession}>{item.meetProfession}</Text>
              </View>
            </View>
          </View>
        </View>
        <Image source={{ uri: `${API_BASE_URL}${item.imageUrl}` }} style={styles.postImage} resizeMode="cover" />
        <View style={styles.captionContainer}>
          <Text style={styles.timestamp}>{formattedDate}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.filterContainer}>
      {/* Monthly Filter Button */}
      <View style={styles.filterButtonContainer}>
        <TouchableOpacity onPress={() => setMonthYearVisible(true)} style={styles.filterButton}>
          <Text style={styles.filterButtonText}>Month/Year</Text>
        </TouchableOpacity>
      </View>

      {/* Date Picker Modal */}
      {monthYearVisible && (
        <DatePicker
          modal
          open={monthYearVisible}
          date={selectedMonth || new Date(new Date().getFullYear(), new Date().getMonth(), 1)} // Set the default date to the 1st of the current month
          mode="date"
          onConfirm={(date) => {
            handleMonthYearChange(date);
            setMonthYearVisible(false); // Close after selection
          }}
          onCancel={() => setMonthYearVisible(false)}
        />
      )}

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

export default HeadAdminPostPage;