import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  Alert, 
  Modal,
  RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // Using Feather icons for a modern look
import { useSelector } from 'react-redux';
import styles from './HomeScreenStyles'; // Assuming you'll update the styles
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation, route }) => {
  // State management
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    events: [],
    requirements: [],
    reviews: [],
    topMembers: []
  });
  const [expandedSections, setExpandedSections] = useState({
    events: false,
    requirements: false,
    reviews: false
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Fetch data function
  const fetchDashboardData = async () => {
    setRefreshing(true);
    try {
      // Implement your API calls here to fetch dashboard data
      // This is a placeholder - replace with actual API calls
      const [eventsResponse, requirementsResponse, reviewsResponse, topMembersResponse] = await Promise.all([
        fetchEvents(),
        fetchRequirements(),
        fetchReviews(),
        fetchTopMembers()
      ]);

      setDashboardData({
        events: eventsResponse,
        requirements: requirementsResponse,
        reviews: reviewsResponse,
        topMembers: topMembersResponse
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch dashboard data');
    } finally {
      setRefreshing(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Section toggle handler
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Render top members section
  const renderTopMembers = () => {
    return (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Performing Members</Text>
          <TouchableOpacity 
            style={styles.toggleButton}
            onPress={() => toggleSection('topMembers')}
          >
            <Icon 
              name={expandedSections.topMembers ? 'chevron-up' : 'chevron-down'} 
              size={24} 
              color="#2e3192" 
            />
          </TouchableOpacity>
        </View>
        
        {dashboardData.topMembers.slice(0, expandedSections.topMembers ? undefined : 3).map((member, index) => (
          <View key={member.id} style={styles.memberCard}>
            <View style={styles.memberInfo}>
              <Image 
                source={{ uri: member.profileImage }} 
                style={styles.memberAvatar} 
              />
              <View>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberDetails}>
                  Contributions: ₹{member.totalContribution.toLocaleString()}
                </Text>
              </View>
            </View>
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>#{index + 1}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  // Render upcoming events
  const renderUpcomingEvents = () => {
    return (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <TouchableOpacity 
            style={styles.toggleButton}
            onPress={() => toggleSection('events')}
          >
            <Icon 
              name={expandedSections.events ? 'chevron-up' : 'chevron-down'} 
              size={24} 
              color="#2e3192" 
            />
          </TouchableOpacity>
        </View>
        
        {dashboardData.events.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="calendar" size={50} color="#ccc" />
            <Text style={styles.emptyStateText}>No upcoming events</Text>
          </View>
        ) : (
          dashboardData.events.slice(0, expandedSections.events ? undefined : 2).map(event => (
            <TouchableOpacity 
              key={event.id} 
              style={styles.eventCard}
              onPress={() => {
                setSelectedItem(event);
                setModalVisible(true);
              }}
            >
              <View style={styles.eventHeader}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventDate}>
                  {new Date(event.date).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.eventDetails}>
                <Icon name="map-pin" size={16} color="#2e3192" />
                <Text style={styles.eventLocation}>{event.location}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    );
  };

  // Render requirements section
  const renderRequirements = () => {
    return (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.toggleButton}
              onPress={() => toggleSection('requirements')}
            >
              <Icon 
                name={expandedSections.requirements ? 'chevron-up' : 'chevron-down'} 
                size={24} 
                color="#2e3192" 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => navigation.navigate('AddRequirement')}
            >
              <Icon name="plus" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        
        {dashboardData.requirements.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="clipboard" size={50} color="#ccc" />
            <Text style={styles.emptyStateText}>No requirements</Text>
          </View>
        ) : (
          dashboardData.requirements.slice(0, expandedSections.requirements ? undefined : 2).map(requirement => (
            <View key={requirement.id} style={styles.requirementCard}>
              <View style={styles.requirementHeader}>
                <Image 
                  source={{ uri: requirement.userProfileImage }} 
                  style={styles.smallAvatar} 
                />
                <Text style={styles.requirementTitle}>
                  {requirement.userName}
                </Text>
              </View>
              <Text style={styles.requirementDescription}>
                {requirement.description}
              </Text>
              <TouchableOpacity 
                style={styles.acknowledgeButton}
                onPress={() => {
                  setSelectedItem(requirement);
                  setModalVisible(true);
                }}
              >
                <Text style={styles.acknowledgeButtonText}>
                  Acknowledge
                </Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
    );
  };

  // Render reviews section
  const renderReviews = () => {
    return (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Reviews</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.toggleButton}
              onPress={() => toggleSection('reviews')}
            >
              <Icon 
                name={expandedSections.reviews ? 'chevron-up' : 'chevron-down'} 
                size={24} 
                color="#2e3192" 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => navigation.navigate('AddReview')}
            >
              <Icon name="plus" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        
        {dashboardData.reviews.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="star" size={50} color="#ccc" />
            <Text style={styles.emptyStateText}>No reviews yet</Text>
          </View>
        ) : (
          dashboardData.reviews.slice(0, expandedSections.reviews ? undefined : 2).map(review => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Image 
                  source={{ uri: review.reviewerProfileImage }} 
                  style={styles.smallAvatar} 
                />
                <Text style={styles.reviewerName}>
                  {review.reviewerName}
                </Text>
              </View>
              <Text style={styles.reviewText}>
                {review.reviewText}
              </Text>
              <View style={styles.ratingContainer}>
                {[...Array(5)].map((_, index) => (
                  <Icon 
                    key={index} 
                    name="star" 
                    size={16} 
                    color={index < review.rating ? '#FFD700' : '#E0E0E0'} 
                  />
                ))}
              </View>
            </View>
          ))
        )}
      </View>
    );
  };

  // Detail Modal
  const renderDetailModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedItem && (
              <>
                <Text style={styles.modalTitle}>
                  {selectedItem.title || selectedItem.description}
                </Text>
                <Text style={styles.modalDescription}>
                  {selectedItem.details}
                </Text>
                <View style={styles.modalActions}>
                  <TouchableOpacity 
                    style={styles.modalCancelButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.modalCancelButtonText}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.modalConfirmButton}
                    onPress={() => {
                      // Implement confirmation logic
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.modalConfirmButtonText}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={fetchDashboardData}
          colors={['#2e3192']}
        />
      }
    >
      {renderTopMembers()}
      {renderUpcomingEvents()}
      {renderRequirements()}
      {renderReviews()}
      {renderDetailModal()}
    </ScrollView>
  );
};

export default HomeScreen;












// import { StyleSheet, Dimensions } from 'react-native';

// const { width } = Dimensions.get('window');

// export default StyleSheet.create({
//   // Container Styles
//   container: {
//     flex: 1,
//     backgroundColor: '#F7F8FC',
//     paddingHorizontal: 15,
//   },

//   // Section Container
//   sectionContainer: {
//     backgroundColor: 'white',
//     borderRadius: 12,
//     marginVertical: 10,
//     padding: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },

//   // Section Header
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#2e3192',
//   },
//   headerActions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   toggleButton: {
//     marginRight: 10,
//   },

//   // Add Button
//   addButton: {
//     backgroundColor: '#2e3192',
//     width: 35,
//     height: 35,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   // Top Members Styles
//   memberCard: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//     padding: 10,
//     backgroundColor: '#F5F5F5',
//     borderRadius: 10,
//   },
//   memberInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   memberAvatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 15,
//   },
//   memberName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//   },
//   memberDetails: {
//     fontSize: 14,
//     color: '#666',
//   },
//   rankBadge: {
//     backgroundColor: '#2e3192',
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 15,
//   },
//   rankText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: '600',
//   },

//   // Event Card Styles
//   eventCard: {
//     backgroundColor: '#F0F4FF',
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 10,
//   },
//   eventHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//   },
//   eventTitle: {
//     fontSize