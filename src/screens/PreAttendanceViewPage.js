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
      const groupedMembers = {};
      
      data.forEach(member => {
        const userId = member.UserId;
        
        if (!groupedMembers[userId]) {
          groupedMembers[userId] = {
            ...member,
            professions: []
          };
        }
        if (member.Profession && !groupedMembers[userId].professions.includes(member.Profession)) {
          groupedMembers[userId].professions.push(member.Profession);
        }
      });
      const membersArray = Object.values(groupedMembers).map(member => ({
        ...member,
        Profession: member.professions.length > 0 ? member.professions.join(', ') : 'Not specified'
      }));

      const updatedMembers = await Promise.all(
        membersArray.map(async (member) => {
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

  const formatDateTime = (dateTime) => {
    if (!dateTime) return 'Not specified';
    const date = new Date(dateTime);
    return date.toLocaleString([], { 
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatLastRefreshed = () => {
    return lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Icon name="search" size={18} color="#6c7293" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search members..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearIcon}>
              <Icon name="times-circle" size={18} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#2e3192" />
          <Text style={styles.loadingText}>Loading members...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <View style={styles.errorIconContainer}>
            <Icon name="exclamation-triangle" size={48} color="#ef4444" />
          </View>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchMembers}>
            <Icon name="refresh" size={16} color="#fff" style={styles.retryIcon} />
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : filteredMembers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Icon name="users" size={48} color="#9ca3af" />
          </View>
          <Text style={styles.emptyTitle}>No members found</Text>
          <Text style={styles.emptySubtitle}>
            {searchQuery ? 'Try adjusting your search' : 'Pull down to refresh the list'}
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={filteredMembers}
            renderItem={({ item }) => (
              <View style={styles.memberCard}>
                <View style={styles.memberMainContent}>
                  <ProfilePic image={item.profileImage} name={item.Username} />
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{item.Username}</Text>
                    <View style={styles.professionContainer}>
                      <Icon name="briefcase" size={12} color="#6c7293" style={styles.professionIcon} />
                      <Text style={styles.memberRole}>{item.Profession || 'Not specified'}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.timeContainer}>
                  <View style={styles.timeChip}>
                    <Icon name="clock-o" size={10} color="#059669" style={styles.timeIcon} />
                    <Text style={styles.timeText}>
                      {formatDateTime(item.PreDateTime)}
                    </Text>
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
              <View style={styles.headerStats}>
                <View style={styles.statsCard}>
                  <Icon name="users" size={16} color="#2e3192" />
                  <Text style={styles.statsNumber}>{filteredMembers.length}</Text>
                  <Text style={styles.statsLabel}>Members</Text>
                </View>
                <View style={styles.lastUpdateInfo}>
                  <Icon name="refresh" size={12} color="#6c7293" />
                  <Text style={styles.lastUpdateText}>
                    Last updated: {formatLastRefreshed()}
                  </Text>
                </View>
              </View>
            }
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </View>
  );
};

const ProfilePic = ({ image, name }) => {
  const initial = name.charAt(0).toUpperCase();
  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];
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
      {/* <View style={styles.onlineIndicator} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8fafc',
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingLeft: 8,
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '400',
  },
  searchIcon: {
    opacity: 0.7,
  },
  clearIcon: {
    padding: 4,
  },
  headerStats: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2e3192',
    marginLeft: 8,
    marginRight: 4,
  },
  statsLabel: {
    fontSize: 16,
    color: '#6c7293',
    fontWeight: '500',
  },
  lastUpdateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  lastUpdateText: {
    fontSize: 12,
    color: '#6c7293',
    marginLeft: 6,
    fontWeight: '500',
  },
  memberList: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  memberCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 12,
    paddingHorizontal: 10,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  memberMainContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberInfo: {
    flex: 1,
    marginLeft: 16,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  professionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    top: 5,
  },
  professionIcon: {
    marginRight: 6,
    opacity: 0.7,
  },
  memberRole: {
    fontSize: 14,
    color: '#6c7293',
    fontWeight: '500',
  },
  timeContainer: {
    alignItems: 'flex-end',
    bottom: 55,
  },
  timeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  timeIcon: {
    marginRight: 6,
  },
  timeText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },
  profilePicContainer: {
    width: 50,
    height: 50,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profilePicText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },
  profileImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6c7293',
    fontWeight: '500',
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorIconContainer: {
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    color: '#6c7293',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#2e3192',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#2e3192',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  retryIcon: {
    marginRight: 8, 
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  // Empty States
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIconContainer: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6c7293',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default PreAttendanceViewPage;