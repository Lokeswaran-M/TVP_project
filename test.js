import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../components/layout/MembersStyle';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../constants/Config';
import { useNavigation } from '@react-navigation/native';

const Members = () => {
    const navigation = useNavigation();
    const userId = useSelector((state) => state.user?.userId);
    const [profileData, setProfileData] = useState({});
    const [members, setMembers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchData = async () => {
        try {
            const profileResponse = await fetch(${API_BASE_URL}/api/user/business-info/${userId});
            if (!profileResponse.ok) {
                throw new Error('Failed to fetch profile data');
            }
            const profileData = await profileResponse.json();
            console.log("PROFILE DATA IN MEMBERS LIST------------------------------------",profileData);
            setProfileData(profileData);
        } catch (error) {
            console.error('Error fetching profile data:', error);
        }
    };

    const fetchMembers = async () => {
        if (!profileData.LocationID || !profileData.ChapterType) {
            console.log("Profile data not available yet");
            return;
        }
        try {
            const membersResponse = await fetch(${API_BASE_URL}/list-members, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    LocationID: profileData.LocationID,
                    chapterType: profileData.ChapterType,
                }),
            });
            if (!membersResponse.ok) {
                throw new Error('Failed to fetch members');
            }
            const data = await membersResponse.json();
            console.log("MEMBERS DATA IN MEMBERS LIST SCREEN---------------------------------", data);
            const updatedMembers = await Promise.all(data.members.map(async member => {
                let totalStars = 0;
                if (member.ratings.length > 0) {
                    member.ratings.forEach(rating => {
                        totalStars += parseFloat(rating.average) || 0;
                    });
                    const totalAverage = totalStars / member.ratings.length;
                    member.totalAverage = Math.round(totalAverage) || 0;
                } else {
                    member.totalAverage = 0;
                }
                
                const imageResponse = await fetch(${API_BASE_URL}/profile-image?userId=${member.UserId});
                if (imageResponse.ok) {
                    const imageData = await imageResponse.json();
                    member.profileImage = imageData.imageUrl;
                } else {
                    console.error('Failed to fetch profile image:', member.UserId);
                    member.profileImage = null;
                }
                return member;
            }));
            
            setMembers(updatedMembers);
        } catch (error) {
            console.error('Error fetching members:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [userId])
    );

    useFocusEffect(
        useCallback(() => {
            if (profileData.LocationID && profileData.ChapterType) {
                fetchMembers();
            }
        }, [profileData])
    );

    const filteredMembers = members.filter(member =>
        member.Username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const renderMember = ({ item }) => (
        <View style={styles.memberItem}>
            <TouchableOpacity
                style={styles.memberDetails}
                onPress={() => navigation.navigate('MemberDetails', { userId: item.UserId })}
            >
                <ProfilePic imageUrl={item.profileImage} name={item.Username} />
                <View style={styles.memberText}>
                    <Text style={styles.memberName}>{item.Username}</Text>
                    <Text style={styles.memberRole}>{item.Profession}</Text>
                </View>
                <View style={styles.ratingContainer}>
    {[...Array(Math.max(0, item.totalAverage))].map((_, index) => (
        <Icon key={index} name="star" size={16} color="#FFD700" />
    ))}
</View>
            </TouchableOpacity>
        </View>
    );
    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search members..."
                    placeholderTextColor="black"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    color='#A3238F'
                />
                <View style={styles.searchIconContainer}>
                    <Icon name="search" size={23} color="#A3238F" />
                </View>
            </View>
            <FlatList
                data={filteredMembers}
                renderItem={renderMember}
                keyExtractor={(item) => item.UserId.toString()}
                contentContainerStyle={styles.memberList}
            />
            <View style={styles.memberCountContainer}>
                <Text style={styles.memberCountText}>
                    Count: {filteredMembers.length}
                </Text>
            </View>
        </View>
    );
};

const ProfilePic = ({ name, imageUrl }) => {
    if (imageUrl) {
        return (
            <Image
                source={{ uri: imageUrl }}
                style={styles.profilePicImage}
            />
        );
    }
    const initial = name.charAt(0).toUpperCase();
    return (
        <View style={styles.profilePicContainer}>
            <Text style={styles.profilePicText}>{initial}</Text>
        </View>
    );
};
export default Members;



























// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity } from 'react-native';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import { FontAwesome, Icon } from 'react-native-vector-icons';
// import TabNavigator from './TabNavigator';
// import ProfileStackNavigator from './ProfileStackNavigator';
// import SubstituteLogin from './SubstituteLogin';
// import Payment from './Payment';
// import Subscription from './Subscription';
// import LoginScreen from './LoginScreen';
// import DrawerContent from './DrawerContent';
// import { HeaderWithImage, HeaderWithoutImage } from './Headers';
// import Creatingmeeting from './Creatingmeeting';
// import CreateQR from './CreateQR';
// import Attendance from './Attendance';

