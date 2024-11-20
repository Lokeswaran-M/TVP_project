import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
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
            console.log("Data for notification--------------------------", data);
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
          console.log("Data for Profile in Notifications------------------------------", data);

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

  const renderData = (data) => {
    console.log("data in the render data of the notification-------------------", data.UserID);
    return data.length > 0 ? (
      data.map((item) => (
        <View key={item.Id} style={styles.notificationItem}>
          <Image
            source={profileImages[item.SentBy] ? { uri: profileImages[item.SentBy] } : profileImage}
            style={styles.profileImage}
          />
          <View style={styles.notificationText}>
            <Text style={styles.title}>{item.Title}</Text>
            <Text style={styles.body}>{item.Message}</Text>
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
        renderData(notifications)
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
  unseenDot: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#a3238f',
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