import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StyleSheet, View } from 'react-native';

const Stars = ({ averageRating }) => {
  const filledStars = Math.floor(averageRating);
  const decimalPart = averageRating % 1;
  const hasHalfStar = decimalPart >= 0.3 && decimalPart < 0.8;
  const hasAdditionalFullStar = decimalPart >= 0.8;
  const totalStars = 5;

  const stars = Array(filledStars).fill(0).map((_, index) => (
    <Icon key={index} name="star" size={22} color="#FFD700" style={styles.starIcon} />
  ));

  if (hasHalfStar) {
    stars.push(<Icon key="half" name="star-half-full" size={22} color="#FFD700" style={styles.starIcon} />);
  }

  if (hasAdditionalFullStar) {
    stars.push(<Icon key="full" name="star" size={22} color="#FFD700" style={styles.starIcon} />);
  }

  const remainingStars = totalStars - filledStars - (hasHalfStar ? 1 : 0) - (hasAdditionalFullStar ? 1 : 0);
  const unfilledStars = Array(remainingStars).fill(0).map((_, index) => (
    <Icon key={filledStars + index + (hasHalfStar ? 1 : 0) + (hasAdditionalFullStar ? 1 : 0)} name="star-o" size={22} color="#D3D3D3" style={styles.starIcon} />
  ));

  return (
    <View style={styles.starContainer}>
      {stars}
      {unfilledStars}
    </View>
  );
};

const styles = StyleSheet.create({
  starIcon: {
    marginHorizontal: 2,
  },
  starContainer: {
    flexDirection: 'row',
  },
});

export default Stars;
