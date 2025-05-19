import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  TextInput, 
  FlatList, 
  useWindowDimensions, 
  ActivityIndicator, 
  Text, 
  TouchableOpacity, 
  Image,
  RefreshControl,
  Alert,
  StyleSheet,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { API_BASE_URL } from '../constants/Config';
import { useSelector } from 'react-redux';
import { TabView, TabBar } from 'react-native-tab-view';
import Stars from './Stars';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import Subscription from './Subscription';

const TabContent = ({ locationId, userId }) => {
  const navigation = useNavigation();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchMembers = useCallback(async () => {
    try {
      setError(null);
      const membersResponse = await fetch(`${API_BASE_URL}/list-members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          LocationID: locationId,
          userId: userId,
        }),
      });
      
      if (!membersResponse.ok) {
        if (membersResponse.status === 404) {
          setMembers([]);
          return;
        }
        throw new Error(`Server responded with status: ${membersResponse.status}`);
      }
      const data = await membersResponse.json();
      console.log('Members data:---------------', data);
      if (!data.members || data.members.length === 0) {
        setMembers([]);
        return;
      }
      
      const updatedMembers = await Promise.all(data.members.map(async (member) => {
        try {
          let totalStars = 0;
          if (member.ratings && member.ratings.length > 0) {
            member.ratings.forEach(rating => {
              totalStars += parseFloat(rating.average) || 0;
            });
            const totalAverage = totalStars / member.ratings.length;
            member.totalAverage = totalAverage || 0;
          } else {
            member.totalAverage = 0;
          }
          
          const imageResponse = await fetch(`${API_BASE_URL}/profile-image?userId=${member.UserId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (imageResponse.ok) {
            const imageData = await imageResponse.json();
            const uniqueImageUrl = `${imageData.imageUrl}?t=${new Date().getTime()}`;
            member.profileImage = uniqueImageUrl;
          } else {
            console.error('Failed to fetch profile image:', member.UserId);
            member.profileImage = null;
          }
          return member;
        } catch (imgError) {
          console.error('Error processing member data:', imgError);
          member.profileImage = null;
          return member;
        }
      }));

      setMembers(updatedMembers);
    } catch (error) {
      console.error('Error fetching members:', error);
      if (!error.message.includes('404')) {
        setError('Failed to load members. Please try again.');
      } else {
        setMembers([]);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [locationId, userId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMembers();
  }, [fetchMembers]);

  const filteredMembers = members.filter(member =>
    member.Username && member.Username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2e3192" />
        <Text style={styles.loadingText}>Loading members...</Text>
      </View>
    );
  }

  if (error && !refreshing) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={50} color="#FF6B6B" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchMembers}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#8e8e93" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search members..."
          placeholderTextColor="#8e8e93"
          value={searchQuery}
          onChangeText={setSearchQuery}
          color="#2e3192"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <MaterialIcons name="cancel" size={18} color="#8e8e93" />
          </TouchableOpacity>
        )}
      </View>
      
      <FlatList
        data={filteredMembers}
        keyExtractor={(item) => item.UserId ? item.UserId.toString() : Math.random().toString()}
        contentContainerStyle={[
          styles.memberList,
          filteredMembers.length === 0 && styles.emptyListContent
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2e3192']}
            tintColor="#2e3192"
          />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="people-outline" size={70} color="#BDBDBD" />
            <Text style={styles.emptyText}>
              {searchQuery.length > 0 
                ? `No members matching "${searchQuery}"`
                : "No members found"}
            </Text>
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                style={styles.clearSearchButton}
                onPress={() => setSearchQuery('')}>
                <Text style={styles.clearSearchText}>Clear Search</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.memberCard}
            onPress={() =>
              navigation.navigate('MemberDetails', {
                userId: item.UserId,
                Profession: item.Profession,
              })
            }
            activeOpacity={0.7}
          >
            <View style={styles.imageColumn}>
              {item.profileImage ? (
                <Image
                  source={{ uri: item.profileImage }}
                  style={[
                    styles.profileImage,
                    item.RollId === 2 && styles.profileImageWithBorder,
                  ]}
                />
              ) : (
                <View style={[styles.profileImagePlaceholder, item.RollId === 2 && styles.profileImageWithBorder]}>
                  <MaterialIcons name="person" size={30} color="#BDBDBD" />
                </View>
              )}
              {item.RollId === 2 && (
                <View style={styles.crownContainer}>
                  <FontAwesome6 name="crown" size={15} color="#FFD700" />
                </View>
              )}
            </View>
            
          <View style={styles.textColumn}>
  <View style={styles.nameRatingRow}>
    <Text style={styles.memberName} numberOfLines={1}>
      {item.Username || "Unknown Member"}
    </Text>
    <View style={styles.ratingCompact}>
      <Stars averageRating={item.totalAverage} />
      <Text style={styles.ratingText}>
        {item.totalAverage ? item.totalAverage.toFixed(1) : "0.0"}
      </Text>
    </View>
  </View>

  <View style={styles.nameRatingRow}>
    <Text style={styles.memberRole} numberOfLines={1}>
      {item.Profession || "No profession listed"}
    </Text>
  </View>
</View>
            
            <MaterialIcons name="chevron-right" size={24} color="#8e8e93" style={styles.chevronIcon} />
          </TouchableOpacity>
        )}   
      />
      
      <View style={styles.countContainer}>
        <LinearGradient
          colors={['#2e3192', '#3957E8']}
          style={styles.memberCountContainer}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
        >
          <MaterialIcons name="group" size={18} color="white" />
          <Text style={styles.memberCountText}>
            {members.length} {members.length === 1 ? 'Member' : 'Members'}
          </Text>
        </LinearGradient>
      </View>
    </View>
  );
};

