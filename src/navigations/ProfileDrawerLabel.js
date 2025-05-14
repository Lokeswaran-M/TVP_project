import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '../constants/Config';
const ProfileDrawerLabel = () => {
  const userId = useSelector((state) => state.UserId);
  const [isExpanded, setIsExpanded] = useState(false);
  const [businessInfo, setBusinessInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  useEffect(() => {
    const fetchBusinessInfo = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/user/business-infodrawer/${userId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Data in Profile Drawer----------', data);
        setBusinessInfo(data);
      } catch (error) {
        console.error('Error fetching business info:', error);
      } finally {
        setLoading(false);
      }
    };
    if (userId) {
      fetchBusinessInfo();
    }
  }, [userId]);
  const handleProfessionPress = (info) => {
    console.log('Profession and CategoryID pressed:', info);
    navigation.navigate('Profile screen', {
      screen: 'Profile',
      params: { 
        profession: info.BD || 'None', 
        categoryID: info.U || null 
      },
    });
  };  
  return (
    <View>
      <View style={styles.drawerLabel}>
        <Text style={styles.drawerLabelText}>View Profile</Text>
        <TouchableOpacity onPress={toggleExpand}>
          <Icon name={isExpanded ? "angle-up" : "angle-down"} size={18} color="black" style={styles.arrowIcon} />
        </TouchableOpacity>
      </View>
      {isExpanded && (
        <View>
          {loading ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : businessInfo.length > 0 ? (
            businessInfo.map((info, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.additionalItem} 
                onPress={() => handleProfessionPress(info)}
              >
                <Icon name="briefcase" size={18} color="black" />
                <Text style={styles.additionalItemText}>{info.BD || 'N/A'}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.additionalItemText}>No business information found.</Text>
          )}
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  drawerLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  drawerLabelText: {
    fontSize: 14,
    color: 'black',
    marginRight: 8,
  },
  arrowIcon: {
    marginLeft: 55,
  },
  additionalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    padding: 10,
    backgroundColor: '#f5f7ff',
    borderRadius: 5,
    borderColor: 'black',
    borderWidth: 0.8,
  },
  additionalItemText: {
    fontSize: 14,
    color: 'black',
    marginLeft: 8,
  },
});
export default ProfileDrawerLabel;