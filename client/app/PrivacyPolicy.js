import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function PrivacyPolicy() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Privacy Policy</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Information We Collect</Text>
        <Text style={styles.text}>
          • Personal identification information{'\n'}
          • Contact information{'\n'}
          • Dining preferences and history{'\n'}
          • Device and usage information{'\n'}
          • Location data (with permission)
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How We Use Your Information</Text>
        <Text style={styles.text}>
          We use your information to:{'\n'}
          • Process your reservations{'\n'}
          • Improve our services{'\n'}
          • Send relevant notifications{'\n'}
          • Personalize your experience{'\n'}
          • Ensure secure transactions
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Protection</Text>
        <Text style={styles.text}>
          We implement various security measures to maintain the safety of your personal 
          information when you make reservations or enter, submit, or access your personal 
          information.
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