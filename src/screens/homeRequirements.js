import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../components/layout/HomeStyles';
import { useNavigation } from '@react-navigation/native';

const HomeRequirements = ({
  requirementsData,
  showAllRequirements,
  setShowAllRequirements,
  handleAcknowledgeClick,
  profileImages,
  requirementsError,
}) => {
  const navigation = useNavigation();

  if (requirementsError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Requirements Error: {requirementsError}</Text>
      </View>
    );
  }

  return (
    <View style={styles.cards}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerText}>Requirements</Text>
          <TouchableOpacity onPress={() => setShowAllRequirements(!showAllRequirements)}>
            <Icon name={showAllRequirements ? "angle-up" : "angle-down"} size={24} color="#a3238f" style={styles.arrowIcon} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('Requirements')}
        >
          <View style={styles.buttonContent}>
            <Icon name="plus-square-o" size={20} color="#fff" style={styles.iconStyle} />
            <Text style={styles.addButtonText}>Add Requirement</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.line}>____________________________</Text>
      </View>
      {requirementsData.length > 0 ? (
        <>
          {requirementsData.slice(0, showAllRequirements ? requirementsData.length : 1).map((requirement, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.profileSection}>
                <Image
                  source={{ uri: profileImages[requirement.UserId] || 'https://via.placeholder.com/50' }}
                  style={styles.profileImage}
                />
                <Text style={styles.profileName}>{requirement.Username}</Text>
              </View>
              <View style={styles.requirementSection}>
                <Text style={styles.requirementText}>{requirement.Description}</Text>
                <TouchableOpacity
                  style={[
                    styles.acknowledgeButton,
                    requirement.IsAcknowledged === 1 ? styles.disabledButton : null,
                  ]}
                  onPress={() => handleAcknowledgeClick(requirement)}
                  disabled={requirement.IsAcknowledged === 1}
                >
                  <Text style={styles.buttonText1}>
                    {requirement.IsAcknowledged === 1 ? "Acknowledged" : "Acknowledge"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </>
      ) : (
        <View style={styles.noMeetupCard}>
          <Text style={styles.noMeetupText}>No Requirements Available</Text>
        </View>
      )}
    </View>
  );
};

export default HomeRequirements;