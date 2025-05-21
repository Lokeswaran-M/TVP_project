import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Image,
  RefreshControl,
  TouchableOpacity,
  ToastAndroid,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API_BASE_URL } from '../constants/Config';

const { width } = Dimensions.get('window');

const PreAttendanceViewPage = ({ route, navigation }) => {
  const { eventId } = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const showMessage = (message) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    }
  };

  const fetchMembers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/Pre-attendanceView?eventId=${eventId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch members.');
      }
      const data = await response.json();

      console.log('---------------------------Pre data--------------', data);

      const updatedMembers = await Promise.all(
        data.map(async (member) => {
          try {
            const imageResponse = await fetch(`${API_BASE_URL}/profile-image?userId=${member.UserId}`);
            if (imageResponse.ok) {
              const imageData = await imageResponse.json();
              member.profileImage = `${imageData.imageUrl}?t=${Date.now()}`;
            } else {
              member.profileImage = null;
            }
          } catch {
            member.profileImage = null; 
          }
          return member;
        })
      );

      setMembers(updatedMembers);
      setLastRefreshed(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [eventId]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setMembers([]); 
    fetchMembers()
      .then(() => {
        showMessage('Member list updated');
      })
      .catch((err) => {
        showMessage('Failed to refresh: ' + err.message);
      });
  }, [eventId]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  const filteredMembers = members.filter((member) =>
    member.Username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatLastRefreshed = () => {
    return lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#2e3192" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search members"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearIcon}>
            <Icon name="times-circle" size={18} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="#2e3192" style={styles.loader} />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Icon name="exclamation-circle" size={50} color="#e74c3c" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchMembers}>
            <Icon name="refresh" size={16} color="#fff" style={styles.retryIcon} />
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : filteredMembers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="users" size={50} color="#95a5a6" />
          <Text style={styles.emptyText}>No members found</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
            <Icon name="refresh" size={16} color="#2e3192" style={styles.refreshIcon} />
            <Text style={styles.refreshText}>Pull down to refresh</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={filteredMembers}
            renderItem={({ item }) => (
              <View style={styles.memberItem}>
                <ProfilePic image={item.profileImage} name={item.Username} />
                <View style={styles.memberText}>
                  <Text style={styles.memberName}>{item.Username}</Text>
                  <View style={styles.professionContainer}>
                    <Icon name="briefcase" size={14} color="#95a5a6" style={styles.professionIcon} />
                    <Text style={styles.memberRole}>{item.Profession || 'Not specified'}</Text>
                  </View>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.UserId.toString()}
            contentContainerStyle={styles.memberList}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#2e3192']}
                tintColor="#2e3192"
                title="Pull to refresh..."
                titleColor="#2e3192"
              />
            }
            ListHeaderComponent={
              <View style={styles.refreshInfoContainer}>
                <Icon name="clock-o" size={12} color="#888" />
                <Text style={styles.refreshInfoText}>
                  Last updated: {formatLastRefreshed()}
                </Text>
              </View>
            }
          />
          <View style={styles.memberCountContainer}>
            <Icon name="users" size={14} color="#2e3192" style={styles.countIcon} />
            <Text style={styles.memberCountText}>{filteredMembers.length}</Text>
          </View>
        </>
      )}
    </View>
  );
};

const ProfilePic = ({ image, name }) => {
  const initial = name.charAt(0).toUpperCase();
  const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
  const colorIndex = name.length % colors.length;
  
  return (
    <View 
      style={[
        styles.profilePicContainer, 
        !image && { backgroundColor: colors[colorIndex] }
      ]}
    >
      {image ? (
        <Image source={{ uri: image }} style={styles.profileImage} />
      ) : (
        <Text style={styles.profilePicText}>{initial}</Text>
      )}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f6fa',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 2,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e3192',
    marginLeft: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    margin: 15,
    paddingHorizontal: 15,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  searchIcon: {
    marginRight: 5,
  },
  clearIcon: {
    padding: 5,
  },
  memberList: {
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  memberItem: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberText: {
    flex: 1,
    marginLeft: 15,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  professionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  professionIcon: {
    marginRight: 6,
  },
  memberRole: {
    fontSize: 14,
    color: '#666',
  },
  arrowIcon: {
    marginLeft: 10,
  },
  memberCountContainer: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 15,
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#2e3192',
    borderWidth: 1.5,
  },
  countIcon: {
    marginRight: 5,
  },
  memberCountText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2e3192',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2e3192',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  retryIcon: {
    marginRight: 8, 
  },
  retryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#95a5a6',
    marginTop: 15,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    padding: 10,
  },
  refreshIcon: {
    marginRight: 8,
  },
  refreshText: {
    color: '#2e3192',
    fontSize: 14,
  },
  profilePicContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
  },
  profilePicText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  refreshInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 15,
    marginBottom: 10,
  },
  refreshInfoText: {
    fontSize: 12,
    color: '#888',
    marginLeft: 5,
  },
});

export default PreAttendanceViewPage;