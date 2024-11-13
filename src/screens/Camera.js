import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, ActivityIndicator, Text, TouchableOpacity, Image, Alert, useWindowDimensions,ScrollView } from 'react-native';
import { API_BASE_URL } from '../constants/Config';
import { TabView, TabBar } from 'react-native-tab-view';
import { useSelector } from 'react-redux';
import { launchCamera } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../components/layout/MembersStyle';
import { SafeAreaView } from 'react-native-safe-area-context';

// TabContent Component - Displays list of members, photo upload functionality
const TabContent = ({ chapterType, locationId, navigation }) => {
  const userId = useSelector((state) => state.user?.userId);
  console.log('---------------data userid--------------', userId);

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMeetId, setSelectedMeetId] = useState(null); // Store the MeetId of the selected member

  // Fetching members data
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        console.log('Fetching members...');
        const response = await fetch(`${API_BASE_URL}/list-members`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ LocationID: locationId, chapterType, userId }),
        });

        if (!response.ok) throw new Error('Failed to fetch members');

        const data = await response.json();
        console.log('----------------------------------member data=------------------', data);

        const updatedMembers = await Promise.all(data.members.map(async (member) => {
          let totalStars = 0;
          if (member.ratings?.length > 0) {
            totalStars = member.ratings.reduce((acc, rating) => acc + parseFloat(rating.average), 0);
            member.totalAverage = totalStars / member.ratings.length;
          } else {
            member.totalAverage = 0;
          }

          const imageResponse = await fetch(`${API_BASE_URL}/profile-image?userId=${member.UserId}`);
          if (imageResponse.ok) {
            const imageData = await imageResponse.json();
            member.profileImage = `${imageData.imageUrl}?t=${new Date().getTime()}`;
          } else {
            member.profileImage = null;
          }

          return member;
        }));

        setMembers(updatedMembers);
      } catch (error) {
        console.error('Error fetching members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [chapterType, locationId, userId]);

  const filteredMembers = members.filter((member) =>
    member.Username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle selecting a member and setting their MeetId
  const handleMemberClick = (member) => {
    const meetId = member.UserId; // Using the member's UserId as MeetId
    setSelectedMeetId(meetId);
    console.log('Selected MeetId:', meetId);
    openCamera();
    // You can also navigate to a new screen or show details here
  };

  // Insert meeting data
  const insertMeetingData = async (userId, meetId, chapterType, locationId, photoUri) => {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: photoUri,
        type: 'image/jpeg',
        name: `${userId}_${new Date().toISOString().replace(/[-:.]#/g, '').slice(0, 12)}.jpeg`,
      });
      // formData.append('UserId', userId);
      formData.append('MeetId', meetId); 
      formData.append('SlotID', chapterType);  
      formData.append('LocationID', locationId);

      console.log('==================fromdat===============', formData);
      const uploadResponse = await fetch(`${API_BASE_URL}/upload-member-details?userId=${userId}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const result = await uploadResponse.json();
      // console.log("Data in the frontend:", result);

      if (result.message === 'Member details and image uploaded successfully!') {
        Alert.alert('Success', 'Photo and data uploaded successfully');
        console.log('Data Inserted:', result);
        // Handle successful upload here (e.g., update UI or navigate)
      } else {
        Alert.alert('Error', 'Photo and data upload failed');
      }
    } catch (error) {
      console.error('Error during upload:', error);
      Alert.alert('Error', 'Something went wrong while uploading data');
    }
  };

  // Open camera to take a photo
  const openCamera = () => {
    const options = { mediaType: 'photo', cameraType: 'front' };
    launchCamera(options, async (response) => {
      if (response.didCancel || response.errorCode) return;
      const photoUri = response.assets[0].uri; // Get the URI of the taken photo
      if (selectedMeetId) {
        await insertMeetingData(userId, selectedMeetId, chapterType, locationId, photoUri);
      } else {
        Alert.alert('Error', 'Please select a member first.');
      }
    });
  };

  const renderItem = ({ item }) => (
  <View>
    <TouchableOpacity style={styles.memberItem} onPress={() => handleMemberClick(item)}>
      <View style={styles.memberDetails}>
        <Image source={{ uri: item.profileImage }} style={styles.profileImage} />
        <View style={styles.memberText}>
          <Text style={styles.memberName}>{item.Username}</Text>
          <Text style={styles.memberRole}>{item.Profession}</Text>
        </View>
      </View>
      <View style={styles.alarmContainer}>
        <TouchableOpacity onPress={() => handleMemberClick(item)}>
          <Icon name="camera" size={24} color="#A3238F" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  </View>
  
    

  );

  return (
    <View style={{ flex: 1 }}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search members..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="black"
          color="#A3238F"
        />
        <View style={styles.searchIconContainer}>
          <Icon name="search" size={23} color="#A3238F" />
        </View>
      </View>
  
      {/* FlatList - Scrollable List of Members */}
      <ScrollView style={{ flex: 1 }}>
        <FlatList
          data={filteredMembers}
          keyExtractor={(item) => item.UserId.toString()}
          contentContainerStyle={styles.memberList}
          renderItem={renderItem}
        />
      </ScrollView>
    </View>
  );
  
};
// Main TabView Example Component
export default function TabViewExample({ navigation }) {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([]);
  const userId = useSelector((state) => state.user?.userId);
  const [businessInfo, setBusinessInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinessInfo = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/user/business-infodrawer/${userId}`);
        const data = await response.json();

        if (response.ok) {
          const updatedRoutes = data.map((business, index) => ({
            key: `business${index + 1}`,
            title: business.BD,
            chapterType: business.CT,
            locationId: business.L,
          }));
          setRoutes(updatedRoutes);
          setBusinessInfo(data);
        } else {
          console.error('Error fetching business info:', data.message);
        }
      } catch (error) {
        console.error('API call error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessInfo();
  }, [userId]);

  const renderScene = ({ route }) => {
    const business = businessInfo.find((b) => b.BD === route.title);
    return (
      <TabContent
        chapterType={business?.CT}
        locationId={business?.L}
        userId={userId}
        navigation={navigation}
      />
    );
  };

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: '#A3238F' }}
      style={{ backgroundColor: '#F3ECF3' }}
      activeColor="#A3238F"
      inactiveColor="gray"
      labelStyle={{ fontSize: 14 }}
    />
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={renderTabBar}
    />
  );
}

























