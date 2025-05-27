import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator, 
  StyleSheet, 
  TouchableOpacity, 
  RefreshControl,
  StatusBar,
  Platform,
  Alert,Image 
} from 'react-native';
import { API_BASE_URL } from '../constants/Config';
import { useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ViewShot from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const HeadAdminPaymentsPage = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const viewShotRef = useRef();

  const userId = useSelector((state) => state.UserId);

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/EventPaymentViewMember?UserId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setPaymentHistory(data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Something went wrong while fetching payment history.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPaymentHistory();
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      const osVersion = Platform.Version;
      let permission;
      
      if (osVersion >= 30) {
        permission = PERMISSIONS.ANDROID.MANAGE_EXTERNAL_STORAGE;
      } else {
        permission = PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
      }

      try {
        const status = await check(permission);
        if (status === RESULTS.GRANTED) return true;
        if (status === RESULTS.DENIED) {
          const result = await request(permission);
          return result === RESULTS.GRANTED;
        }
        if (status === RESULTS.BLOCKED) {
          Alert.alert(
            'Permission Required',
            'Storage permission is needed to save invoices. Please enable it in settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() }
            ]
          );
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const captureAndDownloadInvoice = async (item) => {
    try {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        // Alert.alert('Permission Denied', 'Storage permission is required to save invoices');
        return;
      }

      // Create a temporary URI for the invoice
      const uri = await viewShotRef.current.capture();
      console.log('Invoice captured at:', uri);

      // Generate filename
      const date = new Date();
      const fileName = `invoice_${item.EventId}_${date.getTime()}.jpg`;
      const downloadsPath = RNFS.DownloadDirectoryPath;
      const filePath = `${downloadsPath}/${fileName}`;
      
      await RNFS.copyFile(uri, filePath);
      // Alert.alert('Success', `Invoice saved to Downloads folder as ${fileName}`);

      // Optional: Share the invoice
      await Share.open({
        url: `file://${filePath}`,
        type: 'image/jpeg',
        filename: fileName,
        saveToFiles: true,
      });

    } catch (error) {
      // console.error('Error capturing/downloading invoice:', error);
      // Alert.alert('Error', 'Failed to save invoice. Please try again.');
    }
  };

const renderInvoice = (item) => (
  <View style={styles.invoiceContainer}>
    {/* Logo Section */}
    <View style={styles.logoContainer}>
      <Image 
        source={require('../../assets/images/TPV.png')} // Ensure the path is correct
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
    
    <Text style={styles.invoiceTitle}>PAYMENT RECEIPT</Text>
    
    <View style={styles.invoiceContent}>
      <View style={styles.invoiceRow}>
        <Text style={styles.invoiceLabel}>Receipt Number:</Text>
        <Text style={styles.invoiceValue}>#{item.ReceiptNumber || '0001'}</Text>
      </View>
      <View style={styles.invoiceRow}>
        <Text style={styles.invoiceLabel}>Event ID:</Text>
        <Text style={styles.invoiceValue}>#{item.EventId}</Text>
      </View>
      <View style={styles.invoiceRow}>
        <Text style={styles.invoiceLabel}>User:</Text>
        <Text style={styles.invoiceValue}>{item.Username} (ID: {item.UserId})</Text>
      </View>
      <View style={styles.invoiceRow}>
        <Text style={styles.invoiceLabel}>Date:</Text>
        <Text style={styles.invoiceValue}>{formatDate(item.CreatedAt)}</Text>
      </View>
      <View style={styles.invoiceRow}>
        <Text style={styles.invoiceLabel}>Amount:</Text>
        <Text style={styles.invoiceValue}>₹{item.Amount || '650.00'}</Text>
      </View>
      <View style={styles.invoiceRow}>
        <Text style={styles.invoiceLabel}>Status:</Text>
        <Text style={[styles.invoiceValue, styles.statusSuccess]}>Payment Successful</Text>
      </View>
    </View>
    
    <View style={styles.invoiceFooter}>
      <Text style={styles.footerText}>Thank you for your payment!</Text>
      {/* <Text style={styles.footerContact}>Contact: support@tpv.com</Text> */}
    </View>
  </View>
);

  const renderItem = ({ item, index }) => (
    <View style={styles.itemContainer}>
      {/* Hidden invoice view for capturing */}
      <ViewShot 
        ref={viewShotRef}
        options={{ format: 'jpg', quality: 0.9 }}
        style={styles.hiddenViewShot}
      >
        {renderInvoice(item)}
      </ViewShot>
      
      {/* Visible payment card */}
      <LinearGradient
        colors={['#F5F7FE', '#F5F7FE']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.card, { marginTop: index === 0 ? 5 : 15 }]}
      >
        <View style={styles.iconContainer}>
          <MaterialIcon name="credit-card-check-outline" size={24} color="#2e3192" />
        </View>
        
        <View style={styles.cardContent}>
          <View style={styles.topRow}>
            <Text style={styles.eventIdLabel}>
              <Icon name="calendar" size={14} color="#2e3192" /> Event #{item.EventId}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="time-outline" size={14} color="#2e3192" style={{ marginLeft:25 ,marginRight:5,}} />
              <Text style={styles.date}>{formatDate(item.CreatedAt)}</Text>
            </View>
          </View>
          <View style={styles.userInfocon}>
            <View style={styles.userInfo}>
              <Text style={styles.username}>
                <Icon name="person" size={14} color="#2e3192" /> {item.Username}
              </Text>
              <Text style={styles.userId}>ID: {item.UserId}</Text>
            </View>
            
            <View style={styles.paymentStatus}>
              <Text style={styles.statusText}>
                <Icon name="checkmark-circle" size={14} color="green" /> Payment Successful
              </Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.downloadButton}
          onPress={() => captureAndDownloadInvoice(item)}
        >
          <Icon name="download-outline" size={20} color="#2e3192" />
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Icon name="receipt-outline" size={60} color="#2e3192" />
      <Text style={styles.emptyText}>No payment records found</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2e3192" barStyle="light-content" />
      
      <LinearGradient
        colors={['#2e3192', '#2e3192']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Payment History</Text>
        <TouchableOpacity onPress={fetchPaymentHistory} style={styles.refreshButton}>
          <Icon name="refresh" size={22} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>
      
      {loading && !refreshing ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#3957E8" />
          <Text style={styles.loadingText}>Loading payment history...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={50} color="#ff6b6b" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchPaymentHistory}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={paymentHistory}
          keyExtractor={(item, index) => `payment-${index}`}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyComponent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#3957E8']}
              tintColor="#3957E8"
            />
          }
        />
      )}
    </View>
  );
};

