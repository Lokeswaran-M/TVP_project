import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const StopWatch = ({ route, navigation }) => {
    const { member } = route.params;
    const [seconds, setSeconds] = useState(6);
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [intervalId, setIntervalId] = useState(null);
    const [isTimeoutModalVisible, setIsTimeoutModalVisible] = useState(false);
    const [isStarReviewModalVisible, setIsStarReviewModalVisible] = useState(false);
    const [rating, setRating] = useState(0);
    useEffect(() => {
        if (isRunning && !isPaused) {
            const id = setInterval(() => {
                setSeconds(prev => {
                    if (prev <= 0) {
                        clearInterval(id);
                        setIsRunning(false);
                        setIsTimeoutModalVisible(true);
                        return 6;
                    }
                    return prev - 1;
                });
            }, 1000);
            setIntervalId(id);
            return () => clearInterval(id);
        }
    }, [isRunning, isPaused]);
    const handleStart = () => {
        if (!isRunning) {
            setIsRunning(true);
            setIsPaused(false);
        }
    };
    const handleStop = () => {
        setIsRunning(false);
        setIsPaused(false);
        clearInterval(intervalId);
    };
    const handleRestart = () => {
        setSeconds(6);
        setIsRunning(false);
        setIsPaused(false);
        clearInterval(intervalId);
    };
    const formatTime = secs => {
        const minutes = Math.floor(secs / 60);
        const seconds = secs % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };
    return (
        <View style={styles.container}>
            <View style={styles.memberDetailsContainer}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberRole}>{member.role}</Text>
            </View>
            <View style={styles.contentcontainer}>
                <Text style={styles.timer}>{formatTime(seconds)}</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={handleStart} style={styles.button}>
                        <Icon name='play' size={20} color='#fff' />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleStop} style={styles.button}>
                        <Icon name='stop' size={20} color='#fff' />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleRestart} style={styles.button}>
                        <Icon name='refresh' size={20} color='#fff' />
                    </TouchableOpacity>
                </View>
            </View>
            <Modal
                visible={isTimeoutModalVisible}
                transparent={true}
                animationType='none'
                onRequestClose={() => setIsTimeoutModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <MaterialIcons name='alarm' size={88} color='#A3238F' />
                        <Text style={styles.modalText}>Time's up!!!</Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => {
                                setIsTimeoutModalVisible(false);
                                setIsStarReviewModalVisible(true);
                            }}
                        >
                            <Text style={styles.modalButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal
                visible={isStarReviewModalVisible}
                transparent={true}
                animationType='fade'
                onRequestClose={() => setIsStarReviewModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Review</Text>
                        <View style={styles.starContainer}>
                            {Array.from({ length: 5 }, (_, index) => (
                                <TouchableOpacity key={index} onPress={() => setRating(index + 1)}>
                                    <MaterialIcons
                                        name={index < rating ? 'star' : 'star-border'}
                                        size={40}
                                        color={index < rating ? '#FFD700' : '#A3238F'}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => {
                                setIsStarReviewModalVisible(false);
                            }}
                        >
                            <Text style={styles.modalButtonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#CCC',
        flex: 1,
    },
    contentcontainer: {
        padding: 30,
        backgroundColor: '#fff',
        marginHorizontal: 30,
        marginVertical: 100,
        borderRadius: 20,
        color: 'blue',
        alignItems:'center',
    },
    timer: {
        fontSize: 98,
        fontWeight: 'bold',
        color: 'black',
        marginHorizontal: 30,
        marginVertical: 15,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 55,
    },
    button: {
        backgroundColor: '#A3238F',
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 25,
        marginHorizontal: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fbeaf9',
        padding: 50,
        borderRadius: 10,
        alignItems: 'center',
        marginTop:40,
    },
    modalText: {
        fontSize: 40,
        marginBottom: 15,
        color: 'red',
        marginBottom:20,
    },
    modalButton: {
        backgroundColor: '#A3238F',
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 25,
        marginTop:40,
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    memberDetailsContainer: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginHorizontal: 30,
        marginVertical: 20,
        alignItems: 'center',
    },
    memberName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#A3238F',
    },
    memberRole: {
        fontSize: 18,
        color: '#555',
    },
    starContainer: {
        flexDirection: 'row',
        marginVertical: 15,
    },
});
export default StopWatch;