// import React, { useEffect, useState } from 'react';
// import { View, TextInput, FlatList, ActivityIndicator, Text, TouchableOpacity, Image, Alert, useWindowDimensions,ScrollView } from 'react-native';
// import { API_BASE_URL } from '../constants/Config';
// import { TabView, TabBar } from 'react-native-tab-view';
// import { useSelector } from 'react-redux';
// import { launchCamera } from 'react-native-image-picker';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import styles from '../components/layout/MembersStyle';
// import { SafeAreaView } from 'react-native-safe-area-context';

// // TabContent Component - Displays list of members, photo upload functionality
// const TabContent = ({ chapterType, locationId, navigation }) => {
//   const userId = useSelector((state) => state.user?.userId);
//   console.log('---------------data userid--------------', userId);

//   const [members, setMembers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedMeetId, setSelectedMeetId] = useState(null); // Store the MeetId of the selected member

//   // Fetching members data
//   useEffect(() => {
//     const fetchMembers = async () => {
//       try {
//         console.log('Fetching members...');
//         const response = await fetch(`${API_BASE_URL}/list-members`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ LocationID: locationId, chapterType, userId }),
//         });

//         if (!response.ok) throw new Error('Failed to fetch members');

//         const data = await response.json();
//         console.log('----------------------------------member data=------------------', data);

//         const updatedMembers = await Promise.all(data.members.map(async (member) => {
//           let totalStars = 0;
//           if (member.ratings?.length > 0) {
//             totalStars = member.ratings.reduce((acc, rating) => acc + parseFloat(rating.average), 0);
//             member.totalAverage = totalStars / member.ratings.length;
//           } else {
//             member.totalAverage = 0;
//           }

//           const imageResponse = await fetch(`${API_BASE_URL}/profile-image?userId=${member.UserId}`);
//           if (imageResponse.ok) {
//             const imageData = await imageResponse.json();
//             member.profileImage = `${imageData.imageUrl}?t=${new Date().getTime()}`;
//           } else {
//             member.profileImage = null;
//           }

//           return member;
//         }));

//         setMembers(updatedMembers);
//       } catch (error) {
//         console.error('Error fetching members:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMembers();
//   }, [chapterType, locationId, userId]);

//   const filteredMembers = members.filter((member) =>
//     member.Username.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // Handle selecting a member and setting their MeetId
//   const handleMemberClick = (member) => {
//     const meetId = member.UserId; // Using the member's UserId as MeetId
//     setSelectedMeetId(meetId);
 
//     console.log('Selected MeetId:', meetId);
//     // You can also navigate to a new screen or show details here
//   };