export default HeadAdminPaymentsPage;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  refreshButton: {
    padding: 5,
  },
  listContent: {
    padding: 16,
    paddingTop: 10,
    flexGrow: 1,
  },
  itemContainer: {
    position: 'relative',
  },
  hiddenViewShot: {
    position: 'absolute',
    left: -500, // Render off-screen
  },
  card: {
    borderRadius: 12,
    elevation: 3,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: 'rgba(22, 143, 87, 0.1)',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginLeft: 5,
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  eventIdLabel: {
    color: '#2e3192',
    fontWeight: 'bold',
    fontSize: 15,
  },
  date: {
    color: '#2e3192',
    fontSize: 13,
    fontWeight: '500',
  },
  userInfo: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  userInfocon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  username: {
    color: '#2e3192',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  userId: {
    color: '#2e3192',
    fontSize: 12,
    marginLeft: 18,
  },
  paymentStatus: {
    backgroundColor: 'rgba(125, 196, 125, 0.1)',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  statusText: {
    color: 'green',
    fontSize: 13,
    fontWeight: '500',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#2e3192',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#555',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 10,
  },
  retryButton: {
    backgroundColor: '#2e3192',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 10,
    color: '#555',
    fontSize: 16,
  },
  downloadButton: {
    padding: 15,
    marginRight: 5,
  },
// Updated Invoice styles
invoiceContainer: {
  backgroundColor: 'white',
  padding: 25,
  borderRadius: 12,
  width: 320,
  elevation: 8,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 6,
},
logoContainer: {
  alignItems: 'center',
  marginBottom: 15,
},
logo: {
  width: 120,
  height: 60,
},
invoiceTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#2e3192',
  marginBottom: 20,
  textAlign: 'center',
  borderBottomWidth: 1,
  borderBottomColor: '#e0e0e0',
  paddingBottom: 12,
  textTransform: 'uppercase',
  letterSpacing: 1,
},
invoiceContent: {
  marginVertical: 10,
},
invoiceRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 10,
  paddingVertical: 4,
},
invoiceLabel: {
  fontWeight: '600',
  color: '#555',
  fontSize: 14,
},
invoiceValue: {
  color: '#333',
  fontSize: 14,
  fontWeight: '500',
},
statusSuccess: {
  color: '#4CAF50',
  fontWeight: 'bold',
},
invoiceFooter: {
  marginTop: 20,
  paddingTop: 15,
  borderTopWidth: 1,
  borderTopColor: '#e0e0e0',
  alignItems: 'center',
},
footerText: {
  fontStyle: 'italic',
  color: '#666',
  fontSize: 14,
  marginBottom: 5,
},
footerContact: {
  color: '#888',
  fontSize: 12,
},
});





















