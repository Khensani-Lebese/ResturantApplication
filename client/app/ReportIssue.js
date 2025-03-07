import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { submitReport } from './services/api';

export default function ReportIssue() {
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const issueTypes = [
    "Reservation Problem",
    "App Technical Issue",
    "Restaurant Complaint",
    "Account Issue",
    "Other"
  ];

  const handleSubmit = async () => {
    if (!issueType || !description.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      setIsSubmitting(true);
      await submitReport({
        issueType,
        description: description.trim()
      });

      Alert.alert(
        "Thank you",
        "Your issue has been reported. Our support team will review it shortly.",
        [{ 
          text: "OK",
          onPress: () => {
            setIssueType('');
            setDescription('');
          }
        }]
      );
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to submit report. Please try again later."
      );
      console.error('Report submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Report an Issue</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Issue Type</Text>
        {issueTypes.map((type, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.typeButton,
              issueType === type && styles.selectedType
            ]}
            onPress={() => setIssueType(type)}
            disabled={isSubmitting}
          >
            <Text style={[
              styles.typeButtonText,
              issueType === type && styles.selectedTypeText
            ]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <TextInput
          style={styles.textInput}
          multiline
          numberOfLines={6}
          placeholder="Please describe your issue in detail..."
          value={description}
          onChangeText={setDescription}
          textAlignVertical="top"
          editable={!isSubmitting}
        />
      </View>

      <TouchableOpacity 
        style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.submitButtonText}>Submit Report</Text>
        )}
      </TouchableOpacity>
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
  typeButton: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#F8F8F8',
  },
  selectedType: {
    backgroundColor: '#cc866f',
  },
  typeButtonText: {
    fontSize: 16,
    color: '#000000',
  },
  selectedTypeText: {
    color: '#FFFFFF',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 120,
  },
  submitButton: {
    backgroundColor: '#cc866f',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  }
}); 