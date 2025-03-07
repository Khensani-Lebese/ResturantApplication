import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function QuickInfo({ restaurant, formatOpeningHours, getDayOfWeek }) {
  return (
    <View style={styles.quickInfoContainer}>
      <View style={styles.infoCard}>
        <Ionicons name="time-outline" size={24} color="#e4d4c6" />
        <Text style={styles.infoText}>
          Today: {formatOpeningHours(restaurant.openingHours?.[getDayOfWeek()])}
        </Text>
      </View>
      <View style={styles.infoCard}>
        <Ionicons name="people-outline" size={24} color="#e4d4c6" />
        <Text style={styles.infoText}>Max Group: {restaurant.maxGroupSize}</Text>
      </View>
      <View style={styles.infoCard}>
        <Ionicons name="cash-outline" size={24} color="#e4d4c6" />
        <Text style={styles.infoText}>From ${restaurant.pricing?.basePrice}/person</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  quickInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoCard: {
    flex: 1,
    backgroundColor: 'rgba(37, 34, 40, 0.9)',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  infoText: {
    color: '#e4d4c6',
    marginTop: 4,
    fontSize: 12,
    textAlign: 'center',
  },
}); 