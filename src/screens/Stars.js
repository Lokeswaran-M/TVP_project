import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StyleSheet } from 'react-native';

const Stars = ({ averageRating }) => {
  const filledStars = Math.round(averageRating);
  const hasHalfStar = averageRating % 1 >= 0.2 && averageRating % 1 < 0.8;
  const totalStars = 5;
  
  const stars = Array(filledStars).fill(0).map((_, index) => (
    <Icon key={index} name="star" size={22} color="#FFD700" style={styles.starIcon} />
  ));

  if (hasHalfStar) {
    stars.push(<Icon key="half" name="star-half-full" size={22} color="#FFD700" style={styles.starIcon} />);
  }

  const unfilledStars = Array(totalStars - filledStars - (hasHalfStar ? 1 : 0)).fill(0).map((_, index) => (
    <Icon key={filledStars + index + (hasHalfStar ? 1 : 0)} name="star-o" size={22} color="#D3D3D3" style={styles.starIcon} />
  ));

  if (averageRating === 0) {
    return Array(totalStars).fill(0).map((_, index) => (
      <Icon key={index} name="star-o" size={22} color="#D3D3D3" style={styles.starIcon} />
    ));
  }

  return [...stars, ...unfilledStars];
};

const styles = StyleSheet.create({
  starIcon: {
    marginHorizontal: 2,
  },
});

export default Stars;