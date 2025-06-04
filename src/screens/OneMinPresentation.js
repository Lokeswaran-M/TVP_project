import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  ActivityIndicator, 
  Image,
  Modal,
  StyleSheet,
  RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { API_BASE_URL } from '../constants/Config';
import { useFocusEffect } from '@react-navigation/native';
const OneMinPresentation = ({ route, navigation }) => {
  const { eventId, locationId } = route.params;
  console.log("Event ID and Location ID:", eventId, locationId);
  const [searchQuery, setSearchQuery] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });
  const [paidModalVisible, setPaidModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  



useFocusEffect(
  React.useCallback(() => {
   onRefresh();
    return () => {
    };
  }, [])
);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    Promise.all([
      fetchAttendanceData(),
    ]).finally(() => {
      setRefreshing(false);
    });
  }, [eventId, locationId]);


  useEffect(() => {
    fetchAttendanceData();
  }, [eventId, locationId]);
useEffect(() => {
  if (attendanceData.length > 0) {
    const userMap = new Map();
    attendanceData.forEach(member => {
      if (!userMap.has(member.UserId)) {
        userMap.set(member.UserId, {
          ...member,
          professions: [member.Profession]
        });
      } else {
        const existingUser = userMap.get(member.UserId);
        if (!existingUser.professions.includes(member.Profession)) {
          existingUser.professions.push(member.Profession);
        }
      }
    });
    
    // Convert to array and sort - IsConfirmed: 0 first, then IsConfirmed: 1
    const sortedData = Array.from(userMap.values()).sort((a, b) => {
      if (a.IsConfirmed === b.IsConfirmed) return 0;
      return a.IsConfirmed ? 1 : -1;
    });
    
    setProcessedData(sortedData);
    console.log("Processed Data:", sortedData);
  }
}, [attendanceData]);

  const fetchAttendanceData = async () => {
    setRefreshing(true);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/attendance/${eventId}/${locationId}`);
      const data = await response.json();
      console.log("Attendance Data:=======================", data);

      if (!Array.isArray(data)) {
        setAttendanceData([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const updatedMembers = await Promise.all(data.map(async (member) => {
        try {
          const imageResponse = await fetch(`${API_BASE_URL}/profile-image?userId=${member.UserId}`);
          const imageData = imageResponse.ok ? await imageResponse.json() : {};
          member.profileImage = imageResponse.ok ? `${imageData.imageUrl}?t=${new Date().getTime()}` : null;
        } catch {
          member.profileImage = null;
        }
        const inTime = new Date(member.InTime);
        member.formattedInTime = inTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        try {
          const paymentRes = await fetch(`${API_BASE_URL}/api/EventPaymentView?UserId=${member.UserId}&eventId=${eventId}`);
          const paymentData = await paymentRes.json();
          if (paymentRes.ok && paymentData.length > 0) {
            member.isPaid = true;
            member.paidDate = new Date(paymentData[0].CreatedAt).toLocaleDateString();
          } else {
            member.isPaid = false;
            member.paidDate = null;
          }
        } catch {
          member.isPaid = false;
          member.paidDate = null;
        }

        return member;
      }));

      setAttendanceData(updatedMembers);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  const filteredMembers = processedData.filter(member =>
    member.Username && member.Username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAlarmPress = (member) => {
    navigation.navigate('StopWatch', { member, Post_Img: member.Post_Img , eventId });
  };

  const handlePaidPress = (userId) => {
    setSelectedUserId(userId);
    setPaidModalVisible(true);
  };

  const confirmPayment = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/EventPayment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UserId: selectedUserId,
          EventId: eventId,
          Status: 1 
        }),
      });
      const result = await response.json();
      
      if (response.ok) {
        const updatedProcessedData = processedData.map(member => 
          member.UserId === selectedUserId ? {...member, isPaid: true} : member
        );
        setProcessedData(updatedProcessedData);
        const updatedAttendanceData = attendanceData.map(member => 
          member.UserId === selectedUserId ? {...member, isPaid: true} : member
        );
        setAttendanceData(updatedAttendanceData);
      }
      showModal('Success', 'Payment recorded successfully');
      setPaidModalVisible(false);
    } catch (error) {
      console.error('Payment recording error:', error);
      showModal('Error', 'Failed to record payment. Please try again.');
      setPaidModalVisible(false);
    }
  };

  const showModal = (title, message) => {
    setModalContent({ title, message });
    setModalVisible(true);
  };

  const renderMember = ({ item }) => (
  <TouchableOpacity 
    style={[
      styles.memberItem,
      item.IsConfirmed === 1 && styles.disabledMemberItem
    ]} 
    onPress={() => !item.IsConfirmed && handleAlarmPress(item)}
  >
    <View style={styles.imageColumn}>
      <Image
        source={item.profileImage ? { uri: item.profileImage } : require('../../assets/images/DefaultProfile.jpg')}
        style={styles.profileImage}
      />
    </View>
    <View style={styles.textColumn}>
      <Text style={styles.memberName}>{item.Username}</Text>
      <View style={styles.professionContainer}>
        <MaterialCommunityIcons name="briefcase-outline" size={16} color="#666" style={styles.professionIcon} />
        <Text style={styles.memberRole} numberOfLines={2}>
          {item.professions && item.professions.length > 0 
            ? item.professions.join(', ') 
            : 'Member'}
        </Text>
      </View>
    </View>
    <View style={styles.alarmContainer}>
      <TouchableOpacity
        style={styles.paidButton}
        onPress={() => handlePaidPress(item.UserId)}
        disabled={item.isPaid}
      >
        <LinearGradient
          colors={item.isPaid ? ['#28a745', '#218838'] : ['#2e3192', '#3957E8']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {item.isPaid ? (
            <View style={styles.paidStatusContainer}>
              <Ionicons name="checkmark-circle" size={16} color="#fff" />
              <View>
                <Text style={styles.paidButtonText}>Paid</Text>
              </View>
            </View>
          ) : (
            <View style={styles.paidStatusContainer}>
              <MaterialIcons name="payment" size={16} color="#fff" />
              <Text style={styles.paidButtonText}>Mark as Paid</Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.timeContainer} 
        onPress={() => !item.IsConfirmed && handleAlarmPress(item)}
        disabled={item.IsConfirmed === 1}
      >
        <MaterialIcons 
          name="alarm" 
          size={28} 
          color={item.IsConfirmed === 1 ? "#ccc" : "#2e3091"} 
        />
        <Text style={[
          styles.memberTime,
          item.IsConfirmed === 1 && styles.disabledTime
        ]}>
          {item.formattedInTime}
        </Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);


  return (
    <LinearGradient
      colors={['#ffffff', '#f5f7ff']}
      style={styles.gradientContainer}
    >
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#3957E8" />
        ) : (
          <>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search by username..."
                placeholderTextColor="#666"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <View style={styles.searchIconContainer}>
                <Icon name="search" size={23} color="#3957E8" />
              </View>
            </View>
            
            {filteredMembers.length === 0 ? (
              <View style={styles.noResultsContainer}>
                <MaterialIcons name="search-off" size={50} color="#666" />
                <Text style={styles.noResultsText}>No users found</Text>
              </View>
            ) : (
              <FlatList
                data={filteredMembers}
                renderItem={renderMember}
                keyExtractor={(item) => item.UserId.toString()}
                contentContainerStyle={styles.memberList}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={fetchAttendanceData}
                    tintColor="#2e3192"
                  />
                }
              />
            )}
            <View style={styles.memberCountContainer}>
              <LinearGradient
                colors={['#2e3192', '#3957E8']}
                style={styles.countBadge}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <MaterialIcons name="people" size={20} color="#fff" style={styles.countIcon} />
                <Text style={styles.memberCountText}>Count: {filteredMembers.length}</Text>
              </LinearGradient>
            </View>
          </>
        )}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalView}>
              <LinearGradient
                colors={['#2e3192', '#3957E8']}
                style={styles.modalHeader}
              >
                <Text style={styles.modalTitle}>{modalContent.title}</Text>
              </LinearGradient>
              <Text style={styles.modalText}>{modalContent.message}</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={paidModalVisible}
          onRequestClose={() => setPaidModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalView}>
              <LinearGradient
                colors={['#2e3192', '#3957E8']}
                style={styles.modalHeader}
              >
                <MaterialIcons name="payment" size={24} color="#fff" style={styles.modalHeaderIcon} />
                <Text style={styles.modalTitle}>Confirm Payment</Text>
              </LinearGradient>
              <Text style={styles.modalText}>
                Are you sure you want to mark this member as paid?
              </Text>
              <View style={styles.modalButtonsRow}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setPaidModalVisible(false)}
                >
                  <MaterialIcons name="close" size={18} color="#333" />
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={confirmPayment}
                >
                  <MaterialIcons name="check" size={18} color="#fff" />
                  <Text style={styles.modalButtonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
  },
  searchIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  noResultsText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  memberList: {
    paddingHorizontal: 15,
  },
  memberItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    backgroundColor: '#F5F7FE',
    borderRadius: 10,
    marginVertical: 2,
    padding: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  imageColumn: {
    marginRight: 15,
    justifyContent: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  professionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  professionIcon: {
    marginRight: 4,
  },
  memberRole: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  alarmContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  timeContainer: {
    alignItems: 'center',
  },
  memberTime: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
  },
  paidButton: {
    overflow: 'hidden',
    borderRadius: 20,
    marginRight: 30,
  },
  gradient: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paidStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paidButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 4,
  },
  memberCountContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  countIcon: {
    marginRight: 6,
  },
  memberCountText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '85%',
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  modalHeaderIcon: {
    marginRight: 8,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalText: {
    padding: 20,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3957E8',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginBottom: 15,
    alignSelf: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  cancelButton: {
    backgroundColor: '#f2f2f2',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 5,
  },
  paidDateText: {
    fontSize: 10,
    color: '#fff',
    marginTop: 2,
    marginLeft: 4
  },
    disabledMemberItem: {
    opacity: 0.7,
  },
  disabledTime: {
    color: '#ccc',
  },
});

export default OneMinPresentation;