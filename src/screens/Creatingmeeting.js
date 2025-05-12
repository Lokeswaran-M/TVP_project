import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Modal, ScrollView } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API_BASE_URL } from '../constants/Config';
import { useSelector } from 'react-redux';

const CreatingMeeting = () => {
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({});
  const [meetingData, setMeetingData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null); // For selected meeting ID to delete
  const userId = useSelector((state) => state.user?.userId);

  const handleCreateMeeting = () => {
    navigation.navigate('NewMeeting');
  };

  const handleUpcomingMeet = (meeting) => {
    navigation.navigate('CreateMeetingViewPage', {
      userId: meeting.userId,
      eventId: meeting.EventId,
      location: meeting.Location,
      slotId: meeting.SlotID,
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

  return (
    <ScrollView>
      <TouchableWithoutFeedback onPress={closeOptions}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.button} onPress={handleCreateMeeting}>
            <Text style={styles.buttonText}>Create New Meeting</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Upcoming Business Meetup</Text>
          {meetingData.length > 0 ? (
            meetingData.map((meeting, index) => (
              <TouchableOpacity
                key={index}
                style={styles.meetingCard}
                onPress={() => handleUpcomingMeet(meeting)}
              >
                <View style={styles.meetingDetails}>
                  <Text style={styles.meetingTitle}>
                    <Icon name="calendar" size={18} />{' '}
                    {new Date(meeting.DateTime).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}{' '}
                    <Icon name="clock-o" size={20} />{' '}
                    {new Date(meeting.DateTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </Text>
                  <Text style={styles.meetingInfo}>
                    <Icon name="map-marker" size={14} /> {meeting.Location} Slot ID - {meeting.SlotID}
                  </Text>
                </View>
                <TouchableOpacity style={styles.optionsButton} onPress={() => toggleOptions(index)}>
                  <Icon name="ellipsis-h" size={20} color="#2e3192" />
                </TouchableOpacity>
                {activeIndex === index && (
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
                        })
                      }
                    >
                      <Text style={styles.optionText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.optionButton}
                      onPress={() => {
                        setShowDeleteModal(true);
                        setSelectedEventId(meeting.EventId);
                      }}
                    >
                      <Text style={styles.optionText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noDataText}>No meetings found</Text>
          )}
        </View>
      </TouchableWithoutFeedback>

      {/* Modal for confirmation */}
      {showDeleteModal && (
        <Modal transparent={true} animationType="fade" visible={showDeleteModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Are you sure you want to delete this meeting?</Text>
              <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={handleNo}  >
                  <Text style={styles.modalButtonText}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={handleDelete}>
                  <Text style={styles.modalButtonText}>Yes</Text>
                </TouchableOpacity>
            
              </View>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  button: {
    backgroundColor: '#2e3192',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  meetingCard: {
    backgroundColor: '#f9f3fb',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  meetingDetails: {
    flex: 1,
  },
  meetingTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2e3192',
  },
  meetingInfo: {
    fontSize: 14,
    color: '#2e3192',
    marginBottom: 4,
  },
  optionsButton: {
    padding: 10,
  },
  optionsMenu: {
    position: 'absolute',
    top: 35,
    right: 11,
    backgroundColor: '#2e3192',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  optionButton: {
    padding: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  optionText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noDataText: {
    textAlign: 'center',
    color: '#2e3192',
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    // alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    color: '#2e3192',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent:'space-between',
  },
  modalButton: {
    backgroundColor: '#2e3192',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    width:50,
    alignItems:'center',
  },

  modalButtonText: {
    color: 'white',
    fontWeight: '600',

  },
});

export default CreatingMeeting;