export default function MembersList() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([]);
  const userId = useSelector((state) => state.UserId);
  const [businessInfo, setBusinessInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const fetchBusinessInfo = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/user/business-infodrawer/${userId}`);
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        setRoutes([]);
        setBusinessInfo([]);
        return;
      }

      const updatedRoutes = data.map((business, index) => ({
        key: `business${index + 1}`,
        title: business.BD || `Business ${index + 1}`,
        locationId: business.L,
      }));
      
      setRoutes(updatedRoutes);
      setBusinessInfo(data);
    } catch (error) {
      console.error('API call error:', error);
      setError('Failed to load business information');
      Alert.alert(
        'Error',
        'Failed to load business information. Please try again later.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchBusinessInfo();
  }, [fetchBusinessInfo]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBusinessInfo();
  }, [fetchBusinessInfo]);

  const renderScene = ({ route }) => {
    const business = businessInfo.find((b) => b.BD === route.title);
    if (!business) {
      return (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={50} color="#FF6B6B" />
          <Text style={styles.errorText}>Business information not found</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchBusinessInfo}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    if (business?.IsPaid === 0) {
      return (
        <Subscription 
          navigation={navigation}
          route={{ 
            ...route, 
            params: { 
              locationId: business?.L, 
              Profession: business?.BD 
            } 
          }} 
        />
      );
    }
    
    return (
      <TabContent
        title={route.title}
        locationId={business?.L}
        userId={userId}
      />
    );
  };

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: '#2e3192' }}
      style={{ backgroundColor: '#f5f7ff' }}
      activeColor="#2e3192"
      inactiveColor="gray"
      labelStyle={{ fontSize: 14 }}
    />
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <StatusBar backgroundColor="#f5f7ff" barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2e3192" />
          <Text style={styles.loadingText}>Loading your businesses...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !refreshing) {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <StatusBar backgroundColor="#f5f7ff" barStyle="dark-content" />
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={70} color="#FF6B6B" />
          <Text style={styles.errorTitle}>Oops!</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchBusinessInfo}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (routes.length === 0) {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <StatusBar backgroundColor="#f5f7ff" barStyle="dark-content" />
        <View style={styles.emptyContainer}>
          <MaterialIcons name="business" size={70} color="#BDBDBD" />
          <Text style={styles.emptyTitle}>No Businesses Found</Text>
          <Text style={styles.emptyText}>You don't have any registered businesses yet</Text>
          <TouchableOpacity 
            style={styles.addBusinessButton}
            onPress={() => navigation.navigate('AddBusiness')}>
            <Text style={styles.addBusinessText}>Add Business</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar backgroundColor="#f5f7ff" barStyle="dark-content" />
      {refreshing && (
        <View style={styles.refreshIndicator}>
          <ActivityIndicator size="small" color="#2e3192" />
          <Text style={styles.refreshText}>Refreshing...</Text>
        </View>
      )}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
        swipeEnabled={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f7ff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f7ff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    margin: 16,
    paddingHorizontal: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '400',
  },
  clearButton: {
    padding: 5,
  },
  memberList: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  memberCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  imageColumn: {
    position: 'relative',
    marginRight: 15,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E1E1E1',
  },
  profileImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageWithBorder: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  crownContainer: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 3,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  textColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRatingRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},
ratingCompact: {
  flexDirection: 'row',
  alignItems: 'center',
  marginLeft: 8,
},
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e3192',
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 13,
    color: '#757575',
    marginLeft: 5,
  },
  chevronIcon: {
    marginLeft: 10,
  },
  countContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  memberCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  memberCountText: {
    color: 'white',
    fontWeight: '500',
    marginLeft: 8,
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#424242',
    marginTop: 15,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 20,
  },
  clearSearchButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 10,
  },
  clearSearchText: {
    color: '#2e3192',
    fontWeight: '500',
  },
  addBusinessButton: {
    backgroundColor: '#2e3192',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  addBusinessText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#424242',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#424242',
    marginTop: 15,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2e3192',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  refreshIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(46, 49, 146, 0.1)',
    paddingVertical: 6,
  },
  refreshText: {
    marginLeft: 8,
    color: '#2e3192',
    fontSize: 14,
  },
  tabBar: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabIndicator: {
    backgroundColor: '#2e3192',
    height: 3,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'none',
  },
  tab: {
    paddingVertical: 10,
  },
});