// import React, { useEffect, useState } from 'react';
// import { 
//   View, 
//   Text, 
//   FlatList, 
//   ActivityIndicator, 
//   StyleSheet, 
//   TouchableOpacity, 
//   RefreshControl,
//   StatusBar
// } from 'react-native';
// import { API_BASE_URL } from '../constants/Config';
// import { useSelector } from 'react-redux';
// import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/Ionicons';
// import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

// const HeadAdminPaymentsPage = () => {
//   const [paymentHistory, setPaymentHistory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [refreshing, setRefreshing] = useState(false);

//    const userId = useSelector((state) => state.UserId);

//   const fetchPaymentHistory = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${API_BASE_URL}/api/EventPaymentViewMember?UserId=${userId}`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch data');
//       }
//       const data = await response.json();
//       console.log('Payment History:==================', data);
//       setPaymentHistory(data);
//       setError('');
//     } catch (err) {
//       console.error(err);
//       setError('Something went wrong while fetching payment history.');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchPaymentHistory();
//   }, []);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchPaymentHistory();
//   };

//   const formatDate = (dateString) => {
//     const options = { 
//       year: 'numeric', 
//       month: 'short', 
//       day: 'numeric', 
//       hour: '2-digit', 
//       minute: '2-digit' 
//     };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   const renderItem = ({ item, index }) => (
//     <LinearGradient
//       colors={['#F5F7FE', '#F5F7FE']}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 1, y: 0 }}
//       style={[styles.card, { marginTop: index === 0 ? 5 : 15 }]}
//     >
//       <View style={styles.iconContainer}>
//         <MaterialIcon name="credit-card-check-outline" size={24} color="#2e3192" />
//       </View>
      
//       <View style={styles.cardContent}>
//         <View style={styles.topRow}>
//           <Text style={styles.eventIdLabel}>
//             <Icon name="calendar" size={14} color="#2e3192" /> Event #{item.EventId}
//           </Text>
// <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//   <Icon name="time-outline" size={14} color="#2e3192" style={{ marginRight: 5 }} />
//   <Text style={styles.date}>{formatDate(item.CreatedAt)}</Text>
// </View>

//         </View>
//         <View style={styles.userInfocon}>
//         <View style={styles.userInfo}>
//           <Text style={styles.username}>
//             <Icon name="person" size={14} color="#2e3192" /> {item.Username}
//           </Text>
//           <Text style={styles.userId}>ID: {item.UserId}</Text>
//         </View>
        
//         <View style={styles.paymentStatus}>
//           <Text style={styles.statusText}>
//             <Icon name="checkmark-circle" size={14} color="green" /> Payment Successful
//           </Text>
//         </View>
//         </View>
//       </View>
//     </LinearGradient>
//   );

