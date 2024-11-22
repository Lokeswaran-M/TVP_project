import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../constants/Config';
import profileImage from '../../assets/images/DefaultProfile.jpg';
const Notification = () => {
  const userId = useSelector((state) => state.user?.userId);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileImages, setProfileImages] = useState({});
  useEffect(() => {
    if (userId) {
      const fetchNotifications = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/notifications?UserID=${userId}`);
          if (response.ok) {
            const data = await response.json();
            setNotifications(data);
            await updateNotifications(userId);

            const uniqueUserIds = [...new Set(data.map((item) => item.SentBy))];
            uniqueUserIds.forEach((sentById) => {
              fetchProfileImage(sentById);
            });
          } else {
            throw new Error('Failed to fetch notifications');
          }
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      const fetchProfileImage = async (userId) => {
        try {
          const response = await fetch(`${API_BASE_URL}/profile-image?userId=${userId}`);
          const data = await response.json();
          const uniqueImageUrl = `${data.imageUrl}?t=${new Date().getTime()}`;

          if (response.ok) {
            setProfileImages((prevImages) => ({
              ...prevImages,
              [userId]: uniqueImageUrl,
            }));
          } else {
            console.error(`Failed to fetch profile image for UserId ${userId}`);
          }
        } catch (error) {
          console.error(`Error fetching profile image for UserId ${userId}:`, error);
        }
      };

      const updateNotifications = async (userId) => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/notifications/${userId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Failed to update notifications');
          }
        } catch (error) {
          console.error('Error updating notifications:', error);
        }
      };

      fetchNotifications();
    }
  }, [userId]);

  const getRelativeTime = (SentDateTime) => {
    const now = new Date();
    const sentDate = new Date(SentDateTime);
    const diffInSeconds = Math.floor((now - sentDate) / 1000);
    const secondsInMinute = 60;
    const secondsInHour = 3600;
    const secondsInDay = 86400;
    const secondsInMonth = secondsInDay * 30; 
    const secondsInYear = secondsInDay * 365;
    if (diffInSeconds < secondsInMinute) return `${diffInSeconds} sec ago`;
    if (diffInSeconds < secondsInHour) return `${Math.floor(diffInSeconds / secondsInMinute)} min ago`;
    if (diffInSeconds < secondsInDay) return `${Math.floor(diffInSeconds / secondsInHour)} hr ago`;
    if (diffInSeconds < secondsInMonth) return `${Math.floor(diffInSeconds / secondsInDay)} day${Math.floor(diffInSeconds / secondsInDay) > 1 ? 's' : ''} ago`;
    if (diffInSeconds < secondsInYear) return `${Math.floor(diffInSeconds / secondsInMonth)} month${Math.floor(diffInSeconds / secondsInMonth) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffInSeconds / secondsInYear)} year${Math.floor(diffInSeconds / secondsInYear) > 1 ? 's' : ''} ago`;
  };
  
  const renderData = (data) => {
    return data.length > 0 ? (
      data.map((item) => (
        <View key={item.Id} style={styles.notificationItem}>
          <Image
            source={profileImages[item.SentBy] ? { uri: profileImages[item.SentBy] } : profileImage}
            style={styles.profileImage}
          />
          <View style={styles.notificationText}>
            <Text style={styles.body}>{item.Message}</Text>
            <Text style={styles.time}>{getRelativeTime(item.SentDateTime)}</Text>
          </View>
        </View>
      ))
    ) : (
      <Text>No data found</Text>
    );
  };
  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : notifications.length > 0 ? (
        <ScrollView>{renderData(notifications)}</ScrollView>
      ) : (
        <Text>No notifications available</Text>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  notificationItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationText: {
    flex: 1,
    marginLeft: 10,
    position: 'relative',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#a3238f',
  },
  body: {
    fontSize: 14,
    color: 'black',
  },
  time: {
    fontSize: 12,
    color: 'gray',
    marginTop: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
export default Notification;