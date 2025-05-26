import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Modal,
  Animated,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { API_BASE_URL } from '../constants/Config';

const { width } = Dimensions.get('window');
const PRIMARY_COLOR = '#2e3091';
const SECONDARY_COLOR = '#3d3fa3';
const LIGHT_PRIMARY = '#eaebf7';
const ACCENT_COLOR = '#ff6b6b';
const BACKGROUND_COLOR = '#f5f7ff';
const WHITE = '#ffffff';
const DARK_TEXT = '#333333';
const LIGHT_TEXT = '#6c7293';
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
  const [isConfirmationModal, setIsConfirmationModal] = useState(false);
  const animatedOpacity = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchProfessions();
  }, []);

  useEffect(() => {
    const results = professions.filter((item) =>
      item.ProfessionName.toLowerCase().startsWith(searchQuery.toLowerCase())
    );
    setFilteredProfessions(results);
  }, [searchQuery, professions]);

  useEffect(() => {
    Animated.timing(animatedOpacity, {
      toValue: professionName.trim() ? 1 : 0.6,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [professionName]);

  const fetchProfessions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/ProfessionName`);
      if (!response.ok) {
        throw new Error('Failed to fetch professions');
      }
      const data = await response.json();
      const sortedData = data.sort((a, b) => a.ProfessionName.localeCompare(b.ProfessionName));
      setProfessions(sortedData);
      setFilteredProfessions(sortedData);
      setError('');
    } catch (err) {
      setError('Unable to load professions. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const showSuccessMessage = (message) => {
    setModalMessage(message);
    setIsConfirmationModal(false);
    setModalVisible(true);
    setTimeout(() => {
      setModalVisible(false);
    }, 2000);
  };

  const handleAddProfession = async () => {
    if (!professionName.trim()) {
      setModalMessage('Please enter a profession name');
      setIsConfirmationModal(false);
      setModalVisible(true);
      return;
    }
    const isDuplicate = professions.some(
      prof => prof.ProfessionName.toLowerCase() === professionName.trim().toLowerCase()
    );

    if (isDuplicate) {
      setModalMessage('This profession already exists');
      setIsConfirmationModal(false);
      setModalVisible(true);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/ProfessionName`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ProfessionName: professionName.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to add profession');
      }

      setProfessionName('');
      await fetchProfessions();
      showSuccessMessage('Profession added successfully!');
    } catch (err) {
      setModalMessage('Failed to add profession. Please try again.');
      setIsConfirmationModal(false);
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

      await fetchProfessions();
      setModalVisible(false);
      showSuccessMessage('Profession deactivated successfully!');
    } catch (err) {
      setModalMessage('Failed to deactivate profession. Please try again.');
      setIsConfirmationModal(false);
      setModalVisible(true);
    } finally {
      setProfessionIdToDeactivate(null);
    }
  };

  const confirmDeactivation = (id, professionName) => {
    setModalMessage(`Are you sure you want to delete "${professionName}"?`);
    setIsConfirmationModal(true);
    setModalVisible(true);
    setProfessionIdToDeactivate(id);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setProfessionIdToDeactivate(null);
    setIsConfirmationModal(false);
  };

  const renderItem = ({ item, index }) => (
    <Animated.View
      style={[
        styles.listItem,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.professionInfo}>
        <MaterialIcons name="work" size={28} color="#2e3091" style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.listText}>{item.ProfessionName}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => confirmDeactivation(item.Id, item.ProfessionName)}
        activeOpacity={0.7}
      >
        <MaterialIcons name="delete" size={24} color="#FF4444" />
      </TouchableOpacity>
    </Animated.View>
  );
  useEffect(() => {
    if (!loading) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [loading]);

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="work-off" size={64} color="#CCCCCC" />
      <Text style={styles.emptyText}>No professions found</Text>
      <Text style={styles.emptySubtext}>
        {searchQuery ? 'Try adjusting your search' : 'Add your first profession above'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profession Management</Text>
        <Text style={styles.headerSubtitle}>Manage and organize professions</Text>
      </View>
      <View style={styles.searchContainer}>
        <Icon name="search" size={18} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search professions..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="words"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            style={styles.clearButton}
          >
            <Icon name="times-circle" size={18} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="add-business" size={24} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Enter profession name..."
          placeholderTextColor="#999"
          value={professionName}
          onChangeText={setProfessionName}
          autoCapitalize="words"
          returnKeyType="done"
          onSubmitEditing={handleAddProfession}
        />
        <Animated.View style={{ opacity: animatedOpacity }}>
          <TouchableOpacity
            style={[
              styles.addButton,
              {
                backgroundColor: professionName.trim() ? '#2e3091' : '#E0E0E0',
              },
            ]}
            onPress={handleAddProfession}
            disabled={!professionName.trim()}
            activeOpacity={0.8}
          >
            <Icon name="plus" size={18} color={professionName.trim() ? '#FFFFFF' : '#999'} />
          </TouchableOpacity>
        </Animated.View>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2e3091" />
          <Text style={styles.loadingText}>Loading professions...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color="#FF4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchProfessions}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={filteredProfessions}
            renderItem={renderItem}
            keyExtractor={(item) => item.Id.toString()}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={renderEmptyList}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{filteredProfessions.length}</Text>
              <Text style={styles.statLabel}>
                {searchQuery ? 'Found' : 'Total'}
              </Text>
            </View>
          </View>
        </>
      )}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <MaterialIcons
                name={isConfirmationModal ? "warning" : "info"}
                size={32}
                color={isConfirmationModal ? "#FF9800" : "#2e3091"}
              />
              <Text style={styles.modalTitle}>
                {isConfirmationModal ? "Confirm Action" : "Information"}
              </Text>
            </View>
            
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            
            <View style={styles.modalButtons}>
              {isConfirmationModal ? (
                <>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={handleModalClose}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.confirmButton]}
                    onPress={handleUpdateProfession}
                  >
                    <Text style={styles.confirmButtonText}>Confirm</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={[styles.modalButton, styles.okButton]}
                  onPress={handleModalClose}
                >
                  <Text style={styles.okButtonText}>OK</Text>
                </TouchableOpacity>
              )}
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
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6C757D',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
    paddingVertical: 12,
  },
  clearButton: {
    padding: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
    paddingVertical: 12,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  separator: {
    height: 8,
  },
  listItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  professionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  listText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  listSubtext: {
    fontSize: 12,
    color: '#6C757D',
  },
  deleteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6C757D',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 100,
  },
  errorText: {
    fontSize: 16,
    color: '#FF4444',
    textAlign: 'center',
    marginVertical: 16,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#2e3091',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6C757D',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ADB5BD',
    textAlign: 'center',
  },
  statsContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e3091',
  },
  statLabel: {
    fontSize: 12,
    color: '#6C757D',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginLeft: 12,
  },
  modalMessage: {
    fontSize: 16,
    color: '#495057',
    paddingHorizontal: 20,
    paddingBottom: 20,
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderRightWidth: 1,
    borderRightColor: '#E9ECEF',
  },
  confirmButton: {
    backgroundColor: '#FF4444',
  },
  okButton: {
    backgroundColor: '#2e3091',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6C757D',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  okButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default HeadAdminProfession;