import React from 'react';
import { View, StyleSheet, ScrollView, Text, ImageBackground, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ReservationForm from './components/ReservationForm';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createReservation } from './services/api';
import api from './services/api';

export default function ReservationScreen() {
  const { restaurantId, restaurantName, basePrice } = useLocalSearchParams();
  const router = useRouter();

  const handleReservation = async (reservationDetails) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        Alert.alert('Authentication Error', 'Please login again');
        return;
      }

      console.log('Sending reservation details:', reservationDetails);

      const response = await createReservation({
        ...reservationDetails,
        restaurantId,
        restaurantName,
        timeSlot: reservationDetails.time
      });

      console.log('Reservation response:', response);

      // Calculate total amount using the passed basePrice
      const totalAmount = reservationDetails.guests * basePrice;

      router.push({
        pathname: '/ReservationCost',
        params: {
          reservationId: response.reservation._id,
          amount: totalAmount,
          token: token,
          restaurantId: restaurantId,
          restaurantName: restaurantName,
          guests: reservationDetails.guests,
          date: reservationDetails.date,
          time: reservationDetails.time,
          basePrice: basePrice
        }
      });
    } catch (err) {
      console.error('Reservation error:', err);
      if (err.error === 'Invalid token') {
        Alert.alert(
          'Session Expired',
          'Please login again to continue'
        );
        router.push('/Login');
        return;
      }
      Alert.alert(
        'Reservation Failed',
        err.message || 'Failed to make a reservation'
      );
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://cdn.pixabay.com/photo/2024/09/29/17/02/rice-9083821_1280.jpg' }}
      style={styles.container}
    >
      <View style={styles.overlay}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Continue Reservation</Text>
            <Text style={styles.subtitle}>{restaurantName}</Text>
          </View>
          <View style={styles.formContainer}>
            <ReservationForm 
              onSubmit={handleReservation}
              restaurantName={restaurantName}
              restaurantId={restaurantId}
            />
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: 'rgba(0, 0, 0, 0)',

  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
  },
  subtitle: {
    fontSize: 20,
    color: '#cc866f',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
  },
  formContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
}); 