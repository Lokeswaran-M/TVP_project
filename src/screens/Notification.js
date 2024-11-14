import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, StyleSheet } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../constants/Config';
const Notification = () => {
  const userId = useSelector((state) => state.user?.userId);
  console.log("UserId in Notification--------------------------------", userId);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (userId) {
      const fetchNotifications = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/notifications?UserID=${userId}`);
          if (response.ok) {
            const data = await response.json();
            console.log("Data in the notification requirements--------------------------", data);
            setNotifications(data);
          } else {
            throw new Error('Failed to fetch notifications');
          }
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchNotifications();
    }
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      setNotifications(prevNotifications => [
        ...prevNotifications,
        remoteMessage.notification,
      ]);
    });
    return () => unsubscribe();
  }, [userId]);
  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : notifications.length > 0 ? (
        <FlatList
          data={notifications}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.notificationItem}>
              {item.IsRead == 0 && <View style={styles.unseenDot} />}
              <View style={styles.notificationText}>
                <Text style={styles.title}>{item.Title}</Text>
                <Text style={styles.body}>{item.Message}</Text>
              </View>
            </View>
          )}
        />
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
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  unseenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#a3238f',
    marginRight: 10,
  },
  notificationText: {
    flex: 1,
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
});
export default Notification;