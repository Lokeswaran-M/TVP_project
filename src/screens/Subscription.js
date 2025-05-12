import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../constants/Config';

const Subscription = ({ route }) => {
  const { chapterType, locationId, Profession } = route.params;
  const [businessCount, setBusinessCount] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isOffMonth, setIsOffMonth] = useState(false);
  const navigation = useNavigation();
  const userId = useSelector((state) => state.user?.userId);

  useEffect(() => {
    const fetchBusinessCount = async () => {
      try {
        const queryParams = new URLSearchParams({
          Profession,
          LocationID: locationId,
          ChapterType: chapterType,
        }).toString();
        const response = await fetch(`${API_BASE_URL}/businessCount?${queryParams}`);
        const data = await response.json();
        console.log("Values for count------------------------",data);
        setBusinessCount(data.count);
      } catch (error) {
        console.error('Error fetching business count:', error);
        setErrorMessage('An error occurred while fetching business count.');
      }
    };
    fetchBusinessCount();
  }, [chapterType, locationId, Profession]);

  // const handleDeleteBusiness = () => {
  //   Alert.alert(
  //     "Confirm Update",
  //     "Do you want to Update this business and add another?",
  //     [
  //       { text: "Cancel", style: "cancel" },
  //       {
  //         text: "Update",
  //         onPress: () => {
  //           // Navigate to the UpdateBusiness screen with the necessary params
  //           navigation.navigate('UpdateBusiness', {
  //             chapterType: chapterType,
  //             locationId: locationId,
  //             Profession: Profession,
  //           });
  //         },
  //       },
  //     ]
  //   );
  // };    

  const handleDeleteBusiness = () => {
    Alert.alert(
      "Confirm Delete",
      "Do you want to delete this business and add another?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const response = await fetch(`${API_BASE_URL}/updateBusinessStatus`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  Profession,
                  LocationID: locationId,
                  ChapterType: chapterType,
                  UserId: userId,
                }),
              });
              const data = await response.json();
              console.log("Data in insert the business status------------------------",data);
              if (response.ok) {
                Alert.alert("Success", "Business status updated successfully.");
                navigation.navigate('UpdateBusiness', {
                              chapterType: chapterType,
                              locationId: locationId,
                              Profession: Profession,
                            });
              } else {
                Alert.alert("Error", data.error || "Failed to update business status.");
              }
            } catch (error) {
              console.error("Error updating business status:", error);
              Alert.alert("Error", "An unexpected error occurred.");
            }
          },
        },
      ]
    );
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
      </View>
    );
  } 
  const handlePayment = () => {
    try {
      const paymentAmount = isOffMonth ? 1500 : 3000;
      const paymentUrl = `https://www.smartzensolutions.com/Payments/dataFrom.php?amount=${paymentAmount}&userid=${userId}`;
      
      // Log the URL for debugging purposes
      console.log('Payment URL:', paymentUrl);

      // Navigate to a WebView for payment processing
      navigation.navigate('PaymentWebview', { paymentUrl });
    } catch (error) {
      console.error('Error during payment initiation:', error);
      Alert.alert('Payment Error', 'An error occurred during the payment initiation. Please try again.');
    }
  };
  const handleContinue = () => {
    // Navigate to the Pay component
    navigation.navigate('Pay');
  };  

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
        Members are required to pay an annual subscription/registration/entry fee to be listed as chapter members for one year.
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
          1. Member’s name is removed from the chapter member list.
      2.Access to the bMW portal login is revoked.
          </Text>
          <Text style={styles.termsText}>
          After the grace period (if the category/slot is filled) :
          </Text>
          <Text style={styles.termsText1}>
          1. Former member cannot rejoin the same chapter.
      2.They can join another chapter if a category/slot is available.
          </Text>
      </View>
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

export default Subscription;