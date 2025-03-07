import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RestaurantHeader({ restaurant }) {
  return (
    <View style={styles.headerSection}>
      <Text style={styles.title}>{restaurant.name}</Text>
      <Text style={styles.cuisine}>{restaurant.cuisine}</Text>
      <View style={styles.ratingContainer}>
        <Ionicons name="star" size={20} color="#FFD700" />
        <Text style={styles.rating}>{restaurant.rating || 4.5}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#e4d4c6',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
  },
  cuisine: {
    fontSize: 18,
    color: '#e4d4c6',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    color: '#e4d4c6',
    marginLeft: 4,
    fontSize: 16,
  },
}); 