//   // Insert meeting data
//   const insertMeetingData = async (userId, meetId, chapterType, locationId, photoUri) => {
//     try {
//       const formData = new FormData();
//       formData.append('image', {
//         uri: photoUri,
//         type: 'image/jpeg',
//         name: `${userId}_${new Date().toISOString().replace(/[-:.]#/g, '').slice(0, 12)}.jpeg`,
//       });
//       // formData.append('UserId', userId);
//       formData.append('MeetId', meetId); 
//       formData.append('SlotID', chapterType);  
//       formData.append('LocationID', locationId);

//       console.log('==================fromdat===============', formData);
//       const uploadResponse = await fetch(`${API_BASE_URL}/upload-member-details?userId=${userId}`, {
//         method: 'POST',
//         body: formData,
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
  
//       const result = await uploadResponse.json();
//       // console.log("Data in the frontend:", result);

//       if (result.message === 'Member details and image uploaded successfully!') {
//         Alert.alert('Success', 'Photo and data uploaded successfully');
//         console.log('Data Inserted:', result);
//         // Handle successful upload here (e.g., update UI or navigate)
//       } else {
//         Alert.alert('Error', 'Photo and data upload failed');
//       }
//     } catch (error) {
//       console.error('Error during upload:', error);
//       Alert.alert('Error', 'Something went wrong while uploading data');
//     }
//   };

//   // Open camera to take a photo
//   const openCamera = () => {
//     const options = { mediaType: 'photo', cameraType: 'front' };
//     launchCamera(options, async (response) => {
//       if (response.didCancel || response.errorCode) return;
//       const photoUri = response.assets[0].uri; // Get the URI of the taken photo
//       if (selectedMeetId) {
//         await insertMeetingData(userId, selectedMeetId, chapterType, locationId, photoUri);
//       } else {
//         Alert.alert('Error', 'Please select a member first.');
//       }
//     });
//   };

//   const renderItem = ({ item }) => (
//   <View>
//     <TouchableOpacity style={styles.memberItem} onPress={() => handleMemberClick(item)}>
//       <View style={styles.memberDetails}>
//         <Image source={{ uri: item.profileImage }} style={styles.profileImage} />
//         <View style={styles.memberText}>
//           <Text style={styles.memberName}>{item.Username}</Text>
//           <Text style={styles.memberRole}>{item.Profession}</Text>
//         </View>
//       </View>
//       <View style={styles.alarmContainer}>
//         <TouchableOpacity onPress={openCamera}>
//           <Icon name="camera" size={24} color="#A3238F" />
//         </TouchableOpacity>
//       </View>
//     </TouchableOpacity>
//   </View>
  
    

//   );

//   return (
//     <View style={{ flex: 1 }}>
//       {/* Search Bar */}
//       <View style={styles.searchContainer}>
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search members..."
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//           placeholderTextColor="black"
//           color="#A3238F"
//         />
//         <View style={styles.searchIconContainer}>
//           <Icon name="search" size={23} color="#A3238F" />
//         </View>
//       </View>
  
//       {/* FlatList - Scrollable List of Members */}
//       <ScrollView style={{ flex: 1 }}>
//         <FlatList
//           data={filteredMembers}
//           keyExtractor={(item) => item.UserId.toString()}
//           contentContainerStyle={styles.memberList}
//           renderItem={renderItem}
//         />
//       </ScrollView>
//     </View>
//   );
  
// };
// // Main TabView Example Component
// export default function TabViewExample({ navigation }) {
//   const layout = useWindowDimensions();
//   const [index, setIndex] = useState(0);
//   const [routes, setRoutes] = useState([]);
//   const userId = useSelector((state) => state.user?.userId);
//   const [businessInfo, setBusinessInfo] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchBusinessInfo = async () => {
//       try {
//         const response = await fetch(`${API_BASE_URL}/api/user/business-infodrawer/${userId}`);
//         const data = await response.json();

//         if (response.ok) {
//           const updatedRoutes = data.map((business, index) => ({
//             key: `business${index + 1}`,
//             title: business.BD,
//             chapterType: business.CT,
//             locationId: business.L,
//           }));
//           setRoutes(updatedRoutes);
//           setBusinessInfo(data);
//         } else {
//           console.error('Error fetching business info:', data.message);
//         }
//       } catch (error) {
//         console.error('API call error:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBusinessInfo();
//   }, [userId]);

