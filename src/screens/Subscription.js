import React, { useState } from 'react';
import {View,Text,TextInput,StyleSheet,TouchableOpacity,ScrollView,Alert,Modal,Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Subscription = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [conPassword, setConPassword] = useState('');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [selectedNav, setSelectedNav] = useState('home'); // Track selected nav item

  const handleSignup = () => {
    if (!username || !password || !conPassword) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    if (password !== conPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    Alert.alert('Success', 'You have signed up successfully.');
    setUsername('');
    setPassword('');
    setConPassword('');
  };

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const showLogoutModal = () => setLogoutModalVisible(true);
  const hideLogoutModal = () => setLogoutModalVisible(false);

  const handleLogout = () => {
    // Implement your logout logic here
    // Alert.alert('Logged Out', 'You have been logged out.');
    hideLogoutModal();
  };

  const handleNavPress = (navItem) => {
    setSelectedNav(navItem);
  };

  return (
    <View style={styles.container}>
      <Sidebar visible={sidebarVisible} onClose={toggleSidebar} onLogout={showLogoutModal} />

      <View style={styles.topNav}>
        <TouchableOpacity onPress={toggleSidebar}>
          <Icon name="navicon" style={styles.topNavi} size={25} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonNavtop}>
          <View style={styles.topNavlogo}>
            <MaterialIcons name="person-add-alt" size={28} color="#FFFFFF" />
          </View>
          <Text style={styles.NavbuttonText}>SUBSTITUTE LOGIN</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.content}>
          <Text style={styles.Blabel}>Create Substitute</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter your username"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>New Password</Text>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholder="Enter new password"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              secureTextEntry
              value={conPassword}
              onChangeText={setConPassword}
              placeholder="Confirm your password"
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Generate</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomNav}>
          <BottomNavItem
            icon="home"
            text="Home"
            isActive={selectedNav === 'home'}
            onPress={() => handleNavPress('home')}
          />
          <BottomNavItem
            icon="qr-code-scanner"
            text="Scanner"
            isActive={selectedNav === 'scanner'}
            onPress={() => handleNavPress('scanner')}
          />
          <BottomNavItem
            icon="local-see"
            text="Camera"
            isActive={selectedNav === 'camera'}
            onPress={() => handleNavPress('camera')}
          />
          <BottomNavItem
            icon="group"
            text="Members"
            isActive={selectedNav === 'members'}
            onPress={() => handleNavPress('members')}
          />
        </View>
      </ScrollView>

      <Modal
        transparent={true}
        animationType='fade'
        visible={logoutModalVisible}
        onRequestClose={hideLogoutModal}
      >
        <Pressable style={styles.modalOverlay} onPress={hideLogoutModal}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Logout</Text>
            <Text style={styles.modalMessage}>Are you sure you want to logout?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleLogout}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={hideLogoutModal}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const Sidebar = ({ visible, onClose, onLogout }) => (
  <Modal
    transparent={true}
    animationType='fade'
    visible={visible}
    onRequestClose={onClose}
  >
    <Pressable style={styles.sidebarOverlay} onPress={onClose}>
      <View style={styles.sidebarContainer1}>
        <TouchableOpacity style={styles.sidebarItemstyle} onPress={onClose}>
          <MaterialIcons name="person-add-alt-1" size={45} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.sidebarItemText1}>YOUR NAME</Text>
      </View>
      <View style={styles.sidebarContainer}>
        <TouchableOpacity style={styles.sidebarItem} onPress={onClose}>
          <MaterialIcons name="account-circle" size={20} color="#A3238F" />
          <Text style={styles.sidebarItemText}>VIEW PROFILE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sidebarItem} onPress={onLogout}>
          <MaterialIcons name="logout" size={20} color="#A3238F" />
          <Text style={styles.sidebarItemText}>LOGOUT</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sidebarItem} onPress={onClose}>
          <MaterialIcons name="arrow-back" size={20} color="#A3238F" />
          <Text style={styles.sidebarItemText}>BACK</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  </Modal>
);

const BottomNavItem = ({ icon, text, isActive, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.bottomNavicon}>
      <MaterialIcons name={icon} size={30} color={isActive ? '#A3238F' : 'black'} />
      <Text style={[styles.bottomNavtext, { color: isActive ? '#A3238F' : 'black' }]}>{text}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#CCC',
    flex: 1,
  },
  topNavi: {
    padding: 10,
  },
  topNav: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomEndRadius: 15,
    borderBottomStartRadius: 15,
  },
  buttonNavtop: {
    borderRadius: 25,
    alignItems: 'center',
    marginLeft: 30,
    borderColor: '#A3238F',
    borderWidth: 2,
    flexDirection: 'row',
  },
  topNavlogo: {
    backgroundColor: '#A3238F',
    padding: 4,
    paddingRight: 5,
    paddingLeft: 5,
    borderRadius: 50,
  },
  NavbuttonText: {
    color: '#A3238F',
    fontSize: 15,
    fontWeight: 'bold',
    margin: 7,
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    padding: 40,
    paddingTop: 25,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 30,
    marginVertical: 80,
    borderRadius: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  Blabel: {
    fontSize: 25,
    color: '#A3238F',
    fontWeight: 'bold',
    paddingBottom: 30,
  },
  label: {
    fontSize: 17,
    marginBottom: 5,
    color: '#A3238F',
  },
  input: {
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderColor: 'black',
    borderWidth: 1,
    fontSize: 15,
  },
  passwordInput: {
    flex: 1,
  },
  button: {
    backgroundColor: '#A3238F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 33,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    padding: 5,
    borderTopStartRadius: 15,
    borderTopEndRadius: 15,
    marginTop: 14,
  },
  bottomNavicon: {
    alignItems: 'center',
  },
  bottomNavtext: {
    fontWeight: 'bold',
    fontSize: 13,
  },
  sidebarOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  sidebarContainer1: {
    backgroundColor: '#D8BFD8',
    width: 240,
    borderTopRightRadius: 20,
    height: '35%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sidebarItemstyle: {
    backgroundColor: '#A3238F',
    alignItems: 'center',
    borderRadius: 50,
    padding: 16,
    marginBottom: 4,
    marginTop: 50,
  },
  sidebarContainer: {
    backgroundColor: '#FFFFFF',
    width: 240,
    borderBottomRightRadius: 20,
    height: '65%',
    flexDirection: 'column',
    paddingTop: 35,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  sidebarItemText1: {
    fontSize: 14,
    color: '#A3238F',
    textAlign: 'center',
    paddingTop: 10,
    fontWeight: 'bold',
  },
  sidebarItemText: {
    fontSize: 14,
    paddingLeft: 10,
    color: '#A3238F',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#A3238F',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Subscription;