import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../constants/Config';
const Members = () => {
  const user = useSelector((state) => state.user); 
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/list-members`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chapterNo: user?.chapterNo,
            chapterType: user?.chapterType,
          }),
        });
        
        const data = await response.json();
        if (data.members) {
          setMembers(data.members);
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    if (user?.chapterNo && user?.chapterType) {
      fetchMembers();
    }
  }, [user?.chapterNo, user?.chapterType]);

  return (
    <View>
      <Text>Members Page</Text>
      <Text>{user?.username}</Text>
      <Text>{user?.chapterType}</Text> 
      <Text>{user?.chapterNo}</Text>  

      <Text>Members in the same chapter:</Text>
      {members.length > 0 ? (
        members.map((member) => (
          <View key={member.UserId}>
            <Text>Username: {member.Username}</Text>
            {/* <Text>Email: {member.Email}</Text> */}
            <Text>Profession: {member.Profession}</Text>
          </View>
        ))
      ) : (
        <Text>No members found in this chapter.</Text>
      )}
    </View>
  );
};

export default Members;