//   const renderEmptyComponent = () => (
//     <View style={styles.emptyContainer}>
//       <Icon name="receipt-outline" size={60} color="#2e3192" />
//       <Text style={styles.emptyText}>No payment records found</Text>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <StatusBar backgroundColor="#2e3192" barStyle="light-content" />
      
//       <LinearGradient
//         colors={['#2e3192', '#2e3192']}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 0 }}
//         style={styles.header}
//       >
//         <Text style={styles.headerTitle}>Payment History</Text>
//         <TouchableOpacity onPress={fetchPaymentHistory} style={styles.refreshButton}>
//           <Icon name="refresh" size={22} color="#fff" />
//         </TouchableOpacity>
//       </LinearGradient>
      
//       {loading && !refreshing ? (
//         <View style={styles.loaderContainer}>
//           <ActivityIndicator size="large" color="#3957E8" />
//           <Text style={styles.loadingText}>Loading payment history...</Text>
//         </View>
//       ) : error ? (
//         <View style={styles.errorContainer}>
//           <Icon name="alert-circle" size={50} color="#ff6b6b" />
//           <Text style={styles.errorText}>{error}</Text>
//           <TouchableOpacity
//             style={styles.retryButton}
//             onPress={fetchPaymentHistory}
//           >
//             <Text style={styles.retryText}>Retry</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <FlatList
//           data={paymentHistory}
//           keyExtractor={(item, index) => `payment-${index}`}
//           renderItem={renderItem}
//           contentContainerStyle={styles.listContent}
//           ListEmptyComponent={renderEmptyComponent}
//           showsVerticalScrollIndicator={false}
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={onRefresh}
//               colors={['#3957E8']}
//               tintColor="#3957E8"
//             />
//           }
//         />
//       )}
//     </View>
//   );
// };

// export default HeadAdminPaymentsPage;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   header: {
//     paddingVertical: 20,
//     paddingHorizontal: 16,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     elevation: 4,
//   },
//   headerTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: 'white',
//   },
//   refreshButton: {
//     padding: 5,
//   },
//   listContent: {
//     padding: 16,
//     paddingTop: 10,
//     flexGrow: 1,
//   },
//   card: {
//     borderRadius: 12,
//     elevation: 3,
//     overflow: 'hidden',
//     flexDirection: 'row',
//   },
//   iconContainer: {
//     backgroundColor: 'rgba(22, 143, 87, 0.1)',
//     padding: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   cardContent: {
//     flex: 1,
//     padding: 16,
//   },
//   topRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//   },
//   eventIdLabel: {
//     color: '#2e3192',
//     fontWeight: 'bold',
//     fontSize: 15,
//   },
//   date: {
//     color: '#2e3192',
//     fontSize: 13,
//     fontWeight: '500',
    
//   },
//   userInfo: {
//    flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'flex-start',
//   },
//   userInfocon: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   username: {
//     color: '#2e3192',
//     fontSize: 16,
//     fontWeight: '500',
//     marginBottom: 4,
//   },
//   userId: {
//     color: '#2e3192',
//     fontSize: 12,
//     marginLeft: 18,
//   },
//   paymentStatus: {
//     backgroundColor: 'rgba(125, 196, 125, 0.1)',
//     borderRadius: 12,
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     alignSelf: 'flex-start',
//     marginTop: 4,
//   },
//   statusText: {
//     color: 'green',
//     fontSize: 13,
//     fontWeight: '500',
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 10,
//     color: '#2e3192',
//     fontSize: 16,
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   errorText: {
//     color: '#555',
//     textAlign: 'center',
//     fontSize: 16,
//     marginTop: 10,
//   },
//   retryButton: {
//     backgroundColor: '#2e3192',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     marginTop: 20,
//   },
//   retryText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 40,
//   },
//   emptyText: {
//     marginTop: 10,
//     color: '#555',
//     fontSize: 16,
//   },
// });