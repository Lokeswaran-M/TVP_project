import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import {NavigationContainer} from '@react-navigation/native'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {TouchableOpacity} from 'react-native'
import HeadAdminHomeScreen from './HeadAdminHomeScreen'
import HeadAdminMembersPage from './HeadAdminMembersPage'
import HeadAdminNewSubscribers from './HeadAdminNewSubscribers'
import HeadAdminPaymentsPage from './HeadAdminPaymentsPage'
import HeadAdminLocation from './HeadAdminLocation'
import HeadAdminLocationCreate from './HeadAdminLocationCreate'
import HeadAdminMemberViewPage from './HeadAdminMemberViewPage'
import HeadAdminLocationView from './HeadAdminLocationView'
import HeadAdminLocationEdit from './HeadAdminLocationEdit'



const Tab = createBottomTabNavigator()

const AdminPage = () => {
  return (

      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#A3238F',
          tabBarInactiveTintColor: '#A3238F',
          tabBarLabelStyle: {
            fontSize: 13,
            fontWeight: 'bold',
            paddingBottom: 2,
          },
        }}>
        <Tab.Screen
          name='Home'
          component={HeadAdminHomeScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <AntDesign name='home' color={color} size={30} />
            ),
            headerShown: false,
          }}
        />

        <Tab.Screen
          name='HeadAdminMembersPage'
          component={HeadAdminMembersPage}
          options={{
            tabBarButton: props => (
              <TouchableOpacity {...props} disabled={true} style={{opacity: 0}}>
                <Icon name='users' color='gray' size={0} />
              </TouchableOpacity>
            ),
            headerShown: false,
          }}
        />
        <Tab.Screen
          name='HeadAdminNewSubscribers'
          component={HeadAdminNewSubscribers}
          options={{
            tabBarButton: props => (
              <TouchableOpacity {...props} disabled={true} style={{opacity: 0}}>
                <Icon name='users' color='gray' size={0} />
              </TouchableOpacity>
            ),
            headerShown: false,
          }}
        />
        <Tab.Screen
          name='HeadAdminPaymentsPage'
          component={HeadAdminPaymentsPage}
          options={{
            tabBarButton: props => (
              <TouchableOpacity {...props} disabled={true} style={{opacity: 0}}>
                <Icon name='users' color='gray' size={0} />
              </TouchableOpacity>
            ),
            headerShown: false,
          }}
        />
        <Tab.Screen
          name='HeadAdminLocation'
          component={HeadAdminLocation}
          options={{
            tabBarButton: props => (
              <TouchableOpacity {...props} disabled={true} style={{opacity: 0}}>
                <Icon name='users' color='gray' size={0} />
              </TouchableOpacity>
            ),
            headerShown: false,
          }}
        />
        <Tab.Screen
          name='HeadAdminLocationCreate'
          component={HeadAdminLocationCreate}
          options={{
            tabBarButton: props => (
              <TouchableOpacity {...props} disabled={true} style={{opacity: 0}}>
                <Icon name='users' color='gray' size={0} />
              </TouchableOpacity>
            ),
            headerShown: false,
          }}
        />
                <Tab.Screen
          name='HeadAdminLocationView'
          component={HeadAdminLocationView}
          options={{
            tabBarButton: props => (
              <TouchableOpacity {...props} disabled={true} style={{opacity: 0}}>
                <Icon name='users' color='gray' size={0} />
              </TouchableOpacity>
            ),
            headerShown: false,
          }}
        />
                  <Tab.Screen
          name='HeadAdminLocationEdit'
          component={HeadAdminLocationEdit}
          options={{
            tabBarButton: props => (
              <TouchableOpacity {...props} disabled={true} style={{opacity: 0}}>
                <Icon name='users' color='gray' size={0} />
              </TouchableOpacity>
            ),
            headerShown: false,
          }}
        />
                  <Tab.Screen
          name='HeadAdminMemberViewPage'
          component={HeadAdminMemberViewPage}
          options={{
            tabBarButton: props => (
              <TouchableOpacity {...props} disabled={true} style={{opacity: 0}}>
                <Icon name='users' color='gray' size={0} />
              </TouchableOpacity>
            ),
            headerShown: false,
          }}
        />
    
      </Tab.Navigator>

  )
}

export default AdminPage;
