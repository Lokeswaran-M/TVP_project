const PRIMARY_COLOR = '#2e3091';
const SECONDARY_COLOR = '#3d3fa3';
const LIGHT_PRIMARY = '#eaebf7';
const ACCENT_COLOR = '#ff6b6b';
const BACKGROUND_COLOR = '#f5f7ff';
const WHITE = '#ffffff';
const DARK_TEXT = '#333333';
const LIGHT_TEXT = '#6c7293';

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../constants/Config';
const CustomModal = ({ visible, title, message, onCancel, onConfirm, confirmText, cancelText }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <Text style={modalStyles.modalTitle}>{title}</Text>
          <Text style={modalStyles.modalText}>{message}</Text>
          <View style={modalStyles.buttonContainer}>
            {onCancel && (
              <TouchableOpacity style={modalStyles.cancelButton} onPress={onCancel}>
                <Text style={modalStyles.cancelButtonText}>{cancelText || "Cancel"}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={modalStyles.confirmButton} onPress={onConfirm}>
              <Text style={modalStyles.confirmButtonText}>{confirmText || "OK"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const Subscription = ({ route }) => {
  const { locationId, Profession } = route.params;
  const [businessCount, setBusinessCount] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isOffMonth, setIsOffMonth] = useState(false);
  const navigation = useNavigation();
  const userId = useSelector((state) => state.UserId);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  useEffect(() => {
    const fetchBusinessCount = async () => {
      try {
        const queryParams = new URLSearchParams({
          Profession,
          LocationID: locationId,
        }).toString();
        const response = await fetch(`${API_BASE_URL}/businessCount?${queryParams}`);
        const data = await response.json();
        console.log("Values for count------------------------",data);
        setBusinessCount(data.count);
      } catch (error) {
        console.error('Error fetching business count:', error);
        setErrorMessage('An error occurred while fetching business count.');
        showErrorModal('Error', 'An error occurred while fetching business count.');
      }
    };
    fetchBusinessCount();
  }, [locationId, Profession]);
  const showErrorModal = (title, message) => {
    setModalTitle(title);
    setModalMessage(message);
    setErrorModalVisible(true);
  };
  const showSuccessModal = (title, message) => {
    setModalTitle(title);
    setModalMessage(message);
    setSuccessModalVisible(true);
  };

  const handleDeleteBusiness = () => {
    setDeleteModalVisible(true);
  };

  const confirmDeleteBusiness = async () => {
    setDeleteModalVisible(false);
    try {
      const response = await fetch(`${API_BASE_URL}/updateBusinessStatus`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Profession,
          LocationID: locationId,
          UserId: userId,
        }),
      });
      const data = await response.json();
      console.log("Data in insert the business status------------------------",data);
      if (response.ok) {
        showSuccessModal("Success", "Business status updated successfully.");
      } else {
        showErrorModal("Error", data.error || "Failed to update business status.");
      }
    } catch (error) {
      console.error("Error updating business status:", error);
      showErrorModal("Error", "An unexpected error occurred.");
    }
  };

  const handleSuccessModalClose = () => {
    setSuccessModalVisible(false);
    navigation.navigate('UpdateBusiness', {
      locationId: locationId,
      Profession: Profession,
    });
  };

  const handlePayment = () => {
    try {
      const paymentAmount = isOffMonth ? 1500 : 3000;
      const paymentUrl = `https://www.smartzensolutions.com/Payments/dataFrom.php?amount=${paymentAmount}&userid=${userId}`;

      console.log('Payment URL:', paymentUrl);
      navigation.navigate('PaymentWebview', { paymentUrl });
    } catch (error) {
      console.error('Error during payment initiation:', error);
      showErrorModal('Payment Error', 'An error occurred during the payment initiation. Please try again.');
    }
  };
  
  const handleContinue = () => {
    navigation.navigate('Pay');
  };  
  if (businessCount > 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.alertText}>
          Another user has activated the business. 
        </Text>
        <TouchableOpacity style={styles.button1} onPress={handleDeleteBusiness}>
          <Text style={styles.buttonText}>Delete Business and Add Another</Text>
        </TouchableOpacity>
        <CustomModal
          visible={deleteModalVisible}
          title="Confirm Delete"
          message="Do you want to delete this business and add another?"
          onCancel={() => setDeleteModalVisible(false)}
          onConfirm={confirmDeleteBusiness}
          confirmText="Delete"
          cancelText="Cancel"
        />
        
        {/* Success Modal */}
        <CustomModal
          visible={successModalVisible}
          title={modalTitle}
          message={modalMessage}
          onConfirm={handleSuccessModalClose}
          confirmText="OK"
        />
        <CustomModal
          visible={errorModalVisible}
          title={modalTitle}
          message={modalMessage}
          onConfirm={() => setErrorModalVisible(false)}
          confirmText="OK"
        />
      </View>
    );
  }

  return ( 
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Annual Membership Subscription</Text>
      <View style={styles.topcon}>
        <Text style={styles.headertocon}>Annual Membership</Text>
        <Text style={styles.upeventtext}>Start Today!</Text>
        <Text style={styles.toppaymentText}>₹2999</Text>
        <Text style={styles.MonthText}>₹3499</Text>
        <Text style={styles.upeventtext}>Get this subscription  for valid member of the business masters of the world</Text>
      </View>

      <View style={styles.toggleContainer}>
        <Text style={styles.botpaymentText}>₹2999</Text>
        <Text style={styles.offbotpaymentText}>₹3499</Text>
        <Text style={styles.toggleLabel}>Amount To Pay</Text>

        <TouchableOpacity style={styles.button} onPress={handlePayment}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottumcon}>
        <Text style={styles.termsHeader}>Terms and Conditions</Text>
        <Text style={styles.termsText}>
        Fees and Duration :
        </Text>
        <Text style={styles.termsText1}>
        Members are required to pay an annual subscription/registration/entry fee to be listed as location members for one year.
          </Text>
          <Text style={styles.termsText}>
          Renewal Process :
          </Text>
          <Text style={styles.termsText1}>
          Renewals are crucial to maintain membership. reminders will be sent continuously every two days in the 15 days leading up to the renewal deadline (closing day of the membership).
          </Text>
          <Text style={styles.termsText}>
          Renewal Grace Period :
          </Text>
          <Text style={styles.termsText1}>
          A 15 - day grace period is offered after the renewal deadline for members to renew their membership.
          </Text>
          <Text style={styles.termsText}>
          Consequences of non-renewal :
          </Text>
          <Text style={styles.termsText}>
          After one year without renewal :
          </Text>
          <Text style={styles.termsText1}>
          1. Member's name is removed from the location member list.
      2.Access to the TPV portal login is revoked.
          </Text>
          <Text style={styles.termsText}>
          After the grace period (if the category is filled) :
          </Text>
          <Text style={styles.termsText1}>
          1. Former member cannot rejoin the same location.
      2.They can join another location if a category is available.
          </Text>
      </View>
      <CustomModal
        visible={errorModalVisible}
        title={modalTitle}
        message={modalMessage}
        onConfirm={() => setErrorModalVisible(false)}
        confirmText="OK"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    backgroundColor: '#EDEBED',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 40,
    textAlign: 'center',
    color: '#2e3192',
  },
  topcon: {
    backgroundColor: '#ffffff',
    padding: 40,
    marginBottom: 0,
    borderTopStartRadius: 15,
    borderTopEndRadius: 15,
  },
  headertocon: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    color: '#2e3192',
  },
  toppaymentText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#2e3192',
    textAlign: 'center',
    paddingBottom: 0,
  },
  MonthText: {
    fontSize: 16,
    color: '#2e3192',
    marginBottom: 30,
    textDecorationLine: 'line-through',
    marginTop: 0,
    paddingTop: 0,
    paddingLeft: 125,
    transform: [{ translateY: -5 }],
  },
  upeventtext: {
    fontSize: 12,
    marginBottom: 10,
    color: '#2e3192',
    backgroundColor: '#ffffff',
    textAlign: 'center',
    fontWeight: '400',
  },
  toggleContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#f9f3fb',
    padding: 20,
    paddingLeft: 10,
    paddingBottom: 20,
    paddingRight: 15,
    paddingTop: 20,
    borderRadius: 15,
    transform: [{ translateY: -13 }],
  },
  botpaymentText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e3192',
    paddingLeft: 10,
  },
  offbotpaymentText: {
    position: 'absolute',
    fontSize: 15,
    color: '#2e3192',
    transform: [{ translateX: 83 }],
    marginTop: 23,
    textDecorationLine: 'line-through',
  },
  toggleLabel: {
    fontSize: 16,
    color: '#2e3192',
    fontWeight: '500',
    paddingLeft: 10,
    transform: [{ translateY: 0 }],
  },
  alertText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  button1: {
    backgroundColor: '#2e3192',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    margin: 20,
  },
  button: {
    position: 'absolute',
    backgroundColor: '#2e3192',
    padding: 8,
    borderRadius: 15,
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginLeft: 195,
    transform: [{ translateY: 25 }],
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  bottumcon: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 15,
    paddingLeft: 20,
  },
  termsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e3192',
    textDecorationLine: 'underline',
  },
  termsText: {
    marginTop: 10,
    fontSize: 14,
    color: '#2e3192',
  },
  termsText1: {
    marginTop: 10,
    fontSize: 14,
    color: 'black',
  },
});

// Modal specific styles
const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: WHITE,
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: PRIMARY_COLOR,
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
    color: DARK_TEXT,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  confirmButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginRight: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: WHITE,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelButtonText: {
    color: DARK_TEXT,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Subscription;