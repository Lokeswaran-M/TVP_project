import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,ScrollView,
} from 'react-native';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../constants/Config';

const ReviewApprovalPage = () => {
  const [reviewsData, setReviewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null); // <- To hold selected review for confirmation
  const [modalVisible, setModalVisible] = useState(false); // <- For modal visibility

  const locationId = useSelector(state => state.LocationID);

const fetchReviews = useCallback(async (isRefresh = false) => {
  try {
    if (!locationId) {
      setError('Missing location ID');
      if (isRefresh) setRefreshing(false); else setLoading(false);
      return;
    }

    const response = await fetch(`${API_BASE_URL}/ReviewApproval?locationId=${locationId}`);
    const data = await response.json();
    console.log('Reviews data:', data); 
    if (response.ok) {
      setReviewsData(data);
      setError(null);
    } else {
      setError(data.error || 'Failed to load reviews');
    }
  } catch (err) {
    console.error(err);
    setError('Something went wrong while fetching reviews');
  } finally {
    if (isRefresh) setRefreshing(false);
    else setLoading(false);
  }
}, [locationId]);


useEffect(() => {
  fetchReviews(); // initial load
}, [fetchReviews]);

const onRefresh = () => {
  setRefreshing(true);
  fetchReviews(true); // pass true for refresh
};


  const handleApprove = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/ApproveReview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ UserId: selectedReview.UserId, Id: selectedReview.RowID }),
      });

      if (response.ok) {
        setReviewsData(prev =>
          prev.map(r =>
            r.RowID === selectedReview.RowID ? { ...r, IsApproved: 1 } : r
          )
        );
      } else {
        console.error('Failed to approve review');
      }
    } catch (err) {
      console.error('Error approving review', err);
    } finally {
      setModalVisible(false); // Close modal after action
    }
  };

const renderItem = ({ item }) => {
  const isApproved = item.IsApproved === true || item.IsApproved === 1;

  return (
    <View style={styles.reviewCard}>
      <View style={styles.TopRow}>
        <Text style={styles.userText}>
          {item.ReviewerUsername}   ➜   {item.ReviewedUsername}
        </Text>
        <Text style={styles.amount}>₹{Number(item.Amount).toLocaleString('en-IN')}</Text>
      </View>
      <Text style={styles.Description}>{item.Description}</Text>

      {!isApproved && (
        <TouchableOpacity
          style={styles.approveBtn}
          onPress={() => {
            setSelectedReview(item);
            setModalVisible(true);
          }}
        >
          <Text style={styles.approveBtnText}>Approve</Text>
        </TouchableOpacity>
      )}
      {isApproved && <Text style={styles.status}>Approved</Text>}
    </View>
  );
};


  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#4B5563" />;
  if (error) return <Text style={styles.error}>{error}</Text>;
  if (reviewsData.length === 0) return <Text style={styles.noData}>No reviews found</Text>;

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={reviewsData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        refreshing={refreshing}
        onRefresh={onRefresh}
        // ListHeaderComponent={<Text style={styles.header}>Review Approval</Text>}
      />

      {/* Confirmation Modal */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>Are you sure you want to approve this review?</Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, { backgroundColor: '#10b981' }]}
                onPress={handleApprove}
              >
                <Text style={styles.modalButtonText}>OK</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, { backgroundColor: '#d1d5db' }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.modalButtonText, { color: '#1f2937' }]}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  reviewCard: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderColor: '#e5e7eb',
    borderWidth: 1,
  },
  TopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e3192',
  },
  amount: {
    fontSize: 15,
    color: '#4b5563',
    marginTop: 4,
    fontWeight: '600',
  },
  Description: {
    fontSize: 14,
    color: '#374151',
    marginTop: 6,
  },
  status: {
    marginTop: 6,
    fontWeight: 'bold',
    color: '#10b981',
  },
  error: {
    color: 'red',
    marginTop: 20,
    textAlign: 'center',
  },
  noData: {
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 20,
  },
  approveBtn: {
    marginTop: 10,
    backgroundColor: '#10b981',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  approveBtnText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e3192',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    elevation: 4,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#1f2937',
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  modalButtonText: {
    fontSize: 15,
    color: 'white',
    fontWeight: '600',
  },
});

export default ReviewApprovalPage;


