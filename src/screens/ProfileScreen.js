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
      const uniqueImageUrl = `${data.imageUrl}?t=${new Date().getTime()}`; 
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
      <View style={styles.topSection}>
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
      </View>
      <View style={styles.bottomSection}>
        <Text style={styles.text}>Name</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topSection: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom: 10,
    marginTop: 50,
  },
  bottomSection: {
    flex: 3,
    marginTop: 20,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 50,
  },
  image: {
    width: 420,
    height: 400,
    resizeMode: 'cover',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default Profile;