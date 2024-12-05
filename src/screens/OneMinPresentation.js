import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import styles from '../components/layout/MembersStyle';
import { API_BASE_URL } from '../constants/Config';

const OneMinPresentation = ({ route, navigation }) => {
  const { eventId, slotId, locationId } = route.params;

  const [searchQuery, setSearchQuery] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/attendance/${eventId}/${locationId}/${slotId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("-------------------data---------------------", data);

        // Fetch profile images for each member
        const updatedMembers = await Promise.all(data.map(async (member) => {
          try {
            const imageResponse = await fetch(`${API_BASE_URL}/profile-image?userId=${member.UserId}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            if (imageResponse.ok) {
              const imageData = await imageResponse.json();
              const uniqueImageUrl = `${imageData.imageUrl}?t=${new Date().getTime()}`; // Cache busting
              member.profileImage = uniqueImageUrl; // Assign image URL to member
            } else {
              console.error('Failed to fetch profile image:', member.UserId);
              member.profileImage = null; // Set image to null if fetch fails
            }
          } catch (error) {
            console.error('Error fetching image:', error);
            member.profileImage = null; // Set image to null if there is an error
          }
          
          // Format the InTime field
          const inTime = new Date(member.InTime);
          const formattedTime = inTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          // Add formatted InTime as a new property
          member.formattedInTime = formattedTime;

          return member; // Return member with updated profile image and formatted InTime
        }));

        setAttendanceData(updatedMembers); // Set attendance data with profile images and formatted time
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [eventId, locationId, slotId]); // Add locationId and slotId to dependencies

  const filteredMembers = attendanceData.filter(member =>
    member.Username && member.Username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderMember = ({ item }) => (
    <TouchableOpacity style={styles.memberItem} onPress={() => handleAlarmPress(item)} >
      <View style={styles.imageColumn}>
        <Image
          source={{ uri: item.profileImage }} 
          style={[styles.profileImage]}
        />
      </View>

      {/* Text Column */}
      <View style={styles.textColumn}>
        <Text style={styles.memberName}>{item.Username}</Text>
        <Text style={styles.memberRole} numberOfLines={1}>
          {item.Profession} 
        </Text>
 
      </View>

      <View style={styles.alarmContainer}>
        <TouchableOpacity onPress={() => handleAlarmPress(item)}>
          <MaterialIcons name="alarm" size={28} right={-10} color="#A3238F" />
          <Text style={styles.memberTime}  >{item.formattedInTime}</Text> 
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const handleAlarmPress = (member) => {
    navigation.navigate('StopWatch', { member });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#A3238F" />
      ) : (
        <>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by username..."
              placeholderTextColor="black"
              value={searchQuery}
              onChangeText={setSearchQuery}
              color="#A3238F"
            />
            <View style={styles.searchIconContainer}>
              <Icon name="search" size={23} color="#A3238F" />
            </View>
          </View>

          {filteredMembers.length === 0 ? ( // Check if no members are found
            <View style={styles.noResultsTextcon}>
              <Text style={styles.noResultsText}>No users found</Text>
            </View>
          ) : (
            <FlatList
              data={filteredMembers}
              renderItem={renderMember} // Pass the right function here
              keyExtractor={(item) => item.UserId.toString()}
              contentContainerStyle={styles.memberList}
            />
          )}

          <View style={styles.memberCountContainer}>
            <Text style={styles.memberCountText}>Count: {filteredMembers.length}</Text>
          </View>
        </>
      )}
    </View>
  );
};

export default OneMinPresentation;















// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Image } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
// import styles from '../components/layout/MembersStyle';
// import { API_BASE_URL } from '../constants/Config';

// const OneMinPresentation = ({ route, navigation }) => {
//   const { eventId, slotId, locationId } = route.params;

//   const [searchQuery, setSearchQuery] = useState('');
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchAttendanceData = async () => {
//       try {
//         const response = await fetch(`${API_BASE_URL}/attendance/${eventId}/${locationId}/${slotId}`);
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();
//         console.log("-------------------data---------------------",data);
//         // Fetch profile images for each member
//         const updatedMembers = await Promise.all(data.map(async (member) => {
//           try {
//             const imageResponse = await fetch(`${API_BASE_URL}/profile-image?userId=${member.UserId}`, {
//               method: 'GET',
//               headers: {
//                 'Content-Type': 'application/json',
//               },
//             });

//             if (imageResponse.ok) {
//               const imageData = await imageResponse.json();
//               const uniqueImageUrl = `${imageData.imageUrl}?t=${new Date().getTime()}`; // Cache busting
//               member.profileImage = uniqueImageUrl; // Assign image URL to member
//             } else {
//               console.error('Failed to fetch profile image:', member.UserId);
//               member.profileImage = null; // Set image to null if fetch fails
//             }
//           } catch (error) {
//             console.error('Error fetching image:', error);
//             member.profileImage = null; // Set image to null if there is an error
//           }
//           return member; // Return member with updated profile image
//         }));

//         setAttendanceData(updatedMembers); // Set attendance data with profile images
//       } catch (error) {
//         console.error('Error fetching attendance data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAttendanceData();
//   }, [eventId, locationId, slotId]); // Add locationId and slotId to dependencies

//   const filteredMembers = attendanceData.filter(member =>
//     member.Username && member.Username.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const renderMember = ({ item }) => (
//     <TouchableOpacity style={styles.memberItem} onPress={() => handleAlarmPress(item)} >
//         <View style={styles.imageColumn}>

//           <Image
//            source={{ uri: item.profileImage }} // Use item.profileImage instead of image
//             style={[
//               styles.profileImage,

//             ]}
//           />
//         </View>
  
//         {/* Text Column */}
//         <View style={styles.textColumn}>
//           <Text style={styles.memberName}>{item.Username}</Text>
//           <Text style={styles.memberRole} numberOfLines={1}>
//             {item.Profession} {/* Change item.Profession instead of member.Profession */}
//           </Text>
//         </View>
  
//       <View style={styles.alarmContainer}>
//         <TouchableOpacity onPress={() => handleAlarmPress(item)}>
//           <MaterialIcons name="alarm" size={28} color="#A3238F" />
//           <Text>Time</Text>
//         </TouchableOpacity>
//       </View>
//     </TouchableOpacity>
//   );

//   const handleAlarmPress = (member) => {
//     navigation.navigate('StopWatch', { member });
//   };

//   return (
//     <View style={styles.container}>
//       {loading ? (
//         <ActivityIndicator size="large" color="#A3238F" />
//       ) : (
//         <>
//           <View style={styles.searchContainer}>
//             <TextInput
//               style={styles.searchInput}
//               placeholder="Search by username..."
//               placeholderTextColor="black"
//               value={searchQuery}
//               onChangeText={setSearchQuery}
//               color="#A3238F"
//             />
//             <View style={styles.searchIconContainer}>
//               <Icon name="search" size={23} color="#A3238F" />
//             </View>
//           </View>

//           {filteredMembers.length === 0 ? ( // Check if no members are found
//           <View style={styles.noResultsTextcon}>
//           <Text style={styles.noResultsText}>No users found</Text>
//           </View>
           
//           ) : (
//             <FlatList
//               data={filteredMembers}
//               renderItem={renderMember} // Pass the right function here
//               keyExtractor={(item) => item.UserId.toString()}
//               contentContainerStyle={styles.memberList}
//             />
//           )}

//           <View style={styles.memberCountContainer}>
//             <Text style={styles.memberCountText}>Count: {filteredMembers.length}</Text>
//           </View>
//         </>
//       )}
//     </View>
//   );
// };

// export default OneMinPresentation;



























// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Image } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import styles from '../components/layout/MembersStyle';
// import { API_BASE_URL } from '../constants/Config';

// const OneMinPresentation = ({ route, navigation }) => {
//   const { eventId, slotId, locationId } = route.params;

//   const [searchQuery, setSearchQuery] = useState('');
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchAttendanceData = async () => {
//       try {
//         const response = await fetch(`${API_BASE_URL}/attendance/${eventId}/${locationId}/${slotId}`);
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();
        
//         // Fetch profile images for each member
//         const updatedMembers = await Promise.all(data.map(async (member) => {
//           try {
//             const imageResponse = await fetch(`${API_BASE_URL}/profile-image?userId=${member.UserId}`, {
//               method: 'GET',
//               headers: {
//                 'Content-Type': 'application/json',
//               },
//             });

//             if (imageResponse.ok) {
//               const imageData = await imageResponse.json();
//               const uniqueImageUrl = `${imageData.imageUrl}?t=${new Date().getTime()}`; // Cache busting
//               member.profileImage = uniqueImageUrl; // Assign image URL to member
//             } else {
//               console.error('Failed to fetch profile image:', member.UserId);
//               member.profileImage = null; // Set image to null if fetch fails
//             }
//           } catch (error) {
//             console.error('Error fetching image:', error);
//             member.profileImage = null; // Set image to null if there is an error
//           }
//           return member; // Return member with updated profile image
//         }));

//         setAttendanceData(updatedMembers); // Set attendance data with profile images
//       } catch (error) {
//         console.error('Error fetching attendance data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAttendanceData();
//   }, [eventId, locationId, slotId]); // Add locationId and slotId to dependencies

//   const filteredMembers = attendanceData.filter(member =>
//     member.Username && member.Username.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const renderMember = ({ item }) => (
//     <TouchableOpacity style={styles.memberItem} onPress={() => handleAlarmPress(item)} >
//       <View style={styles.memberDetails}>
//         <ProfilePic image={item.profileImage} name={item.Username} />
//         <View style={styles.memberText}>
//           <Text style={styles.memberName}>{item.Username}</Text>
//           <Text style={styles.memberRole}>{item.Profession}</Text>
//         </View>
//       </View>
//       <View style={styles.alarmContainer}>
//         <TouchableOpacity onPress={() => handleAlarmPress(item)}>
//           <MaterialIcons name="alarm" size={28} color="#A3238F" />
//         </TouchableOpacity>
//       </View>
//     </TouchableOpacity>
//   );

//   const handleAlarmPress = (member) => {
//     navigation.navigate('StopWatch', { member });
//   };

//   return (
//     <View style={styles.container}>
//       {loading ? (
//         <ActivityIndicator size="large" color="#A3238F" />
//       ) : (
//         <>
//           <View style={styles.searchContainer}>
//             <TextInput
//               style={styles.searchInput}
//               placeholder="Search by username..."
//               placeholderTextColor="black"
//               value={searchQuery}
//               onChangeText={setSearchQuery}
//               color="#A3238F"
//             />
//             <View style={styles.searchIconContainer}>
//               <Icon name="search" size={23} color="#A3238F" />
//             </View>
//           </View>

//           {filteredMembers.length === 0 ? ( // Check if no members are found
//           <View style={styles.noResultsTextcon}>
//           <Text style={styles.noResultsText}>No users found</Text>
//           </View>
           
//           ) : (
//             <FlatList
//               data={filteredMembers}
//               renderItem={renderMember}
//               keyExtractor={(item) => item.UserId.toString()}
//               contentContainerStyle={styles.memberList}
//             />
//           )}

//           <View style={styles.memberCountContainer}>
//             <Text style={styles.memberCountText}>Count: {filteredMembers.length}</Text>
//           </View>
//         </>
//       )}
//     </View>
//   );
// };

// const ProfilePic = ({ image, name }) => {
//   const initial = name.charAt(0).toUpperCase();

//   return (
//     <View style={styles.profilePicContainer}>
//       {image ? (
//         <Image source={{ uri: image }} style={styles.profileImage} />
//       ) : (
//         <Text style={styles.profilePicText}>{initial}</Text>
//       )}
//     </View>
//   );
// };

// export default OneMinPresentation;
