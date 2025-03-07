import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import api from './services/api';

export default function Security() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'All password fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters long');
      return;
    }

    try {
      await api.put('/auth/me/password', {
        currentPassword,
        newPassword
      });
      Alert.alert('Success', 'Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update password');
    }
  };

  const handleUpdateEmail = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      await api.put('/auth/me/email', {
        newEmail: newEmail.trim()
      });
      Alert.alert('Success', 'Email updated successfully');
      setNewEmail('');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to update email');
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      Alert.alert('Error', 'Please type DELETE to confirm account deletion');
      return;
    }

    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to permanently delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete('/auth/me');
              await api.logout();
              router.replace('/login');
            } catch (error) {
              Alert.alert('Error', error.response?.data?.error || 'Failed to delete account');
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Change Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Current Password"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <TouchableOpacity 
          style={[styles.button, styles.updateButton]} 
          onPress={handleUpdatePassword}
        >
          <Text style={styles.buttonText}>Update Password</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Change Email</Text>
        <TextInput
          style={styles.input}
          placeholder="New Email Address"
          value={newEmail}
          onChangeText={setNewEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TouchableOpacity 
          style={[styles.button, styles.updateButton]} 
          onPress={handleUpdateEmail}
        >
          <Text style={styles.buttonText}>Update Email</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delete Account</Text>
        <Text style={styles.warningText}>
          This action is permanent and cannot be undone. Type DELETE to confirm.
        </Text>
        <TextInput
          style={[styles.input, styles.deleteInput]}
          placeholder="Type DELETE to confirm"
          value={deleteConfirmation}
          onChangeText={setDeleteConfirmation}
        />
        <TouchableOpacity 
          style={[styles.button, styles.deleteButton]} 
          onPress={handleDeleteAccount}
        >
          <Text style={styles.buttonText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  section: {
    marginBottom: 30,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  deleteInput: {
    borderColor: '#ff6b6b',
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateButton: {
    backgroundColor: '#cc866f',
  },
  deleteButton: {
    backgroundColor: '#ff6b6b',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  warningText: {
    color: '#ff6b6b',
    marginBottom: 10,
    fontSize: 14,
  },
}); 