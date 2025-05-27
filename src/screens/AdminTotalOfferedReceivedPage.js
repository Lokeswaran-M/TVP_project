import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { API_BASE_URL } from '../constants/Config';
import Icon from 'react-native-vector-icons/MaterialIcons';

const TotalOfferedReceivedPage = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [overallData, setOverallData] = useState([]);
  const [activePage, setActivePage] = useState(0);
  const [fetchError, setFetchError] = useState(false);

  const pagerRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setFetchError(false);
      const res = await fetch(`${API_BASE_URL}/offeredReceivedTotals/Admin`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const json = await res.json();
      setOverallData(json.reviews || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setFetchError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const renderOverallItem = ({ item, index }) => (
    <View style={[styles.card, index === 0 && styles.firstCard]}>
      <View style={styles.cardContent}>
        <View style={styles.userPair}>
          <Text style={styles.userFrom}>{item.ReviewerUsername || 'Unknown'}</Text>
          <Icon name="arrow-forward" size={16} color="#6b7280" />
          <Text style={styles.userTo}>{item.ReviewedUserUsername || 'Unknown'}</Text>
                 <Text style={styles.amount}>
          ₹{Number(item.Amount).toLocaleString('en-IN')}
        </Text>
        </View>
    {item.LocationName && (
  <Text style={styles.locationText}>
    Location: {item.LocationName.split(' - ')[0]}
  </Text>
)}
      </View>
    </View>
  );

  const renderTabBar = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, activePage === 0 && styles.activeTab]}
        onPress={() => setActivePage(0)}
      >
        <Text style={[styles.tabText, activePage === 0 && styles.activeTabText]}>
          All Transactions
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>

      {renderTabBar()}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>Loading transaction data...</Text>
        </View>
      ) : fetchError ? (
        <View style={styles.emptyState}>
          <Icon name="error-outline" size={48} color="#ef4444" />
          <Text style={styles.emptyStateText}>Error loading data</Text>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={handleRefresh}
          >
            <Text style={styles.refreshButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.pagerView}>
          <View key="1" style={styles.page}>
            <Text style={styles.sectionSubtitle}>
              All transactions across locations
            </Text>
            {overallData.length > 0 ? (
              <FlatList
                data={overallData}
                keyExtractor={(item, index) => `${item.ReviewId}_${index}`}
                renderItem={renderOverallItem}
                contentContainerStyle={styles.listContent}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                ListHeaderComponent={
                  <View style={styles.summaryHeader}>
                    <Text style={styles.summaryHeaderText}>
                      Total Records: {overallData.length}
                    </Text>
                  </View>
                }
              />
            ) : (
              <View style={styles.emptyState}>
                <Icon name="receipt" size={48} color="#d1d5db" />
                <Text style={styles.emptyStateText}>No transactions found</Text>
                <Text style={styles.emptyStateSubtext}>
                  There are no transactions recorded yet
                </Text>
                <TouchableOpacity 
                  style={styles.refreshButton}
                  onPress={handleRefresh}
                >
                  <Text style={styles.refreshButtonText}>Refresh Data</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#10b981',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#10b981',
    fontWeight: '600',
  },
  pagerView: {
    flex: 1,
  },
  page: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  firstCard: {
    marginTop: 8,
  },
  cardContent: {
    flexDirection: 'column',
  },
  userPair: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userFrom: {
    flex: 0.4,
    fontSize: 16,
    fontWeight: '500',
    color: '#2e3091',
    marginRight: 8,
  },
  userTo: {
    flex: 0.4,
    fontSize: 15,
    color: '#000',
    marginLeft: 8,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
    alignItems: 'flex-end',
    flex: 0.3,
  },
  locationText: {
    fontSize: 14,
    color: '#6b7280',
  },
  listContent: {
    paddingBottom: 24,
  },
  summaryHeader: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  summaryHeaderText: {
    fontSize: 14,
    color: '#4b5563',
    textAlign: 'center',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#6b7280',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#374151',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  refreshButton: {
    marginTop: 24,
    backgroundColor: '#10b981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
});

export default TotalOfferedReceivedPage;