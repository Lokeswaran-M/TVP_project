import React, { useEffect, useState } from 'react';
import { 
  Text, 
  View, 
  StyleSheet, 
  Image, 
  ScrollView, 
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl 
} from 'react-native';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../constants/Config';
import profileImage from '../../assets/images/DefaultProfile.jpg';
const PRIMARY_COLOR = '#2e3091';
const SECONDARY_COLOR = '#3d3fa3';
const LIGHT_PRIMARY = '#eaebf7';
const ACCENT_COLOR = '#ff6b6b';
const BACKGROUND_COLOR = '#f5f7ff';
const WHITE = '#ffffff';
const DARK_TEXT = '#333333';
const LIGHT_TEXT = '#6c7293';

const Notification = () => {
  const userId = useSelector((state) => state.user?.userId);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [profileImages, setProfileImages] = useState({});

  const fetchNotifications = async () => {
    if (!userId) return;
    
    try {
      setError(null);
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
      setRefreshing(false);
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

  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

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
  
  const NotificationItem = ({ item }) => (
    <TouchableOpacity style={styles.notificationItem}>
      <Image
        source={profileImages[item.SentBy] ? { uri: profileImages[item.SentBy] } : profileImage}
        style={styles.profileImage}
      />
      <View style={styles.notificationText}>
        <Text style={styles.body}>{item.Message}</Text>
        <Text style={styles.time}>{getRelativeTime(item.SentDateTime)}</Text>
      </View>
    </TouchableOpacity>
  );

  const EmptyNotifications = () => (
    <View style={styles.emptyContainer}>
      <Image 
        source={require('../../assets/images/DefaultProfile.jpg')} 
        style={styles.emptyImage} 
        resizeMode="contain"
      />
      <Text style={styles.emptyTitle}>No Notifications Yet</Text>
      <Text style={styles.emptyText}>When you receive notifications, they will appear here</Text>
    </View>
  );

  const ErrorComponent = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>Oops!</Text>
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={fetchNotifications}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={PRIMARY_COLOR} />
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      ) : error ? (
        <ErrorComponent />
      ) : (
        <ScrollView 
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[PRIMARY_COLOR]} />
          }
        >
          {notifications.length > 0 ? (
            notifications.map((item) => <NotificationItem key={item.Id} item={item} />)
          ) : (
            <EmptyNotifications />
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  scrollView: {
    flex: 1,
  },
  notificationItem: {
    padding: 16,
    backgroundColor: WHITE,
    marginBottom: 8,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: DARK_TEXT,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  notificationText: {
    flex: 1,
    marginLeft: 16,
    position: 'relative',
  },
  body: {
    fontSize: 14,
    color: DARK_TEXT,
    fontWeight: '400',
  },
  time: {
    fontSize: 12,
    color: LIGHT_TEXT,
    marginTop: 6,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: LIGHT_PRIMARY,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: DARK_TEXT,
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 80,
  },
  emptyImage: {
    width: 100,
    height: 100,
    opacity: 0.7,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: LIGHT_TEXT,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    marginTop: 80,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: ACCENT_COLOR,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: DARK_TEXT,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: WHITE,
    fontWeight: '600',
  }
});

export default Notification;