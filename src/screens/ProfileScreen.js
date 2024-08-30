import React, { useState, useCallback } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { API_BASE_URL } from '../constants/Config';

const Profile = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfileImage = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/profile-image`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }
      const data = await response.json();
      const uniqueImageUrl = `${data.imageUrl}?t=${new Date().getTime()}`;  // Add timestamp to avoid caching
      setImageUrl(uniqueImageUrl);
    } catch (error) {
      console.error('Error fetching profile image:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfileImage();
    }, [])
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
          />
        )
      )}
      <Text style={styles.text}>Profile</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: 420,
    height: 400,
    marginBottom: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Profile;