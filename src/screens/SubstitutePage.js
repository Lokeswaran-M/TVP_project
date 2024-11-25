import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Alert,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';  
import { API_BASE_URL } from '../constants/Config';
import { logoutUser } from '../Redux/action';  

const LoginScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();  // To navigate after logout

  const userId = useSelector((state) => state.user?.userId);
  console.log("UserID in substitute:", userId);

  const username = useSelector((state) => state.user?.username);
  console.log("username in substitute:", username);

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const showLogoutModal = () => setLogoutModalVisible(true);
  const hideLogoutModal = () => setLogoutModalVisible(false);

  const fetchProfileData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/profile-image?userId=${userId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch profile data");
      }
      const data = await response.json();
      console.log('----------------pic data --------------',data);
      setProfileData(data);
    } catch (error) {
      console.error("Error fetching profile data in Substitute Page:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchProfileData();
    }
  }, [userId]);

  const handleLogout = () => {

    dispatch(logoutUser());


    navigation.navigate('Login'); 
    

    hideLogoutModal();
    Alert.alert('Logged Out', 'You have been logged out.');
  };
  // const handleLogout = () => {
  //   dispatch(logoutUser());
  
  //   // Go back to the previous screen
  //   navigation.goBack(); 
  
  //   hideLogoutModal();
  //   Alert.alert('Logged Out', 'You have been logged out.');
  // };
  
  const handleScannerPress = () => {
    navigation.navigate("Scanner");
  };

  return (
    <View style={styles.container}>
      {/* Sidebar Component */}
      <Sidebar
        visible={sidebarVisible}
        onClose={toggleSidebar}
        onLogout={showLogoutModal}
        profileData={profileData} // Pass profile data here
        username={username}
      />

      {/* Top Navigation */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={toggleSidebar}>
          <Icon name="navicon" style={styles.topNavi} size={25} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonNavtop}>
          <View style={styles.topNavlogo}>
            <MaterialIcons name="person-add-alt" size={28} color="#FFFFFF" />
          </View>
          <Text style={styles.NavbuttonText}>SUBSTITUTE LOGIN</Text>
        </TouchableOpacity>
      </View>

      {/* Scanner Section */}
      <View style={styles.scannerContainer}>
        <TouchableOpacity style={styles.scanButton} onPress={handleScannerPress}>
          <Icon name="qrcode" size={30} color="#FFF" />
          <Text style={styles.scanButtonText}>Start Scanning</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Modal */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={logoutModalVisible}
        onRequestClose={hideLogoutModal}
      >
        <Pressable style={styles.modalOverlay} onPress={hideLogoutModal}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Logout</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to logout?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleLogout}
              >
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={hideLogoutModal}
              >
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const Sidebar = ({ visible, onClose, onLogout, profileData, username }) => (
  <Modal
    transparent={true}
    animationType="fade"
    visible={visible}
    onRequestClose={onClose}
  >
    <Pressable style={styles.sidebarOverlay} onPress={onClose}>
      <View style={styles.sidebarContainer1}>
        <TouchableOpacity style={styles.sidebarItemstyle} onPress={onClose}>
          {profileData?.imageUrl ? (
            <Image
              source={{ uri: profileData.imageUrl }} // Replace 'imageUrl' with the actual key for the image URL
              style={styles.profileImage}
            />
          ) : null}
        </TouchableOpacity>
        <Text style={styles.sidebarItemText1}>
          {username || 'YOUR NAME'}
        </Text>
      </View>
      <View style={styles.sidebarContainer}>
        <TouchableOpacity style={styles.sidebarItem} onPress={onLogout}>
          <MaterialIcons name="logout" size={20} color="#A3238F" />
          <Text style={styles.sidebarItemText}>LOGOUT</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sidebarItem} onPress={onClose}>
          <MaterialIcons name="arrow-back" size={20} color="#A3238F" />
          <Text style={styles.sidebarItemText}>BACK</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  </Modal>
);




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CCC',
  },
  profileImage: {
    width: 90, // Adjust size as needed
    height: 90,
    borderRadius:50, // Makes the image circular
  },
  topNav: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomEndRadius: 15,
    borderBottomStartRadius: 15,
  },
  topNavi: {
    padding: 10,
  },
  buttonNavtop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:"center",
    marginLeft: 60,
    borderColor: '#A3238F',
    borderWidth: 2,
    borderRadius: 25,
  },
  topNavlogo: {
    backgroundColor: '#A3238F',
    padding: 5,
    borderRadius: 50,
  },
  NavbuttonText: {
    color: '#A3238F',
    fontSize: 15,
    fontWeight: 'bold',
    margin: 7,
  },
  scannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A3238F',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  scanButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  sidebarOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  sidebarContainer1: {
    backgroundColor: '#D8BFD8',
    width: 240,
    borderTopRightRadius: 20,
    height: '35%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sidebarItemstyle: {
    backgroundColor: '#A3238F',
    alignItems: 'center',
    borderRadius: 50,
    padding:2,
    marginBottom: 4,
    marginTop: 50,
  },
  sidebarItemText1: {
    fontSize: 20,
    color: '#A3238F',
    textAlign: 'center',
    paddingTop: 10,
    fontWeight: 'bold',
  },
  sidebarContainer: {
    backgroundColor: '#FFFFFF',
    width: 240,
    borderBottomRightRadius: 20,
    height: '65%',
    paddingTop: 35,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  sidebarItemText: {
    fontSize: 14,
    paddingLeft: 10,
    color: '#A3238F',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#A3238F',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;







// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Modal,
//   Pressable,
//   Alert,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import { useSelector } from 'react-redux';
// import { API_BASE_URL } from '../constants/Config';

// const LoginScreen = ({ navigation }) => {
//   const userId = useSelector((state) => state.user?.userId);
//   console.log("UserID in substitute:", userId);

//   const [sidebarVisible, setSidebarVisible] = useState(false);
//   const [logoutModalVisible, setLogoutModalVisible] = useState(false);
//   const [profileData, setProfileData] = useState(null);

//   const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
//   const showLogoutModal = () => setLogoutModalVisible(true);
//   const hideLogoutModal = () => setLogoutModalVisible(false);

//   const fetchProfileData = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/profile-image?userId=${userId}`);

//       if (!response.ok) {
//         throw new Error("Failed to fetch profile data");
//       }
//       const data = await response.json();
      
//       console.log('----------------pic data --------------',data);
//       setProfileData(data);
//     } catch (error) {
//       console.error("Error fetching profile data:", error);
//     }
//   };

//   useEffect(() => {
//     if (userId) {
//       fetchProfileData();
//     }
//   }, [userId]);

//   const handleLogout = () => {
//     Alert.alert('Logged Out', 'You have been logged out.');
//     hideLogoutModal();
//   };

//   const handleScannerPress = () => {
//     navigation.navigate("Scanner");
//   };

//   return (
//     <View style={styles.container}>
//       {/* Sidebar Component */}
//       <Sidebar
//         visible={sidebarVisible}
//         onClose={toggleSidebar}
//         onLogout={showLogoutModal}
//         profileData={profileData} // Pass profile data to Sidebar if needed
//       />

//       {/* Top Navigation */}
//       <View style={styles.topNav}>
//         <TouchableOpacity onPress={toggleSidebar}>
//           <Icon name="navicon" style={styles.topNavi} size={25} color="black" />
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.buttonNavtop}>
//           <View style={styles.topNavlogo}>
//             <MaterialIcons name="person-add-alt" size={28} color="#FFFFFF" />
//           </View>
//           <Text style={styles.NavbuttonText}>SUBSTITUTE LOGIN</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Scanner Section */}
//       <View style={styles.scannerContainer}>
//         <Text style={styles.scannerTitle}>Scanner</Text>
//         <TouchableOpacity style={styles.scanButton} onPress={handleScannerPress}>
//           <Icon name="qrcode" size={30} color="#FFF" />
//           <Text style={styles.scanButtonText}>Start Scanning</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Logout Modal */}
//       <Modal
//         transparent={true}
//         animationType="fade"
//         visible={logoutModalVisible}
//         onRequestClose={hideLogoutModal}
//       >
//         <Pressable style={styles.modalOverlay} onPress={hideLogoutModal}>
//           <View style={styles.modalContainer}>
//             <Text style={styles.modalTitle}>Confirm Logout</Text>
//             <Text style={styles.modalMessage}>
//               Are you sure you want to logout?
//             </Text>
//             <View style={styles.modalButtons}>
//               <TouchableOpacity
//                 style={styles.modalButton}
//                 onPress={handleLogout}
//               >
//                 <Text style={styles.modalButtonText}>Yes</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.modalButton}
//                 onPress={hideLogoutModal}
//               >
//                 <Text style={styles.modalButtonText}>No</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Pressable>
//       </Modal>
//     </View>
//   );
// };

// // Sidebar Component (optional if required)
// const Sidebar = ({ visible, onClose, onLogout, profileData }) => (
//   <Modal
//     transparent={true}
//     animationType="fade"
//     visible={visible}
//     onRequestClose={onClose}
//   >
//     <Pressable style={styles.sidebarOverlay} onPress={onClose}>
//       <View style={styles.sidebarContainer}>
//         {/* Display profileData here if needed */}
//         <Text>{profileData?.name || "User Name"}</Text>
//         <TouchableOpacity style={styles.sidebarItem} onPress={onLogout}>
//           <Text style={styles.sidebarItemText}>Logout</Text>
//         </TouchableOpacity>
//       </View>
//     </Pressable>
//   </Modal>
// );