//   const renderScene = ({ route }) => {
//     const business = businessInfo.find((b) => b.BD === route.title);
//     return (
//       <TabContent
//         chapterType={business?.CT}
//         locationId={business?.L}
//         userId={userId}
//         navigation={navigation}
//       />
//     );
//   };

//   const renderTabBar = (props) => (
//     <TabBar
//       {...props}
//       indicatorStyle={{ backgroundColor: '#A3238F' }}
//       style={{ backgroundColor: '#F3ECF3' }}
//       activeColor="#A3238F"
//       inactiveColor="gray"
//       labelStyle={{ fontSize: 14 }}
//     />
//   );

//   if (loading) {
//     return <ActivityIndicator size="large" color="#0000ff" />;
//   }

//   return (
//     <TabView
//       navigationState={{ index, routes }}
//       renderScene={renderScene}
//       onIndexChange={setIndex}
//       initialLayout={{ width: layout.width }}
//       renderTabBar={renderTabBar}
//     />
//   );
// }
































// import React, { useState } from 'react';
// import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
// import { API_BASE_URL } from '../constants/Config';
// const InsertMeetingScreen = () => {
//   // Default values for the fields
//   const [userId, setUserId] = useState('123'); // Default value for UserId
//   const [meetId, setMeetId] = useState('456'); // Default value for MeetId
//   const [slotId, setSlotId] = useState('789'); // Default value for SlotID
//   const [locationId, setLocationId] = useState('101112'); // Default value for LocationID
//   const [imgPath, setImgPath] = useState('defaultImagePath.jpg'); // Default value for Img_Path

//   const handleSubmit = async () => {
//     // Basic validation: Check if all fields are filled
//     if (!userId || !meetId || !slotId || !locationId || !imgPath) {
//       Alert.alert('Validation Error', 'All fields are required');
//       return;
//     }

//     // Prepare the data to send to the server
//     const data = {
//       UserId: userId,
//       MeetId: meetId,
//       SlotID: slotId,
//       LocationID: locationId,
//       Img_Path: imgPath,
//     };

//     try {
//       // Send data to the server
//    const membersResponse = await fetch(`${API_BASE_URL}/insert-meeting`,{
      
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         Alert.alert('Success', 'Meeting inserted successfully');
//       } else {
//         Alert.alert('Error', result.error || 'Failed to insert meeting');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       Alert.alert('Error', 'Something went wrong while submitting');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Insert Meeting</Text>
//       <TextInput
//         style={styles.input}
//         value={userId}
//         onChangeText={setUserId}
//         placeholder="UserId"
//       />
//       <TextInput
//         style={styles.input}
//         value={meetId}
//         onChangeText={setMeetId}
//         placeholder="MeetId"
//       />
//       <TextInput
//         style={styles.input}
//         value={slotId}
//         onChangeText={setSlotId}
//         placeholder="SlotID"
//       />
//       <TextInput
//         style={styles.input}
//         value={locationId}
//         onChangeText={setLocationId}
//         placeholder="LocationID"
//       />
//       <TextInput
//         style={styles.input}
//         value={imgPath}
//         onChangeText={setImgPath}
//         placeholder="Image Path"
//       />
//       <Button title="Submit" onPress={handleSubmit} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 16,
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 10,
//     paddingLeft: 8,
//     fontSize: 16,
//   },
// });

// export default InsertMeetingScreen;






  // Insert meeting data after photo upload
  // const insertMeetingData = async (userId) => {
  //   try {
  //     const response = await fetch(`${API_BASE_URL}/insert-member-details`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         userId,
  //       }),
  //     });
  //     const result = await response.json();
  //     console.log('--------------------------------insetdata-----------', result);
  //     if (result.message === 'Data inserted successfully') {
  //       Alert.alert('Success', 'Meeting data inserted successfully');
  //     } else {
  //       // Alert.alert('Error', 'Failed to insert data');
  //     }
  //   } catch (error) {
  //     console.error('Error inserting meeting data:', error);
  //     Alert.alert('Error', 'Something went wrong while inserting data');
  //   }
  // };

  // Insert meeting data after photo upload





  // Open Camera to take photo
  // const openCamera = () => {
  //   const options = { mediaType: 'photo', cameraType: 'front' };
  //   launchCamera(options, async (response) => {
  //     if (response.didCancel || response.errorCode) return;

  //     const photoUri = response.assets[0].uri;
  //     const fileName = `${userId}_${locationId}.jpeg`;

  //     try {
  //       setUploading(true);
  //       setUploadMessage('Uploading photo...');
  //       const formData = new FormData();
  //       formData.append('image', {
  //         uri: photoUri,
  //         type: 'image/jpeg',
  //         name: fileName,
  //       });

  //       const uploadResponse = await fetch(`${API_BASE_URL}/upload-meeting-photo?userId=${userId}&locationId=${locationId}`, {
  //         method: 'POST',
  //         body: formData,
  //         headers: { 'Content-Type': 'multipart/form-data' },
  //       });

  //       const result = await uploadResponse.json();
  //       if (result.success) {
  //         Alert.alert('Success', 'Photo uploaded successfully');
  //         // After photo upload, call insertMeetingData to store data in the database
  //         const photoUrl = result.imageUrl;  // Assuming imageUrl is returned in the response
  //         await insertMeetingData(result.MeetId, result.SlotID, photoUrl);  // Pass the imageUrl to insert into the database
  //       } else {
  //         Alert.alert('Error', 'Photo upload failed');
  //       }
  //     } catch (error) {
  //       Alert.alert('Error', 'Something went wrong during the upload');
  //     } finally {
  //       setUploading(false);
  //       setUploadMessage('');
  //     }
  //   });
  // };






































