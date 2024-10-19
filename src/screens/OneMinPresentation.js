import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '../components/layout/MembersStyle';
const MeetingScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [members, setMembers] = useState([
        { id: '1', name: 'Loki', role: 'CEO' },
        { id: '2', name: 'Ajay', role: 'CTO' },
        { id: '3', name: 'Alice', role: 'Marketing Manager' },
        { id: '4', name: 'Jeni', role: 'CEO' },
        { id: '5', name: 'Loki', role: 'CEO' },
        { id: '6', name: 'Loki', role: 'CEO' },
        { id: '7', name: 'Loki', role: 'CEO' },
        { id: '8', name: 'Loki', role: 'CEO' },
    ]);
    const filteredMembers = members.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const handleAlarmPress = (member) => {
        navigation.navigate('StopWatch', { member });
    };
    const renderMember = ({ item }) => (
        <View style={styles.memberItem}>
            <View style={styles.memberDetails}>
                <ProfilePic name={item.name} />
                <View style={styles.memberText}>
                    <Text style={styles.memberName}>{item.name}</Text>
                    <Text style={styles.memberRole}>{item.role}</Text>
                </View>
            </View>
            <View style={styles.alarmContainer}>
                <TouchableOpacity onPress={() => handleAlarmPress(item)}>
                    <MaterialIcons name="alarm" size={28} color="#A3238F" />
                </TouchableOpacity>
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
export default MeetingScreen;