// const Drawer = createDrawerNavigator();

// function DrawerNavigator() {
//   const [rollId, setRollId] = useState(2); // Example rollId, can be 2 or 3 depending on user role

//   return (
//     <Drawer.Navigator
//       initialRouteName="Home"
//       drawerContent={(props) => <DrawerContent {...props} />}
//       screenOptions={{
//         drawerActiveTintColor: '#a3238f',
//         drawerInactiveTintColor: 'black',
//         drawerStyle: {
//           backgroundColor: 'white',
//         },
//       }}
//     >
//       <Drawer.Screen
//         name="Home"
//         component={TabNavigator}
//         options={{
//           drawerLabel: 'Home',
//           drawerIcon: ({ color, size }) => (
//             <FontAwesome name="home" color={color} size={size} />
//           ),
//           ...HeaderWithImage(),
//         }}
//       />

//       <Drawer.Screen
//         name="Profile screen"
//         component={ProfileStackNavigator}
//         options={({ navigation }) => ({
//           drawerLabel: 'View Profile',
//           drawerIcon: ({ color, size }) => (
//             <Icon name="user-circle" color={color} size={size} />
//           ),
//           headerShown: false,
//           ...HeaderWithoutImage({ navigation }),
//         })}
//       />

//       {/* Conditionally render these screens for `rollId === 2` */}
//       {rollId === 2 && (
//         <>
//           <Drawer.Screen
//             name="Creatingmeeting"
//             component={Creatingmeeting}
//             options={({ navigation }) => ({
//               drawerLabel: 'Creatingmeeting',
//               drawerIcon: ({ color, size }) => (
//                 <Icon name="ticket" color={color} size={size} />
//               ),
//               ...HeaderWithoutImage({ navigation }),
//             })}
//           />

//           <Drawer.Screen
//             name="CreateQR"
//             component={CreateQR}
//             options={({ navigation }) => ({
//               drawerLabel: 'CreateQR',
//               drawerIcon: ({ color, size }) => (
//                 <Icon name="ticket" color={color} size={size} />
//               ),
//               ...HeaderWithoutImage({ navigation }),
//             })}
//           />

//           <Drawer.Screen
//             name="Attendance"
//             component={Attendance}
//             options={({ navigation }) => ({
//               drawerLabel: 'Attendance',
//               drawerIcon: ({ color, size }) => (
//                 <Icon name="ticket" color={color} size={size} />
//               ),
//               ...HeaderWithoutImage({ navigation }),
//             })}
//           />
//         </>
//       )}

//       <Drawer.Screen
//         name="Substitute Login"
//         component={SubstituteLogin}
//         options={({ navigation }) => ({
//           drawerLabel: 'Substitute Login',
//           drawerIcon: ({ color, size }) => (
//             <Icon name="user-plus" color={color} size={size} />
//           ),
//           header: () => (
//             <View style={styles.topNav}>
//               <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
//                 <Icon name="navicon" size={20} color="black" />
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.buttonNavtop}>
//                 <View style={styles.topNavlogo}>
//                   <Icon name="user" size={28} color="#FFFFFF" />
//                 </View>
//                 <Text style={styles.NavbuttonText}>SUBSTITUTE LOGIN</Text>
//               </TouchableOpacity>
//             </View>
//           ),
//         })}
//       />

//       <Drawer.Screen
//         name="Payment"
//         component={Payment}
//         options={({ navigation }) => ({
//           drawerLabel: 'Payment',
//           drawerIcon: ({ color, size }) => (
//             <Icon name="money" color={color} size={size} />
//           ),
//           ...HeaderWithoutImage({ navigation }),
//         })}
//       />

//       <Drawer.Screen
//         name="Subscription"
//         component={Subscription}
//         options={({ navigation }) => ({
//           drawerLabel: 'Subscription',
//           drawerIcon: ({ color, size }) => (
//             <Icon name="ticket" color={color} size={size} />
//           ),
//           ...HeaderWithoutImage({ navigation }),
//         })}
//       />

//       <Drawer.Screen
//         name="Logout"
//         component={LoginScreen}
//         options={({ navigation }) => ({
//           drawerLabel: 'Logout',
//           drawerIcon: ({ color, size }) => (
//             <Icon name="sign-out" color={color} size={size} />
//           ),
//           headerShown: false,
//         })}
//       />
//     </Drawer.Navigator>
//   );
// }

// export default DrawerNavigator;
