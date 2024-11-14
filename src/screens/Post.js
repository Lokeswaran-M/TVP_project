import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator, TouchableOpacity, useWindowDimensions } from 'react-native';
import { API_BASE_URL } from '../constants/Config';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import styles from '../components/layout/PostStyles';
import { TabView, TabBar } from 'react-native-tab-view';

const Post = ({ chapterType, locationId, navigation }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPhotos = async () => {
    setRefreshing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/getOneOnOneMeeting-subadmin?locationId=${locationId}&slotId=${chapterType}`);
      const data = await response.json();
      console.log('----------------User data ---------------', data);
      
      if (response.ok && data.data) {
        const photosWithProfileData = await Promise.all(
          data.data.map(async (item) => {
            // Fetch User Profile Image
            const profileResponse = await fetch(`${API_BASE_URL}/profile-image?userId=${item.UserId}`);
            const profileData = await profileResponse.json();

            // Fetch Meet Profile Image
            const meetProfileResponse = await fetch(`${API_BASE_URL}/profile-image?userId=${item.MeetId}`);
            const meetProfileData = await meetProfileResponse.json();
            console.log('----------------User data profileResponse ---------------', meetProfileData);
            // Fetch Post Image
            const ProfileResponseImgPath = await fetch(`${API_BASE_URL}/one-profile-image?userId=${item.Img_Path}`);
            const ProfileDataImgPath = await ProfileResponseImgPath.json();
          
  
            console.log('----------------User data ---------------', ProfileDataImgPath);
  
            return {
              ...item,
              profileImage: profileData.imageUrl,
              meetProfileImage: meetProfileData.imageUrl,
              postimage: ProfileDataImgPath.imageUrl,
              userName: data.Username || item.UserId,
              meetUsername: data.MeetUsername,
              userProfession: data.UserProfession,
              meetProfession: data.MeetProfession,
              userBusinessName: data.userbuisnessname,
              dateTime: data.DateTime,
            };
          })
        );
        setPhotos(photosWithProfileData);
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
  
  useEffect(() => {
    if (locationId && chapterType) {
      fetchPhotos();
    }
  }, [locationId, chapterType]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPhotos();
  };

  if (loading && !refreshing) {
    return <ActivityIndicator size="large" color="#A3238F" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }
  
  const renderItem = ({ item }) => {
    // Format the date as "DD MONTH" if dateTime exists
    const formattedDate = item.dateTime
      ? new Date(item.dateTime).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'long'
        })
      : 'Date not available';
    
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
                    userId: item.UserId,
                    Profession: item.userProfession,
                  })
                }
              > 
                <Text style={styles.profileNameUser}>{item.Username}</Text> 
              </TouchableOpacity>
              <View style={styles.businessContainer}>  
                <MaterialIcons name="business-center" size={16} color="#908f90" />
                <Text style={styles.userProfession}>{item.UserProfession}</Text>
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
                    userId: item.MeetId,
                    Profession: item.meetProfession,
                  })
                }
              > 
                <Text style={styles.profileNameMeet}>{item.MeetUsername}</Text> 
              </TouchableOpacity>
              <View style={styles.businessContainer}>  
                <MaterialIcons name="business-center" size={16} color="#908f90" />
                <Text style={styles.meetProfession}>{item.MeetProfession}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Post image */}
        <Image 
             source={{ uri: item.postimage }}
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

const TabViewExample = ({ navigation }) => {
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

        if (response.ok) {
          const updatedRoutes = data.map((business, index) => ({
            key: `business${index + 1}`,
            title: business.BD,
            chapterType: business.CT,
            locationId: business.L,
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
      indicatorStyle={{ backgroundColor: '#A3238F' }}
      style={{ backgroundColor: '#F3ECF3' }}
      activeColor="#A3238F"
      inactiveColor="gray"
      labelStyle={{ fontSize: 14 }}
    />
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#A3238F" />;
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
};

export default TabViewExample;
