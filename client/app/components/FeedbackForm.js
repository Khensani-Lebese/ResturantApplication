import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { submitReport } from '../services/api'; // Adjust the import path as necessary

const FeedbackForm = () => {
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(1);
  const [category, setCategory] = useState('other');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      Alert.alert("Error", "Please enter your feedback message.");
      return;
    }

    try {
      setIsSubmitting(true);
      await submitReport({ message, rating, category });
      Alert.alert("Success", "Your feedback has been submitted.");
      setMessage('');
      setRating(1);
      setCategory('other');
    } catch (error) {
      Alert.alert("Error", "Failed to submit feedback. Please try again later.");
      console.error('Feedback submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Submit Feedback</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Your feedback message..."
        value={message}
        onChangeText={setMessage}
        multiline
      />
      <Text style={styles.label}>Rating:</Text>
      <TextInput
        style={styles.textInput}
        placeholder="1-5"
        value={String(rating)}
        onChangeText={(text) => setRating(Number(text))}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Category:</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Category (e.g., app, restaurant, service)"
        value={category}
        onChangeText={setCategory}
      />
      <TouchableOpacity
        style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.submitButtonText}>Submit Feedback</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  submitButton: {
    backgroundColor: '#cc866f',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
});

export default FeedbackForm; 