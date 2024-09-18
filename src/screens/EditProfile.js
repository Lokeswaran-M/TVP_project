import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '../constants/Config';
const EditProfile = () => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({});
  const userId = useSelector((state) => state.user?.userId);
  const [username, setName] = useState('');
  const [profession, setProfession] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/business-info/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }
      const data = await response.json();
      if (response.status === 404) {
        setProfileData({});
      } else {
        setProfileData(data);
        setName(data.Name || '');
        setProfession(data.Profession || '');
        setBusinessName(data.BusinessName || '');
        setDescription(data.Description || '');
        setAddress(data.Address || '');
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleSave = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/update-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.userId,
          username,
          profession,
          businessName,
          description,
          address,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        alert('Profile updated successfully');
        navigation.goBack();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating profile');
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchProfileData();
    }, [userId])
  );
  return (
    <ScrollView style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Name</Text>
      </View>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setName}
      />
      <View style={styles.row}>
        <Text style={styles.label}>Profession</Text>
      </View>
      <TextInput
        style={styles.input}
        value={profession}
        onChangeText={setProfession}
      />
      <View style={styles.row}>
        <Text style={styles.label}>Business Name</Text>
      </View>
      <TextInput
        style={styles.input}
        value={businessName}
        onChangeText={setBusinessName}
      />
      <View style={styles.row}>
        <Text style={styles.label}>Description (250 words)</Text>
      </View>
      <TextInput
        style={styles.input}
        multiline
        value={description}
        onChangeText={setDescription}
      />
      <View style={styles.row}>
        <Text style={styles.label}>Business Address</Text>
      </View>
      <TextInput
        style={styles.input}
        multiline
        value={address}
        onChangeText={setAddress}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <FontAwesome name="save" size={20} color="#fff" />
          <Text style={styles.buttonText}> Save</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.exitButton} 
          onPress={() => navigation.goBack()}
        >
          <FontAwesome name="times" size={20} color="#C23A8A" />
          <Text style={[styles.buttonText, { color: '#C23A8A' }]}> Exit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: '#C23A8A',
    fontWeight: 'bold',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#888',
    fontSize: 16,
    paddingVertical: 8,
    marginBottom: 15,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#C23A8A',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
  },
  exitButton: {
    flexDirection: 'row',
    borderColor: '#C23A8A',
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 5,
  },
});

export default EditProfile;