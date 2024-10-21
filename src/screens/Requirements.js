import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
const Requirements = () => {
    const userId = useSelector((state) => state.user?.userId);
    const navigation = useNavigation();
    console.log("User ID in Requirements field--------------------------", userId);
    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>Submit Your Need</Text>
                    <TouchableOpacity style={styles.memberButton}>
                        <Icon name="user-o" size={18} color="white" />
                        <Text style={styles.memberButtonText}>Choose Member</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your requirement here"
                        multiline={true}
                        numberOfLines={4}
                    />
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-left" size={20} color="#fff" style={styles.icon} />
                    <Text style={styles.buttonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitButton}>
                    <Icon name="check" size={20} color="#fff" style={styles.icon} />
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 10,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        margin: 0,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#a3238f',
    },
    memberButton: {
        backgroundColor: '#a3238f',
        borderRadius: 20,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    memberButtonText: {
        color: 'white',
        marginLeft: 8,
    },
    inputContainer: {
        borderWidth: 1,
        borderColor: '#a3238f',
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
    },
    input: {
        height: 100,
        fontSize: 16,
        color: 'black',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 20,
        marginHorizontal: 60,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#a3238f',
        padding: 14,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#a3238f',
        padding: 12,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        marginLeft: 5,
    },
    icon: {
        marginRight: 5,
    },
});
export default Requirements;