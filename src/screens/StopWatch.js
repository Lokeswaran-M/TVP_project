import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Sound from 'react-native-sound';
import { API_BASE_URL } from '../constants/Config';

const StopWatch = ({ route, navigation }) => {
    const { member } = route.params;
    console.log('------------------------User Data------------------------', member);
    const [seconds, setSeconds] = useState(60);
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [intervalId, setIntervalId] = useState(null);
    const [isTimeoutModalVisible, setIsTimeoutModalVisible] = useState(false);
    const [isStarReviewModalVisible, setIsStarReviewModalVisible] = useState(false);
    const [rating, setRating] = useState(0);
    const [currentProfessionIndex, setCurrentProfessionIndex] = useState(0);
    const [currentProfession, setCurrentProfession] = useState(member.professions[0] || member.Profession);
    
    const alarmSound = useRef(null);

    useEffect(() => {
        Sound.setCategory('Playback');
        alarmSound.current = new Sound(require('../../assets/audio/audiosound.mp3'), Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.log('Failed to load the sound', error);
                return;
            }
            console.log('Sound loaded successfully');
        });

        return () => {
            if (alarmSound.current) {
                alarmSound.current.release();
            }
        };
    }, []);

    useEffect(() => {
        // Update current profession whenever the index changes
        setCurrentProfession(member.professions[currentProfessionIndex] || member.Profession);
    }, [currentProfessionIndex, member.professions, member.Profession]);

    const playAlarm = () => {
        if (alarmSound.current) {
            alarmSound.current.play((success) => {
                if (!success) {
                    console.log('Failed to play the sound');
                }
            });
        }
    };

    useEffect(() => {
        if (isRunning && !isPaused) {
            console.log("Timer started");
            const id = setInterval(() => {
                setSeconds(prev => {
                    if (prev <= 0) {
                        console.log("Time's up! Stopping the timer.");
                        clearInterval(id);
                        setIsRunning(false);
                        setIsTimeoutModalVisible(true);
                        playAlarm();
                        return 60;
                    }
                    console.log(`Seconds left: ${prev - 1}`);
                    return prev - 1;
                });
            }, 1000);
            setIntervalId(id);
            return () => {
                console.log("Timer cleared");
                clearInterval(id);
            };
        } else {
            console.log(`Timer paused or stopped. isRunning: ${isRunning}, isPaused: ${isPaused}`);
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
        setSeconds(60);
        setIsRunning(false);
        setIsPaused(false);
        clearInterval(intervalId);
    };

    const formatTime = secs => {
        const minutes = Math.floor(secs / 60);
        const seconds = secs % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleSubmitRating = async () => {
        if (rating === 0) {
            return;
        }
        await postRating(currentProfession);
        if (member.professions && member.professions.length > 1 && currentProfessionIndex < member.professions.length - 1) {
            setCurrentProfessionIndex(currentProfessionIndex + 1);
            setRating(0);
        } else {
            setIsStarReviewModalVisible(false);
            navigation.goBack();
        }
    };
    
    const postRating = async (profession) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/ratings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    UserId: member.UserId,
                    Stars: rating,
                    Profession: profession,
                    RatingId: 2,
                    LocationId: member.LocationId,
                })
            });
            console.log(`--------------------post data for ${profession}-------------------`, response);
            const result = await response.json();
            return response.ok;
        } catch (error) {
            console.error(`Error posting rating for ${profession}:`, error);
            return false;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.memberDetailsContainer}>
                <Text style={styles.memberName}>{member.Username}</Text>
                <Text style={styles.memberRole}>
                    {member.professions && member.professions.length > 0 
                        ? member.professions.join(' and ') 
                        : member.Profession}
                </Text>
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
                        <MaterialIcons name='alarm' size={88} color='#2e3192' />
                        <Text style={styles.modalText}>Time's up!!!</Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => {
                                setIsTimeoutModalVisible(false);
                                setIsStarReviewModalVisible(true);
                                if (alarmSound.current) alarmSound.current.stop();
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
                        <Text style={styles.professionText}>
                            {currentProfession}
                        </Text>
                        <View style={styles.starContainer}>
                            {Array.from({ length: 5 }, (_, index) => (
                                <TouchableOpacity key={index} onPress={() => setRating(index + 1)}>
                                    <MaterialIcons
                                        name={index < rating ? 'star' : 'star-border'}
                                        size={40}
                                        color={index < rating ? '#FFD700' : '#2e3192'}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={handleSubmitRating}
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
        backgroundColor: '#f5f7ff',
        flex: 1,
    },
    contentcontainer: {
        padding: 30,
        backgroundColor: '#fff',
        marginHorizontal: 30,
        marginVertical: 100,
        borderRadius: 20,
        alignItems:'center',
    },
    timer: {
        fontSize: 98,
        fontWeight: 'bold',
        color: 'black',
        marginVertical: 15,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 55,
        marginVertical: 15,
    },
    button: {
        backgroundColor: '#2e3192',
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
    professionText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2e3192',
        marginBottom: 10,
    },
    modalButton: {
        backgroundColor: '#2e3192',
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
        color: '#2e3192',
    },
    memberRole: {
        fontSize: 14,
        color: '#555',
    },
    starContainer: {
        flexDirection: 'row',
        marginVertical: 15,
    },
});
export default StopWatch;