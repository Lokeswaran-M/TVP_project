import React, { useEffect, useState } from 'react';
import { View, useWindowDimensions, ActivityIndicator, Text } from 'react-native';
import { API_BASE_URL } from '../constants/Config';
import { useSelector } from 'react-redux';
import { TabView, TabBar } from 'react-native-tab-view';
import styles from '../components/layout/MembersStyle';

const TabContent = ({ title, chapterType, locationId, userId }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/list-members`, {
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

        const data = await response.json();
        if (response.ok) {
          setMembers(data.members);
        } else {
          console.error('Error fetching members:', data.message);
        }
      } catch (error) {
        console.error('API call error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [chapterType, locationId, userId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={styles.memberText}>
      {members.length > 0 ? (
        members.map((member) => (
          <Text key={member.UserId}>
            <Text style={styles.memberName}>{member.Username}</Text>
            <Text style={styles.memberRole}>{member.Profession}</Text>
            </Text>
        ))
      ) : (
        <Text>No members found.</Text>
      )}
    </View>
    </View>
  );
};

export default function TabViewExample() {
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
  }, []);

  const renderScene = ({ route }) => {
    const business = businessInfo.find((b) => b.BD === route.title);
    return (
      <TabContent
        title={route.title}
        chapterType={business?.CT}
        locationId={business?.L}
        userId={userId}
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