import React, { useState, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  TouchableWithoutFeedback, 
  Modal, 
  ScrollView,
  ActivityIndicator,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API_BASE_URL } from '../constants/Config';
import { useSelector } from 'react-redux';

const BACKGROUND_COLOR = '#f5f7ff';
const ALTERNATE_COLOR = '#ffffff';
const COMPLETED_BG_COLOR = '#f5f7ff';

const CreatingMeeting = () => {
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({});
  const [meetingData, setMeetingData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const userId = useSelector((state) => state.UserId);

  const handleCreateMeeting = () => {
    navigation.navigate('NewMeeting');
  };

  const handleUpcomingMeet = (meeting) => {
    navigation.navigate('CreateMeetingViewPage', {
      userId: meeting.userId,
      eventId: meeting.EventId,
      location: meeting.Location,
      locationId: meeting.LocationID,
      dateTime: meeting.DateTime,
    });
  };
  const toggleOptions = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const closeOptions = () => {
    setActiveIndex(null);
  };
  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/business-infos/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }
      const data = await response.json();
      setProfileData(data);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchMeetingData = async () => {
    setLoading(true);
    try {
      const url = `${API_BASE_URL}/api/meetings/${userId}`;
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 404) {
          setMeetingData([]);
          return;
        }
        throw new Error('Failed to fetch meeting data');
      }
      const data = await response.json();
      setMeetingData(data);
    } catch (error) {
      console.error('Error fetching meeting data:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async () => {
    if (!selectedEventId) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/meetings/${userId}/${selectedEventId}`, {
        method: 'PUT',
      });
      if (!response.ok) {
        throw new Error('Failed to delete the meeting');
      }
      setShowDeleteModal(false);
      fetchMeetingData();
      closeOptions();
    } catch (error) {
      console.error('Error deleting meeting:', error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      closeOptions();
      fetchProfileData();
      fetchMeetingData();
    }, [userId])
  );
  const handleNo = () => {
    setShowDeleteModal(false);
    closeOptions();
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };
  const isToday = (dateString) => {
    const today = new Date();
    const meetingDate = new Date(dateString);
    return (
      today.getDate() === meetingDate.getDate() &&
      today.getMonth() === meetingDate.getMonth() &&
      today.getFullYear() === meetingDate.getFullYear()
    );
  };
  const isCompletedMeeting = (dateString) => {
    const now = new Date();
    const meetingDate = new Date(dateString);
    return meetingDate < now;
  };
  const { upcomingMeetings, completedMeetings } = useMemo(() => {
    const now = new Date();
    const upcoming = [];
    const completed = [];
    
    meetingData.forEach(meeting => {
      const meetingDate = new Date(meeting.DateTime);
      if (meetingDate < now) {
        completed.push(meeting);
      } else {
        upcoming.push(meeting);
      }
    });
    upcoming.sort((a, b) => new Date(a.DateTime) - new Date(b.DateTime));
    completed.sort((a, b) => new Date(b.DateTime) - new Date(a.DateTime));
    return { upcomingMeetings: upcoming, completedMeetings: completed };
  }, [meetingData]);
  const renderMeetingCard = (meeting, index, isCompleted = false) => {
    return (
      <View key={index} style={styles.cardWrapper}>
        <TouchableOpacity
          style={[
            styles.meetingCard,
            isToday(meeting.DateTime) && !isCompleted && styles.todayMeeting,
            isCompleted ? styles.completedMeeting : null,
            { backgroundColor: isCompleted 
              ? COMPLETED_BG_COLOR 
              : index % 2 === 0 ? BACKGROUND_COLOR : ALTERNATE_COLOR 
            }
          ]}
         onPress={() => {
  if (isCompleted) {
    navigation.navigate('CreateMeetingViewPage', {
      userId: meeting.userId,
      eventId: meeting.EventId,
      location: meeting.Location,
      locationId: meeting.LocationID,
      dateTime: meeting.DateTime,
    });
  } else {
    handleUpcomingMeet(meeting);
  }
}}
activeOpacity={0.7}
        >
          {isToday(meeting.DateTime) && !isCompleted && (
            <View style={styles.todayBadge}>
              <Text style={styles.todayText}>TODAY</Text>
            </View>
          )}
          
          {isCompleted && (
            <View style={styles.completedBadge}>
              <Text style={styles.completedText}>COMPLETED</Text>
            </View>
          )}
          
          <View style={styles.meetingDetails}>
            <View style={styles.dateTimeContainer}>
              <View style={styles.dateIconContainer}>
                <Icon name="calendar" size={16} color={isCompleted ? "#888" : "#2e3192"} />
                <Text style={[styles.dateText, isCompleted && styles.completedText1]}>
                  {formatDate(meeting.DateTime)}
                </Text>
              </View>
              <View style={styles.timeIconContainer}>
                <Icon name="clock-o" size={16} color={isCompleted ? "#888" : "#2e3192"} />
                <Text style={[styles.timeText, isCompleted && styles.completedText1]}>
                  {formatTime(meeting.DateTime)}
                </Text>
              </View>
            </View>
            
            <View style={styles.locationContainer}>
              <Icon name="map-marker" size={16} color={isCompleted ? "#888" : "#2e3192"} />
              <Text 
                style={[styles.locationText, isCompleted && styles.completedText1]} 
                numberOfLines={1}
              >
                {meeting.Location}
              </Text>
            </View>
          </View>
          
          {!isCompleted && (
            <TouchableOpacity 
              style={styles.optionsButton} 
              onPress={(e) => {
                e.stopPropagation();
                toggleOptions(index);
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="ellipsis-v" size={18} color="#555" />
            </TouchableOpacity>
          )}
          
          {activeIndex === index && !isCompleted && (
            <View style={styles.optionsMenu}>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() =>
                  navigation.navigate('EditMeeting', {
                    eventId: meeting.EventId,
                    date: new Date(meeting.DateTime).toLocaleDateString(),
                    time: new Date(meeting.DateTime).toLocaleTimeString(),
                    location: meeting.Location,
                    locationId: meeting.LocationID,
                     dateTime: meeting.DateTime,
                  })
                }
              >
                <Icon name="pencil" size={14} color="white" style={styles.optionIcon} />
                <Text style={styles.optionText}>Edit</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.optionButton, styles.deleteOption]}
                onPress={() => {
                  setShowDeleteModal(true);
                  setSelectedEventId(meeting.EventId);
                }}
              >
                <Icon name="trash" size={14} color="white" style={styles.optionIcon} />
                <Text style={styles.optionText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };
  
  const renderEmptyState = (message) => (
    <View style={styles.emptyStateContainer}>
      <Icon name="calendar-times-o" size={50} color="#ccc" />
      <Text style={styles.emptyStateText}>{message}</Text>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <TouchableWithoutFeedback onPress={closeOptions}>
        <View style={styles.container}>
          <TouchableOpacity 
            style={styles.createButton} 
            onPress={handleCreateMeeting}
            activeOpacity={0.8}
          >
            <Icon name="plus" size={16} color="white" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Create New Meeting</Text>
          </TouchableOpacity>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2e3192" />
              <Text style={styles.loadingText}>Loading meetings...</Text>
            </View>
          ) : (
            <ScrollView 
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Upcoming Meetings</Text>
                
                {upcomingMeetings.length > 0 ? (
                  upcomingMeetings.map((meeting, index) => 
                    renderMeetingCard(meeting, index)
                  )
                ) : (
                  renderEmptyState("No upcoming meetings")
                )}
              </View>
              {completedMeetings.length > 0 && (
                <View style={[styles.sectionContainer, styles.completedSection]}>
                  <Text style={[styles.sectionTitle, styles.completedSectionTitle]}>
                    Completed Meetings
                  </Text>
                  
                  {completedMeetings.map((meeting, index) => 
                    renderMeetingCard(meeting, `completed-${index}`, true)
                  )}
                </View>
              )}
              
              {meetingData.length === 0 && (
                <View style={styles.emptyStateContainer}>
                  <Icon name="calendar-times-o" size={50} color="#ccc" />
                  <Text style={styles.emptyStateText}>No meetings scheduled</Text>
                  <Text style={styles.emptyStateSubText}>
                    Create a new meeting to get started!
                  </Text>
                </View>
              )}
            </ScrollView>
          )}
        </View>
      </TouchableWithoutFeedback>
      <Modal
        transparent={true}
        animationType="fade"
        visible={showDeleteModal}
        onRequestClose={handleNo}
      >
        <TouchableWithoutFeedback onPress={handleNo}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <Icon name="exclamation-triangle" size={30} color="#ff6b6b" style={styles.modalIcon} />
                <Text style={styles.modalTitle}>Delete Meeting</Text>
                <Text style={styles.modalText}>
                  Are you sure you want to delete this meeting? This action cannot be undone.
                </Text>
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.cancelButton]} 
                    onPress={handleNo}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.deleteButton]} 
                    onPress={handleDelete}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
  },
  createButton: {
    backgroundColor: '#2e3192',
    paddingVertical: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#2e3192',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  completedSection: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#444',
    paddingLeft: 5,
  },
  completedSectionTitle: {
    color: '#666',
  },
  cardWrapper: {
    position: 'relative',
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'visible',
  },
  meetingCard: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  todayMeeting: {
    borderLeftWidth: 4,
    borderLeftColor: '#2e3192',
  },
  completedMeeting: {
    borderLeftWidth: 0,
    elevation: 1,
    shadowOpacity: 0.05,
    opacity: 0.8,
  },
  todayBadge: {
    position: 'absolute',
    top: -10,
    right: 10,
    backgroundColor: '#2e3192',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedBadge: {
    position: 'absolute',
    top: -10,
    right: 10,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderColor: '#888',
    borderWidth: 1,
  },
  todayText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  completedText: {
    color: '#888',
    fontSize: 10,
  },
    completedText1: {
    color: '#888',
  },
  meetingDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  dateIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  timeIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#444',
    fontWeight: '500',
  },
  timeText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#444',
    fontWeight: '500',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  optionsButton: {
    padding: 8,
  },
  optionsMenu: {
    position: 'absolute',
    backgroundColor: '#444',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 9999,
    right: 10,
    top: 10,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  deleteOption: {
    borderBottomWidth: 0,
  },
  optionIcon: {
    marginRight: 8,
  },
  optionText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    marginTop: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptyStateSubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalIcon: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  modalText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#ff6b6b',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default CreatingMeeting;