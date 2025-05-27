import React, { useEffect, useState,useRef  } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import { API_BASE_URL } from '../constants/Config';
import Icon from 'react-native-vector-icons/MaterialIcons';

const TotalOfferedReceivedPage = ({ route, navigation }) => {
  const { userId, locationId } = route.params;
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [overallData, setOverallData] = useState([]);
  const [individualData, setIndividualData] = useState([]);
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
    const res = await fetch(`${API_BASE_URL}/offeredReceivedTotals?locationId=${locationId}&userId=${userId}`);
    const json = await res.json();
    setOverallData(json.overall || []);
    setIndividualData(json.individual || []);
  } catch (error) {
    console.error('Error fetching data:', error);
    setFetchError(true);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
}
  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const renderOverallItem = ({ item, index }) => (
    <View style={[styles.card, index === 0 && styles.firstCard]}>
      <View style={styles.cardContent}>
        <View style={styles.userPair}>
          <Text style={styles.userFrom}>{item.Username}</Text>
          <Icon name="arrow-forward" size={16} color="#6b7280" />
          <Text style={styles.userTo}>{item.ReviewedUser}</Text>
        </View>
        <Text style={styles.amount}>
          ₹{Number(item.Amount).toLocaleString('en-IN')}
        </Text>
      </View>
    </View>
  );

  const renderIndividualItem = ({ item, index }) => (
    <View style={[styles.card, index === 0 && styles.firstCard]}>
      <View style={styles.cardContent}>
        <View style={styles.userPair}>
          <Text style={styles.userFrom}>{item.Username}</Text>
          <Icon name="arrow-forward" size={16} color="#6b7280" />
          <Text style={styles.userTo}>{item.ReviewedUser}</Text>
        </View>
        <Text style={styles.amount}>
          ₹{Number(item.Amount).toLocaleString('en-IN')}
        </Text>
      </View>
    </View>
  );

  const renderTabBar = () => (
    <View style={styles.tabContainer}>
<TouchableOpacity
  style={[styles.tab, activePage === 0 && styles.activeTab]}
  onPress={() => {
    setActivePage(0);
    pagerRef.current?.setPage(0); // 👈 This is the fix
  }}
>
  <Text style={[styles.tabText, activePage === 0 && styles.activeTabText]}>
    Overall Transactions
  </Text>
</TouchableOpacity>

<TouchableOpacity
  style={[styles.tab, activePage === 1 && styles.activeTab]}
  onPress={() => {
    setActivePage(1);
    pagerRef.current?.setPage(1); // 👈 This is the fix
  }}
>
  <Text style={[styles.tabText, activePage === 1 && styles.activeTabText]}>
    Individual Transactions
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
          <Text style={styles.loadingText}>Loading summary data...</Text>
        </View>
      ) : (
<PagerView 
  ref={pagerRef}
  style={styles.pagerView} 
  initialPage={0}
  onPageSelected={(e) => setActivePage(e.nativeEvent.position)}
>

          <View key="1" style={styles.page}>
            <Text style={styles.sectionSubtitle}>
              Totals calculated for all users at this location
            </Text>
            {overallData.length > 0 ? (
              <FlatList
                data={overallData}
                keyExtractor={(item, index) => index.toString()}
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
                <Icon name="location-off" size={48} color="#d1d5db" />
                <Text style={styles.emptyStateText}>No location data available</Text>
                <Text style={styles.emptyStateSubtext}>
                  There are no transactions recorded for this location yet
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

          <View key="2" style={styles.page}>
            <Text style={styles.sectionSubtitle}>
              Detailed breakdown of individual transactions
            </Text>
            {individualData.length > 0 ? (
              <FlatList
                data={individualData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderIndividualItem}
                contentContainerStyle={styles.listContent}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                ListHeaderComponent={
                  <View style={styles.summaryHeader}>
                    <Text style={styles.summaryHeaderText}>
                      Total Transactions: {individualData.length}
                    </Text>
                  </View>
                }
              />
            ) : (
              <View style={styles.emptyState}>
                <Icon name="people-outline" size={48} color="#d1d5db" />
                <Text style={styles.emptyStateText}>No transaction data available</Text>
                <Text style={styles.emptyStateSubtext}>
                  There are no individual transactions recorded yet
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
        </PagerView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userPair: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  userFrom: {
    flex: 0.4,
    fontSize: 16,
    fontWeight: '500',
    color: '#2e3091',

  },
  userTo: {
    flex: 0.4,
    fontSize: 15,
    color: '#000',
    marginLeft: 8,
  },
  amount: {
    flex: 0.3,
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
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