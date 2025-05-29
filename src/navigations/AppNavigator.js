import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect, useNavigation, CommonActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerItem, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Image, Text, TouchableOpacity, View, StyleSheet, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import SplashScreen from '../components/common/SplashScreen';
import AuthNavigator from '../navigations/AuthNavigator'; 
import DrawerContent from './DrawerContent';
import TabNavigator from './TabNavigator';
import ProfileDrawerLabel  from './ProfileDrawerLabel';
import Payment from '../screens/Payment';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfile from '../screens/EditProfile';
import OneMinPresentation from '../screens/OneMinPresentation';
import PreAttendanceViewPage from '../screens/PreAttendanceViewPage';
import StopWatch from '../screens/StopWatch';
import CreatingMeeting from '../screens/Creatingmeeting';
import CreateMeetingViewPage from '../screens/CreateMeetingViewPage';
import MemberDetails from '../screens/MemberDetails';
import NewMeeting from '../screens/NewMeeting';
import EditMeeting from '../screens/EditMeeting';
import AddBusiness from '../screens/AddBusiness';
import Requirements from '../screens/Requirements';
import Review from '../screens/Review';
import TotalOfferedReceivedPage from '../screens/TotalOfferedReceivedPage';
import Notification from '../screens/Notification';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { API_BASE_URL } from '../constants/Config';
import { setUser, logoutUser } from '../Redux/action';
import NewMember from '../screens/NewMember';
import ReviewApprovalPage from '../screens/ReviewApprovalPage';
const PRIMARY_COLOR = '#2e3091';
const SECONDARY_COLOR = '#3d3fa3';
const LIGHT_PRIMARY = '#eaebf7';
const ACCENT_COLOR = '#ff6b6b';
const BACKGROUND_COLOR = '#f5f7ff';
const WHITE = '#ffffff';
const DARK_TEXT = '#333333';
const LIGHT_TEXT = '#6c7293';
const ProfileStack = createStackNavigator();

function ProfileStackNavigator() {
const user = useSelector((state) => state);
console.log("User in APP Navigator ------------------", user);
const userId = useSelector((state) => state.UserId);
console.log("UserID----------", userId);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [profileData, setProfileData] = useState({});
  console.log("PROFESSION IN PROFILE SCREEN-----------------",profileData?.Profession)

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/business-info/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }
      const data = await response.json();
      if (response.status === 404) {
        setProfileData({});
      } else {
        setProfileData(data);
      }
    } catch (error) {
      console.error('Error fetching profile data in App Navigator Profile Stack Navigator:', error);
    } finally {
      setLoading(false);
    }
  };  
  useFocusEffect(
    useCallback(() => {
      fetchProfileData();
    }, [userId])
  );

  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerShown: true,
        headerTintColor: '#000',
        headerStyle: {
          backgroundColor: '#fff',
        },
      }}
    >
      <ProfileStack.Screen
  name="Profile"
  component={ProfileScreen}
  initialParams={{ 
    categoryID: profileData?.CategoryId || null, 
    Profession: profileData?.Profession || 'None', 
  }}
  options={{ headerShown: false, title: 'Profile' }}
/>
      <ProfileStack.Screen
        name="EditProfile"
        component={EditProfile}
        initialParams={{ CategoryId: profileData?.CategoryId }}
        options={{ headerShown: true, title: 'Edit Profile' }}
      />
    </ProfileStack.Navigator>
  );
}

const StackMeeting = createStackNavigator();

