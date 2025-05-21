
import React, { useState,useRef,useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Modal,Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { API_BASE_URL } from '../constants/Config';
import { green } from 'react-native-reanimated/lib/typescript/Colors';

const { width } = Dimensions.get('window');

const HeadAdminProfession = () => {
  const [professionName, setProfessionName] = useState('');
  const [professions, setProfessions] = useState([]);
  const [filteredProfessions, setFilteredProfessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [professionIdToDeactivate, setProfessionIdToDeactivate] = useState(null);
  const animatedOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    fetchProfessions();
  }, []);

  useEffect(() => {
    const results = professions.filter((item) =>
      item.ProfessionName.toLowerCase().startsWith(searchQuery.toLowerCase())
    );
    setFilteredProfessions(results);
  }, [searchQuery, professions]);

  const fetchProfessions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/ProfessionName`);
      if (!response.ok) {
        throw new Error('Failed to fetch professions');
      }
      const data = await response.json();
      const sortedData = data.sort((a, b) => a.ProfessionName.localeCompare(b.ProfessionName));
      setProfessions(sortedData);
      setFilteredProfessions(sortedData);
    } catch (err) {
      setError('Failed to fetch professions');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProfession = async () => {
    if (!professionName.trim()) {
      setModalMessage('Profession name is required');

      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/ProfessionName`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ProfessionName: professionName }),
      });

      if (!response.ok) {
        throw new Error('Failed to add profession');
      }

      const data = await response.json();
  
      setProfessionName('');
      fetchProfessions();
    } catch (err) {
      setModalMessage(err.message);
      setModalVisible(true);
    }
  };

  const handleUpdateProfession = async () => {
    if (!professionIdToDeactivate) return;

    try {
      const response = await fetch(`${API_BASE_URL}/ProfessionName/${professionIdToDeactivate}`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('Failed to deactivate profession');
      }
      setModalVisible(true);
      fetchProfessions();
      setModalVisible(false);
    } catch (err) {
      setModalMessage(err.message);
      setModalVisible(true);
    }
  };

  const confirmDeactivation = (id) => {
    setModalMessage('Are you sure you want to deactivate this profession?');
    setModalVisible(true);
    setProfessionIdToDeactivate(id);
  };

  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <MaterialIcons name="business-center" size={25} color="#2e3192" style={styles.icon} />
      <Text style={styles.listText}>{item.ProfessionName}</Text>
      <TouchableOpacity
        style={styles.deleteIcon}
        onPress={() => confirmDeactivation(item.Id)}
      >
        <MaterialIcons name="delete-outline" size={25} color="#2e3192" />
      </TouchableOpacity>
    </View>
  );
  useEffect(() => {
    Animated.timing(animatedOpacity, {
      toValue: professionName.trim() ? 1 : 0.5, 
      duration: 400, 
      useNativeDriver: true, 
    }).start();
  }, [professionName]);
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#2e3192" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search professions"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add profession name"
          placeholderTextColor="#888"
          value={professionName}
          onChangeText={setProfessionName}
        />
            <Animated.View style={{ opacity: animatedOpacity }}>
        <TouchableOpacity
          style={{
            padding: 5,
            backgroundColor: professionName.trim() ? '#2e3192' : '#CCCCCC',
            borderRadius: 5,
          }}
          onPress={handleAddProfession}
          disabled={!professionName.trim()}
        >
          <Icon name="plus-square" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2e3192" style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <>
          <FlatList
            data={filteredProfessions}
            renderItem={renderItem}
            keyExtractor={(item) => item.Id.toString()}
            contentContainerStyle={styles.listContainer}
          />

          {/* Count Container */}
          <View style={styles.countContainer}>
            <Text style={styles.countText}>Count: {filteredProfessions.length}</Text>
          </View>
        </>
      )}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={handleUpdateProfession}>
                <Text style={styles.closeButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CCC',
    padding: 10,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  searchIcon: {
    marginLeft: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 5,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingVertical: 8,
  },
  addButton: {
    marginLeft: 10,
    alignItems: 'center',
    padding: 5,
    borderRadius: 5,
  },
addButtonDisabled: {
  
   borderRadius:20,
},

  listContainer: {
    paddingBottom: 20,
  },
  listItem: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 10,
    marginVertical: 8,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listText: {
    fontSize: 16,
    color: '#2e3192',
    fontWeight: 'bold',
    flex: 1,
  },
  icon: {
    paddingRight: 10,
  },
  deleteIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  countContainer: {
    position: 'absolute',
    bottom: 40,
    left: width * 0.75,
    backgroundColor: 'rgba(250, 250, 250, 0.8)',
    padding: 10,
    borderRadius: 19,
    borderColor: '#2e3192',
    borderWidth: 2,
  },
  countText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2e3192',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,

  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent:'space-between',
  },
  closeButton: {
    backgroundColor: '#2e3192',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    width:"22%",
  
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign:'center',
  },
});

export default HeadAdminProfession;
