import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  ScrollView,
  Platform,
  ImageBackground
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from './services/api';

export default function EditProfile() {
  const router = useRouter();
  const { userData } = useLocalSearchParams();
  const parsedUserData = JSON.parse(userData);
  
  const [editedName, setEditedName] = useState(parsedUserData.name);
  const [phoneNumber, setPhoneNumber] = useState(parsedUserData.phoneNumber || '');
  const [address, setAddress] = useState(parsedUserData.address || '');
  const [dietaryRestrictions, setDietaryRestrictions] = useState(
    parsedUserData.preferences?.dietaryRestrictions?.join(', ') || ''
  );
  const [favoritesCuisine, setFavoritesCuisine] = useState(
    parsedUserData.preferences?.favoritesCuisine?.join(', ') || ''
  );

  const handleUpdateProfile = async () => {
    try {
      const response = await api.put('/user/profile', {
        name: editedName,
        phoneNumber,
        address,
        preferences: {
          dietaryRestrictions: dietaryRestrictions.split(',').map(item => item.trim()),
          favoritesCuisine: favoritesCuisine.split(',').map(item => item.trim())
        }
      });
      Alert.alert('Success', 'Profile updated successfully');
      router.back();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <ImageBackground 
      source={{ uri: 'https://res.cloudinary.com/dmdmv15pl/image/upload/v1741251194/splash_1_v93eis.png' }} 
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Edit Profile</Text>
          </View>
          
          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor="#8e8e93"
                value={editedName}
                onChangeText={setEditedName}
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                placeholderTextColor="#8e8e93"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Address</Text>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                placeholder="Enter your address"
                placeholderTextColor="#8e8e93"
                value={address}
                onChangeText={setAddress}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Dietary Restrictions</Text>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                placeholder="Enter dietary restrictions (comma-separated)"
                placeholderTextColor="#8e8e93"
                value={dietaryRestrictions}
                onChangeText={setDietaryRestrictions}
                multiline
                numberOfLines={2}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Favorite Cuisines</Text>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                placeholder="Enter favorite cuisines (comma-separated)"
                placeholderTextColor="#8e8e93"
                value={favoritesCuisine}
                onChangeText={setFavoritesCuisine}
                multiline
                numberOfLines={2}
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={() => router.back()}
            >
              <Ionicons name="close-outline" size={20} color="#e4d4c6" />
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.saveButton]} 
              onPress={handleUpdateProfile}
            >
              <Ionicons name="save-outline" size={20} color="#e4d4c6" />
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: 'rgba(37, 34, 40, 0.8)',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e4d4c6',
    textAlign: 'center',
  },
  formSection: {
    backgroundColor: 'rgba(37, 34, 40, 0.8)',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#cc866f',
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'rgba(228, 212, 198, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(204, 134, 111, 0.3)',
    borderRadius: 8,
    padding: 12,
    color: '#e4d4c6',
    fontSize: 16,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 30,
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.8)',
  },
  saveButton: {
    backgroundColor: '#cc866f',
  },
  buttonText: {
    color: '#e4d4c6',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 