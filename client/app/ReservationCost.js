import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, ImageBackground, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api from './services/api';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function ReservationCostScreen() {
  const { reservationId, amount, token, restaurantId, guests, date, time, basePrice } = useLocalSearchParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchRestaurantDetails();
  }, []);

  const fetchRestaurantDetails = async () => {
    try {
      const response = await api.get(`/restaurants/${restaurantId}`);
      setRestaurant(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch restaurant details');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
    router.push({
      pathname: '/Payment',
      params: { reservationId, amount, token }
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#cc866f" />
      </View>
    );
  }

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <ImageBackground 
      source={{ uri: 'https://images.pexels.com/photos/5086628/pexels-photo-5086628.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }} 
      style={styles.backgroundImage}
    >
      <ScrollView style={styles.container}>
        <View style={styles.headerCard}>
          <Text style={styles.headerTitle}>Reservation Summary</Text>
          <Text style={styles.headerSubtitle}>{restaurant?.name}</Text>
        </View>

        <View style={styles.mainCard}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="calendar-outline" size={24} color="#cc866f" />
              <Text style={styles.sectionTitle}>Date & Time</Text>
            </View>
            <Text style={styles.sectionContent}>{formattedDate}</Text>
            <Text style={styles.sectionContent}>{time}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="people-outline" size={24} color="#cc866f" />
              <Text style={styles.sectionTitle}>Party Details</Text>
            </View>
            <Text style={styles.sectionContent}>{guests} {parseInt(guests) === 1 ? 'Guest' : 'Guests'}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="restaurant-outline" size={24} color="#cc866f" />
              <Text style={styles.sectionTitle}>Restaurant Details</Text>
            </View>
            <Text style={styles.sectionContent}>{restaurant?.cuisine}</Text>
            <Text style={styles.sectionContent}>{restaurant?.location}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="card-outline" size={24} color="#cc866f" />
              <Text style={styles.sectionTitle}>Payment Details</Text>
            </View>
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Base Price per Guest</Text>
              <Text style={styles.costValue}>${basePrice}</Text>
            </View>
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Number of Guests</Text>
              <Text style={styles.costValue}>{guests}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalAmount}>${amount}</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Important Information</Text>
          <View style={styles.infoItem}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#cc866f" />
            <Text style={styles.infoText}>Reservation will be confirmed after payment</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={20} color="#cc866f" />
            <Text style={styles.infoText}>Cancellation available up to 24 hours before</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="alert-circle-outline" size={20} color="#cc866f" />
            <Text style={styles.infoText}>Please arrive 10 minutes before your reservation time</Text>
          </View>
        </View>

        <TouchableOpacity onPress={handlePayment} style={styles.paymentButton}>
          <LinearGradient
            colors={['#cc866f', '#a66451']}
            style={styles.gradient}
          >
            <Text style={styles.paymentButtonText}>Proceed to Payment</Text>
            <Ionicons name="arrow-forward" size={24} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#cc866f',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#666',
  },
  mainCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#cc866f',
    marginLeft: 8,
  },
  sectionContent: {
    fontSize: 16,
    color: '#444',
    marginLeft: 32,
    marginBottom: 4,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(204, 134, 111, 0.2)',
    marginVertical: 16,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 32,
    marginBottom: 8,
  },
  costLabel: {
    fontSize: 16,
    color: '#666',
  },
  costValue: {
    fontSize: 16,
    color: '#444',
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 32,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#cc866f',
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#cc866f',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  paymentButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
}); 