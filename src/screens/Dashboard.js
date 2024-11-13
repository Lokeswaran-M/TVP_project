import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../components/layout/HomeStyles';

const Dashboard = ({ eventData, showAllEvents, setShowAllEvents, handleConfirmClick, isConfirmed }) => {
  return (
    <View style={styles.cards}>
      <View style={styles.dashboardContainer}>
        <Text style={styles.dashboardTitle}>Dashboard</Text>
        <TouchableOpacity onPress={() => setShowAllEvents(!showAllEvents)}>
          <Icon name={showAllEvents ? "angle-up" : "angle-down"} size={24} color="#a3238f" style={styles.arrowIcon} />
        </TouchableOpacity>
      </View>
      {eventData.length > 0 ? (
        eventData.slice(0, showAllEvents ? eventData.length : 1).map((event, index) => (
          <View key={event.EventId} style={styles.meetupCard}>
            <Text style={styles.meetupTitle}>Upcoming Business Meetup</Text>
            <View style={styles.row}>
              <Icon name="calendar" size={18} color="#6C757D" />
              <Text style={styles.meetupInfo}>
                {new Date(event.DateTime).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </Text>
              <Icon name="clock-o" size={18} color="#6C757D" />
              <Text style={styles.meetupInfo}>
                {new Date(event.DateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
            <View style={styles.row}>
              <Icon name="map-marker" size={18} color="#6C757D" />
              <Text style={styles.locationText}>{event.Place || 'Unknown Location'}</Text>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => handleConfirmClick(event.EventId, event.LocationID, event.SlotID)}
                disabled={isConfirmed[event.EventId] || event.Isconfirm === 1}
              >
                <Icon
                  name="check-circle"
                  size={24}
                  color={isConfirmed[event.EventId] || event.Isconfirm === 1 ? "#B0B0B0" : "#28A745"}
                />
                <Text style={styles.buttonText}>
                  {isConfirmed[event.EventId] || event.Isconfirm === 1
                    ? "Confirmed"
                    : "Click to Confirm"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.noMeetupCard}>
          <Text style={styles.noMeetupText}>No Upcoming Business Meetups</Text>
        </View>
      )}
    </View>
  );
};
export default Dashboard;