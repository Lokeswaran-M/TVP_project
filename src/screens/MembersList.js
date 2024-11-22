import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, useWindowDimensions, ActivityIndicator, Text, TouchableOpacity, Image } from 'react-native';
import { API_BASE_URL } from '../constants/Config';
import { useSelector } from 'react-redux';
import { TabView, TabBar } from 'react-native-tab-view';
import Stars from './Stars';
import styles from '../components/layout/MembersStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { useNavigation } from '@react-navigation/native';

const TabContent = ({ chapterType, locationId, userId }) => {
  const navigation = useNavigation();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const membersResponse = await fetch(`${API_BASE_URL}/list-members`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            LocationID: locationId,
            chapterType: chapterType,
            userId: userId,
          }),
        });

        if (!membersResponse.ok) {
          throw new Error('Failed to fetch members');
        }

        const data = await membersResponse.json();
        console.log("MEMBERS DATA IN MEMBERS LIST SCREEN---------------------------------",data, data.RollId);
        data.members.forEach(member => {
          console.log("MEMBER RollId:", member.RollId);
        });
        const updatedMembers = await Promise.all(data.members.map(async (member) => {
          let totalStars = 0;
          if (member.ratings && member.ratings.length > 0) {
            member.ratings.forEach(rating => {
              totalStars += parseFloat(rating.average) || 0;
            });
            const totalAverage = totalStars / member.ratings.length;
            member.totalAverage = totalAverage || 0;
          } else {
            member.totalAverage = 0;
          }
          const imageResponse = await fetch(`${API_BASE_URL}/profile-image?userId=${member.UserId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (imageResponse.ok) {
            const imageData = await imageResponse.json();
            const uniqueImageUrl = `${imageData.imageUrl}?t=${new Date().getTime()}`;
            member.profileImage = uniqueImageUrl;
          } else {
            console.error('Failed to fetch profile image:', member.UserId);
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

  const filteredMembers = members.filter(member =>
    member.Username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search members..."
          placeholderTextColor="black"
          value={searchQuery}
          onChangeText={setSearchQuery}
          color="#A3238F"
        />
        <View style={styles.searchIconContainer}>
          <Icon name="search" size={23} color="#A3238F" />
        </View>
      </View>
      <FlatList
  data={filteredMembers}
  keyExtractor={(item) => item.UserId.toString()}
  contentContainerStyle={styles.memberList}
  renderItem={({ item }) => (
    <TouchableOpacity
      style={styles.memberItem}
      onPress={() =>
        navigation.navigate('MemberDetails', {
          userId: item.UserId,
          Profession: item.Profession,
        })
      }
    >
     <View style={styles.memberDetails}>
  {item.RollId === 2 && (
    <View style={styles.crownContainer}>
      <FontAwesome6 name="crown" size={18} color="#FFD700" />
    </View>
  )}
  <Image
    source={{ uri: item.profileImage }}
    style={[
      styles.profileImage,
      item.RollId === 2 && styles.profileImageWithBorder,
    ]}
  />
  <View style={styles.memberText}>
    <Text style={styles.memberName}>{item.Username}</Text>
    <Text style={styles.memberRole}>{item.Profession}</Text>
  </View>
</View>
<View style={styles.ratingContainer}>
  <Stars averageRating={item.totalAverage} />
</View>
    </TouchableOpacity>
  )}
/>
      <View style={styles.memberCountContainer}>
        <Text style={styles.memberCountText}>
          Count: {members.length}
        </Text>
      </View>
    </View>
  );
};
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
        title={route.title}
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