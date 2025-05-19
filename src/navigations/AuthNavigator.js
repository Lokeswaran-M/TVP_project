import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgetPassword from '../screens/ForgetPassword';
import ResetPassword from '../screens/ResetPassword';
import Custom_input from '../screens/Custom_input';
import Otpscreen from '../screens/Otpscreen';
import AdminPage from '../screens/AdminPage';
import Scanner from '../screens/Scanner';
// import PaymentWebView from '../screens/PaymentWebview';
import HeadAdminPostPage from '../screens/HeadAdminPostPage';
import HeadAdminMembersPage from '../screens/HeadAdminMembersPage';
import MemberDetails from '../screens/MemberDetails';
// import HeadAdminMemberViewPage from '../screens/HeadAdminMemberViewPage';
import HeadAdminProfession from '../screens/HeadAdminProfession';
import HeadAdminNewSubscribers from '../screens/HeadAdminNewSubscribers';
import HeadAdminPaymentsPage from '../screens/HeadAdminPaymentsPage';
import HeadAdminLocation from '../screens/HeadAdminLocation';
import HeadAdminLocationCreate from '../screens/HeadAdminLocationCreate';
import HeadAdminLocationEdit from '../screens/HeadAdminLocationEdit';
import HeadAdminLocationView from '../screens/HeadAdminLocationView';
import { View, Text, StyleSheet, Dimensions,Image, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TPV from '../../assets/images/TPV.png';
import { useNavigation } from '@react-navigation/native';
const { width } = Dimensions.get('window');
const CustomHeaderTPVpng = () => {
  const navigation = useNavigation();
  // const posticon = () => {
  //   navigation.navigate('HeadAdminPostPage');
  // };
  return (
    <View style={styles.topNav}>
    <View >
      <View style={styles.topNavlogohome}>
        <Image 
          source={TPV} 
          style={styles.iconImage}
        />
        {/* <TouchableOpacity onPress={posticon}>
        <Ionicons name="chatbubble-ellipses" size={29} color="#2e3192" />
        </TouchableOpacity> */}
            
      </View>
  
    </View>
  </View>

  );
};
const CustomHeaderLocation = () => {
  return (
    <View style={styles.topNav}>
    <View style={styles.buttonNavtop}>
      <View style={styles.topNavlogo}>
        <Ionicons name="location-outline" size={28} color="#FFFFFF" />
      </View>
      <Text style={styles.NavbuttonText}>LOCATION</Text>
    </View>
  </View>

  );
};
const CustomHeaderMembers = () => {
  return (
    <View style={styles.topNav}>
 
        <View style={styles.buttonNavtop}>
          <View style={styles.topNavlogo}>
            <MaterialIcons name="group" size={28} color="#FFFFFF" />
          </View>
          <Text style={styles.NavbuttonText}>MEMBERS</Text>
        </View>
      </View>

  );
};
const CustomHeaderSubscribers = () => {
  return (
    <View style={styles.topNav}>
    <View style={styles.buttonNavtop}>
      <View style={styles.topNavlogo}>
        <MaterialIcons name="group" size={28} color="#FFFFFF" />
      </View>
      <Text style={styles.NavbuttonText}>New Subscribers</Text>
    </View>
  </View>
  );
};
const CustomHeaderPayments = () => {
  return (
    <View style={styles.topNav}>
      <View style={styles.buttonNavtop}>
        <View style={styles.topNavlogo}>
          <MaterialIcons name="group" size={28} color="#FFFFFF" />
        </View>
        <Text style={styles.NavbuttonText}>Payments</Text>
      </View>
    </View>
  );
};
const CustomHeaderPost = () => {
  return (
    <View style={styles.topNav}>
      <View style={styles.buttonNavtop}>
        <View style={styles.topNavlogo}>
        <Ionicons name="chatbubble-ellipses" size={28} color="#FFFFFF"/>
        </View>
        <Text style={styles.NavbuttonText}>One Minute Presentation Post</Text>
      </View>
    </View>
  );
};
const CustomAdminProfession = () => {
  return (
    <View style={styles.topNav}>
      <View style={styles.buttonNavtop}>
        <View style={styles.topNavlogo}>
        <MaterialIcons name="business-center" size={27} color="white" style={styles.icon} />
        </View>
        <Text style={styles.NavbuttonText}>profession</Text>
      </View>
    </View>
  );
};
const Stack = createStackNavigator();
const headerOptions = {
  headerStyle: { backgroundColor: '#2e3192' },
  headerTintColor: '#fff',
};
const AuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen  name="Login"   component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen  name="Register"  component={RegisterScreen}   options={{ title: 'Register ', headerShown: false,  ...headerOptions}}   />
      <Stack.Screen  name="ForgetPassword"  component={ForgetPassword}  options={{ title: 'Forget Password',headerShown: false, ...headerOptions }} />
      <Stack.Screen  name="ResetPassword"  component={ResetPassword}    options={{ title: 'Reset Password', headerShown: false, ...headerOptions}} />
      <Stack.Screen  name="Custom_input"  component={Custom_input}   options={{ headerShown: false }} />
      <Stack.Screen  name="Otpscreen"  component={Otpscreen}   options={{ title: 'Otpscreen ', headerShown: false,   ...headerOptions}} />
      <Stack.Screen  name="Scanner"  component={Scanner}/>
      <Stack.Screen  name="AdminPage"  component={AdminPage}   options={{ headerShown:true , header: () => <CustomHeaderTPVpng/>, headerLeft: () => null, }}/>
        <Stack.Screen name="AdminMemberstack" component={AdminMemberstack} options={{ headerShown: false, headerLeft: () => null, }}/>
        <Stack.Screen name="HeadAdminNewSubscribers" component={HeadAdminNewSubscribers} options={{ headerShown:true , header: () => <CustomHeaderSubscribers/>, headerLeft: () => null,  }} />
        <Stack.Screen name="HeadAdminPaymentsPage" component={HeadAdminPaymentsPage} options={{headerShown:true , header: () => <CustomHeaderPayments/>, headerLeft: () => null, }} />
        <Stack.Screen name="AdminLocationstack" component={AdminLocationstack} options={{headerShown: false, headerLeft: () => null,  }}/> 
        <Stack.Screen name="AdminProfessionstack" component={AdminProfessionstack} options={{headerShown: false, headerLeft: () => null,  }}/> 
        <Stack.Screen name="HeadAdminPostPage" component={HeadAdminPostPage} options={{headerShown: true,header: () => <CustomHeaderPost/>, headerLeft: () => null,  }}/> 
        <Stack.Screen name="MemberDetails" component={MemberDetails} options={{ headerShown: true, header: () => <CustomHeaderMembers/>, headerLeft: () => null, }} />
     
    </Stack.Navigator>

  );
};
const AdminMemberstack = () => (
  <Stack.Navigator>
    <Stack.Screen name="HeadAdminMembersPage" component={HeadAdminMembersPage} options={{ headerShown: true, header: () => <CustomHeaderMembers/>, headerLeft: () => null,  }} />
    <Stack.Screen name="MemberDetails" component={MemberDetails} options={{ headerShown: true, header: () => <CustomHeaderMembers/>, headerLeft: () => null, }} />
  </Stack.Navigator>
);
const AdminLocationstack = () => (
  <Stack.Navigator>
    <Stack.Screen name="HeadAdminLocation" component={HeadAdminLocation} options={{ headerShown: true, header: () => <CustomHeaderLocation/>, headerLeft: () => null, }} />
    <Stack.Screen name="HeadAdminLocationCreate" component={HeadAdminLocationCreate} options={{ headerShown: true,header: () => <CustomHeaderLocation/>, headerLeft: () => null, }} />
    <Stack.Screen name="HeadAdminLocationEdit" component={HeadAdminLocationEdit} options={{ headerShown: true ,header: () => <CustomHeaderLocation/>, headerLeft: () => null,}} />
    <Stack.Screen name="HeadAdminLocationView" component={HeadAdminLocationView} options={{ headerShown: true ,header: () => <CustomHeaderLocation/>, headerLeft: () => null, }} />
  </Stack.Navigator>
);
const AdminProfessionstack = () => (
  <Stack.Navigator>
    <Stack.Screen name="HeadAdminProfession" component={HeadAdminProfession} options={{ headerShown: true, header: () => <CustomAdminProfession/>, headerLeft: () => null,  }} />
  </Stack.Navigator>
);
const styles = StyleSheet.create({
  iconImage:{
    backgroundColor:'#FFFFFF',
    width: 300, 
    height: 55, 
    resizeMode: 'contain',
  },
  topNav: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomEndRadius: 15,
    borderBottomStartRadius: 15,
    justifyContent:'center',

  },
  topNavlogohome:{
    flexDirection: 'row',
    alignItems: 'center',
  },

  buttonNavtop: {
    borderRadius: 25,
    alignItems: 'center',
    borderColor: '#2e3192',
    borderWidth: 2,
    flexDirection: 'row',
  },
  topNavlogo: {
    backgroundColor: '#2e3192',
    padding: 4,
    borderRadius: 50,
    justifyContent: 'center',
  },
  NavbuttonText: {
    color: '#2e3192',
    fontSize: width * 0.04,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
});


export default AuthNavigator;