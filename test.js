{meetingData.map((meeting, index) => (
  <View key={index} style={styles.meetingCard}>
    <View style={styles.meetingDetails}>
      <Text style={styles.meetingTitle}>
        <Icon name="calendar" size={18} /> {new Date(meeting.DateTime).toLocaleDateString()} {'   '}
        <Icon name="clock-o" size={18} /> {new Date(meeting.DateTime).toLocaleTimeString()}
      </Text>
      <Text style={styles.meetingInfo}>
        <Icon name="map-marker" size={14} /> {meeting.Location} Slot ID - {meeting.SlotID}
      </Text>
    </View>

    <View style={styles.actionButtons}>
      <TouchableOpacity 
        style={styles.qrButton} 
        onPress={() => navigation.navigate('GeneratedQRScreen', { eventId: meeting.EventId })}
      >
        <Text style={styles.qrButtonText}>View QR Code</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionsButton} onPress={() => toggleOptions(index)}>
        <Icon name="ellipsis-h" size={20} color="#a3238f" />
      </TouchableOpacity>
    </View>

    {activeIndex === index && (
      <View style={styles.optionsMenu}>
        <TouchableOpacity 
          style={styles.optionButton} 
          onPress={() => navigation.navigate('EditMeeting', { 
            eventId: meeting.EventId, 
            date: new Date(meeting.DateTime).toLocaleDateString(), 
            time: new Date(meeting.DateTime).toLocaleTimeString(), 
            location: meeting.Location, 
            locationId: meeting.LocationID
          })}
        >
          <Text style={styles.optionText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionButton} 
          onPress={() => {
            setShowDeleteModal(true);
            setActiveIndex(index);
          }}
        >
          <Text style={styles.optionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    )}
  </View>
))}
