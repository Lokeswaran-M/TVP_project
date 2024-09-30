

import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Button, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
    const user = useSelector((state) => state.user);
  const navigation = useNavigation();
  return (
    <ScrollView style={styles.container}>
      {/* Banner Section */}
      <View style={styles.bannerContainer}>
        <Image 
          // source={require('./path-to-your-image.jpg')} // Replace with actual image
          style={styles.bannerImage}
        />
        <Text style={styles.bannerText}>EMPOWERING GLOBAL BUSINESS CONNECTIONS</Text>
      </View>

      {/* Upcoming Meetup Section */}
      <View style={styles.meetupContainer}>
        <Text style={styles.meetupTitle}>Upcoming Business Meetup</Text>
        <Text style={styles.meetupDetails}>07/09/2024 | 8:30am to 10:30am</Text>
        <Text style={styles.meetupLocation}>Upalakorn, Chennai</Text>
        <View style={styles.meetupButtons}>
          <TouchableOpacity style={styles.confirmButton}>
            <Text style={styles.buttonText}>Click to Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.declineButton}>
            <Text style={styles.buttonText}>Click to Decline</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Requirements Section */}
      <View style={styles.requirementsContainer}>
        <Text style={styles.sectionTitle}>Requirements</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add Requirement</Text>
        </TouchableOpacity>
        <View style={styles.requirementItem}>
          <Image source={{uri: 'https://example.com/avatar.jpg'}} style={styles.avatar} />
          <View>
            <Text style={styles.requirementName}>Chandru</Text>
            <Text style={styles.requirementDetails}>Description of the requirement goes here...</Text>
          </View>
          <TouchableOpacity style={styles.removeButton}>
            <Text style={styles.removeButtonText}>Acknowledge</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Reviews Section */}
      <View style={styles.reviewsContainer}>
        <Text style={styles.sectionTitle}>Reviews</Text>
        <TouchableOpacity style={styles.writeReviewButton}>
          <Text style={styles.writeReviewButtonText}>Write a Review</Text>
        </TouchableOpacity>
        <View style={styles.reviewItem}>
          <Image source={{uri: 'https://example.com/review-avatar.jpg'}} style={styles.avatar} />
          <View>
            <Text style={styles.reviewName}>Sathish</Text>
            <Text style={styles.rating}>Rating: ★★★★★</Text>
            <Text style={styles.reviewDetails}>Review details go here...</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bannerContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0eef9',
  },
  bannerImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  bannerText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  meetupContainer: {
    padding: 20,
    backgroundColor: '#f8f0fb',
    marginTop: 20,
    borderRadius: 10,
  },
  meetupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  meetupDetails: {
    marginTop: 5,
    fontSize: 14,
  },
  meetupLocation: {
    marginTop: 5,
    fontSize: 14,
    color: '#6c757d',
  },
  meetupButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  confirmButton: {
    backgroundColor: '#a3238f',
    padding: 10,
    borderRadius: 5,
  },
  declineButton: {
    backgroundColor: '#a3238f',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
  },
  requirementsContainer: {
    padding: 20,
    marginTop: 20,
    backgroundColor: '#fff0f6',
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  addButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#a3238f',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  requirementName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  requirementDetails: {
    fontSize: 12,
    color: '#6c757d',
  },
  removeButton: {
    backgroundColor: '#a3238f',
    padding: 5,
    borderRadius: 5,
    marginLeft: 'auto',
  },
  removeButtonText: {
    color: '#fff',
  },
  reviewsContainer: {
    padding: 20,
    marginTop: 20,
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
  },
  writeReviewButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#a3238f',
    padding: 10,
    borderRadius: 5,
  },
  writeReviewButtonText: {
    color: '#fff',
  },
  reviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
  },
  reviewName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  rating: {
    fontSize: 12,
    color: '#f1c40f',
  },
  reviewDetails: {
    fontSize: 12,
    color: '#6c757d',
  },
});

export default HomeScreen;











// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { useSelector } from 'react-redux';
// import { useNavigation } from '@react-navigation/native';
// const HomeScreen = () => {
//   const user = useSelector((state) => state.user);
//   const navigation = useNavigation();
  

//   return (
//     <View>
//       <Text style={styles.textBold}>ID {user?.userId}</Text>
//       <Text style={styles.textLargeBold}>Welcome, {user?.username}!</Text>
//       <Text style={styles.textNormal}>Profession: {user?.profession || 'Not provided'}</Text>
//     </View>
//   );
// };


// const styles = StyleSheet.create({
//   textBold: {
//     fontWeight: 'bold',
//     fontSize: 16, 
//   },
//   textLargeBold: {
//     fontWeight: 'bold',
//     fontSize: 24, 
//   },
//   textNormal: {
//     fontSize: 18,
//   },
// });
// export default HomeScreen;
// // export default HomeScreen;