function StackMeetingNavigator() {
  return (
    <StackMeeting.Navigator
      screenOptions={{
        headerTintColor: '#000',
        headerStyle: {
          backgroundColor: '#fff',
        },
      }}
    >
      <StackMeeting.Screen
        name="Createmeeting"
        component={CreatingMeeting}
        options={{ headerShown: true, title: 'Create meeting' , header: () => (
          <View style={styles.topNav}>
            <View style={styles.buttonNavtop}>
              <View style={styles.topNavlogo}>
                <Icon name="comments" size={28} color="#FFFFFF" />
              </View>
              <Text style={styles.NavbuttonText}>CREATE MEETING</Text>
            </View>
          </View>
        ),}} 
      />
      <StackMeeting.Screen
        name="NewMeeting"
        component={NewMeeting}
        options={{ headerShown: false, title: 'New Meeting'}}
      />
      <StackMeeting.Screen
        name="EditMeeting"
        component={EditMeeting}
        options={{ headerShown: false, title: 'Edit Meeting'}}
      />
      {/* <Stack.Screen 
      name="GeneratedQRScreen" 
      component={GeneratedQRScreen} 
      options={{ headerShown: true, title: 'QR Genrated'}}
      /> */}
      <Stack.Screen 
      name="CreateMeetingViewPage" 
      component={CreateMeetingViewPage} 
      options={{ headerShown: false, title: 'Create meeting'}}
      />
      <Stack.Screen
        name="OneMinPresentation"
        component={OneMinPresentation}
        options={({ navigation }) => ({
              drawerLabel: 'One Min Presentation',
              drawerIcon: ({ color, size }) => (
                <Icon name="microphone" color={color} size={size} />
              ),
              header: () => (
                <View style={styles.topNav}>
                  
                  <TouchableOpacity style={styles.buttonNavtop}>
                    <View style={styles.topNavlogo}>
                      <Icon name="microphone" size={28} color="#FFFFFF" />
                    </View>
                    <Text style={styles.NavbuttonText}>POST ATTENDANCE PRESENTATION</Text>
                  </TouchableOpacity>
                </View>
              ),
            })}
      />
         <Stack.Screen
        name="PreAttendanceViewPage"
        component={PreAttendanceViewPage}
        options={({ navigation }) => ({
              drawerLabel: 'One Min Presentation',
              drawerIcon: ({ color, size }) => (
                <Icon name="microphone" color={color} size={size} />
              ),
              header: () => (
                <View style={styles.topNav}>
                  
                  <TouchableOpacity style={styles.buttonNavtop}>
                    <View style={styles.topNavlogo}>
                      <Ionicons name="checkmark-done-circle" size={28} color="#FFFFFF" />
                    </View>
                    <Text style={styles.NavbuttonText}>Pre - Attendance</Text>
                  </TouchableOpacity>
                </View>
              ),
            })}
      />
      
      <Stack.Screen
        name="StopWatch"
        component={StopWatch}
        options={({ navigation }) => ({
              drawerLabel: 'One Min Presentation',
              drawerIcon: ({ color, size }) => (
                <Icon name="microphone" color={color} size={size} />
              ),
              header: () => (
                <View style={styles.topNav}>
                  <TouchableOpacity style={styles.buttonNavtop}>
                    <View style={styles.topNavlogo}>
                      <Icon name="microphone" size={28} color="#FFFFFF" />
                    </View>
                    <Text style={styles.NavbuttonText}>ONE MIN PRESENTATION</Text>
                  </TouchableOpacity>
                </View>
              ),
            })}
      />

    </StackMeeting.Navigator>
  );
}
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const HeaderImage = () => {
  const [loading, setLoading] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0); 
  const navigation = useNavigation();
