import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../components/layout/MembersStyle';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../constants/Config';
const Members = ({ }) => {
    const userId = useSelector((state) => state.user?.userId);
    console.log("USERID in MEMBERS------------------------------------",userId);
    const [profileData, setProfileData] = useState({});
  console.log("Profile data in Add Business--------------",profileData);
    const fetchData = async () => {
        try {
          const profileResponse = await fetch(`${API_BASE_URL}/api/user/business-info/${userId}`);
          if (!profileResponse.ok) {
            throw new Error('Failed to fetch profile data');
          }
          const profileData = await profileResponse.json();
          console.log("Fetched profile data:", profileData);
          if (profileResponse.status === 404) {
            setProfileData({});
          } else {
            setProfileData(profileData);
          }
        } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
        useFocusEffect(
          useCallback(() => {
            console.log('Fetching profile data for userId:', userId);
            fetchData();
          }, [userId])
        );
    const [searchQuery, setSearchQuery] = useState('');
    const [members, setMembers] = useState([
        { id: '1', name: 'Loki', role: 'CEO', rating: 4 },
        { id: '2', name: 'Ajay', role: 'CTO', rating: 5 },
        { id: '3', name: 'Alice', role: 'Marketing Manager', rating: 3 },
        { id: '4', name: 'jeni', role: 'CEO', rating: 4 },
        { id: '5', name: 'Arun', role: 'CEO', rating: 5 },
        { id: '6', name: 'Jhon', role: 'CEO', rating: 5 },
        { id: '7', name: 'Loki', role: 'CEO', rating: 4 },
        { id: '8', name: 'Loki', role: 'CEO', rating: 4 },
    ]);
    const filteredMembers = members.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const renderMember = ({ item }) => (
        <View style={styles.memberItem}>
            <TouchableOpacity style={styles.memberDetails}>
                <ProfilePic name={item.name} />
                <View style={styles.memberText}>
                    <Text style={styles.memberName}>{item.name}</Text>
                    <Text style={styles.memberRole}>{item.role}</Text>
                </View>
            </TouchableOpacity>
            <View style={styles.ratingContainer}>
                {[...Array(item.rating)].map((_, index) => (
                    <Icon key={index} name="star" size={16} color="#FFD700" />
                ))}
            </View>
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
                keyExtractor={(item) => item.id}
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
const ProfilePic = ({ name }) => {
    const initial = name.charAt(0).toUpperCase();
    return (
        <View style={styles.profilePicContainer}>
            <Text style={styles.profilePicText}>{initial}</Text>
        </View>
    );
};
export default Members;





// import React, { useEffect, useState } from 'react';
// import { View, Text } from 'react-native';
// import { useSelector } from 'react-redux';
// import { API_BASE_URL } from '../constants/Config';
// const Members = () => {
//   const user = useSelector((state) => state.user); 
//   console.log("User-----------------",user);
//   const [members, setMembers] = useState([]);

//   useEffect(() => {
//     const fetchMembers = async () => {
//       try {
//         const response = await fetch(`${API_BASE_URL}/list-members`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             LocationID: user?.LocationID,
//             chapterType: user?.chapterType,
//           }),
//         });
        
//         const data = await response.json();
//         if (data.members) {
//           setMembers(data.members);
//         } else {
//           console.log(data.message);
//         }
//       } catch (error) {
//         console.error('Error fetching members:', error);
//       }
//     };

//     if (user?.LocationID && user?.chapterType) {
//       fetchMembers();
//     }
//   }, [user?.LocationID, user?.chapterType]);

//   return (
//     <View>
//       <Text>Members Page</Text>
//       <Text>{user?.username}</Text>
//       <Text>{user?.chapterType}</Text> 
//       <Text>{user?.LocationID}</Text>  

//       <Text>Members in the same chapter:</Text>
//       {members.length > 0 ? (
//         members.map((member) => (
//           <View key={member.UserId}>
//             <Text>Username: {member.Username}</Text>
//             {/* <Text>Email: {member.Email}</Text> */}
//             <Text>Profession: {member.Profession}</Text>
//           </View>
//         ))
//       ) : (
//         <Text>No members found in this chapter.</Text>
//       )}
//     </View>
//   );
// };

// export default Members;