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