const userID = useSelector((state) => state.UserId);
  console.log("UserId for notification count-----------------------",userID);
  useEffect(() => {
    if (userID) {
      const fetchNotificationCount = async () => {
        setLoading(true);
        try {
          const response = await fetch(`${API_BASE_URL}/api/notifications/count/${userID}`);
          const data = await response.json();
          console.log("Data for Notification Count------------------------",data);
          if (response.ok) {
            setNotificationCount(data.notificationCount);
          } else {
            console.error('Error fetching notification count:', data.message || 'Unknown error');
          }
        } catch (error) {
          console.error('Error fetching notification count:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchNotificationCount();
    }
  }, [userID]);
  return (
    <View style={styles.topNavlogohome}>
      <Image
        source={require('../../assets/images/TPV.png')}
        style={styles.iconImage}
      />
      <TouchableOpacity
        onPress={() => navigation.navigate('Notification')}
        disabled={loading}
      >
        <Ionicons name="notifications-sharp" size={26} color="#2e3192" left = {0} />
        {notificationCount > 0 && (
          <Text style={styles.notificationCount}>{notificationCount}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};
const HeaderWithImage = ({ navigation }) => ({
  headerBackground: () => (
    <LinearGradient
      colors={['#fff', '#fff']}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    />
  ),
  headerTintColor: '#000',
  headerTitle: () => <HeaderImage navigation={navigation} />,
});

const HeaderWithoutImage = ({ navigation }) => ({
  headerBackground: () => (
    <LinearGradient
      colors={['#fff', '#fff']}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    />
  ),
  headerTintColor: '#000',
});
const CustomHeaderTotalOR = () => {
  return (
    <View style={styles.topNav}>
      <View style={styles.buttonNavtop}>
        <View style={styles.topNavlogo}>
        <MaterialIcons name="business-center" size={27} color="white" style={styles.icon} />
        </View>
        <Text style={styles.NavbuttonText}>TotalOfferedReceivedPage</Text>
      </View>
    </View>
  );
};
function DrawerNavigator() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state);
  const userId = useSelector((state) => state.UserId);
  const navigation = useNavigation();
  
  // State for logout modal
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    dispatch(logoutUser());
    console.log("User has logged out:", user);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Auth', params: { screen: 'Login' } }],
      })
    );
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };
  
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({});
  
  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/business-info/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }
      const data = await response.json();
      if (response.status === 404) {
        setProfileData({});
      } else {
        setProfileData(data);
      }
    } catch (error) {
      console.error('Error fetching profile data in AppNavigator Drawer:', error);
    } finally {
      setLoading(false);
    }
  };  

  useFocusEffect(
    useCallback(() => {
      fetchProfileData();
    }, [userId])
  );
  return (
      <>
      <Drawer.Navigator
        initialRouteName="Home"
        drawerContent={(props) => (
          <DrawerContentScrollView {...props}>
              <DrawerContent {...props} />
              <DrawerItem
                  label="Logout"
                  icon={({ color, size }) => <Icon name="sign-out" color={color} size={size} />}
                  onPress={handleLogout}
              />
          </DrawerContentScrollView>
        )}
        screenOptions={{
          drawerActiveTintColor: '#2e3192', 
          drawerInactiveTintColor: 'black', 
          drawerStyle: {
            backgroundColor: '#f5f7ff', 
          },
        }}
      >
      <Drawer.Screen 
          name="Home" 
          component={TabNavigator} 
          options={({ navigation }) => ({
            drawerLabel: 'Home',
            drawerIcon: ({ color, size }) => (
              <FontAwesome name="home" color={color} size={size} />
            ),
            ...HeaderWithImage({ navigation }),
          })}
        />
      {profileData?.CategoryId === 1 && (
        <>
      <Drawer.Screen 
        name="Profile screen" 
        component={ProfileStackNavigator}
        initialParams={{ Profession: profileData?.Profession }}
        options={({ navigation }) => ({
          drawerLabel: 'View Profile', 
          drawerIcon: ({ color, size }) => (
            <Icon name="user-circle" color={color} size={size}/>),
          headerShown: false,
          header: () => (
            <View style={styles.topNav}>
              <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                <Icon name="navicon" size={20} color="black" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonNavtop}>
                <View style={styles.topNavlogo}>
                  <Icon name="user-circle" size={28} color="#FFFFFF" />
                </View>
                <Text style={styles.NavbuttonText}>PROFILE</Text>
              </TouchableOpacity>
            </View>
          ),
        })} 
      />
      </>
      )}
{profileData?.CategoryId === 2 && (
        <>
<Drawer.Screen 
  name="Profile screen" 
  component={ProfileStackNavigator}
  // initialParams={{ CategoryId: profileData?.CategoryId }}
  options={({ navigation }) => ({
    drawerLabel: () => <ProfileDrawerLabel />,
    drawerIcon: ({ color, size }) => (
      <Icon name="user-circle" color={color} size={size} />
    ),
    headerShown: false,
    header: () => (
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <Icon name="navicon" size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonNavtop}>
          <View style={styles.topNavlogo}>
            <Icon name="user-circle" size={28} color="#FFFFFF" />
          </View>
          <Text style={styles.NavbuttonText}>PROFILE</Text>
        </TouchableOpacity>
      </View>
    ),
    
  })}
/>
</>
      )}
      <Drawer.Screen
        name="Payment"
        component={Payment}
        options={({ navigation }) => ({
          drawerLabel: 'Payment',
          drawerIcon: ({ color, size }) => (
            <Icon name="money" color={color} size={size} />
          ),
          headerShown: false,
          header: () => (
            <View style={styles.topNav}>
              <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                <Icon name="navicon" size={20} color="black" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonNavtop}>
                <View style={styles.topNavlogo}>
                  <Icon name="money" size={28} color="#FFFFFF" />
                </View>
                <Text style={styles.NavbuttonText}>PAYMENT</Text>
              </TouchableOpacity>
            </View>
          ),
        })}
      />
      {/* <Drawer.Screen
        name="Subscription"
        component={Subscription}
        options={({ navigation }) => ({
          drawerLabel: 'Subscription',
          drawerIcon: ({ color, size }) => (
            <Icon name="ticket" color={color} size={size} />
          ),
          header: () => (
            <View style={styles.topNav}>
              <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                <Icon name="navicon" size={20} color="black" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonNavtop}>
                <View style={styles.topNavlogo}>
                  <Icon name="ticket" size={28} color="#FFFFFF" />
                </View>
                <Text style={styles.NavbuttonText}>SUBSCRIPTION</Text>
              </TouchableOpacity>
            </View>
          ),
        })}
      /> */}
      {profileData?.CategoryId === 1 && (
        <>
      <Drawer.Screen
        name="AddBusiness"
        component={AddBusiness}
        options={({ navigation }) => ({
          drawerLabel: 'Add Business',
          drawerIcon: ({ color, size }) => (
            <Icon name="plus" color={color} size={size} />
          ),
          headerShown: false,
          // header: () => (
          //   <View style={styles.topNav}>
          //     <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          //       <Icon name="navicon" size={20} color="black" />
          //     </TouchableOpacity>
          //     <View style={styles.buttonNavtop}>
          //       <View style={styles.topNavlogo}>
          //         <Icon name="plus" size={28} color="#FFFFFF" />
          //       </View>
          //       <Text style={styles.NavbuttonText}>ADD BUSINESS</Text>
          //     </View>
          //   </View>
          // ),
        })}
      />
      </>
      )}
      {profileData?.RollId === 2 && (
        <>
          <Drawer.Screen
            name="Creatingmeeting"
            component={StackMeetingNavigator}
            options={({ navigation }) => ({
              drawerLabel: 'Create Meeting',
              drawerIcon: ({ color, size }) => (
                <Icon name="comments" color={color} size={size} />
              ),
              headerShown: false,
              header: () => (
                <View style={styles.topNav}>
                  <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                    <Icon name="navicon" size={20} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonNavtop}>
                    <View style={styles.topNavlogo}>
                      <Icon name="comments" size={28} color="#FFFFFF" />
                    </View>
                    <Text style={styles.NavbuttonText}>CREATE MEETING</Text>
                  </TouchableOpacity>
                </View>
              ),
            })}
          />
            <Drawer.Screen
            name="NewMember"
            component={NewMember}
            options={({ navigation }) => ({
              drawerLabel: 'New Member',
              drawerIcon: ({ color, size }) => (
                <Icon name="users" color={color} size={size} />
              ),
               headerShown: true,
              header: () => (
                <View style={styles.topNav}>
                  <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                    <Icon name="navicon" size={20} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonNavtop}>
                    <View style={styles.topNavlogo}>
                      <Icon name="users" size={28} color="#FFFFFF" />
                    </View>
                    <Text style={styles.NavbuttonText}>NEW MEMBER</Text>
                  </TouchableOpacity>
                </View>
              ),
            })}
          />
                      <Drawer.Screen
            name="ReviewApprovalPage"
            component={ReviewApprovalPage}
            options={({ navigation }) => ({
              drawerLabel: 'Review Approval',
              drawerIcon: ({ color, size }) => (
                <Icons name="reviews" color={color} size={size} />
              ),
              headerShown: true,
              header: () => (
                <View style={styles.topNav}>
                  <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                    <Icon name="navicon" size={20} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonNavtop}>
                    <View style={styles.topNavlogo}>
                      <Icons name="reviews" size={28} color="#FFFFFF" />
                    </View>
                    <Text style={styles.NavbuttonText}>Review Approval</Text>
                  </TouchableOpacity>
                </View>
              ),
            })}
          />
      </>
      )}
    </Drawer.Navigator>
        <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="slide"
        onRequestClose={cancelLogout}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Logout</Text>
            <Text style={styles.modalMessage}>Are you sure you want to log out?</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={cancelLogout}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]} 
                onPress={confirmLogout}
              >
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
function AppNavigator() {
const user = useSelector((state) => state);
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
        <Stack.Screen
          name="Auth"
          component={AuthNavigator}
          options={{ headerShown: false }}
        />
      <Stack.Screen
        name="DrawerNavigator"
        component={DrawerNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Requirements"
        component={Requirements}
        options={{
          headerShown: true,
          header: () => (
            <View style={styles.topNav}>
              <View style={styles.buttonNavtop}>
                <View style={styles.topNavlogo}>
                  <Icon name="plus-square-o" size={28} color="#FFFFFF" />
                </View>
                <Text style={styles.NavbuttonText}>REQUIREMENTS</Text>
              </View>
            </View>
          ),
        }}
      />




       <Stack.Screen name="TotalOfferedReceivedPage" component={TotalOfferedReceivedPage} options={{ headerShown: true, header: () => <CustomHeaderTotalOR/>, headerLeft: () => null, }} />

       
      <Stack.Screen
        name="Review"
        component={Review}
        options={{
          headerShown: true,
          header: () => (
            <View style={styles.topNav}>
              <View style={styles.buttonNavtop}>
                <View style={styles.topNavlogo}>
                  <Icon name="pencil" size={28} color="#FFFFFF" />
                </View>
                <Text style={styles.NavbuttonText}>Review</Text>
              </View>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="Notification"
        component={Notification}
        options={{
          headerShown: true,
          header: () => (
            <View style={styles.topNav}>
              <View style={styles.buttonNavtop}>
                <View style={styles.topNavlogo}>
                  <Icon name="bell" size={26} color="#FFFFFF" />
                </View>
                <Text style={styles.NavbuttonText}>Notification</Text>
              </View>
            </View>
          ),
        }}
      />
        <Stack.Screen
        name="MemberDetails"
        component={MemberDetails}
        options={{
          headerShown: false,
        }}
      />
     <Stack.Screen
  name="AddBusiness"
  component={AddBusiness}
  options={({ navigation }) => ({
    header: () => (
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <View style={styles.buttonNavtop}>
          <View style={styles.topNavlogo}>
            <Icon name="plus" size={28} color="#FFFFFF" />
          </View>
          <Text style={styles.NavbuttonText}>ADD BUSINESS</Text>
        </View>
      </View>
    ),
  })}
/>
{/* <Stack.Screen
        name="UpdateBusiness"
        component={UpdateBusiness}
        options={({ navigation }) => ({
          header: () => (
            <View style={styles.topNav}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="arrow-left" size={20} color="black" />
              </TouchableOpacity>
              <View style={styles.buttonNavtop}>
                <View style={styles.topNavlogo}>
                  <Icon name="plus" size={28} color="#FFFFFF" />
                </View>
                <Text style={styles.NavbuttonText}>UPDATE BUSINESS</Text>
              </View>
            </View>
          ),
        })}
      /> */}
{/* <Drawer.Screen
        name="AddBusiness"
        component={AddBusiness}
        options={({ navigation }) => ({
          drawerLabel: 'Add Business',
          drawerIcon: ({ color, size }) => (
            <Icon name="plus" color={color} size={size} />
          ),
          header: () => (
            <View style={styles.topNav}>
              <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                <Icon name="navicon" size={20} color="black" />
              </TouchableOpacity>
              <View style={styles.buttonNavtop}>
                <View style={styles.topNavlogo}>
                  <Icon name="plus" size={28} color="#FFFFFF" />
                </View>
                <Text style={styles.NavbuttonText}>ADD BUSINESS</Text>
              </View>
            </View>
          ),
        })}
      /> */}


    </Stack.Navigator>
  );
}
const styles = StyleSheet.create({
  topNavlogohome:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-around',

    // paddingRight:5,
  },
  notificationCount: {
    borderColor: "white",
    borderWidth: 1,
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: 'red',
    color: 'white',
    borderRadius: 10,
    width: 20,
    height: 20,
    textAlign: 'center',
    fontSize: 12,
  },
  iconImage:{
    backgroundColor:'#FFFFFF',
    width: 300, 
    height: 55, 
    resizeMode: 'contain',
  },
  topNav: {
    backgroundColor: '#FFFFFF',
    padding:15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'flex-start',
    borderBottomEndRadius: 15,
    borderBottomStartRadius: 15,
    // marginLeft: 10,
  },
  buttonNavtop:{
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    // marginLeft:80,
    margin: 'auto',
    borderColor:'#2e3192',
    borderWidth:2,
    flexDirection:'row',
  },
  topNavlogo:{
   backgroundColor:'#2e3192',
   padding:5,
   paddingLeft:7.5,
   paddingRight:9,
   borderRadius:50,
  },
  NavbuttonText:{
    color:'#2e3192',
    fontSize:15,  
    fontWeight:'bold',
    marginLeft:10,
    paddingRight:10,
  },
  drawerLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  drawerLabelText: {
    color: 'black',
    fontSize: 13,
    fontWeight: 'bold',
  },
  arrowIcon: {
    marginLeft: 10,
  },
   modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: WHITE,
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DARK_TEXT,
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: DARK_TEXT,
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: LIGHT_TEXT,
  },
  confirmButton: {
    backgroundColor: ACCENT_COLOR,
  },
  buttonText: {
    color: WHITE,
    fontWeight: 'bold',
  },
});
export default AppNavigator;