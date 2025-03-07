import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import FeedbackForm from './components/FeedbackForm';

export default function Support() {
  const router = useRouter();

  const faqSections = [
    {
      title: "Reservations",
      questions: [
        {
          question: "How do I make a reservation?",
          answer: "To make a reservation, simply search for a restaurant, select your preferred date and time, and confirm your booking. You'll receive a confirmation email shortly after."
        },
        {
          question: "How do I cancel my reservation?",
          answer: "You can cancel your reservation through the 'My Bookings' section in the app. Please note that cancellation policies vary by restaurant."
        }
      ]
    },
    {
      title: "Common Issues",
      questions: [
        {
          question: "The app is not loading properly",
          answer: "Try closing and reopening the app. If the issue persists, check your internet connection or try updating the app."
        },
        {
          question: "I can't modify my reservation",
          answer: "Some restaurants don't allow modifications within 24 hours of the reservation. Contact the restaurant directly for last-minute changes."
        }
      ]
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Help Center</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Need Assistance?</Text>
        <TouchableOpacity 
          style={styles.supportButton}
          onPress={() => router.push('/ReportIssue')}
        >
          <Ionicons name="warning-outline" size={24} color="#cc866f" />
          <Text style={styles.supportButtonText}>Report an Issue</Text>
          <Ionicons name="chevron-forward" size={24} color="#C7C7CC" />
        </TouchableOpacity>
      </View>

      {faqSections.map((section, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.questions.map((item, itemIndex) => (
            <View key={itemIndex} style={styles.faqItem}>
              <Text style={styles.question}>{item.question}</Text>
              <Text style={styles.answer}>{item.answer}</Text>
            </View>
          ))}
        </View>
      ))}
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
  faqItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  question: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
  },
  answer: {
    fontSize: 16,
    lineHeight: 24,
    color: '#3A3A3C',
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 16,
  },
  supportButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    flex: 1,
    marginLeft: 12,
  },
}); 