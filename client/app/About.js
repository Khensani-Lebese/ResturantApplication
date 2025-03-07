import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

export default function About() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>About Omakase</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Story</Text>
        <Text style={styles.text}>
          Omakase is your premier restaurant reservation platform, connecting food enthusiasts 
          with exceptional dining experiences. Founded in 2024, we've made it our mission to 
          revolutionize how people discover and book their perfect dining moments.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What We Offer</Text>
        <Text style={styles.text}>
          • Seamless restaurant reservations{'\n'}
          • Curated dining recommendations{'\n'}
          • Real-time availability updates{'\n'}
          • Special event bookings{'\n'}
          • Personalized dining preferences
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <Text style={styles.text}>
          Email: contact@omakase.com{'\n'}
          Phone: (555) 123-4567{'\n'}
          Address: 123 Foodie Street{'\n'}
          San Francisco, CA 94105
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
    color: '#3C3C43',
  },
}); 