import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

const ReservationCard = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.reservationItem} onPress={onPress}>
      <View style={styles.card}>
        <ImageBackground 
          source={{ uri: item.restaurant?.image || 'https://cdn.pixabay.com/photo/2024/09/29/17/02/soup-9083825_960_720.jpg' }} 
          style={styles.restaurantImage}
          defaultSource={{ uri: 'https://cdn.pixabay.com/photo/2024/09/29/17/02/soup-9083825_960_720.jpg' }}
        >
          <View style={styles.overlay}>
            <View style={styles.contentContainer}>
              <View style={styles.reservationHeader}>
                <Text style={[styles.restaurantName, styles.lightText]}>{item.restaurant?.name}</Text>
                <View style={[styles.statusBadge, 
                  { backgroundColor: item.status === 'confirmed' ? Colors.success : Colors.primary }]}>
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>

              <View style={styles.detailsContainer}>
                <Text style={[styles.detailText, styles.lightText]}>
                  {new Date(item.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Text>
                <Text style={[styles.detailText, styles.lightText]}>{item.timeSlot}</Text>
                <Text style={[styles.detailText, styles.lightText]}>
                  {item.guests} {item.guests === 1 ? 'Guest' : 'Guests'}
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  reservationItem: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  restaurantImage: {
    width: '100%',
    height: 200,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  contentContainer: {
    padding: 16,
  },
  reservationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  detailsContainer: {
    paddingTop: 16,
  },
  detailText: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
});

export default ReservationCard; 