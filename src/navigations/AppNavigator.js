import React ,{useState} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import SplashScreen from '../components/common/SplashScreen';
import AuthNavigator from '../navigations/AuthNavigator'; 
import DrawerContent from './DrawerContent';
import TabNavigator from './TabNavigator';
import SubstituteLogin from '../screens/SubstituteLogin';
import Payment from '../screens/Payment';
import Subscription from '../screens/Subscription';
import LoginScreen from '../screens/LoginScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfile from '../screens/EditProfile';
import Creatingmeeting from '../screens/Creatingmeeting';
import CreateQR from '../screens/CreateQR';
import Attendance from '../screens/Attendance';
import CreatingMeeting from '../screens/Creatingmeeting';
import NewMeeting from '../screens/NewMeeting';
import EditMeeting from '../screens/EditMeeting';
import { useSelector } from 'react-redux';
const ProfileStack = createStackNavigator();

function ProfileStackNavigator() {
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
        options={{ headerShown: false,title: 'Profile' }}
        
      />
      <ProfileStack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{ headerShown: true,title: 'Edit Profile' }}
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
            {/* <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                <Icon name="arrow-left" size={20} color="black" />
              </TouchableOpacity> */}
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
        options={{ headerShown: true, title: 'New Meeting'}}
      />
      <StackMeeting.Screen
        name="EditMeeting"
        component={EditMeeting}
        options={{ headerShown: true, title: 'Edit Meeting'}}
      />
    </StackMeeting.Navigator>
  );
}

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const HeaderImage = () => (
  <Image
    source={require('../../assets/images/BMW.png')} 
    style={styles.headerImage}
  />
);

const HeaderWithImage = () => ({
  headerBackground: () => (
    <LinearGradient
      colors={['#fff', '#fff']}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    />
  ),
  headerTintColor: '#000',
  headerTitle: () => <HeaderImage />,
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
  // headerLeft: () => (
  //   <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
  //     <Icon name="arrow-left" size={20} color="#000" style={{ marginLeft: 15 }} />
  //   </TouchableOpacity>
  // ),
});


function DrawerNavigator() {
  // const dispatch = useDispatch();
  // dispatch(setUser(result));
  const user = useSelector((state) => state.user);
  console.log('rollId====================',user?.rollId)

  // console.log('rollId====================',rollId)
  return (
    
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <DrawerContent {...props} />} 
      screenOptions={{
        drawerActiveTintColor: '#a3238f', 
        drawerInactiveTintColor: 'black', 
        drawerStyle: {
          backgroundColor: 'white', 
        },
      }}
    >
      <Drawer.Screen 
        name="Home" 
        component={TabNavigator} 
        options={{
          drawerLabel: 'Home',
          drawerIcon: ({ color, size }) => (
            <FontAwesome name="home" color={color} size={size} />
          ),
          ...HeaderWithImage(),
        }} 
      />
      <Drawer.Screen 
        name="Profile screen" 
        component={ProfileStackNavigator}
        options={({ navigation }) => ({
          drawerLabel: 'View Profile',
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
                  <Icon name="user" size={28} color="#FFFFFF" />
                </View>
                <Text style={styles.NavbuttonText}>PROFILE</Text>
              </TouchableOpacity>
            </View>
          ),
        })} 
      />
      <Drawer.Screen
        name="Substitute Login"
        component={SubstituteLogin}
        options={({ navigation }) => ({
          drawerLabel: 'Substitute Login',
          drawerIcon: ({ color, size }) => (
            <Icon name="user-plus" color={color} size={size} />
          ),
          header: () => (
            <View style={styles.topNav}>
              <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                <Icon name="navicon" size={20} color="black" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonNavtop}>
                <View style={styles.topNavlogo}>
                  <Icon name="user" size={28} color="#FFFFFF" />
                </View>
                <Text style={styles.NavbuttonText}>SUBSTITUTE LOGIN</Text>
              </TouchableOpacity>
            </View>
          ),
        })}
      />

      <Drawer.Screen
        name="Payment"
        component={Payment}
        options={({ navigation }) => ({
          drawerLabel: 'Payment',
          drawerIcon: ({ color, size }) => (
            <Icon name="money" color={color} size={size} />
          ),
          header: () => (
            <View style={styles.topNav}>
              <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                <Icon name="navicon" size={20} color="black" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonNavtop}>
                <View style={styles.topNavlogo}>
                  <Icon name="user" size={28} color="#FFFFFF" />
                </View>
                <Text style={styles.NavbuttonText}>PAYMENT</Text>
              </TouchableOpacity>
            </View>
          ),
        })}
      />

      <Drawer.Screen
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
                  <Icon name="user" size={28} color="#FFFFFF" />
                </View>
                <Text style={styles.NavbuttonText}>SUBSCRIPTION</Text>
              </TouchableOpacity>
            </View>
          ),
        })}
      />
      {user?.rollId === 2 && (
        <>

          <Drawer.Screen
            name="Creatingmeeting"
            component={StackMeetingNavigator}
            options={({ navigation }) => ({
              drawerLabel: 'Creating meeting',
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
                      <Icon name="user" size={28} color="#FFFFFF" />
                    </View>
                    <Text style={styles.NavbuttonText}>CREATE MEETING</Text>
                  </TouchableOpacity>
                </View>
              ),
            })}
          />
          <Drawer.Screen
            name="CreateQR"
            component={CreateQR}
            options={({ navigation }) => ({
              drawerLabel: 'Create QR',
              drawerIcon: ({ color, size }) => (
                <Icon name="qrcode" color={color} size={size} />
              ),
              header: () => (
                <View style={styles.topNav}>
                  <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                    <Icon name="navicon" size={20} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonNavtop}>
                    <View style={styles.topNavlogo}>
                      <Icon name="user" size={28} color="#FFFFFF" />
                    </View>
                    <Text style={styles.NavbuttonText}>CREATE QR</Text>
                  </TouchableOpacity>
                </View>
              ),
            })}
          />

          <Drawer.Screen
            name="Attendance"
            component={Attendance}
            options={({ navigation }) => ({
              drawerLabel: 'Attendance',
              drawerIcon: ({ color, size }) => (
                <Icon name="calendar-check-o" color={color} size={size} />
              ),
              header: () => (
                <View style={styles.topNav}>
                  <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                    <Icon name="navicon" size={20} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonNavtop}>
                    <View style={styles.topNavlogo}>
                      <Icon name="user" size={28} color="#FFFFFF" />
                    </View>
                    <Text style={styles.NavbuttonText}>ATTENDANCE</Text>
                  </TouchableOpacity>
                </View>
              ),
            })}
          />
      
      </>
      )}

      <Drawer.Screen
        name="Logout"
        component={LoginScreen}
        options={({ navigation }) => ({
          drawerLabel: 'Logout',
          drawerIcon: ({ color, size }) => (
            <Icon name="sign-out" color={color} size={size} />
          ),
          headerShown: false,
        })}
      />
    </Drawer.Navigator>
  );
}

function AppNavigator() {

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
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    width: 300, 
    height: 50, 
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
    borderColor:'#A3238F',
    borderWidth:2,
    flexDirection:'row',
  },
  topNavlogo:{
   backgroundColor:'#A3238F',
   padding:5,
   paddingLeft:7.5,
   paddingRight:9,
   borderRadius:50,
  },
  NavbuttonText:{
    color:'#A3238F',
    fontSize:15,  
    fontWeight:'bold',
    marginLeft:10,
    paddingRight:10,
  },
});

export default AppNavigator;