// import React, { useEffect, useState } from 'react';
// import { View, TextInput, FlatList, ActivityIndicator, Text, TouchableOpacity, Image, Alert, useWindowDimensions } from 'react-native';
// import { API_BASE_URL } from '../constants/Config';
// import { TabView, TabBar } from 'react-native-tab-view';
// import { useSelector } from 'react-redux';
// import { launchCamera } from 'react-native-image-picker';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import styles from '../components/layout/MembersStyle';

// // TabContent Component - Displays list of members, photo upload functionality
// const TabContent = ({ chapterType, locationId, navigation }) => {
//   const userId = useSelector((state) => state.user?.userId);
//   console.log('---------------data userid', userId);

//   const [members, setMembers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [uploading, setUploading] = useState(false);
//   const [uploadMessage, setUploadMessage] = useState('');

//   // Fetching members data
//   useEffect(() => {
//     const fetchMembers = async () => {
//       try {
//         console.log('Fetching members...');
//         const response = await fetch(`${API_BASE_URL}/list-members`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ LocationID: locationId, chapterType, userId }),
//         });

//         if (!response.ok) throw new Error('Failed to fetch members');

//         const data = await response.json();
//         console.log('----------------------------------member data=------------------', data);
//         const updatedMembers = await Promise.all(data.members.map(async (member) => {
//           let totalStars = 0;
//           if (member.ratings?.length > 0) {
//             totalStars = member.ratings.reduce((acc, rating) => acc + parseFloat(rating.average), 0);
//             member.totalAverage = totalStars / member.ratings.length;
//           } else {
//             member.totalAverage = 0;
//           }

//           const imageResponse = await fetch(`${API_BASE_URL}/profile-image?userId=${member.UserId}`);
//           if (imageResponse.ok) {
//             const imageData = await imageResponse.json();
//             member.profileImage = `${imageData.imageUrl}?t=${new Date().getTime()}`;
//           } else {
//             member.profileImage = null;
//           }

//           return member;
//         }));

//         setMembers(updatedMembers);
//       } catch (error) {
//         console.error('Error fetching members:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMembers();
//   }, [chapterType, locationId, userId]);

//   const filteredMembers = members.filter((member) =>
//     member.Username.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // Insert meeting data after photo upload
//   const insertMeetingData = async (MeetId, SlotID, photoUrl) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/insert-meeting`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           UserId: userId,
//           MeetId: MeetId,
//           SlotID: SlotID,
//           LocationID: locationId,
//           PhotoUrl: photoUrl,  // Store the URL of the uploaded photo in the database
//         }),
//       });
//       const result = await response.json();
//       console.log('--------------------------------insetdata-----------', result);
//       if (result.message === 'Data inserted successfully') {
//         Alert.alert('Success', 'Meeting data inserted successfully');
//       } else {
//         // Alert.alert('Error', 'Failed to insert data');
//       }
//     } catch (error) {
//       console.error('Error inserting meeting data:', error);
//       Alert.alert('Error', 'Something went wrong while inserting data');
//     }
//   };

//   // Open Camera to take photo
//   const openCamera = () => {
//     const options = { mediaType: 'photo', cameraType: 'front' };
//     launchCamera(options, async (response) => {
//       if (response.didCancel || response.errorCode) return;

