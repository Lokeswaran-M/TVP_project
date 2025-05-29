import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import { API_BASE_URL } from '../constants/Config';
import Icon from 'react-native-vector-icons/MaterialIcons';

const TotalOfferedReceivedPage = ({ route }) => {
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
      const res = await fetch(
        `${API_BASE_URL}/offeredReceivedTotals?locationId=${locationId}&userId=${userId}`
      );
      const json = await res.json();
      console.log('Fetched data:', json);
      setOverallData(json.overall || []);
      setIndividualData(json.individual || []);
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

  const renderOverallItem = ({ item, index }) => {
    
     const date = new Date(item.DateTime);

  // Manually convert to IST (UTC+5:30)
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(date.getTime() + istOffset);

  const day = istDate.getDate().toString().padStart(2, '0');
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const month = monthNames[istDate.getMonth()];
  const year = istDate.getFullYear();

  let hours = istDate.getHours();
  const minutes = istDate.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;

  const formattedDate = `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
    
    
   return (
    <View style={[styles.card, index === 0 && styles.firstCard]}>
      <View style={styles.cardContent}>
        <View style={styles.userPair}>
          <Text style={styles.userFrom}>{item.Username}</Text>
          <Icon name="arrow-forward" size={16} color="#6b7280" />
          <Text style={styles.userTo}>{item.ReviewedUser}</Text>
        </View>
       <View style={styles.userPair}> 
               <Text style={styles.amount}>
          ₹{Number(item.Amount).toLocaleString('en-IN')}
        </Text>
         <Text style={styles.dateTime}>{formattedDate}</Text>
       </View>

      </View>
    </View>
  );
  };


const renderIndividualItem = ({ item, index }) => {
  const isGiven = item.ReviewType === 'Given';
  const labelColor = isGiven ? '#ef4444' : '#10b981';

  const date = new Date(item.DateTime);

  // Manually convert to IST (UTC+5:30)
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(date.getTime() + istOffset);

  const day = istDate.getDate().toString().padStart(2, '0');
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const month = monthNames[istDate.getMonth()];
  const year = istDate.getFullYear();

  let hours = istDate.getHours();
  const minutes = istDate.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;

  const formattedDate = `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;

  return (
    <View style={[styles.card, index === 0 && styles.firstCard]}>
      <View style={styles.cardContent}>
        <View style={styles.userPair}>
          <Text style={styles.userFrom}>{item.MainUserName}</Text>
          {/* <Icon name="arrow-forward" size={16} color="#6b7280" /> */}
          <Text style={styles.userTo}>{item.OtherUserName}</Text>
        </View>

        <View style={styles.amountRow}>
          <Text style={styles.amount}>₹{Number(item.Amount).toLocaleString('en-IN')}</Text>
           <Icon name="arrow-forward" size={16} color="#6b7280" />
          <Text style={[styles.label, { color: labelColor }]}>
            ({item.ReviewType})
          </Text>
        </View>

        {/* <Text style={styles.description}>{item.Description?.trim()}</Text> */}
        <Text style={styles.dateTime}>{formattedDate}</Text>
      </View>
    </View>
  );
};


  const renderTabBar = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, activePage === 0 && styles.activeTab]}
        onPress={() => {
          setActivePage(0);
          pagerRef.current?.setPage(0);
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
          pagerRef.current?.setPage(1);
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
          {/* Overall Page */}
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
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
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
                <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
                  <Text style={styles.refreshButtonText}>Refresh Data</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Individual Page */}
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
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
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
                <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
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
    backgroundColor: '#f9fafb',
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 1,
  },
  firstCard: { marginTop: 8 },
  cardContent: { flexDirection: 'column' },
  userPair: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  userFrom: { fontWeight: 'bold', color: '#2e3091' ,fontSize: 16},
  userTo: { fontWeight: 'bold', color: '#2e3091',fontSize: 16, justifyContent: 'center' , alignItems: 'center'},
  dateTime: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
  },
  amount: { fontSize: 16, fontWeight: 'bold', color: '#10b981' },
  amountRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
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
    fontSize: 16,
    fontWeight: '600',
    color: '#9ca3af',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  refreshButton: {
    backgroundColor: '#10b981',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default TotalOfferedReceivedPage;