import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function Terms() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Terms of Service</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.text}>
          By accessing and using the Omakase application, you agree to be bound by these 
          Terms of Service and all applicable laws and regulations.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Reservation Services</Text>
        <Text style={styles.text}>
          • Users must be 18 years or older to make reservations{'\n'}
          • Reservations are subject to restaurant availability{'\n'}
          • Cancellation policies vary by restaurant{'\n'}
          • Users are responsible for showing up for their reservations{'\n'}
          • No-show policies may apply as set by individual restaurants
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. User Responsibilities</Text>
        <Text style={styles.text}>
          Users agree to provide accurate information when making reservations and to 
          respect the restaurants' policies regarding cancellations, modifications, and 
          special requests.
        </Text>
      </View>
    </ScrollView>
  );
} 

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F2F2F7',
      padding: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#000000',
      marginTop: 20,
    },
    section: {
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      marginBottom: 16,
      color: '#1C1C1E',
    },
    text: {
      fontSize: 16,
      lineHeight: 24,
      color: '#3A3A3C',
    },
  });