//       const photoUri = response.assets[0].uri;
//       const fileName = `${userId}_${locationId}.jpeg`;

//       try {
//         setUploading(true);
//         setUploadMessage('Uploading photo...');
//         const formData = new FormData();
//         formData.append('image', {
//           uri: photoUri,
//           type: 'image/jpeg',
//           name: fileName,
//         });

//         const uploadResponse = await fetch(`${API_BASE_URL}/upload-meeting-photo?userId=${userId}&locationId=${locationId}`, {
//           method: 'POST',
//           body: formData,
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });

//         const result = await uploadResponse.json();
//         if (result.success) {
//           Alert.alert('Success', 'Photo uploaded successfully');
//           // After photo upload, call insertMeetingData to store data in the database
//           const photoUrl = result.imageUrl;  // Assuming imageUrl is returned in the response
//           await insertMeetingData(result.MeetId, result.SlotID, photoUrl);  // Pass the imageUrl to insert into the database
//         } else {
//           Alert.alert('Error', 'Photo upload failed');
//         }
//       } catch (error) {
//         Alert.alert('Error', 'Something went wrong during the upload');
//       } finally {
//         setUploading(false);
//         setUploadMessage('');
//       }
//     });
//   };

//   return (
//     <View>
//       <View style={styles.searchContainer}>
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search members..."
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//           placeholderTextColor="black"
//           color="#A3238F"
//         />
//         <View style={styles.searchIconContainer}>
//           <Icon name="search" size={23} color="#A3238F" />
//         </View>
//       </View>

//       {/* Upload Status Message */}
//       {uploading && (
//         <View style={styles.uploadingContainer}>
//           <Text style={styles.uploadingText}>{uploadMessage}</Text>
//         </View>
//       )}

//       <FlatList
//         data={filteredMembers}
//         keyExtractor={(item) => item.UserId.toString()}
//         contentContainerStyle={styles.memberList}
//         renderItem={({ item }) => (
//           <TouchableOpacity style={styles.memberItem}>
//             <View style={styles.memberDetails}>
//               <Image source={{ uri: item.profileImage }} style={styles.profileImage} />
//               <View style={styles.memberText}>
//                 <Text style={styles.memberName}>{item.Username}</Text>
//                 <Text style={styles.memberRole}>{item.Profession}</Text>
//               </View>
//             </View>
//             <View style={styles.alarmContainer}>
//               <TouchableOpacity onPress={openCamera}>
//                 <Icon name="camera" size={24} color="#A3238F" />
//               </TouchableOpacity>
//             </View>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// };
// // Main TabView Example Component
// export default function TabViewExample({ navigation }) {
//   const layout = useWindowDimensions();
//   const [index, setIndex] = useState(0);
//   const [routes, setRoutes] = useState([]);
//   const userId = useSelector((state) => state.user?.userId);
//   const [businessInfo, setBusinessInfo] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchBusinessInfo = async () => {
//       try {
//         const response = await fetch(`${API_BASE_URL}/api/user/business-infodrawer/${userId}`);
//         const data = await response.json();

//         if (response.ok) {
//           const updatedRoutes = data.map((business, index) => ({
//             key: `business${index + 1}`,
//             title: business.BD,
//             chapterType: business.CT,
//             locationId: business.L,
//           }));
//           setRoutes(updatedRoutes);
//           setBusinessInfo(data);
//         } else {
//           console.error('Error fetching business info:', data.message);
//         }
//       } catch (error) {
//         console.error('API call error:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBusinessInfo();
//   }, [userId]);

//   const renderScene = ({ route }) => {
//     const business = businessInfo.find((b) => b.BD === route.title);
//     return (
//       <TabContent
//         chapterType={business?.CT}
//         locationId={business?.L}
//         userId={userId}
//         navigation={navigation}
//       />
//     );
//   };

//   const renderTabBar = (props) => (
//     <TabBar
//       {...props}
//       indicatorStyle={{ backgroundColor: '#A3238F' }}
//       style={{ backgroundColor: '#F3ECF3' }}
//       activeColor="#A3238F"
//       inactiveColor="gray"
//       labelStyle={{ fontSize: 14 }}
//     />
//   );

//   if (loading) {
//     return <ActivityIndicator size="large" color="#0000ff" />;
//   }

//   return (
//     <TabView
//       navigationState={{ index, routes }}
//       renderScene={renderScene}
//       onIndexChange={setIndex}
//       initialLayout={{ width: layout.width }}
//       renderTabBar={renderTabBar}
//     />
//   );
// }
