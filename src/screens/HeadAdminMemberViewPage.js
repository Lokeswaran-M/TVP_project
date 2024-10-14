import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';


const { width, height } = Dimensions.get('window');

const HeadAdminMemberViewPage = () => {
  const user = {
    userId: '3242534654674',
    name: 'Chandru',
    profession: 'Digital Marketer',
    businessName: 'Try Out',
    description:
      "Unlock your brand's potential with targeted digital marketing strategies. At TRYOUT, we turn clicks into customers and enhance your online presence with precision.",
    performanceScore: {
      attendance: '★★★★★',
      oneMinPresentation: '★★★★★',
      oneOnOneMeeting: '★★★★★',
      businessReferral: '★★★★★',
      offeringbusiness: '★★★★★',
      externalbusiness: '★★★★★',
      overallRatings: '★★★★★',
    },
    address: 'No.3, SElliyamman kovil 5th street potheri, Chengalpattu',
  };

  const navigation = useNavigation();
  const [isPromoted, setIsPromoted] = useState(false);

  const renderStars = (score) => {
    return score.split('').map((star, index) => (
      <Text key={index} style={styles.star}>
        ★
      </Text>
    ));
  };

  const handleBack = () => {
    navigation.navigate('HeadAdminMembersPage');
  };

  const handleCall = () => {
    // Implement your calling logic here
  };

  const handleWhatsApp = () => {
    // Implement your WhatsApp logic here
  };

  const handlePromotionToggle = () => {
    setIsPromoted(!isPromoted);
    Alert.alert(isPromoted ? 'Demoted' : 'Promoted', `User has been ${isPromoted ? 'demoted' : 'promoted'} to admin.`);
  };

  return (
    <View style={styles.container}>
      {/* Top Navigation */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={handleBack} style={styles.backButtonContainer}>
          <Icon name="arrow-left" size={28} color="#A3238F" />
        </TouchableOpacity>
        <View style={styles.navTitleContainer}>
          <TouchableOpacity style={styles.buttonNavtop}>
            <View style={styles.topNavlogo}>
              <MaterialIcons name="group" size={28} color="#FFFFFF" />
            </View>
            <Text style={styles.NavbuttonText}>MEMBERS</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Profile Section */}
      <ScrollView contentContainerStyle={styles.profileContainer}>
        {/* Profile Picture and User Info */}
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: 'https://i.pinimg.com/736x/52/af/bf/52afbfeb6294f24e715a00367be3cdf3.jpg' }}
            style={styles.profilePic}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userId}>User ID: {user.userId}</Text>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.performanceScore}>
              {renderStars(user.performanceScore.externalbusiness)}
            </Text>
          </View>
        </View>

        {/* Profile Details */}
        <View style={styles.card}>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>User ID:</Text>
            <Text style={styles.value}>{user.userId}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{user.name}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Profession:</Text>
            <Text style={styles.value}>{user.profession}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Business Name:</Text>
            <Text style={styles.value}>{user.businessName}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Description:</Text>
            <Text style={styles.value}>{user.description}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Performance Score:</Text>
            <Text style={styles.value}>
              Attendance: {renderStars(user.performanceScore.attendance)} {'\n'}
              One-Min Presentation: {renderStars(user.performanceScore.oneMinPresentation)} {'\n'}
              One-On-One Meeting: {renderStars(user.performanceScore.oneOnOneMeeting)} {'\n'}
              Business Referral: {renderStars(user.performanceScore.businessReferral)} {'\n'}
              Offering Business: {renderStars(user.performanceScore.offeringbusiness)} {'\n'}
              External Business: {renderStars(user.performanceScore.externalbusiness)} {'\n'}
              <Text style={styles.overallRatings}>
                Overall Ratings: {renderStars(user.performanceScore.overallRatings)}
              </Text>
            </Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Business Address:</Text>
            <Text style={styles.value}>{user.address}</Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleCall}>
            <MaterialIcons name="call" size={20} color="#fff" />
            <Text style={styles.buttonText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleWhatsApp}>
            <Icon name="whatsapp" size={20} color="#fff" />
            <Text style={styles.buttonText}>WhatsApp</Text>
          </TouchableOpacity>
        </View>

        {/* Promote/Demote Button */}
        <TouchableOpacity style={styles.promoteButton} onPress={handlePromotionToggle}>
          <Icon name="paper-plane" size={20} color="#fff" />
          <Text style={styles.promoteButtonText}>{isPromoted ? 'Demote to User' : 'Promote to Admin'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// Responsive styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  topNav: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomEndRadius: 15,
    borderBottomStartRadius: 15,
    justifyContent: 'center',
  },
  backButtonContainer: {
    padding: 0,
    margin: 0,
    alignItems: 'flex-start',
  },
  navTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonNavtop: {
    borderRadius: 25,
    alignItems: 'center',
    borderColor: '#A3238F',
    borderWidth: 2,
    flexDirection: 'row',
    marginRight: 70,
    marginLeft: 50,
  },
  topNavlogo: {
    backgroundColor: '#A3238F',
    padding: 4,
    paddingRight: 5,
    paddingLeft: 5,
    borderRadius: 50,
    justifyContent: 'center',
  },
  NavbuttonText: {
    color: '#A3238F',
    fontSize: 15,
    fontWeight: 'bold',
    margin: 7,
    paddingHorizontal: 32,
  },

  // Profile Header
  profileContainer: {
    padding: 20,
    paddingTop: 10,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: '#A3238F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  userInfo: {
    flexDirection: 'column',
  },
  userId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#A3238F',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  performanceScore: {
    color: 'gold',
    fontSize: 18,
  },

  // Profile Details Card
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 80,
  },
  infoContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#A3238F',
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: '#555',
    flex: 2,
  },
  overallRatings: {
    color: '#A3238F',
    fontWeight: 'bold',
  },

  // Buttons
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A3238F',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  promoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7c1a7c',
    padding: 10,
    borderRadius: 15,
    width: '65%',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  promoteButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: 'bold',
  },

  star: {
    color: 'gold',
    fontSize: 20,
  },
});

export default HeadAdminMemberViewPage;


